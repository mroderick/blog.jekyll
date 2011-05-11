
var $j = jQuery;

/**
 * tdc object
 */
if (!window.tdc) {
	var tdc = {};
}

tdc.BuildVersion = '5.0';

/**
 * Gets the URL for the i (image and css) server
 * @param {Boolean} makeSecure Forces the URL to be the secure one
 * @returns The URL for the i server fx http://i.c.dk or https://i.tdconline.dk
 * @type String
 */
tdc.getI = function(makeSecure) {
	var pro = (location.protocol == "file:" ? "http:" : location.protocol);
	if (pro == "https:" || makeSecure) {
		return pro + "//i.tdconline.dk";
	} else {
		return pro + "//i.c.dk";
	}
};

tdc.popup = function(aURL, aWidth, aHeight, aWindowname) {
	var windowname = aWindowname ? aWindowname : '';
	window.open(aURL, windowname, "width=" + aWidth + ", height=" + aHeight + ", left=150, top=100, resizable=1, scrollbars=1");
};

tdc.redir = function(aUrl, aCsref) {
	if (typeof(aCsref) != 'undefined' && aCsref != '' && aUrl.indexOf('csref') == -1) {
		delimiter = (aUrl.indexOf("?") > -1) ? "&" : "?";
		aUrl += delimiter + "csref=" + aCsref;
	}	
	top.location.href = aUrl;
};


/**
 * tdc.partner object
 */
tdc.partner = function() {
	var printSnippet = false;

	function dirlist(aId, aCount) {
		var idString = '' + aId;
		var dir = '';

		if (aId < 10) {
			if (aCount > 2) {
				dir = '00' + aId;
			} else {
				dir = '0' + aId;
			}
		} else if (aCount > 2 && aId < 100) {
			dir = dir = '0' + aId;
		} else {
			dir = idString.substr(idString.length-aCount);
		}

		var dirlist = '';
		for (var i = (aCount-1); i >= 0; i--) {
			dirlist += '/' + dir.substr(i, 1);
		}

		return dirlist;
	}

	return {
		BuildVersion: '5.0',

		/**
		 * Holds a array of all loaded snippets
		 * @type Array
		 */
		snippet_arr : new Array(),

		/**
		 * Prints a publish article
		 * @param {String} aId ID of the publish articleto load
		 */
		publish : function(aId) {
			document.write('<script charset="ISO-8859-1" type="text/javascript" src="' + tdc.getI() + '/cms/publish' + dirlist(aId,2) + '/' + aId + '.js"></script>');
		},

		/**
		 * Prints a element
		 * @param {String} eId ID of the element instance to load
		 */
		element : function(eId) {
			document.write('<script charset="ISO-8859-1" type="text/javascript" src="' + tdc.getI() + '/cms/element' + dirlist(eId,2) + '/' + eId + '.js"></script>');
		},

		/**
		 * Loads a snippet
		 * @param {String} sId ID of the snippet to load
		 */
		loadSnippet : function(sId) {
			document.write('<script charset="ISO-8859-1" type="text/javascript" src="' + tdc.getI() + '/cms/snippet' + dirlist(sId,2) + '/' + sId + '.js"></script>');
		},

		/**
		 * Prints a snippet
		 * @param {String} aId ID of the snippet to load
		 * @author Anders Hal
		 */
		snippet : function(sId) {
			this.printSnippet = true;
			this.loadSnippet(sId);
		}
	}
}();


/**
 * tdc.cookie object
 */
