/*jslint evil: false, strict: false, undef: true, white: false, onevar:false, plusplus:false */
/*global 
	$j,
	window,
	navigator,
	document,
	setTimeout,
	closeDialogue,
	t_d,
	s,
	ot_track,
	unescape,
	escape,
	setInterval,
	swfobject,
	s_gi,
	ot_account
*/

/**
 * @fileoverview
 * Initialize the tdc.Grd name space and fill in
 *
 */
var cache = {
	init: true,
	user : {
		loginSucces		: false,
		loggedIn		: false,
		hasIE			: /msie/i.test(navigator.userAgent)
	}
};

/*
BEST PRACTICE FUNCTIONS
ALWAYS WRITE FUNCTIONS / NAMESPACE EXTENSIONS LIKE THIS:

tdc.Grd.[NAMESPACE] = { };

(function () {

	//PRIVATE FUNCTIONS
	function privateFunctionName ({Object} OR var1,var2,var3){

	}

	//PUBLIC FUNCTIONS
	function publicFunctionName ({Object} OR var1,var2,var3){

	}

	//EXPOSE PUBLIC FUNCTIONS
	tdc.Grd.[NAMESPACE] = {
		exposedFunctionName : publicFunctionName
	}

	//BIND TO EVENTS
	tdc.Grd.Event.Pool.bind({
			init:functionToBindToEvent
		}
	);
	
})();

EVENTS are TRIGGERED with
tdc.Grd.Event.Pool.trigger("SOMEEVENT",data) //data takes an obj/str/bool and it is passed to the listeners

EVENTS are BOUND with
tdc.Grd.Event.Pool.bind({
		event:function,
		otherevent:otherfunction,
		curriedevent:curryedFunction.curry("somevar"),
		normalfunction:normalCuntion("somevar"),
		lambdafunction:function(o){dosomethingWith(o)},
		partialFunction:partialFunction.partial("namedVar")
});


EVENTS are UNBOUND with
tdc.Grd.Event.Pool.unbind({
		event:function
});
//ALWAYS CLEANUP YOUR BINDS.

TEMPLATES are retrieved with
var myTemplate = tdc.Grd.Templates.getByID("someIDname")	//see tdc.grd.templates.js for specifics.

TEMPLATES are RENDERED with
$.renderTemplate(myTemplate, {keys:values})	//see jquery.extensions.js line 270 and forward for specifics.

CACHE OBJECTS are available for usage at
cache
cache.user
*/

var tdc = tdc || {};

window.tdc.Grd = {
	BuildVersion: '0.1.1'
};

/**
 *
 * Initialize the tdc.Grd.Event name space
 *
 */

tdc.Grd.Event = {};

(function($){

	var cache = {},
		eventsHash = {},
		done = {},
		preInit = false,
		init = false;

/**
 *
 * Holds a cache of event and delegates
 *
 * @ignore
 * @private
 */
	//PRIVATE FUNCTIONS
	function eventPoolLink(elm, e) {
		if (elm.attr("href") === "#") {
			e.preventDefault();
		}
		
		var eventName = elm.attr("callbackEvent");
		tdc.Grd.Event.Pool.trigger(eventName, {
			'elm': elm,
			'event': e
		});
	}
	/**
	 * Checks event against cached events
	 * @param {String} eventName
	 * @param {fn} functionreference
	 */
	function checkCachedEvents(type, fn) {
				
		if (cache && cache[type]) {
			for (var i = 0, dataArr = cache[type], n = dataArr.length; i < n; i++) {
				fn(dataArr[i]);
			}
		}
	}
	/**
	 * Fires global events on something
	 * @param {String} what to bind to
	 */
	function fireGlobalEventOn(types,name) {
		$(types).bind("click",function(e){
			/*e.preventDefault();*/
			tdc.Grd.Event.Pool.trigger(name,e);
		});
	}

	/**
	 * Clears the cache
	 * @param None
	 */
	function clearCache() {
		cache = false;
	}


	//PUBLIC FUNCTIONS
	/**
	 * Bind eventlistener to function
	 * @param type Type of event (used by trigger)
	 * @param fn function to call
	 */
	function bind(type, fn) {

		if (!fn) {
			for (var eventName in type) {
				if ( type.hasOwnProperty( eventName ) ){
					fn = type[eventName];
					eventsHash[eventName] = eventsHash[eventName] || [];
					eventsHash[eventName].push(fn);
					checkCachedEvents(eventName, fn);
				}
			}
		} else {
			eventsHash[type] = eventsHash[type] || [];
			eventsHash[type].push(fn);
			checkCachedEvents(type, fn);
		}
	}
	/**
	 * UnBind event from functions
	 * @param type Type of event (used by trigger)
	 * @param fn function to call
	 */
	function unbind(type, fn) {
		if (eventsHash[type]) {
			for (var i = 0, event = eventsHash[type]; i < event.length; i++) {
				if (event[i] == fn) {
					event[i] = undefined;
					delete event[i];
				}
			}
		}
	}
	/**
	 * Trigger event
	 * @param type Type of trigger event (used by trigger)
	 * @param data data to curry into listener function
	 */
	function trigger(type, data) {
		data = data || {};
		data.__currentEvent = type;
		if (cache) {
			cache[type] = cache[type] || [];
			cache[type].push(data);
		}
		var events = eventsHash[type];
		if (events) {
			for (var j = 0, n = events.length, event; j < n; j++) {
				event = events[j];
				if (event) {
					event(data, data);
				}
			}
		}
	}
	
	/**
	 * Expose functions globally
	 */
	tdc.Grd.Event.Pool = {
		bind : bind,
		unbind : unbind,
		addEventListener : bind,
		removeEventListener : unbind,
		trigger : trigger
	};
	
	/**
	 * Dummy, to show usage of bind
	 * @ignore
	 */
	tdc.Grd.Event.Pool.bind({
		/* bind event directly to event binder here
		*  typically:
		*  eventName:function,
		*  eventName:anonFunction(){function();
		*		function();},
		* eventName:function
		*/
		/*
		"init" : function(){
			fireGlobalEventOn('a,button','linkClicked');
			fireGlobalEventOn('input','fieldClicked');
		}
		*/
	});
	/**
	 * create preInit call and set preinit to true
	 * @ignore
	 */
	$(function domReady() {
		if (tdc.Grd.Event.preInit){
			 return; //prevent double dom.readys - RARELY happens - but better safe...
		}
		tdc.Grd.Event.preInit=true; 
		tdc.Grd.Event.Pool.trigger("preInit");
	});
	
	$(window).resize(function() {
		 tdc.Grd.Event.Pool.trigger("resized");
	});
	
	$(window).load(function(){
		 tdc.Grd.Event.Pool.trigger("pageReady");
	});

}($j));

/**
 * Initialize the tdc.Grd.Blocks name space
 * @ignore
 */

tdc.Grd.Blocks = {};

(function($){

	/**
	 * Pad all blocks with the block code from the tdc.Grd.Template : blockBox
	 * @param bool Save data in the dom?
	 * @param string optional target to render blocks in
	 * - WARNING - function when run wihtout a target seriously messes up non prepared pages
	 */
	function renderBlocks(saveData,target){
		/**
		*init variables and reuse typeString later
		*/	
		var blockTypes = ['g_block_c2','g_block_c3','g_block_c4','g_block_c5','g_block_c6','g_block_c7','g_block_c8','g_block_c9','g_block_c12'];
	
		//var blockBox= $("#g_page "+target+" div."+blockTypes.join(",#g_page div.")),l,typeIs,i,ref,type,arrtest,assign=tdc.Grd.Templates.getByID('blockBox');
		
		// We use the following line until all block markup have been "wrapped"
		var blockBox= $("#g_page "+target+" .g_block_content."+blockTypes.join(",#g_page .g_block_content.")),l,typeIs,i,ref,type,arrtest,assign=tdc.Grd.Templates.getByID('blockBox');
		var data;
	
		if(blockBox.length){
			var blength=blockBox.length;
	
			for (i=0;i<blength; i++) {
				ref=$(blockBox[i]);
				arrtest=ref.attr('class').split(' ');
				l = arrtest.length;
				for (var j=0;j<l; j++) {
					typeIs = blockTypes.indexOf(arrtest[j]);
					if(typeIs!=-1){
						/**
						*if data is needed AGAIN
						*/
						if(saveData){
							$(this).data('blockType',blockTypes[typeIs]);
						}
		
						var blockType=blockTypes[typeIs];
						
						data = { //data object used in template rendering engine
							type:blockType, //set type
							ref:ref.removeClass(blockType).outerHTML() //cleanup the markup the class on the ref is not needed longer
						};
					}
				}
				ref.fasterReplace($.renderTemplate(assign,data));
				//ref.replaceWith($.renderTemplate(assign,data)); this is alot slower, the new Custom function is 20-30% faster
			}
		} else {
			return;
		}
	}
	
	/**
	 * Initialize all Toggleboxes on the page
	 */
	function initTogglebox() {
		$(".g_block_togglebox").each(function(){
			var toggleBox = this;
			var showHideLink = $(".g_togglebox_head a", toggleBox);
			showHideLink.data("toggleText", "Skjul indhold"); //Save hide text in the dataobject
			
			$(".g_togglebox_head", toggleBox).click(function(event){
				event.preventDefault(); //Prevent the default click event to fire
				$(toggleBox).toggleClass("g_visible"); //Toggle a class to indicate that the content is visible/hidden
				$(".g_togglebox_content", toggleBox).slideToggle();	//Toggle the content
				
				//Change the wording of the link
				var currentHtml = showHideLink.html();	//Save the current value
				showHideLink.html(showHideLink.data("toggleText")).data("toggleText", currentHtml); //Set new html and save the old in the dataobject
			});
		});
	}
	
	// expose public functions
	tdc.Grd.Blocks = {
		renderBlocks : renderBlocks
	};

	// bind functions to preInit event
	tdc.Grd.Event.Pool.bind({
		preInit:function(){
			renderBlocks();
			setTimeout( function(){
				tdc.Grd.Event.Pool.trigger("init"); 
			}, 100);
		},
		init : initTogglebox
	});

}($j));

/**
* create Grd.Modal namespace, modal global parameter object isvisible set to false
* @param isVisible (defaults to false)
*/

tdc.Grd.Modal = {
	isVisible:false
};

/**
EXAMPLE MODAL DIALOGUES

	<div id="g_block_modal_back"></div>
	<a href="#" class="testModal">show the modal</a>
	<a href="#" class="testModal2">show the dialogue</a>

	$("a.testModal").bind('click',function(e){

		var html = tdc.Grd.Templates.getByID('modalDefault'),
			data ={ content:"I was TRIGGERED from the a href in the bottom of the page, and i used the modalDefault template in tdc.Grd.Templates to render",
					header:1,
					footer:1};

			tdc.Grd.Modal.showModal($.renderTemplate(html,data));
		return false;

	})
		$("a.testModal2").bind('click',function(e){

		var html = tdc.Grd.Templates.getByID('modalDefault'),
			data ={ content:"I was TRIGGERED from the a href in the bottom of the page, and i used the modalDefault template in tdc.Grd.Templates to render",
					header:1,
					footer:1};

			tdc.Grd.Modal.showDialogue($.renderTemplate(html,data));
		return false;
	})
*/

