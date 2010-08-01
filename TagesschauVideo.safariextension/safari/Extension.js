var Extension = (function(){
	
	var config = {};
	
	var usableVideoFormats = {
		'h264-default': {
			type: 'video/mp4'
		},
		
		'h264 Groß': {
			type: 'video/mp4'
		},
		'Ogg Mittel': {
			type: 'video/ogg'
		}
	};
	
	function getSettingByKey(key) {
		return config[key];
	}
	
	function init(gicenConfig) {
		config = gicenConfig;
		
		var videos;
		
		// General articles.
		if (getSettingByKey('enabled_on_articles') === true) {
			videos = $('#centerCol div.fPlayer');
			if (videos.length > 0) {
				videos.each(function(index, video){
					video = $(video);
					if (checkVideo_InGeneralArticles(video)) {
						var sizes = computeSizes_InGeneralArticles(video);
						transformVideo_InGeneralArticles(video, sizes);
					}
				});
			}
		}
		
		// Teaserboxes at the top right
		if (getSettingByKey('enabled_on_teaserboxes') === true) {
			videos = $('#rightCol > div > div.teaserBox');
			if (videos.length > 0) {
				videos.each(function(index, video){
					video = $(video);
					if (checkVideo_Teaserbox(video)) {
						var sizes = computeSizes_Teaserbox(video);
						transformVideo_Teaserbox(video, sizes);
					}
				});
			}
		}
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
	
	function computeSizes_InGeneralArticles(video) {
		var embed = video.find('> div.singleImg > embed');
		return {height: parseInt(embed.attr('height'), 10), width: parseInt(embed.attr('width'), 10)};
	}

	function checkVideo_InGeneralArticles(video) {
		return _assert(video.find('> ul > li').length >= 2, "Should be found at least two elements.") &&
		_assert(video.find('> ul > li.videoSubline').length === 1, "The videoSubline element found.") &&
		_assert(video.find('> ul > li[class!="videoSubline"]').length >= 1, "Alternate video contents found (1).") &&
		_assert(video.find('> ul > li[class!="videoSubline"] > ul.videoDownloadList > li > ul.videoDownload > li').length > 1, "Alternate video contents found (2).");
	}
	
	function transformVideo_InGeneralArticles(video, config) {
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
		
		removeFlashTag_InGeneralArticles(video);
		insertHTML5VideoTag_InGeneralArticles(video, alternateVideos, config);
	}
	
	function removeFlashTag_InGeneralArticles(video) {
		$(video.find('> div.singleImg > embed')).remove();
	}
	
	function insertHTML5VideoTag_InGeneralArticles(video, alternates, config) {
		var html = '<video controls="controls" height="'+config.height+'" width="'+config.width+'">';
		for (var i = 0; i < alternates.length; i++) {
			html += '<source src="'+alternates[i].url+'" type="'+alternates[i].type+'" />';
		}
		html += '</video>';
		$(html).appendTo(video.find('> div.singleImg'));
	}
	
	function computeSizes_Teaserbox(video) {
		var embed = video.find('> div#player2_div > embed');
		return {height: parseInt(embed.attr('height'), 10), width: parseInt(embed.attr('width'), 10)};
	}
	
	function checkVideo_Teaserbox(video) {
		return _assert(video.find('> h3').text() === 'Tagesschau in 100 Sekunden', 'Found teaserbox with "Tagesschau in 100 Sekunden".') &&
		_assert(video.find('> h4').length >= 2, "Found at least two headlines level 4.") &&
		_assert(video.find('> div#player2_div').length === 1, "Found valid teaserbox.");
	}
	
	function transformVideo_Teaserbox(video, config) {
		var alternateVideos = [];
		video.find('> h4 > a').each(function(index, alternate){
			alternate = $(alternate);
			if ($(alternate.find('> span')).text() === 'Download des Videos') {
				alternateVideos.push({
					title : 'Video',
					url: alternate.attr('href'),
					type : usableVideoFormats['h264-default'].type
				});
			}
		});
		removeFlashTag_Teaserbox(video);
		insertHTML5VideoTag_Teaserbox(video, alternateVideos, config);
	}
	
	function removeFlashTag_Teaserbox(video) {
		$(video.find('> div#player2_div > embed')).remove();
	}
	
	function insertHTML5VideoTag_Teaserbox(video, alternates, config) {
		var html = '<video controls="controls" height="'+config.height+'" width="'+config.width+'">';
		for (var i = 0; i < alternates.length; i++) {
			html += '<source src="'+alternates[i].url+'" type="'+alternates[i].type+'" />';
		}
		html += '</video>';
		$(html).appendTo(video.find('> div#player2_div'));
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