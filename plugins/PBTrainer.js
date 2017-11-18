/*~struct~PointInMap:
 * @param MapID
 * @text Map ID
 * @desc ID of the map
 * @type number
 * @min 1
 * @default 1
 * 
 * @param X
 * @text Position X
 * @desc Horizontal position
 * @type number
 * @min 1
 * @default 1
 * 
 * @param Y
 * @text Position Y
 * @desc Vertical position
 * @type number
 * @min 1
 * @default 1
 * 
 * 
*/
/*~struct~PlayerCharacterMeta:
 * @param TrainerType
 * @text Trainer type
 * @desc Trainer type
 * @type number
 * @min 1
 * @default 1
 * 
 * @param WalkingCharset
 * @text Walking charset
 * @desc Walking charset
 * @type file
 * @path img/characters/
 * 
 * @param CyclingCharset
 * @text Cycling charset
 * @desc Cycling charset
 * @type file
 * @path img/characters/
 * 
 * @param SurfingCharset
 * @text Surfing charset
 * @desc Surfing charset
 * @type file
 * @path img/characters/
 * 
 * @param RunningCharset
 * @text Running charset
 * @desc Running charset
 * @type file
 * @path img/characters/
 * 
 * @param DivingCharset
 * @text Diving charset
 * @desc Diving charset
 * @type file
 * @path img/characters/
 * 
 * @param FishingCharset
 * @text Fishing charset
 * @desc Fishing charset
 * @type file
 * @path img/characters/
 * 
 * @param FishingSurfingCharset
 * @text Fishing surfing charset
 * @desc Fishing surfing charset
 * @type file
 * @path img/characters/
 * 
 * 
*/
/*:
* @plugindesc Trainer classes and player metadata
* @author ctrl.alt.supr (git.ctrl.alt.supr@gmail.com)
*
* @help .
*
* @param CatPlayerMeta
* @text Player metadata
*
* @param PlayableCharacters
* @text Player characters
* @type struct<PlayerCharacterMeta>[]
* @parent CatPlayerMeta 
* @default ["{\"TrainerType\":\"1\",\"WalkingCharset\":\"img/characters/boy_walking\",\"CyclingCharset\":\"img/characters/boy_cycling\",\"SurfingCharset\":\"img/characters/boy_surfing\",\"RunningCharset\":\"img/characters/boy_running\",\"DivingCharset\":\"img/characters/boy_diving\",\"FishingCharset\":\"img/characters/boy_fishing\",\"FishingSurfingCharset\":\"img/characters/boy_fishingsurfing\"}"]
*
* @param Home
* @text Home position
* @desc Place where the player blackouts to when no pokecenter visited yet.
* @type struct<PointInMap>
* @parent CatPlayerMeta
* @default {"MapID":"1","X":"1","Y":"1"}
*
*/

var parameters = PluginManager.parameters('PBTrainer');

function PBTrainer() {
    this.initialize.apply(this, arguments);
}

PBTrainer.playerMeta={
    homeMapPos:JSON.parse(String(parameters['Home'] || '{"MapID":"1","X":"1","Y":"1"}')),
    playableCharacters:JSON.parse(String(parameters['PlayableCharacters'] || '[{"TrainerType":"1","WalkingCharset":"boy_walking","CyclingCharset":"boy_cycling","SurfingCharset":"boy_surfing","RunningCharset":"boy_running","DivingCharset":"boy_diving","FishingCharset":"boy_fishing","FishingSurfingCharset":"boy_fishingsurfing"}]')),
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
var setPlayerCharacter=function(playerCharacterId){
    
}
var askPlayerName=function(oldName){
    
}
var setupPlayer=function(playerCharacterId, name){
    window["$Trainer"]=PBTrainer.factory.new({
        name:name,
        trainerType:1,
        is_player:true
    });
    if(playerCharacterId!=undefined && playerCharacterId!=null){
        setPlayerCharacter(playerCharacterId);
    }else{
        setPlayerCharacter(0);
    }
    if(name==undefined || name==null){
        askPlayerName();
    }
}