import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";
import { uploadData } from "../apicalls";
import '../styles/Gallery.css'; // Ensure correct path

const ProgressBar = ({ values, setValues, setReload }) => {
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        if (values.formData.has("image")) {
            setIsUploading(true);

            uploadData(values.formData)
                .then((response) => {
                    if (isMounted) {
                        if (response.error) {
                            setValues((prevValues) => ({
                                ...prevValues,
                                error: response.error,
                                file: "",
                            }));
                        } else {
                            setValues((prevValues) => ({
                                ...prevValues,
                                error: "",
                                file: "",
                            }));
                            setReload(true);
                        }
                        setIsUploading(false);
                    }
                })
                .catch(() => {
                    if (isMounted) {
                        setValues((prevValues) => ({
                            ...prevValues,
                            error: "Upload failed",
                            file: "",
                        }));
                        setIsUploading(false);
                    }
                });
        }

        return () => {
            isMounted = false;
        };
    }, [values.formData, setValues, setReload]);

    return (
        <div className="progress-overlay">
            {isUploading ? (
                <CircularProgress
                    color="secondary"
                    size={60}
                />
            ) : (
                <p>Upload complete!</p>
            )}
        </div>
    );
};

ProgressBar.propTypes = {
    values: PropTypes.shape({
        formData: PropTypes.object.isRequired,
        error: PropTypes.string,
        file: PropTypes.string,
    }).isRequired,
    setValues: PropTypes.func.isRequired,
    setReload: PropTypes.func.isRequired,
};

export default ProgressBar;
