"use client";

import React, { useState, useRef, useEffect } from "react";
import SideBar from "./SideBar";
import { FileMetadata, getFiles, uploadFile } from "@/app/api/ask polly/polly";
import FilesLoading from "@/app/component/loading/FilesLoading";
import { useParams } from 'next/navigation';

interface FilesProps {
  pollId: string;
}

const Files: React.FC<FilesProps> = ({ pollId }) => {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (pollId) {
      fetchFiles();
    }
  }, [pollId]);

  const fetchFiles = async () => {
    setIsFileLoading(true);
    setError(null);
    try {
      const fetchedFiles = await getFiles(undefined, pollId);
      setFiles(fetchedFiles);
    } catch (err) {
      setError("Failed to fetch files");
      console.error(err);
    } finally {
      setIsFileLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles && uploadedFiles[0]) {
      setIsLoading(true);
      setError(null);
      try {
        const file = uploadedFiles[0];
        // console.log("file", file);
        // console.log("file name", file.name);
        // console.log("pollId", pollId);
        //azure blob
        await uploadFile(file, file.name, "analysis", pollId);
        await fetchFiles();
      } catch (err) {
        setError("Failed to upload file");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRowClick = (file: FileMetadata) => {
    if (selectedFile?.id === file.id) {
      setSelectedFile(null); // Collapse the sidebar if the same row is clicked
    } else {
      setSelectedFile(file); // Open the sidebar for the clicked row
    }
  };
  
  return (
    <div className="flex bg-gray-50 flex-1">
      <div className="relative no-scrollbar overflow-y-scroll w-full flex items-start justify-center h-auto p-3">
        <div className="absolute rounded-2xl mt-16 bg-white p-10 w-[80%] shadow-md">
          <h2 className="text-xl font-semibold mb-4">Files</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-5 items-end mb-6 flex-wrap">
            <div
              className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 w-[350px] bg-white ${
                isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => !isLoading && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
                disabled={isLoading}
              />
              <div className="text-center flex flex-col items-center justify-center gap-2">
                <img src="/images/workspace/uploadGray.svg" alt="icon" />
                <p className="text-sm text-gray-500">
                  {isLoading ? (
                    "Uploading..."
                  ) : (
                    <>
                      Upload a{" "}
                      <span className="text-blue-600 cursor-pointer">file</span>{" "}
                      or drag and drop
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="flex flex-col max-w-[350px]">
              <p className="text-xs text-gray-400">
                Supported file types: .png, .jpeg, .jpg, .tiff, .tif, .pdf,
                .xls, .xlsx, .doc, .docx, .pptx, .csv, .html, .mhtml, .txt
              </p>
              <p className="text-xs text-gray-400">Maximum file size: 10 MB</p>
            </div>
          </div>
          {isFileLoading ? (
            <FilesLoading />
          ) : files.length === 0 ? (
            <div className="mb-4 p-4 bg-gray-300 text-center text-gray-800 rounded">
              No files available
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="min-w-full bg-white rounded-lg shadow-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                      TITLE
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                      FILE NAME
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                      CATEGORY
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                      PAGES
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                      UPLOADED
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr
                      key={file.id}
                      className={`border-b last:border-b-0 cursor-pointer transition-all hover:bg-blue-200 ${
                        selectedFile?.id === file.id && "bg-primaryBlue hover:bg-primaryBlue"
                      }`}
                      onClick={() => handleRowClick(file)}
                    >
                      <td
                        className={`py-3 px-4 text-sm truncate max-w-sm ${
                          selectedFile?.id === file.id
                            ? "text-primaryWhite"
                            : "text-gray-700"
                        }`}
                      >
                        {file.title}
                      </td>
                      <td
                        className={`py-3 px-4 text-sm truncate max-w-sm ${
                          selectedFile?.id === file.id
                            ? "text-primaryWhite"
                            : "text-gray-700"
                        }`}
                      >
                        {file.file_name}
                      </td>
                      <td
                        className={`py-3 px-4 text-sm ${
                          selectedFile?.id === file.id
                            ? "text-primaryWhite"
                            : "text-gray-500"
                        }`}
                      >
                        {file.category}
                      </td>
                      <td
                        className={`py-3 px-4 text-sm ${
                          selectedFile?.id === file.id
                            ? "text-primaryWhite"
                            : "text-gray-500"
                        }`}
                      >
                        {file.pages}
                      </td>
                      <td
                        className={`py-3 px-4 text-sm ${
                          selectedFile?.id === file.id
                            ? "text-primaryWhite"
                            : "text-gray-700"
                        }`}
                      >
                        {new Date(file.uploaded_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {selectedFile && (
        <SideBar
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          onFileUpdate={fetchFiles}
          pollId={pollId}
        />
      )}
    </div>
  );
};

export default Files;