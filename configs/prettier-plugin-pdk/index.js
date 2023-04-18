const hbsParser = require('@handlebars/parser')

module.exports = plugin = {
	languages: [
		{
			name: 'pdk',
			parsers: ['pdk'],
			extensions: ['*.hbs']
		}
	],
	parsers: {
		pdk: {
			parse: (text, parsers, options) => {
				// in theory, we should be able to parse each file
				// const [key] = options.filepath.match(/(?<ext>[a-z]{3})(?:.hbs)$/gm)
				// let parsed;
				// // Ideally we would parse the file with both handlebars and jsx, css, or
				// // whatever other parser was needed
				// switch (key.split('.')[0]) {
				// 	case 'js':
				// 	case 'ts':
				// 		parsed = parsers.typescript(text)
				// 	case 'jsx':
				// 	case 'tsx':
				// 		parsed = parsers.acorn(text)
				// 	case 'css':
				// 		parsed = parses.css(text)
				// 	default:
				// 		throw new Error(`File with extension ${key} could not be parsed`)
				// }
				// return {
				// 	hbs: hbsParser.parse(text),
				// 	[key]: parsed
				// }
				return hbsParser.parse(text)
				// console.log('parseHbs', parseHbs)
			},
			astFormat: 'pdk-ast',
			preprocess: (text, options) => {
				// unsure if we need to preprocess.
				// There could be a world where we should
				// compile every possible iteration the handlebars template
				// then format each version, but idk how we would write that back to the file
				// because there would be conflicts.
				return text
			},
		}
	},
	printers: {
		'pdk-ast': {
			print: (path, options, print) => {
				// console.log('custom printer', path, options)
				// console.log(path.stack[0].body)
				// we might be able to do some logic here
				// to format each chunk of the code piece by piece
				return '';
			},
		}
	}
}
