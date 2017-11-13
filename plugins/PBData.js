
/*:
 * @plugindesc Objects and classes used to work with data from PBS files
 * @author ctrl.alt.supr (git.ctrl.alt.supr@gmail.com)
 *
 * @help .
 *
 * @param CategoryGeneric
 * @text General settings
 * @default ------
 * 
 * 
 */

//-----------------------------------------------------------------------------
// PBSpecies
//
// An structure containing species data extracted from the PBS file 
var PBSpecies={
    enum:{

    },
    data:[],
    getName:function(id){
        var aDev=null;
        aDev=Object.keys(PBSpecies.enum).filter(function(each){
            return PBSpecies.enum[each]==id;
        });
        if(aDev.length==1){
            aDev=aDev[0];
        }
        return aDev;
    },
    getId:function(name){
        var aDev=null;
        aDev=PBSpecies.enum[name];
        return aDev;
    },
    getCount:function(){
        return Object.keys(PBSpecies.enum).length;
    },
    _filename:"PBS/pokemon.pbs.json"
}
//-----------------------------------------------------------------------------
// PBSpecie
//
// An class representing a pokemon species 
var PBSpecie=function(theId){
    this._id=theId;
    this._data=null;
    this._getData=function(noCache){
        if(noCache || this._data==null){
            var slf=this;
            var toRet = PBSpecies.data.filter(function(cdata){
                return cdata.id==slf._id;
            });
            if(toRet.length>0){
                this._data=toRet[0];
            }else{
                this._data=null;
            }   
        }
        return this._data;
    };
    this.id=function(){
        return this._id || null;
    };
    this.name=function(){
        var data=this._getData();
        return data.name || null;
    };
    this.internal_name=function(){
        var data=this._getData();
        return data.internal_name || null;
    };
    this.types=function(){
        var data=this._getData();
        return [data.type_1, data.type_2] || null;
    };
    this.base_exp=function(){
        var data=this._getData();
        return data.base_exp || null;
    };
    this.rareness=function(){
        var data=this._getData();
        return data.rareness || null;
    };
    this.happiness=function(){
        var data=this._getData();
        return data.happiness || null;
    };
    this.compatibility=function(){
        var data=this._getData();
        return data.compatibility || null;
    };
    this.steps_to_hatch=function(){
        var data=this._getData();
        return data.steps_to_hatch;
    };
    this.height=function(){
        var data=this._getData();
        return data.height || null;
    };
    this.weight=function(){
        var data=this._getData();
        return data.weight || null;
    };
    this.color=function(){
        var data=this._getData();
        return data.color || null;
    };
    this.shape=function(){
        var data=this._getData();
        return data.shape || null;
    };
    this.kind=function(){
        var data=this._getData();
        return data.kind || null;
    };
    this.pokedex=function(){
        var data=this._getData();
        return data.pokedex || null;
    };
    this.battler_player_y=function(){
        var data=this._getData();
        return data.battler_player_y || null;
    };
    this.battler_enemy_y=function(){
        var data=this._getData();
        return data.battler_enemy_y || null;
    };
    this.battler_altitude=function(){
        var data=this._getData();
        return data.battler_altitude;
    };
    this.evolutions=function(){
        var data=this._getData();
        return data.evolutions || null;
    };
    this.moves=function(){
        var data=this._getData();
        return data.moves || null;
    };
    this.egg_moves=function(){
        var data=this._getData();
        return data.egg_moves || null;
    };
    this.abilities=function(){
        var data=this._getData();
        return data.abilities || null;
    };
    this.hidden_ability=function(){
        var data=this._getData();
        return data.hidden_ability || null;
    };
    this.gender_rate=function(){
        var data=this._getData();
        return data.gender_rate || null;
    };
    this.growth_rate=function(){
        var data=this._getData();
        return data.growth_rate || null;
    };
    this.habitat=function(){
        var data=this._getData();
        return data.habitat || null;
    };
    this.base_stats=function(){
        var data=this._getData();
        return (data.base_stats || "0,0,0,0,0,0").split(",");
    };
    
}
//-----------------------------------------------------------------------------
// PBItems
//
// An structure containing items data extracted from the PBS file 
var PBItems={
    enum:{

    },
    data:[],
    getName:function(id){
        var aDev=null;
        aDev=Object.keys(PBItems.enum).filter(function(each){
            return PBItems.enum[each]==id;
        });
        if(aDev.length==1){
            aDev=aDev[0];
        }
        return aDev;
    },
    getId:function(name){
        var aDev=null;
        aDev=PBItems.enum[name];
        return aDev;
    },
    getCount:function(){
        return Object.keys(PBItems.enum).length;
    },
    _filename:"PBS/items.pbs.json"
}
//-----------------------------------------------------------------------------
// PBItem
//
// An class representing an item 
var PBItem=function(theId){
    this._id=theId;
    this._data=null;
    this._getData=function(noCache){
        if(noCache || this._data==null){
            var slf=this;
            var toRet = PBItems.data.filter(function(cdata){
                return cdata.id==slf._id;
            });
            if(toRet.length>0){
                this._data=toRet[0];
            }else{
                this._data=null;
            }   
        }
        return this._data;
    };
    this.id=function(){
        return this._id || null;
    };
    this.name=function(){
        var data=this._getData();
        return data.name || null;
    };
    this.internal_name=function(){
        var data=this._getData();
        return data.internal_name || null;
    };
    this.plural_name=function(){
        var data=this._getData();
        return data.plural_name || null;
    };
    this.pocket=function(){
        var data=this._getData();
        return data.pocket || null;
    };
    this.price=function(){
        var data=this._getData();
        return data.price || null;
    };
    this.desc=function(){
        var data=this._getData();
        return data.desc || null;
    };
    this.out_battle_use=function(){
        var data=this._getData();
        return data.out_battle_use || null;
    };
    this.in_battle_use=function(){
        var data=this._getData();
        return data.in_battle_use || null;
    };
    this.special=function(){
        var data=this._getData();
        return data.special || null;
    };
    this.TMHM=function(){
        var data=this._getData();
        return data.TMHM || null;
    };
    
}

