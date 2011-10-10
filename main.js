// Main Bookmarklet JS

// main class for Penknife bookmarklet
var penknife = {

	config : {
		moving : false,
		mouseOrigX : 0,
		mouseOrigY : 0,
		state : {},			// state object - holds the position of the dialog
	},
	
	
	// CSS styles
	css : {
		styleReset : 'color: #777; text-shadow: none; margin:0; padding:0; line-height:1.5; font: 14px/1.5 Arial, sans-serif; list-style: none; text-align: left;letter-spacing: 0px; text-transform: capitalize; ', // main reset
		boxShadow : '-webkit-box-shadow: 0 -1px 0 #fff, 0 0 5px rgba(0,0,0,0.7); -moz-box-shadow: 0 -1px 0 #fff, 0 0 5px rgba(0,0,0,0.7); box-shadow: 0 -1px 0 #fff, 0 0 5px rgba(0,0,0,0.7);',
		borderRadius : '-moz-border-radius:5px;-webkit-border-radius:5px;border-radius: 5px;',
		container : 'padding:5px 10px;background:#eee;',
		header : 'border-bottom: 1px solid #ddd;position: static;background: none; height:33px; width: auto; box-shadow:none; cursor: move;',
		footer : 'font-size: 12px; color: #999; text-align: right; padding: 5px 0 0;',
		a : 'color: #676767; text-decoration: none; text-shadow: 0 1px 0 #fff; cursor: pointer;',
		h2 : 'color: #717171; line-height:1; margin: 5px 0; font-size:24px; text-shadow: 0 1px 0 #fff; float: left;',
		h2Span : 'color: #bbb;font-size: 12px; vertical-align: top; text-transform: uppercase; text-shadow: 0 1px 0 #fff;',
		closeButton : 'float: right; font-size: 16px; margin: 4px 5px; cursor: pointer;',
		article : 'margin: 0; padding: 10px 0; border-bottom: 1px solid #ddd; border-top: 1px solid #fff;',
		spanA : 'color: #555; text-decoration: none; display: block; height: 42px; font-size: 14px; line-height: 1.3; text-shadow: 0 1px 0 #fff; cursor: pointer; -moz-user-select: none; -khtml-user-select: none;',
		spanADiv : 'overflow: hidden; height: 0px; -webkit-transition: height .3s ease-in-out;-moz-transition: height .3s ease-in-out;-o-transition: height .3s ease-in-out;-transition: height .3s ease-in-out;',
		articleSpan : 'display: block; font-size: 12px; color: #777; margin-bottom: 12px;'
	},

	// cache ovject for caching up selectors etc
	cache : {},

	
	// render main bookmarklet HTML
	renderHTML : function() {
			// main HTML string, this would need to be compressed and perhaps split into different modules

			var html = '<div style="'+penknife.css.styleReset+penknife.css.container+penknife.css.boxShadow+penknife.css.borderRadius+'">'+
				'<header style="'+penknife.css.styleReset+penknife.css.header+'"><h2 style="'+penknife.css.styleReset+penknife.css.h2+'">Penknife <span style="'+penknife.css.h2Span+'">beta</span></h2><span style="'+penknife.css.styleReset+penknife.css.closeButton+'">x</span></header>'+
				'<section style="'+penknife.css.styleReset+'">'+
						penknife.passwordGen.html+
					    penknife.measure.html+
					    penknife.dataUri.html+
				'</section>'+
				'<footer style="'+penknife.css.styleReset+penknife.css.footer+'">by <a style="'+penknife.css.a+'" href="http://jamesduncombe.com/penknife">JD</a></footer></div>';
			
			// create new element for the bookmarklet
			var penknifeMain = document.createElement('div');
			penknifeMain.id = 'penknife';
			penknifeMain.style.position = 'fixed';
			penknifeMain.style.width = '250px';
			penknifeMain.style.textShadow = '0 1px 0 #fff';
			penknifeMain.style.zIndex = '10000';
			penknifeMain.style.left = '30px';
			penknifeMain.style.top = '30px'; 
			
			// append Penknife to the body
			document.querySelector('body').appendChild(penknifeMain);
			document.getElementById('penknife').innerHTML = html;
			
			// cache selectors into cache object
			penknife.cache = {
				penknifeBody : document.querySelector('#penknife'),
				tools : document.querySelectorAll('#penknife article > span'),
				header : document.querySelector('#penknife header'),
				closeButton : document.querySelector('#penknife header h2 + span')
			}
	
	},

	// main init method
	init : function() {
		penknife.renderHTML();
		penknife.getState();
		penknife.restoreState();
		penknife.listeners();
	},

	// setter for saving state in localStorage
	setState : function() {
		// test if we actually support localStorage first
		if (penknife.testLocalStorage) {
			localStorage.setItem("penknife",
				JSON.stringify({
					'x' : penknife.cache.penknifeBody.style.left,	// set x coord
					'y' : penknife.cache.penknifeBody.style.top		// set y coord
				})
			);
		}
	},
	
	// getter for getting state in localStorage
	getState : function() {
		// test if we actually support localStorage first
		if (penknife.testLocalStorage) {
			var state = localStorage.getItem("penknife");
			penknife.config.state = JSON.parse(state);		// parse JSON string back into an object
		}
	},
	
	// restoreState - used to punch back out state
	restoreState : function() {
	
		if (penknife.config.state !== null) {
		
			if (penknife.config.state.x !== '') {
				penknife.cache.penknifeBody.style.left = penknife.config.state.x;
			}
			
			if (penknife.config.state.y !== '') {
				penknife.cache.penknifeBody.style.top = penknife.config.state.y;
			}
		
		}
	
	},
	
	// test from - http://diveintohtml5.org/storage.html for testing for local storage
	testLocalStorage : function() {
		try {
    		return 'localStorage' in window && window['localStorage'] !== null;
  		} catch (e) {
    		return false;
  		}
	},
	
	// main listeners method
	listeners : function() {

		// attach listeners to each tool heading
		for (var i = 0, len = penknife.cache.tools.length; i < len; i++ ) {
		    // attach the click listener
		    penknife.cache.tools[i].addEventListener('click', function(e) {
		       // prevent the default link follow
		       e.preventDefault();
		       // toggle the expanded class which shows/hides the tool
		       this.nextElementSibling.style.height = (this.nextElementSibling.style.height === '0px') ? '170px' : '0px';
		    }, false);
		}

		// mousedown listener - start of move (possibly!)
		penknife.cache.header.addEventListener('mousedown', function(e) {
			e.preventDefault();
			penknife.config.moving = true;
			penknife.config.mouseOrigX = e.layerX;
			penknife.config.mouseOrigY = e.layerY;
		}, false);
		
		// once we're on the move, move the whole container
		document.addEventListener('mousemove', function(e) {
			e.preventDefault();
			if (penknife.config.moving) {
				penknife.cache.penknifeBody.style.left = (e.pageX - penknife.config.mouseOrigX)+'px';
				penknife.cache.penknifeBody.style.top = (e.pageY - penknife.config.mouseOrigY)+'px';
			}
		}, false);
		
		// mouse up - stopped moving the dialog
		document.addEventListener('mouseup', function(e) {
			penknife.config.moving = false;		// toggle that we've stopped moving
			penknife.setState();				// save our current position on the screen
		}, false);
		
		
		// listener for close button
		penknife.cache.closeButton.addEventListener('click', function(e) {
			// remove Peknife body
			document.querySelector('body').removeChild(penknife.cache.penknifeBody);
			// finally, remove the script in the head
			document.querySelector('head').removeChild(document.querySelector('script[src*="penknife"]'));
		});
		
	}

};


