import React from "react";
import { getImageUrl } from "../apicalls";

const Model = ({ selectedImg, setSelectedImg }) => {
    const handleClose = (e) => {
        if (e.target.classList.contains("model")) {
            setSelectedImg("");
        }
    };

    return (
        selectedImg && (
            <div className="model" onClick={handleClose}>
                <img src={getImageUrl(selectedImg)} alt="Enlarged view" />
            </div>
        )
    );
};

export default Model;