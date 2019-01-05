const express = require('express');
const os = require('os');
const multer = require('multer');
const bodyParser = require('body-parser');
const nodeMailer = require('nodemailer');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const loginRouter = require('./server/routes/loginRoutes');
const userRouter = require('./server/routes/userRoutes');
const tagRouter = require('./server/routes/tagRoutes');
const adminRouter = require('./server/routes/adminRoutes');
const { validateUserToken } = require('./server/controllers/userController');
const ServerAddress = require('./serverAddress');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
require('./server/routes/socketio')(io);
// mongoose.connect('mongodb://admin:admin@localhost:27017/Brainter');
const transporter = nodeMailer.createTransport('smtps://no-reply@brainter.study:F1UZgi8nU2LOHnyDXcRE@poczta.mydevil.net/?pool=true');
//Hasło do maila no-reply@brainter.study - F1UZgi8nU2LOHnyDXcRE

// for build
mongoose.connect('mongodb://mo1292_brainters:yHcRxwQRcYWFrVmrQDG2@mongo22.mydevil.net/mo1292_brainters');

mongoose.Promise = global.Promise;

app.use(express.static('public'));
app.use('/uploads', [validateUserToken, express.static(`${__dirname}/uploads`)]);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: './uploads/' }).single('file'));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api', loginRouter);
app.use('/api', tagRouter);
app.use('/api', userRouter);
app.use('/api', adminRouter);
app.use('*', (req, res) => {
  res.cookie('redirect', req.originalUrl, { maxAge: 5000 });
  res.redirect('/');
});
// http.listen(ServerAddress.apiPort, ServerAddress.server || '127.0.0.1', () => console.log('Listening on port 8080!'));
// for build
http.listen(ServerAddress.apiPort, () => console.log('Listening on port 8080!'));