// Module for data URI's
penknife.dataUri = {

	init : function() {
		penknife.dataUri.createCache();
		penknife.dataUri.file();
		penknife.dataUri.draginit();
	},
	
	// little test function to make sure we can run this code
	test : function() {
		return (!!window.FileReader);
	},
	
	html : '<article class="dataUri" style="'+penknife.css.styleReset+penknife.css.article+'"><span style="'+penknife.css.spanA+'" href="#expand">Date URI<span style="'+penknife.css.articleSpan+'">Convert something small into a Data URI</span></span>'+
			'<div style="'+penknife.css.spanADiv+'">'+
				'<section style="'+penknife.css.styleReset+'">Drag it to here!</section>'+
			'</div>'+
		'</article>',
	
	// cache selectors
	createCache : function() {
		penknife.dataUri.cache = {
			form : document.querySelector('.dataUri section'),
			dropzone: document.querySelector('article section'),
			fileSelected: document.getElementById('file-selected')
		}
	},
	
	file : function() {
		var elem = document.querySelector('input');
		elem.addEventListener('change', function() {
			penknife.dataUri.cache.fileSelected.innerHTML = 'File selected: '+elem.value;
		}, false);
	},

	// main listeners
	draginit : function() {

		//penknife.dataUri.cache.form.style.display = 'none';
		
		// alias
		var dropzone = penknife.dataUri.cache.dropzone;
		
		// Setup listeners
		dropzone.addEventListener('dragenter', function(e) { e.preventDefault(); }, false);
		dropzone.addEventListener('dragover', penknife.dataUri.dragover, false);
		dropzone.addEventListener('dragleave', penknife.dataUri.dragleave, false);
		dropzone.addEventListener('drop', penknife.dataUri.drop, false);
	},

	// when we leave the drop zone
	dragleave : function(e) {
		this.className = '';
	},

	// when we enter the drop zone
	dragover : function(e) {
		e.preventDefault();
		this.className = 'over';
		this.innerHTML = 'Let me have it baby!';
	},

	// when we drop
	drop : function(e) {

		e.preventDefault();
	
		var file = e.dataTransfer.files[0];
	
		if (file.type.match(/image/)) {

			var reader = new FileReader();

			reader.onload = function(f) {
				var html = '<div id="output">'+
				'<p>Image type: <span>'+file.type+'</span>'+
				'<p>Image size: <span>'+(file.size/1024).toFixed(2)+' KB</span>'+
				'<p>Encoded this:</p>'+
				'<img src="'+f.target.result+'" />'+
				'<p>&hellip;into this:</p>'+
				f.target.result;
				document.querySelector('article section').className = 'dropped';
				document.querySelector('article section').innerHTML = html;
			}
			reader.readAsDataURL(file);
		} else {
			alert('Sorry dude, only pictures in here...');
		}
	}

}

