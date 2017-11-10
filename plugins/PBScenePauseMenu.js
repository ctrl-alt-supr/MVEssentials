
/*:
 * @plugindesc Pause menu for Pokemon Essentials MV.
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

var parameters = PluginManager.parameters('PBScenePauseMenu');


PBScene_Map_terminate = Scene_Map.prototype.terminate;
Scene_Map.prototype.terminate = function() {
    if (SceneManager.isNextScene(Scene_Battle)) {
        ImageManager.clearRequest();
    }else if(SceneManager.isNextScene(PBScenePauseMenu)){
        this._spriteset.update();
        this._mapNameWindow.hide();
        SceneManager.snapForBackgroundNoBlur();
    } else {
        this._spriteset.update();
        this._mapNameWindow.hide();
        SceneManager.snapForBackground();
    }

    if (SceneManager.isNextScene(Scene_Map)) {
        ImageManager.clearRequest();
    }

    $gameScreen.clearZoom();

    this.removeChild(this._fadeSprite);
    this.removeChild(this._mapNameWindow);
    this.removeChild(this._windowLayer);
    this.removeChild(this._spriteset);
};



//-----------------------------------------------------------------------------
// PBScenePauseMenu
//
// The scene class of the menu screen.

function PBScenePauseMenu() {
    this.initialize.apply(this, arguments);
}
PBScenePauseMenu.settings= parameters;

PBScenePauseMenu.prototype = Object.create(Scene_MenuBase.prototype);
PBScenePauseMenu.prototype.constructor = PBScenePauseMenu;

PBScenePauseMenu.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

PBScenePauseMenu.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
};

PBScenePauseMenu.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
};

PBScenePauseMenu.prototype.createCommandWindow = function() {
    this._commandWindow = new PBWindowMenuCommand(Graphics.width-PBWindowMenuCommand.prototype.windowWidth(), 0);
    this._commandWindow.setHandler('item',      this.commandItem.bind(this));
    this._commandWindow.setHandler('options',   this.commandOptions.bind(this));
    this._commandWindow.setHandler('save',      this.commandSave.bind(this));
    this._commandWindow.setHandler('gameEnd',   this.commandGameEnd.bind(this));
    this._commandWindow.setHandler('cancel',    this.popScene.bind(this));
    this.addWindow(this._commandWindow);
    this._commandWindow.setBackgroundType(0);
};

PBScenePauseMenu.prototype.commandItem = function() {
    SceneManager.push(Scene_Item);
};

PBScenePauseMenu.prototype.commandOptions = function() {
    SceneManager.push(Scene_Options);
};

PBScenePauseMenu.prototype.commandSave = function() {
    SceneManager.push(Scene_Save);
};

PBScenePauseMenu.prototype.commandGameEnd = function() {
    SceneManager.push(Scene_GameEnd);
};

PBScenePauseMenu.prototype.onPersonalOk = function() {
    switch (this._commandWindow.currentSymbol()) {
    case 'skill':
        SceneManager.push(Scene_Skill);
        break;
    case 'equip':
        SceneManager.push(Scene_Equip);
        break;
    case 'status':
        SceneManager.push(Scene_Status);
        break;
    }
};

//-----------------------------------------------------------------------------
// PBWindowMenuCommand
//
// The window for selecting a command on the menu screen. Modified version of Window_MenuCommand.

function PBWindowMenuCommand() {
    this.initialize.apply(this, arguments);
}

PBWindowMenuCommand.prototype = Object.create(PBWindowCommand.prototype);
PBWindowMenuCommand.prototype.constructor = PBWindowMenuCommand;

PBWindowMenuCommand.prototype.initialize = function(x, y) {
    PBWindowCommand.prototype.initialize.call(this, x, y);
    this.selectLast();
};

PBWindowMenuCommand._lastCommandSymbol = null;

PBWindowMenuCommand.initCommandPosition = function() {
    this._lastCommandSymbol = null;
};

PBWindowMenuCommand.prototype.windowWidth = function() {
    return 240;
};

PBWindowMenuCommand.prototype.numVisibleRows = function() {
    return this.maxItems();
};

PBWindowMenuCommand.prototype.makeCommandList = function() {
    this.addMainCommands();
    this.addFormationCommand();
    this.addOriginalCommands();
    this.addOptionsCommand();
    this.addSaveCommand();
    this.addGameEndCommand();
};

PBWindowMenuCommand.prototype.addMainCommands = function() {
    var enabled = this.areMainCommandsEnabled();
    if (this.needsCommand('item')) {
        this.addCommand(TextManager.item, 'item', enabled);
    }
    if (this.needsCommand('skill')) {
        this.addCommand(TextManager.skill, 'skill', enabled);
    }
    if (this.needsCommand('equip')) {
        this.addCommand(TextManager.equip, 'equip', enabled);
    }
    if (this.needsCommand('status')) {
        this.addCommand(TextManager.status, 'status', enabled);
    }
};

PBWindowMenuCommand.prototype.addFormationCommand = function() {
    if (this.needsCommand('formation')) {
        var enabled = this.isFormationEnabled();
        this.addCommand(TextManager.formation, 'formation', enabled);
    }
};

PBWindowMenuCommand.prototype.addOriginalCommands = function() {
};

PBWindowMenuCommand.prototype.addOptionsCommand = function() {
    if (this.needsCommand('options')) {
        var enabled = this.isOptionsEnabled();
        this.addCommand(TextManager.options, 'options', enabled);
    }
};

PBWindowMenuCommand.prototype.addSaveCommand = function() {
    if (this.needsCommand('save')) {
        var enabled = this.isSaveEnabled();
        this.addCommand(TextManager.save, 'save', enabled);
    }
};

PBWindowMenuCommand.prototype.addGameEndCommand = function() {
    var enabled = this.isGameEndEnabled();
    this.addCommand(TextManager.gameEnd, 'gameEnd', enabled);
};

PBWindowMenuCommand.prototype.needsCommand = function(name) {
    var flags = $dataSystem.menuCommands;
    if (flags) {
        switch (name) {
        case 'item':
            return flags[0];
        case 'skill':
            return flags[1];
        case 'equip':
            return flags[2];
        case 'status':
            return flags[3];
        case 'formation':
            return flags[4];
        case 'save':
            return flags[5];
        }
    }
    return true;
};

PBWindowMenuCommand.prototype.areMainCommandsEnabled = function() {
    return $gameParty.exists();
};

PBWindowMenuCommand.prototype.isFormationEnabled = function() {
    return $gameParty.size() >= 2 && $gameSystem.isFormationEnabled();
};

PBWindowMenuCommand.prototype.isOptionsEnabled = function() {
    return true;
};

PBWindowMenuCommand.prototype.isSaveEnabled = function() {
    return !DataManager.isEventTest() && $gameSystem.isSaveEnabled();
};

PBWindowMenuCommand.prototype.isGameEndEnabled = function() {
    return true;
};

PBWindowMenuCommand.prototype.processOk = function() {
    PBWindowMenuCommand._lastCommandSymbol = this.currentSymbol();
    PBWindowCommand.prototype.processOk.call(this);
};

PBWindowMenuCommand.prototype.selectLast = function() {
    this.selectSymbol(PBWindowMenuCommand._lastCommandSymbol);
};
