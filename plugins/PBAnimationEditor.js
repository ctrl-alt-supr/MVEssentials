/*:
 * @plugindesc Battle animation editor for Pokemon Essentials MV.
 * @author ctrl.alt.supr (git.ctrl.alt.supr@gmail.com)
 *
 * @help 
 *
 * @param CategoryGeneric
 * @text General settings
 * @default ------
 * 
 * 
 */

PBAnimationEditor={
    PBAnimationsPath:"data/pbanimations.json",
    PBAnimationList:[],
    PBCurrentAnimation:null,
    PBCurrentAnimationName:"Animation Name",
    PBCurrentAnimationId:0,
    PBCurrentFrame:0,
    PBTotalFrames:0,
    PBSpriteSheet:0,
    PBFrameListToggleHandler:function(){
        
    },
    PBAnimListToggleHandler:function(){
        console.log("Has pulsao el puto boton");
    },
    PBAnchorPoint:{
        Screen:0,
        Player:1,
        Opponent:2,
        PlayerAndOpponent:3
    },
    PBSelfAnchorPoint:{
        TopLeft:0,
        Center:1
    }
};

 //-----------------------------------------------------------------------------
// PBScenePauseMenu
//
// The scene class of the menu screen.

function PBSceneAnimationEditor() {
    this.initialize.apply(this, arguments);
}
PBSceneAnimationEditor.settings= parameters;

PBSceneAnimationEditor.prototype = Object.create(Scene_MenuBase.prototype);
PBSceneAnimationEditor.prototype.constructor = PBSceneAnimationEditor;

PBSceneAnimationEditor.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
    this._window_framecontrol=null;
    this._window_canvas=null;
    this._window_commands=null;
    this._window_sheet=null;
    this._window_animlist=null;
    this._window_animname=null;
    this._window_context=null;
    this._window_animid=null;

    this._is_animlist_open=false;
    this._is_context_open=false;
};
//Toolbar
PBSceneAnimationEditor._toolbar_height=function(){
    return (Graphics.height*0.25);
};
//window_framecontrol
PBSceneAnimationEditor._window_framecontrol_width=function(){
    return (Graphics.width*0.3);
};
PBSceneAnimationEditor._window_framecontrol_height=function(){
    return PBSceneAnimationEditor._toolbar_height();
};
PBSceneAnimationEditor._window_framecontrol_x=function(){
    return 0;
};
PBSceneAnimationEditor._window_framecontrol_y=function(){
    return Graphics.height-PBSceneAnimationEditor._toolbar_height();
};
//window_animid
PBSceneAnimationEditor._window_animid_width=function(){
    return (Graphics.width-PBSceneAnimationEditor._window_framecontrol_width())*0.2;
};
PBSceneAnimationEditor._window_animid_height=function(){
    return (PBSceneAnimationEditor._toolbar_height()*0.4);
};
PBSceneAnimationEditor._window_animid_x=function(){
    return PBSceneAnimationEditor._window_framecontrol_width();
};
PBSceneAnimationEditor._window_animid_y=function(){
    return Graphics.height-PBSceneAnimationEditor._window_animname_height();
};
//window_animname
PBSceneAnimationEditor._window_animname_width=function(){
    return Graphics.width-PBSceneAnimationEditor._window_framecontrol_width()-PBSceneAnimationEditor._window_animid_width();
};
PBSceneAnimationEditor._window_animname_height=function(){
    return PBSceneAnimationEditor._window_animid_height();
};
PBSceneAnimationEditor._window_animname_x=function(){
    return PBSceneAnimationEditor._window_animid_x()+PBSceneAnimationEditor._window_animid_width();
};
PBSceneAnimationEditor._window_animname_y=function(){
    return Graphics.height-PBSceneAnimationEditor._window_animname_height();
};
//window_sheet
PBSceneAnimationEditor._window_sheet_width=function(){
    return Graphics.width-PBSceneAnimationEditor._window_framecontrol_width();
};
PBSceneAnimationEditor._window_sheet_height=function(){
    return PBSceneAnimationEditor._toolbar_height()-PBSceneAnimationEditor._window_animname_height();
};
PBSceneAnimationEditor._window_sheet_x=function(){
    return PBSceneAnimationEditor._window_framecontrol_width();
};
PBSceneAnimationEditor._window_sheet_y=function(){
    return Graphics.height-PBSceneAnimationEditor._toolbar_height();
};
//window_commands
PBSceneAnimationEditor._window_commands_width=function(){
    return (Graphics.width*0.2);
};
PBSceneAnimationEditor._window_commands_height=function(){
    return Graphics.height-PBSceneAnimationEditor._toolbar_height();
};
PBSceneAnimationEditor._window_commands_x=function(){
    return PBSceneAnimationEditor._window_canvas_width();
};
PBSceneAnimationEditor._window_commands_y=function(){
    return 0;
};
//window_canvas
PBSceneAnimationEditor._window_canvas_height=function(){
    return Graphics.height-PBSceneAnimationEditor._toolbar_height();
};
PBSceneAnimationEditor._window_canvas_width=function(){
    return Graphics.width-PBSceneAnimationEditor._window_commands_width();
};
//window_animlist
PBSceneAnimationEditor._window_animlist_height=function(){
    return Graphics.height-PBSceneAnimationEditor._toolbar_height();
};
PBSceneAnimationEditor._window_animlist_width=function(){
    return Graphics.width*0.4;
};

