import axios from "axios";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  runTransaction,
} from "firebase/firestore";
import { COLLECTIONS } from "../constants/collections";
import { getUnixDateTime } from "../components/helper/getUnixDateTime";

export const getUserDetails = async (phoneNumber, apiKeys) => {
  const { VITE_API_URL, VITE_CLIENT_ID, VITE_CLIENT_SECRET } = apiKeys;
  if (!VITE_API_URL || !VITE_CLIENT_ID || !VITE_CLIENT_SECRET) {
    return null;
  }

  const authHeader = "Basic " + btoa(`${VITE_CLIENT_ID}:${VITE_CLIENT_SECRET}`);
  const headers = {
    Authorization: authHeader,
    "Content-Type": "application/json",
  };
  const data = { phone: phoneNumber };

  try {
    const response = await fetch(VITE_API_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });
    const responseData = await response.json();

    if (response.status === 200 && responseData.phone_data) {
      const userData = responseData.phone_data;
      const workHistory =
        userData.linked_data?.account_details?.LINKEDIN?.work_history;
      const passYear =
        userData.primary_data?.account_details?.LINKEDIN?.education_details;

      const profile = {
        fullname:
          userData.linked_data?.account_details?.LINKEDIN?.display_name ||
          userData.primary_data?.account_details?.BANK_DETAILS?.name ||
          (userData.intelligence_data?.non_verified_names &&
          userData.intelligence_data?.non_verified_names?.length > 0
            ? userData.intelligence_data?.non_verified_names[0]
            : null),

        email:
          (userData.intelligence_data?.linked_ids &&
          userData.intelligence_data?.linked_ids.length > 0
            ? userData.intelligence_data?.linked_ids[0]
            : null) ||
          userData.linked_data?.account_details?.LINKEDIN?.email_id ||
          null,

        phoneNumber: phoneNumber,
        whatsapp: userData.primary_data?.account_details?.WHATSAPP?.user_exist,
        age:
          passYear && passYear.length > 0
            ? new Date().getFullYear() - passYear[0]?.end_date + 22
            : null,
        gender:
          userData.primary_data?.account_details?.UAN_DETAILS?.uan_details
            ?.basic_details?.gender || null,

        designation:
          userData.linked_data?.account_details?.LINKEDIN?.headline ||
          (workHistory && workHistory.length > 0
            ? workHistory[0]?.designation
            : null),

        employer:
          userData.linked_data?.account_details?.LINKEDIN?.company_name ||
          (workHistory && workHistory.length > 0
            ? workHistory[0]?.org_name
            : null),

        location:
          userData.linked_data?.account_details?.LINKEDIN?.location ||
          userData.primary_data?.account_details?.SKYPE?.city ||
          userData.primary_data?.account_details?.BANK_DETAILS?.city ||
          userData.primary_data?.phone_meta?.circle ||
          null,

        circle: userData.primary_data?.phone_meta?.circle || null,
      };

      return profile;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const checkUserExists = async ({ phoneNumber }) => {
  const usersRef = collection(db, COLLECTIONS.USERS);

  let _query = null;
  if (phoneNumber) {
    _query = query(usersRef, where("phoneNumber", "==", phoneNumber));
  }

  // Execute all queries and check if any documents are returned
  const result = await getDocs(_query);
  return !result.empty;
};

export const addUserToFirestore = async (userData) => {
  try {
    console.log("at the start");
    const usersRef = collection(db, COLLECTIONS.USERS);

    // 1) Check if user already exists by phoneNumber
    const q = query(usersRef, where("phoneNumber", "==", userData.phoneNumber));
    const qs = await getDocs(q);

    if (!qs.empty) {
      // Update existing, do NOT change the counter
      console.log("exists");
      const existingDoc = qs.docs[0];
      const existingRef = doc(db, COLLECTIONS.USERS, existingDoc.id);

      await updateDoc(existingRef, {
        ...userData,
        userId: existingDoc.id, // Add userId field to the document
        lastModified: getUnixDateTime(),
      });

      console.log("User updated:", existingDoc.id);
      return { status: "updated", id: existingDoc.id };
    }

    // 2) Create new user with sequential ID via transaction
    const adminRef = doc(db, "truestateAdmin", "lastLead");
    console.log("new user");
    const newUserId = await runTransaction(db, async (tx) => {
      const adminSnap = await tx.get(adminRef);

      const current = adminSnap.exists() ? adminSnap.data().count ?? 0 : 0;
      const next = current + 1; 
      const generatedId = `user${next}`;

      const newUserRef = doc(db, COLLECTIONS.USERS, generatedId);
      console.log("Generated new user ID:", generatedId);
      tx.set(newUserRef, {
        ...userData,
        userId: generatedId,
        added: userData.added ?? getUnixDateTime(),
        lastModified: getUnixDateTime(),
      });

      // Update the counter atomically
      tx.set(adminRef, { count: next }, { merge: true });
      
      return generatedId;
    });

    console.log("New user added:", newUserId);
    console.log("end");
    return { status: "created", id: newUserId };
  } catch (error) {
    console.error("Error adding/updating user to Firestore:", error);
    throw error;
  }
};