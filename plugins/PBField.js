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

/*~struct~WeatherConfig:
 * @param WeatherType
 * @text Weather type
 * @desc Type of the weather for this entry
 * @type select
 * @option None (Default)
 * @value 0
 * @option Rain
 * @value 1
 * @option Storm
 * @value 2
 * @option Snow
 * @value 3
 * @option Sandstorm
 * @value 4
 * @option Sunny
 * @value 5
 * @default 0
 * 
 * @param Chance
 * @text Chance of this weather type
 * @desc Horizontal position
 * @type number
 * @min 1
 * @max 100
 * @default 100
 * 
*/

/*~struct~MapMeta:
 * @param MapID
 * @text Map ID
 * @desc ID of the map this entry refers to
 * @type number
 * @min 1
 * @default 1
 * 
 * @param Outdoor
 * @text Is outdoor?
 * @desc Does this map represent an outdoor map?
 * @type boolean
 * @default true
 * 
 * @param Bycicle
 * @text Can use bycicle
 * @desc Can bycicles be used in the map with this id?
 * @type select
 * @option Default (Yes if outdoor)
 * @value -1
 * @option Yes
 * @value 1
 * @option No
 * @value 0
 * @default -1
 * 
 * @param BycicleAlways
 * @text Always bike?
 * @desc Does this map force the player to mount?
 * @type boolean
 * @default false
 * 
 * @param HealingSpot
 * @text Healing spot
 * @desc Healing spot to set when entering this map if any. Supr over this entry to clear the value.
 * @type struct<PointInMap>
 * 
 * @param ShowArea
 * @text Show name?
 * @desc Show area name window on this map?
 * @type boolean
 * @default true
 * 
 * @param Weather
 * @text Weather
 * @type struct<WeatherConfig>[]
 * 
 * @param DarkMap
 * @text Is dark?
 * @desc Is this a dark map? (cave that needs Flash...)
 * @type boolean
 * @default false
 * 
 * @param DiveMap
 * @text Dive map ID
 * @desc ID of the map diving in this map teleports you to. 0 for none.
 * @type number
 * @min 0
 * @default 0
 * 
 * @param SafariMap
 * @text Is safari?
 * @desc Is this map part of the safari zone?
 * @type boolean
 * @default false
 * 
 * @param BattleBack
 * @text Battle back
 * @type file
 * @dir img/
 * 
 * @param WildBattleBGM
 * @text Wild battle sound
 * @type file
 * @dir audio/bgm/
 * 
 * @param TrainerBattleBGM
 * @text Trainer battle sound
 * @type file
 * @dir audio/bgm/
 * 
 * @param WildVictoryME
 * @text Wild victory sound
 * @type file
 * @dir audio/me/
 * 
 * @param TrainerVictoryME
 * @text Trainer victory sound
 * @type file
 * @dir audio/me/
 * 
 * 
 */
