const express = require('express');
const { createRoom, findRoom, getFilesByRoomId } = require('../controller/roomController.js');
const router = express.Router();

router.post('/create', createRoom);
router.get('/:roomId', findRoom);
router.get('/:roomId/files', getFilesByRoomId);

module.exports = router;
