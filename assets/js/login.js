// 入口函数
$(function () {
    // 1.点击“去注册账号的链接”
    $('#link_reg').on('click', function () {
        $('.login_box').hide();
        $('.reg_box').show();
    })
    // 2.点击“去登录账号的链接”
    $('#link_login').on('click', function () {
        $('.reg_box').hide();
        $('.login_box').show();
    })
    // 3.自定义验证规则
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,16}$/,
            // 提示信息
            "密码必须6-16位，且不能输入空格"
        ],
        // 确认密码规则 
        repwd: function (val) {
            // 先获取密码框的内容
            // val 是确认密码框里的值
            var pwd = $('.reg_box [name=password]').val().trim();
            // 比较
            if (pwd !== val) {
                return "两次密码不一致"
            }

        }
    })
    // 4.注册表单添加提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/api/reguser",
            data: {
                username: $('#form_reg [name=username]').val().trim(),
                password: $('#form_reg [name=password]').val().trim(),
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg("注册成功,请您登录！")
                // 注册成功以后手动添加去往登录页面的点击事件
                $('#link_login').click();
                $('#form_reg')[0].reset();
            }
        });
    })
    // 5.登录表单添加提交事件
    $('#form_login').on('submit', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/api/login",
            // 快速获取表单内容
            data: $(this).serialize(),
            success: function (res) {
                // 校验返回状态
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 成功后提示信息
                layer.msg('恭喜您，登录成功！')
                // 保存token ， 为了的接口要使用 token
                localStorage.setItem("token", res.token)
                // 跳转到 index 页面
                location.href = "/index.html";
            }
        });
    })
})