var db = require('./db');

swig.init({
    autoescape: false,
    filters: {
        filesize: function(bytes) {
            if (bytes > 0) {
                var e = Math.floor(Math.log(bytes) / Math.log(1024));
                return [(bytes / Math.pow(1024, e)).toFixed(1), UNITS[e]].join(" ");
            }
            return [bytes, UNITS[0]].join(" ");
        }
    }
});

var templates = {
	package: {
		list: swig.compile($('#tmpl-package-list').html()),
		detail: swig.compile($('#tmpl-package-detail').html()),
		readme: swig.compile($('#tmpl-package-readme').html())
	}
}

var $content = $('#content');

/**
 * main
 */
exports.index = function() {
	var packagesPromise = db.packages.search();
	packagesPromise.done(function(data) {
		var html = templates.package.list({
			packages: data.hits
		});
		$content.html(html);
	});
};

/**
 * package detail
 */
exports.packages = function (name, version) {
	var packagePromise = db.packages.byName(name);
	packagePromise.done(function(data) {
		var html = templates.package.detail(data);
        $content.html(html);
	});
};

/**
 * readme popup
 */
exports.readme = function(name) {
    var $cached = $('#package-'+name);
    if ($cached.length) {
        $cached.removeClass('hide');
        return;
    }
    var packagePromise = db.packages.byName(name);
    packagePromise.done(function(package) {
        var $button = $("#viewreadme-button-" + package.name);
        $button.data('loading-text', 'Trying to load README...');
    	var readmePromise = db.readme.byGithubUrl(package.repositories[0].url);
        if (!readmePromise) {
            $button.data('loading-text', 'Failed');
            return;
        }

    	readmePromise.done(function(readme) {
    		package.readme = readme;
    		var $readme = templates.package.readme({
    			package: package
    		})
    		var $readme = $($readme).attr('id', 'package-' + name);
            $readme.modal();
            $button.data('loading-text', '');
    		$('body').append($readme);
            $readme.removeClass('hide');
    	});
    });
}