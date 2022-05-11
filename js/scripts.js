

var ddaccordion={
	
	contentclassname:{}, //object to store corresponding contentclass name based on headerclass

	expandone:function(headerclass, selected){ //PUBLIC function to expand a particular header
		this.toggleone(headerclass, selected, "expand")
	},

	collapseone:function(headerclass, selected){ //PUBLIC function to collapse a particular header
		this.toggleone(headerclass, selected, "collapse")
	},

	expandall:function(headerclass){ //PUBLIC function to expand all headers based on their shared CSS classname
		var $=jQuery
		var $headers=$('.'+headerclass)
		$('.'+this.contentclassname[headerclass]+':hidden').each(function(){
			$headers.eq(parseInt($(this).attr('contentindex'))).trigger("evt_accordion")
		})
	},

	collapseall:function(headerclass){
		 //PUBLIC function to collapse all headers based on their shared CSS classname
		var $=jQuery
		var $headers=$('.'+headerclass)
		$('.'+this.contentclassname[headerclass]+':visible').each(function(){
			$headers.eq(parseInt($(this).attr('contentindex'))).trigger("evt_accordion")
		})
	},

	toggleone:function(headerclass, selected, optstate){ //PUBLIC function to expand/ collapse a particular header
		var $=jQuery
		var $targetHeader=$('.'+headerclass).eq(selected)
		var $subcontent=$('.'+this.contentclassname[headerclass]).eq(selected)
		if (typeof optstate=="undefined" || optstate=="expand" && $subcontent.is(":hidden") || optstate=="collapse" && $subcontent.is(":visible"))
			$targetHeader.trigger("evt_accordion")
	},

	expandit:function($targetHeader, $targetContent, config, useractivated){
		$targetContent.slideDown(config.animatespeed, function(){config.onopenclose($targetHeader.get(0), parseInt($targetHeader.attr('headerindex')), $targetContent.css('display'), useractivated)})
		this.transformHeader($targetHeader, config, "expand")
	},

	collapseit:function($targetHeader, $targetContent, config, isuseractivated){
		$targetContent.slideUp(config.animatespeed, function(){config.onopenclose($targetHeader.get(0), parseInt($targetHeader.attr('headerindex')), $targetContent.css('display'), isuseractivated)})
		this.transformHeader($targetHeader, config, "collapse")
	},

	transformHeader:function($targetHeader, config, state){
		$targetHeader.addClass((state=="expand")? config.cssclass.expand : config.cssclass.collapse) //alternate btw "expand" and "collapse" CSS classes
		.removeClass((state=="expand")? config.cssclass.collapse : config.cssclass.expand)
		if (config.htmlsetting.location=='src'){ //Change header image (assuming header is an image)?
			$targetHeader=($targetHeader.is("img"))? $targetHeader : $targetHeader.find('img').eq(0) //Set target to either header itself, or first image within header
			$targetHeader.attr('src', (state=="expand")? config.htmlsetting.expand : config.htmlsetting.collapse) //change header image
		}
		else if (config.htmlsetting.location=="prefix") //if change "prefix" HTML, locate dynamically added ".accordprefix" span tag and change it
			$targetHeader.find('.accordprefix').html((state=="expand")? config.htmlsetting.expand : config.htmlsetting.collapse)
		else if (config.htmlsetting.location=="suffix")
			$targetHeader.find('.accordsuffix').html((state=="expand")? config.htmlsetting.expand : config.htmlsetting.collapse)
	},

	urlparamselect:function(headerclass){
		var result=window.location.search.match(new RegExp(headerclass+"=((\\d+)(,(\\d+))*)", "i")) //check for "?headerclass=2,3,4" in URL
		if (result!=null)
			result=RegExp.$1.split(',')
		return result //returns null, [index], or [index1,index2,etc], where index are the desired selected header indices
	},

	getCookie:function(Name){ 
		var re=new RegExp(Name+"=[^;]+", "i") //construct RE to search for target name/value pair
		if (document.cookie.match(re)) //if cookie found
			return document.cookie.match(re)[0].split("=")[1] //return its value
		return null
	},

	setCookie:function(name, value){
		document.cookie = name + "=" + value
	},

	init:function(config){
	document.write('<style type="text/css">\n')
	document.write('.'+config.contentclass+'{display: none}\n') //generate CSS to hide contents
	document.write('<\/style>')
	jQuery(document).ready(function($){
		ddaccordion.urlparamselect(config.headerclass)
		var persistedheaders=ddaccordion.getCookie(config.headerclass)
		ddaccordion.contentclassname[config.headerclass]=config.contentclass //remember contentclass name based on headerclass
		config.cssclass={collapse: config.toggleclass[0], expand: config.toggleclass[1]} //store expand and contract CSS classes as object properties
		config.revealtype=/^(click)|(mouseover)$/i.test(config.revealtype)? config.revealtype.replace(/mouseover/i, "mouseenter") : "click"
		config.htmlsetting={location: config.togglehtml[0], collapse: config.togglehtml[1], expand: config.togglehtml[2]} //store HTML settings as object properties
		config.oninit=(typeof config.oninit=="undefined")? function(){} : config.oninit //attach custom "oninit" event handler
		config.onopenclose=(typeof config.onopenclose=="undefined")? function(){} : config.onopenclose //attach custom "onopenclose" event handler
		var lastexpanded={} //object to hold reference to last expanded header and content (jquery objects)
		var expandedindices=ddaccordion.urlparamselect(config.headerclass) || ((config.persiststate && persistedheaders!=null)? persistedheaders : config.defaultexpanded)
		if (typeof expandedindices=='string') //test for valid cookie ('string'), invalid being null or 1st page load
			expandedindices=expandedindices.replace(/c/ig, '').split(',') //if valid, change to array value
		var $subcontents=$('.'+config["contentclass"])
		if (!(expandedindices instanceof Array)) //check for invalid expandedindices value
			expandedindices=[]
		if (config["collapseprev"] && expandedindices.length>1)
			expandedindices=[expandedindices.pop()] //return last array element as an array (for sake of jQuery.inArray())
		$('.'+config["headerclass"]).each(function(index){ //loop through all headers
			if (/(prefix)|(suffix)/i.test(config.htmlsetting.location) && $(this).html()!=""){ //add a SPAN element to header depending on user setting and if header is a container tag
				$('<span class="accordprefix"></span>').prependTo(this)
				$('<span class="accordsuffix"></span>').appendTo(this)
			}
			$(this).attr('headerindex', index+'h') //store position of this header relative to its peers
			$subcontents.eq(index).attr('contentindex', index+'c') //store position of this content relative to its peers
			var $subcontent=$subcontents.eq(index)
			if (jQuery.inArray(index+'', expandedindices)!=-1){ //check for headers that should be expanded automatically (convert index to string first)
				if (config.animatedefault==false)
					$subcontent.show()
				ddaccordion.expandit($(this), $subcontent, config, false) //Last Boolean value sets 'isuseractivated' parameter
				lastexpanded={$header:$(this), $content:$subcontent}
			}  //end check
			else{
				$subcontent.hide()
				config.onopenclose($(this).get(0), parseInt($(this).attr('headerindex')), $subcontent.css('display'), false) //Last Boolean value sets 'isuseractivated' parameter
				ddaccordion.transformHeader($(this), config, "collapse")
			}
		})
		$('.'+config["headerclass"]).bind("evt_accordion", function(){ //assign custom event handler that expands/ contacts a header
				var $subcontent=$subcontents.eq(parseInt($(this).attr('headerindex'))) //get subcontent that should be expanded/collapsed
				if ($subcontent.css('display')=="none"){
					ddaccordion.expandit($(this), $subcontent, config, true) //Last Boolean value sets 'isuseractivated' parameter
					if (config["collapseprev"] && lastexpanded.$header && $(this).get(0)!=lastexpanded.$header.get(0)){ //collapse previous content?
						ddaccordion.collapseit(lastexpanded.$header, lastexpanded.$content, config, true) //Last Boolean value sets 'isuseractivated' parameter
					}
					lastexpanded={$header:$(this), $content:$subcontent}
				}
				else{
					ddaccordion.collapseit($(this), $subcontent, config, true) //Last Boolean value sets 'isuseractivated' parameter
				}
 		})
		$('.'+config["headerclass"]).bind(config.revealtype, function(){
			if (config.revealtype=="mouseenter"){
				ddaccordion.expandone(config["headerclass"], parseInt($(this).attr("headerindex")))
			}
			else{
				$(this).trigger("evt_accordion")
				return false //cancel default click behavior
			}
		})
		config.oninit($('.'+config["headerclass"]).get(), expandedindices)
		$(window).bind('unload', function(){ //clean up and persist on page unload
			$('.'+config["headerclass"]).unbind()
			var expandedindices=[]
			$('.'+config["contentclass"]+":visible").each(function(index){ //get indices of expanded headers
				expandedindices.push($(this).attr('contentindex'))
			})
			if (config.persiststate==true){ //persist state?
				expandedindices=(expandedindices.length==0)? '-1c' : expandedindices //No contents expanded, indicate that with dummy '-1c' value?
				ddaccordion.setCookie(config.headerclass, expandedindices)
			}
		})
	})
	}
}



