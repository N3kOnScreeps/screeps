const nkonsole = require( "nkonsole" )

const zalgo_up = [
	'\u030d', /*     ̍     */ '\u030e', /*     ̎     */ '\u0304', /*     ̄     */ '\u0305', /*     ̅     */
	'\u033f', /*     ̿     */ '\u0311', /*     ̑     */ '\u0306', /*     ̆     */ '\u0310', /*     ̐     */
	'\u0352', /*     ͒     */ '\u0357', /*     ͗     */ '\u0351', /*     ͑     */ '\u0307', /*     ̇     */
	'\u0308', /*     ̈     */ '\u030a', /*     ̊     */ '\u0342', /*     ͂     */ '\u0343', /*     ̓     */
	'\u0344', /*     ̈́     */ '\u034a', /*     ͊     */ '\u034b', /*     ͋     */ '\u034c', /*     ͌     */
	'\u0303', /*     ̃     */ '\u0302', /*     ̂     */ '\u030c', /*     ̌     */ '\u0350', /*     ͐     */
	'\u0300', /*     ̀     */ '\u0301', /*     ́     */ '\u030b', /*     ̋     */ '\u030f', /*     ̏     */
	'\u0312', /*     ̒     */ '\u0313', /*     ̓     */ '\u0314', /*     ̔     */ '\u033d', /*     ̽     */
	'\u0309', /*     ̉     */ '\u0363', /*     ͣ     */ '\u0364', /*     ͤ     */ '\u0365', /*     ͥ     */
	'\u0366', /*     ͦ     */ '\u0367', /*     ͧ     */ '\u0368', /*     ͨ     */ '\u0369', /*     ͩ     */
	'\u036a', /*     ͪ     */ '\u036b', /*     ͫ     */ '\u036c', /*     ͬ     */ '\u036d', /*     ͭ     */
	'\u036e', /*     ͮ     */ '\u036f', /*     ͯ     */ '\u033e', /*     ̾     */ '\u035b', /*     ͛     */
	'\u0346', /*     ͆     */ '\u031a' /*     ̚     */
];

const zalgo_down = [
	'\u0316', /*     ̖     */ '\u0317', /*     ̗     */ '\u0318', /*     ̘     */ '\u0319', /*     ̙     */
	'\u031c', /*     ̜     */ '\u031d', /*     ̝     */ '\u031e', /*     ̞     */ '\u031f', /*     ̟     */
	'\u0320', /*     ̠     */ '\u0324', /*     ̤     */ '\u0325', /*     ̥     */ '\u0326', /*     ̦     */
	'\u0329', /*     ̩     */ '\u032a', /*     ̪     */ '\u032b', /*     ̫     */ '\u032c', /*     ̬     */
	'\u032d', /*     ̭     */ '\u032e', /*     ̮     */ '\u032f', /*     ̯     */ '\u0330', /*     ̰     */
	'\u0331', /*     ̱     */ '\u0332', /*     ̲     */ '\u0333', /*     ̳     */ '\u0339', /*     ̹     */
	'\u033a', /*     ̺     */ '\u033b', /*     ̻     */ '\u033c', /*     ̼     */ '\u0345', /*     ͅ     */
	'\u0347', /*     ͇     */ '\u0348', /*     ͈     */ '\u0349', /*     ͉     */ '\u034d', /*     ͍     */
	'\u034e', /*     ͎     */ '\u0353', /*     ͓     */ '\u0354', /*     ͔     */ '\u0355', /*     ͕     */
	'\u0356', /*     ͖     */ '\u0359', /*     ͙     */ '\u035a', /*     ͚     */ '\u0323' /*     ̣     */
];

const Astro = ['♈️','♍️','♌️','♋️','♊️','♉️','♎️','♏️','♐️','♑️','♒️'];

