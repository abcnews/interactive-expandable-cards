module.exports = {
	"options": {},
	"dev": {
		"options": {
			"debug": true
		},
		"files": {
			"build/scripts/index.js": ["src/scripts/index.js"]
		}
	},
	"prod": {
		"files": {
			"build/scripts/index.js": ["src/scripts/index.js"]
		}
	}
};
