import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getImages, getImageUrl } from "../apicalls";
import CircularProgress from "@mui/material/CircularProgress";
import { motion } from "framer-motion";

const ImageGrid = ({ setSelectedImg, reload, setReload }) => {
  const [values, setValues] = useState({
    images: [],
    error: "",
    loading: true,
  });

  useEffect(() => {
    if (reload) {
      getImages()
        .then((response) => {
          if (!response) {
            setValues({
              images: [],
              error: "No response from server",
              loading: false,
            });
            return;
          }

          if (response.error) {
            setValues({
              images: [],
              error: response.error,
              loading: false,
            });
          } else {
            setValues({
              images: response,
              error: "",
              loading: false,
            });
          }
          setReload(false);
        })
        .catch(() =>
          setValues({
            images: [],
            error: "Error fetching images",
            loading: false,
          })
        );
    }
  }, [reload, setReload]);

  return (
    <div className="images">
      {values.error && <h1 className="error">{values.error}</h1>}
      {values.loading ? (
        <CircularProgress color="secondary" />
      ) : values.images.length > 0 ? (
        values.images.map((data) => (
          <motion.img
            key={data._id}
            whileHover={{ opacity: 1 }}
            src={getImageUrl(data?._id)}
            alt="gallery"
            loading="lazy"
            onClick={() => {
              console.log("Image clicked:", data._id);
              setSelectedImg(data._id);
            }}
          />
        ))
      ) : (
        <p>No images available</p>
      )}
    </div>
  );
};

ImageGrid.propTypes = {
  setSelectedImg: PropTypes.func.isRequired,
  reload: PropTypes.bool.isRequired,
  setReload: PropTypes.func.isRequired,
};

export default ImageGrid;
