module.exports = {
	"options": {
		"jshintrc": ".jshintrc",
		"force": true
	},
	"gruntfile": {
		"src": ["Gruntfile.js","grunt/*.js"]
	},
	"js": {
		"src": ["src/scripts/**/*.js", "!src/scripts/templates/index.js"]
	}
};
