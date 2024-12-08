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
        isPublic: true,
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

        if (error) {
            setError(null);
        }

        setFormData({
            ...formData,
            [name]: value,
        });
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
        setFormData({
            ...formData,
            images: [...e.target.files],
        }); // Save all images
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);

        if (!formData.albumName.trim()) {
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
        data.append("tags", formData.tags || "No tags");
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
                // onAlbumCreated();
                navigate("/albums");
            }
        } catch (err) {
            setError("Failed to preserve your keepsakes. Please try again");
        } finally {
            setIsUploading(false);
            const form = document.querySelector("form"); // Replace with your form's specific selector
            if (form) {
                form.reset();
            }
        }
    };

    return (
        <form className="album-form" onSubmit={handleSubmit}>
            <h1>Assemble your Keepsakes</h1>
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
                    checked={formData.isPublic || true}
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
