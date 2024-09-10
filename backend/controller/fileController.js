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
        await client.cd(roomId)

        const remotePath = path.join(file.originalname);

        const fileStream = new Readable();
        fileStream._read = () => { };
        fileStream.push(file.buffer);
        fileStream.push(null);
        await client.uploadFrom(fileStream, remotePath);

        const fileUrl = `https://theshubhanshu.com/FileVault/uploads/${roomId}/${file.originalname}`;

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

const deletefile = async (req, res) => {
    const { fileId } = req.params;
    const { roomId } = req.query;
    console.log('Attempting to delete file with ID:', fileId);

    const checkFile = await Filee.findOne({ _id: fileId });
    if (!checkFile) {
        return res.status(404).json({ error: "File not Found" });
    }

    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        // Step 1: Access the FTP server and delete the file
        await client.access(ftpOptions);
        await client.cd(roomId)
        await client.remove(checkFile.filename);
        console.log(`File ${checkFile.filename} deleted from FTP`);

        // Step 2: Remove the file from the Room's files array
        await Room.updateOne(
            { _id: checkFile.roomId }, // Match the room
            { $pull: { files: checkFile._id } } // Remove the file from the files array
        );
        console.log(`File removed from Room's files array`);

        // Step 3: Delete the file from the Filee collection
        await Filee.deleteOne({ _id: fileId });
        console.log(`File document deleted from Filee collection`);

        // Step 4: Respond with success message
        return res.status(201).json({ message: "File Deleted Successfully" });
        
    } catch (error) {
        console.error("Error during file deletion:", error);
        return res.status(500).json({ message: "Internal Server Error", error });
    } finally {
        client.close();
    }
};


module.exports = { uploadFile,deletefile };
