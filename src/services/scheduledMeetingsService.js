import {
  getDocs,
  query,
  where,
  collection,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import { COLLECTIONS } from "../constants/collections";

export const scheduledMeetingsService = {

  async getTotalScheduledMeetings(phoneNumber) {
    try {
      const userQuery = query(
        collection(db, COLLECTIONS.USERS),
        where("phoneNumber", "==", phoneNumber)
      );
      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.empty) {
        throw new Error("User not found");
      }

      const userId = userSnapshot.docs[0].id;

      const tasksQuery = query(
        collection(db, COLLECTIONS.TASKS),
        where("userId", "==", userId),
        where("actionType", "==", "meeting"),
        orderBy("schedule", "asc")
      );

      const tasksSnapshot = await getDocs(tasksQuery);
      const meetings = tasksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return meetings;
    } catch (error) {
      console.error("Error fetching total scheduled meetings:", error);
      throw error;
    }
  },


  async getMeetingsForProperty(phoneNumber, propertyId) {
    try {
      const allMeetings = await this.getTotalScheduledMeetings(phoneNumber);

      return allMeetings.filter(meeting =>
        meeting.propertyId === propertyId ||
        meeting.objectID === propertyId ||
        meeting.projectId === propertyId
      );
    } catch (error) {
      console.error("Error fetching meetings for property:", error);
      throw error;
    }
  },


  async getPropertyMeetings(phoneNumber) {
    try {
      const allMeetings = await this.getTotalScheduledMeetings(phoneNumber);

      const propertyTaskTypes = [
        "Site Visit",
        "EOI Collection",
        "Token Amount",
        "Booking"
      ];

      return allMeetings.filter(meeting =>
        propertyTaskTypes.includes(meeting.taskName)
      );
    } catch (error) {
      console.error("Error fetching property meetings:", error);
      throw error;
    }
  }
};

export default scheduledMeetingsService;