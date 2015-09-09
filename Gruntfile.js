module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserSync: {
      bsFiles: {
        src : [
          'projectX/**/*.js',
          'projectX/**/*.xml',
          'projectX/**/*.css',
          'tests/**/*.js'
        ]
      },
      options: {
        watchTask: true,
        open: false,
        server: {
            baseDir: "./"
        }
      }
    },
    //compile style.less to style.css file
    less: {
      development: {
        options: {
          paths: ["projectX/css"]
        },
        files: {
          "projectX/css/style.css": "projectX/css/style.less"
        }
      }
    },
    //watch all less files in the project and trigger
    //automatic compile when they change
    watch: {
      styles: {
        files: ['projectX/**/*.less'], // which files to watch
        tasks: ['less'],
        options: {
          nospawn: true
        }
      }
    },
    //run a static server that does not refresh with changes of files
    connect: {
      server: {
        options: {
          port: 9001,
          useAvailablePort: true,
          base: './',
          keepalive: false
        }
      }
    },
    copy: { // copy all files needed for the deployment into the build/release folder
	  main: {
		  files: [
	      // indexElectron.hml
	      {src: ['indexElectron.html'], dest: 'build/release/indexElectron.html', filter: 'isFile'},
	      // electron.js
	      {src: ['electron.js'], dest: 'build/release/electron.js', filter: 'isFile'},
	      // package.json
	      {src: ['package.json'], dest: 'build/release/package.json', filter: 'isFile'},
          //files
          {expand: true, cwd: 'projectX/', src: ['**'], dest: 'build/release/projectX'},
          {expand: true, cwd: '3rdparty/', src: ['**'], dest: 'build/release/3rdparty'},
          {expand: true, cwd: 'resources/', src: ['**'], dest: 'build/release/resources'}
	    ],
	  },
	},
    'build-electron-app': {
        options: {
            platforms: ["darwin", "win32"],
            app_dir: "./build/release",
            build_dir: "./build/electron"
        }
    }
  });    
  
  // Load the plugin that provides the "browserSync" task.
  grunt.loadNpmTasks('grunt-browser-sync');
  // Load the plugin that provides the "less" task.
  grunt.loadNpmTasks('grunt-contrib-less');  
  // Load the plugin that provides the "watch" task.
  grunt.loadNpmTasks('grunt-contrib-watch');
  // Load the plugin that provides the "connect" task.
  grunt.loadNpmTasks('grunt-contrib-connect');
  // Load the plugin that provides the "copy" task.
  grunt.loadNpmTasks('grunt-contrib-copy');
  // Load the plugin that provides the "build-electron-app" task
  grunt.loadNpmTasks('grunt-electron-app-builder');

  // Default task(s).
  grunt.registerTask('default', ['browserSync', 'connect', 'watch']);
  
  grunt.registerTask('build', ['copy', 'build-electron-app']);
};