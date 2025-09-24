import React, { useState } from "react";
import { getStorage, deleteObject, ref } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase.js";
import downloadsvg from "/assets/icons/actions/btn-download.svg";
import trashes from "/assets/icons/actions/btn-delete.svg";
import ConfirmationModal from "../ConfirmationModal.jsx";
import { toCapitalizedWords } from "../../../utils/common.js";
import { useToast } from "../../../hooks/useToast.jsx";

const DocumentItem = ({ doc, index, documents, setDocuments, profile, formId }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { addToast } = useToast();

  const handleDelete = async () => {
    try {
      setDeleting(true);

      // Delete from Firebase Storage
      const storage = getStorage();
      const fileRef = ref(storage, doc.path);
      await deleteObject(fileRef);

      // Delete from Firestore
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
            documents: (unit.documents || []).filter((d) => d.path !== doc.path),
          };
        }
        return unit;
      });

      await updateDoc(userRef, { units: updatedUnits });

      // Update local state
      setDocuments((prev) => prev.filter((_, i) => i !== index));

      addToast("Success", "success", "File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
      addToast("Error", "error", "Failed to delete file");
    } finally {
      setShowDeleteModal(false);
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="w-full text-left py-4 px-4 border mt-4 rounded hover:bg-gray-100 flex justify-between items-center">
        <div className="flex">
          <p className="font-lato text-[0.875rem] font-medium text-[#0A0B0A] min-w-[300px] md:w-full">
            {toCapitalizedWords(doc?.name)}
          </p>
        </div>
        <div className="flex gap-4">
          <img
            onClick={() => window.open(doc?.downloadURL)}
            src={downloadsvg}
            alt="Download"
            className="cursor-pointer"
          />
          <img
            onClick={() => setShowDeleteModal(true)}
            src={trashes}
            alt="Delete"
            className="cursor-pointer"
          />
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete this file?"
        message="This file will be permanently deleted."
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isLoading={deleting}
      />
    </>
  );
};

export default DocumentItem;