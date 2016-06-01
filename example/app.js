var koa = require('koa');
var _static = require('..');

var app = koa();

// http://127.0.0.1:3000/static/blog/test.js
// http://127.0.0.1:3000/static/test.js
app.use(_static(['/static/**/*','/*/static/**/*'], {
	dir: './example/', 
	maxage: 60 * 60 * 1000
}));

app.listen(3000, function() {
  console.log('Listening on 3000!');
});