//window_context
PBSceneAnimationEditor._window_context_height=function(){
    return Graphics.height*0.4;
};
PBSceneAnimationEditor._window_context_width=function(){
    return Graphics.width*0.3;
};

//Visibility handlers
PBSceneAnimationEditor.prototype.shouldShowWindowAnimList=function(){
    return this._is_animlist_open;
};
PBSceneAnimationEditor.prototype.shouldShowWindowContext=function(){
    return this._is_context_open;
};

PBSceneAnimationEditor.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createWindows();
};

PBSceneAnimationEditor.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
};

PBSceneAnimationEditor.prototype.createWindows = function() {    
    this._window_sheet=new PBWindowAnimationPlaceholder();
    this._window_sheet.width=PBSceneAnimationEditor._window_sheet_width();
    this._window_sheet.height=PBSceneAnimationEditor._window_sheet_height();
    this._window_sheet.x=PBSceneAnimationEditor._window_sheet_x();
    this._window_sheet.y=PBSceneAnimationEditor._window_sheet_y();
    this.addWindow(this._window_sheet);

    this._window_animid=new PBWindowAnimationDisplayText();
    this._window_animid.width=PBSceneAnimationEditor._window_animid_width();
    this._window_animid.height=PBSceneAnimationEditor._window_animid_height();
    this._window_animid.x=PBSceneAnimationEditor._window_animid_x();
    this._window_animid.y=PBSceneAnimationEditor._window_animid_y();
    this.addWindow(this._window_animid);
    this._window_animid.setValueFunction(function(){
        return "ID: "+PBAnimationEditor.PBCurrentAnimationId;
    })

    this._window_animname=new PBWindowAnimationDisplayText();
    this._window_animname.width=PBSceneAnimationEditor._window_animname_width();
    this._window_animname.height=PBSceneAnimationEditor._window_animname_height();
    this._window_animname.x=PBSceneAnimationEditor._window_animname_x();
    this._window_animname.y=PBSceneAnimationEditor._window_animname_y();
    this.addWindow(this._window_animname);
    this._window_animname.setValueFunction(function(){
        return PBAnimationEditor.PBCurrentAnimationName;
    })

    this._window_framecontrol=new PBWindowAnimationFrameControl();
    this._window_framecontrol.width=PBSceneAnimationEditor._window_framecontrol_width();
    this._window_framecontrol.height=PBSceneAnimationEditor._window_framecontrol_height();
    this._window_framecontrol.x=PBSceneAnimationEditor._window_framecontrol_x();
    this._window_framecontrol.y=PBSceneAnimationEditor._window_framecontrol_y();
    this.addWindow(this._window_framecontrol);
    this._window_framecontrol.select(0);
    this._window_framecontrol.activate();

    this._window_commands=new PBWindowAnimationCommand();
    this._window_commands.width=PBSceneAnimationEditor._window_commands_width();
    this._window_commands.height=PBSceneAnimationEditor._window_commands_height();
    this._window_commands.x=PBSceneAnimationEditor._window_commands_x();
    this._window_commands.y=PBSceneAnimationEditor._window_commands_y();
    this.addWindow(this._window_commands);
    this._window_commands.select(0);
    this._window_commands.deactivate();

    this._window_canvas=new PBWindowAnimationPlaceholder();
    this._window_canvas.width=PBSceneAnimationEditor._window_canvas_width();
    this._window_canvas.height=PBSceneAnimationEditor._window_canvas_height();
    this._window_canvas.x=0;
    this._window_canvas.y=0;
    this.addWindow(this._window_canvas);

    this._window_animlist=new PBWindowAnimationPlaceholder();
    this._window_animlist.width=PBSceneAnimationEditor._window_animlist_width();
    this._window_animlist.height=PBSceneAnimationEditor._window_animlist_height();
    this._window_animlist.x=0;
    this._window_animlist.y=0;
    this._window_animlist.close();
    this._window_animlist.visible=false;
    this.addWindow(this._window_animlist);
    

    this._window_context=new PBWindowAnimationPlaceholder();
    this._window_context.width=PBSceneAnimationEditor._window_context_width();
    this._window_context.height=PBSceneAnimationEditor._window_context_height();
    this._window_context.x=0;
    this._window_context.y=0;
    this._window_context.visible=false;
    this._window_context.close();
    this.addWindow(this._window_context);
    

    this._window_framecontrol.setHandler('cancel',    this.popScene.bind(this));

};

