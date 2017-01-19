//console.log('nkMeans.js')

var nkonsole = require( 'nkonsole' );

class nkMeanResolver {
	constructor( objectResolver, nbResolved = 1 ) {
		if( objectResolver == null ) throw 'objectResolver required'
		this.objectResolver = objectResolver
		this.nbResolved = nbResolved
	}
}

class nkMean {
	constructor( meanObject, nbMaxResolver = 1 ) {
		if( meanObject == null ) throw "required meanObject";
		if( nbMaxResolver < 1 ) throw "nbMaxResolver must be >=1";
		this.mean = meanObject;
		this.resolvers = []
		this.nbMaxResolver = nbMaxResolver
		nkonsole.log( 'Mean ' + meanObject + ' init', 'mean' );
	}
	read() {

	}
	write() {

	}
	getAvailable() {
		const nbMaxResolver = this.nbMaxResolver
		const resolved = this.getResolved()
		const ret = nbMaxResolver - resolved
		const mean = this.mean
		nkonsole.log( function () {
			return 'getAvailable ' + mean + ' : ' + ret + ' = ' + nbMaxResolver + '-' + resolved
		}, 'mean' )
		return ret
	}
	getResolved() {
		let resolved = 0;

		for( const i in this.resolvers ) {
			resolved += this.resolvers[ i ].nbResolved
		}
		return resolved
	}

	addResolver( ResolverObject, nbresolving ) {
		if( ResolverObject == null ) throw 'resolver required'
		const key = this.getResolverKey( ResolverObject )
		if( key == null ) {
			return;
		}
		this.resolvers[ key ] = new nkMeanResolver( ResolverObject, nbresolving );
		nkonsole.log( 'added resolver ' + ResolverObject + ' for ' + this.mean, 'mean' )
		const mean = this;

	}

	readResolverKey( objectId ) {
		return Game.getObjectById( objectId )
	}
	getResolverKey( objectResolver ) {
		return objectResolver.id;
	}

	beautify() {
		let ret = this.getResolved() + '/' + this.nbMaxResolver + '=' + Math.floor( this.getResolved() *
			100 / this.nbMaxResolver ) + '% \n'
		let empty = true;
		for( const i in this.resolvers ) {
			const objectResolver = this.resolvers[ i ].objectResolver;
			let name = objectResolver;
			if( objectResolver.name != null ) name = objectResolver.name;
			else if( objectResolver.me != null && objectResolver.me.name != null )
				name = objectResolver.me.name;
			else if( objectResolver.id != null ) name = objectResolver.id;
			ret += '    - ' + name + '\n'
			empty = false;
		}
		//if( empty ) {
		//	ret += '   no resolver\n'
		//}
		return ret
	}
}

class nkMeanType {
	constructor() {
		this.means = [];
		//this.minNbResolver = [];
	}
	static read( memory ) {
		if( memory == null ) throw "memory expected"
			//for(i)
			//getObjectMeanKey( objectMean )
	}
	static write( memory ) {
		if( memory == null ) throw "initialized memory expected"
			//getObjectMeanKey( objectMean )
	}
	addMean( objectMean, nbMaxResolver ) {
			if( objectMean == null )
				throw 'objectMean required'
			const key = this.getObjectMeanKey( objectMean );
			if( key == null ) return;
			if( this.means[ key ] == null ) {
				this.means[ key ] = new nkMean( objectMean, nbMaxResolver );
				nkonsole.log( 'added ' + key, 'meanType' )
			}
			else {
				if( nbMaxResolver != null &&
					this.means[ key ].nbMaxResolver != nbMaxResolver )
					this.means[ key ].nbMaxResolver = nbMaxResolver
			}

		}
		//type string
	getObjectMeanKey( objectMean ) {
		nkonsole.log( 'type string ' + objectMean + ' getkey', "meanType" );
		return objectMean
	}
	readObjectMeanKey( str ) {
		nkonsole.log( 'type string ' + str + ' readkey', "meanType" );
		return str
	}
	getResolvers( objectMean ) {
		const ret = []
		for( const i in this.means ) {
			ret.push( this.means[ i ] );
		}
		return ret;
	}

