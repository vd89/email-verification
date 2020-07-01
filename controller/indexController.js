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
		const verifyUrl = `http://192.168.0.111:8085/verify/${saveUser.emailToken}`;
		const subject = 'THS Email Verification';
		const html = await ejs.renderFile(__dirname + '/views/emailVerify.ejs', {
			name: saveUser.name,
			verifyUrl,
		});
		userMail(saveUser.email, subject, html);
		res.status(200).json({ Msg: 'Please Check Your Mail account' });
	} catch (err) {
		console.log('err :>> ', err);
	}
};
const user_verifyEmail = async (req, res) => {
	const { emailToken } = req.params;
	try {
		const user = await User.findOne({ emailToken });
		if (!user) {
			return res.status(400).json({ ErrMsg: 'You have not register with us ' });
		}
		const isTokenExpired = new Date().getTime() > user.tokenExpiresIn;
		if (isTokenExpired) {
			return res
				.status(400)
				.json({ ErrMsg: 'Your verification link has expired' });
		}
		await User.findByIdAndUpdate(
			{ _id: user._id },
			{ $set: { accountActivated: true } },
		);
		res.status(200).json({ Msg: 'Your account is registered ' });
	} catch (err) {
		console.log(err);
		res.status(400).json({ ErrMsg: 'There is a server error' });
	}
};

export default { user_create, user_form, user_verifyEmail };
