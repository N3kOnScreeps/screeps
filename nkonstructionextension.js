var nkonstruction = require( 'nkonstruction' );
var nkonsole = require( 'nkonsole' );

class nkonstructionextension extends nkonstruction {
	constructor( objectStructure, room ) {
		nkonsole.log( objectStructure + " initialization...", 'nkonstructionextension' );
		super( objectStructure, room );
		nkonsole.log( this.me + " initialized.", 'nkonstructionextension' );
		let nb = Math.floor( 1 * this.nkore.nkreeps.count(
			'gatherer' ) );

		const nbNeedEnergy = Math.ceil( ( this.me.energyCapacity - this.me.energy ) / 50 )
		if( nbNeedEnergy > 0 ) {
			this.nkore.means.addMean( "needEnergy", this.me, nbNeedEnergy )
		}
		//nkonsole.log( nbNeedEnergy, 'debug' )
	}

	scan() {}
	run() {

	}

}

/** @define {Spawn} */
//nkspawn.prototype.me;
//nkspawn.addRole(nkgatherer)

module.exports = nkonstructionextension;
