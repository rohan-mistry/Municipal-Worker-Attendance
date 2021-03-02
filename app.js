const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./config/db');
const loginRoute = require('./routes/login');
const signinRoute = require('./routes/signup');
const municipalRoute = require('./routes/municipal');
const attendanceRoute = require('./routes/attendance');
const userRoute = require('./routes/user');
const workerRoute = require('./routes/worker');
const passwordRoute = require('./routes/reset');

db();

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.use('/login',loginRoute)
app.use('/user',signinRoute);
app.use('/municipal',municipalRoute);
app.use('/attendance',attendanceRoute);
app.use('/user',userRoute);
app.use('/worker',workerRoute);
app.use('/password',passwordRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`Listening to port ${port}`);
});