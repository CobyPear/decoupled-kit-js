const parse = require('espree');

/**
 * Extract lintable code from files
 */
function preprocess(code, filename) {
	console.log('AHHHHHHHHHHHHHH')
	console.log('filename', filename);
	const ast = parse(ast);

	console.log(ast);
}

module.exports = preprocess;


