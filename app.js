let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let expressSession = require('express-session');
let bodyParser = require('body-parser');
let ueditor = require('ueditor');
let favicon = require('serve-favicon');


let logger = require('morgan');

const cookieSecret = require('./utils/cookieSecret');
const crossDomain = require('./utils/crossDomain');


let app = express();

app.all('*', crossDomain);  //跨域处理（不建议用）


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(favicon(__dirname + '/public/img/favicon.ico'));

app.use(bodyParser.urlencoded({extended: true, limit: '100000kb'}));
app.use(bodyParser.json({limit: '100000kb'}));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cookieParser());
app.use(expressSession({
    secret: cookieSecret.cookieSecret,
    resave: false,
    cookie: {maxAge: 1000 * 60 * 60 * 12 * 7},
    saveUninitialized: false,
    name: 'userinfo'
}));

app.use(express.static(path.join(__dirname, 'public'))); // 映射公共文件到public

app.use(express.static(path.join(__dirname, 'static'))); // 映射文件static目录

app.use(express.static(path.join(__dirname, 'admin'))); // 映射文件admin目录

app.use(require('./bussiness/index').publicData); // 侧边栏 数据

app.use(require('./routes/index')); // 处理首页方面的路由

app.use(require('./routes/admin')); // 处理管理员方面的路由

app.use(require('./routes/user')); // 处理用户方面的路由

app.use(require('./routes/notes')); // 处理随笔方面的路由

app.use(require('./routes/showreel')); // 处理作品集方面的路由

app.use(require('./routes/album')); // 处理相册方面的路由

app.use("/ue/upload", ueditor(path.join(__dirname, 'static'), function (req, res, next) {
    //客户端上传文件设置
    var imgDir = 'ue_upload/images/' + (new Date().getFullYear() + '' + ltTenFun(new Date().getMonth() + 1)) + '/' + ltTenFun(new Date().getDate()) + '/';
    var ActionType = req.query.action;
    if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
        var file_url = imgDir;//默认图片上传地址
        /*其他上传格式的地址*/
        if (ActionType === 'uploadfile') {
            file_url = 'ue_upload/file/' + (new Date().getFullYear() + '' + ltTenFun(new Date().getMonth() + 1)) + '/' + ltTenFun(new Date().getDate()) + '/'; //附件
        }
        if (ActionType === 'uploadvideo') {
            file_url = 'ue_upload/video/' + (new Date().getFullYear() + '' + ltTenFun(new Date().getMonth() + 1)) + '/' + ltTenFun(new Date().getDate()) + '/'; //视频
        }
        res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = imgDir;
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/static/ueditor/nodejs/config.json');
    }

    function ltTenFun(num) {
        if (num > 10) {
            return num;
        } else {
            return '0' + num;
        }
    }
}));

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
