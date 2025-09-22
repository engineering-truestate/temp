import React, { useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  startAt,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

const FileUpload = ({ file, setFile, loadingDocument ,  handleUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  // const [file, setFile] = useState(null);

  // Handler for dragging files over the box
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  // Handle file selection through input
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      handleUpload(selectedFile); // Trigger upload
    }
  };

  return (
    <div>
      <form
        className={`border-2 border-dashed border-gray-400 rounded-md p-6 min-w-full max-w-md mx-auto text-center ${
          dragActive ? "bg-gray-100" : ""
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {loadingDocument ? (
          <div className="flex justify-center">
            <svg
              className="animate-spin bg-[#BEE9E6] h-5 w-5 mr-3"
              viewBox="0 0 24 24"
            ></svg>
            <span>Uploading...</span>
          </div>
        ) : (
          <>
            <input
              type="file"
              className="hidden"
              id="file-upload"
              onChange={handleFileChange}
            />
            <span className="ml-2 font-lato text-[1rem] font-medium leading-[150%]">
              Drag and drop file here to upload or
            </span>{" "}
            <label htmlFor="file-upload" className="cursor-pointer">
              {file ? (
                <p>{file.name}</p>
              ) : (
                <span className="text-green-600 underline">select file</span>
              )}
            </label>
          </>
        )}
      </form>
    </div>
  );
};

export default FileUpload;
