// import { doc, setDoc, collection } from "firebase/firestore";
// import { Userdb1 } from "../firebase";
// const userMapping = (data) => ({
//   Activity: data.Activity || [],  // Default to empty array if not provided
//   address: data.address || "",  // Default to empty string
//   agentId: data.agentId || "",  // Default agent ID
//   agentName: data.agentName || data.name || "",  // Use name as fallback if agentName is missing
//   alternateNumber: data.alternateNumber || "",
//   auctionTriggerPassword: data.auctionTriggerPassword || "fafdada",  // Static password
//   auctionTriggerUsername: data.auctionTriggerUsername || "deepakgoyal",  // Static username
//   aumForTe: data.aumForTe || 3751,  // Default AUM value
//   cashBack: data.cashBack || 0,
//   componentB: data.componentB || 0,
//   componentW: data.componentW || 0,
//   creditScore: data.creditScore || 0,
//   eAuctionPassword: data.eAuctionPassword || "",
//   eAuctionUsername: data.eAuctionUsername || "",
//   experience: data.experience || 0,
//   fDBonus: data.fDBonus || 0,
//   goal: data.goal || "",
//   gold: data.gold || 0,
//   inPersonMarketing: data.inPersonMarketing || 0,
//   invoiceRaised: data.invoiceRaised || "",
//   kpppPassword: data.kpppPassword || "",
//   kpppUsername: data.kpppUsername || "",
//   lastModified: data.lastModified || getUnixDateTime(),  // Current timestamp if missing
//   linkedinProfile: data.linkedinProfile || "",
//   mail: data.mail || "",
//   management: data.management || "",
//   name: data.name || "",  // Default to empty string if name is missing
//   netWorth: data.netWorth || 0,
//   notes: data.notes || [],  // Default to empty array if notes are missing
//   pastAgents: data.pastAgents || [],  // Default to empty array if no past agents
//   phoneNumber: ${data.selectedCountryCode.value}${data.phoneNumber} || "",  // Full phone number
//   productType: data.productType || ["auction"],  // Default to auction if missing
//   properties: data.properties || [],  // Default to empty array if properties are missing
//   preLaunch: data.preLaunch || [],  // Default to empty array if preLaunch is missing
//   propertyName: data.propertyName || "",
//   realEstate: data.realEstate || 0,
//   reasonForJoining: data.reasonForJoining || "",
//   referrels: data.referrels || [],
//   requirements: data.requirements || [],
//   whatsappGroup: data.whatsappGroup || "",
// });

// // Function to push data to Firestore using the mapping
// const pushUserDataToFirestore = async (data) => {
//   // Use the mapping to structure the data
//   const mappedData = userMapping(data);

//   try {
//     // Create a new document reference in Firestore for truEstateUsers collection
//     const userRef = doc(collection(Userdb1, "truEstateUsers"));

//     // Store the mapped data in Firestore
//     await setDoc(userRef, mappedData);
//     console.log("User data successfully added to Firestore.");
//   } catch (error) {
//     console.error("Error adding user data to Firestore:", error);
//   }
// };
// export { pushUserDataToFirestore };
