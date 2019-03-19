const express = require('express');
const app = express();
const server = require('http').createServer(app);
const request = require('request-promise');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const port = process.env.PORT;
const dotenv = require('dotenv').config();
const morgan = require('morgan')

mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(expressValidator({}));
app.use(morgan('dev'));

mongoose.connect(process.env.DB);
console.log(process.env.DB)


const userRoutes = require('./routes/user');
const visitRoutes = require('./routes/visit')

app.use('/user', userRoutes);
app.use('/visit', visitRoutes);

app.start = app.listen = function(){
    return server.listen.apply(server, arguments)
};

app.start(process.env.PORT, () => {
    console.log('wifi-capture-api has started ')
});
