export function swiperFun(parThis) {
  //暂时设计每个slide大小需要一致
  var barwidth = 44 //导航粉色条的长度px
  var tSpeed = 300 //切换速度300ms
  var topBar, bar, clientWidth, navSlideWidth, navSum, navWidth, startPosition, progress, slideProgress;
  var navSwiper = new Swiper('#nav', {
    slidesPerView: 3,
    freeMode: true,
    on: {
      init: function() {
        navSlideWidth = this.slides.eq(0).css('width'); //导航字数需要统一,每个导航宽度一致
        bar = this.$el.find('.bar')
        bar.css('width', navSlideWidth)
        bar.transition(tSpeed)
        navSum = this.slides[this.slides.length - 1].offsetLeft //最后一个slide的位置
        clientWidth = parseInt(this.$wrapperEl.css('width')) //Nav的可视宽度
        navWidth = 0
        for (var i = 0; i < this.slides.length; i++) {
          navWidth += parseInt(this.slides.eq(i).css('width'))
        }

        topBar = this.$el.parents('body').find('#top') //页头

      },

    },
  });

  var pageSwiper = new Swiper('#page', {
    watchSlidesProgress: true,
    resistanceRatio: 0,
    on: {
      touchMove: function() {
        progress = this.progress
        bar.transition(0)
        bar.transform('translateX(' + navSum * progress + 'px)')
        //选中时白色255,255,255 未选中时蓝色101,134,164
        for (var i = 0; i < this.slides.length; i++) {
          slideProgress = this.slides[i].progress
          if (Math.abs(slideProgress) < 1) {
            var r = Math.floor((255 - 101) * (1 - Math.pow(Math.abs(slideProgress), 2)) + 101)
            var g = Math.floor((255 - 134) * (1 - Math.pow(Math.abs(slideProgress), 2)) + 134)
            var b = Math.floor((255 - 164) * (1 - Math.pow(Math.abs(slideProgress), 2)) + 164)
            navSwiper.slides.eq(i).find('span').css('color', 'rgba(101,134,164,1)')
          }
        }
      },
      transitionStart: function() {
        var activeIndex = this.activeIndex
        if (activeIndex == 0) {
          parThis.appFileListByCondition();
        } else if (activeIndex == 1) {
          parThis.type = '3';
          parThis.getApproveRecordList();
        } else if (activeIndex == 2) {
          parThis.getmsgFun();
        }
        var activeSlidePosition = navSwiper.slides[activeIndex].offsetLeft
        //释放时导航粉色条移动过渡
        bar.transition(tSpeed)
        bar.transform('translateX(' + activeSlidePosition + 'px)')
        //释放时文字变色过渡
        navSwiper.slides.eq(activeIndex).find('span').transition(tSpeed)
        navSwiper.slides.eq(activeIndex).find('span').css('color', 'rgba(101,134,164,1)')
        if (activeIndex > 0) {
          navSwiper.slides.eq(activeIndex - 1).find('span').transition(tSpeed)
          navSwiper.slides.eq(activeIndex - 1).find('span').css('color', 'rgba(101,134,164,1)')
        }
        if (activeIndex < this.slides.length) {
          navSwiper.slides.eq(activeIndex + 1).find('span').transition(tSpeed)
          navSwiper.slides.eq(activeIndex + 1).find('span').css('color', 'rgba(101,134,164,1)')
        }
        //导航居中
        var navActiveSlideLeft = navSwiper.slides[activeIndex].offsetLeft //activeSlide距左边的距离

        navSwiper.setTransition(tSpeed)
        if (navActiveSlideLeft < (clientWidth - parseInt(navSlideWidth)) / 2) {
          navSwiper.setTranslate(0)
        } else if (navActiveSlideLeft > navWidth - (parseInt(navSlideWidth) + clientWidth) / 2) {
          navSwiper.setTranslate(clientWidth - navWidth)
        } else {
          navSwiper.setTranslate((clientWidth - parseInt(navSlideWidth)) / 2 - navActiveSlideLeft)
        }

      },
    }
  });


  navSwiper.$el.on('touchstart', function(e) {
    e.preventDefault() //去掉按压阴影
  })
  navSwiper.on('tap', function(e) {

    var clickIndex = this.clickedIndex
    var clickSlide = this.slides.eq(clickIndex)
    pageSwiper.slideTo(clickIndex, 0);
    this.slides.find('span').css('color', 'rgba(101,134,164,1)');
    clickSlide.find('span').css('color', 'rgba(101,134,164,1)');
  })

  //内容滚动
  var scrollSwiper = new Swiper('.scroll', {
    //44是top地址和搜索的高

    slidesOffsetBefore: 88,
    direction: 'vertical',
    freeMode: true,
    slidesPerView: 'auto',

    mousewheel: {
      releaseOnEdges: true,
    },
    on: {
      touchMove: function() {

        if (this.translate > 88 - 44 && this.translate < 88) {
          topBar.transform('translateY(' + (this.translate - 88) + 'px)');
        }

      },
      touchStart: function() {
        startPosition = this.translate
      },
      touchEnd: function() {
        topBar.transition(tSpeed)
        if (this.translate > 44 && this.translate < 88 && this.translate < startPosition) {
          topBar.transform('translateY(-44px)');
          for (sc = 0; sc < scrollSwiper.length; sc++) {
            if (scrollSwiper[sc].translate > 44) {
              scrollSwiper[sc].setTransition(tSpeed);
              scrollSwiper[sc].setTranslate(44)
            }
          }
        }
        if (this.translate > 44 && this.translate < 88 && this.translate > startPosition) {
          topBar.transform('translateY(0px)');
          for (sc = 0; sc < scrollSwiper.length; sc++) {
            if (scrollSwiper[sc].translate < 88 && scrollSwiper[sc].translate > 0) {
              scrollSwiper[sc].setTransition(tSpeed);
              scrollSwiper[sc].setTranslate(88)
            }
          }
        }
      },

      transitionStart: function() {

        topBar.transition(tSpeed)
        if (this.translate < 88 - 44) {
          topBar.transform('translateY(-44px)');
          if (scrollSwiper) {
            for (sc = 0; sc < scrollSwiper.length; sc++) {
              if (scrollSwiper[sc].translate > 44) {
                scrollSwiper[sc].setTransition(tSpeed);
                scrollSwiper[sc].setTranslate(44)
              }
            }
          }

        } else {
          topBar.transform('translateY(0px)');

          if (scrollSwiper) {
            for (sc = 0; sc < scrollSwiper.length; sc++) {
              if (scrollSwiper[sc].translate < 88 && scrollSwiper[sc].translate > 0) {
                scrollSwiper[sc].setTransition(tSpeed);
                scrollSwiper[sc].setTranslate(88)
              }
            }
          }
        }
      },
    }

  })
  //热卖
  var bannerSwiper = new Swiper('.banner', {
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction',
      renderFraction: function(currentClass, totalClass) {
        return '<span class="' + currentClass + '"></span>' + '/' + '<span class="' + totalClass + '"></span>';
      },
    },
  });
}
