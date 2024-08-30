const express = require('express');
const  { getfile } = require('../controller/tempUrlAccess');
const { generateTempUrl } = require('../controller/tempUrlGenerate');
const router = express.Router();

router.get('/:fileId',getfile);
router.get('/generate-temp-url/:fileId',generateTempUrl);

module.exports = router;