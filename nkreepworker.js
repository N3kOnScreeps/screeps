var nkreep = require( 'nkreep' );
var nkonsole = require( 'nkonsole' );

const MISSION_PICKUP = 'pickup';
const MEAN_PICKUP = 'energyToPickup';
const MISSION_HARVEST = 'harverst';
const MEAN_HARVEST = 'sources';
const MISSION_TRANSFERT = 'transfert';
const MEAN_TRANSFERT = "needEnergy";
const MISSION_BUILD = 'build';
const MEAN_BUILD = "ConstructionSite"
const MISSION_UPGRADE = 'upgrade';
const MEAN_UPGRADE = "controller"
const MISSION_REPAIR = 'repair';
const MEAN_REPAIR = "needRepair"
const MISSION_WAIT = 'wait';

class nkreepworker extends nkreep {

	constructor( creep, nkore ) {
		super( creep, nkore );
		this.gathererCounter = null;
		this.readMemory();

		//this.gathererCounter=Game.creeps[this.me.memory['harvester']];
		if( this.gathererCounter == null ) {
			this.gathererCounter = this.nkore.means.getAvailables( 'gatherer', null, 1 )[ 0 ]
		}
		if( this.gathererCounter != null ) {
			this.resolveMean( 'worker', this.gathererCounter )
		}
		if(this.me.getActiveBodyparts(WORK)>0){
    		let nb = Math.floor( 0.5 + ( this.me.carryCapacity - _.sum( this.me.carry ) ) / 50 );
    		if( nb > 0 ) {
    			this.nkore.means.addMean( 'needEnergy', this.me, nb );
    		}
		}
	}

	scan() {
		if( this.mission == null || this.target == null || this.missionCompleted() || this.timeOnThisMission>30 ) {
			this.mission = null;
			this.target = null;
			this.timeOnThisMission = 0
			this.searchMission();
		}
		if( this.mission != null && this.target != null ) {
			if( this.mission == MISSION_PICKUP )
				this.nkore.means.addResolver( MEAN_PICKUP, this.target, this.me, this.me.getActiveBodyparts(
					CARRY ) )
			if( this.mission == MISSION_TRANSFERT )
				this.nkore.means.addResolver( MEAN_TRANSFERT, this.target, this.me, this.me.getActiveBodyparts(
					CARRY ) )
			if( this.mission == MISSION_HARVEST )
				this.nkore.means.addResolver( MEAN_HARVEST, this.target, this.me, this.me.getActiveBodyparts(
					WORK ) )
			
		}
		nkonsole.log( this.me.name + ' mission is ' + this.mission + ' ' + this.target, 'nkreepworker' )

	}