//-----------------------------------------------------------------------------
// PBMoves
//
// An structure containing move data extracted from the PBS file 
var PBMoves={
    enum:{

    },
    data:[],
    getName:function(id){
        var aDev=null;
        aDev=Object.keys(PBMoves.enum).filter(function(each){
            return PBMoves.enum[each]==id;
        });
        if(aDev.length==1){
            aDev=aDev[0];
        }
        return aDev;
    },
    getId:function(name){
        var aDev=null;
        aDev=PBMoves.enum[name];
        return aDev;
    },
    getCount:function(){
        return Object.keys(PBMoves.enum).length;
    },
    _filename:"PBS/moves.pbs.json"
}

//-----------------------------------------------------------------------------
// PBItem
//
// An class representing a move 
var PBMove=function(theId){
    this._id=theId;
    this._data=null;
    this._getData=function(noCache){
        if(noCache || this._data==null){
            var slf=this;
            var toRet = PBMoves.data.filter(function(cdata){
                return cdata.id==slf._id;
            });
            if(toRet.length>0){
                this._data=toRet[0];
            }else{
                this._data=null;
            }   
        }
        return this._data;
    };
    this.id=function(){
        return this._id || null;
    };
    this.name=function(){
        var data=this._getData();
        return data.name || null;
    };
    this.internal_name=function(){
        var data=this._getData();
        return data.internal_name || null;
    };
    this.function_code=function(){
        var data=this._getData();
        return data.function_code || null;
    };
    this.base_power=function(){
        var data=this._getData();
        return data.base_power || null;
    };
    this.type=function(){
        var data=this._getData();
        return data.type || null;
    };
    this.dmg_cat=function(){
        var data=this._getData();
        return data.dmg_cat || null;
    };
    this.accuracy=function(){
        var data=this._getData();
        return data.accuracy || null;
    };
    this.total_pp=function(){
        var data=this._getData();
        return data.total_pp || null;
    };
    this.extra_fx_chance=function(){
        var data=this._getData();
        return data.extra_fx_chance || null;
    };
    this.target=function(){
        var data=this._getData();
        return data.target || null;
    };
    this.priority=function(){
        var data=this._getData();
        return data.priority || null;
    };
    this.flags=function(){
        var data=this._getData();
        return data.flags || null;
    };
    this.description=function(){
        var data=this._getData();
        return data.description || null;
    };
    
}

