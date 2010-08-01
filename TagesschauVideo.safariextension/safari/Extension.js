var Extension = (function(){
	
	var usableVideoFormats = {
		'h264 Groß': {
			type: 'video/mp4'
		},
		'Ogg Mittel': {
			type: 'video/ogg'
		}
	};
	
	function init() {
		// Collect all video frames
		var videos = $('#centerCol div.fPlayer');
		
		if (videos.length > 0) {
			videos.each(function(index, video){
				video = $(video);
				if (checkVideo(video)) {
					var sizes = computeSizes(video);
					transformVideo(video, sizes);
				}
			});
		}
	}
	
	function computeSizes(video) {
		var embed = video.find('> div.singleImg > embed');
		return {height: parseInt(embed.attr('height'), 10), width: parseInt(embed.attr('width'), 10)};
	}
	
	function _assert(assert, message) {
		if (!assert) {
			console.info("Assertion failed: " + message);
			return false;
		} else {
			console.info("Assertion ok: " + message);
		}
		return true;
	}
	
	function checkVideo(video) {
		return _assert(video.find('> ul > li').length === 2, "Should be found exactly two elements.") &&
		_assert(video.find('> ul > li.videoSubline').length === 1, "The videoSubline element found.") &&
		_assert(video.find('> ul > li[class!="videoSubline"]').length === 1, "Alternate video contents found (1).") &&
		_assert(video.find('> ul > li[class!="videoSubline"] > ul.videoDownloadList > li > ul.videoDownload > li').length > 1, "Alternate video contents found (2).");
	}
	
	function transformVideo(video, config) {
		var alternates = video.find('> ul > li[class!="videoSubline"] > ul.videoDownloadList > li > ul.videoDownload > li');
		var alternateVideos = [];
		alternates.each(function(index, alternate){
			alternate = $(alternate);
			var title = alternate.find('> span.title').text();
			var url = alternate.find('> a.downloadLink').attr('href');
			console.info('"'+title+'" found with url to: '+url);
			if (usableVideoFormats[title]) {
				alternateVideos.push({
					title : title,
					url: url,
					type : usableVideoFormats[title].type
				});
			}
		});
		
		console.info('Found ' + alternateVideos.length + ' video types usable as html5 video tag sources.');
		
		removeFlashTag(video);
		insertHTML5VideoTag(video, alternateVideos, config);
	}
	
	function removeFlashTag(video) {
		$(video.find('> div.singleImg > embed')).remove();
	}
	
	function insertHTML5VideoTag(video, alternates, config) {
		var html = '<video controls="controls" height="'+config.height+'" width="'+config.width+'">';
		for (var i = 0; i < alternates.length; i++) {
			html += '<source src="'+alternates[i].url+'" type="'+alternates[i].type+'" />';
		}
		html += '</video>';
		$(html).appendTo(video.find('> div.singleImg'));
	}
	
	return {
		init : init
	};
})();

// Register this extension.
if (typeof(Extensions) === 'undefined') {
	Extensions = {};
}
Extensions.TagesschauVideo = Extension;