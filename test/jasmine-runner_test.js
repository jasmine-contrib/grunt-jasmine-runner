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

  'dynamic generation': function(test) {
    test.expect(4);
    // tests here

    var config = {
      timeout: 10000,
      src     : 'test/fixtures/selfContained/src/**/*.js',
      helpers : 'test/fixtures/selfContained/spec/**/*Helper.js',
      specs   : ['test/fixtures/selfContained/spec/**/*Spec.js'], // array to test support
      server  : {
        port : 8888
      },
      junit : {
        output : 'build/results'
      },
      phantomjs : {
        'ignore-ssl-errors' : true,
        'local-to-remote-url-access' : true,
        'web-security' : false
      }
    };

    function testCallback(err, status) {
      test.equal(status.specs, 5, 'Found total specs from example');
      test.equal(status.total, 8, 'Ran all specs from example');
      test.equal(status.passed, 8, 'Passed all specs from example');
      test.ok(!err, 'No error received');

      test.done();
    }

    task.phantomRunner(config, testCallback);
  },

  'custom template': function(test) {
    test.expect(5);
    // tests here

    var config = {
      timeout: 10000,
      src     : 'test/fixtures/selfContained/src/**/*.js',
      helpers : 'test/fixtures/selfContained/spec/**/*Helper.js',
      specs   : ['test/fixtures/selfContained/spec/**/*Spec.js'], // array to test support
      server  : {
        port : 8888
      },
      template: {
        src: 'test/fixtures/customTemplate/custom.tmpl',
        opts: {
          title: 'foo'
        }
      },
      junit: {
        output: 'build/results/custom-template'
      },
      phantomjs : {
        'ignore-ssl-errors' : true,
        'local-to-remote-url-access' : true,
        'web-security' : false
      }
    };

    function testCallback(err, status) {
      test.equal(status.specs, 5, 'Found total specs from example');
      test.equal(status.total, 8, 'Ran all specs from example');
      test.equal(status.passed, 8, 'Passed all specs from example');
      test.ok(!err, 'No error received');

      var actual = grunt.file.read('_SpecRunner.html');
      var expected = grunt.file.read('test/expected/customTemplate/_SpecRunner.html');
      test.equal(expected, actual, 'generated spec runner with custom template');

      test.done();
    }

    task.phantomRunner(config, testCallback);
  },

  'custom runner directory': function(test) {
    test.expect(5);
    // tests here

    var config = {
      timeout: 10000,
      src     : 'test/fixtures/selfContained/src/**/*.js',
      helpers : 'test/fixtures/selfContained/spec/**/*Helper.js',
      specs   : 'test/fixtures/selfContained/spec/**/*Spec.js',
      server  : {
        port : 8888
      },
      'runner-dir' : 'build',
      phantomjs : {
        'ignore-ssl-errors' : true,
        'local-to-remote-url-access' : true,
        'web-security' : false
      }
    };

    function testCallback(err, status) {
      test.equal(status.specs, 5, 'Found total specs from example');
      test.equal(status.total, 8, 'Ran all specs from example');
      test.equal(status.passed, 8, 'Passed all specs from example');
      test.ok(!err, 'No error received');

      var actual = grunt.file.read('build/_SpecRunner.html');
      var expected = grunt.file.read('test/expected/standardTemplate/_SpecRunner.html');
      test.equal(expected, actual, 'generated spec runner with standard template');

      test.done();
    }

    task.phantomRunner(config, testCallback);
  }

};