//-----------------------------------------------------------------------------
// PBWindowAnimationPlaceholder
//
// The window wherer animation frames are edited.

function PBWindowAnimationPlaceholder() {
    this.initialize.apply(this, arguments);
}

PBWindowAnimationPlaceholder.prototype = Object.create(PBWindowBase.prototype);
PBWindowAnimationPlaceholder.prototype.constructor = PBWindowAnimationPlaceholder;

PBWindowAnimationPlaceholder.prototype.initialize = function(x, y) {
    PBWindowBase.prototype.initialize.call(this, x, y, 0, 0);
    this.refresh();
};

PBWindowAnimationPlaceholder.prototype.refresh = function() {
    this.contents.clear();
   
};

PBWindowAnimationPlaceholder.prototype.open = function() {
    this.refresh();
    PBWindowBase.prototype.open.call(this);
};

//-----------------------------------------------------------------------------
// PBWindowAnimationDisplayText
//
// The window wherer animation frames are edited.


function PBWindowAnimationDisplayText() {
    this.initialize.apply(this, arguments);
}
function PBWindowAnimationDisplayText() {
    this.initialize.apply(this, arguments);
}

PBWindowAnimationDisplayText.prototype = Object.create(PBWindowBase.prototype);
PBWindowAnimationDisplayText.prototype.constructor = PBWindowAnimationDisplayText;

PBWindowAnimationDisplayText.prototype.initialize = function(x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    this._valueFunct=function(){
        return "hola";
    };
    PBWindowBase.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
};

PBWindowAnimationDisplayText.prototype.windowWidth = function() {
    return 240;
};
PBWindowAnimationDisplayText.prototype.standardPadding = function() {
    return 5;
};
PBWindowAnimationDisplayText.prototype.textPadding = function() {
    return 5;
};

PBWindowAnimationDisplayText.prototype.windowHeight = function() {
    return this.fittingHeight(1);
};

PBWindowAnimationDisplayText.prototype.refresh = function() {
    var x = this.standardPadding()+this.textPadding();
    var width = this.contents.width - this.textPadding() * 2;
    this.contents.clear();
    this.drawTextEx(this.value(), x, 5);
};

