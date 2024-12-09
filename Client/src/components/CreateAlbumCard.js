import React, { useState } from "react";
import "../styles/Album.css";
import PropTypes from "prop-types";

const CreateAlbumCard = ({ album, onDelete }) => {
    const [hover, setHover] = useState(false);

    return (

        <div
            className="album"
            
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}>
            <div className="image-preview">
                {/* Album Cover Image */}
                <img
                    src={
                        album.coverImageUrl
                            ? album.coverImageUrl
                            : "https://images.stockcake.com/public/f/4/8/f48e5e00-bbe1-4af7-9edd-8482ba87702a_large/vintage-photography-memories-stockcake.jpg"
                    }
                    alt={album.albumName}
                    style={{
                        width: "100%",
                        borderRadius: "8px",
                        height: "150px",
                        objectFit: "cover",
                    }}
                    className="img-fluid"
                    onError={(e) => {
                        e.target.src =
                            "https://images.stockcake.com/public/f/4/8/f48e5e00-bbe1-4af7-9edd-8482ba87702a_large/vintage-photography-memories-stockcake.jpg";
                    }}
                />

                {/* Delete Button */}

                {hover && (
                    <button
                        className="delete-btn"
                        onClick={() => onDelete(album._id)} // Deleting album by ID
                    >
                    </button>
                )}

                {/* Album Details */}
                <div className="card-body">
                    <h4 className="card-title">{album.albumName}</h4>
                    <p className="card-text">{album.description}</p>
                    <p className="text-muted">
                        <strong>Images:</strong> {album.images?.length || 0}
                    </p>
                    <p>
                        <small>
                            Created On:{" "}
                            {new Date(album.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                }
                            )}
                        </small>
                    </p>
                </div>
            </div>
        </div>
    );
};
CreateAlbumCard.propTypes = {
    album: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
};
export default CreateAlbumCard;