(function($){

	/**
	* Default variables set here
	*/
	var defaults = {
		modal : true,
		background : true,
		target : 'div.g_middle .g_block_content',
		animate : true,
		scrollable : false,
		scrollableMargin : 50,
		hideBanners : true,
		closeOnEsc : false,			//Close overlay when clicking esc?
		closeOnBackClick : false	//Close when background is clicked?
	},
	modHolder,modElem,modBack,pageElem,defTarget,cached=false;
	
	/**
	* is triggered with the init trigger and injects holder into dom
	* @private
	*/
	function modalInject(){
		//inject modal holder into page
		if (!document.getElementById("g_block_modals")) {
			$("body").append(tdc.Grd.Templates.getByID('modalInject'));
		}
	}

	/**
	* is triggered with the init trigger and caches dom paths
	* @private
	*/
	function modalCache(){
		//to prevent extra dom lookups we'll cache all (most) paths on init
		modHolder	= $("#g_block_modals");
		modElem		= $("#g_block_modals div.g_block_modal");
		modBack		= $("#g_block_modal_back");
		pageElem	= $("body");
		defTarget	= 'div.g_middle .g_block_content';
		cached		= true;
	
		//use jquery live to bind the close button (and all future buttons of the same type) to trigger modalCloseClicked
		modElem.find("a.g_modal_bn_close").live("click", function(e){
			e.preventDefault();
			tdc.Grd.Event.Pool.trigger("modalCloseClicked");
		});

	}

	function saveTabindex(){
		//save tabindex to data if it exists
		$(":focusable", "#g_page").each(function(){
			var localThis = $(this);
			if (localThis.attr("tabindex") !== 0){
				localThis.data("originalTabindex", localThis.attr("tabindex")); //save current tabindex if it has been set
			}
			localThis.attr("tabindex", -1); //turn off tabindex
		});
	}
	
	function restoreTabindex(){
		//restore tabindex on those elements that have it saved in the data object
		$(":focusable", "#g_page").each(function(){
			var localThis = $(this);
			
			if (localThis.data("originalTabindex") === undefined){
				localThis.attr("tabindex", 0);	//reset to default
			} else {
				localThis.attr("tabindex", localThis.data("originalTabindex")); //use saved value
			}
		});
	}
	
	/**
	* is triggered when modal operations have been completed and modal is visible
	* @private
	*/
	function modalShown(o){
		/*
		if(o.template){
			//show spinner dialogue
			//render o.template into o.target here
		}
		*/
		saveTabindex();
		tdc.Grd.Modal.isVisible=true;
	}
	
	/**
	* is triggered when windows resizes see bind
	* @private
	*/
	function rePosition(override,scrollable) {

		if (tdc.Grd.Modal.isVisible || override) {

			var top,
				margin = 44,
				m_w=$("#g_block_modals .g_middle").width(),
				m_h=$("#g_block_modals .g_middle").height();
			
			modElem.css("margin-left", ("-"+ m_w/2 + "px"));

			if(scrollable){
				top = $("#g_main").position().top + defaults.scrollableMargin;
				modHolder.css("top", top);
				modElem.css("margin-top", 0);
			} else {
				modElem.css("margin-top", ("-"+m_h/2 + "px"));
			}
			
			//HACK to support ie7 rendering of modal (needs width to render correctly)
			var modElem_width = $("#g_block_modals .g_middle .g_block_content").width() + margin;
			
			/*
			This may come in handy:
			if(cache.user.hasIE){
				var c_width=$(".g_modal_content div:first").width();
				if(c_width==modElem_width){modElem_width-=margin}
			}*/
			
			modElem.css("width",modElem_width+"px");
			
			//this is redundant width setting,
			//fixed ie7 bug
			modElem.css("margin-left", ("-"+modElem_width/2 + "px"));
		}
	}
	/* Position the overlay beased on the parent of the button that was clicked to open it */
	function positionNavigator(settings, modalBox){
		
		//Offset the clicked buttons parent is at
		var locationOffset = settings.locationElm.offset();
		
		modHolder.css("top", locationOffset.top + settings.height);
		modHolder.css("left", locationOffset.left);

		//settings.width = the width of the clicked element (the button)
		var thisOffset =  modalBox.outerWidth() - settings.width;
			
		$(".g_block_modal", modHolder).css("margin-left", -thisOffset);
	}
	
	
	/**
	* is triggered when modal operations have been completed and modal is hidden/closed
	* @private
	*/
	function modalHidden(){
		restoreTabindex();
		tdc.Grd.Modal.isVisible=false;
	}

	/**
	* is triggered with the init trigger and caches dom paths
	* @param o settings object (see code, private - non exposed settings)
	* @param html string of html to include
	* @param settings object for exposing settings (if wanted, such as animate etc.)
	*/
	function showDialogue(o, html, settings){
		
		//if the settings object is not passed, make an empty object
		if (settings === undefined){
			settings = {};
		}
		
		if(!cached){
			modalCache();
		}
		//Input sanity checking and applying defaults if none
		if(o === undefined){
			o = defaults;
		} else {
			o.target = o.target || defTarget;
		}
		
		/*TODO : LOTS OF IFFING GOING ON HERE - REFACTOR*/
		if(o.hideBanners === undefined){
			o.hideBanners = defaults.hideBanners;
		}
		if(o.animate === undefined){
			o.animate = defaults.animate;
		}
		
		if(o.scrollable === undefined){
			o.scrollable = defaults.scrollable;
		}
		
		if (o.closeOnBackClick === undefined){
			o.closeOnBackClick = defaults.closeOnBackClick;
		}
		
		if (o.closeOnEsc === undefined){
			o.closeOnEsc = defaults.closeOnEsc;
		}
		
		//REMOVE ALL crazy implemented IFRAMES with SWF objects that have a wrong wmode set
		//This is a hack and if we can we should get the banner providers to implement WMODE = OPAQUE as they should....
		//hidebanners is set to TRUE in defaults, so it it pr.default enabled, to disable specify hideBanners=false in modal function
		if(o.hideBanners){
			$("iframe").css("visibility","hidden");
		}

		//Take HTML argument and place in container, then show the container
		if(o.modal){
			pageElem.css("overflow", "hidden");
		} else {
			pageElem.css("overflow", "auto");
		}
		
		modHolder.show();

		var modalBox = $("#g_block_modals " + o.target);
		modalBox.html(html);

		//special case Scrollable is not really a dialogue but a pageview so add the correct class
		if(o.scrollable){
			modHolder.addClass("g_modal_scrollable");
			rePosition(true,true);
		} else {
			modHolder.removeClass("g_modal_scrollable");
			rePosition(true);
		}
		
		//Business selfcare navigator
		if (settings.selfcareBusinessNavigator !== undefined && settings.selfcareBusinessNavigator === true){

			//Bind event to resize, to reposition the navigator overlay, see unbind at the bottom of the overlay code
			$(window).bind("resize.navigator", function(){
				positionNavigator(settings, modalBox);
			});
			
			positionNavigator(settings, modalBox);
			
			//Bind an event handler to the cloned button, that closes the overlay
			$(".g_selfcareoverlay_top a").one("click", function(event){
				event.preventDefault();
				closeDialogue({target:'.g_middle', modal:false,animate:false, background:true,scrollable:true});	//config object from closeScrollbox
			});
		}
		
		var opacity = 1;
		if(o.animate && !tdc.Grd.Modal.isVisible){
			opacity = 0;
		}
			
		modalBox.css({"opacity":opacity}).show();

		if(opacity === 0){
			modalBox.fadeTo("fast", 1);
		}
		
		//If scrollable and NOT selfcareBusinessNavigator, force scroll in the browser
		if(o.scrollable & (settings.selfcareBusinessNavigator === undefined && settings.selfcareBusinessNavigator !== true)){
			$("body").scrollTo($("#g_main"));
		}
		
		//show and animate the background if it is set, if not make sure its hidden
		if(o.background){
			//Close overlay when the user click the background ?
			if (o.closeOnBackClick || settings.closeOnBackClick){
				modBack.one("click", function(){
					closeDialogue({target:'.g_middle', modal:false,animate:false, background:true,scrollable:true});	//config object from closeScrollbox
				});
			}
			if(o.animate){
				modBack.css({opacity:"0"}).show().fadeTo("fast", 0.80);
			} else {
				modBack.css({opacity:"0.80"}).show();
			}
		} else {
			modBack.hide();
		}
		
		if (o.closeOnEsc || settings.closeOnEsc){
			$(document).keyup(function(event){
				if (event.keyCode == 27){
					closeDialogue({target:'.g_middle', modal:false,animate:false, background:true,scrollable:true});	//config object from closeScrollbox
				}
				
			});
		}
		//if modal is set, remove scrollbars in window and if note apply the default settings again

		//this is for illustration purposes only, modalShown could potentially wait for everything to finish and THEN show content
		/*var data ={
			html:html, //render template data in here from ajax if wanted and activate spinner
			target:o.target
		};*/

		//Modal stuff is done, animation has finished loading and send our dummy data to modalShown
		tdc.Grd.Event.Pool.trigger("modalShown",o);
		tdc.Grd.Tooltip.icon({contentLimiter: "#g_block_modals"});	//Add tooltips to any icons on the page, to make sure any in the overlay gets added correctly
	}
	/**
	 * Closes dialogue(s)
	 * @param {Object} o takes a number of arguments, such as target (Deafults to default object) (see code)
	 * @returns false if tdc.Grd.Modal.isVisible=false
	 * @type Boolean
	 */
	function closeDialogue(o){
		
		if(tdc.Grd.Modal.isVisible){
			if(!o){
				o = defaults;
			} else {
				if(!o.target){
					o.target = modHolder;
				}
			}
				
			if(o.background){
				modBack.fadeTo("slow",0,function(){$(this).hide();});
				$("#g_block_modals " + o.target).fadeTo("fast",0);
			} else {
				if(o.animate){$("#g_block_modals " + o.target).fadeTo("fast",0);}
			}
			
			if(o.hideBanners === undefined){
				o.hideBanners = defaults.hideBanners;
			}
	
			pageElem.css("overflow", "auto");
				
			//Reset the styling otherwise the width of the modal is wrong if another modal is opened on the same page
			modHolder.find(".g_block_modal").attr("style"," "); //needs to be " ", because otherwise IE wont accept the value, go figure
			modHolder.attr("style", " ").hide();				//needs to be " ", because otherwise IE wont accept the value, go figure

			//HACK: reshow ALL crazy implemented IFRAMES with SWF objects that have a wrong wmode set
			//This is a hack and if we can we should get the banner providers to implement WMODE = OPAQUE as they should....
			if(o.hideBanners){
				var modalBox = $("#g_block_modals " + o.target);
				modalBox.html("");
				$("iframe").css("visibility","visible");
			}

			tdc.Grd.Event.Pool.trigger("modalHidden");
		} else {
			return false;
		}
	}
	/**
	* Expose internal function in the tdc.Grd.Modal namespace
	*/
	tdc.Grd.Modal = {
		showModal		: showDialogue.curry({target:'.g_middle', modal:true, background:true,animate:true}),
		showDialogue	: showDialogue.curry({target:'.g_middle', modal:false,animate:true}),
		showScrollbox	: showDialogue.curry({target:'.g_middle', modal:false,animate:false, background:true,scrollable:true}),
		closeModal		: closeDialogue.curry({target:'.g_middle', modal:true, background:true}),
		closeDialogue	: closeDialogue,
		closeScrollbox	: showDialogue.curry({target:'.g_middle', modal:false,animate:false, background:true,scrollable:true}),
		rePosition		: rePosition.curry(1)
	};
	
	/**
	* Bind functions to events
	*/
	tdc.Grd.Event.Pool.bind({
		modalShown			: modalShown,
		modalHidden			: modalHidden,
		modalCloseClicked	: tdc.Grd.Modal.closeModal,
		dialogueCloseClicked: tdc.Grd.Modal.closeDialogue,
		init				: modalInject
	});
	
	//Unbind the resize event when overlays are closed
	tdc.Grd.Event.Pool.bind({
		modalHidden : function(){
			$(window).unbind("resize.navigator");
		}
	});

	/**
	* gets the proper css property and makes sure that it is base 10
	* @private
	* @param {object} element
	* @param {string} css element to find
	* @returns int
	*/
	function css(el, prop) {
		return parseInt($.css(el[0], prop), 10) || 0;
	}
	
	/**
	* gets the proper width property
	* @private
	* @param {object} element
	* @param {string} css element to find
	* @returns int
	*/
	function width(el) {
		return el[0].offsetWidth + css(el, 'marginLeft') + css(el, 'marginRight');
	}
	
	/**
	* gets the proper height property
	* @private
	* @param {object} element
	* @param {string} css element to find
	* @returns int
	*/
	function height(el) {
		return el[0].offsetHeight + css(el, 'marginTop') + css(el, 'marginBottom');
	}
}($j));


