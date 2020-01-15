function turnFilteringOff() {
	chrome.storage.sync.set({ 'isEnabled': false }, function() {
		chrome.browserAction.setIcon({ path: { "16": 'blocker/res/off.png' } });
		console.log('Filtering disabled');
	});
}

function turnFilteringOn(callback) {
	if (callback === undefined) {
		callback = function(confirm) { };
	}
	chrome.storage.sync.set({ 'isEnabled': true }, function() {
		chrome.browserAction.setIcon({ path: 'blocker/res/on.png' }, function() {
			console.log('Filtering enabled.');
			callback(true);
		});
	});
};