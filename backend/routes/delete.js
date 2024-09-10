const express = require('express');
const { deletefile } = require('../controller/fileController.js');
const { deleteRoom } = require('../controller/roomController.js')

const router = express.Router();

router.delete('/:fileId', deletefile);
router.delete('/room/:roomId', deleteRoom);


module.exports = router;
