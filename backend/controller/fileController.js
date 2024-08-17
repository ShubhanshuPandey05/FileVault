const Room = require('../models/Room.js');
const Filee = require('../models/File.js');
const ftp = require('basic-ftp');
const path = require('path');
const { Readable } = require('stream');


const ftpOptions = {
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASS,
    secure: false,  // Set to true if using FTPS
};

const uploadFile = async (req, res) => {
    const { roomId } = req.params;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const client = new ftp.Client();
    client.ftp.verbose = true;  // Enable verbose logging

    try {
        const room = await Room.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        // Connect to the FTP server
        await client.access(ftpOptions);

        // Define the remote path where the file will be uploaded
        const remotePath = path.join(file.originalname);

        // Create a readable stream from the file buffer
        const fileStream = new Readable();
        fileStream._read = () => { }; // No-op
        fileStream.push(file.buffer);
        fileStream.push(null);

        // Upload the file to the FTP server
        await client.uploadFrom(fileStream, remotePath);

        // Generate the file URL
        const fileUrl = `https://theshubhanshu.com/FileVault/uploads/${file.originalname}`;

        const newFileData = {
            filename: file.originalname,
            url: fileUrl,
            roomId: room,
        };

        const newFile = new Filee(newFileData);
        await newFile.save();
        room.files.push(newFile._id);
        await room.save();

        res.status(200).json(newFileData);
    } catch (error) {
        console.error('Error uploading file via FTP:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    } finally {
        client.close();
    }
};

module.exports = { uploadFile };