	missionCompleted() {
	    if(this.target==null) return true
		switch( this.mission ) {
		case MISSION_WAIT:
			return true;
		case MISSION_UPGRADE:
		    if(this.target.ticksToDowngrade<1000) return false;
		    if( _.sum( this.me.carry ) == 0 ) return true
		    break;
		case MISSION_HARVEST:
			if( this.me.getActiveBodyparts( CARRY ) == 0 )
				return false;
			if( _.sum( this.me.carry ) == this.me.carryCapacity ) return true

		case MISSION_PICKUP:
			if( _.sum( this.me.carry ) == this.me.carryCapacity ) return true;
			if( this.target.carry != null && _.sum( this.target.carry ) == 0 ) return true
			if( this.target.energy != null && _.sum( this.target.energy ) == 0 ) return true
			return false
			break;
		case MISSION_TRANSFERT:
			if( false ||
				this.target.carryCapacity == null ||
				this.target.energy != null && this.target.energy == this.target.energyCapacity ||
				this.target.carry!=nul && _.sum( this.target.carry ) == this.target.carryCapacity 
			) return true
			if( _.sum( this.me.carry ) == 0 ) return true
			break;
		case MISSION_BUILD:
			if( false ||
				this.target.progressTotal != null && this.target.progressTotal > this.target.progress == null
			) return true
			if( _.sum( this.me.carry ) == 0 ) return true
			break;
		}
		return false;
	}
	searchMission() {
		if( _.sum( this.me.carry ) > this.me.carryCapacity*0.3 ) {

			if( this.me.getActiveBodyparts( WORK ) > 0 ) {
			    
				const constructionSites = this.nkore.means.getAvailables( MEAN_BUILD, null, 1 )
				if( constructionSites.length == 0 ) {
					nkonsole.log( "nothing to build", "nkreepworker" )
				}
				else {
					this.mission = MISSION_BUILD;
					this.target = constructionSites[ 0 ];
					this.nkore.means.addResolver( MEAN_BUILD, this.target, this.me )
					return
				}
				/*
				const repairSites = this.nkore.means.getAvailables( MEAN_REPAIR, null, 1 )
				if( repairSites.length == 0 ) {
					nkonsole.log( "nothing to repair", "nkreepworker" )
				}
				else {
					this.mission = MISSION_REPAIR;
					this.target = repairSites[ 0 ];
					this.nkore.means.addResolver( MEAN_REPAIR, this.target, this.me )
					return
				}
				*/
				const controllers = this.nkore.means.getAvailables( MEAN_UPGRADE, null, 1 )
				if( controllers.length == 0 ) {
					nkonsole.log( "no controller to upgrade", "nkreepworker" )
				}
				else {
					this.mission = MISSION_UPGRADE;
					this.target = controllers[ 0 ];
					this.nkore.means.addResolver( MEAN_UPGRADE, this.target, this.me )
					return
				}
                
                /*const transferts = this.nkore.means.getAvailables( "needEnergy", null, 1 )
				if( transferts.length == 0 ) {
					nkonsole.log( "no place to transfert energie", "nkreepworker" )
				}
				else {
					this.mission = MISSION_TRANSFERT;
					this.target = transferts[ 0 ];
					//this.nkore.means.addResolver( "needEnergy", this.target, this.me )
					return
				}*/
			}
			else {
				const transferts = this.nkore.means.getAvailables( "needEnergy", null, 1 )
				if( transferts.length == 0 ) {
					nkonsole.log( "no place to transfert energie", "nkreepworker" )
				}
				else {
					this.mission = MISSION_TRANSFERT;
					this.target = transferts[ 0 ];
					//this.nkore.means.addResolver( "needEnergy", this.target, this.me )
					return
				}
			}

		}
		if( _.sum( this.me.carry ) < this.me.carryCapacity ) {
		    if(this.nkore.means.isResolved('needEnergy', this.me)){
		        //this.mission=MISSION_WAIT
		        //return;
		    }
		      
		        
			const energiesToPickup = this.nkore.means.getAvailables( "energyToPickup", null, 1 );
			if( energiesToPickup.length == 0 ) {
				nkonsole.log( "No energy to pickup", "nkreepworker" )
			}
			else {
				const energyToPickup = energiesToPickup[ 0 ];
				nkonsole.log( "Energy to pickup : " + energyToPickup, "nkreepworker" )
				this.target = energyToPickup;
				this.mission = MISSION_PICKUP
				//this.nkore.means.addResolver( "energyToPickup", this.target, this.me )
				return
			}

			const sources = this.nkore.means.getAvailables( "sources", null, 1 );
			if( sources.length == 0 ) {
				nkonsole.log( "No source to pickup", "nkreepworker" )
			}
			else {
				const source = sources[ 0 ];
				nkonsole.log( "Energy to pickup : " + source, "nkreepworker" )
				this.target = source;
				this.mission = MISSION_HARVEST
				//this.nkore.means.addResolver( "sources", this.target, this.me )
				return
			}
			

		}

		if( this.mission == null && this.gathererCounter == null ) {
			//this.me.memory.role = 'recycled'
		}
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
				') to ' + this.target, 'nkreepworker' );
			this.me.say( "🚚" )
		}
		else {
			this.me.say( "👌" )
			nkonsole.log( '->pickup=' + pickupResult, 'nkreepworker' );
		}
	}

	runHarvestEnergy() {
		const energyToharvestup = this.target;

		const harvestupResult = this.me.harvest( energyToharvestup )
		if( harvestupResult == ERR_NOT_IN_RANGE || harvestupResult ==
			ERR_INVALID_TARGET ) {
			const resultMove = this.me.moveTo( this.target.pos, {
				reusePath: 10
			} )
			nkonsole.log( 'harvestingResult(' + harvestupResult + ')->move(' + resultMove +
				') to ' + this.target, 'nkreepworker' );
			this.me.say( "🚚" )
		}
		else {
			this.me.say( "⛏" );
			nkonsole.log( '->harvestup=' + harvestupResult, 'nkreepworker' );
		}
	}
	runWait() {
	    this.me.say("💤")
        /*
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
		*/
	}
	runTransfertEnergy() {
		if( this.me.transfer( this.target, RESOURCE_ENERGY ) == ERR_NOT_IN_RANGE ) {
			nkonsole.log( '->moveTo target ', 'nkreepworker' );
			this.me.say( "🚚" )
			this.me.moveTo( this.target, {
				reusePath: 10
			} );
		}
		else {
			this.me.say( "📤️" )
			nkonsole.log( '->transfer energy to target', 'nkreepworker' );
		}
	}
	runBuild() {
		if( this.me.build( this.target, RESOURCE_ENERGY ) == ERR_NOT_IN_RANGE ) {
			nkonsole.log( '->moveTo target ', 'nkreepworker' );
			this.me.say( "🚚" )
			this.me.moveTo( this.target, {
				reusePath: 10
			} );
		}
		else {
			this.me.say( "🔨" )
			nkonsole.log( '->transfer energy to target', 'nkreepworker' );
		}
	}
	runUpgrade() {
		if( this.me.upgradeController( this.target, RESOURCE_ENERGY ) == ERR_NOT_IN_RANGE ) {
			nkonsole.log( '->moveTo target ', 'nkreepworker' );
			this.me.say( "🚚" )
			this.me.moveTo( this.target, {
				reusePath: 10
			} );
		}
		else {
			this.me.say( "🙏" )
			nkonsole.log( '->transfer energy to target', 'nkreepworker' );
		}
	}
    runRepair() {
		if( this.me.repair( this.target, RESOURCE_ENERGY ) == ERR_NOT_IN_RANGE ) {
			nkonsole.log( '->moveTo target ', 'nkreepworker' );
			this.me.say( "🚚" )
			this.me.moveTo( this.target, {
				reusePath: 10
			} );
		}
		else {
			this.me.say( "🔨" )
			nkonsole.log( '->transfer energy to target', 'nkreepworker' );
		}
	}

	run() {
	    if(!super.run())return false;
		this.writeMemory();
		if( super.run() == false ) return false;
		if( this.mission == MISSION_PICKUP ) {
			this.runPickupEnergy()
		}
		if( this.mission == MISSION_HARVEST ) {
			this.runHarvestEnergy()
		}
		if( this.mission == MISSION_TRANSFERT ) {
			this.runTransfertEnergy();

		}
		if( this.mission == MISSION_BUILD ) {
			this.runBuild();

		}
		if( this.mission == MISSION_UPGRADE ) {
			this.runUpgrade();
		}
		if( this.mission == MISSION_REPAIR ) {
			this.runRepair();
		}
		
		
		if( this.mission == MISSION_WAIT ) {
			this.runWait()
		}
		return true;
	}
}

module.exports = nkreepworker;
