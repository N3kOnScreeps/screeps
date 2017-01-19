var nkreep = require( 'nkreep' );
var nkonsole = require( 'nkonsole' );

class nkreepupgrader extends nkreep {
	constructor( creep, nkore ) {
		super( creep, nkore );

		this.controller = Game.getObjectById( this.me.memory[ 'controller' ] );
		if( this.controller == null ) {
			this.controller = this.me.room.controller;
			this.me.memory[ 'controller' ] = this.controller

		}
		let nb = Math.floor( 0.5 + ( this.me.carryCapacity - _.sum( this.me.carry ) ) / 50 );
		if( nb > 0 ) {
			this.nkore.means.addMean( 'needEnergy', this.me, nb );
		}

	}

	scan() {
		super.scan()

		if( this.me.memory.upgrading != true &&
			this.me.spawning == false &&
			this.nkore.means.isResolved( 'controller', this.controller )
		) {
			nkonsole.log( "ITS CRAZY MOTHER FUCKER", "debug" )
			this.me.memory.role = 'recycled';
		}
		else {
			this.resolveMean( 'controller', this.controller )
		}

	}

	run() {
		if( super.run() == false ) return false;
		if( this.me.memory.role == 'recycled' ) return false;
		const energyContainer = this.me.pos.findClosestByRange( FIND_MY_SPAWNS );
		//if(this.me.memory.upgrading==null)
		//	this.me.memory.upgrading=false;
		nkonsole.log( 'container : ' + energyContainer, 'nkreepupgrader' )
		nkonsole.log( 'upgrading ? : ' + this.me.memory.upgrading, 'nkreepupgrader' )
		if( this.me.carry.energy == 0 ) {
			this.me.memory.upgrading = false;
		}
		if( energyContainer != null &&
			this.me.carry.energy < this.me.carryCapacity &&
			this.me.memory.upgrading != true ) {

			const getResult = energyContainer.transferEnergy( this.me )
			if( getResult == ERR_NOT_IN_RANGE || getResult ==
				ERR_INVALID_TARGET ) {
				const resultMove = this.me.moveTo( energyContainer.pos, {
					reusePath: false
				} )
				nkonsole.log( 'pickingResult(' + getResult + ')->move(' + resultMove +
					') to ' + energyContainer.name, 'nkreepupgrader' );
				this.me.say( "Move" )
			}
			else {
				this.me.say( "Pickup" )
				nkonsole.log( '->pickup=' + getResult, 'nkreepupgrader' );
			}

		}
		else {
			if( this.me.carry.energy == this.me.carryCapacity ) {
				this.me.memory.upgrading = true;
			}
			this.me.say( 'nope' )
			if( this.controller == null ) {
				//this.me.memory[ 'role' ] = 'recycled';
				this.me.say( "Suicide" )
			}
			if( this.me.memory.upgrading == true ) {
				if( this.me.upgradeController( this.controller ) == ERR_NOT_IN_RANGE ) {
					nkonsole.log( '->moveTo Controller', 'nkreepupgrader' );
					this.me.say( "Move" )
					this.me.moveTo( this.controller );
				}
				else {
					this.me.say( "Upgrade" )
					nkonsole.log( '->upgrade controller', 'nkreepupgrader' );
				}
			}

		}
	}
}
module.exports = nkreepupgrader;
