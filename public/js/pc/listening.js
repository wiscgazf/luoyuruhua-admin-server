/*header  listening  is show or hidden*/
window.onscroll = function (e) {
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    if (scrollTop > 100) {
        document.getElementsByClassName('header')[0].style.opacity = '0';
        document.getElementsByClassName('header')[0].style.transform = 'translateY(-70px)';
    } else {
        document.getElementsByClassName('header')[0].style.opacity = '1';
        document.getElementsByClassName('header')[0].style.transform = 'translateY(0)';
    }
}

/*channel selected*/
function GetUrlRelativePath() {
    var url = document.location.toString();
    var arrUrl = url.split("//");

    var start = arrUrl[1].indexOf("/");
    var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符

    if (relUrl.indexOf("?") != -1) {
        relUrl = relUrl.split("?")[0];
    }
    return relUrl;
}

for (var i = 0; i < $('.channel ul>li').length; i++) {
    if ($('.channel>ul>li').eq(i).find('>a').attr('href') != '/') {
        if (GetUrlRelativePath().indexOf($('.channel>ul>li').eq(i).find('>a').attr('href')) != -1) {
            $('.channel>ul>li').eq(i).find('>a').css('background', '#f5f6f7');
        }
    }
}

// filter element
function unhtml(str) {
    return str ? str.replace(/[<">']/g, function (a) {
        return {
            '<': '&lt;',
            '"': '&quot;',
            '>': '&gt;',
            "'": '&#39;'
        }[a]
    }) : '';
}

/*init image width and height*/
function isImages(imgObj) {
    var imgBrowser = [];
    if (imgObj.length > 0) {
        for (var i = 0; i < imgObj.length; i++) {
            var img = new Image();
            var obj = {};
            img.src = $(imgObj[i]).attr('src');
            if (img.width > $(window).width()) {
                img.height = $(window).width() / img.width * img.height;
                img.width = $(window).width();
            }
            obj.src = img.src;
            obj.w = img.width;
            obj.h = img.height;
            imgBrowser.push(obj);
        }
    }
    return imgBrowser;
}