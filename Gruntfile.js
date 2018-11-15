module.exports = function(grunt)
{
        // -----------------------------------------
        // Start Grunt configuration
        // -----------------------------------------

        grunt.initConfig({

                // Load package.json file
                pkg: grunt.file.readJSON('package.json'),

                // --------------------------------------
                // Watch Configuration
                // --------------------------------------

                watch: {
                	grunt: { files: ['Gruntfile.js'], tasks: ['default'] },

                	sass: {
                		files: 'develop/scss/**/*.scss',
                		tasks: ['buildCss']
                	},

                	script: {
                		files: 'develop/js/**/*.js',
                		tasks: ['buildJs']
                	}
                },

                // --------------------------------------
                // Sass Configuration
                // --------------------------------------

                sass: {
                	options: {
                		loadPath: ['bower_components/foundation/scss']
                	},
                	dist: {
                		options: {
                			sourcemap: 'none',
                			style: 'nested'
                		},
                		files: [{
                			expand: true,
                			cwd: 'develop/scss',
                			src: ['*.scss'],
                			dest: 'dist/assets/css',
                			ext: '.css'
                		}]
                	}
                },

                // --------------------------------------
                // Concatenate Configuration
                // --------------------------------------

                concat: {
                	options: {
                		separator: ';'
                	},
                	script: {
                		src: [
                			'bower_components/foundation/js/foundation/foundation.js',
                			'bower_components/foundation/js/foundation/foundation.alert.js',
                			'bower_components/foundation/js/foundation/foundation.abide.js',
                			'bower_components/foundation/js/foundation/foundation.joyride.js',
                			// ...more foundation JS you might want to add
                			'develop/js/script.js'
                		],
                		dest: 'dist/assets/js/script.js'
                	},
                	modernizr: {
                		src: [
                			'bower_components/modernizr/modernizr.js',
                			'develop/js/custom.modernizr.js'
                		],
                		dest: 'dist/assets/js/modernizr.js'
                	}
                },

                // --------------------------------------
                // Uglify Configuration
                // --------------------------------------

                uglify: {
                	dist: {
                		files: {
                			'dist/assets/js/jquery.min.js': ['bower_components/jquery/dist/jquery.js'],
                			'dist/assets/js/modernizr.min.js': ['dist/assets/js/modernizr.js'],
                			'dist/assets/js/script.min.js': ['dist/assets/js/script.js']
                		}
                	}
                }

        });

        // -----------------------------------------
        // Load Grunt tasks
        // -----------------------------------------

        grunt.loadNpmTasks('grunt-contrib-sass');
        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-contrib-concat');


        // -----------------------------------------
        // Register Grunt tasks
        // -----------------------------------------

        grunt.registerTask('buildCss', ['sass']);
        grunt.registerTask('buildJs',  ['concat', 'uglify']);
        grunt.registerTask('default',  ['buildCss', 'buildJs', 'watch']);

}
