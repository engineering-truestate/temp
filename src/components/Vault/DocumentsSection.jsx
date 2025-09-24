import React, { useState } from "react";
import Draganddrop from "../Drag-and-drop.jsx";
import DocumentItem from "./DocumentItem";
import { handleVaultDocumentUpload } from "../../../slices/apis/vault.js";
import { useToast } from "../../../hooks/useToast.jsx";

const DocumentsSection = ({ documents, setDocuments, formId, profile }) => {
  const [document, setDocument] = useState(null);
  const [loadingDocument, setLoadingDocument] = useState(false);
  const { addToast } = useToast();

  const handleUpload = async (doc) => {
    setLoadingDocument(true);
    const response = await handleVaultDocumentUpload(doc, formId, profile);
    
    if (response.success) {
      setDocument(null);
      setDocuments((prev) => [
        {
          name: doc?.name,
          downloadURL: response?.downloadURL,
          path: response?.path,
        },
        ...prev,
      ]);
      addToast("Success", "success", response.message);
    } else {
      addToast("Error", "error", response.message);
    }
    setLoadingDocument(false);
  };

  return (
    <div className="flex flex-col rounded mt-9 mb-9 lg:mt-12 lg:mb-12">
      <div>
        <h2 className="font-montserrat text-[1.375rem] font-bold text-[#0A0B0A] leading-[150%] mb-2 mt-4">
          Documents
        </h2>
        <Draganddrop
          file={document}
          setFile={setDocument}
          loadingDocument={loadingDocument}
          handleUpload={handleUpload}
        />
      </div>
      
      {documents && documents.length > 0 && (
        <div className="mt-4">
          {documents.map((doc, index) => (
            <DocumentItem
              key={index}
              doc={doc}
              index={index}
              documents={documents}
              setDocuments={setDocuments}
              profile={profile}
              formId={formId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentsSection;