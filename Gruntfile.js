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
          'tests/**/*.js',
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

  // Default task(s).
  grunt.registerTask('default', ['browserSync', 'connect', 'watch']);
};