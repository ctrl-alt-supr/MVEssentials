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
PBTrainer.prototype.fullName=function(){
    
};
PBTrainer.prototype.name=function(){
    return this._name;
};
PBTrainer.prototype.id=function(){
    return this._id;
};
PBTrainer.prototype.publicId=function(){
    
};
PBTrainer.prototype.secretId=function(){
    
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


function PBTrainerPlayer() {
    this.initialize.apply(this, arguments);
}
//Shared container for overrided functions.
PBTrainerPlayer.overrides={};
PBTrainerPlayer.prototype = Object.create(PBTrainer.prototype);
PBTrainerPlayer.prototype.constructor = PBTrainerPlayer;

PBTrainerPlayer.prototype.initialize = function() {
    PBTrainer.prototype.initialize.call(this);
    
};

function PBTrainerNPC() {
    this.initialize.apply(this, arguments);
}
//Shared container for overrided functions.
PBTrainerNPC.overrides={};
PBTrainerNPC.prototype = Object.create(PBTrainer.prototype);
PBTrainerNPC.prototype.constructor = PBTrainerNPC;

PBTrainerNPC.prototype.initialize = function() {
    PBTrainer.prototype.initialize.call(this);
    
};