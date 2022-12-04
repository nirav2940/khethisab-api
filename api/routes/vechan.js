const express = require('express');
const router = express.Router();
const auth =require('../middlewares/requireAuth');

const vechan = require('../controllers/vechan');

router.post('/create_vechan',auth, vechan.createVechan);
router.post('/edit_vechan',auth, vechan.editVechan);
router.post('/get_vechan',auth, vechan.getVechan);
router.post('/delete_vechan',auth, vechan.deleteVechan);

module.exports = router;