// slider
var $sliderCurrent = $('#sliderCurrent');
var $prevArrow = $('#prevArrow');
var $nextArrow = $('#nextArrow');
var $sliderImgs = $('#sliderImgs');
var $sliderContent = $('#sliderImgs .fiona-slider-content');
var $sliderLoading = $('#sliderImgs .fiona-slider-loading');

var slider = true;
var sliderWrapperWidth = $sliderImgs.width();
var sliderWidth = sliderWrapperWidth * 0.8;
var loading = false;
var index = 0;
var documentHeight = $(document).height();

var albumList = Config.albumList;
var albumLength = albumList.length;

function preLoadImgs() {
    var pFun = proxyFunc(insertImageToDom);
    pFun.before(beforeInsertContent, 1);
    pFun.after(setIndexCount, 1);
    loadImg(albumList[index], pFun);
}

preLoadImgs();
    
function setSliderContent(width) {
    $sliderContent.css('width', width + 'px');
    var currentHeight = $sliderCurrent.height();
    $sliderContent.css('height', currentHeight + 'px');
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
    }
    innerCall.after = function(f) {
        if (!f) return null;
        var args = Array.prototype.slice.call(arguments, 1);
        t.hasAfter = function() {
            return f.apply(null, args);
        }
    }
    return innerCall;
}

function beforeUpdateContent(direction) {
    console.log('direction', direction);
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
    $prevArrow.css('opacity', 0);
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
        src: config.src,
        width: width,
        height: height,
        desc1: config.desc1,
        desc2: config.desc2,
        date: config.date
    });

    $sliderCurrent.children().remove();
    $sliderCurrent.append($(rStr));
    setSliderContent(width);
}

function updateImageToDom(width, height, config) {
    var img = $sliderCurrent.find('img');
    var d1 = $sliderCurrent.find('.fiona-slider-brief p').eq(0);
    var d2 = $sliderCurrent.find('.fiona-slider-brief p').eq(1);
    var date = $sliderCurrent.find('.fiona-slider-date');

    img.attr({
        src: config.src,
        width: width,
        height: height
    });

    d1.text(config.desc1);
    d2.text(config.desc2);
    date.text(config.date)
    setSliderContent(width);
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
    $sliderLoading.show();

    var image = new Image();
    image.onload = function() {
        loading = false;
        $sliderLoading.hide();

        var width = image.width;
        var height = image.height;
        var scaleWidth = sliderWidth;
        var scaleHeight = sliderWidth * height / width;

        if (scaleHeight > documentHeight) {
            scaleHeight = documentHeight - 400;
            scaleWidth = width * scaleHeight / height;
        }

        fn && fn.call(null, scaleWidth, scaleHeight, config);
    }
    image.src = config.src;
}

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
