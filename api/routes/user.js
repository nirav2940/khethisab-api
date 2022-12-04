const express = require('express');
const router = express.Router();
const auth = require('../middlewares/requireAuth');
const user = require('../controllers/user');



router.post('/create_user', user.createUser);
router.post('/user_exist', user.userAlreadyExist);
router.post('/login', user.loginUser);
router.post('/change_password', auth, user.changePassword);
router.get('/version-isprime', auth, user.checkIsPrime);
router.post('/forgot_password', user.forgotPassword);
router.post('/send_support_mail', auth, user.sendSupportMail);

module.exports = router;