//-----------------------------------------------------------------------------
// PBAbilities
//
// An structure containing ability data extracted from the PBS file 
var PBAbilities={
    enum:{

    },
    data:[],
    getName:function(id){
        var aDev=null;
        aDev=Object.keys(PBAbilities.enum).filter(function(each){
            return PBAbilities.enum[each]==id;
        });
        if(aDev.length==1){
            aDev=aDev[0];
        }
        return aDev;
    },
    getId:function(name){
        var aDev=null;
        aDev=PBAbilities.enum[name];
        return aDev;
    },
    getCount:function(){
        return Object.keys(PBAbilities.enum).length;
    },
    _filename:"PBS/abilities.pbs.json"
}

//-----------------------------------------------------------------------------
// PBAbility
//
// An class representing an ability 
var PBAbility=function(theId){
    this._id=theId;
    this._data=null;
    this._getData=function(noCache){
        if(noCache || this._data==null){
            var slf=this;
            var toRet = PBAbilities.data.filter(function(cdata){
                return cdata.id==slf._id;
            });
            if(toRet.length>0){
                this._data=toRet[0];
            }else{
                this._data=null;
            }   
        }
        return this._data;
    };
    this.id=function(){
        return this._id || null;
    };
    this.name=function(){
        var data=this._getData();
        return data.name || null;
    };
    this.internal_name=function(){
        var data=this._getData();
        return data.internal_name || null;
    };
    this.desc=function(){
        var data=this._getData();
        return data.desc || null;
    };
    
}
//-----------------------------------------------------------------------------
// PBTrainerTypes
//
// An structure containing trainertype data extracted from the PBS file 
var PBTrainerTypes={
    enum:{

    },
    data:[],
    getName:function(id){
        var aDev=null;
        aDev=Object.keys(PBTrainerTypes.enum).filter(function(each){
            return PBTrainerTypes.enum[each]==id;
        });
        if(aDev.length==1){
            aDev=aDev[0];
        }
        return aDev;
    },
    getId:function(name){
        var aDev=null;
        aDev=PBTrainerTypes.enum[name];
        return aDev;
    },
    getCount:function(){
        return Object.keys(PBTrainerTypes.enum).length;
    },
    _filename:"PBS/trainertypes.pbs.json"
}

//-----------------------------------------------------------------------------
// PBTrainerType
//
// An class representing a trainertype 
var PBTrainerType=function(theId){
    this._id=theId;
    this._data=null;
    this._getData=function(noCache){
        if(noCache || this._data==null){
            var slf=this;
            var toRet = PBTrainerTypes.data.filter(function(cdata){
                return cdata.id==slf._id;
            });
            if(toRet.length>0){
                this._data=toRet[0];
            }else{
                this._data=null;
            }   
        }
        return this._data;
    };
    this.id=function(){
        return this._id || null;
    };
    this.name=function(){
        var data=this._getData();
        return data.name || null;
    };
    this.internal_name=function(){
        var data=this._getData();
        return data.internal_name || null;
    };
    this.money=function(){
        var data=this._getData();
        return data.money || null;
    };
    this.battle_bgm=function(){
        var data=this._getData();
        return data.battle_bgm || null;
    };
    this.victory_bgm=function(){
        var data=this._getData();
        return data.victory_bgm || null;
    };
    this.intro_me=function(){
        var data=this._getData();
        return data.intro_me || null;
    };
    this.gender=function(){
        var data=this._getData();
        return data.gender || null;
    };
    this.skill_level=function(){
        var data=this._getData();
        return data.skill_level || null;
    };
    this.skill_code=function(){
        var data=this._getData();
        return data.skill_code || null;
    };
    
}

//-----------------------------------------------------------------------------
// PBTypes
//
// An structure containing types data extracted from the PBS file 
var PBTypes={
    enum:{

    },
    data:[],
    getName:function(id){
        var aDev=null;
        aDev=Object.keys(PBTypes.enum).filter(function(each){
            return PBTypes.enum[each]==id;
        });
        if(aDev.length==1){
            aDev=aDev[0];
        }
        return aDev;
    },
    getId:function(name){
        var aDev=null;
        aDev=PBTypes.enum[name];
        return aDev;
    },
    getCount:function(){
        return Object.keys(PBTypes.enum).length;
    },
    _filename:"PBS/types.pbs.json"
}

