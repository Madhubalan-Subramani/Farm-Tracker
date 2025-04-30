import React, { useState } from 'react';
import { uploadImage } from '../../utils/cloudinaryImageUpload';
import './ImageUpload.css';

const ImageUpload = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (!file) return; // If no file is selected, return early

    try {
      setError(''); // Reset error message
      const url = await uploadImage(file); // Upload the image and get the URL
      setImageUrl(url); // Update state with the image URL
    } catch (error) {
      setError('Failed to upload image'); // If error occurs during upload
    }
  };

  return (
    <div className="image-upload-container">
      <input type="file" onChange={handleImageUpload} />
      {error && <div className="error-message">{error}</div>} {/* Display error if it exists */}
      {imageUrl && <img src={imageUrl} alt="Uploaded" />} {/* Display uploaded image */}
    </div>
  );
};

export default ImageUpload;