const seps = [ ' ', '  ', [ ' /', '/ ' ]
		, [ ')', '(' ]
		, [ '\' ' ]
	]
	/*[ '\'' ]
	, [ '-' ]
	, [ '•' ]
	, [ '=' ]
	, [ '?' ]
	, [ '^' ]
	, [ '@' ]
	, [ '&' ]
	, [ '#' ]
	, [ '~' ]
	, [ '' ]
	, [ '7' ]
	, [ '|' ]
	, [ '.' ]
	, [ '+' ]
	, [ ' ' ]
	, [ '\t' ]
	, [ '\\' ]
	, [ '"', '"' ]
	, [ '(', ')' ]
	, [ '[', ']' ]
	, [ '/', '/' ]
	, [ '<', '>' ]
	, [ '>', '<' ]
	, [ 'q', 'p' ]
	, [ '?', ':' ]
	*/

/*const Alphabet = [
	'☇', '☈', '☉', '☊', '☋', '☌', '☍'
	, 'ʘ', 'ʒ', 'ʞ', 'Ɂ', 'Ο', 'Δ', 'ϴ', 'Ϡ', 'Ͼ', 'Γ', 'Ե', 'ס'
]*/

const fixes = [ '∴', '∵', '∙' ];

const faces = ['😀','😁','😂','😃','😄','👿','😈','😇','😆','😅','😉','😊','😋','😌','😑','😐','😏','😎','😍','😒','😓','😔','😕','😖','😛','😚','😙','😘','😗','😜','😞','😞','😟','😠','😥','😤','😣','😢','😡','😦','😧','😨','😩','😪','😯','😮','😭','😬','😫','😰','😱','😲','😳']
const Alphabet=faces
const sexs = [ '♀', '♂'  ]

const roleEmojis = {
    'harvester':'♟',
    'worker':'⚒',
    'gatherer':'♞',
    'upgrader':'♜'
}
function getRoleEmoji(role){
    if(roleEmojis[role]!=null)
    return roleEmojis[role]
    return ''
}

function randVal( arr ) {
	if( arr == null ) throw 'arr required to get a randVal'
	return arr[ Math.floor( Math.random() * arr.length ) ]
}

function getRandomfix() {
	const nb = Math.ceil( Math.max( 0, Math.random() * 13 - 11 ) )
	let ret = '';
	for( var i = 0; i < nb; i++ ) {
		ret += randVal( fixes );
	}
	return ret;
}

function randZalgUp() {
	return randVal( zalgo_up ); //zalgo_up[ Math.floor( zalgo_up.length * Math.rand() ) ]
}

function randZalgDown() {
	return randVal( zalgo_down ); //zalgo_up[ Math.floor( zalgo_up.length * Math.rand() ) ]
}

function zalgo( txt, nb = 50 ) {
	if( nb <= 0 ) return txt
	if( typeof ( txt[ 0 ] ) == 'object' ) {
		let ln = 0
		const base = nb / txt.length
		let ret = []

		for( const i in txt ) {
			const rand = Math.random()
			let myln = Math.min(
				nb - ln, Math.floor(
					0.33 * ( base ) +
					( 0.66 * ( base ) * rand ) )
			)
			ret.push( zalgo( txt[ i ], myln ) )
			ln += Math.max( 0, myln )
		}

		return ret
	}
	return _zalgo( txt, nb )
}

function _zalgo( txt, nb ) {
	let zalgosUP = [];
	let zalgosDOWN = [];
	let len = 0;
	if( len >= nb ) return txt;
	if( txt == null || txt.length == null || txt.length == 0 ) return txt
	tout: while( true ) {
		for( let c in txt ) {
			const up = Math.random() > 0.5
			if( up && zalgosUP[ c ] == null ) {
				zalgosUP[ c ] = '';
			}
			if( !up && zalgosDOWN[ c ] == null ) {
				zalgosDOWN[ c ] = '';
			}
			const car = ( up ) ? randZalgUp() : randZalgDown()
			if( len + car.length > nb )
				break tout;
			if( up )
				zalgosUP[ c ] += '' + car;
			else
				zalgosDOWN[ c ] += '' + car;
			len += car.length;
			if( len >= nb )
				break tout;

		}
	}
	let ret = [];
	ret.push( getRandomfix() )
	for( const c in txt ) {
		if( zalgosUP[ c ] != null )
			ret.push( zalgosUP[ c ] )
		ret.push( txt[ c ] );
		if( zalgosDOWN[ c ] != null )
			ret.push( zalgosDOWN[ c ] )
	}
	ret.push( getRandomfix() )
	return ret;
}

