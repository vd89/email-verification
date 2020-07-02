/** @format */
import ejs from 'ejs';
import randomstring from 'randomstring';
import path from 'path';
import User from './../models/User.js';
import userMail from './mailController.js';

const __dirname = path.resolve();
const { generate } = randomstring;

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

const user_forgotPasswordView = (req, res) => {
	res.status(200).render('forgotPassword');
};
const user_forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ ErrMsg: 'You are not register with us ' });
		}
		const resetToken = generate();
		const passwordResetLink = `http://192.168.0.111:8085/reset-password/${resetToken}`;
		user.passwordResetToken = resetToken;
		user.tokenExpiresIn = new Date().setMinutes(new Date().getMinutes() + 10);
		await user.save();
		const subject = 'The password Reset';
		const html = await ejs.renderFile(__dirname + '/views/passwordReset.ejs', {
			name: user.name,
			passwordResetLink,
		});
		userMail(user.email, subject, html);
		res.status(200).json({
			Msg: 'Please check the email you have the linke to reset password',
		});
	} catch (err) {
		console.log(err);
		res.status(400).json({ ErrMsg: 'There is an error from server' });
	}
};

const user_resetPassword = async (req, res) => {
	const { passwordResetToken } = req.params;
	try {
		const user = await User.findOne({ passwordResetToken });
		if (!user) {
			return res.status(400).json({ ErrMsg: 'You have not register with us ' });
		}
	} catch (err) {
		console.log(err);
		res.status(400).json({ ErrMsg: 'There is an error from server' });
	}
};

export default {
	user_create,
	user_form,
	user_verifyEmail,
	user_forgotPasswordView,
	user_forgotPassword,
	user_resetPassword,
};
