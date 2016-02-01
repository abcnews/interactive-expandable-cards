module.exports = {
	contentftp: {
		credentials: ".abc-credentials",
		targetName: "contentftp",
		target: "/www/res/sites/news-projects/interactive-expandable-cards/",
		files: [{
			expand: true,
			cwd: 'build/',
			src: ["**/*"]
		}]
	}
};