function getRandomSeps( i = 1 ) {
	let nb = 0;
	let ret = [];
	while( ret.length < i ) {
		let randomSeps = []
		let len
		do {
			len = 0
			randomSeps = randVal( seps )
			for( const y in randomSeps ) {
				len += randomSeps[ y ].length
			}
		} while ( len + nb > i )
		for( const x in randomSeps )
			ret.push( randomSeps[ x ] );
	}
	return ret
}

function getAstro() {
	const nbMystic = Math.floor( Game.time / 666 )
	const nbCycle = Astro.length
	const n = nbMystic % nbCycle
	return Astro[ n ]
}

function getSex( arr ) {
	return randVal( sexs );
}

function getBaseNameWord( x ) {
	let ret = []
	for( var i = 0; i < x; i++ ) {
		ret.push( randVal( Alphabet ) );
	}
	return ret
}

function getBaseName( y = 1, minx = 6, maxx = 12 ) {
	//console.log( 'getBaseName( y = ' + y + ', minx = ' + minx + ', maxx = ' + maxx + ' )' )
	let ret = []
	for( var i = 0; i < y; i++ ) {
		const nb = ( Math.random() * ( maxx - minx ) ) + minx
		ret.push( getBaseNameWord( nb ) );
		//console.log( nb, ret );
	}
	return ret
}

function testName( name ) {
	if( name == null ) throw 'name must not be null'
	for( var i in Game.creeps ) {
		if( i == name ) return false;
	}
	return true
}

function getCreepyName( plus = '') {
	let ret
	do {
		ret = ''
		let nb = 0
		nb += 2 // spaces  
		const nbWanted = 1 + Math.floor( 3 * Math.random() )
		const astro = getAstro();
		nb += astro.length
		const sex = getSex();
		nb += sex.length

		const nbmots = Math.max( 1 + Math.floor( ( Math.random() - 0.5 ) * 3 ), 1 )
		const moyParMot = ( nbWanted ) / nbmots
		const minParMots = Math.max( 1, Math.floor( moyParMot - 0.4 * moyParMot ) )
		const maxParMots = Math.min( 5, Math.floor( moyParMot + 0.4 * moyParMot ) )

		const baseName = getBaseName( nbmots, minParMots, maxParMots );
		for( const i in baseName ) {
			const baseNameWord = baseName[ i ]
			for( const j in baseNameWord ) {
				if( baseNameWord[ j ] != null && baseNameWord[ j ].length != 0 )
					nb += baseNameWord[ j ][ 0 ].length
			}
		}

		const randomSeps = getRandomSeps( baseName.length - 1 );
		for( i in randomSeps ) {
			nb += randomSeps[ i ].length
		}
		//console.log( baseName, nb )

		const zalgoName = zalgo( baseName, Math.max( nbWanted * 1, Math.min( nbWanted * 4, 40 - nb ) ) )
			//console.log( zalgo( baseName, 25 - nb ) )
		for( i in randomSeps ) {
			nb += randomSeps[ i ].length
		}

		ret += astro + ' '
		for( const i in zalgoName ) {
			const zalgoNameWord = zalgoName[ i ]
			for( const j in zalgoNameWord ) {
				ret += zalgoNameWord[ j ]
			}
			//if( zalgoName[ i ].length != null )
			if( randomSeps[ i ] != null )
				ret += randomSeps[ i ]
		}
		ret += ' '+plus + sex
			//console.log( ret )
		return ret
	} while ( !testName( ret ) )
	return ret
}

module.exports = {
	getCreepyName: function (plus) {
		return getCreepyName(plus)
	}
	,
	getRoleEmoji: function(role){
	    return getRoleEmoji(role)
	}
}
