const express = require('express');
const  { getfile } = require('../controller/tempUrlAccess.js');
const { generateTempUrl } = require('../controller/tempUrlGenerate.js');
const router = express.Router();

router.get('/:fileId',getfile);
router.get('/generate-temp-url/:fileId',generateTempUrl);

module.exports = router;