//-----------------------------------------------------------------------------
// PBType
//
// An class representing a type 
var PBType=function(theId){
    this._id=theId;
    this._data=null;
    this._getData=function(noCache){
        if(noCache || this._data==null){
            var slf=this;
            var toRet = PBTypes.data.filter(function(cdata){
                return cdata.id==slf._id;
            });
            if(toRet.length>0){
                this._data=toRet[0];
            }else{
                this._data=null;
            }   
        }
        return this._data;
    };
    this.id=function(){
        return this._id || null;
    };
    this.name=function(){
        var data=this._getData();
        return data.name || null;
    };
    this.internal_name=function(){
        var data=this._getData();
        return data.internal_name || null;
    };
    this.weaknesses=function(){
        var data=this._getData();
        return data.weaknesses || null;
    };
    this.resistances=function(){
        var data=this._getData();
        return data.resistances || null;
    };
    this.immunities=function(){
        var data=this._getData();
        return data.immunities || null;
    };
    this.is_pseudo=function(){
        var data=this._getData();
        return data.is_pseudo || null;
    };
    this.is_special=function(){
        var data=this._getData();
        return data.is_special || null;
    };
    
}


Scene_Boot.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    DataManager.loadDatabase();
    PBDataManager.loadDatabase();
    ConfigManager.load();
    this.loadSystemWindowImage();
};


//-----------------------------------------------------------------------------
// PBEnviroments
//
// An structure containing battle enviroments 
var PBEnviroments={
    enum:{
        None:0,
        Grass:1,
        TallGrass:2,
        MovingWater:3,
        StillWater:4,
        Underwater:5,
        Cave:6,
        Rock:7,
        Sand:8,
        Forest:9,
        Snow:10,
        Volcano:11,
        Graveyard:12,
        Sky:13,
        Space:14

    },
    getName:function(id){
        var aDev=null;
        aDev=Object.keys(PBEnviroments.enum).filter(function(each){
            return PBEnviroments.enum[each]==id;
        });
        if(aDev.length==1){
            aDev=aDev[0];
        }
        return aDev;
        
    },
    getId:function(name){
        var aDev=null;
        aDev=PBEnviroments.enum[name];
        return aDev;
    },
    getCount:function(){
        return Object.keys(PBEnviroments.enum).length;
    }
}

//-----------------------------------------------------------------------------
// PBDataManager
//
// The static class that manages the database and game objects.

function PBDataManager() {
    throw new Error('This is a static class');
}

PBDataManager._globalId       = 'RPGMV';
PBDataManager._lastAccessedId = 1;
PBDataManager._errorUrl       = null;

PBDataManager._databaseFiles = [
    {container:       PBTypes},
    {container:       PBItems},
    {container:   PBAbilities},
    {container:       PBMoves},
    {container:     PBSpecies},
    {container:PBTrainerTypes}
    
];

PBDataManager.loadDatabase = function() {
    
    for (var i = 0; i < this._databaseFiles.length; i++) {
        var container = this._databaseFiles[i].container;
        this.loadDataFile(container);
    }
};

PBDataManager.loadDataFile = function(container) {
    var xhr = new XMLHttpRequest();
    var url = 'data/' + container._filename;
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
        if (xhr.status < 400) {
            if(container==null){
                container=window;
            }
            container["data"] = JSON.parse(xhr.responseText);
            DataManager.onLoad(container["data"]);
            PBDataManager.loadEnumFromData(container);
        }
    };
    xhr.onerror = this._mapLoader || function() {
        DataManager._errorUrl = DataManager._errorUrl || url;
    };
    if(container==null){
        container=window;
    }
    container["data"] = null;
    xhr.send();
};
PBDataManager.loadEnumFromData = function(container) {
    var elEnum={};
    var enumkeys=["internal_name","id"];
    if(container.enumkeys!=undefined && container.enumkeys!=null && container.enumkeys.length==2){
        enumkeys=container.enumkeys;
    }
    container["data"].forEach(function(element) {
        try{
           elEnum[element[enumkeys[0]]]=element[enumkeys[1]]; 
        }catch(ex){
            console.error("Paso algo al añadir al enum");
            console.error(ex);
        }
        
    });
    container["enum"]=elEnum;
}
PBDataManager.isDatabaseLoaded = function() {
    this.checkError();
    for (var i = 0; i < this._databaseFiles.length; i++) {
        var elContainer=this._databaseFiles[i].container;
        if(elContainer==null){
            elContainer=window;
        }
        if (!elContainer[this._databaseFiles[i].name]) {
            return false;
        }
    }
    return true;
};
