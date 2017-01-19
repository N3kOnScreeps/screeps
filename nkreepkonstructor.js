var nkreep = require( 'nkreep' );
var nkonsole = require( 'nkonsole' );
class nkreepkonstructor extends nkreep {
	constructor( creep, spawn ) {
		super( creep, spawn );
		this.resolveMean( 'spawnExtender', this.spawn.me )
	}
	run() {
		if( super.run() == false ) return false;

		return true;
	}
}

module.exports = nkgatherer;
