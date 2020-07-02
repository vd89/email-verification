/** @format */

import express from 'express';
import indexController from '../controller/indexController.js';

const router = express.Router();
const {
	user_form,
	user_create,
	user_verifyEmail,
	user_forgotPasswordView,
	user_forgotPassword,
	user_resetPassword,
	user_passwordChanged,
} = indexController;

router.route('/').get(user_form).post(user_create);

router.get('/verify/:emailToken', user_verifyEmail);

router.route('/forgot').get(user_forgotPasswordView).post(user_forgotPassword);

router.get('/reset-password/:passwordResetToken', user_resetPassword);

export default router;
