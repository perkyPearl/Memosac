import React, { useState } from "react";
import ProgressBar from "./ProgressBar";
import { motion } from "framer-motion";

const UploadImage = ({ setReload }) => {
    const type = ["image/jpeg", "image/svg+xml", "image/png"];

    const [values, setValues] = useState({
        file: "",
        formData: new FormData(),
        error: "",
    });

    const { file, formData, error } = values;

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
            <motion.svg
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
                version="1.0"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                enableBackground="new 0 0 64 64"
                fill="#000000">
                <g id="SVGRepo_bgCarrier" strokeWidth={0}></g>
                <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <g>
                        <rect
                            x="2"
                            y="12"
                            fill="#D2B48C"
                            width="60"
                            height="40"></rect>
                        <rect
                            x="7"
                            y="19"
                            fill="#3E2723"
                            width="12"
                            height="12"></rect>
                        <rect
                            x="22"
                            y="16"
                            fill="#4A2C2A"
                            width="22"
                            height="16"></rect>
                        <path
                            fill="#4A2C2A"
                            d="M60,40c0,7.732-6.268,14-14,14H18c-7.732,0-14-6.268-14-14H60z"></path>
                        <circle fill="#4A2C2A" cx="32" cy="32" r="10"></circle>
                        <circle fill="#F76D57" cx="32" cy="32" r="7"></circle>
                        <path
                            fill="#F76D57"
                            d="M18,20H9c-0.553,0-1-0.447-1-1s0.447-1,1-1h9c0.553,0,1,0.447,1,1S18.553,20,18,20z"></path>
                        <circle fill="#F76D57" cx="47" cy="23" r="2"></circle>
                    </g>
                </g>
            </motion.svg>
            <h1>Photo Gallery</h1>
            <label>
                <input
                    onChange={handleChange}
                    type="file"
                    placeholder="Choose file"
                />
                <span>Add</span>
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
