/*:
 * @plugindesc Contains functions, classes and settings relative to most of the things happening in the overworld
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
