/** @format */
import ejs from 'ejs';
import path from 'path';
import User from './../models/User.js';
import userMail from './mailController.js';

const __dirname = path.resolve();

//User Form
const user_form = (req, res) => {
	res.render('index');
};

//Create User
const user_create = async (req, res) => {
	try {
		const newUser = new User(req.body);
		const saveUser = await newUser.save();
		const verifyUrl = `http://192.168.0.111:8085/user/verify/${saveUser.emailToken}`;
		const subject = 'THS Email Verification';
		const html = await ejs.renderFile(__dirname + '/views/emailVerify.ejs', {
			name: saveUser.name,
			verifyUrl,
		});
		userMail(saveUser.email, subject, html);
		res.status(200).json(saveUser);
	} catch (err) {
		console.log('err :>> ', err);
	}
};

export default { user_create, user_form };
