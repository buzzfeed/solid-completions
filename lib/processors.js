var postcss = require('postcss');
var handlebars = require('handlebars');
var fs = require('fs');

var solidVariableList = []
var sourceLookup = {}

Array.prototype.unique = function() {
    var o = {}, i, l = this.length, r = [];
    for(i=0; i<l;i+=1) o[this[i]] = this[i];
    for(i in o) r.push(o[i]);
    return r;
};

var solid_classes = postcss.plugin('postcss-solid-classes', function (opts) {
  opts = opts || {};
  var outputFiles = [{
    dest: './solid-classes.sublime-completions',
    template: handlebars.compile(fs.readFileSync('./templates/solid-classes.hbr', {encoding: 'utf-8'}))
  }, {
    dest: './solid-classes.json',
    template: handlebars.compile(fs.readFileSync('./templates/solid-classes.json.hbr', {encoding: 'utf-8'}))
  }]

  return function(css) {
    outputFiles.forEach(function(file){
      var fd = fs.openSync(file.dest, 'w+');
      var classList = {}
      var rules = null
      var consumer = css.source.input.map.consumer()

      css.walkRules(function(rule){
        // console.log(
        //   rule.selector,
        //   rule.source.start.line,
        //   rule.source.start.column,
        //   consumer.originalPositionFor({line: rule.source.start.line, column: rule.source.start.column }).source.split('\/').slice(-1)[0].replace(/^_([\w\-]+)\.scss/, '$1')
        // )

        var source = consumer.originalPositionFor({line: rule.source.start.line, column: rule.source.start.column }).source.split('\/').slice(-1)[0].replace(/^_([\w\-]+)\.scss/, '$1')
        rule.sourceFile = source
        rules = rule.selector.match(/\.[^\s,\:\.\(\)]+/g)
        if (rules && rules.length) {
          rules.forEach(function(e){
            if (rule.sourceFile !== 'mixins') {
              classList[e.replace('.', '')] = {source: rule.sourceFile}
            } else {
              var sourceFile = sourceLookup[e.replace(/\.?(xs\-|sm\-|md\-|lg\-)?/,'')]
              classList[e.replace('.', '')] = {source: sourceFile}
            }
          })
        }
        if (0)
          fs.writeSync(fd, out);
      });

      fs.writeSync(fd, file.template({
        scope: opts.scope,
        classes: classList,
        variables: solidVariableList
      }));
      fs.closeSync(fd);
    })
  }
});

var solid_variables = postcss.plugin('postcss-solid-variables', function (opts) {
  opts = opts || {};
  var dest = './solid-variables.sublime-completions';
  var template = handlebars.compile(fs.readFileSync('./templates/solid-variables.hbr', {encoding: 'utf-8'}));

  return function(css) {
    var fd = fs.openSync(dest, 'w+');
    var rules = null
    css.nodes.forEach(function(rule){
      if (rule.prop !== undefined && rule.prop.match(/^\$/g)) {
        solidVariableList.push(rule.prop)
      }
      if (0)
        fs.writeSync(fd, out);
    });

    solidVariableList = solidVariableList.sort().unique()

    fs.writeSync(fd, template({
      scope: opts.scope,
      completions: solidVariableList
    }));
    fs.closeSync(fd);
  };
});

var parseNodes = function(nodes){

}

var solid_rules_pre = postcss.plugin('postcss-solid-rules-pre', function (opts) {
  opts = opts || {};

  return function(css){
    parts = []

    css.nodes.forEach(function(node){
      if (node.type == 'atrule') {
        if (!(node.nodes && node.nodes.length))
          return false

        node.nodes.forEach(function(_node){
          if (_node.selector !== 'undefined'
            && typeof _node.selector === 'string'
            && _node.selector.length >= 1
            && _node.selector.charAt(0) == '&') {
            var _nodes =_node.selector.match(/[\.\&][^\s,\:\.\(\)]+/g)
            if (_nodes) {
              _nodes.forEach(function(rule){
                sourceLookup[rule.slice(1)] = css.source.input.file.split('\/').slice(-1)[0].replace(/^_([\w\-]+)\.scss/, '$1')
              })
            }
          }
        })
      }
      else if (node.type == 'rule') {
        var _nodes = node.selector.match(/\.[^\s,\:\.\(\)]+/g)
        _nodes.forEach(function(rule){
          sourceLookup[rule.slice(1)] = css.source.input.file.split('\/').slice(-1)[0].replace(/^_([\w\-]+)\.scss/, '$1')
        })
      }
    })

  }
});

module.exports = {
  solid_rules_pre: solid_rules_pre,
  solid_variables: solid_variables,
  solid_classes: solid_classes
}