// password generator
penknife.passwordGen = {

	// methods to start the module
	
	init : {
	
	},
	
	config : {
	
	},
	
	cache : {
	
	},
	
	html :
		'<article style="'+penknife.css.article+'">'+
			'<span style="'+penknife.css.spanA+'" href="#expand">Password Generator<span style="'+penknife.css.articleSpan+'">Random password generator</span></span>'+
		        '<div style="'+penknife.css.spanADiv+'">'+
		            '<form>'+
		                '<label>Password</label>'+
		                '<input type="text" />'+
		                '<button>Generate Password</button>'+
		            '</form>'+
		        '</div>'+
		    '</article>',
	
	listeners : {
	
	
	},
	
	// start of main methods
	
	generate : function() {
	
		var pw = '';
		for (var i = 0; i < 15; i++) {
		    
		    // thanks to Mozilla for this - https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Math/random
		    random = Math.floor(Math.random() * (122, 33) + 33);
		    
		    // filter out characters we don't want
		    
		    if (random == 34) {
				random = Math.floor(Math.random() * (122, 33) + 33);
		    }
		    
		    console.log(random);
		    
		    pw += String.fromCharCode(random);
		}
	
	}

}

// measure
penknife.measure = {

	// methods to start the module
	
	init : {
	
	},
	
	config : {
	
	},
	
	cache : {
	
	},
	
	html : '<article style="'+penknife.css.styleReset+penknife.css.article+'">'+
					        '<span style="'+penknife.css.spanA+'" href="#expand">Measure it<span style="'+penknife.css.articleSpan+'">Measure something on the page</span></span>'+
					         '<div style="'+penknife.css.spanADiv+'"></div>'+
					    '</article>',
	
	listeners : {
	
	
	}
	
	// start of main methods

}


penknife.init();
penknife.dataUri.init();