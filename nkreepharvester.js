var nkreep = require( 'nkreep' );
var nkonsole = require( 'nkonsole' );
class nkreepharvester extends nkreep {
	constructor( creep, nkore ) {
		nkonsole.log( 'Initialisation du mineur ' + creep.name, 'nkreepharvester' );

		super( creep, nkore );
		this.source = null;
		const sourceid = this.me.memory[ 'source' ];
		if( sourceid != null ) {
			this.source = Game.getObjectById( sourceid );

		}
		if( this.me.memory[ 'moveTicks' ] == null )
			this.me.memory[ 'moveTicks' ] = 0;
	}
	scan() {
		if(this.source==null ||this.source==null&&this.nkore.means.isResolved( 'sources', this.source ) ) {
			this.source = this.nkore.means.getAvailables( 'sources', null, 1 )[ 0 ];
			if( this.source == null ) {
				//this.me.memory.role = 'recycled'
			}
		}
		this.resolveMean( 'sources', this.source );
	}
	run() {
		if( super.run() == false ) return false;
		const harvestResult = this.me.harvest( this.source )
		if( harvestResult == ERR_NOT_IN_RANGE ) {
			this.me.say( "🚚" );
			nkonsole.log( '->move', 'nkreepharvester' );
			this.me.memory[ 'moveTicks' ] = this.me.memory[ 'moveTicks' ] + 1;
			this.me.moveTo( this.source )
		}
		else {
			if( harvestResult == OK ) {
				this.me.say( "⛏" );
			}
			nkonsole.log( '->harvest on ' + this.source + '=' + harvestResult, 'nkreepharvester' );
		}

		return true;
	}
}

module.exports = nkreepharvester;
