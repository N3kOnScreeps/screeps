//console.log('nkonstruction.js')
var nkonsole = require( 'nkonsole' );

class nkonstruction {
	constructor( objectStructure, room ) {
		nkonsole.log( objectStructure + ' init', 'nkonstruction' );
		this.me = objectStructure
		this.room = room
		this.nkore = room.nkore
		if(this.room.me.memory.structures[this.me.id]==null){
		    this.room.me.memory.structures[this.me.id]={}
		}
		this.me.memory = this.room.me.memory.structures[this.me.id];
		 this.room.me.WALL_HITS_MAX = Math.max(this.me.hitsMax)
		if(this.me.structureType!=STRUCTURE_WALL){
    		const nbNeedRepair =  Math.ceil( ( this.me.hitsMax-this.me.hits ) / 100 )//Math.min(2,)
    		if( nbNeedRepair > 0 ) {
    		    nkonsole.log( 'I need repair : '+nbNeedRepair, 'nkonstruction' )    
    			this.nkore.means.addMean( "needRepair", this.me, nbNeedRepair )
    		}
		}
	}
	scan() {
        
	}

	run() {
		nkonsole.log( this.me + ' run', 'nkonstruction' );
		this.me.memory = Memory.structures[this.me.id];
		this.me.memory;
		return true;
	}
	addMean( meanType, mean ) {
		this.nkore.means.addMean( meanType, mean );
	}
	resolveMean( meanType, mean ) {
		this.nkore.means.addResolver( meanType, mean, this.me );
	}

}

//nkonstruction.addRole( nkonstruction );
module.exports = nkonstruction;
