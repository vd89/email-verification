/** @format */

import crypto from 'crypto';
import config from '../config/default.js';

const { createHmac } = crypto;
const { hashingKey } = config;

const hash = (str) => {
	if (typeof str == 'string' && str.length > 0) {
		const hash = createHmac('sha256', hashingKey).update(str).digest('hex');
		return hash;
	} else {
		return false;
	}
};

export default hash;
