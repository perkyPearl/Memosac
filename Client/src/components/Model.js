import React from "react";
import { getImageUrl } from "../apicalls";
import "../styles/Gallery.css";

const Model = ({ selectedImg, setSelectedImg }) => {
  const handleClose = (e) => {
    if (e.target.classList.contains("model")) {
      console.log("Closing modal");
      setSelectedImg("");
    }
  };

  console.log("Rendering modal with image ID:", selectedImg);

  return (
    selectedImg && (
      <div className="model" onClick={handleClose}>
        <img src={getImageUrl(selectedImg)} alt="Enlarged view" />
      </div>
    )
  );
};

export default Model;
