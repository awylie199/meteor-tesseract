# meteor-tesseract
Server side optical character recognition based on NPM wrap of Tesseract.

Uses NPM package 'node-tesseract', version 0.2.7.

#Use

Exposes tesseract global object with the same NPM api.

An additional method is exposed, 'syncProcess', which returns the Tesseract results synchronously using the meteorhacks:async package. This is probably desirable when returning the result to the client via a Meteor Method.

See Examples folder.

```javascript
return tesseract.syncProcess('/path/to/img');
// or
return tesseract.syncProcess('/path/to/img', options);
```

#Config

If tesseract binary is in your path, it should work, no problem.

You can explicitly set your Tessdata_Prefix in your environment or Meteor.Settings. In which case, syncProcess will default to these, if they aren't explicitly defined in the options in your function call.