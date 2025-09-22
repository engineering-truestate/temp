import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  runTransaction,
  where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import {
  getUnixDateTime,
  getUnixDateTimeOneDayLater,
} from "../../components/helper/dateTimeHelpers";
import { db } from "../../firebase";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

export const getNextTaskId = async () => {
    const taskDoc = await getDoc(doc(db, 'truestateAdmin', 'lastTaskId'))
    if (taskDoc.exists()) {
        const data = taskDoc.data()
        const nextId = data.count + 1
        await updateDoc(doc(db, 'truestateAdmin', 'lastTaskId'), {
            count: nextId,
        })
        return `${data.label}${nextId.toString().padStart(3, '0')}`
    } else {
        throw new Error('No last task id found')
    }
}

export async function generateUnitId() {
    const counterRef = doc(db, 'truestateAdmin', 'lastUnit');
    console.log("Counter Reference:", counterRef);
    return runTransaction(db, async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        console.log("Counter Document:", counterDoc);
        let currentCount = 0;

        if (counterDoc.exists()) {
            console.log("Counter Document Data:", counterDoc.data());
            currentCount = counterDoc.data().count || 0;
        } else {
            transaction.set(counterRef, { count: 0 });
        }

        const newCount = currentCount + 1;
        const newUnitId = `UNIT${newCount.toString().padStart(3, '0')}`;
        console.log("New Unit ID:", newUnitId);

        transaction.update(counterRef, { count: newCount });

        return newUnitId;
    });
}


export const saveFormData = async (formData) => {
  try {
    if (!formData.userId) {
      throw new Error("userId is required in formData");
    }

    const { userId, ...restFormData } = formData;
    
    const userDocRef = doc(db, "truEstateUsers", userId);
    
    const userDocSnap = await getDoc(userDocRef);
    
    if (!userDocSnap.exists()) {
      throw new Error(`User document with ID ${userId} does not exist`);
    }

    const id = uuidv4();
    const unitId = await generateUnitId()
    console.log("Generated unitId:", unitId);
    console.log("User document reference:", restFormData);
    const unitData = {
      unitId,
      ...restFormData,
      //id: id,
      userId: userId,
      added: getUnixDateTime(),
      lastModified: getUnixDateTime(),
    };

    console.log("Appending unit data:", unitData);
    
    await updateDoc(userDocRef, {
      units: arrayUnion(unitData),
      vaultForms: arrayUnion(unitId)
    });
    
    console.log("Unit data saved successfully with ID:", id);
    return unitId;
    
  } catch (error) {
    console.error("Error saving form data:", error);
    throw new Error(`Error saving form data: ${error.message}`);
  }
};

// export const saveFormData = async (formData) => {
//   try {

//     if (!formData.userId) {
//       throw new Error("userId is required in formData");
//     }

//     const collectionRef = collection(db, "vaultForms");

//     // Fetch documents from the collection
//     const querySnapshot = await getDocs(collectionRef);

//     // Check if there are any documents
//     if (querySnapshot.empty) {
//       console.log("Collection is empty or does not exist.");
//     } else {
//       console.log("Collection exists and has documents.");
//     }

//     const id = uuidv4();

//     const docRef = doc(db, "vaultForms", id);
//     console.log("i am in saveformdata 1", docRef, id);
//     await setDoc(docRef, { ...formData, id: id });
//     console.log("i am in saveformdata", docRef, id);
//     //await addDoc(collection(db, "vaultForms"), formData);
//     return id;
//   } catch (error) {
//     console.error("error:", error);
//     throw new Error("Error updating", error);
//   }
// };

