/** @format */

import nodemailer from 'nodemailer';
import config from '../config/default.js';

const { createTransport } = nodemailer;
const { gmailId, gmailPass } = config;

const userMail = async (email, subject, html) => {
	try {
		let transporter = createTransport({
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			auth: {
				user: gmailId,
				pass: gmailPass,
			},
		});
		let info = await transporter.sendMail({
			from: `"THS" <${gmailId}>`,
			to: email,
			subject: subject,
			html: html,
		});
		console.log('Message Send :>> ', info.messageId);
	} catch (err) {
		console.log('MailErr :>> ', err);
	}
};

export default userMail;
