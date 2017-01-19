var nkonsole = require( 'nkonsole' );
var Nkreep = require( 'nkreep' );
//var nkspawn=require("nkgatherer");
/**
 * @constructor
 * @param {Spawn} spawn the spawn object
 */
class nkreeps {
	constructor( nkore ) {
		nkonsole.log( "Kreeps initialization...", 'kreeps' );
		this.nkore = nkore
		this.kreeps = [];
		for( var name in Memory.creeps ) {
			const creep = Game.creeps[ name ]
			if( creep != null ) {
				let kreep = Nkreep.init( creep, nkore )
				this.addKreep( kreep )
			}
			else {
				delete Memory.creeps[ name ];
				nkonsole.log( 'deleting ' + name + " memory", 'kreeps' )
			}
		}

		nkonsole.log( "Kreeps initialized.", 'kreeps' );
	}
	scan() {
		nkonsole.log( "Kreeps scan...", 'kreeps' );
		for( let rol in this.kreeps ) {
			for( let i in this.kreeps[ rol ] ) {
				var kreep = this.kreeps[ rol ][ i ]
				if( kreep == null ) continue;
				try{
				    kreep.scan();
			    }catch(e){
				    throw 'Erreur avec '+rol+':'+i+':'+e
				}
			}
		}
		nkonsole.log( "Kreeps scan end.", 'kreeps' );
	}
	run() {
		nkonsole.log( "Kreeps run...", 'kreeps' );
		for( let rol in this.kreeps ) {
			for( let i in this.kreeps[ rol ] ) {
				var kreep = this.kreeps[ rol ][ i ]
				if( kreep == null ) continue;
				try{
				    kreep.run();
				}catch(e){
				    throw 'Erreur avec '+rol+':'+i+':'+e
				}
			}
		}
		nkonsole.log( "Kreeps run end.", 'kreeps' );
	}

	addKreep( kreep ) {
		var role = kreep.me.memory[ "role" ];
		if( role == null ) {
			role = 'nkreep';
		}
		if( this.kreeps[ role ] == null ) this.kreeps[ role ] = [];
		this.kreeps[ role ].push( kreep )
	}
	count( role, func ) {
		if( this.kreeps[ role ] == null ) return 0;
		if( func == null ) func = function () {
			return 1
		}
		let ret = 0;
		for( const creep in this.kreeps[ role ] ) {
			ret += func( this.kreeps[ role ][ creep ] )
		}
		return ret
	}
}

/** @define {Spawn} */
//nkspawn.prototype.me;
//nkspawn.addRole(nkgatherer)
module.exports = nkreeps;
