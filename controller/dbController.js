/** @format */

import mongoose from 'mongoose';
import config from '../config/default.js';

const { connect } = mongoose;
export default async () => {
	try {
		const opt = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
		};
		const uri = config.mongoUri;
		connect(uri, opt);
		console.log(`Db connected to server 🌵 🌵`);
	} catch (err) {
		console.log('err :>> ', err);
	}
};