	addResolver( objectMean, objectResolver, nbresolving ) {
		this.addMean( objectMean );
		let key = this.getObjectMeanKey( objectMean );

		this.means[ key ].addResolver( objectResolver, nbresolving );
		nkonsole.log( 'added resolver ' + key + '(nbresolving)', 'meanType' )

	}
	getAvailables( func, minNbResolver, nbmax = Infinity ) {
		if( func == null ) {
			func = function ( o ) {
				return true;
			}
		}
		let availables = []
		let empty = true;
		
		const meanKeys = Object.keys(this.means);
		
		for (var m = 0; m < nbmax; m++) {
		    let bestMeanObject
		    let bestMean
		    let bestavailable=1;
    		for( const i in meanKeys ) {
    		    if(meanKeys[i]==null) continue
    		    const currentMean = this.means[meanKeys[i]]
    			if(currentMean==null) {
    			    delete meanKeys[i]
    			    continue
    		    
    		    }
    			empty = false;
				
    			/*if( this._isResolved( mean, minNbResolver ) ) {
    				continue
    			}*/
    			
    			const meanObject = this.readObjectMeanKey( meanKeys[i] )
    			if( meanObject != null ) {
    			    if(bestavailable > currentMean.getAvailable())
				        continue;
    				
    				bestMeanObject = meanObject
    				bestMean = i
    				bestavailable = currentMean.getAvailable();
    				
    			}
    			else {
    				nkonsole.log( "Deleting mean " + mean + " about inexistant object", 'meanType' )
    				delete this.means[ mean ];
    			}
    		}
    		if(bestMeanObject==null)
    		    break;
    		availables.push( bestMeanObject );
    		delete meanKeys[bestMean];
    		if(meanKeys.length==0) break
		}
		if( empty )
			nkonsole.log( 'no means registered', 'meanType' );
		else
			nkonsole.log( 'Availables:' + availables.length, 'meanType' );
		return availables;
	}
	_getNbMinResolver( key ) {
		let nbMinResolver = this.means[ key ].nbMaxResolver

		return nbMinResolver
	}
	isResolved( objectMean, nbMinResolver ) {
		return this._isResolved( this.getObjectMeanKey( objectMean), nbMinResolver );
	}
	_isResolved( key, nbMinResolver ) {
		if( key == null ) throw 'key required';
		const objectMean = this.readObjectMeanKey( key );
		if( objectMean == null ) {
			nkonsole.log( objectMean + " is resolved (dead)" + this.stringifyType(), 'meanType' )
			return true;
		}
		if( this.means[ key ] == null ) {
			nkonsole.log( objectMean + " is resolved (not declared)", 'meanType' )
			return true;
		}
		if( nbMinResolver == null ) nbMinResolver = this.means[ key ].nbMinResolver
		if( nbMinResolver == null ) nbMinResolver = 1
		let available = this.means[ key ].getAvailable()
		if( available < nbMinResolver ) {
			nkonsole.log( objectMean + " is resolved " + available + "< " + nbMinResolver, 'meanType' )
			return true;
		}
		nkonsole.log( objectMean + " is not resolved " + available + " > " + nbMinResolver, 'meanType' )
		return false;
	}
	print( tag ) {
		const means = this.means
		const minNbResolver = this.minNbResolver
		const nkmean = this;
		nkonsole.log( function () {
			let ret = '';
			for( const i in means ) {
				let first = true;
				let strMinResolvers = '(' + minNbResolver[ i ] + ')';
				for( const j in means[ i ] ) {
					if( first ) {
						ret += 'PRINT   ' + i + strMinResolvers + ' = ' + means[ i ][ j ];
					}
					else
						ret += 'PRINT     + ' + means[ i ][ j ]
					first = false;
				}
				if( first )
					ret += 'PRINT   ' + i + strMinResolvers + ' = AVAILABLE'
				return ret;
			}
		}, tag );

	}
	beautify( more = false ) {
		let cnt = 0;
		let total = 0;
		let resolved = 0;
		let ret = '\n'

		for( const i in this.means ) {
			resolved += this.means[ i ].getResolved()
			total += this.means[ i ].nbMaxResolver
			cnt++
			if( more ) {

				ret += ' • ' + this.readObjectMeanKey( i ) + ':' + this.means[ i ].beautify()
			}
		}
		let head = ( cnt - this.getAvailables()
			.length ) + '/' + cnt + '=' + resolved + '/' + total + '=' + Math.floor( resolved * 100 /
			total ) + '%'
		return head + ret
	}

