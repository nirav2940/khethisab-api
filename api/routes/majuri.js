const express = require('express');
const router = express.Router();

const majuri = require('../controllers/majuri');

router.post('/create_majuri', majuri.createMajuri);
router.post('/get_majuri', majuri.getMajuri);
router.post('/delete_majuri', majuri.deleteMajuri);

module.exports = router;