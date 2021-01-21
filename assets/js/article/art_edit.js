$(function () {
    var layer = layui.layer;
    var form = layui.form;

    // 0.设置表单信息
    // 用等号切割，然后使用后面的值
    // alert(location.search.split("=")[1]);
    function initForm() {
        var id = location.search.split("=")[1];
        $.ajax({
            type: "GET",
            url: "/my/article/" + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章失败！")
                }
                // 渲染到 form 表单
                form.val("form-edit", res.data);
                // tinymce赋值 （百度查询）
                tinyMCE.editors[0].setContent(res.data.content);
                // 图片
                if (!res.data.cover_img) {
                    return layer.msg("用户未曾上传头像！")
                }
                var newImgURL = baseURL + res.data.cover_img;
                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src', newImgURL)  // 重新设置图片路径
                    .cropper(options)        // 重新初始化裁剪区域
            }
        });
    }


    // 1.初始化分类
    initCate();
    // 封装函数
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                // 获取成功
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr);
                // 重新渲染表单
                form.render();
                // 文章分类渲染完毕再调用，初始化form
                initForm();
            }
        });
    }

    // 2.初始化富文本编辑器
    initEditor()

    // 3.1 初始化图片裁剪器
    var $image = $('#image')

    // 3.2 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3.3 初始化裁剪区域
    $image.cropper(options)

    // 4.点击 选择封面按钮 选择图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    // 5.设置图片
    $('#coverFile').on('change', function (e) {
        // console.log("ok");
        // 拿到用户选择的图片
        var file = e.target.files[0]
        // 非空校验
        if (file == undefined) {
            return;
        }
        // 根据选择的文件，创建对应的 URL地址
        var newImgURL = URL.createObjectURL(file)
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 6.设置状态
    var state = "已发布";
    $('#btnSave2').on('click', function () {
        state = "草稿"
    })

    // 添加文章
    $('#form-pub').on('submit', function (e) {
        // 阻止表单默认提交事件
        e.preventDefault();
        console.log("ok");
        // 创建 FOrmData 对象，收集数据
        var fd = new FormData(this);
        // 放入状态
        fd.append('state', state);
        // 放入图片
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                // 发送 ajax 要在 toBlob 中
                publistArticle(fd)
            })
    })

    // 封装 添加文章的方法
    function publistArticle(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/edit",
            // FormData类型数据ajax提交，需要设置两个 false
            contentType: false,
            processData: false,
            data: fd,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改文章失败！')
                }
                // 发布文章成功
                layer.msg('修改文章成功!');
                // 跳转
                setTimeout(function () {
                    window.parent.document.getElementById('art_cate').click();
                }, 1500)
            }
        });
    }
})