PBWindowAnimationDisplayText.prototype.value = function() {
    return this._valueFunct();
};
PBWindowAnimationDisplayText.prototype.setValueFunction = function(tFunct) {
    if(typeof(tFunct)==="function"){
        this._valueFunct=tFunct;
        this.refresh();
    }
};


PBWindowAnimationDisplayText.prototype.open = function() {
    this.refresh();
    PBWindowBase.prototype.open.call(this);
};



//-----------------------------------------------------------------------------
// PBWindowAnimationFrameControl
//
// The window with animation frame related controls

function PBWindowAnimationFrameControl() {
    this.initialize.apply(this, arguments);
}

PBWindowAnimationFrameControl.prototype = Object.create(PBWindowCommand.prototype);
PBWindowAnimationFrameControl.prototype.constructor = PBWindowAnimationFrameControl;

PBWindowAnimationFrameControl.prototype.initialize = function() {
    PBWindowCommand.prototype.initialize.call(this, 0, 0);
    this.setUsesCursorArrow(false);
    this.updatePlacement();
};

PBWindowAnimationFrameControl.prototype.windowWidth = function() {
    return PBSceneAnimationEditor._window_framecontrol_width();
};

PBWindowAnimationFrameControl.prototype.windowHeight = function() {
    return this.fittingHeight(Math.min(this.numVisibleRows(), 12));
};

PBWindowAnimationFrameControl.prototype.updatePlacement = function() {
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = (Graphics.boxHeight - this.height) / 2;
};

PBWindowAnimationFrameControl.prototype.makeCommandList = function() {
    this.addGeneralOptions();
};

PBWindowAnimationFrameControl.prototype.addGeneralOptions = function() {
    this.addCommand("Frame:", '_int_PBCurrentFrame');
    this.addCommand("Frame list", '_btn_PBFrameListToggleHandler');
    this.addCommand("Choose sprite", '_btn_PBSpriteSheet');
    this.addCommand("Animation list", '_btn_PBAnimListToggleHandler');
    //this.addCommand(TextManager.commandRemember, 'commandRemember');
};
PBWindowAnimationFrameControl.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    var statusWidth = this.statusWidth();
    var titleWidth = rect.width - statusWidth;
    this.changeTextColor(this.normalColor());
    this.changePaintOpacity(this.isCommandEnabled(index));
    if (!this.isButtonSymbol(this.commandSymbol(index)) && !this.isSeparatorSymbol(this.commandSymbol(index))) {
        this.drawText(this.commandName(index), rect.x, rect.y, titleWidth, 'left');
        this.drawText(this.statusText(index), titleWidth, rect.y, statusWidth, 'right');
    }else{
        this.drawText(this.commandName(index), rect.x, rect.y, rect.width, 'center');
    }
};

PBWindowAnimationFrameControl.prototype.standardPadding = function() {
    return 5;
};

PBWindowAnimationFrameControl.prototype.statusWidth = function() {
    return PBSceneAnimationEditor._window_framecontrol_width()*0.35;
};

PBWindowAnimationFrameControl.prototype.statusText = function(index) {
    var symbol = this.commandSymbol(index);
    var value = this.getConfigValue(symbol);
    if (this.isPercSymbol(symbol)) {
        return this.percStatusText(value);
    } else if (this.isBoolSymbol(symbol)) {
        return this.boolStatusText(value);
    }else {
        return this.anyStatusText(value);
    }
};
PBWindowAnimationFrameControl.prototype.clearSymbolType=function(symbol){
    var toRet=symbol.replace("_perc_","");
    toRet=toRet.replace("_int_","");
    toRet=toRet.replace("_bool_","");
    toRet=toRet.replace("_str_","");
    toRet=toRet.replace("_btn_","");
    toRet=toRet.replace("_sep_","");
    return toRet;
}
PBWindowAnimationFrameControl.prototype.isPercSymbol = function(symbol) {
    return symbol.contains('_perc_');
};

PBWindowAnimationFrameControl.prototype.isIntSymbol = function(symbol) {
    return symbol.contains('_int_');
};

PBWindowAnimationFrameControl.prototype.isBoolSymbol = function(symbol) {
    return symbol.contains('_bool_');
};

PBWindowAnimationFrameControl.prototype.isStrSymbol = function(symbol) {
    return symbol.contains('_str_');
};
PBWindowAnimationFrameControl.prototype.isButtonSymbol = function(symbol) {
    return symbol.contains('_btn_');
};

PBWindowAnimationFrameControl.prototype.isSeparatorSymbol = function(symbol) {
    return symbol.contains('_sep_');
};

PBWindowAnimationFrameControl.prototype.boolStatusText = function(value) {
    return value ? 'ON' : 'OFF';
};

PBWindowAnimationFrameControl.prototype.percStatusText = function(value) {
    return value + '%';
};

PBWindowAnimationFrameControl.prototype.btnStatusText = function(value) {
    return "";
};

PBWindowAnimationFrameControl.prototype.anyStatusText = function(value) {
    return value;
};
PBWindowAnimationFrameControl.prototype.cursorDown = function(wrap) {
    var index = this.index();
    var maxItems = this.maxItems();
    var maxCols = this.maxCols();
    if (index < maxItems - maxCols || (wrap && maxCols === 1)) {
        var newIndex=(index + maxCols) % maxItems;
        if(!this.isSeparatorSymbol(this.commandSymbol(newIndex))){
            this.select(newIndex);
        }else{
            this.select(newIndex);
            this.cursorDown(wrap);
        }
    }
};

PBWindowAnimationFrameControl.prototype.cursorUp = function(wrap) {
    var index = this.index();
    var maxItems = this.maxItems();
    var maxCols = this.maxCols();
    if (index >= maxCols || (wrap && maxCols === 1)) {
        var newIndex=(index - maxCols + maxItems) % maxItems;
        if(!this.isSeparatorSymbol(this.commandSymbol(newIndex))){
            this.select(newIndex);
        }else{
            this.select(newIndex);
            this.cursorUp(wrap);
        }
    }
};

PBWindowAnimationFrameControl.prototype.processOk = function() {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    var value = this.getConfigValue(symbol);
    if (this.isPercSymbol(symbol)) {
        value += this.percOffset();
        if (value > 100) {
            value = 0;
        }
        value = value.clamp(0, 100);
        this.changeValue(symbol, value);
    }else if (this.isIntSymbol(symbol)) {
        value += this.intOffset();
        this.changeValue(symbol, value);
    } else if (this.isBoolSymbol(symbol)) {
        this.changeValue(symbol, !value);
    }else if(this.isButtonSymbol(symbol)){
        this.processButtonSymbolOk(symbol);
    }else {
        //this.changeValue(symbol, !value);
    }
};
PBWindowAnimationFrameControl.prototype.processButtonSymbolOk=function(symbol){
    var functionToExecute = this.getConfigValue(symbol);
    if(typeof functionToExecute === 'function'){
        functionToExecute.call(this);
    };
};
PBWindowAnimationFrameControl.prototype.cursorRight = function(wrap) {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    var value = this.getConfigValue(symbol);
    if (this.isPercSymbol(symbol)) {
        value += this.percOffset();
        value = value.clamp(0, 100);
        this.changeValue(symbol, value);
    } else if(this.isIntSymbol(symbol)) {
        value += this.intOffset();
        this.changeValue(symbol, value);
    } else if(this.isBoolSymbol(symbol)) {
        this.changeValue(symbol, true);
    } else {
        //this.changeValue(symbol, true);
    }
};

PBWindowAnimationFrameControl.prototype.cursorLeft = function(wrap) {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    var value = this.getConfigValue(symbol);
    if (this.isPercSymbol(symbol)) {
        value -= this.percOffset();
        value = value.clamp(0, 100);
        this.changeValue(symbol, value);
    }else if(this.isIntSymbol(symbol)) {
        value -= this.intOffset();
        this.changeValue(symbol, value);
    }else if(this.isBoolSymbol(symbol)) {
        this.changeValue(symbol, false);
    } else {
        //this.changeValue(symbol, true);
    }
};

PBWindowAnimationFrameControl.prototype.percOffset = function() {
    return 1;
};

PBWindowAnimationFrameControl.prototype.intOffset = function() {
    return 1;
};

PBWindowAnimationFrameControl.prototype.changeValue = function(symbol, value) {
    var lastValue = this.getConfigValue(symbol);
    if (lastValue !== value) {
        this.setConfigValue(symbol, value);
        this.redrawItem(this.findSymbol(symbol));
        SoundManager.playCursor();
    }
};
PBWindowAnimationFrameControl.prototype.update = function() {
    PBWindowSelectable.prototype.update.call(this);
    this.processExtraKeys();
};

PBWindowAnimationFrameControl.prototype.processExtraKeys = function() {
    if (this.isOpenAndActive()) {
        var lastIndex = this.index();
        if (Input.isTriggered('tab') && this._animationCount>20) {
            this.deactivate();
            SceneManager._scene._window_commands.activate();
            SceneManager._scene._window_commands._animationCount=0;
            SceneManager._scene._window_commands.select(0);
        }
    }
};



PBWindowAnimationFrameControl.prototype.getConfigValue = function(symbol) {
    return PBAnimationEditor[this.clearSymbolType(symbol)];
};

PBWindowAnimationFrameControl.prototype.setConfigValue = function(symbol, value) {
    PBAnimationEditor[this.clearSymbolType(symbol)] = value;
};
//-----------------------------------------------------------------------------
// PBWindowAnimationCommand
//
// The window with animation frame related controls

function PBWindowAnimationCommand() {
    this.initialize.apply(this, arguments);
}

PBWindowAnimationCommand.prototype = Object.create(PBWindowCommand.prototype);
PBWindowAnimationCommand.prototype.constructor = PBWindowAnimationCommand;

PBWindowAnimationCommand.prototype.initialize = function() {
    PBWindowCommand.prototype.initialize.call(this, 0, 0);
    this.setUsesCursorArrow(false);
    this.updatePlacement();
};

PBWindowAnimationCommand.prototype.windowWidth = function() {
    return PBSceneAnimationEditor._window_commands_width();
};

PBWindowAnimationCommand.prototype.windowHeight = function() {
    return this.fittingHeight(Math.min(this.numVisibleRows(), 12));
};

PBWindowAnimationCommand.prototype.updatePlacement = function() {
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = (Graphics.boxHeight - this.height) / 2;
};

PBWindowAnimationCommand.prototype.makeCommandList = function() {
    this.addGeneralOptions();
};

PBWindowAnimationCommand.prototype.addGeneralOptions = function() {
    this.addCommand("SE and BG", '_btn_PBSpriteSheet');
    this.addCommand("Default anchor", '_btn_PBSpriteSheet');
    this.addCommand("Help", '_btn_PBSpriteSheet');
    this.addCommand("-FRAMES-",'_sep_1',false);
    this.addCommand("Paste last frame", '_btn_PBSpriteSheet');
    this.addCommand("Paste frame", '_btn_PBSpriteSheet');
    this.addCommand("Copy frame", '_btn_PBSpriteSheet');
    this.addCommand("Tweening", '_btn_PBSpriteSheet');
    this.addCommand("-CELLS-",'_sep_2',false);
    this.addCommand("Paste cell", '_btn_PBSpriteSheet');
    this.addCommand("Copy cell", '_btn_PBSpriteSheet');
    this.addCommand("Cell batch", '_btn_PBSpriteSheet');
    this.addCommand("-PLAYBACK-",'_sep_3',false);
    this.addCommand("Play animation", '_btn_PBSpriteSheet');
    this.addCommand("Play opponent", '_btn_PBSpriteSheet');
    this.addCommand("-BACKUP-",'_sep_4',false);
    this.addCommand("Import animation", '_btn_PBSpriteSheet');
    this.addCommand("Export animation", '_btn_PBSpriteSheet');
    
    
    //this.addCommand(TextManager.commandRemember, 'commandRemember');
};

