//console.log('nkore.js')
var nkonsole = require( 'nkonsole' );
var funGenerator = require( 'funGenerator' );
var nkBodyBuilder = require( 'nkBodyBuilder' );
const debug = false


//console.log('->console')
var nkreeps = require( 'nkreeps' );
//console.log('->kreeps')
//console.log('->konstr')
var nkMeans = require( "nkMeans" );
//console.log('->means')
var nkroom = require( "nkroom" );

class nkore {

	static pause() {
		if(debug){
		nkonsole.log( "===       ===        ===", 'nkore' )
		nkonsole.log( "===      PAUSE       ===", 'nkore' )
		Memory.pause = 1;
		} else {
		    nkonsole.log( "PAUSE prevented", 'nkore' )
		}
	}

	pause() {
		return nkore.pause()
	}

	resume() {
		return nkore.resume()
	}

	static resume() {
		Memory.pause = 0;
		nkonsole.log( "===     =======      ===", 'nkore' )
		nkonsole.log( "=== REQUIRE NKORE.JS ===", 'nkore' )
	}

	constructor() {
		if( Memory.pause != undefined && Memory.pause ) return
		nkonsole.log( "###################", 'nkore' )
		this.nkrooms = [];

		try {
			this.init()
			this.scan()
			this.run()
		}
		catch( ex ) {
			nkonsole.log( ex, 'catch' );
			this.pause();
			console.log( ex, ex.stack )
			if(debug)
			    throw ex;
		}

		nkonsole.log( "###################", 'nkore' )

	}

	init() {
		nkonsole.log( "init()", 'nkore' )

		function analis( vara ) {
			return {
				value: vara
				, type: typeof ( vara )
				, length: vara.length
			}
		}
		nkonsole.log( function () {
			return [
				analis( funGenerator.getCreepyName() )
				, funGenerator.getCreepyName()
				, funGenerator.getCreepyName()
				, funGenerator.getCreepyName(funGenerator.getRoleEmoji('worker'))
				, funGenerator.getCreepyName(funGenerator.getRoleEmoji('gatherer'))
				, funGenerator.getCreepyName(funGenerator.getRoleEmoji('harvester'))
				, funGenerator.getCreepyName(funGenerator.getRoleEmoji('upgrader'))
			]
		}, 'exemple_names' )


        nkonsole.log( function () {
			return {
			    'harvester':nkBodyBuilder.buildBody()
			}
		}, 'exemple_bodys' )

		this.means = new nkMeans();
		this.nkreeps = new nkreeps( this );
		for( var i in Game.rooms ) {
		    try{
			this.nkrooms[ i ] = new nkroom( Game.rooms[ i ], this );
		    } catch(e){
		        nkonsole.log("Erreur dans la room "+i+":"+e+'\n'+e.stack, "catch")   
		        if(debug) throw e
		    }
		}
	}

	scan() {
		nkonsole.log( "scan()", 'nkore' )
		for( var i in this.nkrooms ) {
			try {
				this.nkrooms[ i ].scan();
			}
			catch( ex ) {
				nkonsole.log( ex, 'catch' );
				nkonsole.log( ex.stack, 'catch' );
				this.pause();
				if(debug)
				    throw ex;
				else Game.notify(ex, 60)
				//throw ex;
			}
		}
		this.nkreeps.scan();

	}
	run() {
		nkonsole.log( "run()", 'nkore' )
		const means = this.means;
		this.nkreeps.run();
		for( let i in this.nkrooms ) {
		    try{
			this.nkrooms[ i ].run();
		    }catch(e){
		        nkonsole.log('Erreur avec le run de la room '+i+':'+e, 'catch')
		        if(debug) throw e
		    }
		}

		nkonsole.log( function () {
			return means.beautify()
		}, 'report' );
		nkonsole.log( function () {
			return means.beautify( true )
		}, 'morereport' );
		//console.log('cpu limit GCL : '+Game.cpu.limit, 'nkore')
		//console.log('cpu ticklimit : '+Game.cpu.tickLimit, 'nkore')
		//console.log('cpu bucket : '+Game.cpu.bucket, 'nkore')
	}
	
	debug(){
	    return debug
	}

}

nkore.resume();

module.exports = nkore;
