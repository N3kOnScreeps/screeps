//console.log('nkrooms.js')

const nkMeans = require( "nkMeans" );
const nkonsole = require( 'nkonsole' );
//const Nkreep = require( 'nkreep' );
const nkonstructions = require( 'nkonstructions' );
const nkways = require( 'nkways' );

class map {
	constructor( obj ) {
		this.matrix = [];
		for( const x in obj ) {
			this.matrix[ x ] = [];
			for( const y in obj[ x ] ) {
				this.matrix[ y ] = obj[ x ][ y ];
			}
		}
	}
	set( x, y, name, val ) {
		if( this.matrix[ x ] == null )
			this.matrix[ x ] = []
		if( this.matrix[ x ][ y ] == null )
			this.matrix[ x ][ y ] = {}
		this.matrix[ x ][ y ][ name ] = val
	}
	get( x, y, name, val ) {
		if( this.matrix[ x ] == null )
			this.matrix[ x ] = []
		if( this.matrix[ x ][ y ] == null )
			this.matrix[ x ][ y ] = {}
		this.matrix[ x ][ y ][ name ] = val
	}
	save() {
		let obj = []

	}
}

class nkroom {
	constructor( room, nkore ) {
		nkonsole.log( room.name + " initialization...", 'room' );
		this.nkore = nkore;
		this.me = room;
		this.means = nkore.means
		this.maxWallHit = this.me.memory.maxWallHit;
		
		this.nkonstructions = new nkonstructions( this );
		this.structures = _.filter( Game.structures, function ( v ) {
			return v.room.id == room.id
		} );
		
		//this.ways = new nkways( this );
		nkonsole.log( this.me.name + " initialized.", 'room' );

		this.build = this.getBuilds();
		this.hostiles = this.getHostiles();
		//this.initMap();
	}
	initMap() {
		//		if(this.me.memory.map!=null)
		this.map = new map( this.me.memory.map )
	}
	saveMap() {
		if( this.map != null ) {
			this.me.memory.map = this.map.save();
		}
	}
	scan() {
	    this.scanHostikes();
		this.scanSources();
		this.scanEnergyToPickup()
		this.scanConstructionSite()
		let nbsources = Math.floor( 1 * this.me.memory.sources.length )
		if( nbsources > 0 )
			this.nkore.means.addMean( 'harvester', this.me.controller, nbsources * 2 );

		const nbharvesters = Math.floor(this.nkore.nkreeps.count( 'harvester' )*1.34)
		
		if( nbharvesters > 0 )
			this.nkore.means.addMean( 'gatherer', this.me.controller, nbharvesters );
		//*
		let nbgatherer = this.nkore.nkreeps.count( 'gatherer' )
			
			//if( Math.floor(nbgatherer/2) > 0 && this.nkore.means.getAvailables("ConstructionSite", null, 1).length>=1 )
		this.nkore.means.addMean( 'worker', this.me.controller, Math.ceil(nbgatherer) );
		//*/
		this.nkonstructions.scan();
	}

	run() {
		this.me.memory.maxWallHit = this.maxWallHit;
       
		this.nkonstructions.run();
		//this.saveMap();
	}

	scanEnergyToPickup() {
		const droppedEnergies = this.me.find( FIND_DROPPED_ENERGY )
		for( var i in droppedEnergies ) {
			const droppedEnergy = droppedEnergies[ i ];
			nkonsole.log( droppedEnergy, 'room' );
			let nb = Math.floor( droppedEnergy.amount / 50 )
			if( nb > 0 )
				this.nkore.means.addMean( "energyToPickup", droppedEnergy, nb )
		}
	}

	scanConstructionSite() {
		this.nkore.means.addMeans( 'ConstructionSite', Game.constructionSites, 1 )
	}
	scanHostikes() {
		this.nkore.means.addMeans( 'hostile', this.hostiles, 1 )
	}