PBWindowAnimationCommand.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    var statusWidth = this.statusWidth();
    var titleWidth = rect.width - statusWidth;
    this.changeTextColor(this.normalColor());
    this.changePaintOpacity(this.isCommandEnabled(index));
    if (!this.isButtonSymbol(this.commandSymbol(index)) && !this.isSeparatorSymbol(this.commandSymbol(index))) {
        this.drawText(this.commandName(index), rect.x, rect.y, titleWidth, 'left');
        this.drawText(this.statusText(index), titleWidth, rect.y, statusWidth, 'right');
    }else{
        this.drawText(this.commandName(index), rect.x, rect.y, rect.width, 'center');
    }
};

PBWindowAnimationCommand.prototype.standardPadding = function() {
    return 5;
};

PBWindowAnimationCommand.prototype.statusWidth = function() {
    return PBSceneAnimationEditor._window_commands_width()*0.35;
};

PBWindowAnimationCommand.prototype.statusText = function(index) {
    var symbol = this.commandSymbol(index);
    var value = this.getConfigValue(symbol);
    if (this.isPercSymbol(symbol)) {
        return this.percStatusText(value);
    } else if (this.isBoolSymbol(symbol)) {
        return this.boolStatusText(value);
    }else {
        return this.anyStatusText(value);
    }
};
PBWindowAnimationCommand.prototype.clearSymbolType=function(symbol){
    var toRet=symbol.replace("_perc_","");
    toRet=toRet.replace("_int_","");
    toRet=toRet.replace("_bool_","");
    toRet=toRet.replace("_str_","");
    toRet=toRet.replace("_btn_","");
    toRet=toRet.replace("_sep_","");
    return toRet;
}
PBWindowAnimationCommand.prototype.isPercSymbol = function(symbol) {
    return symbol.contains('_perc_');
};

PBWindowAnimationCommand.prototype.isIntSymbol = function(symbol) {
    return symbol.contains('_int_');
};

PBWindowAnimationCommand.prototype.isBoolSymbol = function(symbol) {
    return symbol.contains('_bool_');
};

PBWindowAnimationCommand.prototype.isStrSymbol = function(symbol) {
    return symbol.contains('_str_');
};
PBWindowAnimationCommand.prototype.isButtonSymbol = function(symbol) {
    return symbol.contains('_btn_');
};

PBWindowAnimationCommand.prototype.isSeparatorSymbol = function(symbol) {
    return symbol.contains('_sep_');
};

PBWindowAnimationCommand.prototype.boolStatusText = function(value) {
    return value ? 'ON' : 'OFF';
};

PBWindowAnimationCommand.prototype.percStatusText = function(value) {
    return value + '%';
};

PBWindowAnimationCommand.prototype.btnStatusText = function(value) {
    return "";
};

PBWindowAnimationCommand.prototype.anyStatusText = function(value) {
    return value;
};
PBWindowAnimationCommand.prototype.cursorDown = function(wrap) {
    var index = this.index();
    var maxItems = this.maxItems();
    var maxCols = this.maxCols();
    if (index < maxItems - maxCols || (wrap && maxCols === 1)) {
        var newIndex=(index + maxCols) % maxItems;
        if(!this.isSeparatorSymbol(this.commandSymbol(newIndex))){
            this.select(newIndex);
        }else{
            this.select(newIndex);
            this.cursorDown(wrap);
        }
    }
};

PBWindowAnimationCommand.prototype.cursorUp = function(wrap) {
    var index = this.index();
    var maxItems = this.maxItems();
    var maxCols = this.maxCols();
    if (index >= maxCols || (wrap && maxCols === 1)) {
        var newIndex=(index - maxCols + maxItems) % maxItems;
        if(!this.isSeparatorSymbol(this.commandSymbol(newIndex))){
            this.select(newIndex);
        }else{
            this.select(newIndex);
            this.cursorUp(wrap);
        }
    }
};

