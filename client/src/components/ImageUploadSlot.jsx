import { useCallback, useState } from "react";
import { Upload, Trash, Image, Loader } from "lucide-react";
import apiPath from "../isProduction";
import axios from "axios";

const ImageUploadSlot = ({ label, slotKey, formData, setFormData }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const viewLink = formData[slotKey];

  // Custom hook-like function to update formData state
  const updateFormData = useCallback(
    (key, value) => {
      setFormData((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [setFormData],
  );

  const handleUpload = async () => {
    if (!file) return;

    // Use a custom message box instead of alert()
    const showMessage = (msg, isError = false) => {
      setError(isError ? msg : null);
      if (!isError) console.log(msg);
    };

    setLoading(true);
    setError(null);
    const formDataPayload = new FormData();
    formDataPayload.append("image", file); // 'image' must match the key expected by the backend (req.file.path)
    formDataPayload.append("slotKey", slotKey); // Optional: send slot key for server logic

    try {
      // --- MOCK API CALL START ---
      // In a real application, replace this mock with your actual fetch call.
      // This mock simulates a successful response from the backend.
      showMessage(`Uploading ${file.name}...`);

      const res = await axios.post(
        `${await apiPath()}/api/images`,
        formDataPayload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      console.log("uploaded: ", res.data);

      if (res?.data?.id) {
        updateFormData(slotKey, res.data.id);
        setFile(null); // Clear file input after successful upload
        showMessage("Upload successful!", false);
      } else {
        throw new Error("API did not return a view link.");
      }
    } catch (err) {
      console.error("Upload Error:", err);
      showMessage("Upload failed. Check console for details.", true);
      updateFormData(slotKey, "");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!viewLink) return;

    if (
      !window.confirm(`Are you sure you want to delete the image for ${label}?`)
    ) {
      // In a real app, use a custom modal instead of window.confirm
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // --- MOCK API CALL START ---
      window.alert(`Deleting image...`);
      await axios.delete(`${await apiPath()}/api/images/${viewLink}`);

      updateFormData(slotKey, ""); // Clear the view link in formData
      window.alert("Deletion successful!", false);
    } catch (err) {
      console.error("Deletion Error:", err);
      window.alert("Deletion failed. Check console for details.", true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">{label}</h3>

      {/* Image Preview / Placeholder */}
      <div className="relative w-full h-32 mb-4 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
        {viewLink ? (
          <>
            {/* <img
            // src={`https://drive.usercontent.google.com/download?id=${viewLink}&export=view`}

            // src="https://drive.google.com/uc?export=view&id=16MYpdYXXwE7A7GjR0d-IjnMaQSy8TLRI"
            // src="https://drive.usercontent.google.com/download?id=16MYpdYXXwE7A7GjR0d-IjnMaQSy8TLRI&export=view"
            src="https://drive.google.com/uc?export=download&id=16MYpdYXXwE7A7GjR0d-IjnMaQSy8TLRI"
            
            alt={label}
            className="w-full h-full object-cover"
            // onError={(e) => {
            //   e.target.onerror = null;
            //   e.target.src = `https://placehold.co/400x200/DC2626/ffffff?text=Image+Load+Error`;
            // }}
          /> */}
            <iframe
              src={`https://drive.google.com/file/d/${viewLink}/preview`}
              width="600"
              height="400"
              allow="autoplay"
            ></iframe>
          </>
        ) : (
          <div className="text-gray-400">
            <Image className="w-8 h-8 mx-auto mb-1" />
            <p className="text-sm">No Image Uploaded</p>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
            <Loader className="animate-spin text-indigo-600 w-6 h-6" />
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      {/* Upload/Delete Controls */}
      <div className="flex space-x-2">
        {!viewLink ? (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setFile(e.target.files[0]);
                setError(null);
              }}
              className="hidden"
              id={`file-input-${slotKey}`}
              disabled={loading}
            />
            <label
              htmlFor={`file-input-${slotKey}`}
              className={`flex-1 cursor-pointer py-2 px-3 text-sm font-medium text-white bg-indigo-600 rounded-md text-center transition duration-150 ease-in-out shadow-md hover:bg-indigo-700 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Upload className="inline w-4 h-4 mr-2" />
              {file ? file.name : "Select File"}
            </label>
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-24 py-2 px-3 text-sm font-medium text-white rounded-md transition duration-150 ease-in-out shadow-md disabled:opacity-50"
              style={{
                backgroundColor: file && !loading ? "#10B981" : "#A7F3D0",
              }} // Green color for upload
            >
              Upload
            </button>
          </>
        ) : (
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-2 px-3 text-sm font-medium text-white bg-red-600 rounded-md transition duration-150 ease-in-out shadow-md hover:bg-red-700 disabled:opacity-50"
          >
            <Trash className="inline w-4 h-4 mr-2" />
            Delete Image
          </button>
        )}
      </div>
      {viewLink && (
        <a
          href={`https://drive.google.com/file/d/${viewLink}/view`}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-2 text-xs text-indigo-600 hover:text-indigo-800 text-center"
        >
          (View Uploaded Image)
        </a>
      )}
    </div>
  );
};

export default ImageUploadSlot;