tdc.Grd.Menu = {};

(function($){
	/*
		var subTree =
		[
			{name:'BT', href:'http://bt.dk', 'target':'_blank'},
			{name:'Extra Bladet', href:'http://ekstrabladet.dk', title:'Altid noget Extra', 'submenu':
				[
					{name:'Sport', href:'http://ekstrabladet.dk/sport/'},
					{name:'Musik', href:'http://ekstrabladet.dk/musik/', current:true}
				]
			},
			{name: 'Politiken', href:'http://pol.dk'}
		];

		tdc.Grd.Menu.prependSubTree(subTree);
		tdc.Grd.Menu.appendSubTree(subTree);
		tdc.Grd.Menu.replaceSubTree(subTree);
	*/

	// type must be 'prepend', 'append' or 'replace'
	function _insertSubTree(type, subTreeStructure, firstCall) {
		if (!tdc.Grd.Event.init) {
			if (firstCall) {
				// wait until document ready
				tdc.Grd.Event.Pool.bind({
					//init:_insertSubTree.curry(type, subTreeStructure)
					init:function(){_insertSubTree(type, subTreeStructure);}
				});
				return;
			}
		}
		
		function addCurrentAttrToParents(subTreeStructure){
			if (!(subTreeStructure instanceof Array)) {
				return;
			}

			var currentInSubTree = false;
			for (var i=0; i<subTreeStructure.length; i++) {				
				var m = subTreeStructure[i];
				if (m) {
					if (m.submenu && m.length) {
						if (addCurrentAttrToParents(m.submenu)) {
							m.current = true;
						}
					}
					if (m.current) {
						currentInSubTree = true;
					}
				}
			}
			return currentInSubTree;
		}
		
		addCurrentAttrToParents(subTreeStructure);

		function linkElement(m, addSpan){
			addSpan = addSpan || false;
			if (typeof(m) != 'object') {
				return '';
			}
			if (typeof(m.href) != 'string' || typeof(m.name) != 'string') {
				return '';
			}
			var titleAttr = typeof(m.title) == 'string' ? ' title="' + m.title + '"' : '';
			var targetAttr = typeof(m.target) == 'string' ? ' target="' + m.target + '"' : '';
			return '<a href="' + m.href + '"' + titleAttr + targetAttr + '>' + (addSpan?'<span>':'') + m.name + (addSpan?'</span>':'') + '</a>';
		}

		function addBreadCrumb(m, isLast){
			isLast = isLast || false;
			var liClass = isLast ? ' class="g_breadcrumb_current"' : '';

			if (isLast) {
				$("#g_breadcrumb li.g_breadcrumb_current").removeClass('g_breadcrumb_current');
			}

			if (typeof(m) == 'object' && m.name) {
				document.title = document.title + ' - ' + m.name;
			}
			$('#g_breadcrumb ul').append('<li' + liClass + '>' + linkElement(m, true) +	'</li>');
		}

		function insertSubmenu(subTreeStructure, currentMenupointLevel){
			if (!(subTreeStructure instanceof Array)) {
				return;
			}
			
			var html = '';
			var currentClass = '';
			var ulElement='';
			var m;
			var i;
			
			switch (currentMenupointLevel) {
				case 2:
					for (i=0; i<subTreeStructure.length; i++) {
						m = subTreeStructure[i];
						if (m) {
							currentClass = m.current ? ' class="g_current"' : '';
							if (m.current) {
								if (m.submenu && m.length) {
									addBreadCrumb(m);
									insertSubmenu(m.submenu, currentMenupointLevel + 1);
								} else {
									addBreadCrumb(m, true);
								}
							}
							html += '<li'+ currentClass +'>' + linkElement(m) + '</li>';
						}
					}
					
					ulElement = $('.g_submenu_level3');
					
					switch (type) {
						case 'prepend':
							ulElement.prepend(html);
							break;
						case 'append':
							ulElement.append(html);
							break;
						case 'replace':
							ulElement.html(html);
							break;
					}
					break;
				case 3:
					for (i=0; i<subTreeStructure.length; i++) {
						m = subTreeStructure[i];
						if (m) {
							currentClass = m.current ? ' class="g_current"' : '';
							if (m.current) {
								if (m.submenu && m.length) {
									addBreadCrumb(m);
									insertSubmenu(m.submenu, currentMenupointLevel + 1);
								} else {
									addBreadCrumb(m, true);
								}
							}
							
							html += '<li'+ currentClass +'>' + linkElement(m) + '</li>';
						}
					}
					
					$('.g_submenu_level4').show();
					
					ulElement = $('.g_submenu_level4');
					
					switch (type) {
						case 'prepend':
							ulElement.prepend(html);
							break;
						case 'append':
							ulElement.append(html);
							break;
						case 'replace':
							ulElement.html(html);
							break;
					}
					break;
				default:
					for (i=0; i<subTreeStructure.length; i++) {
						m = subTreeStructure[i];
						if (m.current && m.length) {
							if (m.submenu) {
								addBreadCrumb(m);
								insertSubmenu(m.submenu, currentMenupointLevel + 1);
							} else {
								addBreadCrumb(m, true);
							}
						}
					}
					break;
			}
		}
		
		var currentDogtagMenupointLevel;
		switch (1) {
			case $('.g_submenu_level4 .g_current').length:
				currentDogtagMenupointLevel = 4;
				break;
			case $('.g_submenu_level3 .g_current').length:
				currentDogtagMenupointLevel = 3;
				break;
			case $('#g_topmenu .g_current').length:
				currentDogtagMenupointLevel = 2;
				break;
			case $('#g_site_select .g_current').length:
				currentDogtagMenupointLevel = 1;
				break;
		}
		insertSubmenu(subTreeStructure, currentDogtagMenupointLevel);
	}

	/**
	* is triggered with the init trigger and injects holder into dom
	* @private
	*/
	function submenuHolderInject(){
		//inject submenu holder into page
		if (!document.getElementById("g_submenu_overlay")) {
			$("body #g_head_content").append(tdc.Grd.Templates.getByID('subMenuHolder'));
		}
	}
	
	function setupTopnavSubmenu(){
		var topMargin=64; 
		var leftMargin=-3; 
		var menuOver=false; 
		var menuItemOver=false; 
		var cssHolder = "";
		
		/** If run on a page with NGTO design or F5Frozen design, set topMargin and leftMargin differently.
		This should be removed as soon as the old designs are killed permanently.
		Fixes a rendering issue where collapsed menus are positioned at the wrong coordinates.
		*/
		if (typeof(t_d) != "undefined"){
			switch (t_d){
				case "ngto":
				case "grid_ngto":
					topMargin=146;
					leftMargin=-1;
					break;
				case "grid_f5":
					topMargin=149;
					leftMargin=-1;
					break;
			}
		}
		
		$("#g_head_content ul > li.g_submenu_hasoverlay a").hover(function(q){

			menuItemOver=true;

			cssHolder = {
				'top': Math.round($(this).parent().position().top+topMargin),
				'left': Math.round($(this).parent().position().left+leftMargin)
			};

			var contentHolder = $(this).parent().data("subMenu");

			$("#g_submenu_overlay").show().css(cssHolder).find("p.g_block_topnav_submenu_top_m").text($(this).text());

			if(cache.user.hasIE){
				//HACK: TEMPORARY FIX TO CIRUMVENT JQUERY BUG IN IE7>8, ALL DOMMANIPS ARE CACHED AFTER 3rd EXECUTION- REMOVE WHEN BUG IS FIXED.
				//TODO: REMOVE getElemenByID when jquery bug is fixed.
				document.getElementById("g_submenu_ul").innerHTML=contentHolder;
			}else{
				$("#g_submenu_ul").html(contentHolder);
			}
		},function(q){
			menuItemOver=false;
		});
		
		/*
		$("#g_head").delegate("#g_submenu_overlay", "mouseenter", function(q){
			menuOver=true;
		});
		*/
		
		$("#g_head").delegate("#g_submenu_overlay", 'mouseleave', function(q){
			menuOver=false;
			if(!menuItemOver){
				$("#g_submenu_overlay").hide();
			}
		});
	}
		
	function collapseSubmenu(){
		if(cache.level3Structure){
			
			var injectionPoint = '',
				firstItem = '',
				listHtml = '',
				listItems = '',
				listQuery = '',
				listHolder = $("#g_head_content .g_submenu_level3");
				
			listHolder.find(".g_submenu_hasoverlay").remove();
			listHolder.find("li").css("display","block");
			
			for (var k in cache.level3Structure){
				if ( cache.level3Structure.hasOwnProperty( k ) ){
					listHtml = '';
					listQuery = "."+cache.level3Structure[k].join(",.");
					listItems = listHolder.find(listQuery);
				
					listItems.each(function(){
						listHtml += $(this).outerHTML();
					});
				
					firstItem = cache.level3Structure[k][0];
					injectionPoint =	listHolder.find(">li."+firstItem);
					listItems.hide();
					injectionPoint.after(injectionPoint.clone()).next("li").data("subMenu",listHtml).addClass("g_submenu_hasoverlay").show().find("a").text(k);
				}
			}
		}
		setupTopnavSubmenu();
	}

	tdc.Grd.Menu = {
		prependSubTree: function(subTree){ _insertSubTree('prepend', subTree, true);},
		appendSubTree:	function(subTree){ _insertSubTree('append', subTree, true);},
		replaceSubTree: function(subTree){ _insertSubTree('replace', subTree, true);}
	};
	
	tdc.Grd.Event.Pool.bind({
		preInit:submenuHolderInject,
		init:collapseSubmenu,
		cacheMenuWasUpdated:collapseSubmenu
	});
}($j));