tdc.cookie = function() {
	return {

		/**
		 * Return domain part of a URI
		 * @param {String} aUrl URI to search
		 * @returns A string with the domain name
		 * @type String
		 * @author Henrik Schack
		 */
		getDomain : function(aUrl) {
			return aUrl.match(/^(https?:\/\/)?([^\/]+)/i)[2].match(/[^\.\/]+(\.[^\.\/]+)?$/i)[0];
		},

		/**
		 * Gets the value of a cookie
		 * @param {String} aName Name of the cookie
		 * @returns A string with the value of the cookie
		 * @author Henrik Gemal
		 */
		get : function(aName){
			var dc = document.cookie;
			if (!dc) {
				return false;
			}
			var prefix = aName + "=";
			var begin = dc.indexOf("; " + prefix);
			if (begin == -1) {
				begin = dc.indexOf(prefix);
				if (begin != 0) {
					return null;
				}
			} else {
				begin += 2;
			}
			var end = document.cookie.indexOf(";", begin)
			if (end == -1) {
				end=dc.length;
			}
			return unescape(dc.substring(begin + prefix.length,end));
		},

		/**
		 * Sets a cookie
		 * @param {String} aName Name of the cookie to be set
		 * @param {String} aValue Value of the cookie to be set
		 * @param {String} aExpires When the cookie should expire. Default is end of session
		 * @param {String} aPath Pathname for the cookie. Default is nothing
		 * @param {String} aDomain Domain for the cookie. Default is nothing
		 * @param {Boolean} aSecure Is the cookie secure of not. Default is no
		 * @author Henrik Gemal
		 */
		set : function(aName, aValue, aExpires, aPath, aDomain, aSecure) {
			document.cookie = escape(aName) + "=" + escape(aValue) + (aExpires ? "; EXPIRES=" + aExpires.toGMTString() : "") + (aPath ? "; PATH=" + aPath : "") + (aDomain ? "; DOMAIN=" + aDomain : "") + (aSecure ? "; SECURE" : "")
		},

		/**
		 * Deletes a cookie
		 * @param {String} aName Name of the cookie to be deleted
		 * @param {String} aPath Pathname for the cookie. Default is nothing
		 * @param {String} aDomain Domain for the cookie. Default is nothing
		 * @param {Boolean} aSecure Is the cookie secure of not. Default is no
		 * @author Henrik Gemal
		 */
		remove : function(aName, aPath, aDomain, aSecure) {
			document.cookie = escape(aName) + "=null; EXPIRES=" + new Date(0).toGMTString() + (aPath ? "; PATH=" + aPath : "") + (aDomain ? "; DOMAIN=" + aDomain : "") + (aSecure ? "; SECURE" : "")
		}
	};
}();

tdc.include = function(aFile, aCharset) {
  var charset = aCharset ? aCharset : "ISO-8859-1";
  if (tdc.browser.onmac || tdc.browser.isie || tdc.browser.iswebkit) {
	document.write('<script type="text/javascript" charset="' + charset + '" src="'+ aFile +'"></script>\n');
  } else if (document.createElement && document.getElementsByTagName) {
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", aFile);
	script.setAttribute("charset", charset);
	head.appendChild(script);
  }
};	

/**
 * tdc.browser object
 * @constructor
 */
