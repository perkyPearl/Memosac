import React, { useEffect, useState } from "react";
import CreateAlbum from "../components/CreateAlbum";
import "../styles/Album.css";
import { ToastContainer, toast } from 'react-toastify';
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import CreateAlbumCard from "../components/CreateAlbumCard";

// import LoginPage from "./LoginPage";

// import { useNavigate } from 'react-router-dom';  // Import useNavigate
/* <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
    rel="stylesheet"
/> */

// toast.configure();

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
                            setLoading(false);

        } catch (err) {
            console.error("Error fetching albums:", err.message);
            setError(
                err.response?.data?.message ||
                    "Failed to load albums. Please try again later."
            );
                            setLoading(false);

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

    const handleDeleteAlbum = async (albumId) => {
        try {
            await axios.delete(
                `http://localhost:4000/api/albums/delete/${albumId}`
            );
            toast.success("Album deleted successfully");
            fetchAlbums(); // Refresh the album list
        } catch (error) {
            console.error("Error deleting album:", error);
            toast.error("Failed to delete album. Please try again.");
        }
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
                    
                    className="albums-container">
                    {albums.map((album) => (
                       <CreateAlbumCard
                       key = {album._id}
                       album = {album}
                       onDelete={handleDeleteAlbum}
                       />
                    ))}
                </div>
            )}

            <ToastContainer/>
        </div>
    );
};
export default AlbumDashboard;
