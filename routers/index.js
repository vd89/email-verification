/** @format */

import express from 'express';
import indexController from '../controller/indexController.js';

const router = express.Router();
const { user_form, user_create } = indexController;

router.route('/').get(user_form).post(user_create);
router.get('/email', (req, res) => {
	res.render('emailVerify');
});

export default router;
