var nkreep = require( 'nkreep' );
var nkonsole = require( 'nkonsole' );
class nkreeprecycled extends nkreep {
	constructor( creep, nkore ) {
		super( creep, nkore );
	}
	run() {
		if( super.run() == false ) return false;
		const energyContainer = this.me.pos.findClosestByRange( FIND_MY_SPAWNS );
		const resultRecycle = energyContainer.recycleCreep( this.me );
		if( resultRecycle == ERR_NOT_IN_RANGE ) {
			const moveResult = this.me.moveTo( energyContainer, {
				reusePath: false
			} )
			this.me.say( "😭" )
		}
	}
}

module.exports = nkreeprecycled;
