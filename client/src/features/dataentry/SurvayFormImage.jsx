import React, { useState } from "react";
import axios from "axios";
import apiPath from "../../isProduction";

const SurvayFormImage = () => {
  const [file, setFile] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select an image first.");
    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(`${await apiPath()}/api/images/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setImageData(res.data);
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!imageData?.id) return;
    try {
      await axios.delete(`${await apiPath()}/api/images/${imageData.id}`);
      alert("Deleted from Google Drive!");
      setImageData(null);
    } catch (err) {
      console.error(err);
      alert("Deletion failed!");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h2>Upload Image to Google Drive</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button disabled={!file || loading} onClick={handleUpload}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {imageData && (
        <div style={{ marginTop: "20px" }}>
          <img
            src={imageData.viewLink}
            alt="Uploaded"
            style={{ width: "100%", borderRadius: "8px" }}
          />
          <div style={{ marginTop: "10px" }}>
            <a
              href={imageData.viewLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              View in Drive
            </a>{" "}
            |{" "}
            <button onClick={handleDelete} style={{ color: "red" }}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurvayFormImage;