tdc.browser = function() {
	var ua = navigator.userAgent.toLowerCase();
	var uav = navigator.appVersion;
	var cookies;
	var flash;

	return {
		
		/**
		 * Is the browser a Webkit
		 * $type Boolean
		 */
		iswebkit : (ua.indexOf("webkit") != -1),	
		/**
		 * Is the browser a Firefox
		 * @type Boolean
		 */
		isfirefox : (ua.indexOf("firebird") != -1 || ua.indexOf("firefox") != -1 || ua.indexOf("minefield") != -1),
		/**
		 * Is the browser a Internet Explorer
		 * @type Boolean
		 */
		isie : (navigator.appName == "Microsoft Internet Explorer") ? 1 : 0,
		/**
		 * Is the browser a Opera
		 * @type Boolean
		 */
		isopera : (ua.indexOf("opera") != -1),
		/**
		 * Is the browser a Netscape
		 * @type Boolean
		 */
		isnetscape : (navigator.appName == "Netscape") ? 1 : 0,

		/**
		 * Is the browser running on Mac
		 * @type Boolean
		 */
		onmac : (ua.indexOf("mac") != -1),
		/**
		 * Is the browser running on Windows
		 * @type Boolean
		 */
		onwin : (ua.indexOf("windows") != -1),

		/**
		 * Status for the IP Man system. Please see http://wiki.opasia.dk/index.php/THQ for documentation
		 */
		thq : false,

		/**
		 * Get the browser version number. Version 6.7 returns 6
		 * @param {Boolean} aFullversion Get the full version number of just major
		 * @returns A string with the version number
		 * @type String
		 * @author Henrik Gemal
		 */
		getVersion : function(aFullversion) {
			var ver = false;
			if (this.isie) {
				ver = parseFloat(uav.substr(uav.indexOf("MSIE") + 5, 4));
			}
			if (!ver) {
				ver = parseFloat(uav);
			}
			return (aFullversion ? ver : parseInt(ver));
		},

		/**
		 * Get the browser sub version number. Version 6.7 returns 7
		 * @returns A string with the sub version number
		 * @type String
		 * @author Henrik Gemal
		 */
		getVersionSub : function() {
			// convert the number to a string to do string operations
			ver = "" + this.getVersion(1);
			if (ver.indexOf(".") != -1) {
				ver = ver.substring(ver.indexOf(".") + 1);
			} else {
				ver = 0;
			}
			if (!ver) {
				ver = 0;
			}
			return ver;
		},

		/**
		 * Does the browser support Flash
		 * @returns A boolean indicating if the browser supports Flash
		 * @type Boolean
		 * @author Henrik Gemal
		 */
		hasFlash : function() {
			// is the information already available?
			if (typeof(flash) == "undefined") {
				flash = false;
				if (navigator.plugins && typeof(navigator.plugins["Shockwave Flash"]) == "object") {
					flash = parseFloat(navigator.plugins["Shockwave Flash"].description.substring(navigator.plugins["Shockwave Flash"].description.toLowerCase().lastIndexOf("flash ") + 6, navigator.plugins["Shockwave Flash"].description.length))
				} else if (this.isie) {
					document.writeln('<scr' + 'ipt type="text/vbscript">');
					document.writeln('on error resume next');
					document.writeln('set f = CreateObject("ShockwaveFlash.ShockwaveFlash")');
					document.writeln('if IsObject(f) then');
					document.writeln('flashie = parseFloat(hex(f.FlashVersion())/10000)');
					document.writeln('end if');
					document.writeln('</scr' + 'ipt>');
					if (typeof(flashie) != "undefined") {
						flash = flashie;
					}
				}
			}
			return flash;
		},

		/**
		 * Does the browser support cookies
		 * @returns A boolean indicating if the browser supports cookies
		 * @type Boolean
		 * @author Henrik Gemal
		 */
		hasCookies : function() {
			// is the information already available?
			if (typeof(cookies) == "undefined") {
				if (!document.cookie) {
					tdc.cookie.set("cookietest", 1)
					cookies = document.cookie ? true : false;
					tdc.cookie.remove("cookietest");
				} else {
					cookies = true;
				}
			}
			return cookies;
		}
	}

}();


/**
 * tdc login object
 * @author Ulrik Hind�
 */
