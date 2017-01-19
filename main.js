//console.log('main.js')

var nkcore = require( "nkore" );
var nkonsole = require( 'nkonsole' );
module.exports.loop = function () {
	//Initialisation des objets
	let core = new nkcore();
	Game[ "nk" ] = core;
};
