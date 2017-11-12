function PBPlayer() {
    this.initialize.apply(this, arguments);
}
//Shared container for overrided functions.
PBPlayer.overrides={};
PBPlayer.prototype = Object.create(Object.prototype);
PBPlayer.prototype.constructor = PBPlayer;

PBPlayer.prototype.initialize = function() {
    //Object.prototype.initialize.call(this);
    this._name="Red";
    this._trainerType=0;
    this._id=null;
    this._gemder=2;
    this._money=0;
    this._badges=[[false,false,false,false,false,false,false,false]];
    this._pokegear=false;
    this._pokedex=false;
    this._seenPokemon=[];
    this._ownedPokemon=[];
    this._party=[];
};
PBPlayer.prototype.fullName=function(){
    
};
PBPlayer.prototype.name=function(){
    
};
PBPlayer.prototype.id=function(){
    
};
PBPlayer.prototype.publicId=function(){
    
};
PBPlayer.prototype.secretId=function(){
    
};
PBPlayer.prototype.trainerType=function(){
    
};
PBPlayer.prototype.gender=function(){
    
};
PBPlayer.prototype.money=function(){
    
};
PBPlayer.prototype.badges=function(region, badge){
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
