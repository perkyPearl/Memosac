const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const { ObjectId } = require("mongodb");

exports.getFileFromGridFS = async (req, res) => {
    try {
        const fileId = req.params.fileId;
        console.log("Connected to DB:", mongoose.connection.name);

        if (!fileId || !mongoose.Types.ObjectId.isValid(fileId)) {
            return res.status(400).send("File ID is required or invalid");
        }

        console.log(`Fetching file with ID: ${fileId}`);

        const db = mongoose.connection.db;
        const bucket = new GridFSBucket(db, { bucketName: "uploads" });

                const fileIdObj = new mongoose.Types.ObjectId(fileId);
        console.log("Using ObjectId:", fileIdObj);

        const file = await db
            .collection("uploads.files")
            .findOne({ _id: fileIdObj});

        if (!file) {
            console.log(`File with ID ${fileId} not found in uploads.files.`);

            return res.status(404).send("File not found.");
        }

        console.log("File found:", file);

        const downloadStream = bucket.openDownloadStream(
            fileIdObj
        );
        downloadStream.on("error", (err) => {
            console.error("Error fetching file:", err);
            res.status(404).send("File not found.");
        });

        downloadStream.on("file", (file) => {
            res.set(
                "Content-Type",
                file.contentType || "application/octet-stream"
            );
        });

        downloadStream.pipe(res);
        downloadStream.on("end", () => {
            console.log(`Successfully streamed file with ID: ${fileId}`);
        });
    } catch (error) {
        console.error("Error retrieving file from GridFS:", error.message);
        res.status(500).send("Internal Server Error.");
    }
};
