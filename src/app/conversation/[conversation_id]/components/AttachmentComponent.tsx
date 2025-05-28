"use client"
/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import { RiDownloadCloudFill } from "react-icons/ri";
import Text from "@/components/ui/Texts/Text";

interface AttachmentProps {
  attachment: {
    content_type: string;
    file_url: string;
  } | null;
}

const AttachmentComponent: React.FC<AttachmentProps> = ({ attachment }) => {
  const [isAssetPopupOpen, setIsAssetPopupOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!attachment) return null;

  const isImage = (contentType: any) =>
    typeof contentType === "string" && contentType.startsWith("image/");

  return (
    <>
     {/* Image Full-size popup */}
      {isAssetPopupOpen && selectedImage && (
        <div className="fixed top-0 left-0 w-full h-full bg-black backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50">
          <button
            className="absolute cursor-pointer top-4 z-10 right-4 bg-white p-2 rounded-full shadow-md hover:rotate-45 transition-all"
            onClick={() => {
              setIsAssetPopupOpen(false);
              setSelectedImage(null);
            }}
          >
            <img src="/images/cross.svg" alt="icon" />
          </button>
          <div className="relative min-w-[50%] max-w-[85%] max-h-[80%] rounded-xl shadow-lg bg-white overflow-auto flex justify-center items-center">
            <img
              src={selectedImage}
              alt="Survey Asset Full Size"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      <div className="w-full flex justify-start py-2">
        {isImage(attachment.content_type) ? (
          <div
            className="relative w-[70%] h-[200px] bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md cursor-pointer"
            onClick={() => {
              setSelectedImage(attachment.file_url);
              setIsAssetPopupOpen(true);
            }}
          >
            <img
              src={attachment.file_url}
              alt="survey attachment"
              className="rounded-xl w-full h-full object-cover"
            />
          </div>
        ) : (
          <a
            href={attachment.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 cursor-pointer bg-white active:scale-95 text-gray-700 px-4 py-2 rounded-lg shadow-md transition-all hover:shadow-lg"
          >
            <RiDownloadCloudFill size={20} className="text-blue-500" />
            <Text variant="body13R">Download File</Text>
          </a>
        )}
      </div>
    </>
  );
};

export default AttachmentComponent;
