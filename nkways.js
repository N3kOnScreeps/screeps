var nkonsole = require( 'nkonsole' );
//var nkspawn=require("nkgatherer");
/**
 * @constructor
 * @param {Spawn} spawn the spawn object
 */

class nkway {

	constructor( nkways, position1, position2, range1 = 1, range2 = 1 ) {
		this.nkways = nkways;
		this.memory = nkways.memory[ this.serializePosition( position1 ) ][ this.serializePosition(
			position1 ) ]
		if( this.memory == null ) {
			this.path = nkways.room.me.findPath( position1, position2, {
				ignoreCreeps: true
			} )
			this.memory = Room.serializePath( this.path )
		}
		else this.path = Room.deserializePath( this.memory )
	}
	static serializePosition( position ) {
		return '_' + position.x + ',' + position.y
	}
	static deserializePosition( str ) {
		const p1p2tab = str.substr( 1 )
			.split( ',' );
		return Room.getPositionAt( p1p2tab[ 0, p1p2tab[ 1 ] ] );
	}
	getPoints() {
		if( this.points == null ) {
			ret = [];
			for( var i in this.path ) {
				ret.push( Room.getPositionAt( this.path[ i ].x, this.path[ i ].y ) );
			}
			this.points = ret;
			return ret
		}
		return this.points;
	}

	getDest() {
		ret = [];
		ret.push( Room.getPositionAt( this.path[ 0 ].x, this.path[ 0 ].y ) );
		ret.push( Room.getPositionAt( this.path[ this.path.length - 1 ].x, this.path[ this.path.length -
			1 ].y ) );
		return ret
	}

	getPath( dest, range ) {

	}

}

class nkways {
	constructor( room ) {
		nkonsole.log( "ways initialization...", 'nkways' );
		this.nkore = room.nkore;
		this.room = room
		this.memory = this.room.me.memory.nkways
		this.ways = [];

		this.readMemory();
		nkonsole.log( "ways initialized.", 'nkways' );
	}
	readMemory() {
		for( var p1p2 in this.memory ) {
			const p1p2tab = p1p2.deserializeKey( p1p2 );
			const p1 = p1p2tab[ 0 ];
			const p2 = p1p2tab[ 1 ];
			this.nkways[ p1 ][ p2 ] = new nkway( this, nkway.deserializePosition( p1 )
				, nkway.deserializePosition( p2 ) )
		}
	}
	addPath( p1, p2, range1 = 1, range2 = 1 ) {
		this.nkways[ p1 ][ p2 ] = new nkway( this, nkway.deserializePosition( p1 )
			, nkway.deserializePosition( p2 ), range1, range2 )
	}
	deserializeKey( p1p2 ) {
		const p1p2tab = p1p2.substr( 1 )
			.split( '_' );

	}
	serializeKey( p1, p2 ) {
		return '_' + nkway.serializePosition( p1 ) +
			'_' + nkway.serializePosition( p2 )
	}
	_getWay( p1, p2 ) {
		if( ways[ p1, p2 ] == null )
			return ways[ p1, p2 ];
		return ways[ p1, p2 ]
	}

	/*	_setWay( path ) {
			let p1 = path[ 0 ].x + ',' + path[ 0 ].y
			let p2 = path[ path.length - 1 ].x + ',' + path[ 0 ].y
			ways[p1][p2] = path;
		}
	*/
	_remove( p1, p2 ) {
		ways[ p1, p2 ] = null;
		ways[ p2, p1 ] = null;
	}

	serialize() {
		const ret = {};
		for( const p1 in this.ways ) {
			for( const p2 in this.ways[ p1 ] ) {
				const k = '_' + p1 + '_' + p2;
				const v = this.ways[ p1 ][ p2 ]
				ret[ k ] = v
			}
		}
		return ret;
	}
	deserialize( obj ) {
		for( var p1p2 in obj ) {
			//p1p2.split('_')
			this._setWay( obj[ p1p2 ] )
				//obj[p1p2]
		}
	}

	addPath( path ) {

	}

}

module.exports = nkways;
