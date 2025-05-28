import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { FaSave, FaEdit, FaSpinner } from "react-icons/fa";
import { BsArrowLeft } from "react-icons/bs";
import { RxDotsVertical } from "react-icons/rx";
import { BiEditAlt } from "react-icons/bi";
import Button from "@/components/ui/buttons/Button";

type BookmarkSidebarProps = {
  item: any | null;
  newTitle: string;
  setNewTitle: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
  saveTitle: (id: string) => Promise<void>;
};

const BookmarkSidebar: React.FC<BookmarkSidebarProps> = ({
  item,
  newTitle,
  setNewTitle,
  onClose,
  saveTitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(item?.title || "");
  const [isExiting, setIsExiting] = useState(false);

  const handleEditTitle = () => {
    setNewTitle(item?.title || "");
    setIsEditing(true)
  };

  // Handle saving the title
  const handleSaveTitle = async () => {
    if (!newTitle.trim()) {
      setError("Title cannot be empty.");
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      // Make API call to save the updated title
      await saveTitle(item.id);

      // Exit edit mode
      setIsEditing(false);
    } catch (err) {
      setError("Failed to save title. Please try again.");
      console.error("Error saving title:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const onChangeFn = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
    setTitle(e.target.value);
  };

  // Return null if no item is selected
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Black overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        aria-label="Close sidebar"
      ></div>

      {/* Sidebar content */}
      <div
        className={`fixed top-0 right-0 w-full md:w-1/3 h-full bg-white shadow-lg p-6 z-60 overflow-y-auto transition-transform duration-300 ease-in-out ${
          isExiting ? "sidebar-exit" : "sidebar-enter"
        }`}
      >      
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onClose}
          className="cursor-pointer p-1 rounded-full mb-4 hover:bg-gray-100"
          aria-label="Close"
        >
          <BsArrowLeft size={24}/>
        </button>

        <button
          // onClick={onClose}
          className="cursor-pointer p-2 rounded-full mb-4 hover:bg-gray-100"
          aria-label="menu"
        >
          <RxDotsVertical size={24}/>
        </button>

      </div>

      <div className="p-2">
        {/* Title Section */}
        <div className="flex items-center justify-between mb-6 ">
          {isEditing ? (
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                value={newTitle}
                onChange={onChangeFn}
                className="flex-1 text-[20px] py-2 px-3 border border-gray-200 rounded focus:outline-none focus:border-blue-500"
                placeholder="Edit title..."
                aria-label="Edit title"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveTitle();
                }}
              />
              <Button 
               label="Save"
               type="primaryBlack"
               loading={isSaving}
                onClick={handleSaveTitle}
              />
            </div>
          ) : (
            <>
              <h3 className="text-[20px] font-semibold text-gray-800">
                {title|| "No Title"}
              </h3>
              <button
                // onClick={() => setIsEditing(true)}
                onClick={handleEditTitle}
                className="p-2 rounded-full mb-4 hover:bg-gray-100"
                aria-label="Edit title"
              >
                <img src="/images/askPolly/edit.svg" alt="icon" />
              </button>
            </>
          )}
        </div>

        {/* Error Message */}
        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

        {/* Content Section */}
        <ReactMarkdown className="text-[16px] text-inherit mt-4">
          {item.text || "No Details"}
        </ReactMarkdown>
      </div>
      </div>
    </div>
  );
};

export default BookmarkSidebar;
