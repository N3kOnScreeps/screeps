///console.log('nkreeps.js')
var nkonsole = require( 'nkonsole' );
class nkreep {
	constructor( creep, nkore ) {

		this.me = creep
		this.nkore = nkore
		this.waitForSpawn = true;
		this.readMemory();
	}
	run() {
		nkonsole.log( this.me.name + ' run', 'nkreep' );
		if( this.waitForSpawn && this.me.spawning ) {
			nkonsole.log( ' ->waitForSpawn' );
			return false;
		}
		if( this.me.memory.role == null )
			this.me.memory.role = 'recycled';
		return true;
		this.writeMemory();
		const energies = findInRange(FIND_DROPPED_ENERGY, 2)
		for(const i in energies){
		    this.me.pickup(energies[i])
		}
	}
	scan() {

	}
	addMean( meanType, mean ) {
		this.nkore.means.addMean( meanType, mean );
	}
	resolveMean( meanType, mean, nb ) {
		this.nkore.means.addResolver( meanType, mean, this.me, nb );
	}
	readMemory() {
		this.mission = this.me.memory.mission;
		this.target = Game.getObjectById( this.me.memory.target );
		this.counter = Game.getObjectById( this.me.memory.counter );
		this.role = this.me.memory.role;
		this.resolveMean( this.role, this.counter )
		if(this.mission!=null)
		this.timeOnThisMission = 1+this.me.memory.timeOnThisMission;
		else 
		    this.timeOnThisMission=0
	}
	writeMemory() {
		this.me.memory.mission = this.mission;
		if( this.target == null )
			this.me.memory.target = null;
		else this.me.memory.target = this.target.id;
		if( this.counter == null )
			this.me.memory.counter = null;
		else
			this.me.memory.counter = this.counter.id;
		this.me.memory.timeOnThisMission=this.timeOnThisMission
	}

	static init( creep, nkore ) {
		const role = ( creep.memory[ 'role' ] != null ) ?
			'nkreep' + creep.memory[ 'role' ] :
			null
		const roleclass = this.getRole( role );
		if( role == null || roleclass == null ) {
			nkonsole.log( 'init:NO ROLE:' + creep.name, 'nkreep' )
			let kreep = new nkreep( creep, nkore );
			return kreep;
		}

		nkonsole.log( 'init:' + role + ':' + creep.name, 'nkreep' )
		let kreep
		try {
			kreep = new roles[ role ]( creep, nkore )
		}
		catch( ex ) {
			nkonsole.log( 'ERREUR AVEC ROLE ' + role, 'catch' )
			throw ex
		}
		return kreep;
	}

	static getRole( role ) {
		if( roles[ role ] == null ) {
			try {
				roles[ role ] = require( role );
			}
			catch( e ) {
				nkonsole.log( 'ERREUR ROLE ' + role, 'catch' )
				throw e
			}
		}
		return roles[ role ];
	}
}

var roles = [];
roles[ 'nkreep' ] = nkreep;
module.exports = nkreep;
