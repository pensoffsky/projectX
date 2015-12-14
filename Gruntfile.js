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
      },
        // runt static build server which serves a browsable directory
        buildGwServer: {
            options: {
                port: 8000,
                useAvailablePort: true,
                base: "buildGw",
                directory: "buildGw",
                keepalive: true
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
	    ]
	  },
      "sap.ui.core": {
			files: [
				{
					cwd: "bower_components/openui5-sap.ui.core/resources",
					src: [ "**/*" ],
					dots: true,
					expand: true,
					dest: "resources/"
				}
			]
		},
		"sap.ui.layout": {
			files: [
				{
					cwd: "bower_components/openui5-sap.ui.layout/resources",
					src: [ "**/*" ],
					dots: true,
					expand: true,
					dest: "resources/"
				}
			]
		},
		"sap.ui.table": {
			files: [
				{
					cwd: "bower_components/openui5-sap.ui.table/resources",
					src: [ "**/*" ],
					dots: true,
					expand: true,
					dest: "resources/"
				}
			]
		},
		"sap.ui.unified": {
			files: [
				{
					cwd: "bower_components/openui5-sap.ui.unified/resources",
					src: [ "**/*" ],
					dots: true,
					expand: true,
					dest: "resources/"
				}
			]
		},
		"sap.m": {
			files: [
				{
					cwd: "bower_components/openui5-sap.m/resources",
					src: [ "**/*" ],
					dots: true,
					expand: true,
					dest: "resources/"
				}
			]
		},
		"bluecrystal": {
			files: [
				{
					cwd: "bower_components/openui5-bluecrystal/resources",
					src: [ "**/*" ],
					dots: true,
					expand: true,
					dest: "resources/"
				}
			]
		},
        buildGw: {
            files: [
                // index.hml
                {
                    src: ['index.html'],
                    dest: 'buildGw/release/index.html',
                    filter: 'isFile'
                },
                //css, i18n, util, view folders
                {
                    cwd: 'projectX',
                    src: ['**/*'],
                    dots: true,
                    expand: true,
                    dest: 'buildGw/release/projectX/'
                },
                //Component: route matching
                {
                    src: ['projectX/Component.js', 'projectX/MyRouter.js'],
                    dest: 'buildGw/release/projectX/',
                    filter: 'isFile'
                },
                //3rd party components
                {
                    cwd: '3rdparty',
                    src: ['**/*'],
                    dots: false,
                    expand: true,
                    dest: 'buildGw/release/3rdparty/'
                }
            ] // copy:buildGw:files
        } // copy:buildGw
	},
    'build-electron-app': {
        options: {
            platforms: ['darwin', 'win32'],
            app_dir: "./build/release",
            build_dir: "./build/electron"
        }
    },
    // clean tasks
    clean: {
        build: ['build'],
        buildGw: ['buildGw']
    },
    // zip tasks
    zip: {
        'buildGw': {
            cwd: "buildGw/release/",
            src: ['buildGw/release/**'],
            dest: 'release/projectX-Gateway.zip'
        },
        'buildElectronDarwin': {
            cwd: "build/Electron/",
            src: ['build/Electron/darwin/**'],
            dest: 'release/projectX-electron-mac.zip'
        },
        'buildElectronWin32': {
            cwd: "build/Electron/",
            src: ['build/Electron/win32/**'],
            dest: 'release/projectX-electron-win32.zip'
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
  // Load the plugin that provides the clean task
  grunt.loadNpmTasks('grunt-contrib-clean');
  // Load the plugin that provides the zip task
  grunt.loadNpmTasks('grunt-zip');

  // Default task for development, run http servers and less compiler
  grunt.registerTask('default', ['browserSync', 'connect:server', 'watch']);

  // build tasks for Gateway package
  grunt.registerTask('buildGw', [
      'clean:buildGw',
      'copy:buildGw',
      'zip:buildGw'
      //'connect:buildGwServer' //why do we start a server here? isnt this just a normal build task?
  ]);

  // build the electron shell app for win and os x, create zip and copy to release folder on root
  grunt.registerTask('build', [
      'clean:build',
      'copy:main',
      'build-electron-app',
      'zip:buildElectronDarwin',
      'zip:buildElectronWin32'
  ]);

  // after bower install copy the resources from the bower folder into the resources folder
  grunt.registerTask('copyresources', [
      'copy:sap.ui.core', 
      'copy:sap.ui.layout', 
      'copy:sap.ui.table', 
      'copy:sap.ui.unified', 
      'copy:sap.m', 
      'copy:bluecrystal'
  ]);
};
