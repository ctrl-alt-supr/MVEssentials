/*:
 * @plugindesc Export old RPMXP Essentials PBS files as RPMMV Essentials compatible pbs.json files.
 * @author ctrl.alt.supr (git.ctrl.alt.supr@gmail.com)
 *
 * @help Make sure to keep this plugin disabled on release!! This plugin does not provide plugin commands.
 *
 * @param PBSPath
 * @text Relative Path to PBS input directory
 * @desc Relative path to the place where the RPMXP Essentials PBS input files are stored.
 * @default PBS
 * 
 * @param PBSJSONPath
 * @text Relative Path to PBSJSON output directory
 * @desc Relative path to the place where the RPMMV Essentials pbs.json output files should be generated.
 * @default Data/PBS
 * 
 * @param PBSInclude
 * @type combo[]
 * @option pokemon
 * @option abilities
 * @option items
 * @option moves
 * @option berryplants
 * @option trainertypes
 * @option pokemonforms
 * @option types
 * @option trainers
 * @text list of PBS files to process
 * @desc Which files should be processed?
 * @default ["pokemon", "abilities", "items", "moves", "berryplants", "pokemonforms", "trainertypes", "types", "trainers"]
 * 
 */
var parameters = PluginManager.parameters('PBSExporter');
var PBSPath = String(parameters['PBSPath'], "PBS");
var PBSJSONPath = String(parameters['PBSJSONPath'], "Data/PBS");
var PBSInclude_json = String(parameters['PBSInclude'], '["pokemon"]');
var PBSInclude = JSON.parse(PBSInclude_json);
PBSExporter={
    Pending:[],
    Text:"",
    Start:function(){
        PBSExporter.Text="Starting import from '"+PBSPath+"'";
        PBSExporter.Pending=JSON.parse(JSON.stringify(PBSInclude));
        PBSExporter.Process();
    },
    Process:function(){
        if(PBSExporter.Pending.length>0){
            PBSExporter.ReadFile(PBSPath+"/", PBSExporter.Pending[0], function(){
                PBSExporter.Pending.shift();
                PBSExporter.Process();
            });
        }else{
            PBSExporter.Text="Finished exporting. Check: '"+PBSJSONPath+"'";
        }
    },
    ReadFile:function(tPath, tName, okCallback, koCallback){
        var filePath=tPath+tName+".txt";
        PBSExporter.Text="Now loading: '"+filePath+"'";
        var blob = null;
        var xhr = new XMLHttpRequest(); 
        xhr.open("GET", filePath); 
        xhr.responseType = "blob";//force the HTTP response, response-type header to be blob
        xhr.onload = function() 
        {
            blob = xhr.response;//xhr.response is now a blob object
            var myReader = new FileReader(); 
            PBSExporter.Text="Reading: '"+filePath+"'";
            myReader.addEventListener("loadend", function(e){
                var str = e.srcElement.result;
                PBSExporter.Text="Read!: '"+filePath+"'";
                PBSExporter.Text="Converting : '"+filePath+"'";
                var converted=PBSExporter.Convert(tName, str);
                PBSExporter.Text="Saving exported file to : '"+PBSJSONPath+"/"+tName+".pbs.json'";
                PBSExporter._SaveToLocalFile(JSON.stringify(converted, null, "\t"),tName);
                PBSExporter.Text="File exported!: '"+PBSJSONPath+"/"+tName+".pbs.json'";
                okCallback();
                console.log(str);
            });
            myReader.readAsText(blob);
        }
        xhr.send();
    },
    ConvertInfo:{
        pokemon:{
            type:"titledproperties",
            columns:{
                id:"id",
                Name:"name",
                InternalName:"internal_name",
                Type1:"type_1",
                Type2:"type_2",
                BaseStats:"base_stats",
                GenderRate:"gender_rate",
                GrowthRate:"growth_rate",
                BaseEXP:"base_exp",
                EffortPoints:"effort_points",
                Rareness:"rareness",
                Happiness:"happiness",
                Moves:"moves",
                Compatibility:"compatibility",
                StepsToHatch:"steps_to_hatch",
                Height:"height",
                Weight:"weight",
                Color:"color",
                Shape:"shape",
                Kind:"kind",
                Pokedex:"pokedex",
                Abilities:"abilities",
                HiddenAbility:"hidden_ability",
                EggMoves:"egg_moves",
                Habitat:"habitat",
                RegionalNumbers:"regional_numbers",
                WildItemCommon:"wild_item_common",
                WildItemUncommon:"wild_item_uncommon",
                WildItemRare:"wild_item_rare",
                BattlerPlayerY:"battler_player_y",
                BattlerEnemyY:"battler_enemy_y",
                BattlerAltitude:"battler_altitude",
                Evolutions:"evolutions",
                FormName:"form_name",
                Incense:"incense"
            }
        },
        metadata:{
            type:"metadata",
            columns:[
                {
                    PlayerA:"player_0",
                    PlayerB:"player_1",
                    PlayerC:"player_2",
                    PlayerD:"player_3",
                    PlayerE:"player_4",
                    PlayerF:"player_5",
                    PlayerG:"player_6",
                    Home:"home",
                    BicycleBGM:"bycicle_bgm",
                    SurfBGM:"surf_bgm",
                    WildBattleBGM:"wild_battle_bgm",
                    TrainerBattleBGM:"trainer_battle_bgm",
                    WildVictoryME:"wild_victory_me",
                    TrainerVictoryME:"trainer_victory_me",
                },{
                    Outdoor:"outdoor",
                    Bicycle:"bicycle",
                    BicycleAlways:"bicycle_always",
                    HealingSpot:"healing_spot",
                    MapPosition:"map_position",
                    ShowArea:"show_name",
                    Weather:"weather",
                    DarkMap:"dark",
                    DiveMap:"dive_map",
                    SafariMap:"safari",
                    BattleBack:"battleback",
                    WildBattleBGM:"wild_battle_bgm",
                    TrainerBattleBGM:"trainer_battle_bgm",
                    WildVictoryME:"wild_victory_me",
                    TrainerVictoryME:"trainer_victory_me",
                }]
            }
        },
        trainers:{
            type:"trainers",
            columns:[
                "specie", "lvl", "held_item", "move_1", "move_2", "move_3", "move_4", "ability", "gender", "form", "shininess", "nature", "iv", "happiness", "nickname", "shadow", "ball"
            ]
        },
        types:{
            type:"titledproperties",
            columns:{
                id:"id",
                Name:"name",
                InternalName:"internal_name",
                Weaknesses:"weaknesses",
                Resistances:"resistances",
                Immunities:"immunities",
                IsSpecialType:"is_special",
                IsPseudoType:"is_pseudo"
            }
        },
        pokemonforms:{
            type:"subidtitledproperties",
            columns:{
                InternalName:"internal_name",
                id:"form_id",
                Type1:"type_1",
                Type2:"type_2",
                BaseStats:"base_stats",
                BaseEXP:"base_exp",
                EffortPoint:"effort_points",
                Rareness:"rareness",
                Happiness:"happiness",
                Moves:"moves",
                StepsToHatch:"steps_to_hatch",
                Height:"height",
                Weight:"weight",
                Color:"color",
                Shape:"shape",
                Kind:"kind",
                Pokedex:"pokedex",
                Abilities:"abilities",
                HiddenAbility:"hidden_ability",
                EggMoves:"egg_moves",
                habitat:"habitat",
                WildItemCommon:"wild_item_common",
                WildItemUncommon:"wild_item_uncommon",
                WildItemRare:"wild_item_rare",
                BattlerPlayerY:"battler_player_y",
                BattlerEnemyY:"battler_enemy_y",
                BattlerAltitude:"battler_altitude",
                Evolutions:"evolutions",
                FormName:"form_name"
            }
        },
        abilities:{
            type:"csv",
            columns:[
                "id", "internal_name", "name", "desc"
            ]   
        },
        berryplants:{
            type:"id=csv",
            columns:[
                "internal_name", "growth_rate", "moisture_decay_rate", "minimun_yield", "maximun_yield"
            ]   
        },
        items:{
            type:"csv",
            columns:[
                "id", "internal_name", "name", "plural_name", "pocket", "price", "desc", "out_battle_use", "in_battle_use", "special", "TMHM"
            ]
        },
        trainertypes:{
            type:"csv",
            columns:[
                "id", "internal_name", "name", "money", "battle_bgm", "victory_bgm", "intro_me", "gender", "skill_level", "skill_code"
            ]
        },
        moves:{
            type:"csv",
            columns:[
                "id", "internal_name", "name", "function_code", "base_power", "type", "dmg_cat", "accuracy", "total_pp", "extra_fx_chance", "target", "priority", "flags", "description"
            ]
        }
    },
    Convert:function(fileName, inVal){
        const allLines = inVal.split(/\r\n|\n/);
        var res = [];
        if(PBSExporter.ConvertInfo[fileName]!=undefined && PBSExporter.ConvertInfo[fileName]!=null && (PBSExporter.ConvertInfo[fileName].type=="csv" || PBSExporter.ConvertInfo[fileName].type=="id=csv") && PBSExporter.ConvertInfo[fileName].columns.length>0){
            //CSV FILES
            var tCols=PBSExporter.ConvertInfo[fileName].columns;
            allLines.forEach(function(element) {
                var tmpObj={};
                if(element!="" && element.contains(",")){
                    var curVals=element.split(",");
                    if(PBSExporter.ConvertInfo[fileName].type=="id=csv"){
                        var spl=curVals.shift().split("=");
                        curVals.unshift(spl[1]);
                        curVals.unshift(spl[0]);
                    }
                    if(curVals.length==tCols.length){
                        for(var i = 0; i < tCols.length; i++) {
                            tmpObj[tCols[i]]=curVals[i];
                        }
                        res.push(tmpObj);
                    }
                }
            });
        }else if(PBSExporter.ConvertInfo[fileName]!=undefined && PBSExporter.ConvertInfo[fileName]!=null && (PBSExporter.ConvertInfo[fileName].type=="titledproperties" || PBSExporter.ConvertInfo[fileName].type=="subidtitledproperties")){
            var tCols=PBSExporter.ConvertInfo[fileName].columns;
            var tmpObj=null;
            allLines.forEach(function(element) {
                if(element.trim().startsWith("[") && element.trim().endsWith("]")){
                    if(tmpObj!=null){
                        res.push(tmpObj);
                    }
                    tmpObj={};
                    var tId=element.trim().replace("[","");
                    tId=tId.replace("]","");
                    if(PBSExporter.ConvertInfo[fileName].type=="subidtitledproperties"){
                        var spl=tId.split("-");
                        tId=spl[1];
                        tmpObj[tCols["InternalName"]]=spl[0];
                    }
                    tmpObj[tCols["id"]]=tId;
                }if(element!="" && element.contains("=")){
                    var pPrts=element.split("=");
                    tmpObj[tCols[pPrts[0]]]=pPrts[1];
                }
            });
        }else if(PBSExporter.ConvertInfo[fileName]!=undefined && PBSExporter.ConvertInfo[fileName]!=null && (PBSExporter.ConvertInfo[fileName].type=="trainers") && PBSExporter.ConvertInfo[fileName].columns.length>0){
            var tCols=PBSExporter.ConvertInfo[fileName].columns;
            var currentLine=0;
            var pokemonLines=0;
            var tmpObj={};
            var parsePokemonLine=function(laLinea){
                var tmpPokObj={};
                if(laLinea!="" && laLinea.contains(",")){
                    var curVals=laLinea.split(",");
                    if(curVals.length<=tCols.length){
                        for(var i = 0; i < tCols.length; i++) {
                            if(curVals[i]!=undefined){
                                tmpPokObj[tCols[i]]=curVals[i];
                            }
                        }
                    }
                }
                return tmpPokObj;
            };
            allLines.forEach(function(element) {
                if(element.startsWith("#") || element==""){
                    //La linea es un comentario u esta vacia, se ignora
                    return;
                }
                if(currentLine==0){
                    //Estamos en la primera linea que define el tipo de entrenador
                    tmpObj={};
                    tmpObj.type=element.trim();
                    currentLine++;
                }else if(currentLine==1){
                    //Estamos en la segunda linea que define el nombre e id de entrenador
                    var prt=element.trim().split(",");
                    tmpObj.name=prt[0].trim();
                    tmpObj.id=0;
                    if(prt.length>1){
                        tmpObj.id=prt[1].trim();
                    }
                    currentLine++;
                }else if(currentLine==2){
                    //Estamos en la tercera linea que define el numero de pokemons y los objetos de entrenador
                    var prt=element.trim().split(",");
                    pokemonLines=prt[0].trim();
                    tmpObj.items=[];
                    for (i = 1; i < prt.length; i++) { 
                        tmpObj.items.push(prt[i].trim());
                    }
                    tmpObj.pokemon=[];
                    currentLine++;
                }else if(Number(pokemonLines)>0 && currentLine==Number(pokemonLines)+2){
                    //Estamos en la linea del ultimo pokemon
                    var pkinfo=parsePokemonLine(element);
                    if(pkinfo!=null && pkinfo!={}){
                        tmpObj.pokemon.push(pkinfo);
                    }
                    res.push(tmpObj);
                    pokemonLines=0;
                    currentLine=0;
                }else if(Number(pokemonLines)>0){
                    //Estamos en una linea de definicion de un pokemon que no es el ultimo del entrenador.
                    var pkinfo=parsePokemonLine(element);
                    if(pkinfo!=null && pkinfo!={}){
                        tmpObj.pokemon.push(pkinfo);
                    }
                    currentLine++;
                }else{
                    //Si se ha llegado aqui, el formato del entrenador actual no es correcto, asi que se ignora lo que se tiene sobre el y se pasa a la siguiente linea
                    pokemonLines=0;
                    currentLine=0;
                }
            });
        }
        return res;
    },
    _SaveToLocalFile: function(dataToSave, name) {
        var data = dataToSave;
        var fs = require('fs');
        var dirPath = PBSExporter._LocalFileDirectoryPath();
        var filePath = PBSExporter._LocalFilePath(name);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        fs.writeFileSync(filePath, data);
    },
    _LocalFileDirectoryPath : function() {
        var path = require('path');
    
        var base = path.dirname(process.mainModule.filename);
        return path.join(base, PBSJSONPath+"/");
    },
    
    _LocalFilePath : function(fileName) {
        var name = fileName+'.pbs.json';
        return PBSExporter._LocalFileDirectoryPath() + name;
    }
}
//-----------------------------------------------------------------------------
// Window_ExportProgress
//
// The window for displaying the party's gold.