tdc.Grd.Cms = {};

/**
 *
 * Holds a cache of content from the cms that the user requested
 *
 * @ignore
 * @private
 */

(function($){
	
	function setCache(o) {
		cache.init = true;
		cache[o.cacheIndex] = o;
	}

	function getCache(id){
		return cache[id];
	}

	function clearCache(){
		cache = {
			init: true,
			cleared: true
		};
	}

	function clearCacheId(id){
		if(cache[id]) {
			cache[id] = null;
		}
	}	

	function getCmsObjectFromServer(service, id, callback, data) {
		var cacheIndex = service+'_'+id;
		if (service == 'getObject' && data) {
			cacheIndex+='_'+$.crc32($.param(data));
		} else {
			data = {};
		}

		if (cache[cacheIndex]) {
			if (callback) {
				callback(getCache(cacheIndex));
			}
		} else {
			var url = 'http://tdc.dk/ajx/'+service+'.php';
			if(document.location.protocol == 'https:') {
				url = 'https://secure.tdc.dk/ajx/'+service+'.php';
			}
			data.id = id;
			$.ajax({
				url: url,
				dataType: 'jsonp',
				data: data,
				jsonpCallback : 'getCmsObjectFromServerCallback_'+cacheIndex,
				success: function(data) {
					data.cacheIndex = cacheIndex;
					tdc.Grd.Event.Pool.trigger("updateCache", data);
					if(callback) {
						callback(data);
					}
				}
			});
		}
		return;
	}



	tdc.Grd.Event.Pool.bind({
		updateCache: setCache
	});

	tdc.Grd.Cms = {
		snippet: getCmsObjectFromServer.curry('snippet'),
		element: getCmsObjectFromServer.curry('element'),
		publish: getCmsObjectFromServer.curry('publish'),
		getObject: getCmsObjectFromServer.curry('getObject'), 
		clearCache: clearCache,
		clearCacheId: clearCacheId
		};
}($j));


/**
 *
 * For different stuff you need to do in js
 *
 * @ignore
 * @private
 */

tdc.Grd.Utilities = {};

/**
 * Function to run on init that inserts overlay onclick
 *
 */

(function($){
	function setOverlayOnclickEvents() {
		$(".g_btn_overlay").each(function() {
			var cssClass ='';
			var elementId = '';
			var publishId = '';
			var snippetId = '';
			
			//Links has a class like g_btn_element_#ELEMENTID#
			if (this.className.indexOf('g_btn_element')!=-1) {

				cssClass = (this.className.substring(this.className.indexOf('g_btn_element'),this.className.length));
				elementId = cssClass.substring(cssClass.indexOf('g_btn_element_')+14,cssClass.length);
				
				$(this).bind('click',function(e){
					tdc.Grd.Cms.element(elementId, function (a){
						var html = tdc.Grd.Templates.getByID('modalDefault'),
						data = {
							content:a.html,
							header:1,
							footer:0,
							blockclass: 'g_block_c6'
						};
						tdc.Grd.Modal.showScrollbox($.renderTemplate(html,data));
					});
					return false;
				});
			//Links has a class like g_btn_snippet_#SNIPPETID#
			} else if (this.className.indexOf('g_btn_snippet') != -1) {
				cssClass = (this.className.substring(this.className.indexOf('g_btn_snippet'),this.className.length));
				snippetId = cssClass.substring(cssClass.indexOf('g_btn_snippet_')+14,cssClass.length);
				$(this).bind('click',function(e){
					tdc.Grd.Cms.snippet(snippetId, function (a) {
						var html = tdc.Grd.Templates.getByID('modalDefault'),
						data = {
							content:a.html,
							header:1,
							footer:0,
							blockclass: 'g_block_c6'
						};
						tdc.Grd.Modal.showScrollbox($.renderTemplate(html,data));
						if (typeof(ot_track) == "function") {
							var sVars = [];
							sVars.pageName = s.pageName + "#"+a.heading;
								s.t(sVars);
						}
					});
					return false;
				});
			} else if(this.className.indexOf('g_btn_publish')!=-1) {
				cssClass = (this.className.substring(this.className.indexOf('g_btn_publish'),this.className.length));
				publishId = cssClass.substring(cssClass.indexOf('g_btn_publish_')+14,cssClass.length);
				$(this).bind('click',function(e){
					tdc.Grd.Cms.publish(publishId, function (a) {
						var html = tdc.Grd.Templates.getByID('modalDefault'),
						data = {
							content:a.html,
							header:1,
							footer:0,
							blockclass: 'g_block_c7'
						};
						tdc.Grd.Modal.showScrollbox($.renderTemplate(html,data));
						if (typeof(ot_track) == "function") {
							var sVars = [];
							sVars.pageName = s.pageName + "#"+a.heading;
							s.t(sVars);
						}
					});
					return false;
				});
			}
		});
	}
	
	// bind functions to init event
	tdc.Grd.Event.Pool.bind({
		init: setOverlayOnclickEvents
	});
}($j));

(function($){

	function getSearchPosition(curLi){
		
		var blockPosition;
		
		//What type of search block (position on page), prepare var to set correct search value of the c google var <input type="hidden" value="h" name="c">
		if (curLi.parents().is(".g_search_mytdc_front")){
			blockPosition = "h";
		} else if (curLi.parents().is(".g_search_mytdc_result")){
			blockPosition = "s";	
		} else if (curLi.parents().is(".g_search_mytdc_top")){
			blockPosition = "t";
		}
		return blockPosition;
	}
	
	/**
	* Clear the value of a field if the current value is the default value, otherwise do nothing
	*/
	function emptyField(event){
		var thisObj = $(this);
		var currVal=thisObj.val();
		if (currVal == thisObj.data("orgVal")){
			thisObj.val("");
			thisObj.parent().removeClass("g_search_default");
		}
	}
	
	function fillField(event){
		var inputVal=$.trim($(this).val());
		if(inputVal === 0){
			var thisObj = $(this);
			thisObj.val($(this).data("orgVal"));
			thisObj.parent().addClass("g_search_default");	//set class that styles the background on the input field (show google logo)
		}
	}
	
	function submitSearch(event) {

		var submittedForm = $(this);
		var myInput = submittedForm.find("input[name='q']"); //default value for Google searches

		switch (submittedForm.attr("name")){
			// De Gule Sider is a search form with two input fields
			case "dgsform":
				
				myInput = submittedForm.find("input[name='query']");
				var locationInput = submittedForm.find("input[name='location']");
				
				//do not submit form if input has not changed
				if (myInput.val() == myInput.data("orgVal") & locationInput.val() == locationInput.data("orgVal")){
					return false;
				}
				
				// If only one of the fields is filled out, clear the other value when submitting the form
				if (myInput.val() == myInput.data("orgVal") & locationInput.val() != locationInput.data("orgVal")){
					myInput.val("");
				}else if (myInput.val() != myInput.data("orgVal") & locationInput.val() == locationInput.data("orgVal")){
					locationInput.val("");
				}
				
				break;
			// Play and Google uses one input field, just with a different name
			case "playform":
				myInput = submittedForm.find("input[name='searchquery']");
				break;
			default:
				//do not submit form if input has not changed
				if (myInput.val() == myInput.data("orgVal") ){
					return false;
				}
				break;
		}
		return true;
	}

	function renderSearchHTML(event) {
		
		event.preventDefault();
		var searchContainer = $(this).closest(".g_block_search"),
			curLi = $(this),
			data = {
				type:"google",
				url:"someurl"
			},
			template;
			
			if (searchContainer.closest(".g_search_mytdc_result").length > 0){
				template=tdc.Grd.Templates.getByID("searchTypeGoogleResult");
			} else {
				template=tdc.Grd.Templates.getByID("searchTypeGoogle");
			}
			
		if(!curLi.hasClass("g_current")){
			//Reset g_current marker, and set on the clicked item
			curLi.siblings().removeClass("g_current").end().addClass("g_current");
			
			if (curLi.is(".g_search_tabs_google_world")){
				//Google search in World
				data.url="http://find.tdc.dk/google.php";
				data.position = getSearchPosition(curLi);
				data.searcharea = "world";
			}else if (curLi.is(".g_search_tabs_google_dk")){
				//Google search in Denmark
				data.url="http://find.tdc.dk/google.php";				
				data.position = getSearchPosition(curLi);
				data.searcharea = "dk";
			}

			searchContainer.find(".g_search_forms").html($.renderTemplate(template,data));
			searchContainer.find(".g_search_container input").bind({
				'focus':emptyField,
				'blur':fillField
			});
			
			//Save the value of the input field to a var, and save that var to the data object of the input field
			searchContainer.find("input[type='text']").each(function(){
				var localThis = $(this);
				var orgVal = localThis.val();
				localThis.data("orgVal", orgVal);
			});
			
			
			/* If there is an url parameter for the search, and if it is the result box, set the value of the inputfield*/
			if ($.getUrlVar("q")){
				searchContainer.each(function(){
					if ($(this).is(".g_search_mytdc_result")){
						var q = unescape($.getUrlVar("q"));
						q = q.replace(/\+/g," ");
						$(this).find("input[name='q']").val(q).parent().removeClass("g_search_default");
					}
				});
			}
			searchContainer.find(".g_search_forms form").bind('submit',submitSearch);
		} else {
			return false;
		}
	}
	
	
	function renderSearchField(){

		var searchContainer = $(".g_block_search"),
			template;

		if(searchContainer){
			
			if (searchContainer.closest(".g_search_mytdc_result").length > 0){
				template = tdc.Grd.Templates.getByID("searchTypeGoogleResult");
			} else {
				template = tdc.Grd.Templates.getByID("searchTypeGoogle");
			}
			
			var initialArea = "dk";
			var initialUrl = "http://find.tdc.dk/google.php";
			
			// If searcharea exists as an url param, set it as default and set url to image if the area is "img"
			// Default searcharea is dk
			if ( $.getUrlVar("searcharea") === 'world' ){
				initialArea = "world";
			} else {
				initialArea = "dk";
			}

			//Set the initial search box
			var data = {
				type		:	"google",
				url			:	initialUrl,
				searcharea	:	initialArea,
				position	:	""
			};

			//Set the position var for each form found and find the value of each initial input field and save it to a var
			var orgVal = searchContainer.find(".g_search_forms").each(function(){
				data.position=getSearchPosition($(this));
				$(this).html($.renderTemplate(template,data));
			}).find("form").bind('submit',submitSearch).find("input[name='q']").val();
			
			//If q exists in the querystring, set it as the value in the input field
			if ($.getUrlVar("q")){
				searchContainer.each(function(){
					if ($(this).is(".g_search_mytdc_result")){
						var q = unescape($.getUrlVar("q"));
						q = q.replace(/\+/g," ");
						$(this).find("input[name='q']").val(q);
					}
				});
			}
			
			//Save the var in the data object on the input field
			searchContainer.find("input[name='q']").data("orgVal",orgVal);
				
			//Change the searchbox when "tabs" are clicked
			searchContainer.find(".g_search_tabs li").bind('click', renderSearchHTML);
			
			//Mark the tab that should be selected - default is the first, but if a search exist in the query string,
			//it is set to the one corresponding to the searcharea
			//If the searchContainer is of the type result, mark the correct google tab, else (if its front or top type, mark the first tab)
			searchContainer.each(function(){
				if ($(this).is(".g_search_mytdc_result")){
					if ( initialArea === 'world' ){
						searchContainer.find(".g_search_tabs .g_search_tabs_google_world").addClass("g_current");
					} else {
						searchContainer.find(".g_search_tabs .g_search_tabs_google_dk").addClass("g_current");
					}
				}else{
					$(this).find(".g_search_tabs > li:first-child").addClass("g_current");
				}
			});

			searchContainer.find(".g_search_container input").bind({
				'focus':emptyField,
				'blur':fillField
			 });
		} else {
			return;
		}
	}

	function bindFocusAndBlurEvents(selector){
		//if the parameter (custom selector) given is not a jquery object (jquery selector), use the body as default
		if (selector.jquery === undefined){
			selector = "body";
		}
		
		var inputField = $(".g_searchfield", selector).find("span input");
		inputField.each(function(){
				
			//Unbind handlers in case they already exist
			$(this).unbind("focus.internalSearch");
			$(this).unbind("blur.internalSearch");
				
			$(this).data("orgVal", $(this).val())		//Save initial value to the data object
			.bind("focus.internalSearch", function(event){		//bind a focus event to clear the value if it is the default search value
				var localThis = $(this);
				if (localThis.val() == localThis.data("orgVal")){
					localThis.val("");
					localThis.css("color", "#192228");
				}
			})
			.bind("blur.internalSearch", function(event){		//re-insert the default search value if the field is empty					
				var localThis = $(this);
				if (localThis.val() === ""){
					localThis.val(localThis.data("orgVal"));
					localThis.css("color", "#90979b");
				}
			});
		});
	}

	tdc.Grd.Event.Pool.bind({
		init: renderSearchField,					//render MitTDC searchfields
		inputRendered : bindFocusAndBlurEvents		//Bind focus and blur events to internalSearch type fields
	});
	
}($j));

