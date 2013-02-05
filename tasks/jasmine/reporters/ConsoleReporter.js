/* Based off of https://github.com/larrymyers/jasmine-reporters/ */
/*global phantom:false, jasmine:false*/


(function() {
  "use strict";

  /**
   * Basic reporter that outputs spec results to the browser console.
   * Useful if you need to test an html page and don't want the TrivialReporter
   * markup mucking things up.
   *
   * Usage:
   *
   * jasmine.getEnv().addReporter(new jasmine.ConsoleReporter());
   * jasmine.getEnv().execute();
   */
  function ConsoleReporter() {
    this.started = false;
    this.finished = false;
  }

  ConsoleReporter.prototype = {
    buffer : '',

    reportRunnerResults: function(runner) {
      var dur = (new Date()).getTime() - this.start_time;
      var failed = this.executed_specs - this.passed_specs;
      var spec_str = this.executed_specs + (this.executed_specs === 1 ? " spec, " : " specs, ");
      var fail_str = failed + (failed === 1 ? " failure in " : " failures in ");
      var self = this;

      this.verbose("Runner Finished.");
      this.logResult(spec_str + fail_str + (dur/1000) + "s.", failed == 0);
      this.finished = true;
      phantom.sendMessage( 'jasmine.done.ConsoleReporter' );
    },

    reportRunnerStarting: function(runner) {
      this.started = true;
      this.start_time = (new Date()).getTime();
      this.executed_specs = 0;
      this.passed_specs = 0;
      this.verbose("Runner Started.");
    },

    reportSpecResults: function(spec) {
      var results = spec.results();
      if (results.passed()) {
        this.passed_specs++;
      }
      this.logResult(this.buffer, results.passed());

      var items = results.getItems();
      for (var i = 0; i < items.length; i++) {
        var item = items[i];

        if (item.type === 'log') {
          this.verbose(item.toString());
        } else if (item.type === 'expect' && item.passed && !item.passed()) {
          this.logResult(this.buffer, item.passed());
          phantom.sendMessage('onError', item.message, item.trace);
        }
      }

      phantom.sendMessage( 'jasmine.testDone', results.totalCount, results.passedCount, results.failedCount, results.skipped);
    },

    reportSpecStarting: function(spec) {
      this.executed_specs++;
      this.buffer = spec.suite.description + ' : ' + spec.description + ' ... ';
    },

    reportSuiteResults: function(suite) {
      var results = suite.results();
      phantom.sendMessage('pass', suite.description + ": " + results.passedCount + " of " + results.totalCount + " passed.");
    },

    logResult: function(description, passedFlag) {
      phantom.sendMessage(passedFlag ? 'pass' : 'fail', description);
    },

    verbose: function(string) {
      phantom.sendMessage('verbose', string);
    }
  };

  jasmine.reporters = jasmine.reporters || {};
  // export public
  jasmine.reporters.ConsoleReporter = ConsoleReporter;
  jasmine.getEnv().addReporter( new ConsoleReporter() );
}());
