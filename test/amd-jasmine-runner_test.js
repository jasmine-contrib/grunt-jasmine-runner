/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var grunt = require('grunt'),
    fs = require('fs');

var task = require('../tasks/jasmine');

exports['jasmine-runner'] = {

  setUp: function(done) {
    // setup here
    done();
  },

  'amd support with default runner directory': function(test) {
    test.expect(6);
    // tests here

    var config = {
      timeout: 10000,
      src     : 'test/fixtures/selfContained/amd/src/**/*.js',
      specs   : 'test/fixtures/selfContained/amd/spec/**/*Spec.js',
      helpers : 'test/fixtures/selfContained/amd/spec/**/*Helper.js',
      amd     : {
        lib  : 'test/fixtures/selfContained/amd/lib/require.js',
        main : 'test/fixtures/selfContained/amd/src/requireMain.js'
      },
      server  : {
        port : 8888
      },
      phantomjs : {
        'ignore-ssl-errors' : true,
        'local-to-remote-url-access' : true,
        'web-security' : false
      }
    };

    function testCallback(err, status) {
      test.equal(status.specs, 1, 'Found total specs from example');
      test.equal(status.total, 1, 'Ran all specs from example');
      test.equal(status.passed, 1, 'Passed all specs from example');
      test.ok(!err, 'No error received');

      var actualSpecRunner = grunt.file.read('_SpecRunner.html');
      var expectedSpecRunner = grunt.file.read('test/expected/standardTemplate/amd/_SpecRunner.html');
      test.equal(expectedSpecRunner, actualSpecRunner, 'generated amd spec runner with default runner directory');

      var actualJasmineExecutor = grunt.file.read('jasmine-executor.js');
      var expectedJasmineExecutor = grunt.file.read('test/expected/standardTemplate/amd/jasmine-executor.js');
      test.equal(expectedJasmineExecutor, actualJasmineExecutor, 'generated amd executor with default runner directory');

      test.done();
    }

    task.phantomRunner(config, testCallback);
  },

  'amd support with custom runner directory': function(test) {
    test.expect(6);
    // tests here

    var config = {
      timeout: 10000,
      src     : 'test/fixtures/selfContained/amd/src/**/*.js',
      specs   : 'test/fixtures/selfContained/amd/spec/**/*Spec.js',
      helpers : 'test/fixtures/selfContained/amd/spec/**/*Helper.js',
      amd     : {
        lib  : 'test/fixtures/selfContained/amd/lib/require.js',
        main : 'test/fixtures/selfContained/amd/src/requireMain.js'
      },
      'runner-dir' : 'build',
      server  : {
        port : 8888
      },
      phantomjs : {
        'ignore-ssl-errors' : true,
        'local-to-remote-url-access' : true,
        'web-security' : false
      }
    };

    function testCallback(err, status) {
      test.equal(status.specs, 1, 'Found total specs from example');
      test.equal(status.total, 1, 'Ran all specs from example');
      test.equal(status.passed, 1, 'Passed all specs from example');
      test.ok(!err, 'No error received');

      var actualSpecRunner = grunt.file.read('build/_SpecRunner.html');
      var expectedSpecRunner = grunt.file.read('test/expected/standardTemplate/amd/customRunnerDirectory/_SpecRunner.html');
      test.equal(expectedSpecRunner, actualSpecRunner, 'generated amd spec runner with custom runner directory');

      var actualJasmineExecutor = grunt.file.read('build/jasmine-executor.js');
      var expectedJasmineExecutor = grunt.file.read('test/expected/standardTemplate/amd/jasmine-executor.js');
      test.equal(expectedJasmineExecutor, actualJasmineExecutor, 'generated amd executor with custom runner directory');

      test.done();
    }

    task.phantomRunner(config, testCallback);
  }

};
