/**
	* The template can execute js code internally! <%= alert("foo")%> will execute
	* see below for template logic example
	*
	*	var data = {
	*		test: '<div id="<%=id%>" class="<%=(i % 2 == 1 ? " even" : "")%>">\
	*	 		<div class="grid_1 alpha right"> \
	*			<img class="righted" src="<%=profile_image_url%>"/>  \
	*			</div>   \
	*			<div class="grid_6 omega contents">    \
	*			<p><b><a href="/<%=from_user%>"><%=from_user%></a>:</b> <%=text%></p> \
	*			</div>   \
	*			</div>'
	*			}
	*
	*  CONDITIONALS ARE DONE LIKE THIS:
	*
	*		<% if (o.foo) { %>
	*  		Foo is true-ish
	*  	<% } else { %>
	*  		Foo is not true-ish
	*  	<% } %>
	*
	 * 
	 */

(function() {
	
	/* blockBox:
			Used in the prelaunch replace script, should not be used any more
		modalDefault:
			The default template for modals/overlays
		selfcareNavigator:
			Used in Business Selfcare for the hieracial navigator
		loginBox:
		modalInject:
		modalIframe:
		subMenuHolder:
			Used to render the dropdownlike submenu on MitTDC
		searchType:
			Used to render the searchfields on MitTDC (DGS and Play)
		searchTypeGoogle:
			Used to render the searchfield on MitTDC (Google)
		loginBoxTemplate:
		loginBoxFormTemplate:
		logoutBoxFormTemplate:
		loginOutTopNav:
		demandwareSearch:
			Used in local/shopsearch.js and local/shopsearch_soho.js to render searchfield on shop dogtags
		pageRatingYesNo:
			Rating in the footer
		pageRatingStar:
			Rating in a block with 5 stars
	*/
			
	var Templates = {
		'blockBox':
			'<div class="g_block <%=type %>">\
				<div class="g_block_top"><span class="g_block_top_l"></span><span class="g_block_top_r"></span></div>\
				<div class="g_middle"><%=ref %></div>\
				<div class="g_block_bot"><span class="g_block_bot_l"></span><span class="g_block_bot_r"></span></div>\
			</div>',
			
		'modalDefault':
			'<div class="g_block_content g_modal_default">\
				<% if(header){ %>\
					<div class="g_modal_header">\
						<a href="#" class="g_btn_small g_modal_bn_close"><span>\
						<% if (cache.language == "fi") { %>\
							Sulje\
						<% } else if (cache.language == "se") { %>\
							St�ng\
						<% } else { %>\
							Luk\
						<% } %>\
						</span></a>\
					</div>\
				<% } %>\
				<% if(typeof(blockclass)== "undefined"){ %>\
					<div class="g_modal_content"><%=content %></div>\
				<% } else { %>\
					<div class="g_modal_content <%= blockclass %>"><%=content %></div>\
				<% } %>\
				<% if(footer){ %>\
					<div class="g_modal_footer">\
						<a href="#" class="g_btn_small g_modal_bn_close"><span>\
						<% if (cache.language == "fi") { %>\
							Sulje\
						<% } else if (cache.language == "se") { %>\
							St�ng\
						<% } else { %>\
							Luk\
						<% } %>\
						</span></a>\
					</div>\
				<% } %>\
			</div>',
		'modalComplexContent':
			'<div class="g_block_content g_modal_complex_content">\
				<% if(header){ %>\
					<div class="g_modal_header">\
						<a href="#" class="g_btn_small g_modal_bn_close"><span>\
						<% if (cache.language == "fi") { %>\
							Sulje\
						<% } else if (cache.language == "se") { %>\
							St�ng\
						<% } else { %>\
							Luk\
						<% } %>\
						</span></a>\
					</div>\
				<% } %>\
				<% if(typeof(blockclass)== "undefined"){ %>\
					<div class="g_modal_content"><%=content %></div>\
				<% } else { %>\
					<div class="g_modal_content <%= blockclass %>"><%=content %></div>\
				<% } %>\
				<% if(footer){ %>\
					<div class="g_modal_footer">\
						<a href="#" class="g_btn_small g_modal_bn_close"><span>\
						<% if (cache.language == "fi") { %>\
							Sulje\
						<% } else if (cache.language == "se") { %>\
							St�ng\
						<% } else { %>\
							Luk\
						<% } %>\
						</span></a>\
					</div>\
				<% } %>\
			</div>',	
		'selfcareNavigator':
			'<div class="g_block_content g_modal_selfcareNavigator">\
				<% if(typeof(blockclass)== "undefined"){ %>\
					<div class="g_modal_content"><div class="g_selfcareoverlay_top"></div><%=content %></div>\
				<% } else { %>\
					<div class="g_modal_content <%= blockclass %>"><div class="g_selfcareoverlay_top"><%=buttonContent%></div><%=content %></div>\
				<% } %>\
			</div>',

		'loginBox':
			'<form action="<%= url %>">\
				<fieldset>\
					<legend><span>TDC Login</span></legend>\
					<% if(!username){ %>\
						<div class="g_tdclogin_username">\
							<label for="username">Brugernavn</label>\
							<input type="text" id="username" name="username" value="Testtekst">\
						</div>\
						<div class="g_tdclogin_password">\
							<label for="password">Password</label>\
							<input type="password" id="password" name="password" value="Testtekst">\
						</div>\
						<button type="submit" class="g_btn g_btn_tdclogin_in"><span>Log ind</span></button>\
						<div class="g_tdclogin_remember">\
							<input type="checkbox" id="rememberpass" name="remember_username">\
							<label for="rememberpass">Husk brugernavn</label>\
						</div>\
						<%= hiddenFieldsHtml %>\
							<a href="<%= link1 %>" class="g_tdclogin_create"><%= link1text %></a>\
							<a href="<%= link2 %>" class="g_tdclogin_problem"><%= link2text %></a>\
						<%} else { %>\
							<div class="g_tdclogin_loggedout">\
								<p>Du er logget ind som: <strong><%=username %></strong></p>\
								<button type="submit" class="g_btn g_btn_tdclogin_out"><span>Log ud</span></button>\
							</div>\
							<a href="<%= link3 %>" class="g_tdclogin_selfservice">G&aring; til Selvbetjening Privat</a>\
						<% } %>\
				</fieldset>\
			</form>',
			
		'modalInject':
			'<div id="g_block_modals">\
				<div class="g_block_modal">\
					<div class="g_block_top"><span class="g_block_top_l"></span><span class="g_block_top_r"></span></div>\
					<div class="g_middle">\
						<div class="g_block_content g_modal_default"></div>\
					</div>\
					<div class="g_block_bot"><span class="g_block_bot_l"></span><span class="g_block_bot_r"></span></div>\
				</div>\
			</div>\
			<div id="g_block_modal_back"></div>',
			
		'modalIframe':
			'<div class="g_block_content g_modal_default g_modal_iframe">\
				<% if(header){ %>\
					<div class="g_modal_header"><a href="#" class="g_btn_small g_modal_bn_close"><span>\
					<% if (cache.language == "fi") { %>\
							Sulje\
						<% } else { %>\
							Luk\
						<% } %>\
						</span></a></div>\
				<% } %>\
				<div class="g_modal_content"><%=content %></div>\
			</div>',
			
		'subMenuHolder':
			'<div id="g_submenu_overlay" class="g_block">\
				<div class="g_block_topnav_submenu_top"><span class="g_block_topnav_submenu_top_l"></span><p class="g_block_topnav_submenu_top_m"></p><span class="g_block_topnav_submenu_top_r"></span></div>\
				<div class="g_block_top"><span class="g_block_top_l"></span><span class="g_block_top_r"></span></div>\
				<div class="g_middle">\
					<div class="g_block_content">\
						<div class="g_block_txt">\
							<ul id="g_submenu_ul">\
							</ul>\
						</div>\
					</div>\
				</div>\
				<div class="g_block_bot"><span class="g_block_bot_l"></span><span class="g_block_bot_r"></span></div>\
			</div>',
			
		'searchTypeGoogle' : 
				'<fieldset class="g_search_<%= type %>">\
				<legend>S&oslash;g med Google</legend>\
				<form method="get" action="<%= url %>" name="<%= type %>form">\
					<input type="hidden" value="yes" name="searching">\
					<input type="hidden" value="<%= searcharea %>" name="searcharea">\
					<input type="hidden" value="<%= position %>" name="c">\
					<div class="g_search_container">\
						<span class="g_search_logo"></span>\
						<div class="g_search_field g_search_default">\
							<span></span>\
							<input name="q" type="text" value="S&oslash;g p&aring; nettet med">\
						</div>\
						<button class="g_btn g_btn_googlesearch" type="submit">S&oslash;g</button>\
					</div>\
				</form>\
			</fieldset>',
			
		'searchTypeGoogleResult' :
			'<fieldset class="g_search_<%= type %>">\
				<legend>S&oslash;g med Google</legend>\
				<form method="get" action="<%= url %>" name="<%= type %>form">\
					<input type="hidden" value="yes" name="searching">\
					<input type="hidden" value="<%= searcharea %>" name="searcharea">\
					<input type="hidden" value="<%= position %>" name="c">\
					<div class="g_search_container">\
						<span class="g_search_logo"></span>\
						<div class="g_search_field g_search_default">\
							<span></span>\
						<%if(searcharea=="dk"){%>\
							<input name="q" type="text" value="S&oslash;g p&aring; nettet med Google">\
						<%}else if (searcharea == "world"){%>\
							<input name="q" type="text" value="S&oslash;g p&aring; nettet med Google">\
						<%}%>\
						</div>\
						<button class="g_btn g_btn_googlesearch" type="submit">S&oslash;g</button>\
					</div>\
				</form>\
			</fieldset>',
			
		'loginBoxTemplate' :
			'<div class="g_block_content g_modal_default g_block_c6 g_block_tdclogin">\
				<div class="g_modal_header">\
					<a href="#" class="g_btn_small g_modal_bn_close"><span>\
					<% if (cache.language == "fi") { %>\
							Sulje\
						<% } else { %>\
							Luk\
						<% } %>\
						</span></a>\
				</div>\
				<div class="g_modal_content">\
					<%=topSnippet%>\
					<div class="g_block_top"><span class="g_block_top_l"></span><span class="g_block_top_r"></span></div>\
					<div class="g_middle">\
						<div class="g_block_content g_block_height_11 g_block_highlight">\
							<div class="g_block_txt g_tdclogin">\
								<%=formHtml%>\
							</div>\
						</div>\
					</div>\
					<div class="g_block_bot"><span class="g_block_bot_l"></span><span class="g_block_bot_r"></span></div>\
					<%=bottomSnippet%>\
				</div>\
			</div>',
			
		'loginBoxFormTemplate' :
			'<form action="<%=templateArguments.loginUrl%>" method="POST" class="t_login_box_addjs">\
				<fieldset>\
					<legend><span>TDC Login</span></legend>\
					<div class="g_tdclogin_username">\
						<label for="usr_name">Brugernavn</label>\
						<input type="text" value="" name="usr_name" class="usr_name">\
					</div>\
					<div class="g_tdclogin_password">\
						<label for="usr_password">Password</label>\
						<input type="password" class="usr_password" name="usr_password" value="">\
					</div>\
					<button class="g_btn g_btn_tdclogin_in" type="submit"><span>Log ind</span></button>\
					<div class="g_tdclogin_remember">\
						<input type="checkbox" name="remember_username" id="rememberpass">\
						<label for="rememberpass">Husk brugernavn</label>\
					</div>\
					<a class="g_tdclogin_problem" href="<%=forgotPasswordUrlHref%>">Problemer med login?</a>\
					<a class="g_tdclogin_create t_login_box_newUserUrl" href="<%=newUserUrlHref%>">Opret login</a>\
				</fieldset>\
				<%=hiddenFields%>\
			</form>',
			
		'loginBoxFormTemplateSling' :
			'<form action="<%=templateArguments.loginUrl%>" method="POST" class="t_login_box_addjs">\
				<fieldset>\
					<legend><span>TDC Login</span></legend>\
					<div class="g_tdclogin_username">\
						<label for="usr_name">Brugernavn</label>\
						<input type="text" value="" name="usr_name" class="usr_name">\
					</div>\
					<div class="g_tdclogin_password">\
						<label for="usr_password">Password</label>\
						<input type="password" class="usr_password" name="usr_password" value="">\
					</div>\
					<button class="g_btn g_btn_tdclogin_in" type="submit"><span>Log ind</span></button>\
					<div class="g_tdclogin_remember">\
						<input type="checkbox" name="remember_me" id="rememberpass">\
						<label for="rememberpass">Husk mig</label>\
					</div>\
					<a class="g_tdclogin_problem" href="<%=forgotPasswordUrlHref%>">Problemer med login?</a>\
					<a class="g_tdclogin_create t_login_box_newUserUrl" href="<%=newUserUrlHref%>">Opret login</a>\
				</fieldset>\
				<%=hiddenFields%>\
			</form>',
						
		'logoutBoxFormTemplate' :
			'<form action="<%=templateArguments.logoutUrl%>" method="GET" class="t_login_box_addjs">\
				<fieldset>\
					<legend><span>TDC Login</span></legend>\
					<div class="g_tdclogin_loggedout">\
						<p>Du er logget ind som: <strong><%=templateArguments.userName%></strong></p>\
						<button class="g_btn g_btn_tdclogin_out" type="submit"><span>Log ud</span></button>\
					</div>\
					<%=templateArguments.loggedInInfo%>\
				</fieldset>\
				<%=hiddenFields%>\
			</form>',
			
		'loginOutTopNav':
			'<% if(loggedIn) { %>\
				<div id=g_site_logout>\
					<a href="#"><span>Log ud</span></a>\
					<form class="t_login_box" id="g_site_logout_form" action="<%=logoutURL%>">\
					<%=hiddenFields%>\
					</form>\
				</div>\
			<% } else { %>\
				<div id="g_site_login">\
					<a href="#"><span>Log ind</span></a>\
				</div>\
			<% } %>\
			<%=hiddenSSO%>',
		
		'demandwareSearch' :
			'<div class="g_block_shopsearch">\
				<form action="<%= action %>" method="get" class="g_searchfield">\
					<span>\
						<input type="text" name="q" value="<%= inputValue %>">\
					</span>\
					<button class="g_btn g_btn_internalsearch" type="submit">S&oslash;g</button>\
				</form>\
			</div>',
			
		'pageRatingYesNo' :
			'<div class="g_footer_rating">\
				<div class="g_rate">\
					<span>Hjalp denne side dig?</span>\
					<a href="#" class="g_btn g_btn_yes" rel="1"><span>Ja</span></a>\
					<a href="#" class="g_btn g_btn_no" rel="0"><span>Nej</span></a>\
				</div>\
				<div class="g_input">\
					<strong>Tak for dit svar</strong>\
					<textarea name="comment" id="g_footer_rating_textarea" rows="2" cols="30">Vi l&aelig;ser din kommentar, men besvarer den ikke.\n\Fejlmelding skal ske via tdc.dk/kontakt</textarea>\
					<div class="g_buttons">\
						<a href="#" id="g_footer_rating_btn_cancel">Luk</a>\
						<a href="#" class="g_btn_default" id="g_footer_rating_btn_send"><span>Send kommentar</span></a>\
					</div>\
				</div>\
			</div>',
			
		'pageRatingStar' :
			'<div class="g_block g_block_c8" id="g_page_rating">\
				<div class="g_block_top"><span class="g_block_top_l"></span><span class="g_block_top_r"></span></div>\
				<div class="g_middle"> \
					<div class="g_block_content">\
						<div class="g_block_txt">\
	 						<h3>Hj&aelig;lp os med at g&oslash;re tdc.dk bedre</h3>\
							<p>Hvordan vurderer du denne side?</p>\
	 						<div>\
								<form action="" method="get">\
									<div> \
										<label class="marker">D&aring;rlig</label>\
										<label class="star"><input name="rate" value="1" title="D�rlig" type="radio">D&aring;rlig</label>\
										<label class="star"><input name="rate" value="2" title="Halvd�rlig" type="radio">Halvd&aring;rlig</label>\
										<label class="star"><input name="rate" value="3" title="Gennemsnitlig" type="radio">Gennemsnitlig</label>\
										<label class="star"><input name="rate" value="4" title="God" type="radio">God</label>\
										<label class="star"><input name="rate" value="5" title="Supergod" type="radio">Supergod</label>\
										<label class="marker">God</label>\
									</div>\
									<div id="g_page_rating_comment">\
										<textarea name="g_page_rating_comment_textarea" id="g_page_rating_comment_textarea" rows="2" cols="30">Vil du ogs&aring; give en kommentar? Tryk her...\n\Vi l&aelig;ser din kommentar, men besvarer den ikke. Fejlmelding skal ske via tdc.dk/kontakt</textarea>\
										<div id="g_page_rating_comment_send"><a class="g_btn_default" href="#"><span>Send</span></a></div>\
									</div>\
									<div id="g_page_rating_thankyou">\
										<p>Tak for din kommentar</p>\
									</div>\
									<div class="g_clear"></div>\
								</form>\
							</div>\
						</div>\
					</div>\
				</div>\
				<div class="g_block_bot"><span class="g_block_bot_l"></span><span class="g_block_bot_r"></span></div>\
			</div>',
				
		'kampyleFeedback' :
			'<div id="k_close_button" class="k_float kc_bottom_sl kc_right"></div>\
			 <div>\
			 	<a href="http://www.kampyle.com/feedback_form/ff-feedback-form.php?site_code=<%= site_code %>&amp;lang=da&amp;form_id=<%= form_id %>" target="kampyleWindow" id="kampylink" class="k_float k_bottom_sl k_right" onclick=\'javascript:k_button.open_ff("site_code=<%= site_code %>&amp;lang=da&amp;form_id=<%= form_id %>");return false;\'>\
			 		<img src="<%= tdc_i %>/gfx/grd/local/kampyle/da-blue-corner-low-right.gif" alt="Feedback Form" border="0"/>\
			 	</a>\
			 </div>'
	};

	/**
 	* Function to get the templates out of the private var	
 	* @param {string} template identifier
 	*/
	function getByID(ID) {
		return Templates[ID] ? Templates[ID] : ID;
	};
	
	tdc.Grd.Templates = {
		getByID: getByID
	};
	
})();
