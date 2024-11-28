import React, { useState } from "react";
import ProgressBar from "./ProgressBar";
import "../styles/Gallery.css";

const UploadImage = ({ setReload }) => {
    const allowedTypes = [
        "image/jpeg",
        "image/svg+xml",
        "image/png",
        "image/jpg",
        "image/gif",
        "image/webp"
    ];

    const [values, setValues] = useState({
        file: null, // Allow `null` initially
        formData: new FormData(),
        error: "",
    });

    const handleChange = (e) => {
        const value = e.target.files[0];
        if (!value) return;

        if (allowedTypes.includes(value.type)) {
            const newFormData = new FormData();
            newFormData.append("image", value);

            setValues({
                file: value,
                formData: newFormData,
                error: "",
            });
        } else {
            setValues({ ...values, error: "Invalid file format" });
        }
    };

    return (
        <form>
            <h1>Public Photo Gallery</h1>
            <label>
                <input
                    type="file"
                    onChange={handleChange}
                    style={{ display: "none" }}
                />
                <span className="add-btn">Add Image</span>
            </label>
            {values.file && (
                <ProgressBar
                    setReload={setReload}
                    values={values}
                    setValues={setValues}
                />
            )}
            {values.error && <h1 className="error">{values.error}</h1>}
        </form>
    );
};

export default UploadImage;
