function PBTrainer() {
    this.initialize.apply(this, arguments);
}
//Shared container for overrided functions.
PBTrainer.overrides={};
PBTrainer.prototype = Object.create(Object.prototype);
PBTrainer.prototype.constructor = PBTrainer;

PBTrainer.prototype.initialize = function() {
    //Object.prototype.initialize.call(this);
    this._name="Red";
    this._trainerType=0;
    this._id=null;
    this._gender=2;
    this._money=0;
    this._badges=[[false,false,false,false,false,false,false,false]];
    this._pokegear=false;
    this._pokedex=false;
    this._seenPokemon=[];
    this._ownedPokemon=[];
    this._party=[];
};
PBTrainer.prototype.trainerTypeName=function(){
    return new PBTrainerType(this.trainerType()).name();
}
PBTrainer.prototype.fullName=function(){
    return this.trainerTypeName()+" "+this.name();
};
PBTrainer.prototype.name=function(){
    return this._name;
};
PBTrainer.prototype.id=function(){
    return this._id;
};
//Trainer card visible id part
PBTrainer.prototype.publicId=function(overrideId){
    return (overrideId ? overrideId&0xFFFF : this.id()&0xFFFF);
};
//Non visible id part
PBTrainer.prototype.secretId=function(overrideId){
    return (overrideId ? overrideId>>16 : this.id()>>16)
};
PBTrainer.prototype.getForeignId=function(){
    var choosenId=0;
    do{
        choosenId=PBTrainer.factory._generateId();
    }while(choosenId==this.id());
    return choosenId;
};
//Money earned by defeating this trainer
PBTrainer.prototype.moneyEarned=function(){
    return new PBTrainerType(this.trainerType()).money();
};
//Skill level for AI
PBTrainer.prototype.skill=function(){
    return new PBTrainerType(this.trainerType()).skill_level();
};
//Skill code for AI
PBTrainer.prototype.skill=function(){
    return new PBTrainerType(this.trainerType()).skill_code();
};
PBTrainer.prototype.trainerType=function(){
    return this._trainerType;
};
PBTrainer.prototype.gender=function(){
    return this._gender;
};
PBTrainer.prototype.money=function(){
    return this._money;
};
PBTrainer.prototype.isMale=function(){
    return this._gender==0;
};
PBTrainer.prototype.isFemale=function(){
    return this._gender==1;
};
PBTrainer.prototype.pokemonParty=function(){
    return this._party.filter(function(each){
        return !each.isEgg();
    });
};
PBTrainer.prototype.pokemonCount=function(){
    return this.pokemonParty().length;
};
PBTrainer.prototype.ablePokemonParty=function(){
    return this._party.filter(function(each){
        return !each.isEgg() && each.hp>0;
    });
};
PBTrainer.prototype.ablePokemonCount=function(){
    return this.ablePokemonParty().length;
};
PBTrainer.prototype.hasSeen=function(){
    
};
PBTrainer.prototype.hasOwned=function(){

};
PBTrainer.prototype.setSeen=function(){
    
};
PBTrainer.prototype.setOwned=function(){

};
PBTrainer.prototype.badges=function(region, badge){
    if(region==undefined || region==null || region==0){
        if(badge==undefined || badge==null){
            return this._badges;
        }else{
            return this._badges[0][badge];
        }
    }else{
        if(badge==undefined || badge==null){
            return this._badges[region];
        }else{
            return this._badges[region][badge];
        }
    }
    return null;
};

PBTrainer.factory={
    defaultFactoryOptions:{
        name:"",
        trainerType:1,
        is_player:false
    },
    _generateId:function(){
        var toRet=0;
        toRet=Math.floor(Math.random() * 256);
        toRet|=Math.floor(Math.random() * 256)<<8;
        toRet|=Math.floor(Math.random() * 256)<<16;
        toRet|=Math.floor(Math.random() * 256)<<24;
        return toRet;
    },
    new:function(factoryOpts){
        var opts=PBTrainer.factory.defaultFactoryOptions;
        if(factoryOpts!=undefined && factoryOpts!=null){
            for (var option in factoryOpts) {
                if (factoryOpts.hasOwnProperty(option) && opts.hasOwnProperty(option)) {
                    opts[option]=factoryOpts[option];
                }
            }
        }
        var toRet=new PBTrainer();
        toRet._name=opts.name;
        toRet._trainerType=opts.trainerType;
        toRet._id=PBTrainer.factory._generateId();
        return toRet;
    },
    fromJSON:function(elJSON){
        var toRet=new PBTrainer();
        for (var jsonProp in elJSON) {
            if (elJSON.hasOwnProperty(jsonProp)) {
                toRet[jsonProp]=elJSON[jsonProp];
            }
        }
        return toRet;
    }
}