(function() {
	tdc.login = createLoginObject({
		'newUserUrl'                       : "https://fxn.selfcare.tdc.dk/Krump/public/onlinereg/showChooseUsername.do?site=online",
		'forgotPasswordUrl'                : 'http://tdc.dk/login/glemt/',
		'linkTarget'                       : "top",
		'optionsUrl'                       : 'https://selvbetjening.tdconline.dk/eservice/ditLogin.do',
		'aboutTdcLoginUrl'                 : 'http://tdc.dk/login/',
		'loginTarget'                      : document.location.href,
		'loginFailedTarget'                : document.location.href.replace(/#.*/, ''),
		'logoutTarget'                     : (location.protocol == "https:" ? "https://" : "http://") + document.location.hostname + '/',
		'loggedInInfo'                     : '',
		'loggedOutInfo'                    : '',
		'forceLoggedOut'                   : false,
		'higherAccessLevelRequiredInfo'    : 'For at f� adgang til denne side, skal du bekr�ftige din identitet ved at angive dit TDC brugernavn og password. ',
		'requiredAccessLevel'              : 2,
		'isErhverv'                        : false
	});
	
	tdc.erhvlogin = createLoginObject({
		'newUserUrl'                       : "http://tdc.dk",
		'forgotPasswordUrl'                : 'http://tdc.dk/login/glemt/',
		'linkTarget'                       : "top",
		'optionsUrl'                       : 'https://selvbetjening.tdconline.dk/eservice/ditLogin.do',
		'aboutTdcLoginUrl'                 : 'http://tdc.dk/login/',
		'loginTarget'                      : document.location.href,
		'loginFailedTarget'                : document.location.href.replace(/#.*/, ''),
		'logoutTarget'                     : (location.protocol == "https:" ? "https://" : "http://") + document.location.hostname + '/',
		'loggedInInfo'                     : '',
		'loggedOutInfo'                    : '',
		'forceLoggedOut'                   : false,
		'higherAccessLevelRequiredInfo'    : 'For at f� adgang til denne side, skal du bekr�ftige din identitet ved at angive dit TDC brugernavn og password. ',
		'requiredAccessLevel'              : 2,
		'isErhverv'                        : true
	});

	
	function createLoginObject(_configuration) {
		var _cookiePrefix = _configuration.isErhverv ? 'Erhv' : '';
		
		var _redrawCallbacks = [];
		
		var _loginSiteName = 'loginsite';
		if ((new RegExp(';pet')).test(tdc.cookie.get('CoreIdTest'))) {
			_loginSiteName = 'loginsitepet.pp';
		} else if ((new RegExp(';tsttdc')).test(tdc.cookie.get('CoreIdTest'))) {
			_loginSiteName = 'loginsitetest';
		} else if ((new RegExp(';test')).test(tdc.cookie.get('CoreIdTest'))) {
			_loginSiteName = 'loginsitetest';
		} else if ((new RegExp(';udv')).test(tdc.cookie.get('CoreIdTest'))) {
			_loginSiteName = 'loginsiteudv';
		}
	
		if (document.location.search) (function(){
			var re = new RegExp("[?&]ssologintarget=([^&]+)");
			var value = re.exec(document.location.search);
			if (value && value[1]) {
				_configuration.loginTarget = decodeURIComponent(value[1]);
			}
		})();		
		
		
		/*
		 * private methods
		 */
		var _writeHiddenSsoImages = function(returnHtml){
			if (typeof(returnHtml) != 'boolean') {
				returnHtml = false;
			}
			function otherDomains()	{
				var currentDomain = _secondLevelAndTopLevelDomain(document.location.hostname);
				return jQuery.grep(_getSupportedDomains(), function(n){return n != currentDomain;});
			}
			
			function userDataCookieMustBeUpdated() {
				return (/ssouud/).test(document.location.search);
			}			
			
			var delayBeforeInsertingImages = 500; // we don't want to halt everything while waiting for the images to load
			if (_that.isLoggedIn()) {
				jQuery(function(){
					setTimeout(function(){
						var obSSOCookieChangedByWebGate = tdc.cookie.get('ObSSOCookie') != tdc.cookie.get('ObSSOCookie2');
						var allDomains = _getSupportedDomains();
						jQuery.each(allDomains, function(){
							var src = location.protocol +  '//' + _loginSiteName + '.' + this + '/update/';
							if (userDataCookieMustBeUpdated()) {
								src += '?ssouud';
							}
							if (obSSOCookieChangedByWebGate) {
								src += (src.indexOf('?') == -1) ? '?' : '&';
								src += 'r=' + Math.random();
							}
							jQuery('#sso_logout_form_images').append('<img border="0" src="' + src + '" width="1" height="1"');
						});
					}, delayBeforeInsertingImages);
				});
			} else 	if (_configuration['forceLoggedOut']) {		
				jQuery(function(){
					setTimeout(function(){
						var domainsToLogOut = _configuration['forceLoggedOut'] ? _getSupportedDomains() : otherDomains();
						jQuery.each(domainsToLogOut, function(){
							var src = location.protocol +  '//' + _loginSiteName + '.' + this + '/update/?logout';
							jQuery('#sso_logout_form_images').append('<img border="0" src="' + src + '"');					
						});
					}, delayBeforeInsertingImages);
				});		
			}
			
			var html = '<span id="sso_logout_form_images"></span>';
			if (returnHtml) {
				return html;
			} else {
				document.write(html);
			}
		};
		
		var _writeHiddenFields = function(returnHtml) {			
			var ta = _that.loginBoxTemplateArguments();
			if (typeof(returnHtml) != 'boolean') {
				returnHtml = false;
			}
			var html = '';
			if (ta.isLoggedIn) {
				html += '<input type="hidden" name="logout_target" value="' + ta.logoutTarget + '" />';
			} else {
				html += '<input type="hidden" name="login_target" value="' + ta.loginTarget + '" />';
				html += '<input type="hidden" name="login_failed_target" value="' + ta.loginFailedTarget + '" />';
			}
			html += '<input type="hidden" name="erhv" value="' + (ta.isErhverv ? '1' : '0')  + '" />';
			if (returnHtml) {
				return html;
			} else {
				document.write(html);
			}
		};

		var _isDisabledBecauseOfBrowser = function() {
			var ret = false;
			// disabled older IEs than 5 and IE on Mac
			if (tdc.browser.isie && (tdc.browser.getVersion() < 5 || tdc.browser.onmac)) {
				ret = true;
			// disabled older IEs than 5.5
			} else if (tdc.browser.isie && tdc.browser.getVersion() == 5 && tdc.browser.getVersionSub() < 5) {
				ret = true;
			// disabled older Operas then 7
			} else if (tdc.browser.isopera && tdc.browser.getVersion() < 7) {
				ret = true;
			// disabled older Netscapes than 5
			} else if (tdc.browser.isnetscape && tdc.browser.getVersion() < 5) {
				ret = true;
			// disabled browsers that doesn't support cookies
			} else if (!tdc.browser.hasCookies) {
				ret = true;
			}
			return ret;
		};
		
		
		var _secondLevelAndTopLevelDomain = function(domain)	{
		    var m = domain.match(new RegExp('[^.]+\\.[^.]+$'));
		    return m[0];
		};
		
		var _getSupportedDomains = function() {
			if ((new RegExp(';(test|udv)')).test(tdc.cookie.get('CoreIdTest'))) {
				return ['tdk.dk'];
			}
			return ['tdc.dk', 'tdconline.dk'];
		};
		
		var _alert = alert;
		
		var _redraw = function () {
			var ta = _that.loginBoxTemplateArguments();
			var links = [];
			jQuery.each(_redrawCallbacks, function(){
				this();
			});
			
			// Run on each loginbox on the page
			jQuery('.t_login_box_addjs form, form.t_login_box_addjs').each(function(){
				var form = jQuery(this);
				var isErhverv = form.find('input[name=erhv]').val() == 1;
				
				if (isErhverv === ta.isErhverv) {
					if (!ta.isLoggedIn) {
						form.submit(function(){
							var name = form.find(':input[name=usr_name]').val();
							if (!name) {
								_alert("Du har ikke udfyldt noget Brugernavn");
								return false;
							}
							var password = form.find(':input[name=usr_password]').val();
							if (!password) {
								_alert("Du har ikke udfyldt noget Password");
								return false;
							}
							return true;
						})
						.attr('action', ta.loginUrl);
	
						form.find(':input[name=usr_name]').each(function() {
							if (this.value == '') {
								if (ta.rememberedUsername != 'null') {
									this.value = ta.rememberedUsername ? ta.rememberedUsername : '';
								}
							}
						});
	
						// Rember username set?
						if (ta.rememberedUsername) {
							form.find(':input[name=remember_username]').attr('checked','checked'); //check the checkbox
							form.find('.g_tdclogin_password input').focus(); //Set focus on the password field
						} else {
							form.find('.g_tdclogin_username input').focus(); //Set focus on the username field
						}
	
					} else {
						// HACK HACK HACK
						// Uden # tolker ie8 det som
						// <FORM class=t_login_box_addjs method=get action=http://loginsite.tdconline.dk/logout></FORM>
						// ...
						// </FORM>
						// i den fede logbox
						form.attr('action', ta.logoutUrl+'#');
					}
				}

			});			
			
		};

		var _doAutoLogin = function() {
			var ta = _that.loginBoxTemplateArguments();
   			$j('body').append(
   				'<form id="tdc_login_autoLoginForm" action="' + ta.loginUrl + '" method="POST">' +
   				'<input type="text" name="login_target" value="' + ta.loginTarget + '">' + 
   				'<input type="text" name="auto_login" value="yes">' + 
   				'</form>'
   			);
   			setTimeout(function(){
   				$j('#tdc_login_autoLoginForm').submit();
   			}, 10);
   		};
		
		
		if (typeof(jQuery) == 'function') {
			jQuery(_redraw); // redraw loginbox when page is ready
		}
		
		var _that = 678;			
		
		var loginObj = {
			/*
			 * public methods
			 */
			
			setLoginTarget : function(value){
				jQuery('.t_login_box :input[name=login_target]').val(value.toString()); // not sound
				_configuration.loginTarget = value.toString();
			},
			
			setLoginFailedTarget : function(value){
				jQuery('.t_login_box :input[name=login_target]').val(value.toString()); // not sound
				_configuration.loginFailedTarget = value.toString();
			},			
			
			setLogoutTarget : function(value){
				jQuery('.t_login_box :input[name=logout_target]').val(value.toString());  // not sound
				_configuration.logoutTarget = value.toString();
			},

			setLinkTarget : function(value){
				jQuery('.t_login_box a').attr('target', '_' + value);  // not sound
				_configuration.linkTarget = value;
			},

			setNewUserUrl : function(value){
				_configuration.newUserUrl = value;
				_redraw();
			},
			
			setForgotPasswordUrl : function(value){
				_configuration.forgotPasswordUrl = value;
				_redraw();
			},
			
			
			setOptionsUrl : function(value){
				_configuration.optionsUrl = value;
				_redraw();
			},
			
			setAboutTdcLoginUrl : function(value){
				_configuration.aboutTdcLoginUrl = value;
				_redraw();
			},
			
			addRedrawCallback : function (callback) {
				_redrawCallbacks.push(callback);			
			},
			
			setLoggedInInfo : function(html) {
				_configuration.loggedInInfo = html;
				_redraw();
			},
			
			setLoggedOutInfo : function(html) {
				_configuration.loggedOutInfo = html;
				_redraw();
			},
			
			setHigherAccessLevelRequiredInfo : function(html) {
				_configuration.higherAccessLevelRequiredInfo = html;
				_redraw();
			},
			
			setRequiredAccessLevel : function(value) {
				_configuration.requiredAccessLevel = value;
				//_redraw();
			},

			setForceLoggedOut : function(value) {
				_configuration.forceLoggedOut = true;
				_redraw();
			},
			
			redraw: function() {
				_redraw();
			},	
			
			autoLoginIfPossible : function () {
				if (!this.useSling()) {
					return;
				}
	           	$j.ajax({
	           		url: "https://" + _loginSiteName + ".tdc.dk/login/possibleAccessLevel/",
	            	dataType: "jsonp",  
	            	success : function(s) {
	            		if (/^\d+$/.test(s) && (Number(s) >= Number(_configuration.requiredAccessLevel))) {
	            			_doAutoLogin();
	                	} else {
	                	}
	               	}
	           	});
			},
			
			useSling : function() {
				return tdc.cookie.get('SsoTestUseSling') === 'on';
			},
			
			setAlertFunction: function(f) {
				_alert = f;
			},
			
			logout: function() {
				var ta = this.loginBoxTemplateArguments();
				$j('body').append(
						"<form id='tdcSsoDynamicInsertedLogoutForm' action='" + ta.logoutUrl + "'>"
						+ ta.writeHiddenFieldsFunction(true)
						+ "</form>"
				);
				setTimeout(function() {$j('#tdcSsoDynamicInsertedLogoutForm').submit();}, 10);
			},			

			_init : function() {
				_that = this;
			},
			
			/**
			 * Return a map with data and funtions used to draw login/logout boxes
			 *
			 * In case of login the form must post the fields usr_name, usr_password and optionally remember_username
			 */
			loginBoxTemplateArguments : function() {
				var templateArguments;
				var defaultDomain = 'loginsite.tdc.dk';

				if ((new RegExp(';pet')).test(tdc.cookie.get('CoreIdTest'))) {
					defaultDomain = 'loginsitepet.pp.tdc.dk';
				} else if ((new RegExp(';tsttdc')).test(tdc.cookie.get('CoreIdTest'))) {
					defaultDomain = 'loginsitetest.tdc.dk';
				} else if ((new RegExp(';test')).test(tdc.cookie.get('CoreIdTest'))) {
					defaultDomain = 'loginsitetest.tdk.dk';
				} else if ((new RegExp(';udv')).test(tdc.cookie.get('CoreIdTest'))) {
					defaultDomain = 'loginsiteudv.tdk.dk';
				}					

				var loginUrl        = 'https://' + defaultDomain + '/login/';					
				var logoutUrl       = (location.protocol == "https:" ? "https://" :"http://") + defaultDomain + '/logout/';
				if ((new RegExp(';tsttdc')).test(tdc.cookie.get('CoreIdTest'))) {
					logoutUrl = "https://" + defaultDomain + '/logout/';
				}
	
				templateArguments = {
					'isLoggedIn'                       : this.isLoggedIn(),
					'isDisabledBecauseOfBrowser'       : _isDisabledBecauseOfBrowser(),
					'isLoginSystemTemporarilyDisabled' : this.isLoginSystemTemporarilyDisabled(),
					'userName'                         : this.getUsername(), //Try to get the login name from the cookie
					'rememberedUsername'               : tdc.cookie.get(_cookiePrefix + "SsoRememberedUserName"),
					'loginUrl'                         : loginUrl,
					'logoutUrl'                        : logoutUrl,
					'writeHiddenSsoImagesFunction'     : _writeHiddenSsoImages,
					'writeHiddenFieldsFunction'        : _writeHiddenFields
				};

				for (var key in _configuration) {
					if (typeof(key) != 'function') {
						templateArguments[key] = _configuration[key];
					}
				}		
				
				return templateArguments;
			},
			
			getUsername : function() {
				var name = "";
				var s = tdc.cookie.get(_cookiePrefix + "SsoSessionData");
				if (s) {
					name = s.substring(0, s.indexOf(";")).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
				}
				return name;
			},

			isLoginSystemTemporarilyDisabled : function() {
				return false;
			},
			isLoggedIn : function() {
				return !!tdc.cookie.get(_cookiePrefix + 'SsoSessionData') && !_configuration['forceLoggedOut'];
			},
			setUseLoginsitePet : function(useLoginsitePet) {
				_loginSiteName = useLoginsitePet ? 'loginsitepet.pp' : 'loginsite';
			}
		};	
		loginObj._init();
		return loginObj;
	
	}
})();