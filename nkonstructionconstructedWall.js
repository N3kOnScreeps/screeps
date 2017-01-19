var nkonstruction = require( 'nkonstruction' );
var nkonsole = require( 'nkonsole' );

class nkonstructionconstructedWall extends nkonstruction {
	constructor( objectStructure, room ) {
		super( objectStructure, room );
		this.room.maxWallHit= Math.max(this.me.hits,this.room.maxWallHit )
		const nbNeedRepair =  Math.ceil( ( this.room.maxWallHit+100-this.me.hits ) / 100 )
		nkonsole.log( 'room.maxWallHit : '+this.room.maxWallHit, 'nkonstructionconstructedWall' )    
        if( nbNeedRepair > 0 ) {
		    nkonsole.log( 'I need repair : '+nbNeedRepair, 'nkonstructionconstructedWall' )    
			this.nkore.means.addMean( "needRepair", this.me, nbNeedRepair )
		}
		
	}
}

/** @define {Spawn} */
//nkspawn.prototype.me;
//nkspawn.addRole(nkgatherer)

module.exports = nkonstructionconstructedWall;
