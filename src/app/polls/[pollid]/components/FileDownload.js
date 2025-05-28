import axios from "axios";
import React from "react";

const FileDownload = () => {
  const handleClick = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_PORT}/export-poll`,
        {
          outline_id: "172875",
        },
        { responseType: "blob" } // Specify responseType as 'blob' to handle binary data
      );

      // Create a blob object from the response data
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      // Create a temporary URL for the blob object
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "poll_document.docx");
      document.body.appendChild(link);

      // Click the link to trigger the download
      link.click();

      // Remove the temporary link and URL
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Download Poll Document</button>
    </div>
  );
};

export default FileDownload;