PBWindowAnimationCommand.prototype.processOk = function() {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    var value = this.getConfigValue(symbol);
    if (this.isPercSymbol(symbol)) {
        value += this.percOffset();
        if (value > 100) {
            value = 0;
        }
        value = value.clamp(0, 100);
        this.changeValue(symbol, value);
    }else if (this.isIntSymbol(symbol)) {
        value += this.intOffset();
        this.changeValue(symbol, value);
    } else if (this.isBoolSymbol(symbol)) {
        this.changeValue(symbol, !value);
    }else if(this.isButtonSymbol(symbol)){
        this.processButtonSymbolOk(symbol);
    }else {
        //this.changeValue(symbol, !value);
    }
};
PBWindowAnimationCommand.prototype.processButtonSymbolOk=function(symbol){
    var functionToExecute = this.getConfigValue(symbol);
    if(typeof functionToExecute === 'function'){
        functionToExecute.call(this);
    };
};
PBWindowAnimationCommand.prototype.cursorRight = function(wrap) {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    var value = this.getConfigValue(symbol);
    if (this.isPercSymbol(symbol)) {
        value += this.percOffset();
        value = value.clamp(0, 100);
        this.changeValue(symbol, value);
    } else if(this.isIntSymbol(symbol)) {
        value += this.intOffset();
        this.changeValue(symbol, value);
    } else if(this.isBoolSymbol(symbol)) {
        this.changeValue(symbol, true);
    } else {
        //this.changeValue(symbol, true);
    }
};

PBWindowAnimationCommand.prototype.cursorLeft = function(wrap) {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    var value = this.getConfigValue(symbol);
    if (this.isPercSymbol(symbol)) {
        value -= this.percOffset();
        value = value.clamp(0, 100);
        this.changeValue(symbol, value);
    }else if(this.isIntSymbol(symbol)) {
        value -= this.intOffset();
        this.changeValue(symbol, value);
    }else if(this.isBoolSymbol(symbol)) {
        this.changeValue(symbol, false);
    } else {
        //this.changeValue(symbol, true);
    }
};

PBWindowAnimationCommand.prototype.percOffset = function() {
    return 1;
};

PBWindowAnimationCommand.prototype.intOffset = function() {
    return 1;
};

PBWindowAnimationCommand.prototype.update = function() {
    PBWindowSelectable.prototype.update.call(this);
    this.processExtraKeys();
};

PBWindowAnimationCommand.prototype.processExtraKeys = function() {
    if (this.isOpenAndActive()) {
        var lastIndex = this.index();
        if (Input.isTriggered('tab') && this._animationCount>20) {
            this.deactivate();
            SceneManager._scene._window_framecontrol.activate();
            SceneManager._scene._window_framecontrol._animationCount=0;
            SceneManager._scene._window_framecontrol.select(0);
            
        }
    }
};

PBWindowAnimationCommand.prototype.changeValue = function(symbol, value) {
    var lastValue = this.getConfigValue(symbol);
    if (lastValue !== value) {
        this.setConfigValue(symbol, value);
        this.redrawItem(this.findSymbol(symbol));
        SoundManager.playCursor();
    }
};

PBWindowAnimationCommand.prototype.getConfigValue = function(symbol) {
    return PBAnimationEditor[this.clearSymbolType(symbol)];
};

PBWindowAnimationCommand.prototype.setConfigValue = function(symbol, value) {
    PBAnimationEditor[this.clearSymbolType(symbol)] = value;
};


//-----------------------------------------------------------------------------
// PBWindowAnimationCanvas
//
// The window wherer animation frames are edited.

function PBWindowAnimationCanvas() {
    this.initialize.apply(this, arguments);
}

PBWindowAnimationCanvas.prototype = Object.create(PBWindowBase.prototype);
PBWindowAnimationCanvas.prototype.constructor = PBWindowAnimationCanvas;

PBWindowAnimationCanvas.prototype.initialize = function(x, y) {
    PBWindowBase.prototype.initialize.call(this, x, y, 0, 0);
    this.refresh();
};

PBWindowAnimationCanvas.prototype.refresh = function() {
    this.contents.clear();
   
};

PBWindowAnimationCanvas.prototype.open = function() {
    this.refresh();
    PBWindowBase.prototype.open.call(this);
};
