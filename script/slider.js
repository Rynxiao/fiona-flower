// slider
var $sliderCurrent = $('#sliderCurrent');
var $prevArrow = $('#prevArrow');
var $nextArrow = $('#nextArrow');
var $sliderContent = $('#sliderImgs .fiona-slider-content');
var $sliderLoading = $('#sliderImgs .fiona-slider-loading');
var $album = $('#album');

var loading = false;
var index = 0;
var currentImageWidth = 0;
var currentImageHeight = 0;

var albumList = Config.albumList;
var albumLength = albumList.length;

function preLoadImgs() {
    var pFun = proxyFunc(insertImageToDom);
    pFun.before(beforeInsertContent, 1);
    pFun.after(setIndexCount, 1);
    loadImg(albumList[index], pFun);
}
    
function setSliderContent(width, height) {
    var img = $sliderCurrent.find('img');
    img.css({
        width: width,
        height: height
    });
    $sliderContent.css('width', width + 'px');
    var $discription = $sliderCurrent.find('.fiona-slider-description');
    var dHeight = $discription.height();
    $sliderContent.css('height', height + dHeight + 'px');
}

function proxyFunc(fn) {
    var t = {};
    function innerCall() {
        var before = t.hasBefore;
        var after = t.hasAfter;
        before && before();
        fn.apply(null, arguments);
        after && after();
    }
    innerCall.before = function(f) {
        if (!f) return null;
        var args = Array.prototype.slice.call(arguments, 1);
        t.hasBefore = function() {
            return f.apply(null, args);
        }
    };
    innerCall.after = function(f) {
        if (!f) return null;
        var args = Array.prototype.slice.call(arguments, 1);
        t.hasAfter = function() {
            return f.apply(null, args);
        }
    };
    return innerCall;
}

function beforeUpdateContent(direction) {
    if (direction > 0) {
        $prevArrow.css('opacity', 1);
    } else {
        setIndexCount(direction);
        $nextArrow.css('opacity', 1);
    }
    $sliderContent.css({'opacity': 0});
}

function afterUpdateContent(direction) {
    $sliderContent.css({'opacity': 1, 'transition': 'all 0.35s'});
    removeTransition();

    if (direction > 0) {
        setIndexCount(direction);
        if (index > albumLength - 1) {
            $nextArrow.css('opacity', 0);
        }
    } else {
        if (index < 0) {
            $prevArrow.css('opacity', 0);
        }
    }
}

function beforeInsertContent() {
    if (index === 0) {
        $prevArrow.css('opacity', 0);
    } else if (index === albumLength - 1) {
        $nextArrow.css('opacity', 0);
    } else {
        $prevArrow.css('opacity', 1);
        $nextArrow.css('opacity', 1);
    }
}

function setIndexCount(direction) {
    if (direction > 0) {
        ++index;
    } else {
        --index;
    }
}

function removeTransition() {
    $sliderContent.on('transitionend', function() {
        var $this = $(this);
        $this.css('transition', 'unset');
        $this.off('transitionend');
    });
}

function insertImageToDom(width, height, config) {
    var rStr = replaceStr({
        src: imagePath + config.src,
        width: width,
        height: height,
        desc1: config.desc1,
        desc2: config.desc2,
        date: config.date
    });

    $sliderCurrent.children().remove();
    $sliderCurrent.append($(rStr));
    setSliderContent(width, height);
}

function updateImageToDom(width, height, config) {
    var img = $sliderCurrent.find('img');
    var d1 = $sliderCurrent.find('.fiona-slider-brief p').eq(0);
    var d2 = $sliderCurrent.find('.fiona-slider-brief p').eq(1);
    var date = $sliderCurrent.find('.fiona-slider-date');

    img.attr({ src: imagePath + config.src });
    d1.text(config.desc1);
    d2.text(config.desc2);
    date.text(config.date)
    setSliderContent(width, height);
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

function caclContentWidth(width, height) {
    var windowWidth = $(window).outerWidth();
    var windowHeight = $(window).outerHeight();
    var sliderWrapperWidth = windowWidth - 400;
    var sliderWidth = sliderWrapperWidth * 0.8;
    var scaleWidth = sliderWidth;
    var scaleHeight = sliderWidth * height / width;
    var $discription = $sliderCurrent.find('.fiona-slider-description');
    var dHeight = $discription.outerHeight() || 82;

    if (scaleHeight + dHeight + 200 > windowHeight) {
        scaleHeight = windowHeight - (300 + dHeight);
        console.log(scaleHeight);
        scaleWidth = width * scaleHeight / height;
    }

    return {
        scaleWidth: scaleWidth,
        scaleHeight: scaleHeight
    }
}

function loadImg(config, fn) {
    loading = true;
    $sliderLoading.show();

    var image = new Image();
    image.onload = function() {
        loading = false;
        $sliderLoading.hide();

        var width = image.width;
        var height = image.height;
        var scaleLength = caclContentWidth(width, height);

        currentImageWidth = width;
        currentImageHeight = height;

        fn && fn.call(null, scaleLength.scaleWidth, scaleLength.scaleHeight, config);
    };
    image.onerror = function(err) {
        console.log('err', err);
    };
    image.src = imagePath + config.src;
}

var ticking = false;
function onResize() {
    if (!ticking) {
        requestAnimationFrame(resizeImage);
        ticking = true;
    }
}

function resizeImage() {
    var scaleLength = caclContentWidth(currentImageWidth, currentImageHeight);
    setSliderContent(scaleLength.scaleWidth, scaleLength.scaleHeight);
    ticking = false;
}

$(window).on('resize', onResize);

$nextArrow.on('click', function(e) {
    if (loading) {
        return;
    }

    var pFun = proxyFunc(updateImageToDom);
    pFun.before(beforeUpdateContent, 1);
    pFun.after(afterUpdateContent, 1);
    if (index > albumLength - 1) {
        return;
    } else if (index < 0) {
        index = 1;
    }
    loadImg(albumList[index], pFun);
});

$prevArrow.on('click', function(e) {
    if (loading) {
        return;
    }

    var pFun = proxyFunc(updateImageToDom);
    pFun.before(beforeUpdateContent, -1);
    pFun.after(afterUpdateContent, -1);

    if (index < 0) {
        return;
    } else if (index > albumLength - 1) {
        index = albumLength - 2;
    }
    loadImg(albumList[index], pFun);
});

$album.on('mouseenter', 'li', function() {
    var $this = $(this);
    index = $this.index();
    preLoadImgs();
});