tdc.Grd.Search = {};

(function($){
	
	/**
	 * Redirect function - copied from /js/tdc.js
	 * @param {String} aUrl URL to redirect to
	 * @param {String} aCsref csref to attach on url 
	 * @author kimblim
	 */
	function isKeyword (aStr){
		if (aStr.search("^[1-9][0-9]{3,3}$") != -1) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Store the current value in jQuery data, and clear the field
	 */
	function emptyField(event){
		var thisObj = $(this);
		var currVal=thisObj.val();
		
		if (currVal == thisObj.data("defaultValue")){
			thisObj.val("");
		}
	}
	
	/**
	 * Restore the saved value 
	 */
	function fillField(event){
		var inputVal = $.trim($(this).val());
		if(inputVal === 0){
			$(this).val($(this).data("defaultValue"));
		}
	}

	/**
	 * Validate the search form, and test if the search term is a keyword, and if it is, redirect to the correct keyword page
	 * @param {String} aId Value from input field
	 * @param {Object} jQuery event object
	 * @author Sune Radich Christensen
	 */
	function checkForm(aId, event) {

		var preventFormSubmit = true;
		var testVal = $("#g_search_query").data("defaultValue");
		
		if (isKeyword(aId)) {
			// Uses the old tdc.redir that is in deprecated.js, should be updated
			tdc.redir("http://kundeservice.tdc.dk/keyword.php?stdcdk&kid=" + aId);
		} else if (aId !== testVal || (aId !== "" && aId !== testVal)) {
			
			preventFormSubmit = false;
			
			/*
			Set value acording to where on the site the search is coming from,
			to limit the Ankiro results based on a grouping in their system.
			Default value is 14, to search "Hele TDC"
			*/
			try {
				if (document.domain == 'erhverv.tdc.dk') {
					$('#pcid').val("8");
					
				} else if (document.domain == 'om.tdc.dk') {
					$('#pcid').val("9");
				}
				if (document.domain == 'privat.tdc.dk') {
					$('#pcid').val("23");
				}
			} catch (error) {}
		}
		if (preventFormSubmit){
			event.preventDefault();
		}
	}
	
	//Public function
	tdc.Grd.Search = {
		checkForm : checkForm
	};

	//BIND TO EVENTS
	tdc.Grd.Event.Pool.bind({
		init : function(){
			var ref=$("#g_sitesearch #g_search_query");
			ref.data("defaultValue",ref.val());
			
			$("#g_sitesearch").bind({
				'submit': (function(event){
					tdc.Grd.Search.checkForm($.trim($("#g_search_query").val()), event);
				})
			});
			
			// Bind focus and blur events on the sitesearch field via an event-bind in tdc.Grd.Search
			tdc.Grd.Event.Pool.trigger("inputRendered", "#g_sitesearch");	//trigger custom event to set focus and bind events on the input field
		}
	});
}($j));

/**
 TDC Metaform global function
*/
tdc.Grd.Metaform = {};

(function($){
	function showSnippetInOverlay(snippetId){
		tdc.Grd.Cms.snippet(snippetId, function(a) {
			var html = tdc.Grd.Templates.getByID('modalDefault'),
			data = {
				content : a.html,
				header : 1,
				footer : 0,
				blockclass : 'g_block_c6'
			};
				
			tdc.Grd.Modal.showModal($.renderTemplate(html,data));
				
			if (typeof(ot_track) == "function") {
				var sVars = [];
				sVars.pageName = s.pageName + "#"+a.heading;
					s.t(sVars);
			}
		});
	}
	
	function showArticleInOverlay(articleId){
		tdc.Grd.Cms.publish(articleId, function(a) {
			var html = tdc.Grd.Templates.getByID('modalDefault'),
			data = {
				content : a.html,
				header : 1,
				footer : 0,
				blockclass : 'g_block_c7'
			};
				
			tdc.Grd.Modal.showScrollbox($.renderTemplate(html,data));
				
			if (typeof(ot_track) == "function") {
				var sVars = [];
				sVars.pageName = s.pageName + "#"+a.heading;
					s.t(sVars);
			}
		});
	}
	
	function showHtmlInOverlay(inputHtml){
		var html = tdc.Grd.Templates.getByID('modalDefault'),
			data = {
				content : inputHtml,
				header : 1,
				footer : 0,
				blockclass : 'g_block_c6'
			};
		tdc.Grd.Modal.showModal($.renderTemplate(html,data));
	}

	tdc.Grd.Metaform = {
		showSnippetInOverlay : showSnippetInOverlay,
		showArticleInOverlay : showArticleInOverlay,
		showHtmlInOverlay : showHtmlInOverlay
	};
}($j));

/**
 TDC Grid login stuff
*/
tdc.Grd.Login = {};

(function($){

	var loginBoxTopSnippet		= 11288;
	var loginBoxBottomSnippet	= 11289;

	function getLoginBoxHtml(topSnippetId, bottomSnippetId, callback){
		tdc.Grd.Cms.snippet(topSnippetId, function(snippet){
			var topSnippet = snippet.html;

			tdc.Grd.Cms.snippet(bottomSnippetId, function(snippet){
				
				var bottomSnippet = snippet.html;
				var templateArguments = tdc.login.loginBoxTemplateArguments();
				var data = {
					topSnippet : topSnippet,
					formHtml : $.renderTemplate(tdc.Grd.Templates.getByID('loginBoxFormTemplate'), {
						templateArguments: templateArguments,
						hiddenFields: templateArguments.writeHiddenFieldsFunction(true),
						newUserUrlHref: "javascript:tdc.Grd.Login.showNewUserFlowInframeInThisOverlay()",
						forgotPasswordUrlHref: "javascript:tdc.Grd.Login.showForgottenPasswordPageInThisOverlay()"
					}),
					bottomSnippet : bottomSnippet
				};
				callback($.renderTemplate(tdc.Grd.Templates.getByID('loginBoxTemplate'), data));
			});
		});
	}

	function writeLoginLogoutTab() {
		var loggedStatus = tdc.login.isLoggedIn() || (tdc.erhvlogin ? tdc.erhvlogin.isLoggedIn() : false);
		var templateArguments = tdc.login.loginBoxTemplateArguments();
		var loginHTML = $.renderTemplate(tdc.Grd.Templates.getByID('loginOutTopNav'),{
			loggedIn	: loggedStatus,
			logoutURL	: templateArguments.logoutUrl,
			hiddenFields: templateArguments.writeHiddenFieldsFunction(true),
			hiddenSSO	: templateArguments.writeHiddenSsoImagesFunction(true)
		});
		
		var ref = $(loginHTML).insertAfter("#g_site_loginout_toplogin");
		ref = ref.find("a");
		
		if(loggedStatus){

			ref.bind('click', function(){
				$("#g_site_logout_form").submit();
			});
		} else {
			ref.bind('click',function(){
				tdc.Grd.Login.openLoginBox();
			});
		}
		$("#g_site_loginout_toplogin").remove();
		cache.user.loggedIn=loggedStatus;
	}

	function setLoginBoxTopSnippet(snippetId) {
		loginBoxTopSnippet = snippetId;
	}

	function setLoginBoxBottomSnippet(snippetId) {
		loginBoxBottomSnippet = snippetId;
	}

	function openLoginBox() {
		getLoginBoxHtml(loginBoxTopSnippet, loginBoxBottomSnippet, function(html){
			tdc.Grd.Modal.showScrollbox(html);
			tdc.login.redraw();
		});
	}
	
	function drawLoginBox() {
		var templateArguments = tdc.login.loginBoxTemplateArguments();
		var formHtml = $.renderTemplate(tdc.Grd.Templates.getByID('loginBoxFormTemplate'), {
			templateArguments: templateArguments,
			hiddenFields: templateArguments.writeHiddenFieldsFunction(true),
			newUserUrlHref: "javascript:tdc.Grd.Login.showNewUserFlowInframeInThisOverlay()",
			forgotPasswordUrlHref: "javascript:tdc.Grd.Login.showForgottenPasswordPageInOverlay()"
		});
		document.write(formHtml);		
	}

	function openFailedLoginBox() {
		getLoginBoxHtml(11294, 11293, function(html){
			tdc.Grd.Modal.showScrollbox(html);
			tdc.login.redraw();
		});
	}

	function showForgottenPasswordPageInOverlay() {
		getLoginBoxHtml(11291, 11293, function(html){
			tdc.Grd.Modal.showScrollbox(html);
		});
	}

	function showForgottenPasswordPageInThisOverlay() {
		getLoginBoxHtml(11291, 11293, function(html){
			var modalBox = $("#g_block_modals div.g_middle");
			modalBox.html(html);
			tdc.login.redraw();
		});
	}

	function showNewUserFlowInframeInOverlay() {
		var templateArguments = tdc.login.loginBoxTemplateArguments();
		var html = tdc.Grd.Templates.getByID('modalIframe');
		var data = {
			content: '<iframe frameBorder="0" src="'+templateArguments.newUserUrl+'" height="750" width="500"></iframe>',
			header:true
		};
		tdc.Grd.Modal.showScrollbox($.renderTemplate(html, data));
	}

	function showNewUserFlowInframeInThisOverlay() {
		var templateArguments = tdc.login.loginBoxTemplateArguments();
		var html = tdc.Grd.Templates.getByID('modalIframe');
		var data = {
			content: '<iframe frameBorder="0" src="'+templateArguments.newUserUrl+'" height="750" width="500"></iframe>',
			header:true
		};
		var modalBox = $("#g_block_modals div.g_middle");
		modalBox.html($.renderTemplate(html, data));
	}

	tdc.Grd.Login = {
		showNewUserFlowInframeInOverlay			:	showNewUserFlowInframeInOverlay,
		showNewUserFlowInframeInThisOverlay		:	showNewUserFlowInframeInThisOverlay,
		showForgottenPasswordPageInOverlay		:	showForgottenPasswordPageInOverlay,
		showForgottenPasswordPageInThisOverlay	:	showForgottenPasswordPageInThisOverlay,
		openFailedLoginBox						:	openFailedLoginBox,
		openLoginBox							:	openLoginBox,
		drawLoginBox							:	drawLoginBox,
		setLoginBoxBottomSnippet				:	setLoginBoxBottomSnippet,
		setLoginBoxTopSnippet					:	setLoginBoxTopSnippet,
		writeLoginLogoutTab						:	writeLoginLogoutTab,
		logout									:	function() { $("#g_site_logout_form").submit(); }
	};

	tdc.Grd.Event.Pool.bind({
		'init':function(){
			tdc.Grd.Login.writeLoginLogoutTab();
			if ( window.location.search.match(/(&|\?)ssolf(&|$)/)) { // sso login failed
				tdc.Grd.Login.openFailedLoginBox();
				cache.user.loginSucces=false;
			}
		}
	});

}($j));


//TDCOCarousel

(function($){

	/**
	 * gets the proper css property and makes sure that it is base 10
	 * @private
	 * @param {object} element
	 * @param {string} css element to find
	 * @returns int
	 */
	function css(el, prop) {
		return parseInt($.css(el[0], prop), 10) || 0;
	}

	/**
	 * gets the proper width property
	 * @private
	 * @param {object} element
	 * @param {string} css element to find
	 * @returns int
	 */
	function width(el) {
		return el[0].offsetWidth + css(el, 'marginLeft') + css(el, 'marginRight');
	}
	
	/**
	 * gets the proper height property
	 * @private
	 * @param {object} element
	 * @param {string} css element to find
	 * @returns int
	 */
	function height(el) {
		return el[0].offsetHeight + css(el, 'marginTop') + css(el, 'marginBottom');
	}

	/*
	loosely based on jacarousel lite
		$(".carousel").TDCOcarousel({
				 btnNext: ".next",
				 btnPrev: ".prev",
				 visible: 4,
				 start: 2,
			 scroll: 2,
			 pagination:".classThatContainsPAgination",
		 gotoStart:true, //if end is reacehed goto start and begin again

			 beforeStart: function(a) {
						alert("Before animation starts:" + a);
				},
			 afterEnd: function(a) {
						alert("After animation ends:" + a);
			 }
		});

	EX:	 FADES IN AND OUT INSTEAD OF SLIDING
	beforeStart: function(a) {
		 $(a).parent().fadeTo(100, 0);
		 var bg = $(a).find('img').attr('src');
		 $('.anyClass').css({
		 backgroundImage: "url("+bg+")"
		 }, 100);
	},
	afterEnd: function(a) {
		$(a).parent().fadeTo(100, 1);
	},

	 */
	/**
	 * the tdcCaoursel constructor as an extension to jquery, chainable
	 * @param {Object} o takes a number of arguments, such as target (Deafults to defaul object) (see code)
	 * @returns The Element collection as a chainable event
	 */
	$.fn.tdcCarousel = function(o) {
		o = $.extend({
			btnPrev: null,
			btnNext: null,
			mouseWheel: false,
			auto: null,
			speed: 200,
			easing: null,

			vertical: false,
			circular: false,
			visible: false,
			start: 0,
			scroll: 1,
			pagination: false,
			gotoStart: false,
			noPrevNext: false,

			beforeStart: null,
			afterEnd: null
		}, o || {});

		return this.each(function() { // Returns the element collection. Chainable.
			var running = false,
				animCss = o.vertical ? "top" : "left",
				sizeCss = o.vertical ? "height" : "width",
				holder = $(this).parent().parent(),
				div = $(this),
				ul = $("> ul", div),
				tLi = $("> li", ul),
				tl = tLi.size(),
				v = o.visible;

			//simplyfying paths IE crap
			o.pagination = $(o.pagination, holder);
			o.btnPrev = $(o.btnPrev, holder);
			o.btnNext = $(o.btnNext, holder);

			if (o.noPrevNext){
				o.btnNext.hide();
				o.btnPrev.hide();
			} //hide back forward buttons
			if (o.circular === true) {
				ul.prepend(tLi.slice(tl - v ).clone()).append(tLi.slice(0, v).clone());
				o.start += v;
			}

			if (o.visible === 1 && o.scroll === 1) {
				$(holder).addClass("g_carousel_bigblock");
			}

			var li = $("li", ul),
				itemLength = li.size(),
				curr = o.start,
				liSize = o.vertical ? height(li) : li.width(),	// Full li size(incl margin)-Used for animation
				ulSize = liSize * (itemLength+1);				// size of full ul(total length, not just for the visible items)

			if (o.visible == 1 && o.scroll == 1) {
				var divSize = ulSize;
			}

			ul.css(sizeCss, ulSize + "px").css(animCss, -(curr * liSize));

			if (o.pagination && !o.circular) { //if pagination then show and fill(clone) LIs to show
				var pageNums = Math.ceil(tLi.size() / o.scroll) - 1;
				 if(o.visible){
					pageNums = Math.ceil(tLi.size() / o.visible) - 1;
					}
				var pathToDots = holder.find(".g_class_indicator_dots");

				//remember that object collections of elements start at 0 not 1
				$("a", pathToDots).bind("click", function(event) //Bind the goto function to pagination
				{

					var indexOfBn = $("a", pathToDots).index(this);
					//Set current active indicator
					var jumpIndex = indexOfBn * o.scroll;
					if(o.visible){
						jumpIndex = indexOfBn * o.visible;
					}
					return go(o.circular ? o.visible + jumpIndex : jumpIndex);

				});


				while (pageNums--) { //loop through steps, create lists
					$(":first", pathToDots).clone(true).appendTo(pathToDots);
				}
				$(":first a", pathToDots).addClass("active");
			} else {
				$(".g_carousel_indicator", holder).hide();
			}

			if (o.btnPrev){
				$(o.btnPrev).click(function(event) {
					event.preventDefault();
					if (!$(this).hasClass('disabled')) {
						return go(curr - o.scroll);
					} else {
						return false;
					}

				});
			}

			if (o.btnNext){
				$(o.btnNext).click(function(event) {
					event.preventDefault();
					if (!$(this).hasClass('disabled')) {
						return go(curr + o.scroll);
					} else {
						return false;
					}
				});
			}

			if (o.auto){
				setInterval(function() {
					go(curr + o.scroll);
				}, o.auto + o.speed );
			}

			function vis() {
				return li.slice(curr).slice(0, v);
			}

			function go(to) {
				if (!running) {

					if (o.beforeStart) {
						o.beforeStart.call(this, vis());
					}
					if (o.circular) { // If circular we are in first or last, then goto the other end
						if (to <= o.start - v - 1) { // If first, then goto last
							ul.css(animCss, -((itemLength - (v * 2)) * liSize) + "px");
							// If "scroll" > 1, then the "to" might not be equal to the condition; it can be lesser depending on the number of elements.
							curr = to == o.start - v - 1 ? itemLength - (v * 2) - 1 : itemLength - (v * 2) - o.scroll;
						} else if (to >= itemLength - v + 1) { // If last, then goto first
							ul.css(animCss, -((v) * liSize) + "px");
							// If "scroll" > 1, then the "to" might not be equal to the condition; it can be greater depending on the number of elements.
							curr = to === itemLength - v + 1 ? v + 1 : v + o.scroll;
						} else {
							curr = to;
						}

					} else { // If non-circular and to points to first or last, we just return.
						if (to < 0 || to >= itemLength) {
							if (o.gotoStart && (to >= itemLength - v + 1)) {
								curr = o.start;
							} else {
								return false;
							}
						} else {
							curr = to;
						}
					} // If neither overrides it, the curr will still be "to" and we can proceed.
					running = true;

					if (o.pagination) {
						//remove active class from pagination list & add o current index representer
						$("a", o.pagination).removeClass("active");

						var pageNumIndex = (curr / o.scroll);
						if(o.visible){
							pageNumIndex = Math.floor(curr / o.visible);
						}
						$("a:eq(" + pageNumIndex + ")", o.pagination).addClass("active");
					}

					ul.animate(
					animCss == "left" ? {
						left: -(curr * liSize)
					} : {
						top: -(curr * liSize)
					},
					o.speed, o.easing, function() {
						if (o.afterEnd) {
							o.afterEnd.call(this, vis());
						}
						running = false;
					});
					// Disable buttons when the carousel reaches the last/first, and enable when not
					if (!o.circular && !o.gotoStart) {

						if ( (curr + o.scroll >= itemLength) || ( (o.visible>o.scroll) && ((curr+o.visible+o.scroll)>=itemLength)) ) {
							$(o.btnNext).addClass("disabled");
							}else{
							$(o.btnNext).removeClass("disabled");
						}
						if (curr - o.scroll < 0) {
							$(o.btnPrev).addClass("disabled");
						} else {
							$(o.btnPrev).removeClass("disabled");
						}
						
					}

				}
				return false;
			}
		$(".g_carousel_container",holder).css("visibility","visible");
		});
	};

	

}($j));

tdc.Grd.Ads = { };
(function($){

	var g_outPutBuffer = "";

	//PRIVATE FUNCTIONS
	function bindLazyLoad(){
			$('div.g_ads_loadnow:not(.g_ads_has_target)').lazyLoadAd({
				//lazyload takes the following parameters;
				
				//threshold : 0,								// how close to the edge ad should come before it is loaded.
				forceLoad	 : true								// forceload of ad, do not wait until it is visible
				//event			: "scroll",						// Event to listen too
				//viewport	 : window,							// What part of the page to watch
				//onComplete : function() { alert("IRAN")},		//CALLBACK TRIGGER that runs when ad is loaded
				//timeout	 : 2000,							// timeout for ajax calls
				//debug		 : true								// see debug data for functions
			});
			$('div.g_ads_defered:not(.g_ads_has_target)').lazyLoadAd({
				forceLoad	 : false
			});
	}

	//PUBLIC FUNCTIONS
	function googleAdBufferingStart(){
		document._writeBuffering = document.write;
		document.write = function() {
			// Concatenating all arguments
			for (var i = 0; i < arguments.length; i++){
				g_outPutBuffer+=String(arguments[i]);
			}
		};
	}

	function googleAdBufferingEnd(target){
		//setupUnique div for the add
		var dynId="g_googleads_rnd_id_"+Math.floor(Math.random()*100001);
		var googleAdsSetup = $(target).prev().prev().html();
		var googleAdsSrc = $(target).prev().attr("src");
		//g_outPutBuffer = "<scr"+"ipt type='text/javascript'>"+googleAdsSetup+"</sc"+"ript>"+outPutBuffer;
		//g_outPutBuffer now contains all the googleCode this could be used to load things via dom.fragment in the future
		//this is not in use right now, but could be in the future
		document.write=document._writeBuffering;
		document._writeBuffering="";
		g_outPutBuffer ="";
		var outPutDivStr = '<div id='+dynId+' class="g_ads_defered" original="'+googleAdsSrc+'">\n<code>'+googleAdsSetup+'</code>\n</div>\n';
		$(target).after(outPutDivStr);
	}
	
	//EXPOSE PUBLIC FUNCTIONS
	tdc.Grd.Ads = {
		googleAdBufferingStart	 : googleAdBufferingStart,
		googleAdBufferingEnd	 : googleAdBufferingEnd
	};

	//BIND TO EVENTS
	tdc.Grd.Event.Pool.bind({
			init:bindLazyLoad	
	});

}($j));


/*
 * Flash handling
 * Documentation for swfobject version 2.2 can be found here http://code.google.com/p/swfobject/wiki/documentation
 */
tdc.Grd.Flash = {};


(function($){
	
	/**
	 * Inserts a flash movie using swfobject 2.2, if swfobject is not loaded, it will load the script before inserting the flash
	 * @param {Object} o takes a number of arguments, such as target (Deafults to default object), file, contentId, width and height are required
	 * @author Sune Radich Christensen
	 */
	function embedFlash(o) {

		var baseURL = "http://i.c.dk";	//base url for file includes
		
		//Object with default values, can be overwritten
		o = $.extend({
			src: null,
			contentId: null,
			width : "200",
			height: "100",
			flashVersion : "9",
			params : {
				/* Allowed parameters
					play, loop, menu, quality, scale, salign, wmode, bgcolor, base, swliveconnect, flashvars, devicefont, allowscriptaccess, seamlesstabbing, allowfullscreen, allownetworking
				*/
				allowfullscreen : "true",
				allowscriptaccess : "always",
				wmode : "transparent",
				bgcolor: "white"
			},
			expressInstall : baseURL + "/js/grd/plugins/swfobject/expressInstall.swf",
			flashVars : {},
			attributes : {
				/*
				id : "id", //id of the flash container	
				name : "name" //name of the flash container
				styleclass : "nameofclass" //the word class is a reserved word, so styleclass is used instead
				align : "leftRightCenter"
				*/
				styleclass : "g_block_waitspinner"
			}
		},
		o || {});

		if (typeof(swfobject) == "undefined"){	//if swfobject is not loaded, load it
			$.getScript(baseURL + "/js/grd/plugins/swfobject/swfobject.js", function(){
				//Insert the flash as the callback
				swfobject.embedSWF(o.src, o.contentId, o.width, o.height, o.flashVersion, o.expressInstall, o.flashVars, o.params, o.attributes, function(){
					//When flash inserted, remove the waitspinner class
					$("#" + o.contentId).removeClass(o.attributes.styleclass);
				});
				
			});
		} else {	//insert the flash
			swfobject.embedSWF(o.src, o.contentId, o.width, o.height, o.flashVersion, o.expressInstall, o.flashVars, o.params, o.attributes, function(){
				//When flash inserted, remove the waitspinner class
				$("#" + o.contentId).removeClass(o.attributes.styleclass);
			});
		}
	}
	
	// Add embedFlash as a public function
	tdc.Grd.Flash.embed = embedFlash;
})($j);


tdc.Grd.Tvguide = {};

(function($){
	function renderSelect(elementId) {
		
		var mySpan = $("<span>").html( $("option:selected", $(elementId)).html() + "<span></span>" ); //get the text of the currently selected option, and wrap it in a span tag
		
		//clone the selected element, wrap it in a div and replace the original.
		//.parent() is needed because .wrap does not return the wrapped set, just the element before
		var replacedSelect = $(elementId).clone(true).css({opacity:0}).wrap("<div class='g_form_select' />").parent().append(mySpan).replaceAll(elementId);
		
		//When the select is changed
		replacedSelect.change(function(){
			var myText = $("option:selected", $(this)).html() + "<span></span>";
			replacedSelect.find("span").html(myText);
		});
		
		//Detect if enter, uparrow or downarrow is pressed, and replace the span text if they are
		replacedSelect.bind('keyup', function(e) {
			if(e.keyCode==13 || e.keyCode==38 || e.keyCode==40){ //enter, uparrow or downarrow
				var myText = $("option:selected", $(this)).html() + "<span></span>";
				replacedSelect.find("span").html(myText);
			}
		});
		
		//When the select has focus, set a class on the parent to highlight the graphics
		replacedSelect.find("select").focus(function(e){
			$(this).parent().addClass("g_current");
		});
		//When blur, remove the class
		replacedSelect.find("select").blur(function(e){
			$(this).parent().removeClass("g_current");
		});
	}
	
	//Public functions
	tdc.Grd.Tvguide = {
		renderSelect : renderSelect
	};

}($j));

/*
 * Page rating
 * Normally, the page ratign will be initialized  by Tdcsite_Grid_PageRating
 */
tdc.Grd.Rating = {};
(function($){
	
	var showRating = true;
	var publishId = false;
	var rendered = false;
	var ajaxUrl = 'http://tdc.dk/ajx/pagerating.php';
	
	function submitComment(comment, rating, type) {
		if(comment !== undefined && comment !== "") {
			var data = {
				type: type,
				rating: rating, 
				comment: comment,
				pagename: window.s.pageName,
				pagetitle: document.title,
				url: document.location.href
			};
			
			if (publishId) {
				data.publish_id = publishId;
			}

			// send request
			$.ajax({
				url: ajaxUrl, 
				dataType: 'jsonp',
				data: data
			});
		}
	}
	
	
	function renderStarRating(appendTo) {
		if (!appendTo) {
			return;
		}
		
		function init() {
			if (!showRating) {
				return;
			}
			var ratingHtml = tdc.Grd.Templates.getByID('pageRatingStar');
			$(appendTo).append(ratingHtml); //insert the rendered template into the DOM
			
			$('#g_page_rating').show();
			
			$('#g_page_rating_comment_textarea').click(function() {
				$(this).empty().addClass('active');
			});
			$('.star').mouseenter(function(){
				var t = $(this);
				t.prevAll().andSelf().addClass('active');
				t.nextAll().removeClass('active');
			}).mouseleave(function(){
				$(this).siblings().andSelf().removeClass('active');
			}).click(function(event){
				var t = $(this);
				t.siblings().andSelf().removeClass('active');
				t.prevAll().andSelf().addClass('selected');
				$('.star').unbind().addClass('inactive');
				event.preventDefault();
				$('#g_page_rating_comment').show();
					
				var rating = $('input',this).addClass('checked').val();
				var pagetitle = window.s.pageName;
				
				// Submit rating
				var s=s_gi(ot_account);
				s.linkTrackVars='eVar9,eVar32,events,products';
				s.linkTrackEvents='event15,event33';
				s.eVar9=pagetitle;
				s.events="event15";
				s.products=";;;;event15="+rating;
				s.tl(this,'o','Feedback');
			});
			
			$('#g_page_rating_comment_send .g_btn_default').click(function(event) {
				$('#g_page_rating_comment').hide();
				$('#g_page_rating_thankyou').show();
				event.preventDefault();
				var comment = $('#g_page_rating_comment_textarea:empty').val();
				
				var rating = $('.star input.checked').val();
				submitComment(comment, rating, 'star');
			});
		}

		tdc.Grd.Event.Pool.bind({
			init: init
		});
	}

	function renderYesNoRating(appendTo) {
		function init() {
			if (!showRating) {
				return;
			}
			//Render the yes/no template using the data object below
			var ratingHtml = tdc.Grd.Templates.getByID('pageRatingYesNo');
			
			appendTo = appendTo || '#g_foot_content';
			$(appendTo).append(ratingHtml); //insert the rendered template into the DOM
			$('.g_footer_rating .g_btn').each(function(index, element){
				$(element).click(function(event){
					event.preventDefault();
					var rating = this.rel;
					$('#g_footer_rating_btn_send').attr('rel',rating);
					$('.g_footer_rating .g_input').show(200);
					$('.g_footer_rating .g_rate').html('<span>Tak for dit svar</span>')
						.animate({height:'29px',width:'98px'}, 200);

					var pagetitle = window.s.pageName;
					// Submit rating
					var s=s_gi(ot_account);
					s.linkTrackVars='eVar9,eVar32,events,products';
					s.linkTrackEvents='event16,event33';
					s.eVar9=pagetitle;
					s.events="event16";
					s.products=";;;;event16="+rating;
					s.tl(this,'o','Feedback_yn');
					return false;
				});
			});
		 
			$('#g_footer_rating_textarea').focus(function(){
				$(this).empty();
			});
		 
			$('#g_footer_rating_btn_cancel').click(function(event){
				$('.g_footer_rating .g_input').hide(200);
				$('.g_footer_rating .g_rate').animate({height:'27px'}, 200);
				event.preventDefault();
			});
		 
			$('#g_footer_rating_btn_send').click(function(event){
				var comment = $('#g_footer_rating_textarea:empty').val();
				
				var rating = this.rel;
				submitComment(comment, rating, 'yesno');
								
				$('.g_footer_rating .g_input').hide(200);
				$('.g_footer_rating .g_rate').animate({height:'27px'}, 200);
				event.preventDefault();
			});
		}
		tdc.Grd.Event.Pool.bind({
			init: init
		});		
	}
	
	function renderKampyleFeedback(form_id) {
		if (!form_id) {
			return;
		}		
		function init() {
			if (!showRating) {
				return;
			}
			var tdc_i = tdc.getI();
			if ($("#kampyle_css").length < 1) {
				var link = $("<link>");
				link.attr({
					id : "kampyle_css",
					type: 'text/css',
					rel: 'stylesheet',
					media: 'screen',
					href: tdc_i + '/css/grd/local/kampyle_button.css'
				});
				$("head").append(link);
			}
			var site_code = 8845015;
			
			window.k_push_vars = {
				"view_percentage": 0,			// Percent of users who will recieve the push dialog. Set to zero for disabling the push function. 
				"display_after_on_page": 0,		// Display push dialog if the user has been more than X seconds on the page
				"display_after": 0,				// Display push dialog if the user has been more than X seconds on the site
				"popup_font_color": "#000000",
				"popup_background": "#ffffff",
				"popup_separator": "#FFFFFF",
				"header": "Din mening er vigtig for os!",
				"question": "Vil du hj&aelig;lpe os ved at give et kort (1 minut) feedback?",
				"footer": "Tak fordi du hjj&aelig;lper os med at g&oslash;re vores website endnu bedre",
				"remind": "",
				"remind_font_color": "#3882C3",
				"yes": "Ja",
				"no": "Nej",
				"text_direction": "ltr",
				"images_dir": tdc_i + "/gfx/grd/local/kampyle/",
				"yes_background": "#76AC78",
				"no_background": "#8D9B86",
				"site_code": site_code
			};

			var kampyleHtml = $.renderTemplate(tdc.Grd.Templates.getByID('kampyleFeedback'), {tdc_i:tdc_i, form_id:form_id, site_code:site_code});
			
			$('body').append(kampyleHtml);

			$.getScript(tdc_i +'/js/grd/local/kampyle_button.js', function() {
				tdc.Grd.Rating.setKampyleCustomVars();
			});
			
			$.getScript(tdc_i +'/js/grd/local/kampyle_push.js');
		}

		tdc.Grd.Event.Pool.bind({
			init: init
		});		
	}	
	
	function render(what, appendTo) {
		if (!rendered) {
			
			if (typeof(ot_track) == 'function') {
				if (what == 2 || what == 'star') {
					renderStarRating(appendTo);
					rendered = true;
					return;
				}
				if (what == 3 || what == 'yesno') {
					renderYesNoRating(appendTo);
					rendered = true;
					return;
				}
				renderKampyleFeedback(what);
				rendered = true;
			}			
		}
	}

	function show(what, appendTo) {
		showRating = true;
		render(what, appendTo);
	}	
		
	function hide() {
		showRating = false;
	}
	
	function setPublishId(id) {
		if (id) {
			publishId = id;
		}
	}
	
	function setAjaxUrl(url) {
		ajaxUrl = url;
	}
	
	function setKampyleCustomVars() {
		var dogtagArray = window.t_dogtag.split("_");
		window.k_button.setCustomVariable(110,window.t_dogtag); //dogtag
		window.k_button.setCustomVariable(111,dogtagArray[0]); //dog1
		window.k_button.setCustomVariable(112,dogtagArray[1]); //dog2
		window.k_button.setCustomVariable(113,dogtagArray[2]); //dog3
		window.k_button.setCustomVariable(114,dogtagArray[3]); //dog4	
		
		var sso = tdc.cookie.get('SsoSessionData');
		if (sso) {
			window.k_button.setCustomVariable(115,sso.split(';')[1]); //GetAccess ID
		}
	}
	
	tdc.Grd.Rating = {
		show : show,
		hide : hide, 
		render : render, 
		setPublishId : setPublishId,
		setAjaxUrl : setAjaxUrl,
		setKampyleCustomVars : setKampyleCustomVars
	};
}($j));

/* Controller for multiple BitsOnTheRun videos
 * 
 * For this to work, videos must be loaded with the flashvar "playerready" set 
 * to "tdc.Grd.Video.playerReadyBotr". Thil will typically be done with a custom 
 * property on the player settings in the BitsOnTheRun dashboard
 *	
* @author Soeren Jacobi
*/
tdc.Grd.Video = [];
(function($){
	
	var onReadyCallback;
	
	/*
	 * Adds a videoplayer to the array, and sets up standard interface.
	 */
	function playerReadyBotr(obj) {
		var player = document.getElementById(obj.id);
		player.addModelListener('STATE','tdc.Grd.Video.listenerBotrState');
		var len = tdc.Grd.Video.push({
			player: player,
			type: 'botr',
			id: player.id,
			play: function() { this.player.sendEvent('PLAY','true'); },
			pause: function() { this.player.sendEvent('PLAY','false'); },
			stop: function() { this.player.sendEvent('STOP'); }
		});
		if (onReadyCallback) {
			onReadyCallback(len - 1);
		}
	}
	/* The callback will be executed whenever a new video is added to the array. 
	 * The callback will be executed with one integer parameter, indicating the arrayindex of the ready video. 
	 */ 
	function onReady(callback) {
		onReadyCallback = callback;
	}
	
	function onAll(cmd, except_id) {
		for(var i = 0; i < tdc.Grd.Video.length; i++) {
			if (tdc.Grd.Video[i].id != except_id) {
				tdc.Grd.Video[i][cmd]();
			}	
		}		
	}

	/*
	 * Stops all videos. 
	* @param {String} except_id takes a video ID, and excludes the video from the command 
	 */
	function stopAll(except_id) {
		onAll('stop',except_id);
	}
	/*
	 * Pauses all videos. 
	* @param {String} except_id takes a video ID, and excludes the video from the command 
	 */
	function pauseAll(except_id) {
		onAll('pause',except_id);	
	}
	
	/*
	 * State listener for BitsOnTheRun videos 
	 */
	function listenerBotrState(obj) {
		if (obj.newstate == 'PLAYING') {
			tdc.Grd.Video.pauseAll(obj.id);
		}
	}
	
	tdc.Grd.Video.playerReadyBotr = playerReadyBotr;
	tdc.Grd.Video.listenerBotrState = listenerBotrState;
	tdc.Grd.Video.stopAll = stopAll;
	tdc.Grd.Video.pauseAll = pauseAll;
	tdc.Grd.Video.onReady = onReady;
	
}($j));	

/* Wrapper for the LightBox jQuery plugin in jquery.extensions.js */
tdc.Grd.LightBox = {};

(function($){
	
	//Add lightbox to the element, using an optional settings variable along side the default settings
	function addLightBox(elm, settings){
		
		//Default settings
		settings = $.extend({
				fixedNavigation:true,														//Always visible (true) or only on hover (false)
				imageLoading: "http://i.c.dk/gfx/grd/common/spinner.gif",
				imageBtnNext : "http://i.c.dk/gfx/grd/local/smart_selector/btn_next.png",	//cant be positioned, overwrite position in CSS 
				imageBtnPrev : "http://i.c.dk/gfx/grd/local/smart_selector/btn_prev.png",	//cant be positioned, overwrite position in CSS
				imageBtnClose: "http://i.c.dk/gfx/grd/local/smart_selector/btn_close.png",
				imageBlank: "http://i.c.dk/gfx/grd/local/common/transparent.gif",			//Not sure this is used when we have next and prev images specified
				txtImage: "Billede",
				txtOf: "af",
				overlayBgColor: "#90979b",	//to match our own overlay background color
				overlayOpacity: 0.80		//to match our own overlay opacity
		}, settings);
		
		//Add lightBox on click, and move text and close button to the top of the overlay, doing it like this, to avoid altering the downloaded LightBox plugin source
		$(elm).lightBox(settings).click(function(){
			$("#lightbox-container-image-data-box").prependTo("#jquery-lightbox"); //move buttons to the top of the overlay
		});

	}
	
	//Add public function
	tdc.Grd.LightBox = {
		add : addLightBox
	};
	
})($j);

/**
 * Handling of tooltips
 */
tdc.Grd.Tooltip = {};

(function($){
	function addTooltipToHelpIcon(o){
		
		//Object containing default settings
		var defaultSettings = {
			contentLimiter : "body",
			closable : false,
			showTooltip : "mouseenter",		//can be any jquery event
			hideTooltip : "mouseout",		//can be any jquery event
			hideDelay : 300,
			snippetId :	 0,
			defaultContent : "Henter ...",
			generatedContent : "<a class=\"g_close\" href=\"\">Luk</a>"
		};
		
		//Extend the defaultSettings with the optional o object
		defaultSettings = $.extend(defaultSettings, o);
		
		var classList = []; //Array used to store a list of classes on the target elems
		var elems = $(".g_tip", defaultSettings.contentLimiter);	//get all items with tooltips attached in the contentLimiter specified (can be overridden when calling the function)
		
		$(".f_icon a", defaultSettings.contentLimiter).attr("tabIndex", -1);	//Remove all help icons from the tabIndex on the page
		
		
		
		//If we have found elements to add tooltips for, load the stylesheet if it does not exist already
		if (elems.length > 0 && $("#qtip_styling").length === 0){
			var link = $("<link>");
			link.attr({
				id : 'qtip_styling',
				type: 'text/css',
				rel: 'stylesheet',
				href: document.location.protocol + '//i.tdconline.dk/css/grd/jquery/jquery.qtip.css'
			});
			$("head").append(link);
		}
		
		/* Get the ID for all items, and save it to the elements dataobject */
		elems.each(function(index,item){
			
			//Object to store local options
			var localSettings = {};
			
			//Not all browsers (Hello IE!) support the HTML5 property classList, we test for its existance
			if (!('classList' in document.createElement('p'))) {
				//Crappy browser
				classList = $(item).attr('class').split(/\s+/);
			} else {
				//Property exsists, so we use the browsers built in implementation
				classList = item.classList;
			}

			var targetElement = $(item);
			var thisSnippetClass = "";
			
			//Prevent the defautl click action from fireing
			targetElement.click(function(event){
				event.preventDefault();
			});
			
			for (var i=0; i<classList.length; i++){
				/* Find the class that contains the id */
				if (classList[i].indexOf("g_tip_snippet_" ) != -1){
					thisSnippetClass = classList[i];	
				}

				//If the element has the class, add local options to add close link and hode tooltip on click and not the default mouseout
				if (classList[i] == "g_tip_closable"){
					localSettings.closable = true;
					localSettings.hideTooltip = "click";
				}
			}
			
			//isolate the id and save to local options
			localSettings.snippetId = thisSnippetClass.substring(14,thisSnippetClass.length);
			
			//empty object to be used when marging settings
			var empty = {};
			var o = $.extend(empty, defaultSettings, localSettings);	//Extend the empty object with the default settings and the local settings, done like this to preserver the original defaultSettings
			
			$(targetElement).qtip({
				content : {
					text : o.defaultContent
				},
				show: {
					event: o.showTooltip
				},
				hide : {
					event:	o.hideTooltip,
					fixed : true,
					delay: o.hideDelay
				},
				position: {
					//container: $(".g_block_content", $(this) ),
					my: "left top",
					at: "right top",
					target : "event",		//use event http://jsfiddle.net/craga89/XaxcJ/
					viewport : $(window),
					adjust: {
						x: 10,
						y: 4
					}
				},
				style: {
					classes : "ui-tooltip-tdc",
					tip: {
						corner: true,
						offset: 8,			// Adjust it 8px downwards
						mimic: "center"		//Force the display of the tip to be a full arrow
					}
				},
				events : {
					show : function(event, api){
						
						var generatedContent = "";
						
						//If the tooltip is of the type closable, add a Close link
						if (o.closable){
							generatedContent = o.generatedContent;
						}
						
						if (o.snippetId !== 0){
							//get snippet from CMS and set it as the content for this tooltip
							tdc.Grd.Cms.snippet(o.snippetId, function (a){
								generatedContent += a.html;
								api.set("content.text", generatedContent);
							});
						}

						var tooltip = $(this);

						//Bind close functionality to the close link in the tooltip
						$(".g_close", tooltip).live("click", function(event){
							event.preventDefault(); //Suppress the default link behaviour
							tooltip.qtip("hide");	//Hide the tooltip
						});

						//Hide tooltip on click somewhere on the content (the tip itself is a child of the body tag, and not inside the g_page div)
						$("#g_page").one("click", function(event){
							tooltip.qtip("hide");
						});
					}
				}
			});
		});
	}
	
	tdc.Grd.Tooltip = {
		icon : addTooltipToHelpIcon
	};
	
	tdc.Grd.Event.Pool.bind({
		init : addTooltipToHelpIcon
	});
	
}($j));