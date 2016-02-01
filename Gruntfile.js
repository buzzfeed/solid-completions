var postcss = require('postcss');
var handlebars = require('handlebars');
var fs = require('fs');

Array.prototype.unique = function() {
    var o = {}, i, l = this.length, r = [];
    for(i=0; i<l;i+=1) o[this[i]] = this[i];
    for(i in o) r.push(o[i]);
    return r;
};

var solid_classes = postcss.plugin('postcss-solid-classes', function (opts) {
  opts = opts || {};
  var dest = './solid-classes.sublime-completions';
  var template = handlebars.compile(fs.readFileSync('./solid-classes.hbr', {encoding: 'utf-8'}));

  return function(css) {
    var fd = fs.openSync(dest, 'w+');
    var hbs = new Array()
    var rules = null
    css.walkRules(function(rule){
      rules = rule.selector.match(/\.[^\s,\:\.\(\)]+/g)
      if (rules && rules.length) {
        rules.forEach(function(e){
          hbs.push(e.replace('.', ''))
        })
      }
      if (0)
        fs.writeSync(fd, out);
    });

    hbs = hbs.sort().unique()

    fs.writeSync(fd, template({
      scope: opts.scope,
      completions: hbs
    }));
    fs.closeSync(fd);
  };
});

var solid_variables = postcss.plugin('postcss-solid-variables', function (opts) {
  opts = opts || {};
  var dest = './solid-variables.sublime-completions';
  var template = handlebars.compile(fs.readFileSync('./solid-variables.hbr', {encoding: 'utf-8'}));
  
  return function(css) {
    var fd = fs.openSync(dest, 'w+');
    var hbs = new Array()
    var rules = null
    css.nodes.forEach(function(rule){
      if (rule.prop !== undefined && rule.prop.match(/^\$/g)) {
        hbs.push(rule.prop)
      }
      if (0)
        fs.writeSync(fd, out);
    });

    hbs = hbs.sort().unique()
    
    fs.writeSync(fd, template({
      scope: opts.scope,
      completions: hbs
    }));
    fs.closeSync(fd);
  };
});

module.exports = function(grunt) {
  grunt.initConfig({
    clean: {
      pre: ['./dist', '*.sublime-completions'],
      post: ['./dist/*.css']
    },
    sass: {                              // Task
      dist: {                            // Target
        options: {                       // Target options
          style: 'expanded'
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
            solid_classes({
              scope: "text.html string.quoted",
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
            solid_variables({
              scope: "source.scss meta.property-value.scss",
            }),
          ]
        },
        src: './node_modules/bf-solid/_lib/solid-helpers/_variables.scss'
      }
    }
  });

  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['clean:pre', 'sass','postcss', 'clean:post'])
  grunt.registerTask('generate', ['default'])
}