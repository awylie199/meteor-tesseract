tesseract = Npm.require( 'node-tesseract' );

Meteor.startup(function() {
	"use strict";
	if ( Meteor.isServer ) {
		(() => {

			function getPathKey ( ) {
				return Object.keys( this || {} ).reduce( ( prev, key ) => {
					/^tesseract_?path/i.test( key ) && prev.push( this[key] );
					return prev;
				}.bind(this), []);
			}

			try {
				const fs = Npm.require( 'fs' );
				let stats;
				// Try to get Tesseract Location from Meteor settings or environment variables
				let hostConfig = (() => {
					let binary = [];

					if ( Meteor.settings ) {
						const mostExplicitSettings = Meteor.settings.private ||
							(Object.keys(Meteor.settings.public).length > 0 && Meteor.settings.public) ||
								Meteor.settings;
						binary = getPathKey.call( mostExplicitSettings );
					}

					if ( process.env ) {
						if ( ! binary.length ) {
							binary = getPathKey.call( process.env );
						}
					}
					return {
						binaryPath : ( binary.length && binary[0] ) || false
					};
				})();

				if ( hostConfig.binaryPath ) {
					try {
						stats = fs.lstatSync( hostConfig.binaryPath );
						if ( ! stats ) {
							throw new Meteor.Error("Tesseract binary path specified, but unable to get fs stats.");
						}

					} catch ( err ) {
						throw err;
					}
				}

				if ( typeof tesseract !== 'undefined' ) {
					/**
					 * Returns tesseract results synchronously using meteorhacks:async package
					 * @param {String} 		image 		Path to image to translate
					 * @param {Object} 		options 	Tesseract options
					 * @return {Object}					Meteorhacks result with error and result properties.
					 */
					tesseract.syncProcess = (function(tesseract) {
						return function (image, options = {}) {
							return Async.runSync(function(done) {
								if ( hostConfig.binaryPath && ! options.hasOwnProperty('binary') ) {
									options.binary = hostConfig.binaryPath;
								}
								return tesseract.process(image, options, function(err, text) {
									done(err, text);
								});
							});
						};
					})(tesseract);
				} else {
					throw new Meteor.Error("NPM Tesseract is undefined");
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