Meteor.startup(function() {
	"use strict";
	if (Meteor.isServer) {
		(() => {

			try {
				const DEBUG = process.env.NODE_ENV !== 'production';

				const fs = require('fs');
				const prefixes = Object.keys(process.env).reduce((prev, curr)=> {
					if (/^TESSDATA_/.test(curr)) {
						prev.push(curr);
					}
					return prev;
				}, ['eng']);

				let tesseract = require('node-tesseract');
				let stats;
				let tesseractPath = (
						Meteor.settings.private.hasOwnProperty('tesseract') &&
							Meteor.settings.private.tesseract ) ||
								( Meteor.settings.hasOwnProperty('tesseract') &&
									Meteor.settings.tesseract ) ||
										process.env.tesseract;

				if ( tesseractPath ) {
					try {
						stats = fs.lstatSync(tesseractPath);
						// FS stats to be deprecated
						if ( ! stats.isFile() ) {
							throw new Meteor.Error("Tesseract binary path specified, but unable to get fs stats.");
						}
					} catch ( err ) {
						throw err;
					}
				} else {
					throw new Meteor.Error("Tesseract binary path not specified in Meteor settings");
				}

				if ( typeof tesseract !== 'undefined') {
					tesseract = Object.create(tesseract, {
						translateText : {
							value (image, l = 'eng', psm = 6, binary = tesseractPath ) {

								if ( ! image ) {
									DEBUG && console.log("No image passed to Tesseract");
									return false;
								}

								if ( prefixes.length && ~prefixes.indexOf(l) ) {
									DEBUG && console.log("Tesseract Language prefix not installed. Defaulting to English.");
									l = 'eng';
								}

								const options = {
									l : l,
									psm : psm,
									binary : binary
								};
								try {
									this.process( image, options, (err, text) => {
										if ( err ) {
											throw err;
										} else {
											return text;
										}
									} );
								} catch ( err ) {
									throw err;
								}
							},
							configurable : true,
							writable: false,
							enumerable: false
						}
					});
					return tesseract;
				} else {
					throw new Meteor.Error("Tesseract is undefined");
				}

			} catch ( e ) {
				if ( err instanceof Meteor.Error ) {
					console.log(err.reason, err.details);
				} else {
					console.log("Tesseract Error : ", err);
				}
			}
		})();
	}
});