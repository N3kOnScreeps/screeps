var nkonstruction = require( 'nkonstruction' );
var nkonsole = require( 'nkonsole' );

class nkonstructioncontroller extends nkonstruction {
	constructor( objectStructure, room ) {
		nkonsole.log( objectStructure + " initialization...", 'nkonstructioncontroller' );
		super( objectStructure, room );
		nkonsole.log( this.me + " initialized.", 'nkonstructioncontroller' );
		let nb = Math.floor( 1 * this.nkore.nkreeps.count(
			'gatherer' ) );
		if( this.nkore.nkreeps.count( 'gatherer' ) > 1 && nb > 1 )
			this.nkore.means.addMean( 'controller', this.me, nb );

	}

	scan() {}
	run() {

	}

}

/** @define {Spawn} */
//nkspawn.prototype.me;
//nkspawn.addRole(nkgatherer)

module.exports = nkonstructioncontroller;
