var nkreep = require( 'nkreep' );
var nkonsole = require( 'nkonsole' );

const MISSION_PICKUP = 'pickup';
const MEAN_PICKUP = 'energyToPickup';
const MISSION_TRANSFERT = 'transfert';
const MEAN_TRANSFERT = "needEnergy";
const MISSION_BUILD = 'build';
const MISSION_WAIT = 'wait';

class nkreepgatherer extends nkreep {

	constructor( creep, nkore ) {
		super( creep, nkore );
		this.gathererCounter = null;
		this.readMemory();

		//this.gathererCounter=Game.creeps[this.me.memory['harvester']];
		if( this.gathererCounter == null ) {
			this.gathererCounter = this.nkore.means.getAvailables( 'gatherer', null, 1 )[ 0 ]
		}
		if( this.gathererCounter != null ) {
			this.resolveMean( 'gatherer', this.gathererCounter )
		}
	}

	scan() {
		if( this.mission == null || this.target == null || this.missionCompleted() ) {
			this.mission = null;
			this.target = null;
			this.searchMission();
		}
		if( this.mission != null && this.target != null ) {
			if( this.mission == MISSION_PICKUP )
				this.nkore.means.addResolver( MEAN_PICKUP, this.target, this.me, this.me.getActiveBodyparts(
					CARRY ) )
			if( this.mission == MISSION_TRANSFERT )
				this.nkore.means.addResolver( MEAN_TRANSFERT, this.target, this.me, this.me.getActiveBodyparts(
					CARRY ) )
		}
		nkonsole.log( this.me.name + ' mission is ' + this.mission + ' ' + this.target, 'nkreepgatherer' )

	}

	missionCompleted() {
		switch( this.mission ) {
		case MISSION_WAIT:
			return true;
		case MISSION_PICKUP:
			if( _.sum( this.me.carry ) == this.me.carryCapacity ) return true;
			if( this.target.carry != null &&
				_.sum( this.target.carry ) == 0
			) return true
			return false
			break;
		case MISSION_TRANSFERT:
			if(	(this.target.energy == null || this.target.energy == this.target.energyCapacity )
			    && (this.target.carry==null || _.sum( this.target.carry ) == this.target.carryCapacity)
			) return true
			if( _.sum( this.carry ) == 0 ) return true
			break;
		}
		return false;
	}
	searchMission() {
		if( _.sum( this.me.carry ) > 0 ) {
			const transferts = this.nkore.means.getAvailables( "needEnergy", null, 1 )
			if( transferts.length == 0 ) {
				nkonsole.log( "no place to transfert energie", "nkreepgatherer" )
				this.mission = MISSION_WAIT
			}
			else {
				this.mission = MISSION_TRANSFERT;
				this.target = transferts[ 0 ];
				//this.nkore.means.addResolver( "needEnergy", this.target, this.me )
				return
			}

		}
		if( _.sum( this.me.carry ) < this.me.carryCapacity ) {
			const energiesToPickup = this.nkore.means.getAvailables( "energyToPickup", null, 1 );
			if( energiesToPickup.length == 0 ) {
				nkonsole.log( "No energy to pickup", "nkreepgatherer" )
			}
			else {
				const energyToPickup = energiesToPickup[ 0 ];
				nkonsole.log( "Energy to pickup : " + energyToPickup, "nkreepgatherer" )
				this.target = energyToPickup;
				this.mission = MISSION_PICKUP
				//sthis.nkore.means.addResolver( "energyToPickup", this.target, this.me )
				return
			}
		}

		/* 
		if( this.mission == null && this.gathererCounter == null ) {
			this.me.memory.role = 'recycled'
		}
		*/
	}

	runPickupEnergy() {
		const energyToPickup = this.target;

		const pickupResult = this.me.pickup( energyToPickup )
		if( pickupResult == ERR_NOT_IN_RANGE || pickupResult ==
			ERR_INVALID_TARGET ) {
			const resultMove = this.me.moveTo( this.target.pos, {
				reusePath: 10
			} )
			nkonsole.log( 'pickingResult(' + pickupResult + ')->move(' + resultMove +
				') to ' + this.target, 'nkreepgatherer' );
			this.me.say( "🚚" )
		}
		else {
			this.me.say( "👌" )
			nkonsole.log( '->pickup=' + pickupResult, 'nkreepgatherer' );
		}
	}
	runWait() {

		let flag = Game.flags.GathererWaitingSpot;
		if( flag == null ) {
			const spawn = this.me.room.find( FIND_MY_SPAWNS )[ 0 ];
			const controller = this.me.room.controller;
			const path = this.me.room.findPath( spawn.pos, controller.pos );
			const pos = path[ Math.floor( path.length * 2 / 5 ) ]
			this.me.room.createFlag( pos.x, pos.y, 'GathererWaitingSpot' );
			flag = Game.flags.GathererWaitingSpot;
		}

		this.me.moveTo( flag, {
			reusePath: 10
		} )

	}
	runTransfertEnergy() {
		if( this.me.transfer( this.target, RESOURCE_ENERGY ) == ERR_NOT_IN_RANGE ) {
			nkonsole.log( '->moveTo target ', 'nkreepgatherer' );
			this.me.say( "🚚" )
			this.me.moveTo( this.target, {
				reusePath: 10
			} );
		}
		else {
			this.me.say( "📤" )
			nkonsole.log( '->transfer energy to target', 'nkreepgatherer' );
		}
	}

	run() {
		this.writeMemory();
		if( super.run() == false ) return false;
		if( this.mission == MISSION_PICKUP ) {
			this.runPickupEnergy()
		}
		if( this.mission == MISSION_TRANSFERT ) {
			this.runTransfertEnergy();

		}
		if( this.mission == MISSION_WAIT ) {
			this.runWait()
		}
		/*if( this.harvester != null && this.me.carry.energy < this.me.carryCapacity ) {
			let energyToPickup;
			if( this.me.memory.droppedenery = !null ) {
				energyToPickup = Game.getObjectById( this.me.memory.droppedenery );
				if( energyToPickup == null ) {
					this.me.memory.droppedenery = null
				}
			}
			if( this.me.memory.droppedenery == null ) {
				energyToPickup = this.harvester.pos.findClosestByRange(
					FIND_DROPPED_ENERGY )
				if( energyToPickup != null ) {
					this.me.memory.droppedenery = energyToPickup.id;
				}
			}

			if( energyToPickup == null ) {
				this.me.moveTo( this.harvester.pos, {
					reusePath: 0
				} )
			}
			else {
				const pickupResult = this.me.pickup( energyToPickup )
				if( pickupResult == ERR_NOT_IN_RANGE || pickupResult ==
					ERR_INVALID_TARGET ) {
					const resultMove = this.me.moveTo( this.harvester.pos, {
						reusePath: 10
					} )
					nkonsole.log( 'pickingResult(' + pickupResult + ')->move(' + resultMove +
						') to ' + this.harvester.name, 'nkreepgatherer' );
					this.me.say( "Move" )
				}
				else {
					this.me.say( "Pickup" )
					nkonsole.log( '->pickup=' + pickupResult, 'nkreepgatherer' );
				}
			}
		}
		else this.me.say( 'nope' )
		if( this.harvester == null ) {
			this.me.memory[ 'role' ] = 'recycled';
			this.me.say( "Suicide" )
		}
		if( this.spawn.energy < this.spawn.energyCapacity && this.me.carry.energy >=

		}
	*/
		return true;
	}
}

module.exports = nkreepgatherer;
