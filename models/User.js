/** @format */

import mongoose from 'mongoose';
import randomstring from 'randomstring';
import crypto from 'crypto';
import config from '../config/default.js';

const { hashingKey } = config;
const { createHmac } = crypto;
const { generate } = randomstring;
const { Schema, model } = mongoose;

const UserSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
		},
		hashed_password: {
			type: String,
			required: true,
		},
		salt: {
			type: String,
		},
		emailToken: {
			type: String,
			default: generate(),
		},
		tokenExpiresIn: {
			type: Number,
			default: new Date().setHours(new Date().getMinutes() + 2),
		},
		accountActivated: {
			type: Boolean,
			default: false,
		},
		passwordReseted: {
			type: Boolean,
			required: false,
		},
		passwordResetToken: {
			type: String,
			default: false,
		},
	},
	{ timestamps: true },
);

// Virtual Field
UserSchema.virtual('password')
	.set(function (password) {
		this._password = password;
		this.salt = this.makeSalt();
		this.hashed_password = this.encryptPassword(password);
	})
	.get(() => {
		return this._password;
	});

// Path Validator
UserSchema.path('hashed_password').validate(function (v) {
	if (this._password && this._password.length < 6) {
		this.invalidate('password', 'Password must be at leaset 6 character');
	}
	if (this.isNew && !this._password) {
		this.invalidate('password', 'password is Required');
	}
});

// Methods
UserSchema.methods = {
	authenticate: function (plainText) {
		return this.encryptPassword(plainText) === this.hashed_password;
	},
	encryptPassword: function (password) {
		if (!password) return '';
		try {
			return createHmac('sha256', hashingKey).update(password).digest('hex');
		} catch (err) {
			return '';
		}
	},
	makeSalt: function () {
		return Math.round(new Date().valueOf() * Math.random()) + '';
	},
};

export default model('User', UserSchema, 'users');
