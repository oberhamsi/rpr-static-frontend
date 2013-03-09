exports.Router = function(views) {
	var getHash = function() {
		return document.location.hash.substring(1);
	}
	var onHashChange = function(event) {
		var hash = getHash();
		var parts = hash.split('/');
		var viewName = parts[1] || 'index';
		var args = parts.slice(2) || [];
		console.log('Calling view', viewName, 'with args', args);
		views[viewName].apply({}, args);
	}
	window.addEventListener("hashchange", onHashChange, false);
	onHashChange();
	return this;
};