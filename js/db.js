exports.packages = {
	byName: function(name) {
		return $.ajax('/api/packages/' + name , {dataType: 'json'});
	},
	search: function(query, offset) {
		return $.ajax('/api/search', {
			type: 'GET',
			data: {
				q: query || '',
				o: offset || 0,
				l: 10
			},
			dataType: 'json'
		});
	},
};

exports.readme = {
	byGithubUrl: function(name) {
		return loadGithubReadme(name);
	}
};

var githubRegex = [
    /http(s):\/\/github\.com\/([a-z0-9A-z_]+)\/([a-z0-9A-z_-]+)\.git/,
    /git@github\.com:([a-z0-9A-z_]+)\/([a-z0-9A-z_-]+)\.git/,
    /git:\/\/github\.com\/([a-z0-9A-z_]+)\/([a-z0-9A-z_-]+)\.git/
];

// if repoUrl is a valid github url
// this will load it's preferred README as html into $container
var loadGithubReadme = function(repoUrl) {
    var match = null;
    // just try all regex and see if one fits
    _.some(githubRegex, function(re) {
        match = re.exec(repoUrl);
        return match;
    });
    if (!match) {
        return null;
    }
    return $.ajax({
        headers: {
            Accept: "application/vnd.github.v3.html+json"
        },
        url: "https://api.github.com/repos/" + match[2] + "/" + match[3] + "/readme"
    });
};
