const Filee = require('../models/File.js');
const Room = require('../models/Room.js');
const ftp = require('basic-ftp');


const ftpOptions = {
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASS,
    secure: false,
};

const createRoom = async (req, res) => {
    const { roomId } = req.body;

    try {
        // Asynchronously find if the room already exists
        console.log("1");
        
        const check = await Room.findOne({ roomId });
        
        if (check) {
            return res.status(400).json("Room already exists");
        }
        
        console.log("111");
        const client = new ftp.Client();
        client.ftp.verbose = true;
        await client.access(ftpOptions);
        
        await client.ensureDir(roomId)
        .then(() => {
            console.log(`Directory ${roomId} created`)
        })
        // Create and save the new room
        console.log("11");
        const room = new Room({ roomId });
        await room.save();
        
        res.status(201).json(room);
    } catch (error) {
        console.log("1111");
        res.status(500).json({ error: 'Failed to create room',message: error });
    }
};


const findRoom = async (req, res) => {
    console.log("Fetching room with ID:", req.params.roomId);
    try {
        const room = await Room.findOne({ roomId: req.params.roomId }).populate('files');
        if (room) {
            res.json(room);
        } else {
            res.status(404).json({ error: 'Room not found' });
        }
    } catch (error) {
        console.error('Failed to retrieve room:', error);
        res.status(500).json({ error: 'Failed to retrieve room' });
    }
};

const getFilesByRoomId = async (req, res) => {

    try {
        const { roomId } = req.params;
        const room = await Room.findOne({ roomId }).populate('files');
        if (!room) {
            console.log("Room not found for ID:", roomId);
            return res.status(404).json({ message: 'Room not found' });
        }
        const files = await Filee.find({
            _id: { $in: room.files }
        });

        res.json(files)
        // res.json(room.files);
    } catch (error) {
        console.log("Server error:", error);
        res.status(500).json({ message: 'Server error', error });
    }
};

const deleteRoom = async (req, res) => {
    const { roomId } = req.params;

    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        await client.access(ftpOptions);
        await client.cd(roomId);
        await client.clearWorkingDir();
        console.log(`All files in the folder ${roomId} deleted from FTP`);
        await client.cdup();
        await client.removeDir(roomId);
        console.log(`Folder ${roomId} deleted from FTP`);
        const room = Room.findOne({roomId})
        await Filee.deleteMany({ roomId: room._id });
        await Room.deleteOne({ roomId: roomId });
        return res.status(200).json({ message: `Folder ${roomId} deleted successfully` });

    } catch (error) {
        console.error("Error during folder deletion:", error);
        return res.status(500).json({ message: "Internal Server Error", error });
    } finally {
        client.close();
    }
};


module.exports = {
    createRoom,
    findRoom,
    getFilesByRoomId,
    deleteRoom
};