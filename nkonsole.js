//console.log('nkonsole.js')

const tagsToLog = [];
tagsToLog.push( 'nkore' );
tagsToLog.push( 'catch' );
//tagsToLog.push( 'nkonstructiontower' )
tagsToLog.push( 'debug' )

//* // REPORT  / MORE
tagsToLog.push( 'report' )

//tagsToLog.push( 'exemple_names' )
tagsToLog.push( 'exemple_bodys' )

	/*/
	tagsToLog.push( 'morereport' )
	//*/

/*
tagsToLog.push( 'means' )
tagsToLog.push( 'meanType' )
 //*/
tagsToLog.push( 'nkonstructionconstructedWall' )
//tagsToLog.push( 'nkreepgatherer' )
//tagsToLog.push( 'nkreepupgrader' )

const showHiddens = true;
//const tagsToLog = [];
var colors, max, unknowntags, lastUsedCpu;
if( colors == null )
	colors = []
colors[ "nkore" ] = 'hsl(360,100%,70%)'
colors[ "debug" ] = 'hsl(180,100%,70%)'
colors[ "catch" ] = 'hsl(360,100%,85%)'
colors[ "mean" ] = 'hsl(70,100%,80%)'
colors[ "meanType" ] = 'hsl(70,50%,70%)'
colors[ "report" ] = 'hsl(30,100%,80%)'
colors[ "morereport" ] = 'hsl(30,100%,80%)'

class nkonsole {
	construct() { //
	}

	static log( txt, tag ) {
		if( unknowntags == null )
			unknowntags = [];

		if( tag == null )
			tag = 'null';
		for( let i in tagsToLog ) {
			if( tag == tagsToLog[ i ].substr( 0, tag.length ) ) {
				if( unknowntags.length != 0 && showHiddens ) {
					console.log( '<span style="color:#444444;font-size:12px"><i>Hidden tags : </i>' + unknowntags
						.join( ',' ) +
						'</span>' )
					unknowntags = [];
				}
				//usedcpu
				console.log( nkonsole._beautify( txt, tag ) )
				return;
			}
		}
		if( tagsToLog == null || tagsToLog.length == 0 ) {
			console.log( nkonsole._beautify( txt, tag ) );
		}
		let trouve = false;
		for( const i in unknowntags )
			if( unknowntags[ i ] == tag ) {
				trouve = true;
				break;
			}
		if( trouve == false ) {
			unknowntags.push( tag )
		}

	}
	static _beautify( txt, tag ) {
		let usedCpuString = "";
		if( Game.cpu.limit < Infinity ) {
			usedCpuString = "           ";

			const usedcpu = ( ( Game.cpu.getUsed() * 100 ) | 0 ) / 100;
			if( lastUsedCpu != null ) {
				const diff = usedcpu - lastUsedCpu;
				if( diff >= 0 ) {
					let diffString = "";
					if( diff > 0.099 ) {
						diffString = '+' + ( ( ( diff ) * 10 ) | 0 ) / 10;
					}
					else {
						diffString = " "
					}
					usedCpuString = '<font color="#008888">' + this._pad( 4, usedcpu | 0, true ) + "</font>" +
						'<font color="#225555"> ' + this._pad( 7, diffString, false ) + "|</font>"
				}
			}
			lastUsedCpu = usedcpu;
		}
		///usedcpu
		return usedCpuString + '<b style="font-size:12px;color:' + nkonsole.getColor( tag ) + '">' +
			this.pad(
				tag ) +
			'</b> : <span style="font-size:16px;color:' + nkonsole.getColor( tag ) + '">' + nkonsole._stringify(
				txt ) +
			"</span> ";
	}
	static _stringifyCollection( obj, level = 0 ) {
		if( level > 5 ) return typeof ( obj );
		let tabs = '';
		for( var i = 0; i < level; i++ ) {
			tabs += '\t'
		}
		let opentab = '';
		let closetab = '';
		switch( typeof ( obj ) ) {
		case 'array':
			opentab = '[';
			closetab = ']'
			break;
		case 'object':
			opentab = '{';
			closetab = '}'
			break;
		}
		let str = opentab + '\n';
		for( var i in obj ) {
			str += tabs + '\t' + i + ':' + this._stringify( obj[ i ], level + 1 ) + '\n'
		}
		return str + tabs + closetab
	}
	static _stringify( obj, level = 0 ) {
		let tabs = '';
		for( var i = 0; i < level; i++ ) {
			tabs += '\t'
		}
		if( typeof ( obj ) == "string" ) return obj
		if( typeof ( obj ) == "array" || typeof ( obj ) == "object" ) return this._stringifyCollection(
			obj, level )
		if( typeof ( obj ) == 'function' ) {
			if( level == 0 )
				try {
					return this._stringify( obj(), level );
				}
			catch( ex ) {
				return 'function error : ' + ex
			}
			return this._stringify( 'function', level );
		}
		return typeof ( obj ) + ':' + obj
	}

	static pad( str ) {
		if( max == null || max == 0 ) {
			max = 0;
			if( tagsToLog != null && tagsToLog.length != 0 )
				for( const i in tagsToLog )
					max = Math.max( max, tagsToLog[ i ].length + 1 );
			else
				max = 16;
		}

		return this._pad( max, str, false );
	}

	static getColor( tag ) {
		if( colors == null ) {
			colors = [];
		}
		if( colors[ tag ] == null )
			colors[ tag ] = this.get_random_color();
		return colors[ tag ];
	}
	static _pad( nb, str, padLeft ) {
		const pad = Array( nb )
			.join( ' ' )
		if( typeof str === 'undefined' ) return pad;
		if( padLeft ) {
			return( pad + str )
				.slice( -pad.length );
		}
		else {
			return( str + pad )
				.substring( 0, pad.length );
		}
	}

	static rand( min, max ) {
		return min + Math.random() * ( max - min );
	}

	static get_random_color() {
		var h = 120 + this.rand( -90, 90 );
		var s = this.rand( 30, 70 );
		var l = this.rand( 50, 80 );
		return 'hsl(' + h + ',' + s + '%,' + l + '%)';
	}
}
module.exports = nkonsole
