if ( Meteor.isClient ) {
	Template.hello.events({
		'change input' : function (evt, temp) {
			Meteor.call('translateText', evt.target.files, function(err, result) {
				console.log(arguments);
				if ( err ) {
					console.log(err);
				} else {
					console.log(result);
				}
			});
		}
	});
}

Meteor.methods({
	translateText : function( image ) {
		let options = {
			// Tesseract options
		};
		if ( typeof tesseract !== 'undefined' ) {
			return tesseract.syncProcess('/Users/awylie/Documents/fuzzybears_signature.png');
			//return tesseract.syncProcess('/Users/awylie/Documents/fuzzybears_signature.png', options);
		}
		return;
	}
});