export const getVaultData = async (vaultFormIds, userDoc) => {
  try {
    // Filter valid formIds and limit to 30

    console.log("vaultFormIds and userDoc in getVaultData:", vaultFormIds, userDoc);
    console.log("userDoc.id in getVaultData:", userDoc?.userId);
    const userDocRef = doc(db, "truEstateUsers", userDoc.userId);
    if (!userDocRef) {
      throw new Error("User document reference is required");
    }
    const userDocSnap = await getDoc(userDocRef);
    console.log(userDocSnap, 'userDocSnap');
    if (!userDocSnap.exists() || !userDocSnap.data().units) {
      return [];
    }

    const formIds = userDocSnap.data().vaultForms || []

    //const formIds = vaultFormIds.filter((id) => id).slice(0, 30);
    
    console.log(formIds, userDoc, 'formIds and userDoc');
    if (!formIds.length || !userDoc?.units) {
      return [];
    }
    const userUnits = userDocSnap.data().units;

    let formsData = userUnits.filter(unit => 
      formIds.includes(unit.unitId)
    ).map((unit) => ({
      ...unit,
      id: unit.unitId, // Set id as unitId to match old structure
    }));

    if (!formsData.length) {
      return [];
    }

    let promises = formsData.map((each) => {
      const docRef = doc(db, "restackPrelaunchProperties", each.projectId);
      if (docRef) return getDoc(docRef);
      return null;
    });

    promises = promises.filter((promise) => promise);

    const allProjectsDocSnapshots = await Promise.all(promises);
    const projectsData = allProjectsDocSnapshots.map((projectDoc) =>
      projectDoc.exists() ? projectDoc.data() : {}
    );

    var finalCombinedData = formsData.map((each, index) => {
      // Add dummy truestimatedFullPrice if missing (for testing)
      const truestimatedFullPrice = each.truestimatedFullPrice

      return {
        ...each,
        yearOfPurchase: parseInt(each.yearOfPurchase),
        truestimatedFullPrice: truestimatedFullPrice,
        ...projectsData[index],
      };
    });

    // Sort by truestimatedFullPrice (existing logic)
    finalCombinedData = finalCombinedData.map((obj) => {
      const sortedKeys = Object.keys(obj).sort((a, b) => {
        if (a === "truestimatedFullPrice") return -1; // Keep `truestimatedFullPrice` first
        if (b === "truestimatedFullPrice") return 1;
        return a.localeCompare(b); // Alphabetical order for others
      });
      
      const sortedObj = {};
      sortedKeys.forEach((key) => {
        sortedObj[key] = obj[key];
      });
      return sortedObj;
    });

    return finalCombinedData;

  } catch (error) {
    console.error("Error in getVaultData:", error);
    return [];
  }
};

// export const getVaultData = async (vaultForm) => {
//   try {
//     let formIds = vaultForm.map((vault) => vault.id);
//     formIds = formIds.filter((id) => id).slice(0, 30);
//     let collectionRef = collection(db, "vaultForms");
//     let q = query(collectionRef, where("id", "in", formIds));
//     const docSnapShot = await getDocs(q);
//     let formsData = docSnapShot.docs.map((doc) => ({
//       ...doc.data(),
//       id: doc.id,
//     }));

//     let promises = formsData.map((each) => {
//       const docRef = doc(db, "new_projects", each.projectId);
//       if (docRef) return getDoc(docRef);
//       return null;
//     });

//     promises = promises.filter((promise) => promise);

//     const allProjectsDocSnapshots = await Promise.all(promises);
//     const projectsData = allProjectsDocSnapshots.map((projectDoc) =>
//       projectDoc.data()
//     );

//     var finalCombinedData = formsData.map((each, index) => ({
//       ...each,
//       ...projectsData[index],
//     }));

//     // console.log(finalCombinedData);

//     // Step 1: Sort objects by the presence of `truestimatedFullPrice`
//     finalCombinedData.sort((a, b) => {
//       const hasAValue =
//         "truestimatedFullPrice" in a && !isNaN(a.truestimatedFullPrice);
//       const hasBValue =
//         "truestimatedFullPrice" in b && !isNaN(b.truestimatedFullPrice);

//       // Priority 1: Objects with valid `truestimatedFullPrice` first
//       if (hasAValue && !hasBValue) {
//         return -1;
//       }
//       if (!hasAValue && hasBValue) {
//         return 1;
//       }

//       // Priority 2: Among valid values, sort by `truestimatedFullPrice` ascending
//       if (hasAValue && hasBValue) {
//         return a.truestimatedFullPrice - b.truestimatedFullPrice;
//       }

//       // Priority 3: Objects without valid `truestimatedFullPrice` are already at the end, maintain order
//       return 0;
//     });
//     // Step 2: Sort the keys of each object
//     finalCombinedData = finalCombinedData.map((obj) => {
//       const sortedKeys = Object.keys(obj).sort((a, b) => {
//         if (a === "truestimatedFullPrice") return -1; // Keep `truestimatedFullPrice` first
//         if (b === "truestimatedFullPrice") return 1;
//         return a.localeCompare(b); // Alphabetical order for others
//       });
//       const sortedObj = {};
//       sortedKeys.forEach((key) => {
//         sortedObj[key] = obj[key];
//       });
//       return sortedObj;
//     });

//     // Step 3: Log the result
//     // console.log(finalCombinedData);

//     return finalCombinedData;
//   } catch (error) {}
// };