var forEach = function(array, callback, scope) {
  for (var i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i]); // passes back stuff we need
  }
};

var randomIntFromInterval = function(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

var $mapPins = document.querySelectorAll('#Map-shape g');

// Setup timelines attached to each map pin
forEach($mapPins, function(index, value) {
  // Group opacity timeline
  value.groupTimeline = new TimelineMax({
    paused: true
  });
  
  value.groupTimeline
  .to(value, 0.25, {
    opacity: 0
  });
  
  // Pulse animation
  var pinTimeline = new TimelineMax({
    repeat: -1,
    delay: randomIntFromInterval(1,3),
    repeatDelay: randomIntFromInterval(0, 1)
  });
    
  pinTimeline.
  to(value.querySelector('.Pin-back'), 3, {
    scale: 50,
    transformOrigin: 'center center',
    opacity: 0
  });
});

forEach(document.querySelectorAll('.js-Location-nav [data-location]'), function(index, value) {
 
   value.addEventListener('mouseenter', function(e) {   
     var location = e.target.getAttribute('data-location');
     
     // Hide other map pins
     forEach($mapPins, function(index, value) {
       if (value.getAttribute('data-location') !== location) {
         value.groupTimeline.play();
       }
     });
   }, false);
  
  value.addEventListener('mouseleave', function(e) {
    // Reverse all hidden map pins
    forEach($mapPins, function(index, value) {
       value.groupTimeline.reverse();
    });
    
  }, false);
});





$(document).ready(function() {
 
});


(function( $, window ){
  
	window.getActiveMQ = function()
	{
	  $('<div id="getActiveMQ-watcher"></div>')
		.appendTo('body')
		.hide();
	
	  var computed = window.getComputedStyle,
		watcher = document.getElementById('getActiveMQ-watcher');
		if ( 'currentStyle' in watcher )
		{
		  window.getActiveMQ = function()
		  {
			return watcher.currentStyle['fontFamily'].replace(/['"]/g,'');
		  };
		}
		else if ( computed )
		{
		  window.getActiveMQ = function()
		  {
			return computed( watcher, null ).getPropertyValue( 'font-family' ).replace(/['"]/g,'');
		  };
		}
		else
		{
		  window.getActiveMQ = function()
		  {
			return 'unknown';
		  };
		}
		return window.getActiveMQ();
	};
  
	/*! resize watcher */
	window.watchResize = function( callback )
	{
	  var resizing;
	  function done()
	  {
		clearTimeout( resizing );
		resizing = null;
		callback();
	  }
	  $(window).resize(function(){
		if ( resizing )
		{
		  clearTimeout( resizing );
		  resizing = null;
		}
		resizing = setTimeout( done, 50 );
	  });
	  // init
	  callback();
	};
	window.watchResize(function(){
	  var size = window.getActiveMQ().replace("break-","");   
	  window.WesternUnion = window.getActiveMQ();
	  
	  
	});
  
	/*! A fix for theWebKit Resize Bug https://bugs.webkit.org/show_bug.cgi?id=53166. */
	$(window).on('load',function(){
	  window.watchResize(function(){
		var $body = $('body');
		$body.css('overflow', 'hidden').height();
		$body.css('overflow', 'auto');
	  });
	});
  
  }( jQuery, window ));
  
  // Resize function to trigger different scripts/classes
  function westernUnionResize ( $, window ) {
	window.watchResize = function( callback )
	{
	  var resizing;
	  function done()
	  {
		clearTimeout( resizing );
		resizing = null;
		callback();
	  }
	  $(window).resize(function(){
		if ( resizing )
		{
		  clearTimeout( resizing );
		  resizing = null;
		}
		resizing = setTimeout( done, 50 );
	  });
	  // init
	  callback();
	};
	window.watchResize(function(){
	  size = window.WesternUnion.replace("break-","");
	  
	  if ( size < 3 ) {
		$('nav').addClass('mobile-menu');
	  }
	  else {
		$('nav').removeClass('mobile-menu');
	  }
	  
	  // This would be a good place to put the Waypoints script
	  if ( size > 3 ) {
		if ($("#places-map").length) {
		$('#places-map').waypoint(function() {
		  $('.map-location-marker').addClass('animated bounceInDown');
		}, {offset:'75%'});
		}
	  }
	});
  } 
  westernUnionResize( jQuery, window );
  
  // Map modal
  (function($,window) {
	var $body = $('body');
	$(document).ready(function(){
	  mapInfoInit();
	});
	
	function mapInfoInit() {
	  $('.map-location-marker')
		.click(function(e){
		  e.preventDefault();
		  $('#map-info, #overlay').remove();
		  buildmapInfo(
			$(this).data('mapLink'),
			$(this).data('mapTitle'),
			$(this).data('mapImage'),
			$(this).data('jobListings')
		  );
		});
	}
  
	function buildmapInfo ( location, title, src, link )
	{
	  $('<div id="map-info">')
		.addClass(location)
		.fadeIn('slow')
		.appendTo('#places-map .map')
		.html(
		  '<h1>' + title + '</h1>' +
		  '<a href="' + link + '"></a>' +
		  '<span class="close-btn"></span>'
		);
	  // Close map info if click anywhere outside of it
	  /* http://stackoverflow.com/questions/1403615/use-jquery-to-hide-a-div-when-the-user-clicks-outside-of-it */
	  var mapInfo = $('#map-info');
		$(document).mouseup(function(e) {
		  if ( !mapInfo.is(e.target) && mapInfo.has(e.target).length === 0)
		  {
			mapInfo
			.fadeOut('slow', function(){
			  $(this).remove();
			 });
		  }
		  
		});
		$('#map-info .close-btn').click(function(e) {
		  $('#map-info').fadeOut('slow', function(){
			  $(this).remove();
			 });
		});
	}
});
