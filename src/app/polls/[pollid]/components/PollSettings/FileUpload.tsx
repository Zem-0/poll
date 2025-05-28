import { useToast } from "@/app/component/ToasterProvider";
import { useState, useEffect } from "react";

interface FileUploadProps {
  question_id: string;
  pollId: string;
}

const FileUploadComponent = ({ question_id, pollId }: FileUploadProps) => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { showToast } = useToast();
  const [uploadedFile, setUploadedFile] = useState({
    url: null as string | null,
    name: null as string | null,
    type: null as string | null,
    loading: false,
    error: null as string | null,
    imageExpanded: false,
  });

  useEffect(() => {
    const fetchExistingFile = async () => {
      try {
        setUploadedFile((prev) => ({ ...prev, loading: true }));
        const token = localStorage.getItem("access_token");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_PORT}/outline/getfile/${question_id}?poll_id=${pollId}`,
          {
            headers: token ? { JWTToken: token } : undefined,
          }
        );

        const data = await response.json();

        if (data.status === "success") {
          setUploadedFile({
            url: data.file_url,
            name: data.file_name,
            type: data.content_type,
            loading: false,
            error: null,
            imageExpanded: false,
          });
        } else {
          // setUploadedFile(prev => ({ ...prev, loading: false }));
          setUploadedFile({
            url: null,
            name: null,
            type: null,
            loading: false,
            error: null,
            imageExpanded: false,
          });
        }
      } catch (error: any) {
        console.error("Error fetching file:", error);
        setUploadedFile((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to load file",
        }));
      }
    };

    if (question_id && pollId) {
      fetchExistingFile();
    }
  }, [question_id, pollId]);

  const handleFileUpload = async (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("poll_id", pollId);
      formData.append("question_id", question_id);

      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_PORT}/outline/uploadfile`,
        {
          method: "POST",
          headers: token
            ? {
                JWTToken: token,
              }
            : undefined,
          body: formData,
        }
      );
      

      if (!response.ok) throw new Error("Upload failed");      

      const data = await response.json();
      showToast({ type: "success", message: "File uploaded successfully!" });


      setUploadedFile({
        url: data.file_url,
        name: data.file_name,
        type: data.content_type,
        loading: false,
        error: null,
        imageExpanded: false,
      });
    } catch (error: any) {
      showToast({ type: "error", message: "Failed to upload file!" });
      console.error("Upload error:", error.message);
      setUploadedFile((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Failed to upload file",
      }));
    }

    event.target.value = "";
  };

  const toggleImageExpand = () => {
    setUploadedFile((prev) => ({
      ...prev,
      imageExpanded: !prev.imageExpanded,
    }));
  };

  const handleDeleteFile = async () => {
    if (!question_id || !pollId) return;
    setDeleteLoading(true); // Start blinking

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_PORT}/outline/deletefile/${question_id}?poll_id=${pollId}`,
        {
          method: "DELETE",
          headers: token ? { JWTToken: token } : undefined,
        }
      );

      if (!response.ok) throw new Error("Failed to delete file");

      showToast({ type: "info", message: "File deleted successfully!" });

      setUploadedFile({
        url: null,
        name: null,
        type: null,
        loading: false,
        error: null,
        imageExpanded: false,
      });
    } catch (error: any) {
      showToast({ type: "error", message: "Failed to delete file!" });
      console.error("Delete error:", error);
      setUploadedFile((prev) => ({
        ...prev,
        error: "Failed to delete file",
      }));
    }finally {
      setDeleteLoading(false); // Stop blinking
    }
  };

  return (
    <div className="mt-4">
      <label className="block text-medium font-normal text-Pri-Dark">
        Upload image or document
      </label>

      <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed text-Pri-Dark px-6 py-10 bg-white shadow-sm">
        <div className="text-center">
          <div className="mt-4 flex text-base leading-6 text-gray-600">
            <label className="relative cursor-pointer rounded-md bg-white font-semibold text-yellow-500 hover:text-yellow-600">
              {uploadedFile.loading ? (
                <div className="mx-auto h-10 w-12 animate-pulse bg-gray-200 rounded-lg" />
              ) : (
                <img
                  src="/images/workspace/upload.svg"
                  className="mx-auto h-10 w-12 text-gray-300 shadow-md rounded-lg"
                  alt="upload"
                />
              )}
              <input
                type="file"
                className="sr-only"
                onChange={handleFileUpload}
                disabled={uploadedFile.loading}
              />
            </label>
          </div>
        </div>
      </div>

      {uploadedFile.error && (
        <p className="mt-2 text-sm text-red-600">{uploadedFile.error}</p>
      )}

      {uploadedFile.url && !uploadedFile.error && (
        <div className="mt-4 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          {uploadedFile.type?.startsWith("image/") ? (
            <div className="relative">
              <div
                className={`cursor-pointer transition-all duration-300 ${
                  uploadedFile.imageExpanded ? "h-96" : "h-48"
                }`}
                onClick={toggleImageExpand}
              >
                <img
                  src={uploadedFile.url}
                  alt={uploadedFile.name?.split(".").slice(0, -1).join(".")}
                  className={`w-full h-full object-contain bg-gray-50 transition-all duration-300 ${
                    uploadedFile.imageExpanded ? "scale-100" : "hover:scale-105"
                  }`}
                  onError={() =>
                    setUploadedFile((prev) => ({
                      ...prev,
                      error: "Failed to load image",
                    }))
                  }
                />
              </div>
              <div className="p-4 bg-white border-t">
                <div className="flex items-center justify-between">
                  <div className="flex-1 overflow-hidden">
                    <p className="font-medium text-gray-900 truncate">
                      {uploadedFile.name}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <button
                        onClick={toggleImageExpand}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {uploadedFile.imageExpanded ? "Collapse" : "Expand"}{" "}
                        Image
                      </button>
                      <button onClick={handleDeleteFile} title="Delete file" className={`${deleteLoading ? 'animate-pulse': ""}`}>
                        <img src="/images/workspace/delete.svg" alt="img" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg">
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-8 h-8 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-medium text-gray-900 truncate">
                      {uploadedFile.name}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <a
                        href={uploadedFile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        View or Download File
                      </a>
                      <button onClick={handleDeleteFile} title="Delete file" className={`${deleteLoading ? 'animate-pulse': ""}`}>
                        <img src="/images/workspace/delete.svg" alt="img" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;
