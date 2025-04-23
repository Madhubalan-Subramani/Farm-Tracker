import axios from 'axios';

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'Form-Tracker-Images');

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/dfvbqnou6/image/upload`,
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    throw new Error('Failed to upload image');
  }
};
