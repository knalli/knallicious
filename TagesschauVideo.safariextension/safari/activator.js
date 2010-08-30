safari.self.addEventListener('message', function (event) {
	if (event.name === 'extensionInit') {
		Extensions.TagesschauVideo.init(event.message);
	}
}, false);

safari.self.tab.dispatchMessage('getSettings', null);