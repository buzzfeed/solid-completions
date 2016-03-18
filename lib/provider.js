fs = require('fs')
var solid = JSON.parse(fs.readFileSync(__dirname + '/../solid-classes.json', 'utf-8'))
solidClasses = solid.suggestions.classes
solidVars = solid.suggestions.variables

var classSuggestions = new Array()
var varSuggestions = new Array()
var iconImage = '<img style="max-width:80%; opacity: .5;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABCdJREFUWAnlV11oHFUU/s5kt02TZjOT/mhLhbQJ9UGqjakxLZWKivjQFwtShS1KQfoiCFJwEyps1YTEQnwrWJQWJEWtiqCCtT5UIbZNov1BkEhapWr6I+lMd7PZrJuZ67mbzl92ZnYTn8SF5Z57znfO9825P7ML/N8/9G8aIATqoKMdCjohSt+HuV4GhG2kwaim9oIEiAw2wrxDRpBk9zNxLIAoSU0YDPCXuYKSSyB+ugQ/y1ZYTCSfThLOosmpIByr3JgTt3gBwkALN3CEiTWnehShA3KMTseqYCgh8WYfeQgowr2ZO1gbEXdCYQJ+5JYv7Jm5pDBqYI4xr0AcWTzosEQYgQJI5b0tMBaRVxYSN2PI7L0HmZfWYnpgFTAZe6QMFOAIPQVCxzEW8XxATrlLEKb2r0Hxktt1ZYWVhaE8pg5fGS1PcD2BHSiFCWddWLQ184HqI5doa1JpECZ9f+uh1i6RTofyRHVgM3fgfDQ1SmuefXkthBmOJKJvlxL21I1c/n0+KlRZYuDP+unisuiNmFeQ610dSS4JhRA7Cpa4aLS3PlOdgFdvbcoW6z4fud4W2iFZaPrwCpgToXeZj4ufRLNgfaS3txwVj9633A6WdyBlbOAjeJJla+cmtti4srH43XIUvmoo81dyCIgXjOzMhdtbNnZIrF9Ad24NN+wUrz2PwNkQAeKvGKbfXikhi/qwiBYL5hBv0KTbv5ShwSyc5Iob7KqBAvjI5fpXw5rya7dzqh15X0ju5+aqHBL1fHC+ZMcmb4FrU3fjamad14XCh40oXnTPuy+4gAkRzJhCbypIiyWY1D/ltm8Nyvd2wboZR/6Y+0IMwlftI7yeGB4/oyCv9zD5k2GJp69ud0NF3iGR58KFRlpEQ2pze4/ExEB0F+/4UPx7l5Kl99LtQqK0KbW2HI78dADN+T9CcyIDRBmKxZN04kTp6iKkdRV5Idd/W2SiJ9gwm0P/2CE8e+0Lj7dKU1GSTSPjzo+VuYamRR1m9E94KZ6qskwJtuvG1xj4uReJ2amq0phsUPvhStILdlf0HRHHr/r7LGK3F1DJXjdznZfkNdFpnHdrBSRx8Dc1pjxA58Yz3rA/KS3kpjzMgH1eUCU7Tth345uOlfwb5uCd8+1LkUeuBrQjMXp5yBfgiV+AHU0ZvRBWlz2NHElJoU/tlxh5vVrCHOSbrtWbQ6Qc1EbH016fbQdfZ31qN5+O/TYoYnzLJpeYxtFfhtWG2jYmPOrkEJ1R17e94cznGcEdsEEpfS/viSN8+mtslzMSvYs+7UVnPs/QO1qeJlM8Ea+N99QPjU3MCzvTaAES1qXv4v8Gx1nEUicL9DGWqbuRJsv1Lc6qLEDW7TYeh2V9xt3g9zidYvKdTP734ij9WdUJkDkHMvfCtLZjVeNxvEJ5f5n/8OwffNdWxZaOdiIAAAAASUVORK5CYII=">'

solidClasses.forEach(function(solidClass){
  classSuggestions.push({
    text: solidClass.selector,
    leftLabelHTML: '<span style="padding-right: 2rem;">Solid</span>',
    rightLabelHTML: '<span>'+ solidClass.source +'</span>',
    iconHTML: iconImage,
    description: 'Solid ' + solidClass.source +' docs',
    descriptionMoreURL: 'http://solid.buzzfeed.com/' + solidClass.source + '.html'
  })
})

solidVars.forEach(function(solidVar){
  varSuggestions.push({
    text: solidVar,
    leftLabelHTML: '<span style="padding-right: 2rem;">Solid</span>',
    //rightLabelHTML: '<span>'+ solidClass.source +'</span>',
    iconHTML: iconImage,
    description: 'Solid docs',
    descriptionMoreURL: 'http://solid.buzzfeed.com/'// + solidClass.source + '.html'
  })
})

module.exports = {
  selector: '.html .meta.tag.any .string.quoted, .source.css.scss .meta.property-value.scss',
  getSuggestions: function(config){

    var sugArr
    var prefixSymbol = ''
    if (config.scopeDescriptor.scopes[0].search(/css/) > -1) {
      sugArr = varSuggestions

      //dumb hack to make autocomplete include $ if you don't type it
      var autocompleteString = config.editor.buffer.getTextInRange([
        [config.bufferPosition.row, config.bufferPosition.column - (config.prefix.length + 1)],
        [config.bufferPosition.row, config.bufferPosition.column]
      ])
      if (autocompleteString.search(/\$/) > -1) {
        prefixSymbol = '$'
      }
    }
    else {
      sugArr = classSuggestions
    }

    var sugs = new Array()
    sugArr.forEach(function(s){
      s.replacementPrefix = prefixSymbol + config.prefix
      if (s.text.search(config.prefix) > -1)
        sugs.push(s)
    })

    return sugs
  }
}
