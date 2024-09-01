import React, { useState } from "react";
import UploadImage from "../components/UploadImage";
import Model from "../components/Model";
import "../styles/Gallery.css"
import ImageGrid from "../components/ImageGrid";

const Gallery = () => {
  const [selectedImg, setSelectedImg] = useState("");
  const [reload, setReload] = useState(true);
  return (
    <div className="Gallery">
      <UploadImage setReload={setReload} />
      <ImageGrid
        setReload={setReload}
        reload={reload}
        setSelectedImg={setSelectedImg}
      />
      {selectedImg && (
        <Model selectedImg={selectedImg} setSelectedImg={setSelectedImg} />
      )}
    </div>
  );
};

export default Gallery;
