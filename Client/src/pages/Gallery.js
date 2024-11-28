import React, { useState } from "react";
import UploadImage from "../components/UploadImage";
import Model from "../components/Model";
import "../styles/Gallery.css";
import ImageGrid from "../components/ImageGrid";
import axios from "axios";

const Gallery = () => {
  const [selectedImg, setSelectedImg] = useState("");
  const [reload, setReload] = useState(true);
  const[imageList, setImageList] = useState([]);

  console.log("Gallery - Selected Image:", selectedImg);

 const handleDelete = async (imageId) => {
  console.log(`Deleting image with ID: ${imageId}`);
     try {
         // Send a delete request to the backend with the image ID
         const response = await axios.delete(`http://localhost:4000/api/images/${imageId}`);

         // If the deletion is successful, remove the image from the list
         if (response.status === 200) {
             console.log("Image deleted successfully");
             setReload(true); // Trigger re-fetching of images after deletion
         }
     } catch (error) {
         console.error("Error deleting image:", error);
         alert("Error deleting image. Please try again.");
     }
 };
  return (
    <div className="Gallery">
      <UploadImage setReload={setReload}  setImageList={setImageList}/>
      <ImageGrid
        setReload={setReload}
        reload={reload}
        setSelectedImg={setSelectedImg}
        imageList={imageList}
        handleDelete={handleDelete}
      />
      {selectedImg && (
        <Model selectedImg={selectedImg} setSelectedImg={setSelectedImg} />
      )}
    </div>
  );
};

export default Gallery;
