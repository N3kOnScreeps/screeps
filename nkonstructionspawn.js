var nkonstruction = require( 'nkonstruction' );
var nkonsole = require( 'nkonsole' );
var funGenerator = require( 'funGenerator' );

class nkonstructionspawn extends nkonstruction {
	constructor( objectStructure, room ) {
		nkonsole.log( objectStructure.name + " initialization...", 'nkonstructionspawn' );
		super( objectStructure, room )
		nkonsole.log( this.me + " initialized.", 'nkonstructionspawn' );
		this.creepToCreate = null;
		if( this.me.energyCapacity - this.me.energy > 50 ) {
			this.nkore.means.addMean( 'needEnergy', objectStructure, Math.ceil( ( this.me.energyCapacity -
				this.me.energy ) / 50 ) )
		}
	}
	scan() {
		super.scan();

	}
	run() {
		const log = function ( arr, name ) {
			const _arr = arr;
			const _name = name;
			nkonsole.log( function () {
				return 'NKSpawn added ' + _arr.length + ' build-' + _name + ' means'
			}, 'nkonstructionspawn' )
			return;
		};
		const availablesSources = this.nkore.means.getAvailables( 'sources' );
		this.nkore.means.addMeans( 'build-sources', availablesSources );
		log( availablesSources, 'sources' )
		const availablesGatherers = this.nkore.means.getAvailables( 'gatherer' )
		this.nkore.means.addMeans( 'build-gatherer', availablesGatherers );
		log( availablesGatherers, 'gatherers' )
		const availablesWorker = this.nkore.means.getAvailables( 'worker' )
		this.nkore.means.addMeans( 'build-worker', availablesWorker );
		//log( availablesWorker, 'workers' )
		//const avaiilableControllers = this.nkore.means.getAvailables( 'controller' )
		//this.nkore.means.addMeans( 'build-controller', avaiilableControllers );
		//log( avaiilableControllers, 'controllers' )

		//this.scanController()
		this.scanGatherers();
		this.scanSources();
		this.scanWorkers()
		nkonsole.log( 'Planned Creep : ' + this.creepToCreate, 'nkonstructionspawn' )

		nkonsole.log( this.me.name + " run...", 'nkonstructionspawn' );
		nkonsole.log( "energie : " + this.me.energy, 'nkonstructionspawn' );

		if( this.creepToCreate != null ) {
			const resultCreate = this.createKreep( this.creepToCreate.role, this.creepToCreate.body, this.creepToCreate
				.datas )
		}

		nkonsole.log( this.me.name + " run end.", 'nkonstructionspawn' );
	}
	createKreep( role, body, datas ) {
		nkonsole.log( 'Creating creep', 'nkonstructionspawn' );
		if( datas == null ) datas = {};
		datas.role = role;
		//datas.spawn = this.me.id;

		const canCreateResult = this.me.canCreateCreep( body )
		if( OK == canCreateResult ) {
			//TODO Name with function
			const name= this.me.createCreep( body, funGenerator.getCreepyName(funGenerator.getRoleEmoji(role)), datas );
			Game.creeps[name].say("*"+funGenerator.getRoleEmoji(role)+"*")
			return name
		}
		else return canCreateResult
	}
/*	addKreep( kreep ) {
		var role = kreep.me.memory[ "role" ];
		if( role == null ) {
			role = 'nkreep';
		}
		if( this.kreeps[ role ] == null ) this.kreeps[ role ] = [];
		this.kreeps[ role ].push( kreep )
	}*/
	scanSources() {
		if( this.creepToCreate != null ) return;
		const availableSources = this.nkore.means.getAvailables( 'build-sources' );
		let source = null;
		for( var i in availableSources ) {
			if( availableSources[ i ].room.id == this.me.room.id ) {
				source = availableSources[ i ];
				break
			}
		}
		if( source != null && this.me.canCreateCreep( [ WORK, WORK, MOVE ] ) == OK ) {
			this.creepToCreate = {
				role: 'harvester'
				, body: [ WORK, WORK, MOVE ]
				, datas: {
					source: source.id
					, counter: this.me.room.controller.id
				}
			};
			nkonsole.log( 'Creating harvester for source ' + source.id, 'nkonstructionspawn' );
			this.resolveMean( 'build-sources', source );
		}
	}
	scanGatherers() {
		if( this.creepToCreate != null ) return;
		let harvester = null;
		const availableGatherers = this.nkore.means.getAvailables( 'build-gatherer' );
		for( var i in availableGatherers ) {
			if( availableGatherers[ i ].room.id == this.me.room.id ) {
				harvester = availableGatherers[ i ];
				break
			}
		}
		if( harvester != null && this.me.canCreateCreep( [ CARRY, MOVE ] ) == OK ) {
			this.creepToCreate = {
				role: 'gatherer'
				, body: [ CARRY, MOVE, CARRY, MOVE ]
				, datas: {
					counter: this.me.room.controller.id
				}
			};
			nkonsole.log( 'Creating gatherer for harverster ' + harvester.id, 'nkonstructionspawn' );
			this.resolveMean( 'build-harvesters', harvester );
		}
	}
	scanController() {
		if( /*this.nkore.nkreeps.count( 'gatherer' ) < 1 ||*/ this.creepToCreate != null ) return;
		let controller = null;
		const availableControllers = this.nkore.means.getAvailables( 'build-controller' );
		for( var i in availableControllers ) {
			if( availableControllers[ i ].room.id == this.me.room.id ) {
				controller = availableControllers[ i ];
				break
			}
		}
		if( controller != null && this.me.canCreateCreep( [ WORK, CARRY, MOVE ] ) == OK ) {
			this.creepToCreate = {
				role: 'worker'
				, body: [ WORK, CARRY, MOVE ]
				, datas: {
					controller: controller.id
					, counter: controller.id
				}
			};
			nkonsole.log( 'Creating upgrader for controller ' + controller.id, 'nkonstructionspawn' );
			this.resolveMean( 'build-controller', controller );
		}
	}

	scanWorkers() {
		if( /*this.nkore.nkreeps.count( 'gatherer' ) < 1 ||*/ this.creepToCreate != null ) return;
		let worker = null;
		const availableworkers = this.nkore.means.getAvailables( 'build-worker' );
		for( var i in availableworkers ) {
			if( availableworkers[ i ].room.id == this.me.room.id ) {
				worker = availableworkers[ i ];
				break
			}
		}
		if( worker != null && this.me.canCreateCreep( [ WORK, CARRY, MOVE ] ) == OK ) {
			this.creepToCreate = {
				role: 'worker'
				, body: [ WORK, CARRY, MOVE ]
				, datas: {
					worker: worker.id
					, counter: this.me.room.controller.id
				}
			};
			nkonsole.log( 'Creating upgrader for worker ' + worker.id, 'nkonstructionspawn' );
			this.resolveMean( 'build-worker', worker );
		}
	}

}

/** @define {Spawn} */
//nkspawn.prototype.me;
//nkspawn.addRole(nkgatherer)

module.exports = nkonstructionspawn;
