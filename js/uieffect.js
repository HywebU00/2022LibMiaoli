$(function () {

	var _html = $('html');
	var _body = $('body');
	var _window = $(window);

	var ww = _window.width();
	var wwNew = ww;
	var wh = _window.height();

	const wwSlim = 480;
	const wwMedium = 700; //此值以下是手機
	const wwNormal = 1000; //此值以上是電腦
	const wwMaximum = 1200;

	var _menu = $('.webHeader .menu');
	var _sidebar = $('.sidebar');
	var _sidebarCtrl = $('.sidebarCtrl');
	var _webHeader = $('.webHeader');
	var hh = _webHeader.outerHeight();
	// var _webFooter = $('.webFooter');
	var _goTop = $('.goTop');

	_html.removeClass('no-js');


	// 固定版頭 //////////////////////////////
	var fixHeadThreshold;
	if (ww >= wwNormal) {
		fixHeadThreshold = hh - _menu.outerHeight();
	} else {
		fixHeadThreshold = 0;
	}

	_window.scroll(function () {
		if (_window.scrollTop() > fixHeadThreshold) {
			_webHeader.addClass('fixed');
			_body.offset({ top: hh });
		} else {
			_webHeader.removeClass('fixed');
			_body.removeAttr('style');
		}

		// goTop button 顯示、隱藏
		if (_window.scrollTop() > 200) {
			_goTop.addClass('show');
		} else {
			_goTop.removeClass('show');
		}
	})
	_window.trigger('scroll');


	// 查詢區開合 //////////////////////////////
	var _searchCtrl = $('.searchCtrl');
	var _search = $('.search');
	const srSpeed = 510;
	_searchCtrl.click(function () {
		if (_search.hasClass('reveal')) {
			_search.removeClass('reveal');
			setTimeout(function () { _search.removeAttr('style') }, srSpeed);
		} else {
			_search.css('display', 'flex');
			setTimeout(function () { _search.addClass('reveal') }, 10);
		}
	})
	// --end of-- 查詢區 //////////////////////////////


	// 按 altKey + s 要 focus 查詢 input 元件 //////////////////////////////
	_window.keydown(function (e) {
		if (e.which == 83 && e.altKey) {
			if (_window.scrollTop() > hh) {
				_html.stop(true, false).animate({ scrollTop: 0 }, 400, function () {
					_search.find('input[type="text"]').focus();
				});
			}
		}
	})
	// --end of--  altKey + s ///////////////////////////////////////////////



	// window resize
	var winResizeTimer0;
	var wwNew;
	_window.resize(function () {
		clearTimeout(winResizeTimer0);
		winResizeTimer0 = setTimeout(function () {

			wwNew = _window.width();

			// 由小螢幕到寬螢幕
			if (ww < wwNormal && wwNew >= wwNormal) {
				if (_sidebar.hasClass('reveal')) {
					_sidebar.removeClass('reveal');
					_sidebarCtrl.removeClass('closeIt');
					_sidebarMask.hide();
					_body.removeClass('noScroll');
				}
				_body.removeAttr('style');
				_webHeader.removeClass('fixed');
				_search.removeClass('reveal').removeAttr('style')
				hh = _webHeader.outerHeight();
				fixHeadThreshold = hh - _menu.outerHeight();
				_window.trigger('scroll');
			}

			// 由寬螢幕到小螢幕
			if (ww >= wwNormal && wwNew < wwNormal) {
				hh = _webHeader.outerHeight();
				fixHeadThreshold = 0;
				_body.removeAttr('style');
				_window.trigger('scroll');
			}
			ww = wwNew;
		}, 200);
	});

	// fatfooter 開合 //////////////////////////////
	var _fatFootCtrl = $('.fatFootCtrl');
	var _footSiteTree = $('.fatFooter').find('.siteTree>ul>li>ul');
	// const text1 = _fatFootCtrl.text('close');
	// const text2 = _fatFootCtrl.attr('data-alttext');
	const text1 = 'close';
	const text2 = 'open';

	if (_fatFootCtrl.hasClass('closed')) {
		_fatFootCtrl.text(text2);
		_footSiteTree.hide();
	} else {
		_fatFootCtrl.text(text1);
		_footSiteTree.show();
	}

	_fatFootCtrl.click(function () {
		if (_footSiteTree.is(':visible')) {
			_footSiteTree.slideUp();
			$(this).addClass('closed').text(text2);
		} else {
			_footSiteTree.slideDown();
			$(this).removeClass('closed').text(text1);
		}
	})
	// --end of-- fatfooter 開合 //////////////////////////////


	// -----------------------------------------------------

	_menu.find('li').has('ul').addClass('hasChild'); // 找出_menu中有次選單的li
	var _hasChild = _menu.find('.hasChild');

	// 複製主選單到 行動版側欄

	_menu.clone().appendTo(_sidebar);
	$('.topLinks').clone().appendTo(_sidebar);
	// 製作側欄選單遮罩
	_body.append('<div class="sidebarMask"></div>');
	var _sidebarMask = $('.sidebarMask');

	var _sidebarMenu = _sidebar.find('.menu');
	var _sbmHasChildA = _sidebarMenu.find('.hasChild>a');

	_sbmHasChildA.click(
		function (e) {
			e.preventDefault();

			let _this = $(this);
			let _subMenu = _this.next('ul');

			if (_subMenu.is(':hidden')) {
				_subMenu.stop(true, false).slideDown();
				_this.parent().addClass('closeIt').siblings().removeClass('closeIt').find('ul:visible').slideUp().parent().removeClass('closeIt');
			} else {
				_subMenu.stop(true, false).slideUp(400, function () {
					_this.parent().removeClass('closeIt');
				}).find('ul:visible').slideUp();
				_subMenu.find('.closeIt').removeClass('closeIt');
			}
		}
	)



	var _topItem = _menu.children('ul').children('li'); // 第一層選單項
	var _hasChildA = _hasChild.children('a');
	var liA = _menu.find('li>a');

	_hasChild.each(function () {
		let _this = $(this);
		let _thisSubMenu = _this.children('ul');
		let _xButtonDown;
		let _xButtonUp;
		const speed = 300;

		_this.hover(
			function () {
				let y1 = _window.height() + _window.scrollTop(); //視窗高度＋已捲動到視窗之上的文件高度
				let y2; // 將存放次選單高度 ＋ 次選單距離文件最上方的垂直距離
				let translate = ''; // 次選單需移動的垂直距離
				let dd = 0;
				let dy = 0; // 次選單超出視窗的高度

				_this.addClass('here'); // 為已展開的次選單上層li加樣式

				_thisSubMenu.stop(true, true).slideDown(speed, function () {
					y2 = _thisSubMenu.outerHeight() + _thisSubMenu.offset().top;
					const itemHeight = parseInt(_thisSubMenu.find('li:first-child').outerHeight());

					// 判斷「次選單底部」是否超過「視窗底部」
					if (y2 > y1) {
						// 判斷「次選單高度」是否超過「視窗高度」
						if (_thisSubMenu.outerHeight() <= _window.height()) {
							// 次選單高度沒有超過視窗高度，移動次選單使「次選單底部」對齊「視窗底部」
							translate = 'translateY(' + String(y1 - y2) + 'px)';
						} else {
							// 「次選單高度」超過「視窗高度」，移動次選單使其頂部對齊「視窗頂部」
							translate = 'translateY(' + String(_window.scrollTop() - _thisSubMenu.offset().top) + 'px)';

							// dy = 選單高度 - 視窗高度
							dy = parseInt(_thisSubMenu.outerHeight() - _window.height());

							// 加入控制 button
							_this.append('<button class="upward" disabled type="button"></button><button class="downward" type="button"></button>');
							_xButtonDown = _this.find('button.downward');
							_xButtonUp = _this.find('button.upward');
							_xButtonDown.add(_xButtonUp).css('left', _thisSubMenu.offset().left + _thisSubMenu.outerWidth());
						}
					}
					_thisSubMenu.css('transform', translate);

					if (typeof _xButtonDown !== 'undefined') {
						_xButtonDown.click(function () {
							if (dd + dy > 0) {
								dd = dd - itemHeight;
								if (dd + dy < itemHeight) {
									dd = -1 * dy;
									_xButtonDown.attr('disabled', 'disabled');
								}
								_thisSubMenu.stop(true, false).animate({ 'margin-top': dd }, 200);
								_xButtonUp.removeAttr('disabled');
							}
						})
					}
					if (typeof _xButtonUp !== 'undefined') {
						_xButtonUp.click(function () {
							if (dd < 0) {
								dd = dd + itemHeight;
								if (-1 * dd < itemHeight) {
									dd = 0;
									_xButtonUp.attr('disabled', 'disabled');
								}
								_thisSubMenu.stop(true, false).animate({ 'margin-top': dd }, 200);
								_xButtonDown.removeAttr('disabled');
							}
						})
					}

				});
				// 判斷展開的次選單是否超過視窗右邊界
				if (_thisSubMenu.offset().left + _thisSubMenu.outerWidth() > _window.width()) {
					if (_this.is(_topItem)) {
						_thisSubMenu.css({ right: 0, left: 'auto' });
					} else {
						_thisSubMenu.css({ right: _this.outerWidth(), left: 'auto' });
					}
					_this.addClass('turn'); // 讓箭頭轉向
				}
			},
			function () {
				_this.removeClass('here').removeClass('turn').find('button').remove();
				_thisSubMenu.hide().removeAttr('style');
			}
		)
	});


	_hasChildA.focus(function () {
		let _this = $(this);
		let _thisSubMenu = $(this).next('ul');

		if (_this.parent().is(_topItem)) {
			_thisSubMenu.show();
		} else {
			if (_this.parent().offset().left + _this.innerWidth() + _thisSubMenu.innerWidth() > _window.innerWidth()) {
				_thisSubMenu.css('left', -1 * (_thisSubMenu.innerWidth()));
			} else {
				_thisSubMenu.css('left', _thisSubMenu.parent().innerWidth());
			}
			_thisSubMenu.show();
		}
		_this.parent().addClass('here');
	})

	liA.focus(function () {
		$(this).parent('li').siblings().removeClass('here').find('ul').hide();
	})


	// 離開 _menu 隱藏所有次選單
	$('*').focus(function () {
		if ($(this).parents('.menu').length == 0) {
			_menu.find('.hasChild').removeClass('here').find('ul').removeAttr('style');
		}
	})



	// 向上捲動箭頭 //////////////////////////////
	_goTop.click(function () {
		_html.stop(true, false).animate({ scrollTop: 0 }, 800, function () {
			if ($('.goCenter').is(':visible')) {
				$('.goCenter').focus();
			} else {
				_sidebarCtrl.focus();
			}
		});
	});
	$('.webHeader .accesskey').focus(function () {
		_html.stop(true, false).animate({ scrollTop: 0 }, 800);
	})


	////////////////////////////////////////////////////////
	// 外掛套件 slick 參數設定 ////////////////////////////
	// 首頁 「新書展示」、「熱門排行榜」
	$('.bookList').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		speed: 600,
		autoplay: false,
		arrows: true,
		dots: false,
		fade: false,
		infinite: true,
		mobileFirst: true,
		responsive: [{
			breakpoint: wwMedium,
			settings: {
				slidesToShow: 2
			}
		},
		{
			breakpoint: wwNormal,
			settings: {
				slidesToShow: 4
			}
		}
		]
	});

	// 大圖輪播
	$('.bigBanners').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplaySpeed: 5000,
		speed: 600,
		autoplay: true,
		arrows: true,
		dots: true,
		fade: false,
		// accessibility: false,
		infinite: true,
		customPaging: function (slider, i) {
			var title = $(slider.$slides[i]).find('img').attr('alt').trim();
			return $('<button type="button" aria-label="' + title + '"/>').text(title);
		}
	});

	// 小廣告
	$('.adBanners .links').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplaySpeed: 5000,
		speed: 600,
		autoplay: true,
		arrows: true,
		dots: false,
		fade: false,
		infinite: true,
		mobileFirst: true,
		responsive: [{
			breakpoint: wwMedium,
			settings: {
				slidesToShow: 2
			}
		},
		{
			breakpoint: wwNormal,
			settings: {
				slidesToShow: 4
			}
		}
		]
	});



	// 首頁讀者登入
	var _loginHere = $('.loginHere');
	var _loginCtrl = _loginHere.find('.ctrlBtn');
	var _login = _loginHere.find('.login');
	_loginCtrl.click(function () {
		if (_loginHere.hasClass('reveal')) {
			_loginHere.removeClass('reveal');
			setTimeout(() => { _login.hide(); }, 1000)
		} else {
			_login.show();
			_loginHere.addClass('reveal');
		}
	});



	// 照片內容頁
	$('.imgSlick').find('.slider-for').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: true,
		fade: true,
		dots: true,
		asNavFor: '.imgSlick .slider-nav'
	});
	$('.imgSlick').find('.slider-nav').slick({
		variableWidth: true,
		slidesToShow: 3,
		slidesToScroll: 1,
		asNavFor: '.imgSlick .slider-for',
		centerPadding: 0,
		dots: false,
		centerMode: true,
		focusOnSelect: true
	});

	// slick 參數設定：結束 ////////////////////////////

	// 取得 slick 總張數
	var _countSlide = $('.slideShow, .imgSlick').filter('.count');
	_countSlide.each(function () {
		let _this = $(this);
		let _slickDots = _this.find('.slick-dots');
		_slickDots.after('<div class="slideTotal">/' + _slickDots.children('li').length + '</div>');
		_slickDots.find('button').attr('disabled', 'disabled');
	})
	////////////////////////////////////////////////////////



	// 仿 select 效果
	_dropList = $('.dropList');
	_dropList.each(function () {
		let _this = $(this);
		let _selected = _this.find('.selected');
		let _optionList = _this.find('.options');
		let _option = _optionList.find('li>button');

		_selected.on('click', function () {
			ww = _window.width();
			if (_optionList.is(':hidden')) {
				if (ww < wwNormal) {
					_optionList.fadeIn(300);
					_body.addClass('noScroll');
				} else {
					_optionList.slideDown(300);
				}
				_selected.addClass('closeIt');
			} else {
				if (ww < wwNormal) {
					_optionList.fadeOut(300);
					_body.removeClass('noScroll');
				} else {
					_optionList.slideUp(300);
				}
				_selected.removeClass('closeIt');
			}
		})

		_option.click(function () {
			$(this).parent().addClass('now').siblings().removeClass('now');
			_selected.text($(this).text());
			_selected.removeClass('closeIt');
			ww = _window.width();
			if (ww < wwNormal) {
				_optionList.delay(400).fadeOut(300);
				_body.removeClass('noScroll');
			} else {
				_optionList.delay(400).slideUp(300);
			}
		})
	})

	// 首頁：Topics 主題服務
	// focus 時顯示選單
	var _topics = $('.topics').find('.block');
	_topics.each(function () {
		let _this = $(this);

		_this.focusin(function () {
			_this.addClass('reveal');
		})
		_this.focusout(function () {
			_this.removeClass('reveal');
		})
	})



	// // 可收合區 ////////////////////////////
	// _drawer = $('.drawer');
	// _drawer.each(function () {
	//   let _this = $(this);
	//   let _handle = _this.find('.handle');
	//   let _tray = _this.find('.tray');
	//   const speed = 500;

	//   _handle.click(function () {
	//     if (_tray.is(':hidden')) {
	//       _tray.stop(true, false).slideDown(speed);
	//       _handle.removeClass('openIt');
	//     } else {
	//       _tray.stop(true, false).slideUp(speed, function(){
	//         _handle.addClass('openIt');
	//       })
	//     }
	//   })
	// })
	////////////////////////////////////////////////////////

	// rwd Table ////////////////////////////
	// 把 th 的內容複製到對應的td的 data-th 屬性值
	var _rwdTable = $('.rwdTable');
	_rwdTable.each(function () {
		let _this = $(this);
		let _th = _this.find('thead>tr>th');
		let count = _th.length;
		let _tr = _this.find('tbody').children('tr');

		_tr.each(function () {
			let _td = $(this).children('td');
			for (let i = 0; i < count; i++) {
				_td.eq(i).attr('data-th', _th.eq(i).text());
			}
		})
	})
	//////////////////////////////////////////////////////






	//////////////////////////////////////////////
	// 燈箱 ---------------------------------------
	var _lightbox = $('.lightbox');
	var _hideLightbox = _lightbox.find('.closeThis');
	const lbxSpeed = 400;

	_lightbox.before('<div class="coverAll"></div>');
	_lightbox.append('<button type="button" class="skip"></button>');
	var _cover = $('.coverAll');
	var _skipToClose = _lightbox.find('.skip');

	_skipToClose.focus(function () {
		_hideLightbox.focus();
	})

	// 開啟大圖燈箱 //////////////
	var _showLightbox = $('.showLightbox');
	var _bigImgLightbox = _lightbox.filter('.bigImage');
	_showLightbox.click(function () {
		_bigImgLightbox.stop(true, false).fadeIn(200);
		_cover.stop(true, false).fadeIn(200);
		_hideLightbox.focus();
		_body.addClass('noScroll');
	})

	// 關燈箱
	_hideLightbox.click(function () {
		let _targetLbx = $(this).parents('.lightbox');
		_targetLbx.stop(true, false).fadeOut(lbxSpeed);
		_targetLbx.prev(_cover).fadeOut(lbxSpeed);
		_body.removeClass('noScroll');
		_showLightbox.focus();
	})

	_cover.click(function () {
		let _targetLbx = $(this).next('.lightbox');
		$(this).fadeOut(lbxSpeed);
		_body.removeClass('noScroll');
		_targetLbx.stop(true, false).fadeOut(lbxSpeed);
		_showLightbox.focus();
	})




	///////////////////////////////////////////////
	// .photoflow：cp頁的相關圖片（Related Photos）
	// 點擊圖片開啟燈箱並顯示大圖
	var _photoflow = $('.photoflow');
	var _cpBigPhoto = $('.lightbox.bigPhotos');
	var photoIndex;
	var _keptFlowItem;

	_photoflow.each(function () {
		let _this = $(this);
		let _floxBox = _this.find('.flowBox');
		let _flowList = _floxBox.find('.flowList');
		let _flowItem = _flowList.children('li');
		let slideDistance = _flowItem.first().outerWidth(true);
		let slideCount = _flowItem.length;
		let _btnRight = _this.find('.diskBtn.next');
		let _btnLeft = _this.find('.diskBtn.prev');
		const speed = 400;
		const actClassName = 'active';
		let i = 0;
		let j;
		let _dots = '';

		// 產生 indicator 和 自訂屬性 data-index
		_floxBox.append('<div class="flowNav"><ul></ul></div>');
		let _indicator = _this.find(".flowNav>ul");
		for (let n = 0; n < slideCount; n++) {
			_dots = _dots + '<li></li>';
			_flowItem.eq(n).attr('data-index', n);
		}
		_indicator.append(_dots);

		// 複製到燈箱中 *** //
		_floxBox.clone().insertBefore(_skipToClose);

		let _indicatItem = _indicator.find('li');
		_indicatItem.eq(i).addClass(actClassName);
		_indicatItem.eq((i + 1) % slideCount).addClass(actClassName);


		// 依據可視的 slide 項目，決定 indicator 樣式
		indicatReady();

		function indicatReady() {
			_indicatItem.removeClass(actClassName);
			_indicatItem.eq(i).addClass(actClassName);
			if (ww < wwMedium) {
				if (slideCount > 1) {
					flownavShow();
				} else {
					flownavHide();
				}
			}
			if (ww >= wwMedium) {
				if (slideCount <= 2) {
					flownavHide();
				} else {
					flownavShow();
					_indicatItem.eq((i + 1) % slideCount).addClass(actClassName);
				}
			}
			if (ww >= wwNormal) {
				if (slideCount <= 4) {
					flownavHide();
				} else {
					flownavShow();
					_indicatItem.eq((i + 1) % slideCount).addClass(actClassName);
					_indicatItem.eq((i + 2) % slideCount).addClass(actClassName);
					_indicatItem.eq((i + 3) % slideCount).addClass(actClassName);
				}
			}
		}

		function flownavShow() {
			_indicator.add(_btnRight).add(_btnLeft).show();
		}

		function flownavHide() {
			_indicator.add(_btnRight).add(_btnLeft).hide();
		}

		function slideForward() {
			_flowList.stop(true, false).animate({ 'margin-left': -1 * slideDistance }, speed, function () {
				j = (i + 1) % slideCount;
				_flowItem.eq(i).appendTo(_flowList);
				_indicatItem.eq(i).removeClass(actClassName);
				_indicatItem.eq(j).addClass(actClassName);
				_flowList.css('margin-left', 0);
				if (ww >= wwMedium) {
					_indicatItem.eq((j + 1) % slideCount).addClass(actClassName);
				}
				if (ww >= wwNormal) {
					_indicatItem.eq((j + 3) % slideCount).addClass(actClassName);
				}
				i = j;
			});
		}

		function slideBackward() {
			j = (i - 1) % slideCount;
			_flowItem.eq(j).prependTo(_flowList);
			_flowList.css("margin-left", -1 * slideDistance);

			_flowList.stop(true, false).animate({ "margin-left": 0 }, speed, function () {
				_indicatItem.eq(j).addClass(actClassName);
				if (ww >= wwNormal) {
					_indicatItem.eq((i + 3) % slideCount).removeClass(actClassName);
				} else if (ww >= wwMedium) {
					_indicatItem.eq((i + 1) % slideCount).removeClass(actClassName);
				} else {
					_indicatItem.eq(i).removeClass(actClassName);
				}
				i = j;
			});
		}

		// 點擊向右箭頭
		_btnRight.click(function () { slideForward(); });

		// 點擊向左箭頭
		_btnLeft.click(function () { slideBackward(); });

		// touch and swipe 左右滑動
		_floxBox.swipe({
			swipeRight: function () { slideBackward(); },
			swipeLeft: function () { slideForward(); },
			threshold: 20,
		});




		///////////////////////////////////////////////////////
		// 點擊.photoflow的圖片，開燈箱顯示大圖 ***
		_flowItem.children('a').click(function () {
			_keptFlowItem = $(this);
			photoIndex = _keptFlowItem.parent().attr('data-index');
			_cpBigPhoto.stop(true, false).fadeIn().find('.flowList').find('li').filter(function () {
				return $(this).attr('data-index') == photoIndex;
			}).show();
			_hideLightbox.focus();
			_cover.stop(true, false).fadeIn();
			_body.addClass('noScroll');
		})

		let winResizeTimer;
		_window.resize(function () {
			clearTimeout(winResizeTimer);
			winResizeTimer = setTimeout(function () {
				ww = _window.width();
				slideDistance = _flowItem.first().outerWidth(true);
				indicatReady();
			}, 200);
		});

	});


	// cp 頁大圖燈箱 *** ////////////////////////////
	_cpBigPhoto.each(function () {
		let _this = $(this);
		let _photoBox = _this.find('.flowBox');
		let _photoList = _photoBox.find('.flowList');
		let _photoItem = _photoList.children('li');
		let photoCount = _photoItem.length;
		let _btnRight = _this.find('.diskBtn.next');
		let _btnLeft = _this.find('.diskBtn.prev');
		let _hideBigPhoto = _this.find('.closeThis');

		const speed = 400;
		let i, j;

		// _photoItem.hide();
		_photoItem.find('img').unwrap('a');

		// 點擊向右箭頭
		_btnRight.click(function () {
			i = Number(_photoItem.filter(':visible').attr('data-index'));
			j = (i + 1) % photoCount;

			_photoItem.filter(function () {
				return $(this).attr('data-index') == i;
			}).stop(true, false).fadeOut(speed, function () {
				$(this).hide();
			});
			_photoItem.filter(function () {
				return $(this).attr('data-index') == j;
			}).stop(true, false).fadeIn(speed);
		})

		// 點擊向左箭頭
		_btnLeft.click(function () {
			i = Number(_photoItem.filter(':visible').attr('data-index'));
			j = (i - 1 + photoCount) % photoCount;

			_photoItem.filter(function () {
				return $(this).attr('data-index') == i;
			}).stop(true, false).fadeOut(speed, function () {
				$(this).hide();
			});
			_photoItem.filter(function () {
				return $(this).attr('data-index') == j;
			}).stop(true, false).fadeIn(speed);
		})

		// 關閉大圖燈箱
		_hideBigPhoto.add(_cover).click(function () {
			_photoItem.hide();
			_keptFlowItem.focus();
		})
	})
	//////////////////////////////////////






	// 複合功能圖示   //////////////////////////////////////
	var _compIcon = $('.compound'); //li
	_compIcon.each(function () {
		let _this = $(this);
		let _controler = _this.children('button');
		let _optList = _this.children('ul');
		let _optItem = _optList.children('li');
		let _optButton = _optItem.children('button');
		let _optLink = _optItem.children('a');
		let count = _optItem.length;

		const speed = 300;

		// 改變 li 的 z-index 值，第一個 li 要在最上面
		for (let i = 0; i < count; i++) {
			_optItem.eq(i).css('z-index', count - i)
		}

		// 收合
		function glideUp() {
			for (let i = 0; i < count; i++) {
				_optList.stop(true, false).animate({ 'top': 0 }, speed);
				_optItem.eq(i).delay(speed * i * .4).stop(true, false).animate({ 'top': 0 }, speed, function () {
					if (i == count - 1) { _optList.height(0).hide() }
				});
			}
		}

		_controler.click(function () {
			if (_optList.is(':hidden')) {
				_optList.show();
				let height = _optItem.outerHeight(true);
				_optList.stop(true, false).animate({ 'top': height }, speed);
				for (let i = 0; i < count; i++) {
					_optItem.eq(i).delay(speed * i * .3).stop(true, false).animate({ 'top': height * i }, speed, function () {
						_optList.height(height * count);
					})
				}
			} else {
				glideUp();
			}
		})

		_optButton.add(_optLink).click(glideUp);
		_this.siblings().click(glideUp);
		_this.siblings().children('a, button').focus(glideUp);
	})

	////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////



	//無障礙頁籤功能，祺學修改，20220919套用
	function tabFun() {
		var activeClass = 'active'; //啟動的 class
		var tabSet = $('.tabSet');

		tabSet.each(function () {
			var _tabBtnBlock = $(this).find('.tabItems');
			var _tabBtn = _tabBtnBlock.find('button');
			var _tabBtnLength = _tabBtn.length;
			var _tabContentBlock = $(this).find('.tabContentGroup');
			var _tabContent = _tabContentBlock.find('.tabContent');
			_tabBtn.eq(0).addClass(activeClass);
			_tabContent.eq(0).show();

			for (var i = 0; i < _tabBtnLength; i++) {(
					function (i) {
						var _this = _tabBtn.eq(i);
						var _thisContent = _tabContent.eq(i);
						var _thisPrevItem = _tabContent.eq(i - 1);
						var _itemAllA = _thisContent.find('[href], input'); //這一個頁籤內容所有a和input項目
						var _prevItemAllA = _thisPrevItem.find('[href], input'); //前一個頁籤內容所有a和input項目
						var _isFirstTab = i === 0; //如果是第一個頁籤
						var _isLastTab = i === _tabBtnLength - 1; //如果是最後一個頁籤
						var _itemFirstA = _itemAllA.eq(0); //頁籤內容第一個a或是input
						var _itemLastA = _itemAllA.eq(-1); //頁籤內容最後一個a或是input
						var _prevItemLastA = _prevItemAllA.eq(-1); //前一個頁籤的最後一個a或是input

						// _this頁籤觸發focus內容裡的第一個a
						_this.on('keydown', function (e) {
							//頁籤第幾個按鈕觸發時
							if (e.which === 9 && !e.shiftKey) {
								e.preventDefault();
								startTab(i); //啟動頁籤切換功能
								if (_itemAllA.length) {
									_itemFirstA.focus(); //第一個a或是input focus
								} else {
									_tabBtn.eq(i + 1).focus(); //當內容沒有a或是input跳轉下一個tab
								}
							} else if (e.which === 9 && e.shiftKey && !_isFirstTab) {
								e.preventDefault();
								startTab(i - 1); //啟動頁籤切換功能

								if (_prevItemAllA.length) {
									_prevItemLastA.focus(); //前一個頁籤內容的最後一個a或是input focus
								} else {
									_tabBtn.eq(i - 1).focus(); //當內容沒有a或是input跳轉上一個tab
								}
							}
						});

						//當按下shift+tab且為該內容的第一個a或是input
						//將focus目標轉回tab頁籤上，呼叫上方功能startTab(i - 1);往前一個頁籤
						_itemFirstA.on('keydown', function (e) {
							if (e.which === 9 && e.shiftKey) {
								e.preventDefault();
								_tabBtn.eq(i).focus();
							}
						});

						//當按下shift+tab且為該內容的最後一個a或是input，focus到下一個頁籤
						_itemLastA.on('keydown', function (e) {
							if (e.which === 9 && !e.shiftKey && !_isLastTab) {
								e.preventDefault();
								_tabBtn.eq(i + 1).focus();
							}
						});
					})(i);

				//滑鼠點擊事件
				_tabBtn.on('click', function (e) {
					e.preventDefault();
					var _nowBtn = $(this).index();
					startTab(_nowBtn);
				});

				//切換tab
				function startTab(_now) {
					_tabBtn.eq(_now).addClass(activeClass).siblings().removeClass(activeClass);
					_tabContent.eq(_now).show().siblings().hide();
				}
			}
		});
	}
	tabFun();


	////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////

	// 側欄預設關閉
	_sidebar.removeClass('reveal').hide();

	// .sidebarCtrl 控制行動版側欄開合的元件
	var _sidebarCtrl = $('.sidebarCtrl');
	var _sbFocusableEle = _sidebar.find('a, input, button');

	// 以 Tab 鍵在側欄中 focus 到最後一個 focusable 元件，又失去 focus，此時要關閉側欄
	_sbFocusableEle.keydown(function(e){
		let index = _sbFocusableEle.index(this);
		if ( e.which === 9 && !e.shiftKey && index === _sbFocusableEle.length - 1 ){
			hideSidebar();
		}
	})



	// 關閉 _sidebar
	function hideSidebar(){
		_sidebar.removeClass('reveal');
		setTimeout(function () { _sidebar.hide(); }, 450);
		_sidebarCtrl.removeClass('closeIt');
		_sidebarMask.fadeOut(400);
		_body.removeClass('noScroll');
	}

	_sidebarCtrl.click(function () {
		if (_sidebar.hasClass('reveal')) {
			hideSidebar();
		} else {
			_sidebar.show().addClass('reveal');
			_sidebarCtrl.addClass('closeIt');
			_sidebarMask.fadeIn(400);
			_body.addClass('noScroll');
		}
	})

	// 行動版側欄專用遮罩
	_sidebarMask.click( function() {
		hideSidebar();
	})



	/*------------------------------------*/
	/////////////字型大小 font-size//////////
	/*------------------------------------*/
	$('.font_size')
		.find('.small')
		.click(function (e) {
			$(this).parent('li').siblings('li').find('a').removeClass('active');
			$('.main').removeClass('large_size').addClass('small_size');
			$(this).blur().addClass('active');
			e.preventDefault();
			createCookie('FontSize', 'small', 356);
		});
	$('.font_size')
		.find('.medium')
		.click(function (e) {
			$(this).parent('li').siblings('li').find('a').removeClass('active');
			$('.main').removeClass('large_size small_size');
			$(this).blur().addClass('active');
			e.preventDefault();
			createCookie('FontSize', 'medium', 356);
		});
	$('.font_size')
		.find('.large')
		.click(function (e) {
			$(this).parent('li').siblings('li').find('a').removeClass('active');
			$('.main').removeClass('small_size').addClass('large_size');
			$(this).blur().addClass('active');
			e.preventDefault();
			createCookie('FontSize', 'large', 356);
		});

	function createCookie(name, value, days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
			var expires = '; expires=' + date.toGMTString();
		} else expires = '';
		document.cookie = name + '=' + value + expires + '; path=/';
	}

	function readCookie(name) {
		var nameEQ = name + '=';
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	}
	window.onload = function (e) {
		var cookie = readCookie('FontSize');
		//alert('cookie='+cookie);
		if (cookie == 'small') {
			//$('.font_size').find('.small').click();
			$('.font_size').find('.small').parent('li').siblings('li').find('a').removeClass('active');
			$('.main').removeClass('large_size medium_size').addClass('small_size');
			$('.font_size').find('.small').addClass('active');
			e.preventDefault();
		} else {
			if (cookie == 'large') {
				//$('.font_size').find('.large').click();
				$('.font_size').find('.large').parent('li').siblings('li').find('a').removeClass('active');
				$('.main').removeClass('small_size medium_size').addClass('large_size');
				$('.font_size').find('.large').addClass('active');
				e.preventDefault();
			} else {
				//這裡是預設宣告
				//$('.font_size').find('.medium').click();
				$('.font_size').find('.medium').parent('li').siblings('li').find('a').removeClass('active');
				$('.main').removeClass('large_size small_size');
				$('.font_size').find('.medium').addClass('active');
				e.preventDefault();
			}
		}
	};

})