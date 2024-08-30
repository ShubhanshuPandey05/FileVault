const crypto = require('crypto');
const File = require('../models/File');

const TEMP_URL_EXPIRY = 0.5* 60 * 1000; // 1 hour in milliseconds

const generateTempUrl = async (req, res) => {
    const { fileId } = req.params;

    try {
        // Generate a unique token
        const token = crypto.randomBytes(20).toString('hex');

        // Set expiry time
        const expiryTime = Date.now() + TEMP_URL_EXPIRY;
        // console.log(Date.now());
        // console.log(TEMP_URL_EXPIRY);
        // console.log(Date.now() + TEMP_URL_EXPIRY);
        

        // Find the file by ID and update with the temporary token and expiry time
        const file = await File.findByIdAndUpdate(
            fileId,
            { tempToken: token, tempTokenExpiry: expiryTime },
            { new: true }
        );
        
        
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }
        
        // Generate the temporary URL
        // console.log(token);
        const tempUrl = `https://filevault-plyk.onrender.com/temp/${fileId}?token=${token}`;
        res.json({ tempUrl });
    } catch (err) {
        res.status(500).json({ error: 'Failed to generate temporary URL' });
    }
};

module.exports = {
    generateTempUrl
};
