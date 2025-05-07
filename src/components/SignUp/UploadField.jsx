import React, { useState } from "react";

const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];

const UploadField = ({ onFileChange }) => {  // Accept the onFileChange as a prop
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && allowedTypes.includes(selected.type)) {
      setFile(selected);
      setError("");

      // For image files, generate the preview URL
      if (selected.type.startsWith("image")) {
        setImagePreview(URL.createObjectURL(selected));
      } else {
        setImagePreview(null); // Clear preview if not an image
      }

      // Pass the selected file to the parent component
      onFileChange(selected); // Pass the selected file to the parent
    } else {
      setFile(null);
      setError("Only PNG, JPG, or PDF files are allowed.");
      setImagePreview(null); // Clear preview if not a valid image
      onFileChange(null);  // Pass null to reset file in parent state
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setFile(null);
    setError("");
    setImagePreview(null); // Clear the image preview when cleared
    onFileChange(null);  // Pass null to reset file in parent state
  };

  return (
    <div className="form-grp file-upload-container">
      <label htmlFor="fileUpload" className="form-label">
        Profile Picture
      </label>
      <label htmlFor="fileUpload" className="file-upload-label">
        <div className="upload-box">
          {file ? (
            <div className="file-preview">
              <span className="file-name">{file.name}</span>
              <button className="clear-button" onClick={handleClear}>
                &times;
              </button>

              {/* Show image preview if file is an image */}
              {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
            </div>
          ) : (
            <div className="upload-placeholder">
              <p>Click to upload profile image</p>
            </div>
          )}
        </div>
        <input
          type="file"
          id="fileUpload"
          className="file-input"
          accept=".png, .jpg, .jpeg, .pdf"
          onChange={handleFileChange}
        />
      </label>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default UploadField;
