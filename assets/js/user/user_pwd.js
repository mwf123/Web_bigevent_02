$(function () {
    // 1.定义校验规则
    var form = layui.form;
    form.verify({
        // 所有密码
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 新密码 (新旧密码不能重复)
        newPwd: function (value) {
            if (value === $("[name=oldPwd]").val()) {
                return "新密码和原密码不能一致！"
            }
        },
        // 确认密码 (两次密码必须相同)
        rePwd: function (value) {
            if (value !== $("[name=newPwd]").val()) {
                return "两次密码输入不一致！"
            }
        }
    })
    // 2.表单提交
    var layer = layui.layer;
    $('.layui-form').on('submit', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 修改密码成功
                layer.msg("修改密码成功!")
                // 清空内容
                $('.layui-form')[0].reset();
            }
        });
    })
})