/*:
 * @plugindesc Contains functions, classes and settings relative to most of the things happening in the overworld
 * @author ctrl.alt.supr (git.ctrl.alt.supr@gmail.com)
 * 
 * @help This plugin does not provide plugin commands.
 * 
 * @param CategoryMapNameWindow
 * @text Map Name Window
 * 
 * @param MapNameWindowAnimationType
 * @text Show/hide animation type
 * @desc How animate in/out the map name window?
 * @type select
 * @option From top (Essentials default)
 * @value 1
 * @option From left
 * @value 2
 * @option Fade (MV default)
 * @value 0
 * @option None
 * @value 3
 * @default 1
 * @parent CategoryMapNameWindow
 * 
 * @param MapNameWindowAnimationSpeed
 * @text Show/hide animation speed
 * @desc How fast to animate in/out the map name window? (Higher is faster)
 * @type number
 * @decimals 2
 * @default 2.00
 * @min 1
 * @parent CategoryMapNameWindow
 * 
 * @param MapNameWindowShowDuration
 * @text Duration
 * @desc How many frames should the map name window be open for? (this includes the time it takes to perform the animation)
 * @type number
 * @default 150
 * @min 60
 * @parent CategoryMapNameWindow
 * 
 * @param CategoryMechanics
 * @text Mechanics
 * 
 * @param PoisonInField
 * @text Poison affects
 * @desc Whether poisoned Pokémon will lose HP while walking around in the field.
 * @type boolean
 * @default true
 * @parent CategoryMechanics
 * 
 * @param PoisonFaintInField
 * @text Poison faints
 * @desc Whether poisoned Pokémon will faint while walking around in the field (true), or survive the poisoning with 1HP (false).
 * @type boolean
 * @default true
 * @parent CategoryMechanics
 * 
 * @param FishingAutoHook
 * @text Fishing automatic
 * @desc Whether fishing automatically hooks the Pokémon (if false, there is a reaction test first).
 * @type boolean
 * @default true
 * @parent CategoryMechanics
 * 
 * @param DivingSurfaceAnywhere
 * @text Surface diving anywhere
 * @desc Whether the player can surface from anywhere while diving (true), or only in spots where they could dive down from above (false).
 * @type boolean
 * @default false
 * @parent CategoryMechanics
 * 
 * @param EnableShading
 * @text Daytime shading
 * @desc Whether outdoor maps should be shaded according to the time of day.
 * @type boolean
 * @default true
 * @parent CategoryMechanics
 * 
 * @param CategoryMeta
 * @text Metadata
 * 
 * @param CatPlayerMeta
 * @text Player metadata
 * @parent CategoryMeta
 * 
 * @param Home
 * @text Home position
 * @desc Place where the player blackouts to when no pokecenter visited yet.
 * @type struct<PointInMap>
 * @parent CatPlayerMeta
 * @default {"MapID":"1","X":"1","Y":"1"}
 * 
 * @param BycicleBGM
 * @text Bycicle sound
 * @type file
 * @dir audio/bgm/
 * @parent CatPlayerMeta
 * 
 * @param SurfBGM
 * @text Surf sound
 * @type file
 * @dir audio/bgm/
 * @parent CatPlayerMeta
 * 
 * @param WildBattleBGM
 * @text Wild battle sound
 * @type file
 * @dir audio/bgm/
 * @parent CatPlayerMeta
 * 
 * @param TrainerBattleBGM
 * @text Trainer battle sound
 * @type file
 * @dir audio/bgm/
 * @parent CatPlayerMeta
 * 
 * @param WildVictoryME
 * @text Wild victory sound
 * @type file
 * @dir audio/me/
 * @parent CatPlayerMeta
 * 
 * @param TrainerVictoryME
 * @text Trainer victory sound
 * @type file
 * @dir audio/me/
 * @parent CatPlayerMeta
 * 
 * @param MapMetadata
 * @text Map metadata
 * @desc Misc values for each map
 * @type struct<MapMeta>[]
 * @parent CategoryMeta
 * 
 * 
 */
//-----------------------------------------------------------------------------
// PBWindowMapName
//
// The window for displaying the map name on the map screen.
var parameters = PluginManager.parameters('PBField');

var $PBField={
    mapNameWindow:{
        AnimationType:Number(parameters['MapNameWindowAnimationType'] || '1'),
        AnimationSpeed:Number(parameters['MapNameWindowAnimationSpeed'] || '2'),
        ShowDuration:Number(parameters['MapNameWindowShowDuration'] || '150')
    }
};

function PBWindowMapName() {
    this.initialize.apply(this, arguments);
}

PBWindowMapName.prototype = Object.create(PBWindowBase.prototype);
PBWindowMapName.prototype.constructor = PBWindowMapName;

