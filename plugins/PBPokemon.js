function PBPokemon() {
    this.initialize.apply(this, arguments);
}
//Shared container for overrided functions.
PBPokemon.overrides={};
PBPokemon.prototype = Object.create(Object.prototype);
PBPokemon.prototype.constructor = PBPokemon;

PBPokemon.prototype.initialize = function() {
    //Object.prototype.initialize.call(this);
    this._hp=0;
    this._totalHp=0;
    this._attack=0;
    this._defense=0;
    this._speed=0;
    this._spatk=0;
    this._spdef=0;
    this._iv=[0,0,0,0,0,0];
    this._ev=[0,0,0,0,0,0];
    this._species=0;
    this._id=0;
    this._trainerId=0;
    this._pokerus=false;
    this._item=null;
    this._consumedItem=null;
    this._resultingItem=null;
    this._mail=null;
    this._mailText="";
    this._name="";
    this._exp=0;
    this._happiness=0;
    this._status=0;
    this._statusCount=0;
    this._eggSteps=0;
    this._firstMoves=[];
    this._ballUsed=0;
    this._markings=0;
    this._moves=[];
    this._timeReceived=0;
    //0 - met, 1 - as egg, 2 - traded,
    //4 - fateful encounter
    this._obtainMode=0;
    this._obtainMap=0;
    this._obtainText="";
    this._obtainLevel=0;
    this._hatchedMap=0;
    this._level=0;
    this._ot="";
    this._otGender=2;

};
//Ownership, obtained information

//Level
PBPokemon.prototype.level=function(){
    return this._level;
}
PBPokemon.prototype.setLevel=function(tLevel){
    this._level=tLevel;
    this._exp=PBExperience.getStartExperience(this._level,this.growthRate()) 
}

PBPokemon.prototype.growthRate=function(){
    return PBGrowthRates.getId(new PBSpecie(this._species).growth_rate());
}
PBPokemon.prototype.baseExp=function(){
    
}
PBPokemon.prototype.isEgg=function(){
    return this._eggSteps>0;
}
//Nature
PBPokemon.prototype.getNature=function(){
    return this._id%25;
}
//Stat calculation
PBPokemon.prototype.baseStats=function(){
    var theSpecies=new PBSpecie(Number(this._species||1));
    var toReturn = theSpecies.base_stats();
    return toReturn;
}
PBPokemon.prototype.calcHP=function(base,level,iv,ev){
    if(base==1){
        return 1;
    }
    return Math.floor(((base*2+iv+(ev>>2))*level/100))+level+10;
}
PBPokemon.prototype.calcStat=function(base,level,iv,ev,pv){
    return Math.floor(((Math.floor(((base*2+iv+(ev>>2))*level/100))+5)*pv/100));
}
PBPokemon.prototype.calcStats=function(){
    var nat=this.getNature();
    var stats=[];
    var pvalues=[100,100,100,100,100];
    var nd5=Math.floor(nat/5);
    var nm5=Math.floor(nat%5);
    if(nd5!=nm5){
        pvalues[nd5]=110;
        pvalues[nm5]=90;
    }
    var lvl=this._level;
    var bs=this.baseStats();
    for(var i=0; i<6;i++){
        var base=bs[i];
        if(i==0){
            //HP
            stats[i]=this.calcHP(base,lvl,this._iv[i],this._ev[i]);
        }else{
            stats[i]=this.calcStat(base,lvl,this._iv[i],this._ev[i],pvalues[i-1]);
        }
    }
    var diff=this._totalHp-this._hp;
    this._totalHp=stats[0];
    this._hp=this._totalHp-diff;
    if(this._hp<=0){
        this._hp=0;
    }
    if(this._hp>this._totalHp){
        this._hp=this._totalHp;
    }
    this._attack=stats[1];
    this._defense=stats[2];
    this._speed=stats[3];
    this._spatk=stats[4];
    this._spdef=stats[5];
    
}
PBPokemon.factory={
    defaultFactoryOptions:{
        specie:1,
        level:3,
        trainer:null,
        with_moves:true
    },
    _generateId:function(){
        var toRet=Math.floor(Math.random() * 256);
        toRet=Math.floor(Math.random() * 256);
        toRet|=Math.floor(Math.random() * 256)<<8;
        toRet|=Math.floor(Math.random() * 256)<<16;
        toRet|=Math.floor(Math.random() * 256)<<24;
        return toRet;
    },
    new:function(factoryOpts){
        var opts=PBPokemon.factory.defaultFactoryOptions;
        if(factoryOpts!=undefined && factoryOpts!=null){
            for (var option in factoryOpts) {
                if (factoryOpts.hasOwnProperty(option) && opts.hasOwnProperty(option)) {
                    opts[option]=factoryOpts[option];
                }
            }
        }
        var toRet=new PBPokemon();
        var theSpecies=new PBSpecie(Number(opts.specie||1));
        toRet._hp=1;
        toRet._totalHp=1;
        toRet._iv=[];
        for(var i=0; i<6;i++){
            toRet._iv.push(Math.floor(Math.random() * 32));
        }
        toRet._ev=[0,0,0,0,0,0];
        toRet._species=theSpecies.id();
        toRet._id=PBPokemon.factory._generateId();
        toRet._name=theSpecies.name();
        if(opts.trainer!=null){
            toRet._trainerId=opts.trainer.id();
            toRet._ot=opts.trainer.name();
            toRet._otGender=opts.trainer.gender();
        }else{
            toRet._trainerId=0;
            toRet._ot="";
            toRet._otGender=2;
        }
        if($gameMap!=undefined && $gameMap!=null){
            toRet._obtainMap=$gameMap.mapId();
            toRet._obtainText=null;
        }else{
            toRet._obtainMap=0;
            toRet._obtainText=null;
        }
        toRet._obtainLevel=opts.level;
        toRet._timeReceived=$PBTime._currentTime;
        toRet.setLevel(opts.level);
        toRet.calcStats();
        toRet._happiness=theSpecies.happiness();


        return toRet;
    },
    fromJSON:function(elJSON){
        var toRet=new PBPokemon();
        for (var jsonProp in elJSON) {
            if (elJSON.hasOwnProperty(jsonProp)) {
                toRet[jsonProp]=elJSON[jsonProp];
            }
        }
        return toRet;
    }
}