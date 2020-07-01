/** @format */
import User from './../models/User.js';

//User Form
const user_form = (req, res) => {
	res.render('index');
};

//Create USer
const user_create = async (req, res) => {
	try {
		const newUser = new User(req.body);
		res.status(200).json(newUser);
	} catch (err) {
		console.log('err :>> ', err);
	}
};

export default { user_create, user_form };
