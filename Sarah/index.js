var config = require(__dirname+'/config.js');

//initialize Google Datastore Node.js client library
const Datastore = require('@google-cloud/datastore');
const datastore = new Datastore({
	projectId: porn.GDatastoreProjectId
});

class Sarah {
	constructor(opts) {

  }

  response(inputAlias) {
  	this.getInputFromAlias(inputAlias)
  		.then(input => this.getOutputFromInput(input))
  		.then(output => this.getAliasFromOutput(output))
  		.then(alias => {
  			console.log(alias);
  		})
  }
  
  getInputFromAlias(inputAlias) {
  	return new Promise((resolve, reject)=>{
  		let query = datastore
  			.createQuery('InputAlias')
  			.filter('InputAlias', '=', inputAlias.toLowerCase());

  		datastore.runQuery(query).then(results => {
		  	if(results.length < 1)
		  		reject();
		  	else
		  		resolve(results[0][0].Input);
  		});

  	});
  }

  getOutputFromInput(input) {
  	return new Promise((resolve, reject)=>{
  		let query = datastore
  			.createQuery('DirectResponse')
  			.filter('Input', '=', input.toLowerCase());

  		datastore.runQuery(query).then(results => {
		  	if(results.length < 1)
		  		reject();
		  	else
		  		resolve(results[0][0].Output);
  		});
  	});
  	

  	
  }

  getAliasFromOutput(output) {
  	console.log(output);
  	return new Promise((resolve, reject)=>{
  		let query = datastore
  			.createQuery('OutputAlias')
  			.filter('Output', '=', output.toLowerCase());

  		datastore.runQuery(query).then(results => {
		  	if(results.length < 1)
		  		reject();
		  	else
		  		resolve(results[0].map(o => o.OutputAlias));
  		});
  	});
  	

  	
  }
}

module.exports = new Sarah();
