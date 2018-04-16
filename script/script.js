var $fionaBar = $('#fionaBar');
var $fionaBarCaret = $('.fiona-bar-caret');
var $album = $('#album');
var $listItem = $('#album .fiona-list-item');
var $fionaList = $('#fionaList');
var $fionaMe = $('#fionaMe');
var $goBack = $('#goBack');

var isFixed = false;
var total = 9;

// slider
var $sliderCurrent = $('#sliderCurrent');
var $prevArrow = $('#prevArrow');
var $nextArrow = $('#nextArrow');
var $sliderImgs = $('#sliderImgs');
var $sliderContent = $('#sliderImgs .fiona-slider-content');
var $sliderCube = $('#sliderImgs .fiona-slider-cube');

var slider = true;
var sliderWrapperWidth = $sliderImgs.width();
var sliderWidth = sliderWrapperWidth * 0.8;
var loading = false;
var index = 0;

var images = ['141213_Blooming.jpg', '150322_Fan.jpg', '150326_Plaisir.jpg'];

// bar的处理
function fixedBar(scrollTop) {
    if (scrollTop > 105 && !isFixed) {
        $fionaBar.css({
            position: 'fixed',
            top: 0,
            boxShadow: '0 2px 9px rgba(175, 173, 173, 0.42)'
        });
        isFixed = true;
    }
    if (scrollTop <= 105 && isFixed) {
        $fionaBar.css({
            position: 'absolute',
            top: '105px',
            boxShadow: 'none'
        });
        isFixed = false;
    }
}

// 添加
function appendNewAlbum() {
    var template = '<li class="fiona-list-item">'
                + '<a href="javascript:void(0);">'
                +    '<div class="fiona-item-mask">'
                +        '<p>乔迁之喜</p>'
                +        '<p>Blooming</p>'
                +    '</div>'
                + '</a>'
            + '</li>';
    var result = '';
    for (var i = 0; i < 9; i++) {
        result += template;
    }
    total += 9;
    $album.append($(result));
}

// 动态加载图片
function loadImgOnScroll(scrollTop) {
    var albumBottom = $album.offset().top + $album.height();
    var visibleHeight = $(window).height();

    if (scrollTop + visibleHeight >= albumBottom) {
        appendNewAlbum();
    }
}

document.addEventListener('scroll', function(e) {

    if (slider) {
        e.preventDefault();
        return false;
    }

    var scrollTop = $(document).scrollTop();

    // 顶部bar
    fixedBar(scrollTop);

    if (total < 26) {
        // 动态加载
        loadImgOnScroll(scrollTop);
    }
    
});

$fionaBar.on('click', '.fiona-bar-item', function(e) {
    var $this = $(this);
    $this.addClass('active').siblings('.fiona-bar-item').removeClass('active');
    if ($this.hasClass('last')) {
        $fionaBarCaret.css('left', '75%');
        $fionaMe.show().animate({ opacity: 1 });
        $fionaList.hide().css('opacity', 0);
    } else {
        $fionaBarCaret.css('left', '25%');
        $fionaMe.hide().css('opacity', 0);
        $fionaList.show().animate({ opacity: 1 });
    }
});

function goToBack() {
    var scrollTop = $(document).scrollTop();
    var raq = null;
    if (scrollTop <= 0) {
        scrollTop = 0;
        $(document).scrollTop(0);
        cancelAnimationFrame(raq);
    } else {
        scrollTop -= 30;
        $(document).scrollTop(scrollTop);
        raq = requestAnimationFrame(goToBack);
    }

}

$goBack.on('click', goToBack);

// 首先加载两张
function preLoadImgs() {
    loadImg({
        src: 'images/resources/150322_Fan.jpg',
        desc1: '哈啊哈哈',
        desc2: '哈啊哈哈',
        date: '2018.12'
    }, insertImageToDom);
}

preLoadImgs();

function insertImageToDom(height, config) {
    var rStr = replaceStr({
        src: config.src,
        width: sliderWidth,
        height: height,
        desc1: config.desc1,
        desc2: config.desc2,
        date: config.date
    });

    $sliderCurrent.children().remove();
    $sliderCurrent.append($(rStr));

    $sliderContent.css('width', sliderWidth + 'px');
    var currentHeight = $sliderCurrent.height();
    $sliderContent.css('height', currentHeight + 'px');
}

function replaceStr(d) {
    var imgTemplate = `
        <img src="{{src}}" width="{{width}}" height="{{height}}" />
        <div class="fiona-slider-description">
            <div class="fiona-slider-brief">
                <p>{{desc1}}</p>
                <p>{{desc2}}</p>
            </div>
            <div class="fiona-slider-date">{{date}}</div>
        </div>`;
    return imgTemplate  
        .replace(/\{\{src\}\}/g, d.src)
        .replace(/\{\{width\}\}/g, d.width)
        .replace(/\{\{height\}\}/g, d.height)
        .replace(/\{\{desc1\}\}/g, d.desc1)
        .replace(/\{\{desc2\}\}/g, d.desc2)
        .replace(/\{\{date\}\}/g, d.date);
}

function loadImg(config, fn) {
    loading = true;
    var image = new Image();
    image.onload = function() {
        loading = false;
        var width = image.width;
        var height = image.height;
        var scaleHeight = sliderWidth * height / width;
        fn && fn.call(null, scaleHeight, config);
    }
    image.src = config.src;
}

$nextArrow.on('click', function(e) {
    loadImg({
        src: 'images/resources/150322_Fan.jpg',
        desc1: '哈啊哈哈',
        desc2: '哈啊哈哈',
        date: '2018.12',
    });

    $sliderNext.css({
        'transform': 'translateX(100%)',
        'display': 'block'
    });
    $sliderCube.css('width', sliderWidth * 2 + 'px');
});