export const getVaultDataByFormId = async (formId) => {
  try {

     if (!formId) {
      throw new Error("FormId is required");
    }

    const usersCollectionRef = collection(db, "truEstateUsers");
    const usersSnapshot = await getDocs(usersCollectionRef);

    let matchingUnit = null;
    let foundUserId = null;

    // Search through all users' units to find the matching unitId
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      if (userData.units && userData.units.length > 0) {
        const unit = userData.units.find(unit => unit.unitId === formId);
        if (unit) {
          matchingUnit = unit;
          foundUserId = userDoc.id;
          break;
        }
      }
    }

    if (!matchingUnit) {
      throw new Error("Property not found");
    }

    let projectData = {};
    if (matchingUnit.projectId) {
      try {
        const projectDocRef = doc(db, "restackPrelaunchProperties", matchingUnit.projectId);
        const projectDocSnap = await getDoc(projectDocRef);
        
        if (projectDocSnap.exists()) {
          projectData = projectDocSnap.data();
        }
      } catch (projectError) {
        console.log("Project data not found, using defaults");
      }
    }

    const truestimatedFullPrice = matchingUnit.truestimatedFullPrice || 
      projectData.truestimatedFullPrice || 
      (Math.floor(Math.random() * 200000000) + 50000000);

    let formData = {
      ...matchingUnit,
      id: matchingUnit.unitId,
    };

    const finalCombinedData = {
      ...formData,
      ...projectData,
    };
    return { success: true, finalCombinedData };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getAllProjects = async () => {
  try {
    const vaultRef = collection(db, "restackVault");
    const q = query(vaultRef);
    const snap = await getDocs(q);

    const data = snap.docs
      .map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      .filter(
        (doc) =>
          !(
            doc.source === "restackStock" &&
            doc.stockType === "postRera"
          )
      );

    return data;
  } catch (error) {
    console.error("Error fetching from restackVault:", error);
    return [];
  }
};



export const raiseRequest = async (
  requestType,
  selectedProperty,
  userPhoneNumber
) => {
  try {
    // Map service titles to task names
    const serviceToTaskMapping = {
      "Khata Transfer": "khata-transfer",
      "Sell Property": "sell-property", 
      "Title Clearance": "title-clearance",
      "Electricity Bill Transfer": "electricity-bill",
      "Find Tenant": "find-tenant",
      "Collect Rent": "rent-collection"
    };

    // Generate task ID
    const tasksCollectionRef = collection(db, "truEstateTasks");
    const tasksSnapshot = await getDocs(tasksCollectionRef);
    const taskCount = tasksSnapshot.size || 0;

    let nextTaskId = await getNextTaskId();

    if (!nextTaskId) {
      throw new Error("Failed to generate task ID");
    }

    // Find user document
    const usersCollectionRef = collection(db, "truEstateUsers");
    const q = query(
      usersCollectionRef,
      where("phoneNumber", "==", userPhoneNumber)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      throw new Error("User not found");
    }

    const userDoc = querySnapshot.docs[0];
    const userId = userDoc.id;
    const userData = userDoc.data();   
    const userName = userData.name;

    // Create task object
    console.log("taskId********", nextTaskId);
    console.log("user********", userId);
    const task = {
      taskId: nextTaskId,
      projectName: selectedProperty.projectName,
      actionType: "call",
      agentId: "TRUES03",
      agentName: userName,
      //formType: "Not Discussed",
      createdTimestamp: getUnixDateTime(),
      schedule: getUnixDateTimeOneDayLater(),
      status: "pending",
      taskType: "vault-service",
      propertyType: "preLaunch",
      taskName: serviceToTaskMapping[requestType] || requestType.toLowerCase().replace(/\s+/g, '-'),
      userId: userId,
      userPhoneNumber: userPhoneNumber,
      projectId: selectedProperty.projectId
    };

    // Save task to truEstateTasks collection
    const taskRef = doc(db, "truEstateTasks", nextTaskId);
    await setDoc(taskRef, task);

    return { success: true, message: "Request raised successfully" };
  } catch (error) {
    console.error("Error in raiseRequest:", error);
    return { success: false, message: error.message };
  }
};

export const handleVaultDocumentUpload = async (document, formId,profile) => {
  try {
    const storage = getStorage();

    if (!document) throw new Error("Please upload document");

    // Check if the document is valid and not empty
    if (document) {
      // Size limit check (5 MB = 5 * 1024 * 1024 bytes)
      const sizeLimit = 5 * 1024 * 1024;
      if (document.size > sizeLimit) {
        throw new Error(
          "File size exceeds the 5 MB limit. Please upload a smaller file."
        );
      }

      // Proceed with upload if the file size is within limit
      const savedFileName = `${Date.now()}-${document.name}`;
      console.log("Hare Krishna",profile)
      const path = `truestate-user-documents/${profile.id}/${savedFileName}`;
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, document);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          {
          }
        }
      );

      await uploadTask;

      const downloadURL = await getDownloadURL(storageRef);

      const newDocument = {
        name: document.name,
        downloadURL,
        path: storageRef.fullPath,
      };

      const userRef = doc(db, "truEstateUsers", profile.id);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error("User not found");
      }

      const userData = userSnap.data();
      const updatedUnits = userData.units.map((unit) => {
      if (unit.unitId === formId) {
        return {
          ...unit,
          documents: [...(unit.documents || []), newDocument], 
        };
      }
      return unit;
      });

      await updateDoc(userRef, { units: updatedUnits });
      return {
        success: true,
        message: "Document uploaded successfully",
        downloadURL,
        path,
      };
    } else throw new Error("Please upload document");
  } catch (error) {
    return { success: false, message: error.message };
  }
};
