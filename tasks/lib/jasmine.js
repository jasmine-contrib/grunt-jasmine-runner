
var grunt = require('grunt'),
    path = require('path');

var basePath = path.resolve('.');
var generatedRunnerFilename = '_SpecRunner.html';

var jasmineCoreScripts = [
  __dirname + '/../../jasmine/lib/jasmine-core/jasmine.js',
  __dirname + '/../../jasmine/lib/jasmine-core/jasmine-html.js'
];

var mandatoryHelpers = [
  __dirname + '/../jasmine/phantom-helper.js',
  __dirname + '/../jasmine/jasmine-helper.js'
];

var nonAmdExecutor = __dirname + '/../jasmine/jasmine-executor.js'
var amdExecutorTemplate = __dirname + '/../jasmine/amd/jasmine-executor.js.tmpl'
var generatedAmdExecutorFilename = 'jasmine-executor.js';

var mandatoryStyle = __dirname + '/../../jasmine/lib/jasmine-core/jasmine.css';

exports.createSpecRunnerPage = function(options, reporters) {
  grunt.verbose.write('Creating Spec Runner Page...');
  grunt.file.copy(resolveTemplateSrc(options), path.join(options['runner-dir'], generatedRunnerFilename), {
    process : function(src) {
      return grunt.util._.template(src, createTemplateOptions(options, reporters));
    }
  });
};

function createTemplateOptions(options, reporters) {
  var scriptOptions = (typeof options.amd === 'undefined') ? createNonAmdScriptOptions(options, reporters) :
                                                             createAmdScriptOptions(options, reporters);
  return grunt.util._.extend({ css : toRelativeFiles(mandatoryStyle) }, scriptOptions, options.template.opts);
};

function createNonAmdScriptOptions(options, reporters) {
  grunt.verbose.write('Configuring Non-AMD support...');
  var scriptOptions = {
    scripts: toRelativeFiles(jasmineCoreScripts, options.src, mandatoryHelpers, nonAmdExecutor,
                             options.helpers, reporters, options.specs)
  };
  grunt.verbose.ok();
  return scriptOptions;
};

function createAmdScriptOptions(options, reporters) {
  grunt.verbose.write('Configuring AMD support...');
  var generatedAmdHelperScript = createAmdHelperScript(options);
  var scriptOptions = {
    scripts: toRelativeFiles(jasmineCoreScripts, mandatoryHelpers, reporters, options.amd.lib,
                             options.amd.main, options.helpers, generatedAmdHelperScript),
  };
  grunt.verbose.ok();
  return scriptOptions;
};

function createAmdHelperScript(options) {
  var scriptLocation = path.join(options['runner-dir'], generatedAmdExecutorFilename);
  grunt.file.copy(amdExecutorTemplate, scriptLocation, {
    process : function(src) {
      return grunt.util._.template(src, { specs: toRelativeFiles(options.specs) });
    }
  });
  return scriptLocation;
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
