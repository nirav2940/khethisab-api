const express = require('express');
const router = express.Router();
const auth =require('../middlewares/requireAuth');
const kharcho = require('../controllers/kharcho');

router.post('/create_kharch',auth, kharcho.createKharcho);
router.post('/get_kharch',auth, kharcho.getKharcho);
router.post('/edit_kharch',auth, kharcho.editKharcho);
router.post('/delete_kharch',auth, kharcho.deleteKharcho);

module.exports = router;