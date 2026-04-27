import React, { useState, useEffect } from "react";

const DelayedImage = ({ fileId, delayIndex }) => {
  const [imgSrc, setImgSrc] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!fileId) return;

    // અહીં $ લગાવેલો છે, અને Google Drive ની Thumbnail API વાપરી છે
    // જે પીડીએફ અને રેટ લિમિટ (429) માટે સૌથી બેસ્ટ છે.
    // const url = `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;
    const url = `https://lh3.googleusercontent.com/u/0/d/${fileId}`;
    // const url = `https://drive.google.com/uc?export=view&id=${fileId}`;
    // const url = `https://drive.usercontent.google.com/download?id=${fileId}&export=view&authuser=0`; // &authuser=0

    const timer = setTimeout(() => {
      setImgSrc(url);
    }, delayIndex * 1000);

    return () => clearTimeout(timer);
  }, [fileId, delayIndex]);

  if (hasError) {
    return (
      <div style={{ fontSize: "12px", color: "red", padding: "10px" }}>
        Image Error {imgSrc}
      </div>
    );
  }

  if (!imgSrc) {
    return (
      <div style={{ fontSize: "12px", padding: "20px", color: "#999" }}>
        Loading...
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={`Property ${fileId}`}
      style={{
        width: "100%",
        height: "auto",
        borderRadius: "8px",
        border: "1px solid #ddd",
      }}
      // crossOrigin="anonymous" //  important for pdf
      onError={(e) => {
        console.error("Image failed to load for ID:", fileId, imgSrc);
        setHasError(true);
      }}
    />
  );
};

export default DelayedImage;
