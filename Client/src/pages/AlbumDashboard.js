import React, { useEffect, useState } from "react";
import CreateAlbum from "../components/CreateAlbum";
import "../styles/Album.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
// import LoginPage from "./LoginPage";

// import { useNavigate } from 'react-router-dom';  // Import useNavigate
/* <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
    rel="stylesheet"
/> */

toast.configure();

const AlbumDashboard = () => {
    // const [token, setToken] = useState(null);
    // const [isTokenLoaded, setIsTokenLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // State to control modal visibility

    console.log("showModal state:", showModal); // Log the state value

    // const navigate = useNavigate(); // Get navigate function

    // console.log("Token from localStorage:", token);

    // useEffect(() => {
    //     const storedToken = localStorage.getItem("token");
    //     console.log("Stored Token:", storedToken);
    //     setToken(storedToken);
    //     setIsTokenLoaded(true);
    // }, []);

    const fetchAlbums = async () => {
        try {
            const response = await axios.get(
                "http://localhost:4000/api/albums/all"
            );
            setAlbums(response.data.albums);
        } catch (err) {
            console.error("Error fetching albums:", err.message);
            setError(
                err.response?.data?.message ||
                    "Failed to load albums. Please try again later."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlbums();
    }, []);

    const handleAlbumCreated = () => {
        console.log("Your keepsakes are successfully preserved in Memosac");
        toast.success("New Memosac Successfully Preserved");
        fetchAlbums();
        setShowModal(false); // Hide the form after album creation
    };

    // const toggleCreateForm = () => {
    //     setShowCreateForm((prev) => !prev); // Toggle the form visibility
    // };

    // const handleAlbumError = (errorMsg) => {
    //     setError(errorMsg); // Set the error message if album creation fails
    // };
    // if (!isTokenLoaded) {
    //     return <p>Loading...</p>;
    // }

    if (loading)
        return (
            <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading albums...</p>
            </div>
        );
    if (error) return <p>{error}</p>;

    return (
        <div
            style={{
                padding: "20px",
                fontFamily: "Arial, sans-serif",
                textAlign: "center",
            }}>
            <h1 className="maintitle"> Preserve Your Cherished Memories </h1>
            <h2>Your Keepsakes</h2>

            <button
                className="btn btn-primary mb-3"
                onClick={() => setShowModal(true)}>
                Let's preserve your keepsakes!
            </button>

            {showModal && (
                <div
                    className="modal show"
                    tabIndex="-1"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0,0,0,0.5)",
                    }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {" "}
                                    Let's Preserve your Keepsakes{" "}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowModal(false);
                                    }}></button>
                            </div>
                            <div className="modal-body">
                                <CreateAlbum
                                    onAlbumCreated={handleAlbumCreated}
                                />
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowModal(false);
                                    }}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {albums.length === 0 ? (
                <p>No albums created yet.</p>
            ) : (
                <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}
                    className="albums">
                    {albums.map((album) => (
                        <div
                            className="album-container"
                            key={album._id}
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                padding: "10px",
                                width: "200px",
                                textAlign: "center",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                            }}>
                            <div className="card h-100 shadow-sm">
                                <img
                                    src={
                                        album.coverImageUrl
                                            ? album.coverImageUrl
                                            : "https://images.stockcake.com/public/f/4/8/f48e5e00-bbe1-4af7-9edd-8482ba87702a_large/vintage-photography-memories-stockcake.jpg"
                                    }
                                    alt={album.albumName}
                                    onError={(e) => {
                                        e.target.src =
                                            "https://images.stockcake.com/public/f/4/8/f48e5e00-bbe1-4af7-9edd-8482ba87702a_large/vintage-photography-memories-stockcake.jpg";
                                    }}
                                    style={{
                                        width: "100%",
                                        borderRadius: "8px",
                                        height: "150px",
                                        objectFit: "cover",
                                    }}
                                />
                                <div className="card-body">
                                    <h4 className="card-title">
                                        {album.albumName}
                                    </h4>
                                    <p className="card-text">
                                        {album.description}
                                    </p>
                                    <p className="text-muted">
                                        <strong>Images:</strong>{" "}
                                        {album.images.length}
                                    </p>
                                    <p>
                                        <small>
                                            Created On:{" "}
                                            {new Date(
                                                album.createdAt
                                            ).toLocaleDateString("en-US", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "numeric",
                                                minute: "numeric",
                                                second: "numeric",
                                                hour12: true,
                                            })}
                                        </small>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default AlbumDashboard;