	scanSources() {
		const roomSourcesFiltered = [];
		if( this.me.memory.sources == null || this.me.memory.sources.length == 0 || this.me.memory.sources
			.length == null || this.me.memory.sourcesTick == null || Game.time - this.me.memory.sourcesTick >
			30 ) {
			const roomSources = this.me.find( FIND_SOURCES );
			nkonsole.log( 'sources:' + roomSources.length, 'room' );
			for( const i in roomSources ) {
				nkonsole.log( ' +source:' + roomSources[ i ].id, 'room' );
				let hostileCreep = roomSources[ i ].pos.findInRange( FIND_HOSTILE_CREEPS
					, 15 )[ 0 ]
				let hostileSpawn = roomSources[ i ].pos.findInRange( FIND_HOSTILE_SPAWNS
					, 15 )[ 0 ]
				if( hostileCreep != null || hostileSpawn != null ) {
					let creepid = '';
					let spawnid = '';
					if( hostileCreep != null ) {
						this.means.addMean( 'hostile', hostileCreep );
						creepid = hostileCreep.id;
					}
					if( hostileSpawn != null ) {
						//this.means.addMean( 'hostile', hostileSpawn );
						spawnid = hostileSpawn.id;
					}
					nkonsole.log( ' =>hostile ' + creepid + ' ' + spawnid, 'room' );
					continue
				}
				nkonsole.log( ' =>ok', 'room' );
				roomSourcesFiltered.push( roomSources[ i ] )
			}
			this.me.memory.sources = {};
			let length = 0;

			this.me.memory.sourcesTick = Game.time;
			for( const i in roomSourcesFiltered ) {
				nkonsole.log( ' =>saved:' + roomSourcesFiltered[ i ], 'room' );

				this.me.memory.sources[ 'source' + i ] = roomSourcesFiltered[ i ].id;
				length++;
			}
			this.me.memory.sources.length = length;
		}
		else {
			let me = this.me
			nkonsole.log( function () {
				return 'sources from memory:' + me.memory.sources.length + ' since ' + ( Game.time - me.memory
					.sourcesTick )
			}, 'room' );

			for( var i in this.me.memory.sources ) {
				const source = Game.getObjectById( this.me.memory.sources[ i ] );
				if( source != null ) {
					nkonsole.log( "OK:" + source, 'nkroom' )
					roomSourcesFiltered.push( source )
				}
			}
			//roomSourcesFiltered
		}
		nkonsole.log({roomSourcesFiltered:Object.keys(roomSourcesFiltered)}, 'nkroom')
		this.means.addMeans( 'sources', roomSourcesFiltered, 2 );
		//this.means.addMeans( 'buildRoute', roomSourcesFiltered, 2 );
		//this.ways.add
	}
    getHostiles(){
        let ret = this.me.find( FIND_CREEPS ).filter(function(val){
            return val.my == false
        })
        ret=ret.concat(this.me.find( FIND_HOSTILE_CREEPS))
		//ret=ret.concat(this.me.find( FIND_HOSTILE_SPAWNS ))
		return ret;
    }
    /*
    getRoads(){
        let ret=this.me.memory.roads
        if(ret==null || this.me.memory.roadsTick==null ||Game.time-this.me.memory.roadsTick > 20 ){
        let ret = this.me.find( FIND_CREEPS ).filter(function(val){
            return val.my == false
        })
        ret=ret.concat(this.me.find( FIND_HOSTILE_CREEPS))
		//ret=ret.concat(this.me.find( FIND_HOSTILE_SPAWNS ))
        }
		return ret;
    }
    */
	getBuilds() {
		const lvl = this.me.controller.level;
		//nkonsole.log( "Constroller level " + lvl, 'nkroom' );
		const buildstruct = [];
		let me = this.me
		for( const struct in CONTROLLER_STRUCTURES ) {
			var nb = CONTROLLER_STRUCTURES[ struct ][ lvl ] - _.filter( this.structures
					, function ( v, k ) {
						return v.structureType === struct;
					}
				)
				.length;
			if( nb == 0 ) continue;
			//nkonsole.log( "Can build " + nb + " " + struct, 'nkroom' );
			buildstruct[ struct ] = nb;
		}
		return buildstruct;
	}

}

/** @define {Spawn} */
//nkspawn.prototype.me;
//nkspawn.addRole(nkgatherer)
module.exports = nkroom;
