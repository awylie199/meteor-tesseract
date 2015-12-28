meteorTesseract = {};

Meteor.startup(function() {
	"use strict";
	if (Meteor.isServer) {
		(() => {
			function getPathKey ( ) {
				return Object.keys(this || {}).map( key => {
					if ( /^tesseract_?path/i.test( key ) ) {
					 return this[key];
					}
				}, this);
			}

			function getPrefixKey ( ) {
				return Object.keys(this || {}).map( key => {
					if (/^tessdata_?prefix/i.test( key )) {
					 return this[key];
					}
				}, this);
			}

			try {
				const DEBUG = process.env.NODE_ENV !== 'production';
				const fs = Npm.require('fs');
				let tesseract = Npm.require('node-tesseract');
				let stats;
				// Try to get Tesseract Location from Meteor settings or environment variables
				let hostTesseract = (function() {
					let binary = [],
						prefixes = [];
					if ( Meteor.settings ) {
						if (Meteor.settings.private) {
							binary = getPathKey.call( Meteor.settings.private );
							prefixes = getPrefixKey.call( Meteor.settings.private );
						} else if (Meteor.settings.public) {
							binary = getPathKey.call( Meteor.settings.public );
							prefixes = getPrefixKey.call( Meteor.settings.public );
						} else {
							binary = getPathKey.call( Meteor.settings );
							prefixes = getPrefixKey.call( Meteor.settings );
						}
					} else if ( process.env ) {
						binary = getPathKey.call( process.env );
						prefixes = getPrefixKey.call( process.env );
					}
					//console.log(binary);
					return {
						binaryPath : ( binary.length && binary[0] ) || false,
						prefixes : ( prefixes.length || false )
					};
				})();

				if ( hostTesseract.binaryPath ) {
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
					meteorTesseract = Object.create(tesseract, {
						translateText : {
							value (image, l = 'eng', psm = 6, binary = tesseractPath ) {

								if ( ! image ) {
									DEBUG && console.log("No image passed to Tesseract");
									return false;
								}

								if ( hostTesseract.prefixes.length && ~hostTesseract.prefixes.indexOf(l) ) {
									DEBUG && console.log("Tesseract Language prefix not installed. Defaulting to English.");
									l = 'eng';
								} else if ( DEBUG ) {
									Object.keys(hostTesseract.prefixes).foreach( prefix => {
										console.log("Language Prefix found :", prefix);
									});
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
					return meteorTesseract;
				} else {
					throw new Meteor.Error("Tesseract is undefined");
				}

			} catch ( err ) {
				if ( err instanceof Meteor.Error ) {
					console.log("Tesseract MeteorError : ", err.message || err.details || err.reason || err);
				} else {
					console.log("Tesseract Error : ", err);
				}
			}
		})();
	}
});