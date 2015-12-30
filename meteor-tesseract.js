tesseract = Npm.require( 'node-tesseract' );
console.log(tesseract);

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

			function getPrefixKey ( ) {
				return Object.keys( this || {} ).reduce( ( prev, key ) => {
					/^tessdata_?prefix/i.test( key ) && prev.push( this[key] );
					return prev;
				}.bind(this), []);
			}

			try {
				const DEBUG = process.env.NODE_ENV !== 'production';
				const fs = Npm.require( 'fs' );
				let stats;
				// Try to get Tesseract Location from Meteor settings or environment variables
				let hostConfig = (() => {
					let binary = [],
						prefixes = [];

					if ( Meteor.settings ) {
						const mostExplicitSettings = Meteor.settings.private ||
							(Object.keys(Meteor.settings.public).length > 0 && Meteor.settings.public) ||
								Meteor.settings;
						binary = getPathKey.call( mostExplicitSettings );
						prefixes = getPrefixKey.call( mostExplicitSettings );
					}

					if ( process.env ) {
						if ( ! binary.length ) {
							binary = getPathKey.call( process.env );
						}
						if ( ! prefixes.length ) {
							prefixes = getPrefixKey.call( process.env );
						}
					}
					DEBUG && console.log('TESSERACT_PATH : ', binary[0]);
					DEBUG && console.log('TESSDATA_PREFIX : ', prefixes[0]);
					return {
						binaryPath : ( binary.length && binary[0] ) || false,
						prefixPath : ( prefixes.length && prefixes[0] || false )
					};
				})();

				if ( hostConfig.binaryPath ) {
					try {
						stats = fs.lstatSync(hostConfig.binaryPath);
						if ( ! stats ) {
							throw new Meteor.Error("Tesseract binary path specified, but unable to get fs stats.");
						}
					} catch ( err ) {
						throw err;
					}
				} else {
					throw new Meteor.Error("Tesseract binary path not specified in Meteor settings");
				}

				if ( typeof tesseract !== 'undefined' ) {
					tesseract.process.bind( hostConfig.binaryPath );
					DEBUG && console.log('Tesseract configured and exported.');
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