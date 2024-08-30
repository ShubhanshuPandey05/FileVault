const File = require("../models/File");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const getfile = async (req, res) => {
    try {
        const { fileId } = req.params;
        const { token } = req.query;

        // Find the file by ID without using a callback
        const file = await File.findById(fileId);

        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Verify the token and expiry
        if (file.tempToken !== token || Date.now() > parseInt(file.tempTokenExpiry)) {
            // console.log(file.tempToken,file.tempTokenExpiry);
            // console.log(token,Date.now());
            
            return res.status(403).json({ error: 'URL expired or invalid' });
        }

        // Download the file from the URL and save it temporarily
        const response = await axios({
            url: file.url,
            method: 'GET',
            responseType: 'stream',
        });

        const tempFilePath = path.join(__dirname, 'temp', file.filename);
        const writer = fs.createWriteStream(tempFilePath);

        response.data.pipe(writer);

        writer.on('finish', () => {
            res.download(tempFilePath, file.filename, (err) => {
                if (err) {
                    console.error('Error serving the file:', err);
                    res.status(500).json({ error: 'Failed to serve the file' });
                }

                // Clean up the temporary file
                fs.unlink(tempFilePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error deleting the temporary file:', unlinkErr);
                    }
                });
            });
        });

        writer.on('error', (err) => {
            console.error('Error writing the temporary file:', err);
            res.status(500).json({ error: 'Failed to serve the file' });
        });
    } catch (err) {
        console.error('Error retrieving file:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getfile,
};
