var fs = require('fs');
var process = require('process');

var phantomjs = require('phantomjs');
var phantom = require('phantom');
var handlebars = require('handlebars');

/*
*   @data: object with template vars
*   @templateName: name of handlebars template in ./templates directory (without extension)
*   @destinationName: (OPTIONAL) name of pdf file, if not provided is the same of templateName
*
* */

module.exports.generatePdf = function renderTemplate(data, templateName, destinationName){

	var htmlSource = __dirname+'/templates/'+templateName+'.hbs';
	var pdfDestination =
		destinationName?
		__dirname+'/results/'+destinationName+'.pdf':
		__dirname+'/results/'+templateName+'.pdf'
	;

	var template = {};
	template.data = data;

	return new Promise( function(resolve, reject) {

		fs.readFile( htmlSource , 'utf8', function (err, data) {
			if (err) {
				console.log('Error read template file', err);
				reject(err);
			}
			else { resolve(data); }
		});

	})
	.then(
		function(htmlSource){
			console.log('rendering: ', htmlSource);
			// console.log('handlebars: ', handlebars);

			var compiled = handlebars.compile(htmlSource);
			var results = compiled( template.data );

			console.log('rendered: ', results);
			return printPdf(results, pdfDestination);

		}
		,
		function(err){
			console.log('Error file genetrated 2', data);
		}
	);

};

function printPdf (source, destination){

	destination = destination || '';

	return phantom.create()
	.then(
		function(results){ return results.createPage();
		})
	.then(
		function(page){
			page.property('content', source);
			return page.render( destination , { format: 'pdf' });
		}
	);

};
