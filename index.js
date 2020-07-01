/** @format */

import express from 'express';

import dbController from './controller/dbController.js';
import config from './config/default.js';
import indexRoute from './routers/index.js';
import expressEjsLayouts from 'express-ejs-layouts';

const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressEjsLayouts);
app.set('view engine', 'ejs');
//Router handler
app.use('/', indexRoute);

//Db
dbController();

//server
app.listen(config.port, () => {
	console.log(`Server is running on prot ${config.port}... 🤺 🤺`);
});