PBWindowMapName.prototype.initialize = function() {
    var wight = this.windowWidth();
    var height = this.windowHeight();
    PBWindowBase.prototype.initialize.call(this, 0, 0, wight, height);
    if($PBField.mapNameWindow.AnimationType==0){
        this.opacity = 0;
        this.contentsOpacity = 0;
    }else if($PBField.mapNameWindow.AnimationType==1){
        this.x=0;
        this.y=-1*this.height;
    }else if($PBField.mapNameWindow.AnimationType==2){
        this.y=0;
        this.x=-1*this.width;
    }else if($PBField.mapNameWindow.AnimationType==3){
        this.opacity = 0;
        this.contentsOpacity = 0;
    }
    this._showCount = 0;
    this.refresh();
};

PBWindowMapName.prototype.windowWidth = function() {
    return 360;
};

PBWindowMapName.prototype.windowHeight = function() {
    return this.fittingHeight(1);
};

PBWindowMapName.prototype.update = function() {
    PBWindowBase.prototype.update.call(this);
    if (this._showCount > 0 && $gameMap.isNameDisplayEnabled()) {
        this.updateFadeIn();
        this._showCount--;
    } else {
        if($PBField.mapNameWindow.AnimationType==3){
            this.opacity = 0;
            this.contentsOpacity = 0;
        }else{
           this.updateFadeOut(); 
        }
    }
};

PBWindowMapName.prototype.updateFadeIn = function() {
    if($PBField.mapNameWindow.AnimationType==0){
        this.opacity += 16*$PBField.mapNameWindow.AnimationSpeed;
        this.contentsOpacity += 16*$PBField.mapNameWindow.AnimationSpeed;
    }else if($PBField.mapNameWindow.AnimationType==1){
        if(this.y<0){
            this.y+=4*$PBField.mapNameWindow.AnimationSpeed;
        }
    }else if($PBField.mapNameWindow.AnimationType==2){
        if(this.x<0){
            this.x+=4*$PBField.mapNameWindow.AnimationSpeed;
        }
    }
};

PBWindowMapName.prototype.updateFadeOut = function() {
    if($PBField.mapNameWindow.AnimationType==0){
        this.opacity -= 16*$PBField.mapNameWindow.AnimationSpeed;
        this.contentsOpacity -= 16*$PBField.mapNameWindow.AnimationSpeed;
    }else if($PBField.mapNameWindow.AnimationType==1){
        if(this.y>-1*this.height){
            this.y-=4*$PBField.mapNameWindow.AnimationSpeed;
        }
    }else if($PBField.mapNameWindow.AnimationType==2){
        if(this.x>-1*this.width){
            this.x-=4*$PBField.mapNameWindow.AnimationSpeed;
        }
    }
    
};

PBWindowMapName.prototype.open = function() {
    this.refresh();
    if($PBField.mapNameWindow.AnimationType==0){
        this._showCount = $PBField.mapNameWindow.ShowDuration;
    }else if($PBField.mapNameWindow.AnimationType==1){
        this._showCount = $PBField.mapNameWindow.ShowDuration;
        this.x=0;
        this.y=-1*this.height;
    }else if($PBField.mapNameWindow.AnimationType==2){
        this._showCount = $PBField.mapNameWindow.ShowDuration;
        this.x=-1*this.width;
        this.y=0;
    }else if($PBField.mapNameWindow.AnimationType==3){
        this._showCount = $PBField.mapNameWindow.ShowDuration;
        this.opacity = 255;
        this.contentsOpacity = 255;
    }
};




PBWindowMapName.prototype.close = function() {
    this._showCount = 0;
    
};

PBWindowMapName.prototype.refresh = function() {
    this.contents.clear();
    if ($gameMap.displayName()) {
        var width = this.contentsWidth();
       // this.drawBackground(0, 0, width, this.lineHeight());
        this.drawText($gameMap.displayName(), 0, 0, width, 'center');
    }
};

//Scene Map overrides
Scene_Map.prototype.createMapNameWindow = function() {
    this._mapNameWindow = new PBWindowMapName();
    this.addChild(this._mapNameWindow);
};
