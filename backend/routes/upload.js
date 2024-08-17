const express = require('express');
const multer = require('multer');
const { uploadFile } = require('../controller/fileController.js');

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ storage });

router.post('/:roomId', upload.single('file'), uploadFile);

module.exports = router;
