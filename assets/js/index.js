$(function () {
    // 1.获取用户信息
    getUserinfo();

    // 2.退出
    var layer = layui.layer;
    $('#btnlogout').on('click', function () {
        // 框架提供的询问框
        layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 1、清空本地 token
            localStorage.removeItem('token');
            // 2.页面跳转
            location.href = "/login.html";
            // 3.关闭询问框
            layer.close(index);
        });
    })
})

// 获取用户信息并渲染页面
// 因为后面其他页面还要调用，所以封装为全局函数
function getUserinfo() {
    // 发送ajax
    $.ajax({
        url: "/my/userinfo",
        // headers: {
        //     // 重新登录因为token事件过期12小时
        //     Authorization: localStorage.getItem("token") || ""
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                // console.log(res);
                return layui.layer.msg(res.message)
            }
            // 获取成功渲染头像
            renderAvatar(res.data);
        }
    });
}

// 渲染头像
function renderAvatar(user) {
    // 1.渲染名称（nickname 优先 如果没有就用 username）
    var name = user.nickname || user.username;
    $('#welcome').html("欢迎 " + name);
    // 2.渲染头像
    if (user.user_pic !== null) {
        // 有头像
        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('.text_avatar').hide();
    } else {
        $('.layui-nav-img').hide()
        var text = name[0].toUpperCase();//toUpperCase() 把所有字符都转成大写
        $('.text_avatar').show().html(text);
    }
}
