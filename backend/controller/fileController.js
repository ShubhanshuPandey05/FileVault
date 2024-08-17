const Room = require('../models/Room.js');
const Filee = require('../models/File.js');
const ftp = require('basic-ftp');
const path = require('path');
const { Readable } = require('stream');


const ftpOptions = {
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASS,
    secure: false, 
};

const uploadFile = async (req, res) => {
    const { roomId } = req.params;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        const room = await Room.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        await client.access(ftpOptions);

        const remotePath = path.join(file.originalname);

        const fileStream = new Readable();
        fileStream._read = () => { };
        fileStream.push(file.buffer);
        fileStream.push(null);
        await client.uploadFrom(fileStream, remotePath);

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
