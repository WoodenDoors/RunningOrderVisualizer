module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			files: [
				'Gruntfile.js',
				'src/js/*.js'
			]
		},

		watch: {
			files: [
				'src/main/js/*.js',
				'src/main/**/*.html',
				'src/main/css/*.css'
			],
			options: {
				livereload: true,
			}
		},

		connect: {
			server: {
				options: {
					base: '.',
					port: 8082,
					keepalive: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', [
		'jshint'
	]);

	grunt.registerTask('server', ['connect']);
};