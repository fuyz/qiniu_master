/**
 * Created by zhihe on 2017/2/20.
 */
    //获取uptoken
var uptoken = '', n = 1;
// (function getUptoken() {
//     $.ajax({
//         method: "get",
//         url: 'http://10.0.0.81:8000/qiniu/token',
//         dataType: 'json',
//         headers: {
//             "Content-Type": 'application/x-www-form-urlencoded'
//         },
//         timeout: 0,
//         success: function (data) {
//             console.log(data, data.uploadToken);
//             uptoken = data.uploadToken;
//             qiniu_config();
//         },
//         fail: function (err) {
//             console.log(err)
//         }
//     });
// })();
//七牛配置
qiniu_config();
function qiniu_config() {

    $(function () {
        var uploader = Qiniu.uploader({
            debug: false,
            runtimes: 'html5,flash,html4',
            browse_button: 'uploadImg',
            container: 'container',
            drop_element: 'container',
            max_file_size: '1000mb',
            flash_swf_url: 'bower_components/plupload/js/Moxie.swf',
            dragdrop: true,
            chunk_size: '4mb',
            multi_selection: !(mOxie.Env.OS.toLowerCase() === "ios"),

            uptoken: 'ywmWh0LlnPMPSra5TLWLthUG1BuFghjDACxcW2gm:uA9DpXkezCmMPjWX354rqJKXtFg=:eyJzY29wZSI6InRlbXAtcmVwb3J0IiwiZGVhZGxpbmUiOjE0ODgzNDg3NzZ9',
//            uptoken_url: $('#uptoken_url').val(),
            uptoken_func: function () {

            },
            domain: 'http://img.zhihemedia.com/',
            get_new_uptoken: false,
            // downtoken_url: '/downtoken',
            unique_names: false,
            save_key: false,
            // x_vars: {
            //     'id': '1234',
            //     'time': function(up, file) {
            //         var time = (new Date()).getTime();
            //         // do something with 'time'
            //         return time;
            //     },
            // },
            auto_start: true,
            log_level: 5,
            init: {
                'FilesAdded': function (up, files) {
                    $('table').show();
                    $('#success').hide();
                    plupload.each(files, function (file) {
                        // console.info('FilesAdded:');
                        // console.info(file);
                        var progress = new FileProgress(file, 'fsUploadProgress');
                        progress.setStatus("等待...");
                        progress.bindUploadCancel(up);
                    });
                },
                'BeforeUpload': function (up, file) {
                    // console.info('BeforeUpload:');
                    // console.info(up, file);
                    file.name = setPicName();
                    var progress = new FileProgress(file, 'fsUploadProgress');
                    var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                    if (up.runtime === 'html5' && chunk_size) {
                        progress.setChunkProgess(chunk_size);
                    }
                },
                'UploadProgress': function (up, file) {
                    var progress = new FileProgress(file, 'fsUploadProgress');
                    var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                    progress.setProgress(file.percent + "%", file.speed, chunk_size);
                },
                'UploadComplete': function () {
                    $('#success').show();
                },
                'FileUploaded': function (up, file, info) {
                    var progress = new FileProgress(file, 'fsUploadProgress');
                    progress.setComplete(up, info);
                    var domain = up.getOption('domain');
                    var res = $.parseJSON(info);
                    var sourceLink = domain + res.key; //获取上传成功后的文件的Url
                    console.info(domain, res, sourceLink);

                    //如果图片存在
                    // reportData.reportImages.push({
                    //     "name": res.key,
                    //     "imageOrder": n++
                    // })
                },
                'Error': function (up, err, errTip) {
                    $('table').show();
                    var progress = new FileProgress(err.file, 'fsUploadProgress');
                    progress.setError();
                    progress.setStatus(errTip);
                },
                'Key': function (up, file) {
                    var key = setPicName();
                    // do something
                    // with key
                    return key;
                }
            }
        });

        uploader.bind('FileUploaded', function () {
            console.log('图片上传成功！');
        });

        $('#container').on('dragenter', function (e) {
            e.preventDefault();
            $('#container').addClass('draging');
            e.stopPropagation();
        }).on('drop', function (e) {
            e.preventDefault();
            $('#container').removeClass('draging');
            e.stopPropagation();
        }).on('dragleave', function (e) {
            e.preventDefault();
            $('#container').removeClass('draging');
            e.stopPropagation();
        }).on('dragover', function (e) {
            e.preventDefault();
            $('#container').addClass('draging');
            e.stopPropagation();
        });

        $('#show_code').on('click', function () {
            $('#myModal-code').modal();
            $('pre code').each(function (i, e) {
                hljs.highlightBlock(e);
            });
        });
        //
        // $('body').on('click', 'table button.btn', function () {
        //     $(this).parents('tr').next().toggle();
        // });
        //
        // var getRotate = function (url) {
        //     if (!url) {
        //         return 0;
        //     }
        //     var arr = url.split('/');
        //     for (var i = 0, len = arr.length; i < len; i++) {
        //         if (arr[i] === 'rotate') {
        //             return parseInt(arr[i + 1], 10);
        //         }
        //     }
        //     return 0;
        // };
        //
        // $('#myModal-img .modal-body-footer').find('a').on('click', function () {
        //     var img = $('#myModal-img').find('.modal-body img');
        //     var key = img.data('key');
        //     var oldUrl = img.attr('src');
        //     var originHeight = parseInt(img.data('h'), 10);
        //     var fopArr = [];
        //     var rotate = getRotate(oldUrl);
        //     if (!$(this).hasClass('no-disable-click')) {
        //         $(this).addClass('disabled').siblings().removeClass('disabled');
        //         if ($(this).data('imagemogr') !== 'no-rotate') {
        //             fopArr.push({
        //                 'fop': 'imageMogr2',
        //                 'auto-orient': true,
        //                 'strip': true,
        //                 'rotate': rotate,
        //                 'format': 'png'
        //             });
        //         }
        //     } else {
        //         $(this).siblings().removeClass('disabled');
        //         var imageMogr = $(this).data('imagemogr');
        //         if (imageMogr === 'left') {
        //             rotate = rotate - 90 < 0 ? rotate + 270 : rotate - 90;
        //         } else if (imageMogr === 'right') {
        //             rotate = rotate + 90 > 360 ? rotate - 270 : rotate + 90;
        //         }
        //         fopArr.push({
        //             'fop': 'imageMogr2',
        //             'auto-orient': true,
        //             'strip': true,
        //             'rotate': rotate,
        //             'format': 'png'
        //         });
        //     }
        //
        //     $('#myModal-img .modal-body-footer').find('a.disabled').each(function () {
        //
        //         var watermark = $(this).data('watermark');
        //         var imageView = $(this).data('imageview');
        //         var imageMogr = $(this).data('imagemogr');
        //
        //         if (watermark) {
        //             fopArr.push({
        //                 fop: 'watermark',
        //                 mode: 1,
        //                 image: 'http://www.b1.qiniudn.com/images/logo-2.png',
        //                 dissolve: 100,
        //                 gravity: watermark,
        //                 dx: 100,
        //                 dy: 100
        //             });
        //         }
        //
        //         if (imageView) {
        //             var height;
        //             switch (imageView) {
        //                 case 'large':
        //                     height = originHeight;
        //                     break;
        //                 case 'middle':
        //                     height = originHeight * 0.5;
        //                     break;
        //                 case 'small':
        //                     height = originHeight * 0.1;
        //                     break;
        //                 default:
        //                     height = originHeight;
        //                     break;
        //             }
        //             fopArr.push({
        //                 fop: 'imageView2',
        //                 mode: 3,
        //                 h: parseInt(height, 10),
        //                 q: 100,
        //                 format: 'png'
        //             });
        //         }
        //
        //         if (imageMogr === 'no-rotate') {
        //             fopArr.push({
        //                 'fop': 'imageMogr2',
        //                 'auto-orient': true,
        //                 'strip': true,
        //                 'rotate': 0,
        //                 'format': 'png'
        //             });
        //         }
        //     });
        //
        //     var newUrl = Qiniu.pipeline(fopArr, key);
        //
        //     var newImg = new Image();
        //     img.attr('src', 'images/loading.gif');
        //     newImg.onload = function () {
        //         img.attr('src', newUrl);
        //         img.parent('a').attr('href', newUrl);
        //     };
        //     newImg.src = newUrl;
        //     return false;
        // });

    });
}
//設置圖片名字
function setPicName() {
    var picSort = 're', time = new Date(), str = 'qwertyuioplkjhgfdsazxcvbnm', letters = '';
    timeSecond = time.getTime();
    for (var n = 0; n < 6; n++) {
        var random = Math.floor(Math.random() * 26);
        letters += str[random];
    }
    console.log(picSort + timeSecond + letters);
    return picSort + timeSecond + letters+'.jpg';
}

