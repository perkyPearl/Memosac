import React, { useState } from "react";
import ProgressBar from "./ProgressBar";
import { displayName } from "react-quill";

const UploadImage = ({ setReload }) => {
    const type = ["image/jpeg", "image/svg+xml", "image/png"];

    const [values, setValues] = useState({
        file: "",
        formData: new FormData(),
        error: "",
    });

    const { file, error } = values;

    const handleChange = (e) => {
        const value = e.target.files[0];

        if (value && type.includes(value.type)) {
            const newFormData = new FormData();
            newFormData.set("image", value);

            setValues({
                file: value,
                formData: newFormData,
                error: "",
            });
        } else {
            setValues({
                ...values,
                error: "Invalid file format",
            });
        }
    };

    return (
        <form>
            <h1>Public Photo Gallery</h1>
            <label>
                <input
                    onChange={handleChange}
                    type="file"
                    placeholder="Choose file"
                style={{display:"none"}}/>
                <span className="add-btn">Add Image</span>
            </label>
            {file && (
                <ProgressBar
                    setReload={setReload}
                    values={values}
                    setValues={setValues}
                />
            )}
            {error && <h1 className="error">{error}</h1>}
        </form>
    );
};

export default UploadImage;
