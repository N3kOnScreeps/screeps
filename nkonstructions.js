var nkonsole = require( 'nkonsole' );
var nkonstruction = require( 'nkonstruction' );
//var nkspawn=require("nkgatherer");
/**
 * @constructor
 * @param {Spawn} spawn the spawn object
 */
class nkonstructions {
	constructor( room ) {
		nkonsole.log( "Konstructions initialization...", 'nkonstructions' );
		this.nkore = room.nkore;
		this.room = room;
		this.konstructions = [];
        if(room.me.memory.structures==null)
            room.me.memory.structures={}
        
		//const objectsStructures = _.extend(,Game.constructionSites)
		//nkonsole.log( "Konstructions found : "+objectsStructures.length, 'nkonstructions' );
        
        const structures = this.room.me.find(FIND_STRUCTURES)
		
		for( const i in structures) {
			if(structures[ i ].my != true
			&& structures[i].structureType!='road'
			&& structures[i].structureType!='constructedWall'
			|| this.room.me.controller==null ||this.room.me.controller.my==false
			) continue;
			const konstruct = structures[ i ];
			let nkkonstruct = this.init( konstruct );
			this.addKonstruct( nkkonstruct );
		}
		
	

		nkonsole.log( "Konstructions initialized.", 'nkonstructions' );
	}

	scan() {
		nkonsole.log( "konstructions scan...", 'nkonstructions' );
		for( let rol in this.konstructions ) {
			for( let i in this.konstructions[ rol ] ) {
				var konstruction = this.konstructions[ rol ][ i ]
				if( konstruction == null ) continue;
				konstruction.scan();
			}
		}
		nkonsole.log( "konstructions scan end.", 'nkonstructions' );
	}

	run() {
		nkonsole.log( "konstructions run...", 'nkonstructions' );
		for( let rol in this.konstructions ) {
			for( let i in this.konstructions[ rol ] ) {
				var konstruction = this.konstructions[ rol ][ i ]
				if( konstruction == null ) continue;
				konstruction.run();
			}
		}
		
		nkonsole.log( "konstructions run end.", 'nkonstructions' );
	}
	
	saveMemory() {
		nkonsole.log( "konstructions run...", 'nkonstructions' );
		for( let rol in this.konstructions ) {
			for( let i in this.konstructions[ rol ] ) {
				var konstruction = this.konstructions[ rol ][ i ]
				if( konstruction == null ) continue;
				konstruction.saveMemory();
			}
		}
		
		nkonsole.log( "konstructions run end.", 'nkonstructions' );
	}

	addKonstruct( kreep ) {
		var role = kreep.me.structureType;
		if( role == null ) {
			role = 'nkonstructions';
		}
		if( this.konstructions[ role ] == null ) this.konstructions[ role ] = [];
		this.konstructions[ role ].push( kreep )
	}

	init( konstruction ) {
		const role = konstruction.structureType;

		/*if( role == null ) {
			nkonsole.log( 'init:NO ROLE:' + konstruction.name, 'nkonstructions' )
			let kreep = new nkonstruction( konstruction, this.room );
			return kreep;
		}*/
		if( roles[ role ] == null ) {
			try {
				roles[ role ] = require( 'nkonstruction' + role );
			}
			catch( e ) {
				nkonsole.log( 'ERREUR NKONSTRUCTION NON DECLARE ' + role + ' "' + e.message + '"'
					, 'nkonstructions' )
				nkonsole.log( e+'\n\n'+e.innerException, 'catch' );
				const kreep = new nkonstruction( konstruction, this.room )
				return kreep
			}
		}
		nkonsole.log( 'init:' + role + ':' + konstruction.id, 'nkonstructions' )
		const kreep = new roles[ role ]( konstruction, this.room )
		return kreep;
	}

}

var roles;
if( roles != null ) {
	for( const i in roles ) {
		console.log( "#REQUIRE RESET " + i );
		delete require.cache[ i ]
	}
}
roles = [];

module.exports = nkonstructions;