	stringifyType() {
		return 'string'
	}
}

class nkMeanGameObject extends nkMeanType {

	constructor() {
		super();
	}
	static testType( objectMean ) {
		return objectMean.id != null
	}

	getObjectMeanKey( objectMean ) {
		return objectMean.id;
	}

	readObjectMeanKey( str ) {
		if( Game.getObjectById( str ) != null ) return Game.getObjectById( str );
		//if( Game.creeps[ str ] != null ) return Game.creeps[ str ];
		//if( Game.structures[ str ] != null ) return Game.structures[ str ];
		return null
	}

	stringifyType() {
		return 'GameObject'
	}

}

class nkMeans {
	constructor() {
		this.meansTypes = []
	}
	getSubClassFor( objectMean ) {
		if( nkMeanGameObject.testType( objectMean ) )
			return nkMeanGameObject;
		return nkMeanType
	}
	_addType( name, objectMean ) {
		if( this.meansTypes[ name ] == null ) {
			const subclass = this.getSubClassFor( objectMean )
			this.meansTypes[ name ] = new subclass();
		}
	} 
	addMean( type, objectMean, minNbResolver ) {
		if( type == null || objectMean == null ) throw "addMean:type "+type+" and objectMean "+objectMean+" must not be null"

		this._addType( type, objectMean )
		this.meansTypes[ type ].addMean( objectMean, minNbResolver )
		nkonsole.log( type + ' added' + objectMean.id + '(' + minNbResolver + ')', 'means' );
	}
	addMeans( type, objectsMeans, minNbResolver ) {
		for( const i in objectsMeans ) {
		    if(objectsMeans[ i ]!=null)
			    this.addMean( type, objectsMeans[ i ], minNbResolver )
		}
	}
	addResolver( type, objectMean, objectResolver, nbResolving ) {
	    if(type==null || objectMean==null) throw "addResolver : type "+type+" and objectMean "+objectMean+" required"
		nkonsole.log( 'Adding resolver', 'means' );
		this.addMean( type, objectMean, nbResolving )
		this.meansTypes[ type ].addResolver( objectMean, objectResolver, nbResolving );
		nkonsole.log( 'Resolver ' + type + ' added : ' + objectMean.id + ' -> ' +
			objectResolver.id, 'means' );
	}
	isResolved( type, objectMean, minNbResolver ) {
		nkonsole.log( 'isResolved ? ' + type + ' : ' + objectMean.id + ' (' +
			minNbResolver, 'means' );
		if( this.meansTypes[ type ] == null ) return true;
		if( objectMean == null ) throw 'objectMean obligatoire';
		return this.meansTypes[ type ].isResolved( objectMean, minNbResolver );
	}
	getAvailables( type, func, minNbResolver, nbmax ) {
		if( this.meansTypes[ type ] == null ) return []
		const availables = this.meansTypes[ type ].getAvailables( func, minNbResolver, nbmax );
		nkonsole.log( 'Availables ' + type + ' : ' + availables.join( ',' ), 'means' );
		return availables
	}
	_getNbMinResolver( type, objectMean ) {
		if( this.meansTypes[ type ] == null ) return 0
		return this.meansTypes[ type ]._getNbMinResolver( objectMean )
	}
	print( tag ) {
		nkonsole.log( 'PRINT nkMeans :', tag )
		for( const i in this.meansTypes ) {
			nkonsole.log( 'PRINT  ' + i + ' :', tag )
			this.meansTypes[ i ].print( tag );
		}
	}

	beautify( more ) {
		let ret = ""
		for( const i in this.meansTypes ) {
			ret += 'Mean ' + i + ' '
			ret += this.meansTypes[ i ].beautify( more );
		}
		return ret;
	}
}
module.exports = nkMeans;
