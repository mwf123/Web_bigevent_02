$(function () {
    var layer = layui.layer;
    var form = layui.form; //导入 form
    // 封装给时间补零函数
    function padZero(n) {
        return n < 10 ? '0' + n : n;
    }
    // 为 art-template 定义时间过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }
    // 1.定义提交的参数
    var q = {
        pagenum: 1,  //页码值
        pagesize: 2,  //每页显示多少条数据
        cate_id: "",  //文章分类的 Id
        state: "",  //文章的状态，可选值有：已发布、草稿
    }
    // 2.初始化文章列表
    initTable();
    // 封装函数
    function initTable() {
        // 发送 ajax 初始化文章列表
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 获取成功  渲染数据
                var strHtml = template('tpl-table', res)
                $('tbody').html(strHtml);
                // console.log(res.total);
                // 调用分页
                renderPage(res.total)
            }
        });
    }

    // 3.初始化分类
    initCate();
    // 封装函数
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                // 校验
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                // 获取成功 赋值并渲染 form
                // console.log("ok");
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通过 layui 重新渲染表单区域的 UI 结构
                form.render();

            }
        });
    }

    // 4.筛选功能
    $('#form-search').on('submit', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // 获取值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 赋值
        q.cate_id = cate_id;
        q.state = state;
        // 初始化文章列表
        initTable();
    })

    // 5.分页
    var laypage = layui.laypage;
    function renderPage(total) {
        // 执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页几条
            curr: q.pagenum, //第几页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                //首次不执行
                if (!first) {
                    //do something
                    // 初始化文章列表
                    initTable();
                }
            }
        });
    }

    // 6.删除 (事件委托)
    $('tbody').on('click', '.btn-delete', function () {
        // 先获取id
        var Id = $(this).attr('data-id');
        // 显示对话框
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg("删除失败！")
                    }
                    // 删除成功 重新渲染列表
                    initTable();
                    layer.msg("删除成功!")
                    // 页面汇总删除按钮个数等于1 ，页码大于1
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                }
            });
            layer.close(index);
        });

    })
})