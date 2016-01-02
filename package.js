Package.describe({
  name: 'awylie199:meteor-tesseract',
  version: '0.0.1',
  summary: 'Server side optical character recognition (OCR) using Tesseract',
  git: 'https://github.com/awylie199/meteor-tesseract.git',
  documentation: 'README.md'
});

Npm.depends({
    "node-tesseract"    : "0.2.7"
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('meteorhacks:async', 'server');
  api.addFiles(['meteor-tesseract.js'], 'server');
  api.export('tesseract', 'server');
});
