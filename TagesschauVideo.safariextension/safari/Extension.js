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
	
	var replacements = [
		{
			title: 'Default videos in common news articles (two columns layout, "wetter").',
			key: 'enabled_on_articles',
			config: {
				query: '#centerCol2 div.contModule',
				check: function(video) {
					return _assert(video.find('> div.wetterPadding > table.conttext').length == 1, "Should found a table with alternates.") &&
						_assert(video.find('> div.wetterPadding > table.conttext > tbody > tr').length >= 2, "Should found at leat 2 alternates.") &&
						_assert(video.find('> div.wetterPadding > table.conttext > tbody > tr > td > div.videodownload > a').length >= 1, "Alternate video contents found (1).");
				},
				getSizes: function(video) {
					var embed = video.find('> div.wetterPadding > span#player2_div > embed');
					console.info(video);
					return {
						height: parseInt(embed.attr('height'), 10), 
						width: parseInt(embed.attr('width'), 10)
					};
				},
				getAlternates: function(video) {
					var alternates = video.find('> div.wetterPadding > table.conttext > tbody > tr > td > div.videodownload > a');
					var alternateVideos = [];
					alternates.each(function(index, alternate){
						alternate = $(alternate);
						var title = alternate.find('> span').text();
						var url = alternate.attr('href');
						console.info('"'+title+'" found with url to: '+url);
						if (title === 'Groß' && url.substring(url.length-4) === '.mp4') {
							alternateVideos.push({
								title : title,
								url: url,
								type : usableVideoFormats['h264 Groß'].type
							});
						} else if (title === 'Mittel' && url.substring(url.length-9) === '.webm.ogv') {
							alternateVideos.push({
								title : title,
								url: url,
								type : usableVideoFormats['Ogg Mittel'].type
							});
						}
					});
					return alternateVideos;
				},
				removeFlashTag: function(video) {
					$(video.find('> div.wetterPadding > span#player2_div > embed')).remove();
				},
				createVideoTag: createVideoTag,
				insertVideoTag: function(video, html) {
					$(html).appendTo(video.find('> div.wetterPadding').eq(0));
				}
			},
		},
		{
			title: 'Default videos in common news articles (two columns layout, e.g. "Aktuell, 24").',
			key: 'enabled_on_articles',
			config: {
				query: '#contentWrapper div.contModule',
				check: function(video) {
					return _assert(video.find('> p#player2_div').length == 1, "Should found the flash container.") && 
						_assert(video.find('> table.conttext').length == 1, "Should found a table with alternates.") &&
						_assert(video.find('> table.conttext > tbody > tr').length >= 2, "Should found at leat 2 alternates.") &&
						_assert(video.find('> table.conttext > tbody > tr > td > div.videodownload > a').length >= 1, "Alternate video contents found (1).");
				},
				getSizes: function(video) {
					var embed = video.find('> p#player2_div > embed');
					console.info(video);
					return {
						height: parseInt(embed.attr('height'), 10), 
						width: parseInt(embed.attr('width'), 10)
					};
				},
				getAlternates: function(video) {
					var alternates = video.find('> table.conttext > tbody > tr > td > div.videodownload > a');
					var alternateVideos = [];
					alternates.each(function(index, alternate){
						alternate = $(alternate);
						var title = alternate.find('> span').text();
						var url = alternate.attr('href');
						console.info('"'+title+'" found with url to: '+url);
						if (title === 'Groß' && url.substring(url.length-4) === '.mp4') {
							alternateVideos.push({
								title : title,
								url: url,
								type : usableVideoFormats['h264 Groß'].type
							});
						} else if (title === 'Mittel' && url.substring(url.length-9) === '.webm.ogv') {
							alternateVideos.push({
								title : title,
								url: url,
								type : usableVideoFormats['Ogg Mittel'].type
							});
						}
					});
					return alternateVideos;
				},
				removeFlashTag: function(video) {
					$(video.find('> p#player2_div > embed')).remove();
				},
				createVideoTag: createVideoTag,
				insertVideoTag: function(video, html) {
					$(html).appendTo(video.find('> p#player2_div'));
				}
			},
		},
		{
			title: 'Default videos in common news articles (three columns layout).',
			key: 'enabled_on_articles',
			config: {
				query: '#centerCol div.fPlayer',
				check: function(video) {
					return _assert(video.find('> ul > li').length >= 2, "Should be found at least two elements.") &&
						_assert(video.find('> ul > li.videoSubline').length === 1, "The videoSubline element found.") &&
						_assert(video.find('> ul > li[class!="videoSubline"]').length >= 1, "Alternate video contents found (1).") &&
						_assert(video.find('> ul > li[class!="videoSubline"] > ul.videoDownloadList > li > ul.videoDownload > li').length > 1, "Alternate video contents found (2).");
				},
				getSizes: function(video) {
					var embed = video.find('> div.singleImg > embed');
					return {
						height: parseInt(embed.attr('height'), 10), 
						width: parseInt(embed.attr('width'), 10)
					};
				},
				getAlternates: function(video) {
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
					return alternateVideos;
				},
				removeFlashTag: function(video) {
					$(video.find('> div.singleImg > embed')).remove();
				},
				createVideoTag: createVideoTag,
				insertVideoTag: function(video, html) {
					$(html).appendTo(video.find('> div.singleImg'));
				}
			},
		},
		{
			title: 'Special videos in teaser boxes inside the sidebar, e.g. the "100 Sekunden". at the top right corner.',
			key: 'enabled_on_teaserboxes',
			config: {
				query: '#rightCol > div > div.teaserBox',
				check: function(video) {
					return _assert(video.find('> h3').text() === 'Tagesschau in 100 Sekunden', 'Found teaserbox with "Tagesschau in 100 Sekunden".') &&
						_assert(video.find('> h4').length >= 2, "Found at least two headlines level 4.") &&
						_assert(video.find('> div#player2_div').length === 1, "Found valid teaserbox.");
				},
				getSizes: function(video) {
					var embed = video.find('> div#player2_div > embed');
					return {
						height: parseInt(embed.attr('height'), 10), 
						width: parseInt(embed.attr('width'), 10)
					};
				},
				getAlternates: function(video) {
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
					return alternateVideos;
				},
				removeFlashTag: function(video) {
					$(video.find('> div#player2_div > embed')).remove();
				},
				createVideoTag: createVideoTag,
				insertVideoTag: function(video, html) {
					$(html).appendTo(video.find('> div#player2_div'));
				}
			}
		}
	];
	
	function getSettingByKey(key) {
		return config[key];
	}

	/**
	 * Performs all possible situations of flash-to-html5-replacements. 
	 */	
	function process() {
		var replacement;
		for (var i = 0; i < replacements.length; i++) {
			replacement = replacements[i];
			if (getSettingByKey(replacement.key) === true) {
				console.info('Active: ' + replacement.title);
				replaceVideo(replacement.config);
			} else {
				console.info('Not active: ' + replacement.title);
			}
		}
	}
	
	/**
	  * This method tries to find matching video tags (e.g. flash content), computes 
	  * required config params and replaces it with new a new video tag (e.g. html5 video).
	  * 
	  * @param Object options
	  *                       * String query: query used for finding matching source 
	  *                         containers, see jQuery(...).
	  *                       * Function check(video): callback used for performing 
	  *                         additional checks if the video container is a valid source
	  *                         for replacement (will performed for each result of query),
	  *                         returns true or false.
	  *                       * Function getAlternates(video): callback used for collecting 
	  *                         and returning all possible alternates for this video containe 
	  *                         (will performed for each result of query), returns an array 
	  *                         with objects(title, url, type).
	  *                       * Function getSizes(video): callback used for returning the 
	  *                         sizes for the video container (will performed for each result 
	  *                         of query), returns an object (height, width).
	  *                       * Function removeFlashTag(video): callback used for removing the 
	  *                         old video container content (will performed for each result of query), returns nothing.
	  *                       * Function createVideoTag(alternateVideos, config): callback 
	  *                         used for building a html string as video replacement (will 
	  *                         performed for each result of query), returns a string. The 
	  *                         parameter alternateVideos is exactly the result of 
	  *                         getAlternates, the parameter config is an object of height, 
	  *                         width and preload.
	  *                       * Function insertVideoTag(video, html): callback used for 
	  *                         appending the specified html string into the video container 
	  *                         (will performed for each result), returns nothing.
	  */
	function replaceVideo(options) {
		var videos = $(options.query), alternateVideos, sizes;
		if (videos.length > 0) {
			videos.each(function(index, video){
				video = $(video), alternateVideos = [];
				if (options.check(video)) {
					alternateVideos = options.getAlternates(video);
					sizes = options.getSizes(video);
					options.removeFlashTag(video);
					var html = options.createVideoTag(alternateVideos, {
						height: sizes.height, 
						width: sizes.width,
						preload: getSettingByKey('preload')
					});
					console.info(html);
					options.insertVideoTag(video, html);
				}
			})
		}
	}

	function createVideoTag(alternateVideos, config) {
		var html = '<video controls="controls" height="'+config.height+'" width="'+config.width+'" preload="'+config.preload+'">';
		for (var i = 0; i < alternateVideos.length; i++) {
			html += '<source src="'+alternateVideos[i].url+'" type="'+alternateVideos[i].type+'" />';
		}
		html += '</video>';
		return html;
	}
	
	function init(givenConfig) {
		config = givenConfig;
		
		process();
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
	
	return {
		init : init,
		getSettingByKey : getSettingByKey
	};
})();

// Register this extension.
if (typeof(Extensions) === 'undefined') {
	Extensions = {};
}
Extensions.TagesschauVideo = Extension;