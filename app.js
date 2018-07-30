let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
// let expressSession = require('express-session');
let bodyParser = require('body-parser');
// let Cookies = require('cookies');


let logger = require('morgan');

const cookieSecret = require('./utils/cookieSecret');
const crossDomain = require('./utils/crossDomain');


let app = express();

app.all('*', crossDomain);  //跨域处理（不建议用）


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//app.use(bodyParser.urlencoded());

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cookieParser(cookieSecret.cookieSecret));
// app.use(expressSession({secret: cookieSecret.cookieSecret, name: "userInfo", cookie: {maxAge: 1000 * 60}}));// set session
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./routes/index')); // 处理首页方面的路由

app.use(require('./routes/admin')); // 处理管理员方面的路由

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('errors');
});

module.exports = app;
