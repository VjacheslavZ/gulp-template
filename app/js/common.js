// validation
$(document).ready(function () {
    //  Отправка форм
    // initialize tooltipster on text input elements
    $('input:not("[type=submit], [type=hidden], [type=file]")').tooltipster({
        trigger: 'none', // чтобы при ховере и клике не вылетало окошко с ошибкой ставим none. Либо hover/click по надобности
        position: 'bottom',
        theme: 'tooltipster-shadow',
        functionPosition: function (instance, helper, position) {
            position.coord.top -= 10;
            return position;
        }
    });

    $('form').tooltipster({
        trigger: 'none',
        position: 'top',
        animation: 'grow',
        theme: 'tooltipster-shadow'
    });

    $('input[type=file]').tooltipster({
        trigger: 'none', // чтобы при ховере и клике не вылетало окошко с ошибкой ставим none. Либо hover/click по надобности
        position: 'bottom',
        theme: 'tooltipster-shadow',
        functionPosition: function (instance, helper, position) {
            position.coord.top -= 10;
            return position;
        }
    });

    $('textarea').tooltipster({
        trigger: 'none', // чтобы при ховере и клике не вылетало окошко с ошибкой ставим none. Либо hover/click по надобности
        position: 'bottom',
        theme: 'tooltipster-shadow',
        functionPosition: function (instance, helper, position) {
            position.coord.top -= 10;
            return position;
        }
    });

    $.validator.addMethod("extension", function (value, element, param, size) {
        param = typeof param === "string" ? param.replace(/,/g, "|") : "png|jpe?g|gif|txt|pdf|docx|doc|xlsx";
        return this.optional(element) || value.match(new RegExp("\\.(" + param + ")$", "i"));
    }, $.validator.format("Выберите файл с правильным расширением."));

    $.validator.addMethod('filesize', function (value, element, param) {
        return this.optional(element) || ((element.files[0].size / 1024).toFixed(0) <= param)
    }, 'Размер файла не должен превышать 10 мегабайт');

    $.validator.addMethod('customphone', function (value, element) {
        return this.optional(element) || /^(\+|d+)*\d[\d\(\)\-]{4,14}\d$/.test(value);
    }, "Введите телефон в правильном формате");

    $.validator.addMethod('customemail', function (value, element) {
        return this.optional(element) || /^(([a-zA-Z0-9]|[!#$%\*\/\?\|^\{\}`~&'\+=-_])+\.)*([a-zA-Z0-9\-]|[!#$%\*\/\?\|^\{\}`~&'\+=-_])+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9-]+$/.test(value);
    }, "Введите правильный Email");

    $.validator.addMethod('customphonemask', function (value, element) {
        return this.optional(element) || /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/.test(value);
    }, "Введите телефон согласно маске");
    $.each($("form"), function () {
        $(this).validate({
            submit: true,
            errorPlacement: function (error, element) {
                var ele = $(element),
                    err = $(error),
                    msg = err.text();
                if (msg != null && msg !== "") {
                    ele.tooltipster('content', msg);
                    ele.tooltipster('show'); //open only if the error message is not blank. By default jquery-validate will return a label with no actual text in it so we have to check the innerHTML.
                    $(element).siblings('i').hide('fade');
                }
            },
            success: function (label, element) {
                $(element).tooltipster('hide');
                $(element).tooltipster('close');
                $(element).siblings('i').show('fade');
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).removeClass(errorClass).addClass(validClass).tooltipster('close');
            },
            rules: {
                name: {
                    required: true,
                },
                textarea: {
                    required: false, // не валидируется
                },
                email: {
                    required: true,
                    customemail: "customemail"
                },
                phone: {
                    required: true,
                    customphone: "customphone"
                },
                phone_mask: {
                    required: true,
                    customphonemask: "customphonemask"
                },
                field: {
                    required: true,
                    extension: "txt|pdf|docx|doc|xlsx|gif|png|jpeg|jpe|jpg",
                    filesize: 10000
                }
            },
            messages: {
                name: {
                    required: "Заполните поле"
                },
                textarea: {
                    required: "Заполните поле"
                },
                email: {
                    required: "Введите свой email"
                },
                phone: {
                    required: "Введите свой телефон"
                },
                phone_mask: {
                    required: "Введите свой телефон"
                },
                field: {
                    required: "Выберите файл"
                }
            },
            submitHandler: function (form) {
            }
        });
    });


    $("form:not('#form-file')").submit(function () {
        if ($(this).valid()) {
            let self = $(this);
            let data = self.serialize();
            $.ajax({
                type: "POST",
                url: "./mail.php",
                data: data,
                dataType: "json",
                beforeSend: function () { // событие до отправки
                    self.find('input[type="submit"]').attr('disabled', 'disabled'); // например, отключим кнопку, чтобы не жали по 100 раз
                },
                success: function (data) {
                    if (data['form_type'] == 'modal') {
                        $('.white-popup form').hide();
                        $('.white-popup .mfp-close').hide();
                        self.trigger('reset');
                        $('.white-popup .success_mail').addClass('active');
                        setTimeout(function () {
                            $.magnificPopup.close();
                        }, 2500);
                        setTimeout(function () {
                            $('.white-popup form').show();
                            $('.white-popup .mfp-close').show();
                            $('.white-popup .input_wrap i').hide();
                            $('.white-popup .success_mail').removeClass('active');
                            self.find('input[type="submit"]').attr('disabled', false);
                        }, 3500);
                    }
                    if (data['form_type'] == 'normal') { //надо писать в обычных формах <input type="hidden" name="form_type" value="normal">
                        self.trigger('reset');
                        $.magnificPopup.open({
                            items: {
                                src: $('#popup-success')
                            },
                            type: 'inline'
                        });
                        setTimeout(function () {
                            $.magnificPopup.close();
                            $('form').find('i').hide();
                            self.find('input[type="submit"]').attr('disabled', false);
                        }, 3000);
                    }
                }
            });
        }
        return false;
    });

//  Отправка форм с файлом вносим input[type=file]
    let files;
    $('input[type=file]').change(function () {
        files = this.files;
        //alert(files);
    });

    //  Отправка форм с файлом submit
    $("#form-file").on('submit', function (e) { // перехватываем все при событии отправки
        if ($(this).valid()) {
            let $data = new FormData(),
                form = $(this),
                $inputs = $("#form-file").find('input[type=hidden]'),
                $phone = $("#form-file").find('input[name=phone]'),
                $email = $("#form-file").find('input[name=email]'),
                $name = $("#form-file").find('input[name=name]'),
                $textarea = $("#form-file").find('textarea');

            $.each(files, function (key, value) {
                $data.append(key, value);
            });

            $.each($inputs, function (key, value) {
                $data.append($(this).attr('name'), $(this).val());
            });

            //добавление основных тестовых полей вместо serialize
            $data.append($textarea.attr('name'), $textarea.val());
            $data.append($phone.attr('name'), $phone.val());
            $data.append($email.attr('name'), $email.val());
            $data.append($name.attr('name'), $name.val());

            $.ajax({
                url: './mail.php',
                type: 'POST',
                contentType: false,
                processData: false,
                dataType: 'json',
                data: $data,
                beforeSend: function (loading) {
                    $('input[type=file]').tooltipster('content', "Файл загружается");
                    $('input[type=file]').tooltipster('show');
                },
                success: function (data) {
                    if (data['form_type'] == 'normal') { //надо писать в обычных формах <input type="hidden" name="form_type" value="normal">
                        $('input[type=file]').tooltipster('content', "Файл загружен!");
                        $('input[type=file]').tooltipster('show');
                        form.tooltipster('content', "Письмо отправлено!");
                        form.tooltipster('show');
                        setTimeout(function () {
                            form.trigger('reset');
                            form.find('i').hide();
                            files = undefined;
                            $('input[type=file]').tooltipster('hide');
                        }, 2000);
                        setTimeout(function () {
                            form.tooltipster('hide');
                        }, 3500);
                        // Вариант с показом модального окна с success
                        // $('input[type=file]').tooltipster('content', "Файл загружен!");
                        // $('input[type=file]').tooltipster('show');
                        // self.trigger('reset');
                        // $.magnificPopup.open({
                        // 	items: {
                        // 		src: $('#popup-success')
                        // 	},
                        // 	type: 'inline'
                        // });
                        // //$("body").css({ "overflow": "hidden", "padding-right": "17px" });
                        // setTimeout(function () {
                        // 	$.magnificPopup.close();
                        // 	$('form').find('i').hide();
                        // 	files = undefined;
                        // 	self.find('input[type="submit"]').attr('disabled', false);
                        // 	//$("body").css({ "overflow": "inherit", "padding-right": "0" });
                        // }, 3000);
                    }

                }
            });
        }
        return false;
    });


});
//modal
$(document).ready(function () {

    // инициализация tooltipster
    if (window.matchMedia("(min-width: 992px)").matches) {
        $(".header_modal a").tooltipster({
            plugins: ['follower'],
            theme: 'tooltipster-shadow'
        });
        $(".header_logo a").tooltipster({
            theme: 'tooltipster-light'
        });
    }

    // Определения браузера
    function get_name_browser() {

        const ua = navigator.userAgent;

        if (ua.search(/Edge/) > 0) return 'Edge';
        if (ua.search(/Chrome/) > 0) return 'Google Chrome';
        if (ua.search(/Firefox/) > 0) return 'Firefox';
        if (ua.search(/Opera/) > 0) return 'Opera';
        if (ua.search(/Safari/) > 0) return 'Safari';
        if (ua.search(/MSIE/) > 0) return 'Internet Explorer';
        if (ua.search(/Trident/) > 0) return 'Trident';

        return 'Не определен';
    }

    // Вешаем обработочик на свою кнопку close
    $(document).on("click", ".mfp-close", function () {
        let magnificPopup = $.magnificPopup.instance;
        magnificPopup.close();
    });

    // Открываем модальное окно
    $(".open-popup-link").click(function () {
        let id = $(this).attr('href');
        let txt = $(this).data('info');

        // var title =  $(this).data('title'); // для изменения title в модалке
        $(`.popup${id} input[name=form_name]`).val(txt);
        // $(`.popup${id} .modal-title`).html(title); // прописать в ссылку data-title="нужный title"
        if (window.matchMedia("(min-width: 992px)").matches) {
            if (get_name_browser() == "Google Chrome") {
                $("html").addClass("modal");
            }
        }
    });


    $('.open-popup-link').magnificPopup({
        type: 'inline',
        removalDelay: 200,
        callbacks: {
            beforeOpen: function () {
                this.st.mainClass = this.st.el.attr('data-effect');

                console.log(this.st.mainClass);

                $('input:not("[type=submit], [type=hidden], .select2-search__field")').removeClass('tooltipster-show').tooltipster('close');
            },
            close: function () {
                $('.white-popup i').hide();
                if (get_name_browser() == "Google Chrome") {
                    $("html").removeClass("modal");
                }

                $('input:not("[type=submit], [type=hidden], .select2-search__field")').removeClass('tooltipster-show').tooltipster('close');

                // Это код закрытия эффекта красивого при открытии и закрытии модалки
                // $(".cd-transition-layer").addClass("closing"),$("#popup").removeClass("visible"),$(".cd-transition-layer").children().one("webkitAnimationEnd oanimationend msAnimationEnd animationend", function () {
                //    $(".cd-transition-layer").removeClass("closing opening visible"),$(".cd-transition-layer").children().off("webkitAnimationEnd oanimationend msAnimationEnd animationend")
                // })
            },
            open: function () {
                $(".mfp-close-btn-in .mfp-close").tooltipster({
                    theme: 'tooltipster-light'
                });
            }
        },
        closeOnBgClick: true,
        closeOnContentClick: false,
        closeMarkup: '<button title="%title%" type="button" class="mfp-close"><i class="fa fa-close"></i></button>',
        tClose: 'Закрыть (Esc)',
    });




});

$(document).ready(function () {
    // инициализация select2
    // $(".select2").select2({
    //     //minimumResultsForSearch: -1, // выключам поле ввода поиска
    //     tags: false,
    //     width: null
    // });

    // $(".select2-tags").select2({
    //     tags: true,
    //     placeholder: "Выберите один или несколько тегов",
    //     width: null // если null то будет шириной родителя
    // });

    // var MobileDetect = require("mobile-detect");
    // var MobileDetect = require("../libs/libs").mobileDetect();
    // var md = new MobileDetect(window.navigator.userAgent);

    // if (md.userAgent() == "Safari" && md.mobile() == "iPhone" || md.mobile() == "iPad") {
    //     $("html,body").css("overflow", "hidden !important");
    // }

    // Select в модальном окне
    // $(document).click(function () {
    //     $('.slct').removeClass('active');
    //     $('.slct_arrow').removeClass('active');
    //     $('.slct').parent().find('.drop').slideUp("fast");
    // });

    // $('.slct').click(function () {
    //     /* Заносим выпадающий список в переменную */
    //     var dropBlock = $(this).parent().find('.drop');
    //     //  закрываем все открытые
    //     $('.slct').removeClass('active').parent().find('.drop').slideUp("fast");
    //
    //     /* Делаем проверку: Если выпадающий блок скрыт то делаем его видимым*/
    //     if (dropBlock.is(':hidden')) {
    //         dropBlock.slideDown();
    //
    //         /* Выделяем ссылку открывающую select */
    //         $(this).addClass('active');
    //         $(this).siblings(".slct_arrow").addClass('active');
    //
    //
    //         /* Работаем с событием клика по элементам выпадающего списка */
    //         $('.drop').find('li').off("click").click(function () {
    //
    //             /* Заносим в переменную HTML код элемента
    //              списка по которому кликнули */
    //             var selectResult = $(this).html();
    //
    //             /* Находим наш скрытый инпут и передаем в него
    //              значение из переменной selectResult */
    //             $(this).parent().parent().find('input').val(selectResult);
    //
    //             /* Передаем значение переменной selectResult в ссылку которая
    //              открывает наш выпадающий список и удаляем активность */
    //             $(this).parent().parent().find(".slct").removeClass('active').html(selectResult);
    //             $(".slct_arrow").removeClass('active');
    //
    //             /* Скрываем выпадающий блок */
    //             dropBlock.slideUp();
    //         });
    //
    //         /* Продолжаем проверку: Если выпадающий блок не скрыт то скрываем его */
    //     } else {
    //         $(this).removeClass('active');
    //         $(".slct_arrow").removeClass('active');
    //         dropBlock.slideUp();
    //     }
    //
    //     /* Предотвращаем обычное поведение ссылки при клике */
    //     return false;
    // });

    //E-mail Ajax Send
    $("form.callback").submit(function() { //Change

        let th = $(this);

        $.ajax({
            type: "POST",
            url: "mail.php", //Change
            data: th.serialize()
        }).done(function() {
            $(th).find(".success").addClass("active").css("display", "flex").hide().fadeIn();
            setTimeout(function() {
                // Done Functions
                $(th).find(".success").removeClass("active").fadeOut();
                th.trigger("reset");
            }, 3000);
        });
        return false;
    });

    // Инициализация маски в input
    $(".mask").mask("+38(999) 999-99-99");

    //mob menu
    $("#my-menu").mmenu({
        extensions: ["theme-black", "effect-menu-slide", "pagedim-black"],
        offCanvas: {
            position: "right"
        }
    });

    //   Get the API
    var api = $("#my-menu").data("mmenu");

    //   Hook into methods
    api.bind("open:finish", function() {
        $(".hamburger").addClass("is-active")
    }).bind("close:finish", function () {
        $(".hamburger").removeClass("is-active")
    })

    //styling select
    $("select").selectize({
        create: true,
        sortText: "text",
    });

    //hide preloader
    $(".loader_inner").fadeOut("slow");
    $(".loader").fadeOut("slow");

    //com
});




