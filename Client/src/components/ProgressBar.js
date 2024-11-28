import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";
import { uploadData } from "../apicalls";

const ProgressBar = ({ values, setValues, setReload }) => {
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (values.formData.has("image")) {
            setIsUploading(true);

            uploadData(values.formData)
                .then((response) => {
                    if (response.error) {
                        setValues((prevValues) => ({
                            ...prevValues,
                            error: response.error,
                            file: null,
                        }));
                    } else {
                        setValues((prevValues) => ({
                            ...prevValues,
                            error: "",
                            file: null,
                        }));
                        setReload(true);
                    }
                })
                .catch(() => {
                    setValues((prevValues) => ({
                        ...prevValues,
                        error: "Upload failed",
                        file: null,
                    }));
                })
                .finally(() => setIsUploading(false));
        }
    }, [values.formData, setValues, setReload]);

    return (
        <div className="progress-overlay">
            {isUploading ? (
                <CircularProgress color="secondary" size={60} />
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
        file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    }).isRequired,
    setValues: PropTypes.func.isRequired,
    setReload: PropTypes.func.isRequired,
};

export default ProgressBar;