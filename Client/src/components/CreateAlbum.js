import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Album.css";

const CreateAlbum = () => {
    const [formData, setFormData] = useState({
        albumName: "",
        description: "",
        coverImage: null,
        coverImagePreview: null,
        images: [],
        tags: "",
        isPublic: "",
    });

    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // useEffect(() => {
    //     if (!token) {
    //         navigate("/login");
    //     }
    // }, [token, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "albumName") {
            setFormData({
                ...formData,
                albumName: value.trim(), // Ensure trimming the value before storing
            });
        } else if (name === "tags") {
            setFormData({
                ...formData,
                [name]: value.split(",").map((tag) => tag.trim()), // Split and trim tags
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }

        if (error) {
            setError(null);
        }
    };
    const handleCheckboxChange = (e) => {
        setFormData({ ...formData, isPublic: e.target.checked });
    };

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];

        setFormData({
            ...formData,
            coverImage: file,
            coverImagePreview: URL.createObjectURL(file),
        });
    };
    const handleFileChange = (e) => {
            const files = Array.from(e.target.files);

        setFormData({
            ...formData,
            images: files,
        }); // Save all images
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);

        console.log("Form data before submission:", formData);

        if (!formData.albumName) {
            setError("Please give a title to your Memosac");
            setIsUploading(false);
            console.log("Album name is missing:", formData.albumName);
            return;
        }

        if (formData.images.length === 0) {
            setError("Please upload at least one keepsake image.");
            setIsUploading(false);
            return;
        }

        // if (!token) {
        //     setError("Authorization token is missing");
        //     return;
        // }

        // setError(null);

        const data = new FormData();
        console.log("Album Name before append:", formData.albumName);
        data.append("albumName", formData.albumName);
        console.log("Album Name:", formData.albumName);

        data.append(
            "description",
            formData.description || "No description provided"
        );
        data.append("tags", formData.tags.join(",") || "No tags");
        data.append("isPublic", formData.isPublic);

        if (formData.coverImage) {
            data.append("coverImage", formData.coverImage);
        }

        formData.images.forEach((image) => {
            data.append("images", image);
        });

        console.log("FormData Entries:");
        for (let [key, value] of data.entries()) {
            console.log(`${key} (${typeof value}):`, value);
        }

        try {
            const response = await fetch(
                "http://localhost:4000/api/albums/create",
                {
                    method: "POST",
                    body: data,
                }
            );
            const result = await response.json();
            console.log("Server Response:", result);
            if (result.error) {
                setError(result.error);
            } else {
                alert(
                    "Hurray!! Your Keepsakes are successfully preserved in your Memosac🥳🥳"
                );
                setFormData({
                    albumName: "",
                    description: "",
                    coverImage: null,
                    coverImagePreview: null,
                    images: [],
                    tags: "",
                    isPublic:"",
                });
                // onAlbumCreated();
                navigate("/albums");
            }
        } catch (err) {
            setError("Failed to preserve your keepsakes. Please try again");
        } finally {
            setIsUploading(false);
        }
    };
    return (
        <form className="album-form" onSubmit={handleSubmit}>
            <h1>
                What will your Memosac be called?" Start creating your album and
                keep your memories alive!
            </h1>
            <label>
                Tag Your Memosac:
                <input
                    type="text"
                    name="albumName"
                    value={formData.albumName || ""}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                Through the Years:
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />
            </label>
            <label>
                Add a Memory Seal:
                <input
                    type="file"
                    name="coverImage"
                    onChange={handleCoverImageChange}
                    required
                />
                {formData.coverImagePreview && (
                    <img
                        src={formData.coverImagePreview}
                        alt="Cover Preview"
                        style={{ maxWidth: "200px", marginTop: "10px" }}
                    />
                )}
            </label>
            <label>
                Memory Labels (comma-separated):
                <input
                    type="text"
                    name="tags"
                    value={formData.tags || ""}
                    onChange={handleChange}
                />
            </label>
            <label className="checkbox-label">
                Public:
                <input
                    type="checkbox"
                    className="custom-checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleCheckboxChange}
                />
            </label>
            <label>
                Upload your Keepsakes:
                <input
                    type="file"
                    name="images"
                    multiple
                    onChange={handleFileChange}
                />
            </label>
            <button className="submit-btn" type="submit" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Preserve your Keepsakes"}
            </button>
            {error && <p className="error">{error}</p>}
        </form>
    );
};

export default CreateAlbum;