function Window_ExportProgress() {
    this.initialize.apply(this, arguments);
}

Window_ExportProgress.prototype = Object.create(Window_Base.prototype);
Window_ExportProgress.prototype.constructor = Window_ExportProgress;

Window_ExportProgress.prototype.initialize = function(x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
    PBSExporter.Start();
};

Window_ExportProgress.prototype.windowWidth = function() {
    return Graphics.width-4;
};

Window_ExportProgress.prototype.windowHeight = function() {
    return this.fittingHeight(1);
};

Window_ExportProgress.prototype.refresh = function() {
    
    var width = this.contents.width - this.textPadding() * 2;
    this.contents.clear();
    
    //this.drawCurrencyValue(this.value(), this.currencyUnit(), x, 0, width);
};

Window_ExportProgress.prototype.update=function(){
    Window_Base.prototype.update.call(this);
    this.contents.clear();
    var x = this.textPadding();
    this.drawTextEx(this.value(), x, 0);
}

Window_ExportProgress.prototype.value = function() {
    return PBSExporter.Text;
};


Window_ExportProgress.prototype.open = function() {
    this.refresh();
    Window_Base.prototype.open.call(this);
};


//-----------------------------------------------------------------------------
// Scene_Title
//
// The scene class of the title screen.
Scene_Title.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createBackground();
    this.createForeground();
    this.createWindowLayer();
    this._progressWindow=new Window_ExportProgress(2, Graphics.height/2);
    this.addChild(this._progressWindow);
};
Scene_Title.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    SceneManager.clearStack();
    this.centerSprite(this._backSprite1);
    this.centerSprite(this._backSprite2);
    this.startFadeIn(this.fadeSpeed(), false);
};
Scene_Title.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
};
Scene_Title.prototype.isBusy = function() {
    return Scene_Base.prototype.isBusy.call(this);
};
Scene_Title.prototype.createBackground = function() {
    this._backSprite1 = new Sprite();//ImageManager.loadTitle1($dataSystem.title1Name));
    this._backSprite2 = new Sprite();//ImageManager.loadTitle2($dataSystem.title2Name));
    this.addChild(this._backSprite1);
    this.addChild(this._backSprite2);
};

Scene_Title.prototype.createForeground = function() {
    this._gameTitleSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
    this.addChild(this._gameTitleSprite);
    if ($dataSystem.optDrawTitle) {
        this.drawGameTitle();
    }
};
Scene_Title.prototype.drawGameTitle = function() {
    var x = 20;
    var y = Graphics.height / 4;
    var maxWidth = Graphics.width - x * 2;
    var text = "PBS export in progress...";
    this._gameTitleSprite.bitmap.outlineColor = 'black';
    this._gameTitleSprite.bitmap.outlineWidth = 8;
    this._gameTitleSprite.bitmap.fontSize = 72;
    this._gameTitleSprite.bitmap.drawText(text, x, y, maxWidth, 48, 'center');
};

