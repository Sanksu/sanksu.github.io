// 浏览器搞笑标题
var OriginTitle = document.title;
var titleTime;
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        $('[rel="icon"]').attr('href', "/img/.png");
        document.title = '╭(°A°`)╮页面崩溃啦 ~';
        clearTimeout(titleTime);
    }
    else {
        $('[rel="icon"]').attr('href', "/img/favicon.png");
        document.title = '噫又好啦|' + OriginTitle;
        titleTime = setTimeout(function () {
            document.title = OriginTitle;
        }, 1000);
    }
});