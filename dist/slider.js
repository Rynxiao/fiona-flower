var $sliderCurrent=$("#sliderCurrent"),$prevArrow=$("#prevArrow"),$nextArrow=$("#nextArrow"),$sliderContent=$("#sliderImgs .fiona-slider-content"),$sliderLoading=$("#sliderImgs .fiona-slider-loading"),$album=$("#album"),loading=!1,index=0,currentImageWidth=0,currentImageHeight=0,albumList=Config.albumList,albumLength=albumList.length;function preLoadImgs(){var e=proxyFunc(insertImageToDom);e.before(beforeInsertContent,1),e.after(setIndexCount,1),loadImg(albumList[index],e)}function setSliderContent(e,t){$sliderCurrent.find("img").css({width:e,height:t}),$sliderContent.css("width",e+"px");var n=$sliderCurrent.find(".fiona-slider-description").height();$sliderContent.css("height",t+n+"px")}function proxyFunc(n){var i={};function e(){var e=i.hasBefore,t=i.hasAfter;e&&e(),n.apply(null,arguments),t&&t()}return e.before=function(e){if(!e)return null;var t=Array.prototype.slice.call(arguments,1);i.hasBefore=function(){return e.apply(null,t)}},e.after=function(e){if(!e)return null;var t=Array.prototype.slice.call(arguments,1);i.hasAfter=function(){return e.apply(null,t)}},e}function beforeUpdateContent(e){0<e?$prevArrow.css("opacity",1):(setIndexCount(e),$nextArrow.css("opacity",1)),$sliderContent.css({opacity:0})}function afterUpdateContent(e){$sliderContent.css({opacity:1,transition:"all 0.35s"}),removeTransition(),0<e?(setIndexCount(e),albumLength-1<index&&$nextArrow.css("opacity",0)):index<0&&$prevArrow.css("opacity",0)}function beforeInsertContent(){0===index?$prevArrow.css("opacity",0):index===albumLength-1?$nextArrow.css("opacity",0):($prevArrow.css("opacity",1),$nextArrow.css("opacity",1))}function setIndexCount(e){0<e?++index:--index}function removeTransition(){$sliderContent.on("transitionend",function(){var e=$(this);e.css("transition","unset"),e.off("transitionend")})}function insertImageToDom(e,t,n){var i=replaceStr({src:imagePath+n.src,width:e,height:t,desc1:n.desc1,desc2:n.desc2,date:n.date});$sliderCurrent.children().remove(),$sliderCurrent.append($(i)),setSliderContent(e,t)}function updateImageToDom(e,t,n){var i=$sliderCurrent.find("img"),r=$sliderCurrent.find(".fiona-slider-brief p").eq(0),o=$sliderCurrent.find(".fiona-slider-brief p").eq(1),a=$sliderCurrent.find(".fiona-slider-date");i.attr({src:imagePath+n.src}),r.text("《"+n.desc1+"》"),o.text(n.desc2),a.text(n.date),setSliderContent(e,t)}function replaceStr(e){return'<img src="{{src}}" width="{{width}}" height="{{height}}" /><div class="fiona-slider-description"><div class="fiona-slider-brief"><p>{{desc1}}</p><p>{{desc2}}</p></div><div class="fiona-slider-date">{{date}}</div></div>'.replace(/\{\{src\}\}/g,e.src).replace(/\{\{width\}\}/g,e.width).replace(/\{\{height\}\}/g,e.height).replace(/\{\{desc1\}\}/g,"《"+e.desc1+"》").replace(/\{\{desc2\}\}/g,e.desc2).replace(/\{\{date\}\}/g,e.date)}function caclContentWidth(e,t){var n=$(window).outerWidth(),i=$(window).outerHeight(),r=.8*(n-400),o=r,a=r*t/e,d=$sliderCurrent.find(".fiona-slider-description").outerHeight()||82;return i<a+d+200&&(o=e*(a=i-(300+d))/t),{scaleWidth:o,scaleHeight:a}}function loadImg(i,r){loading=!0,$sliderLoading.show();var o=new Image;o.onload=function(){loading=!1,$sliderLoading.hide();var e=o.width,t=o.height,n=caclContentWidth(e,t);currentImageWidth=e,currentImageHeight=t,r&&r.call(null,n.scaleWidth,n.scaleHeight,i)},o.onerror=function(e){console.log("err",e)},o.src=imagePath+i.src}var ticking=!1;function onResize(){ticking||(requestAnimationFrame(resizeImage),ticking=!0)}function resizeImage(){var e=caclContentWidth(currentImageWidth,currentImageHeight);setSliderContent(e.scaleWidth,e.scaleHeight),ticking=!1}$(window).on("resize",onResize),$nextArrow.on("click",function(e){if(!loading){var t=proxyFunc(updateImageToDom);t.before(beforeUpdateContent,1),t.after(afterUpdateContent,1),albumLength-1<index||(index<0&&(index=1),loadImg(albumList[index],t))}}),$prevArrow.on("click",function(e){if(!loading){var t=proxyFunc(updateImageToDom);t.before(beforeUpdateContent,-1),t.after(afterUpdateContent,-1),index<0||(albumLength-1<index&&(index=albumLength-2),loadImg(albumList[index],t))}}),$album.on("mouseenter","li",function(){var e=$(this);index=e.index(),preLoadImgs()});