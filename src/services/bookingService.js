import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export const bookingService = {
  async createBooking(bookingData) {
    try {
      const docRef = await addDoc(collection(db, "bookings"), bookingData);
      return docRef.id;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  },

  async getBookingsByDate(date) {
    try {
      const q = query(collection(db, "bookings"), where("date", "==", date));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting bookings:", error);
      throw error;
    }
  },

  async deleteBooking(bookingId) {
    try {
      await deleteDoc(doc(db, "bookings", bookingId));
    } catch (error) {
      console.error("Error deleting booking:", error);
      throw error;
    }
  },

  async getAvailableTimes(date) {
    try {
      const q = query(
        collection(db, "availableTimes"),
        where("date", "==", date),
        where("isAvailable", "==", true)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => doc.data().time);
    } catch (error) {
      console.error("Error getting available times:", error);
      throw error;
    }
  },

  async markTimeAsBooked(date, time) {
    try {
      const q = query(
        collection(db, "availableTimes"),
        where("date", "==", date),
        where("time", "==", time)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          isAvailable: false,
        });
      } else {
        console.warn(
          `Available time not found for date: ${date}, time: ${time}`
        );
      }
    } catch (error) {
      console.error("Error marking time as booked:", error);
      throw error;
    }
  },

  async initializeAvailableTimes() {
    try {
      const checkQuery = await getDocs(collection(db, "availableTimes"));
      if (!checkQuery.empty) {
        console.log("Available times already initialized.");
        return;
      }

      const datesToInitialize = 15;
      let date = new Date();
      const initializedCount = 0;
      const formatter = new Intl.DateTimeFormat("fa-IR", {
        dateStyle: "short",
      });

      for (let i = 0; i < datesToInitialize; i++) {
        const dayOfWeek = date.getDay();

        if (dayOfWeek !== 5) {
          const persianDate = formatter.format(date);
          let times = [];

          if (dayOfWeek === 4) {
            times = ["14:00", "18:00"];
          } else {
            times = ["14:00", "16:00", "18:00"];
          }

          for (const time of times) {
            await addDoc(collection(db, "availableTimes"), {
              date: persianDate,
              time: time,
              isAvailable: true,
            });
          }
          console.log(
            `Initialized times for ${persianDate}: ${times.join(", ")}`
          );
        }
        date.setDate(date.getDate() + 1);
      }

      console.log("Available times initialization complete.");
      return true;
    } catch (error) {
      console.error("Error initializing available times:", error);
      throw error;
    }
  },
};
