var DeliciousApi = (function(){
	
	function fetchDataFromApi(url) {
		var result = null;
		$.ajax({
			async: false,
			cache: false,
			url: url,
			success: function(data) {
				result = data;
			},
			failure: function(){
				console.log('Cannot load data from ' + url);
			}
		});
		return result;
	}
	
	/**
	  * Returns the last update time for the user, as well as the number 
	  * of new items in the user's inbox since it was last visited.
	  * 
	  * Use this before calling posts/all to see if the data has changed 
	  * since the last fetch.
	 */
	function v1_getPostsUpdate() {
		return fetchDataFromApi('https://api.del.icio.us/v1/posts/update');
	}
	
	function v1_getNewBookmarkUrl(url, title, options) {
		if (options && options.headlessGui) {
			return 'http://delicious.com/save?v=5&noui=1&url=' + escape(url) + '&title=' + escape(title);
		} else {
			return 'http://delicious.com/save?v=5&url=' + escape(url) + '&title=' + escape(title);
		}
	}
	
	function v1_getBookmarks() {
		return fetchDataFromApi('https://api.del.icio.us/v1/posts/all');
	}
	
	return {
		// API V1
		getPostsUpdate: v1_getPostsUpdate,
		getNewBookmarkUrl: v1_getNewBookmarkUrl,
		getBookmarks: v1_getBookmarks,
		
		// CONVENIENT API
		getPostsUpdateInboxNew: function() {
			var result = this.getPostsUpdate();
			if (result) {
				return parseInt($(result).attr('inboxnew')||0, 10);
			}
			
			return null;
		},
		
		getBookmarkUrls: function(){
			var urls = [];
			var result = this.getBookmarks();
			if (result) {
				$('post', result).each(function(i, elem){
					var url = $(elem).attr('href');
					if (url) {
						urls.push(url);
					}
				});
			}
			return urls;
		}
	};
	
})();