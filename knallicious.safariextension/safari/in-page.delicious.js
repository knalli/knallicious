// Demo code for experimental new popup code.
function openNewBookmarkWindow(newUrl) {
	var win = window.open(newUrl + '&jump=close', "New tag", "width=600,height=400,status=no,scrollbars=yes,toolbar=no,resizable=no");
	if (win && win.focus) {
		win.focus();
	}
}

// Demo code for experimental iframe/inline tagging. Does not work due external resources (yimg.com).
function openNewBookmarkWindowInline() {
	var url = 'http://delicious.com/save?v=5&&url=' + location.href + '&title='+$('title').text();
	
	$overlay = $('<div class="x-delicious-safari-plugin-overlay">').css({
		backgroundColor: '#333333',
		opacity: 0.7,
		position: 'fixed',
		top: 0,
		left: 0,
		height: '100%',
		width: '100%',
		zIndex: 10000
	});
	var $container = $('<div class="x-delicious-safari-plugin-container" style="display: none;">').css({
		backgroundColor: '#ffffff',
		boxShadow: 'inset 8px 8px 8px #666',
		padding: '10px',
		position: 'fixed',
		top: '10%',
		left: '10%',
		height: '80%',
		width: '80%',
		borderRadius: '5px',
		zIndex: 10010
	});
	var $controls = $('<div class="x-delicious-safari-plugin-commands">').css({
		position: 'fixed',
		top: '10%',
		left: '10%'
		
	});
	$('<button class="x-delicious-safari-plugin-command-cancel">Cancel</button>').appendTo($controls);
	
	var $frame = $('<iframe class="x-delicious-safari-plugin-frame" src="'+url+'"">').css({
		border: '0 none',
		height: '100%',
		width: '100%',
		margin: 0,
		padding: 0
	});
	
	$overlay.appendTo('body');
	$controls.appendTo($container);
	$frame.appendTo($container);
	$container.appendTo('body');
	
	$('body .x-delicious-safari-plugin-container .x-delicious-safari-plugin-command-cancel').click(function(){
		$('body .x-delicious-safari-plugin-container').slideUp(function(){
			$('body .x-delicious-safari-plugin-container, body .x-delicious-safari-plugin-overlay').remove();
		});
	});
	
	$('body .x-delicious-safari-plugin-container').slideDown();
}

// Create event listeners

safari.self.addEventListener("message", function(event){
	if (event.name === 'openNewBookmarkWindow') {
		openNewBookmarkWindow(event.message);
	}
}, false);