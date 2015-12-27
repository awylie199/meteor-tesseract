Package.describe({
  name: 'awylie199:meteor-tesseract',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Server side optical character recognition (OCR) using Tesseract',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/awylie199/meteor-tesseract.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
    "node-tesseract"    : "0.2.7"
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');

  api.addFiles(['meteor-tesseract.js'],'server');

  api.export('tesseract');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('awylie199:meteor-tesseract');
  api.addFiles('meteor-tesseract-tests.js');
});
