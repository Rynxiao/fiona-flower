var $fionaBar = $('#fionaBar');
var $fionaBarCaret = $('.fiona-bar-caret');
var $album = $('#album');
var $listItem = $('#album .fiona-list-item');
var $fionaList = $('#fionaList');
var $fionaMe = $('#fionaMe');
var $goBack = $('#goBack');
var $sliderClose = $('.fiona-slider-close');
var $sliderWrapper = $('.fiona-slider-wrapper');

var isFixed = false;
var slider = false;
var pageSize = 9;
var page = 1;

var albumList = Config.albumList;
var albumLength = albumList.length;

var total = Math.ceil(albumLength / pageSize);

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
    var start = (page - 1) * pageSize;
    var end = start + pageSize;

    var template = '<li class="fiona-list-item">'
                + '<a href="javascript:void(0);">'
                +    '<div class="fiona-item-mask">'
                +        '<p>{{desc1}}</p>'
                +        '<p>{{desc2}}</p>'
                +    '</div>'
                + '</a>'
            + '</li>';
    var $images = [];

    if (end >= albumLength) {
        end = albumLength;
    }

    for (var i = start; i < end; i++) {
        var imgInfo = albumList[i];
        var $rStr = $(template.replace(/\{\{desc1\}\}/g, imgInfo.desc1).replace(/\{\{desc2\}\}/g, imgInfo.desc2));
        $rStr.find('a').css('background-image', 'url(\''+ imgInfo.src +'\')');
        $images.push($rStr);
    }
    $album.append($images);
    page++;
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

    if (page <= total) {
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

appendNewAlbum();

$goBack.on('click', goToBack);

$album.on('click', 'li', function() {
    slider = true;
    $sliderWrapper.show();
});

$sliderClose.on('click', function() {
    slier = false;
    $sliderWrapper.hide();
});