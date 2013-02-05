
var grunt = require('grunt'),
    path = require('path');

var basePath = path.resolve('.');
var generatedRunnerFile = '_SpecRunner.html';

var jasmineCoreScripts = [
  __dirname + '/../../jasmine/lib/jasmine-core/jasmine.js',
  __dirname + '/../../jasmine/lib/jasmine-core/jasmine-html.js'
];

var mandatoryHelpers = [
  __dirname + '/../jasmine/phantom-helper.js',
  __dirname + '/../jasmine/jasmine-helper.js'
];

var mandatoryStyles = [ __dirname + '/../../jasmine/lib/jasmine-core/jasmine.css' ];

exports.createSpecRunnerPage = function(options, reporters) {
  grunt.verbose.write('Creating Spec Runner Page...');
  var source;
  grunt.file.copy(templateHashFrom(options).src, path.join(options.runner_dir, generatedRunnerFile), {
    process : function(src) {
      source = grunt.util._.template(src, createTemplateOptions(options, reporters));
      return source;
    }
  });
  return source;
};

function createTemplateOptions(options, reporters) {
  var scriptOptions = (typeof options.amd === 'undefined') ? createNonAmdScriptOptions(options, reporters) :
                                                             createAmdScriptOptions(options, reporters);
  var templateOptions = grunt.util._.extend({ css : toRelativeFiles(mandatoryStyles) },
                                            scriptOptions, templateHashFrom(options).opts);
  grunt.verbose.write('Effective template options: ' + JSON.stringify(templateOptions));
  return templateOptions;
};

function createAmdScriptOptions(options, reporters) {
  grunt.verbose.write('Configuring AMD support...');
  var scriptOptions = {
    scripts: toRelativeFiles(jasmineCoreScripts, mandatoryHelpers, options.helpers, reporters),
    amd: {
      lib_script: toRelativeFiles(options.amd.lib),
      main_script: toRelativeFile(options.amd.main),
      specs: toRelativeFiles(options.specs)
    }
  };
  grunt.verbose.ok();
  return scriptOptions;
};

function createNonAmdScriptOptions(options, reporters) {
  grunt.verbose.write('Configuring Non-AMD support...');
  var scriptOptions = {
    scripts: toRelativeFiles(jasmineCoreScripts, options.src, mandatoryHelpers, options.helpers, options.specs, reporters)
  };
  grunt.verbose.ok();
  return scriptOptions;
};

function templateHashFrom(options) {
  return {
    src: resolveTemplateSrc(options),
    opts: options.opts
  };
};

function resolveTemplateSrc(options) {
  return (typeof options.template === 'string') ? options.template : options.template.src;
}

function toRelativeFiles(/* args... */) {
  var list = Array.prototype.slice.call(arguments);
  var files = [];
  list.forEach(function(listItem) {
    files = files.concat(grunt.file.expandFiles(listItem));
  });
  return grunt.util._(files).map(function(file) {
    return path.resolve(file).replace(basePath, '').replace(/\\/g, '/');
  });
};

function toRelativeFile(file) {
  return toRelativeFiles(file);
};
