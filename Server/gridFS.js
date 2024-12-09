const { MongoClient, GridFSBucket } = require("mongodb");
require("dotenv").config();

const mongoURI = process.env.MongoDBURI;
let gridFSBucket;

const initGridFSBucket = async () => {
    try {
        if (!gridFSBucket) {
            const client = new MongoClient(mongoURI);
            await client.connect();

            const db = client.db();
            gridFSBucket = new GridFSBucket(db, { bucketName: "uploads" });
            console.log("GridFSBucket initialized successfully in gridFS.js");
        }
        return gridFSBucket; // Return cached GridFSBucket instance
    } catch (error) {
        console.error("Error initializing GridFSBucket in gridFS.js: ", error);
        throw error;
    }
};

module.exports = { initGridFSBucket };