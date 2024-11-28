import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getImages, getImageUrl } from "../apicalls";
import CircularProgress from "@mui/material/CircularProgress";
import { motion } from "framer-motion";
import "../styles/Gallery.css";
import { Button } from "@mui/material";

const ImageGrid = ({ setSelectedImg, reload, setReload, handleDelete }) => {
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

    // Adjust grid row spans after images load
    const calculateRowSpan = (event, container) => {
        const image = event.target;
        const rowSpan = Math.ceil(image.offsetHeight / 10); // Adjust the divisor to match grid-auto-rows
        container.style.setProperty("--row-span", rowSpan);
        container.style.height = `${image.offsetHeight}px`;
    };

    return (
        <div className="images" role="list">
            {values.error && <h1 className="error">{values.error}</h1>}
            {values.loading ? (
                <CircularProgress color="secondary" />
            ) : values.images.length > 0 ? (
                values.images.map((data) => (
                    <div
                        role="listitem"
                        key={data._id}
                        className="image-container"
                        ref={(container) =>
                            container &&
                            calculateRowSpan(
                                { target: container.querySelector("img") },
                                container
                            )
                        }>
                        <motion.img
                            key={data._id}
                            // whileHover={{ opacity: 0.8 }}
                            src={getImageUrl(data._id)}
                            alt="gallery"
                            loading="lazy"
                            onLoad={(event) =>
                                calculateRowSpan(event, event.target.parentNode)
                            }
                            onClick={() => {
                                console.log("Image clicked:", data._id);
                                setSelectedImg(data._id);
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={() => handleDelete(data._id)}
                            className="delete-btn"
                            >
                            Delete
                        </Button>
                    </div>
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
    handleDelete: PropTypes.func.isRequired,
};

export default ImageGrid;
