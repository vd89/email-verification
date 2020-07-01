/** @format */

import express from 'express';
import dbController from './controller/dbController.js';

const app = express();

//Db
dbController();

//server
app.listen(8085, () => {
	console.log(`Server is running on prot 8085`);
});
