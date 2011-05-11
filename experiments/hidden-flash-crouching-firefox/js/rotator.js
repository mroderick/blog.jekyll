/*jslint evil: false, strict: false, undef: true, white: false, onevar:false, plusplus:false */
/*global jQuery, Mustache, FailFast, window, navigator */

var tdc = tdc || {};
tdc.ui = tdc.ui || {};

tdc.ui.Rotator = (function($){
	
	"use strict";

	var DEFAULT_ROTATE_TIME = 6000;
	var FLASH_WIDTH_12_COLUMNS = 972;
	var FLASH_WIDTH_8_COLUMNS = 646;
	var FLASH_HEIGHT = 372;
	
	// determine if we're allowed to use flash or if it should be avoided
	// see https://bugzilla.opasia.dk/show_bug.cgi?id=14267
	var bugfix_shouldUseFallbackInsteadOfFlash = (function(){
		var re = /^.*Firefox\/4\.0(\.1)?$/;
		var isFlashBuggyFirefox4Zero = re.test( navigator.userAgent.toString() );
		var isOnWindows = navigator.userAgent.toLowerCase().indexOf("windows") !== -1;
		return isFlashBuggyFirefox4Zero && isOnWindows;
	}());
	
	/** 
	 *	Determines if a value is an Object, works across frames
	 *	@param		{ Any }		value A value to examine
	 *	@returns	{ Boolean }
	 *	@private
	 */
	var isObject = function(value){
		return Object.prototype.toString.call(value) === '[object Object]';
	};
	
	/**
	 *	Starts all the flash elements on the page with the data provided
	 *	
	 *	Contains bugfix for weird behaviour in FF4.0/Win
	 *	@see https://bugzilla.opasia.dk/show_bug.cgi?id=14267
	 *	
	 *	@param { Number }	numberOfColumns
	 *	@param { Array }	flashData
	 *	@private
	 *
	 */
	var startFlash = function( numberOfColumns, flashData ){
		// if ( bugfix_shouldUseFallbackInsteadOfFlash ){
		//	return false;
		// }

		// select the correct dimensions for the flash object
		var width = numberOfColumns === 12 ? FLASH_WIDTH_12_COLUMNS : FLASH_WIDTH_8_COLUMNS,
			height = FLASH_HEIGHT,
			data;
	
		// start all the flash elements, if there are any
		for ( var i = 0, j = flashData.length; i < j; i++ ){
		
			data = flashData[i];
			
			// if data is an object, then we're expected to insert flash
			if ( isObject( data ) ){
				// set the correct dimensions
				data.width = width;
				data.height = height;
		
				tdc.Grd.Event.Pool.bind({
					init: tdc.Grd.Flash.embed( data )
				});
			}
		}
	};
		
	/**
	 *	Rotator can display content in tabs, and can embed Flash files, if parameters for the Flash files are provided to 
	 *	the constructor.
	 *	Currently jQuery UI is used for displaying content in tabs.
	 *	
		<code>
			<!-- HTML for non-JavaScript and non-Flash browsers -->
			<div id="e13571" class="g_block_content g_rotator g_rotator_c8 g_rotator_t2">
				<!-- start first tab content -->	
				<div id="e13571rotator-1" class="g_rotator_item">
					<div id="e13571tab1">
						<a onclick="tdc.redir(this.href, '__p_forside_forside_fane1_Imedia_incredi');return false;" href="http://shop.tdc.dk%2FDesire%2520S%2F341411%2Cdefault%2Cpd.html">
							<img src="http://i0.c.dk/pics/0/4/1/69140/org.jpg" alt="HTC Incredible S">
						</a>
						<div class="g_block_txt g_accessibility">
							<h3><a href="http://shop.tdc.dk%2FDesire%2520S%2F341411%2Cdefault%2Cpd.html">HTC Incredible S</a></h3>
						</div>
					</div>									
				</div>
				<!-- end first tab content -->	

				<!-- start second tab content -->
				<div id="e13571rotator-2" class="g_rotator_item">
					<div id="e13571tab2">
						<a onclick="tdc.redir(this.href, '__p_forside_forside_fane2_imedia_arc');return false;" href="http://shop.tdc.dk/Xperia™%20Arc%20S&amp;oslash;lv/341229,default,pd.html">
							<img src="http://i4.c.dk/pics/4/3/1/69134/org.jpg" alt="Arc - Med indbygget TDC PlayWall">
						</a>
						<div class="g_block_txt g_accessibility">
							<h3><a href="http://shop.tdc.dk/Xperia™%20Arc%20S&oslash;lv/341229,default,pd.html">Arc - Med indbygget TDC PlayWall</a></h3>
						</div>
					</div>
				</div>
			</div>
			
			<script type="text/javascript">
				// initialize the rotator
				$(document).ready(function(){
					var flashData = [
						// Flash data for first item
						{
							src: "http://aida.tdc.dk/5/7/1/4175/org.swf?link_1=shop.tdc.dk%2FIncredible%2520S%2520Sort%2F341049%2Cdefault%2Cpd.html%26csref%3D__p_forside_forside_fane1_Imedia_incredibles&amp;callmeId=13359",
							flashVars : {
								"sc_movie_id" : "movie_13571tab1"
							},
							contentId : "e13571tab1"
						}, 
						
						// You can pass non-Objects for slides that have no Flash
						null
					];
					
					var id = 'e13571';
					var numberOfColumns = 8;
					var rotator = new tdc.ui.Rotator( id, numberOfColumns, flashData, {
						rotateTime : 6000 
					});
				});
			</script>
			
	 *	</code>
	 *
	 *
	 *	@param { String }	id					The id of the containing element
	 *	@param { Number }	numberOfColumns		The number of columns (from Grid design) to render the output with,
												currently only 8 and 12 columns are supported
	 *	@param { Array }	flashData			An array of Objects to initialize Flash for each slide
	 *	@param { Object }	options				Optional parameters:
	 *											- { Number }	rotateTime	Number of milliseconds to wait between each slide
	 *
	 *	@throws { Error }	If the parameters are invalid
	 *	@constructor
	 */
	return function konstructor( id, numberOfColumns, flashData, options ){
		// throw error if the constructor is being called without using "new" keyword
		if (!(this instanceof konstructor)){
			throw('tdc.ui.Rotator constructor must be called with "new" keyword, or there will be polution of global scope');
		}
		
		FailFast.assertString( 'expected id to be a String', id );
		FailFast.assert( 'expected numberOfColumns to be one of the following values: 8, 12', numberOfColumns === 8 || numberOfColumns === 12 );
		FailFast.assertArray( 'expected flashData to be an Array', flashData );

		// start loading the flash files, most of this is async, so needs to be started sooner, rather than later
		startFlash( numberOfColumns, flashData );

		var rotateTime = options && parseInt( options.rotateTime, 10 ) || DEFAULT_ROTATE_TIME,
			tabsSelector = '#' + id + '.g_rotator';
		
		// initialize jQuery UI tabs, and tell them to autorotate with the rotateTime
		$(tabsSelector).tabs().tabs("rotate", rotateTime);
	};
	
}(jQuery));