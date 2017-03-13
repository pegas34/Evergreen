function PageConstants() {
    this.bgSlider    = '#bg-slider';
    this.header      = 'header';
    this.langBlock   = '.language-block';
    this.langCurrent = '#language-current';
    this.langItems   = '.language-hide span';
    this.formFields  = 'form input, form select';
    this.fieldPrice  = 'form select';
    this.fieldBulk   = 'form input[name="bulk"]';
    this.fieldCost   = 'form input[name="cost"]';
    this.fieldArea   = 'form input[name="area"]';
    this.calcTotal   = '#calc-total';

    this.classes     = {
        none       : 'dnone',
        smallPrice : 'small-price',
        langUp     : 'lang-up',
        langShow   : 'language-show'
    };

    this.bgSliderImg = [
        'img/bg-header.jpg',
        'img/bg-header2.jpg',
        'img/bg-header3.jpg',
        'img/bg-header4.jpg',
        'img/bg-header5.jpg',
        'img/bg-header6.jpg',
        'img/bg-header7.jpg'
    ];
    this.sliderCycle = 5000;
    this.sliderAnim  = 1000;

    this.errors      = {
        notNumber : 'Разрешены только цифры',
        limit     : 'Больше нельзя вводить символы'
    };
}

function PageController(pageConstants) {
    var sliderCount1 = 0,
        sliderCount2 = 1;

    this.init = function() {
        this.bgSliderStart();
        this.formFieldsHandler(this.formCheck);
        this.checkLang();
        this.langBlockHandler();
        this.langChooseItemHandler(this.langChooseClick);
    };

/************************************************
    Calculate Form
************************************************/
    this.formFieldsHandler = function(callback) {
        $(pageConstants.formFields).on('change keyup keydown input click paste', function() {
            callback($(this)); //formCheck
        });
    };

    this.formCheck = function(item) {
        if (item.context.localName != 'select') {
            validateField(item);
        } else {
            formCalculate();
        }
    };

    var validateField = function(item) {
        var re      = /[^0-9]/g,
            itemVal = item.val();

        if (itemVal.length >= item.attr('maxlength')) {
            item.next().text(pageConstants.errors.limit).removeClass(pageConstants.classes.none);
        } else if (itemVal.match(re)) {
            item.val(itemVal.replace(re, ''));
            item.next().text(pageConstants.errors.notNumber).removeClass(pageConstants.classes.none);
        } else {
            if (!item.next().hasClass()) {
                item.next().addClass(pageConstants.classes.none);
            }
            formCalculate();
        }
    };

    var formCalculate = function () {
        var price = Number($(pageConstants.fieldPrice).val()),
            bulk  = Number($(pageConstants.fieldBulk).val()) / 10,
            cost  = Number($(pageConstants.fieldCost).val()),
            area  = Number($(pageConstants.fieldArea).val()),
            sum   = price * bulk * area - cost * area;

        if (sum > 999999999) {
            $(pageConstants.calcTotal).addClass(pageConstants.classes.smallPrice);
        } else {
            $(pageConstants.calcTotal).removeAttr('class');
        }
        $(pageConstants.calcTotal).text(String(Math.floor(sum)).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '));
    };

/************************************************
    Background Slider
************************************************/
    this.bgSliderStart = function() {
        var bgSlider = $(pageConstants.bgSlider);

        if (bgSlider.find('span').length == 0) {
            bgSlider.append('<span></span>');
        }

        setInterval(bgSliderCycle, pageConstants.sliderCycle);
    };

    var bgSliderCycle = function(){
        var bgSliderBlock = $(pageConstants.bgSlider),
            bgSliderSpan = bgSliderBlock.find('span');

        bgSliderSpan.animate({'opacity':'1'}, pageConstants.sliderAnim, function() {
            sliderCount1++;
            if (sliderCount1 > (pageConstants.bgSliderImg.length-1)) {
                sliderCount1 = 0;
            }

            sliderCount2 = sliderCount1 + 1;
            if (sliderCount2 > (pageConstants.bgSliderImg.length-1)) {
                sliderCount2 = 0;
            }

            bgSliderSpan.css({'background-image': 'url(' + pageConstants.bgSliderImg[sliderCount2] + ')', opacity: 0});
            bgSliderBlock.css({'background-image': 'url(' + pageConstants.bgSliderImg[sliderCount1] + ')'});
        });
    };

/************************************************
    Language Block
************************************************/
    this.checkLang = function() {
        if (typeof localStorage['lang_test1'] != 'undefined') {
            var currentLang = localStorage['lang_test1'];

            $(pageConstants.langCurrent).text(currentLang);
            $(pageConstants.langItems).removeAttr('class');
            $('[data-lang="' + currentLang + '"]').addClass(pageConstants.classes.none);
        }
    };

    this.langBlockHandler = function () {
        $(pageConstants.langBlock).on({
            mouseenter: function() {
                langBlockShow($(this));
            },
            mouseleave: function() {
                langBlockHide($(this));
            }
        });
    };

    var langBlockShow = function(item) {
        $(pageConstants.header).addClass(pageConstants.classes.langUp);
        item.addClass(pageConstants.classes.langShow);
    };

    var langBlockHide = function(item) {
        $(pageConstants.header).removeClass(pageConstants.classes.langUp);
        item.removeClass(pageConstants.classes.langShow);
    };

    this.langChooseItemHandler = function(callback) {
        $(pageConstants.langItems).on('click', function () {
            callback($(this)); //langChooseClick
        });
    };

    this.langChooseClick = function(item) {
        var chooseLang = item.text();

        $(pageConstants.langCurrent).text(chooseLang);
        $(pageConstants.langItems).removeAttr('class');
        item.addClass(pageConstants.classes.none);
        langBlockHide($(pageConstants.langBlock));
        localStorage['lang_test1'] = chooseLang;
    };

}

$(function() {
    var pageConstants  = new PageConstants();
    var pageController = new PageController(pageConstants);

    pageController.init();
});
