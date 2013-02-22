
var grunt = require('grunt'),
    path = require('path');

var baseDir = '.';
var tmpRunner = '_SpecRunner.html';


exports.buildSpecrunner = function(dir, options, reporters){
  var jasmineCss = [
    __dirname + '/../../jasmine/lib/jasmine-core/jasmine.css'
  ];

  var jasmineCore = [
    __dirname + '/../../jasmine/lib/jasmine-core/jasmine.js',
    __dirname + '/../../jasmine/lib/jasmine-core/jasmine-html.js'
  ];

  var phantomHelper = __dirname + '/../jasmine/phantom-helper.js';
  var jasmineHelper = __dirname + '/../jasmine/jasmine-helper.js';

  var styles  = getRelativeFileList(jasmineCss);

  var core  = getRelativeFileList(jasmineCore, options.helpers, phantomHelper, reporters, jasmineHelper);
  var src   = getRelativeFileList(options.src);
  var specs = getRelativeFileList(options.specs);

  var specRunnerTemplate = options.template;
  if(typeof specRunnerTemplate === 'string'){
    specRunnerTemplate = {src: options.template, opts: {}};
  }

  if(!specRunnerTemplate){
    specRunnerTemplate = {
      src : __dirname + '/../jasmine/runners/'+((options.amd)?'Amd':'')+'SpecRunner.tmpl',
      opts: {}
    };
  }

  grunt.file.copy(specRunnerTemplate.src, path.join(dir,tmpRunner), {
    process : function(tmpl) {
      var source = grunt.util._.template(tmpl, grunt.util._.extend({
        css : styles,
        core : core,
        src: src,
        specs: specs
      }, specRunnerTemplate.opts));
      return source;
    }
  });
};


function getRelativeFileList(/* args... */) {
  var list = Array.prototype.slice.call(arguments);
  var base = path.resolve(baseDir);
  var files = [];
  list.forEach(function(listItem){
    files = files.concat(grunt.file.expandFiles(listItem));
  });
  files = grunt.util._(files).map(function(file){
    return path.resolve(file).replace(base,'').replace(/\\/g,'/');
  });
  return files;
}

