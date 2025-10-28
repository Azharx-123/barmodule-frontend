import React, { useState } from "react";
import "../css/ImageUpload.css";

const ImageUpload = ({
  onUploadSuccess,
  currentImage,
  uploadType = "avatar",
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);
  const [error, setError] = useState("");

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar");
      return;
    }

    // Validate file size (5MB for avatar, 10MB for course)
    const maxSize = uploadType === "avatar" ? 5 : 10;
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Ukuran file maksimal ${maxSize}MB`);
      return;
    }

    setError("");

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload file
    await uploadImage(file);
  };

  const uploadImage = async (file) => {
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      const fieldName = uploadType === "avatar" ? "avatar" : "image";
      formData.append(fieldName, file);

      const token = localStorage.getItem("token");
      const endpoint = `/api/upload/${
        uploadType === "avatar" ? "avatar" : uploadType
      }`;

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const imageUrl = data.avatar || data.imageUrl;
        onUploadSuccess(imageUrl);
      } else {
        setError(data.message || "Upload gagal");
        setPreview(currentImage);
      }
    } catch (error) {
      setError("Terjadi kesalahan saat upload");
      setPreview(currentImage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload-container">
      <div className="image-preview">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className={
              uploadType === "avatar" ? "avatar-preview" : "course-preview"
            }
          />
        ) : (
          <div className="no-image">
            <span>📷</span>
            <p>No image</p>
          </div>
        )}
      </div>

      <div className="upload-actions">
        <label className="upload-button">
          {uploading ? "Uploading..." : "Choose Image"}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            style={{ display: "none" }}
          />
        </label>

        {error && <p className="upload-error">{error}</p>}
      </div>
    </div>
  );
};

export default ImageUpload;
