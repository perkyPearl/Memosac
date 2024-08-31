import React, { useState } from "react";
import UploadImage from "../components/UploadImage";
// import styles from "../Gallery.css";
import Model from "../components/Model";
import ImageGrid from "../components/ImageGrid";

const Gallery = () => {
  const [selectedImg, setSelectedImg] = useState("");
  const [reload, setReload] = useState(true);
  return (
    <div>
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
