"use client";

import {
  deleteFile,
  FileMetadata,
  updateFileMetadata,
  uploadFile,
  uploadToPinecone,
} from "@/app/api/ask polly/polly";
import Button from "@/components/ui/buttons/Button";
import Text from "@/components/ui/Texts/Text";
import React, { useEffect, useState } from "react";
import { FaDownload, FaTrash } from "react-icons/fa";
import Select from "react-select";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import { useToast } from "@/app/component/ToasterProvider";

type FileOption = {
  value: string;
  label: string;
};

interface SideBarProps {
  file: FileMetadata;
  onClose: () => void;
  onFileUpdate: () => void;
  pollId: string;
}

const SideBar: React.FC<SideBarProps> = ({
  file,
  onClose,
  onFileUpdate,
  pollId,
}) => {
  const [isBtnDisabled, setIsBtnDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState<FileOption>({
    value: file.id, 
    label: file.category || "Core Analysis",
  });
  const [documentTitle, setDocumentTitle] = useState<string>(file.title || "");
  const [summary, setSummary] = useState<string>("");
  const [context, setContext] = useState<string>("");
  const { showToast } = useToast();

  useEffect(() => {
    setDocumentTitle(file.title || "");
    setKnowledgeBase(pre => ({...pre, value: file.id, label: file.category}))
  }, [file]);

  const fileDownloadFunction = async () => {
    try {
      const response = await fetch(`/api/download/${file.id}`);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const deleteFileFunction = async () => {
    setIsLoading(true);
    try {
      await deleteFile(file.id);
      await onFileUpdate();
      onClose();
      showToast({ type: "info", message: "File deleted successfully!" });
    } catch (error) {
      showToast({ type: "error", message: "Error while deleting!" });
      console.error("Delete error:", error);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false); 
    }
  };

  const handleDeleteClick = () => {
    setIsModalOpen(true); // Open the confirmation modal
  };
  
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("JWT Token not found");
  
      // Update file metadata using the new API
      await updateFileMetadata(
        file.id,
        documentTitle,
        knowledgeBase.value,
        pollId
      );
  
      // Trigger file update callback
      await onFileUpdate();
      onClose();
      
    } catch (error: any) {
      console.error("Save failed:", error.message || error);
      // You could add error notification here
    } finally {
      setIsLoading(false);
    }
  };

  const options: FileOption[] = [
    { value: "Core Analysis", label: "Core Analysis" },
    { value: "Context", label: "Context" },
    { value: "Reference", label: "Reference" },
  ];

  useEffect(() => {
    if (documentTitle || summary) {
      setIsBtnDisabled(false);
    } else {
      setIsBtnDisabled(true);
    }
  }, [documentTitle, summary]);

  return (
    <div className="w-4/12 min-w-80 max-w-96 border-l border-gray-200 p-4 h-auto bg-white flex flex-col">
      <div className="flex justify-between items-center border-b py-3 gap-1">
        <Text variant="body15R" extraCSS="text-textGray text-[15px]">
          {file.file_name} | {file.pages} {file.pages === 1 ? "page" : "pages"}
        </Text>
        <div className="flex gap-3">
          <button
            disabled={isLoading}
            className={`text-primaryBlue ${
              isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-80"
            }`}
            onClick={fileDownloadFunction}
          >
            <FaDownload />
          </button>
          <button
            disabled={isLoading}
            className={`text-primaryRed ${
              isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-80"
            }`}
            onClick={handleDeleteClick}
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <div className="flex gap-2 items-center justify-between border-b py-3">
        <Text variant="body15R">Knowledge Base</Text>
        <div className="text-sm">
          <Select
            isDisabled={isLoading}
            value={knowledgeBase}
            onChange={(option) => setKnowledgeBase(option as FileOption)}
            options={options}
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                borderColor: "transparent",
                borderStyle: "none",
              }),
              singleValue: (baseStyles) => ({
                ...baseStyles,
                color: "#2b6ce1",
              }),
              dropdownIndicator: (baseStyles) => ({
                ...baseStyles,
                color: "#2b6ce1",
              }),
            }}
          />
        </div>
      </div>

      <div className="py-3">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-primaryBlue focus:border-transparent"
          placeholder="Document title"
          value={documentTitle}
          onChange={(e) => setDocumentTitle(e.target.value)}
          disabled={isLoading}
        />

        <textarea
          className="w-full p-2 border border-gray-300 rounded-md h-20 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-primaryBlue focus:border-transparent"
          placeholder="Short description / summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          disabled={isLoading}
        />

        <textarea
          className="w-full p-2 border border-gray-300 rounded-md h-20 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-primaryBlue focus:border-transparent"
          placeholder="How to interpret this file? When to use it? Examples of questions, etc."
          value={context}
          onChange={(e) => setContext(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="p-2 mt-auto">
        <Button
          label={isLoading ? "Updating..." : "Update"}
          type="primaryBlack"
          iconSrc="/images/askPolly/tickWhite.svg"
          iconHoverSrc="/images/askPolly/tickBlack.svg"
          customCss="ml-auto"
          disabled={isBtnDisabled || isLoading}
          onClick={handleSave}
        />
      </div>
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onDelete={deleteFileFunction}
        isDeleting={isLoading}
      />
    </div>
  );
};

export default SideBar;
