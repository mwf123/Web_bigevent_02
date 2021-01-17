


// 开发环境服务器地址
var baseURL = 'http://api-breakingnews-web.itheima.net';
// 所有 ajax 函数发送出去之前都会调用这个函数
$.ajaxPrefilter(function (options) {
    // 1.添加根路径
    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    options.url = baseURL + options.url;

    // 2.身份认证 对需要权限的接口配置头信息
    // 必须 以 my 开头才行
    if (options.url.indexOf("/my/") !== -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || ""
        }
    }

    // 3.拦截所有响应，判断身份认证信息 
    options.complete = function (res) {
        console.log(res.responseJSON);
        var obj = res.responseJSON;
        if (obj.status === 1 && obj.message === '身份认证失败！') {
            // 1、清空本地 token
            localStorage.removeItem('token');
            // 2.页面跳转
            location.href = "/login.html";
        }
    }
})