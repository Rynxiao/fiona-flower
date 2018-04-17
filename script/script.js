var $fionaBar = $('#fionaBar');
var $fionaBarCaret = $('.fiona-bar-caret');
var $album = $('#album');
var $listItem = $('#album .fiona-list-item');
var $fionaList = $('#fionaList');
var $fionaMe = $('#fionaMe');
var $goBack = $('#goBack');

var isFixed = false;
var total = 9;

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