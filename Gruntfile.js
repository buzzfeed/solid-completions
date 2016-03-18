var processors = require('./lib/processors.js')

module.exports = function(grunt) {
  grunt.initConfig({
    clean: {
      pre: ['./dist', '*.sublime-completions'],
      post: ['./dist/*.css']
    },
    sass: {                              // Task
      dist: {                            // Target
        options: {                       // Target options
          style: 'expanded',
          sourceMap: true
        },
        files: {                         // Dictionary of files
          './dist/main.css': './node_modules/bf-solid/_lib/solid.scss'       // 'destination': 'source'
        }
      }
    },
    postcss: {
      "solid-classes": {
        options: {
          map: false,
          processors: [
            processors.solid_classes({
              scope: ".html .meta.tag.inline .string.quoted",
            }),
          ]
        },
        src: './dist/*.css'
      },
      "solid-variables": {
        options: {
          map: false,
          syntax: require('postcss-scss'), // work with SCSS directly
          processors: [
            processors.solid_variables({
              scope: ".source.css.scss .meta.property-value.scss",
            }),
          ]
        },
        src: './node_modules/bf-solid/_lib/solid-helpers/_variables.scss'
      },
      "solid-rules-pre": {
        options: {
          map: false,
          syntax: require('postcss-scss'), // work with SCSS directly
          processors: [
            processors.solid_rules_pre({
              //scope: "source.scss meta.property-value.scss",
            }),
          ]
        },
        src: ['./node_modules/bf-solid/_lib/*utilities*/*.scss']
      }
    }
  });

  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['clean:pre', 'sass', 'postcss:solid-variables', 'postcss:solid-rules-pre', 'postcss:solid-classes', 'clean:post'])
  grunt.registerTask('generate', ['default'])
}
