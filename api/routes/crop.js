const express = require('express');
const auth = require('../middlewares/requireAuth');
const router = express.Router();

const crop = require('../controllers/crop');

router.post('/create_crop', auth, crop.createCrop);
router.post('/create_khetar', auth, crop.createKhetar);
router.post('/edit_crop', auth, crop.editCrop);
router.post('/delete_khetar', auth, crop.deleteKhetar);
router.post('/get_crop', auth, crop.getCrops);
router.post('/get_khetar', auth, crop.getKhetars);
router.post('/get_inactive_crop', crop.getInActiveCrops);
router.post('/delete_crop', crop.deleteCrop);
router.post('/inactive_crop', crop.inActiveCrop);
router.post('/active_crop', crop.activeCrop);
router.get('/get_add', crop.getAdd);
router.post('/edit_khetar', auth, crop.editKhetar);

router.post('/get_crop_all', crop.getcropWithAll);
router.get('/get-khetar-details', auth, crop.getAllKhetarDetails);

module.exports = router;