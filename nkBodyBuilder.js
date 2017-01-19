/*
MOVE: "move",
WORK: "work",
CARRY: "carry",
ATTACK: "attack",
RANGED_ATTACK: "ranged_attack",
TOUGH: "tough",
HEAL: "heal",
CLAIM: "claim",

BODYPART_COST: {
    "move": 50,
    "work": 100,
    "attack": 80,
    "carry": 50,
    "heal": 250,
    "ranged_attack": 150,
    "tough": 10,
    "claim": 600
}


*/
const BODYPART_ORDER= {
    "tough": 0,
    "attack": 1,
    "ranged_attack": 1,
    "work": 2,
    "claim": 2,
    "carry": 3,
    "move": 4,
    "heal": 4
}

function buildBody(arrConst, ammountMax ,arrVar){
    const SeparedBody = {}
    let price=0;
        
    const PreviousBody = SeparedBody;
    for(const part in BODYPART_ORDER){
        FinalBody[part]=[]
        for(let i=0;i<arrConst[i];i++){
            SeparedBody[part].push(arrConst)
            
        }
    }
    while(price<ammountMax ){
    }
    
    
    return 
}
module.exports = {
    buildBody : buildBody
};