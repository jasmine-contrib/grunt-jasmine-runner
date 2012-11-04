/*global jasmine:false*/

var jasmineEnv = jasmine.getEnv();

jasmineEnv.updateInterval = 1000;
var htmlReporter = new jasmine.HtmlReporter();
jasmineEnv.addReporter(htmlReporter);

/*
jasmineEnv.specFilter = function(spec) {
  return trivialReporter.specFilter(spec);
};
*/

jasmineEnv.specFilter = function(spec) {
  return htmlReporter.specFilter(spec);
};

function execJasmine() {
  jasmineEnv.execute();
}
