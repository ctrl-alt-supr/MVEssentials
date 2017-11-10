/*:
 * @plugindesc . 
 * 
 * @help This plugin does not provide plugin commands.
 * 
 * @param AnimationType
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
 * 
 * 
 */
//-----------------------------------------------------------------------------
// PBWindowMapName
//
// The window for displaying the map name on the map screen.
var parameters = PluginManager.parameters('PBMap');

var $PBMap={
    mapNameWindow:{
        AnimationType:Number(parameters['AnimationType'] || '1')
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
    if($PBMap.mapNameWindow.AnimationType==0){
        this.opacity = 0;
        this.contentsOpacity = 0;
    }else if($PBMap.mapNameWindow.AnimationType==1){
        this.x=0;
        this.y=-1*this.height;
    }else if($PBMap.mapNameWindow.AnimationType==1){
        this.y=0;
        this.x=-1*this.width;
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
        this.updateFadeOut();
    }
};

PBWindowMapName.prototype.updateFadeIn = function() {
    if($PBMap.mapNameWindow.AnimationType==0){
        this.opacity += 16;
        this.contentsOpacity += 16;
    }else if($PBMap.mapNameWindow.AnimationType==1){
        if(this.y<0){
            this.y+=8;
        }
    }else if($PBMap.mapNameWindow.AnimationType==2){
        if(this.x<0){
            this.x+=8;
        }
    }
};

PBWindowMapName.prototype.updateFadeOut = function() {
    if($PBMap.mapNameWindow.AnimationType==0){
        this.opacity -= 16;
        this.contentsOpacity -= 16;
    }else if($PBMap.mapNameWindow.AnimationType==1){
        if(this.y>-1*this.height){
            this.y-=8;
        }
    }else if($PBMap.mapNameWindow.AnimationType==2){
        if(this.x>-1*this.width){
            this.x-=8;
        }
    }
    
};

PBWindowMapName.prototype.open = function() {
    this.refresh();
    if($PBMap.mapNameWindow.AnimationType==0){
        this._showCount = 150;
    }else if($PBMap.mapNameWindow.AnimationType==1){
        this._showCount = 150;
        this.x=0;
        this.y=-1*this.height;
    }else if($PBMap.mapNameWindow.AnimationType==2){
        this._showCount = 150;
        this.x=-1*this.width;
        this.y=0;
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
