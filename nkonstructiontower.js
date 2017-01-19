var nkonstruction = require( 'nkonstruction' );
var nkonsole = require( 'nkonsole' );

const MISSION_SHOOT = "shoot"
const MEAN_SHOOT = "hostile"

const MISSION_REPAIR = "repair"
const MEAN_REPAIR = "needRepair"

class nkonstructiontower extends nkonstruction {
	constructor( objectStructure, room ) {
	    
		nkonsole.log( objectStructure + " initialization...", 'nkonstructiontower' );
		super( objectStructure, room );
		const nbNeedEnergy = Math.floor( Math.min(3,( this.me.energyCapacity - this.me.energy ) / 50 ))
		if( nbNeedEnergy > 0 ) {
		    nkonsole.log( 'I need energy : '+nbNeedEnergy, 'nkonstructiontower' )
			this.nkore.means.addMean( "needEnergy", this.me, nbNeedEnergy )
		}
		
		this.target = Game.getObjectById( this.me.memory.target)
		this.mission = this.me.memory.mission
		
		
		nkonsole.log( this.me + " initialized.", 'nkonstructiontower' );
	}

	scan() {
	    if(this.target!=null){
	        switch(this.mission){
	            case MISSION_SHOOT:
	                if(this.room!=this.me.room) this.target=null
	                if(this.me.pos.inRangeTo(this.target, 20)) this.target=null
	            break;
	            case MISSION_REPAIR:
	                this.target=null
	            break;
	            
	        }
	    }
	    if(this.target==null){
	        const enemy = this.nkore.means.getAvailables(MEAN_SHOOT, null, 1)[0]
	        if(enemy!=null){
	            this.target=enemy
	            this.mission=MISSION_SHOOT
	            return 
	        }
	        if(this.me.energy>this.me.energyCapacity*0.8){
    	        const repairs = this.nkore.means.getAvailables(MEAN_REPAIR, null, 1)[0]
    	        if(repairs!=null){
    	            this.target=repairs
    	            this.mission=MISSION_REPAIR
    	            return 
    	        }
	        }
	        
	        
	        
	        
	    }
	    
	}
	
	
	
	run() {
        if(this.target!=null){
            if(this.mission==MISSION_SHOOT){
                this.me.attack(this.target)
            }
            if(this.mission==MISSION_REPAIR){
                this.me.repair(this.target)
            }
        }
	}

}

/** @define {Spawn} */
//nkspawn.prototype.me;
//nkspawn.addRole(nkgatherer)

module.exports = nkonstructiontower;
