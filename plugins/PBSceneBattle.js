

PBBattle={
    _graphics:{
        battle_commands_overlay:"Graphics/Pictures/Battle/overlay_command",
        battle_commands_buttons:"Graphics/Pictures/Battle/cursor_command",
        battle_commands_fight_overlay:"Graphics/Pictures/Battle/overlay_fight",
        battle_commands_fight_cursor: "Graphics/Pictures/Battle/cursor_fight",
        battle_types:"Graphics/Pictures/types",
        battle_data_safary:"Graphics/Pictures/Battle/databox_safari",
        battle_data_thin:"Graphics/Pictures/Battle/databox_thin",
        battle_data_thin_foe:"Graphics/Pictures/Battle/databox_thin_foe",
        battle_data_normal:"Graphics/Pictures/Battle/databox_normal",
        battle_data_normal_foe:"Graphics/Pictures/Battle/databox_normal_foe",
        battle_statuses:"Graphics/Pictures/Battle/icon_statuses",
        battle_hp:"Graphics/Pictures/Battle/overlay_hp",
        battle_xp:"Graphics/Pictures/Battle/overlay_exp",
        battle_level:"Graphics/Pictures/Battle/overlay_lv",
        battle_shiny:"Graphics/Pictures/shiny",
        battle_owned:"Graphics/Pictures/Battle/icon_own"
    },
    _window_command_width_perc:function(){
        return 1;
    },
    _window_command_height_perc:function(){
        return 0.3;
    },
}

Game_Interpreter.prototype.command301 = function() {
    if (!$gameParty.inBattle()) {
        var troopId;
        if (this._params[0] === 0) {  // Direct designation
            troopId = this._params[1];
        } else if (this._params[0] === 1) {  // Designation with a variable
            troopId = $gameVariables.value(this._params[1]);
        } else {  // Same as Random Encounter
            troopId = $gamePlayer.makeEncounterTroopId();
        }
        if ($dataTroops[troopId]) {
            PBBattleManager.setup(troopId, this._params[2], this._params[3]);
            PBBattleManager.setEventCallback(function(n) {
                this._branch[this._indent] = n;
            }.bind(this));
            $gamePlayer.makeEncounterCount();
            SceneManager.push(PBSceneBattle);
        }
    }
    return true;
};

Window_PartyCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.fight,  'fight');
    this.addCommand(TextManager.escape, 'escape', PBBattleManager.canEscape());
};

//-----------------------------------------------------------------------------
// PBSceneBattle
//
// The scene class of the battle screen.

function PBSceneBattle() {
    this.initialize.apply(this, arguments);
}

PBSceneBattle.prototype = Object.create(Scene_Base.prototype);
PBSceneBattle.prototype.constructor = PBSceneBattle;

PBSceneBattle.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};

PBSceneBattle.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createDisplayObjects();
};

PBSceneBattle.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    this.startFadeIn(this.fadeSpeed(), false);
    PBBattleManager.playBattleBgm();
    PBBattleManager.startBattle();
};

PBSceneBattle.prototype.update = function() {
    var active = this.isActive();
    $gameTimer.update(active);
    $gameScreen.update();
    this.updateStatusWindow();
    this.updateWindowPositions();
    if (active && !this.isBusy()) {
        this.updateBattleProcess();
    }
    Scene_Base.prototype.update.call(this);
};

PBSceneBattle.prototype.updateBattleProcess = function() {
    if (!this.isAnyInputWindowActive() || PBBattleManager.isAborting() ||
            PBBattleManager.isBattleEnd()) {
        PBBattleManager.update();
        this.changeInputWindow();
    }
};

PBSceneBattle.prototype.isAnyInputWindowActive = function() {
    return (this._partyCommandWindow.active ||
            this._actorCommandWindow.active ||
            this._skillWindow.active ||
            this._itemWindow.active ||
            this._actorWindow.active ||
            this._enemyWindow.active);
};

PBSceneBattle.prototype.changeInputWindow = function() {
    if (PBBattleManager.isInputting()) {
        if (PBBattleManager.actor()) {
            this.startActorCommandSelection();
        } else {
            this.startPartyCommandSelection();
        }
    } else {
        this.endCommandSelection();
    }
};

PBSceneBattle.prototype.stop = function() {
    Scene_Base.prototype.stop.call(this);
    if (this.needsSlowFadeOut()) {
        this.startFadeOut(this.slowFadeSpeed(), false);
    } else {
        this.startFadeOut(this.fadeSpeed(), false);
    }
    this._statusWindow.close();
    this._partyCommandWindow.close();
    this._actorCommandWindow.close();
};

PBSceneBattle.prototype.terminate = function() {
    Scene_Base.prototype.terminate.call(this);
    $gameParty.onBattleEnd();
    $gameTroop.onBattleEnd();
    AudioManager.stopMe();

    ImageManager.clearRequest();
};

PBSceneBattle.prototype.needsSlowFadeOut = function() {
    return (SceneManager.isNextScene(Scene_Title) ||
            SceneManager.isNextScene(Scene_Gameover));
};

PBSceneBattle.prototype.updateStatusWindow = function() {
    if ($gameMessage.isBusy()) {
        this._statusWindow.close();
        this._partyCommandWindow.close();
        this._actorCommandWindow.close();
    } else if (this.isActive() && !this._messageWindow.isClosing()) {
        this._statusWindow.open();
    }
};

PBSceneBattle.prototype.updateWindowPositions = function() {
    var statusX = 0;
    if (PBBattleManager.isInputting()) {
        statusX = this._partyCommandWindow.width;
    } else {
        statusX = this._partyCommandWindow.width / 2;
    }
    if (this._statusWindow.x < statusX) {
        this._statusWindow.x += 16;
        if (this._statusWindow.x > statusX) {
            this._statusWindow.x = statusX;
        }
    }
    if (this._statusWindow.x > statusX) {
        this._statusWindow.x -= 16;
        if (this._statusWindow.x < statusX) {
            this._statusWindow.x = statusX;
        }
    }
};

PBSceneBattle.prototype.createDisplayObjects = function() {
    this.createSpriteset();
    this.createWindowLayer();
    this.createAllWindows();
    PBBattleManager.setLogWindow(this._logWindow);
    PBBattleManager.setStatusWindow(this._statusWindow);
    PBBattleManager.setSpriteset(this._spriteset);
    this._logWindow.setSpriteset(this._spriteset);
};

PBSceneBattle.prototype.createSpriteset = function() {
    this._spriteset = new PBSpritesetBattle();
    this.addChild(this._spriteset);
};

PBSceneBattle.prototype.createAllWindows = function() {
    this.createLogWindow();
    this.createStatusWindow();
    this.createPartyCommandWindow();
    this.createActorCommandWindow();
    this.createHelpWindow();
    this.createSkillWindow();
    this.createItemWindow();
    this.createActorWindow();
    this.createEnemyWindow();
    this.createMessageWindow();
    this.createScrollTextWindow();
};

PBSceneBattle.prototype.createLogWindow = function() {
    this._logWindow = new Window_BattleLog();
    this.addWindow(this._logWindow);
};

PBSceneBattle.prototype.createStatusWindow = function() {
    this._statusWindow = new Window_BattleStatus();
    this.addWindow(this._statusWindow);
};

PBSceneBattle.prototype.createPartyCommandWindow = function() {
    this._partyCommandWindow = new Window_PartyCommand();
    this._partyCommandWindow.setHandler('fight',  this.commandFight.bind(this));
    this._partyCommandWindow.setHandler('escape', this.commandEscape.bind(this));
    this._partyCommandWindow.deselect();
    this.addWindow(this._partyCommandWindow);
};

PBSceneBattle.prototype.createActorCommandWindow = function() {
    this._actorCommandWindow = new Window_ActorCommand();
    this._actorCommandWindow.setHandler('attack', this.commandAttack.bind(this));
    this._actorCommandWindow.setHandler('skill',  this.commandSkill.bind(this));
    this._actorCommandWindow.setHandler('guard',  this.commandGuard.bind(this));
    this._actorCommandWindow.setHandler('item',   this.commandItem.bind(this));
    this._actorCommandWindow.setHandler('cancel', this.selectPreviousCommand.bind(this));
    this.addWindow(this._actorCommandWindow);
};

PBSceneBattle.prototype.createHelpWindow = function() {
    this._helpWindow = new Window_Help();
    this._helpWindow.visible = false;
    this.addWindow(this._helpWindow);
};

PBSceneBattle.prototype.createSkillWindow = function() {
    var wy = this._helpWindow.y + this._helpWindow.height;
    var wh = this._statusWindow.y - wy;
    this._skillWindow = new Window_BattleSkill(0, wy, Graphics.boxWidth, wh);
    this._skillWindow.setHelpWindow(this._helpWindow);
    this._skillWindow.setHandler('ok',     this.onSkillOk.bind(this));
    this._skillWindow.setHandler('cancel', this.onSkillCancel.bind(this));
    this.addWindow(this._skillWindow);
};

PBSceneBattle.prototype.createItemWindow = function() {
    var wy = this._helpWindow.y + this._helpWindow.height;
    var wh = this._statusWindow.y - wy;
    this._itemWindow = new Window_BattleItem(0, wy, Graphics.boxWidth, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this.addWindow(this._itemWindow);
};

PBSceneBattle.prototype.createActorWindow = function() {
    this._actorWindow = new Window_BattleActor(0, this._statusWindow.y);
    this._actorWindow.setHandler('ok',     this.onActorOk.bind(this));
    this._actorWindow.setHandler('cancel', this.onActorCancel.bind(this));
    this.addWindow(this._actorWindow);
};

PBSceneBattle.prototype.createEnemyWindow = function() {
    this._enemyWindow = new Window_BattleEnemy(0, this._statusWindow.y);
    this._enemyWindow.x = Graphics.boxWidth - this._enemyWindow.width;
    this._enemyWindow.setHandler('ok',     this.onEnemyOk.bind(this));
    this._enemyWindow.setHandler('cancel', this.onEnemyCancel.bind(this));
    this.addWindow(this._enemyWindow);
};

PBSceneBattle.prototype.createMessageWindow = function() {
    this._messageWindow = new Window_Message();
    this.addWindow(this._messageWindow);
    this._messageWindow.subWindows().forEach(function(window) {
        this.addWindow(window);
    }, this);
};

PBSceneBattle.prototype.createScrollTextWindow = function() {
    this._scrollTextWindow = new Window_ScrollText();
    this.addWindow(this._scrollTextWindow);
};

PBSceneBattle.prototype.refreshStatus = function() {
    this._statusWindow.refresh();
};

PBSceneBattle.prototype.startPartyCommandSelection = function() {
    this.refreshStatus();
    this._statusWindow.deselect();
    this._statusWindow.open();
    this._actorCommandWindow.close();
    this._partyCommandWindow.setup();
};

PBSceneBattle.prototype.commandFight = function() {
    this.selectNextCommand();
};

PBSceneBattle.prototype.commandEscape = function() {
    PBBattleManager.processEscape();
    this.changeInputWindow();
};

PBSceneBattle.prototype.startActorCommandSelection = function() {
    this._statusWindow.select(PBBattleManager.actor().index());
    this._partyCommandWindow.close();
    this._actorCommandWindow.setup(PBBattleManager.actor());
};

PBSceneBattle.prototype.commandAttack = function() {
    PBBattleManager.inputtingAction().setAttack();
    this.selectEnemySelection();
};

PBSceneBattle.prototype.commandSkill = function() {
    this._skillWindow.setActor(PBBattleManager.actor());
    this._skillWindow.setStypeId(this._actorCommandWindow.currentExt());
    this._skillWindow.refresh();
    this._skillWindow.show();
    this._skillWindow.activate();
};

PBSceneBattle.prototype.commandGuard = function() {
    PBBattleManager.inputtingAction().setGuard();
    this.selectNextCommand();
};

PBSceneBattle.prototype.commandItem = function() {
    this._itemWindow.refresh();
    this._itemWindow.show();
    this._itemWindow.activate();
};

PBSceneBattle.prototype.selectNextCommand = function() {
    PBBattleManager.selectNextCommand();
    this.changeInputWindow();
};

PBSceneBattle.prototype.selectPreviousCommand = function() {
    PBBattleManager.selectPreviousCommand();
    this.changeInputWindow();
};

PBSceneBattle.prototype.selectActorSelection = function() {
    this._actorWindow.refresh();
    this._actorWindow.show();
    this._actorWindow.activate();
};

PBSceneBattle.prototype.onActorOk = function() {
    var action = PBBattleManager.inputtingAction();
    action.setTarget(this._actorWindow.index());
    this._actorWindow.hide();
    this._skillWindow.hide();
    this._itemWindow.hide();
    this.selectNextCommand();
};

PBSceneBattle.prototype.onActorCancel = function() {
    this._actorWindow.hide();
    switch (this._actorCommandWindow.currentSymbol()) {
    case 'skill':
        this._skillWindow.show();
        this._skillWindow.activate();
        break;
    case 'item':
        this._itemWindow.show();
        this._itemWindow.activate();
        break;
    }
};

PBSceneBattle.prototype.selectEnemySelection = function() {
    this._enemyWindow.refresh();
    this._enemyWindow.show();
    this._enemyWindow.select(0);
    this._enemyWindow.activate();
};

PBSceneBattle.prototype.onEnemyOk = function() {
    var action = PBBattleManager.inputtingAction();
    action.setTarget(this._enemyWindow.enemyIndex());
    this._enemyWindow.hide();
    this._skillWindow.hide();
    this._itemWindow.hide();
    this.selectNextCommand();
};

PBSceneBattle.prototype.onEnemyCancel = function() {
    this._enemyWindow.hide();
    switch (this._actorCommandWindow.currentSymbol()) {
    case 'attack':
        this._actorCommandWindow.activate();
        break;
    case 'skill':
        this._skillWindow.show();
        this._skillWindow.activate();
        break;
    case 'item':
        this._itemWindow.show();
        this._itemWindow.activate();
        break;
    }
};

PBSceneBattle.prototype.onSkillOk = function() {
    var skill = this._skillWindow.item();
    var action = PBBattleManager.inputtingAction();
    action.setSkill(skill.id);
    PBBattleManager.actor().setLastBattleSkill(skill);
    this.onSelectAction();
};

PBSceneBattle.prototype.onSkillCancel = function() {
    this._skillWindow.hide();
    this._actorCommandWindow.activate();
};

PBSceneBattle.prototype.onItemOk = function() {
    var item = this._itemWindow.item();
    var action = PBBattleManager.inputtingAction();
    action.setItem(item.id);
    $gameParty.setLastItem(item);
    this.onSelectAction();
};

PBSceneBattle.prototype.onItemCancel = function() {
    this._itemWindow.hide();
    this._actorCommandWindow.activate();
};

PBSceneBattle.prototype.onSelectAction = function() {
    var action = PBBattleManager.inputtingAction();
    this._skillWindow.hide();
    this._itemWindow.hide();
    if (!action.needsSelection()) {
        this.selectNextCommand();
    } else if (action.isForOpponent()) {
        this.selectEnemySelection();
    } else {
        this.selectActorSelection();
    }
};

PBSceneBattle.prototype.endCommandSelection = function() {
    this._partyCommandWindow.close();
    this._actorCommandWindow.close();
    this._statusWindow.deselect();
};

//-----------------------------------------------------------------------------
// PBSpritesetBattle
//
// The set of sprites on the battle pokemon screen.

function PBSpritesetBattle() {
    this.initialize.apply(this, arguments);
}

PBSpritesetBattle.prototype = Object.create(Spriteset_Base.prototype);
PBSpritesetBattle.prototype.constructor = PBSpritesetBattle;

PBSpritesetBattle.prototype.initialize = function() {
    Spriteset_Base.prototype.initialize.call(this);
    this._battlebackLocated = false;
};

PBSpritesetBattle.prototype.createLowerLayer = function() {
    Spriteset_Base.prototype.createLowerLayer.call(this);
    this.createBackground();
    this.createBattleField();
    this.createBattleback();
    this.createEnemies();
    this.createActors();
};

PBSpritesetBattle.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this._baseSprite.addChild(this._backgroundSprite);
};

PBSpritesetBattle.prototype.update = function() {
    Spriteset_Base.prototype.update.call(this);
    this.updateActors();
    this.updateBattleback();
};

PBSpritesetBattle.prototype.createBattleField = function() {
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight;
    var x = (Graphics.width - width) / 2;
    var y = (Graphics.height - height) / 2;
    this._battleField = new Sprite();
    this._battleField.setFrame(x, y, width, height);
    this._battleField.x = x;
    this._battleField.y = y;
    this._baseSprite.addChild(this._battleField);
};

PBSpritesetBattle.prototype.createBattleback = function() {
    var margin = 32;
    var x = -this._battleField.x - margin;
    var y = -this._battleField.y - margin;
    var width = Graphics.width + margin * 2;
    var height = Graphics.height + margin * 2;
    this._back1Sprite = new TilingSprite();
    this._back2Sprite = new TilingSprite();
    this._back1Sprite.bitmap = this.battleback1Bitmap();
    this._back2Sprite.bitmap = this.battleback2Bitmap();
    this._back1Sprite.move(x, y, width, height);
    this._back2Sprite.move(x, y, width, height);
    this._battleField.addChild(this._back1Sprite);
    this._battleField.addChild(this._back2Sprite);
};

PBSpritesetBattle.prototype.updateBattleback = function() {
    if (!this._battlebackLocated) {
        this.locateBattleback();
        this._battlebackLocated = true;
    }
};

PBSpritesetBattle.prototype.locateBattleback = function() {
    var width = this._battleField.width;
    var height = this._battleField.height;
    var sprite1 = this._back1Sprite;
    var sprite2 = this._back2Sprite;
    sprite1.origin.x = sprite1.x + (sprite1.bitmap.width - width) / 2;
    sprite2.origin.x = sprite1.y + (sprite2.bitmap.width - width) / 2;
    if ($gameSystem.isSideView()) {
        sprite1.origin.y = sprite1.x + sprite1.bitmap.height - height;
        sprite2.origin.y = sprite1.y + sprite2.bitmap.height - height;
    }
};

PBSpritesetBattle.prototype.battleback1Bitmap = function() {
    return ImageManager.loadBattleback1(this.battleback1Name());
};

PBSpritesetBattle.prototype.battleback2Bitmap = function() {
    return ImageManager.loadBattleback2(this.battleback2Name());
};

PBSpritesetBattle.prototype.battleback1Name = function() {
    if (PBBattleManager.isBattleTest()) {
        return $dataSystem.battleback1Name;
    } else if ($gameMap.battleback1Name()) {
        return $gameMap.battleback1Name();
    } else if ($gameMap.isOverworld()) {
        return this.overworldBattleback1Name();
    } else {
        return '';
    }
};

PBSpritesetBattle.prototype.battleback2Name = function() {
    if (PBBattleManager.isBattleTest()) {
        return $dataSystem.battleback2Name;
    } else if ($gameMap.battleback2Name()) {
        return $gameMap.battleback2Name();
    } else if ($gameMap.isOverworld()) {
        return this.overworldBattleback2Name();
    } else {
        return '';
    }
};

PBSpritesetBattle.prototype.overworldBattleback1Name = function() {
    if ($gamePlayer.isInVehicle()) {
        return this.shipBattleback1Name();
    } else {
        return this.normalBattleback1Name();
    }
};

PBSpritesetBattle.prototype.overworldBattleback2Name = function() {
    if ($gamePlayer.isInVehicle()) {
        return this.shipBattleback2Name();
    } else {
        return this.normalBattleback2Name();
    }
};

PBSpritesetBattle.prototype.normalBattleback1Name = function() {
    return (this.terrainBattleback1Name(this.autotileType(1)) ||
            this.terrainBattleback1Name(this.autotileType(0)) ||
            this.defaultBattleback1Name());
};

PBSpritesetBattle.prototype.normalBattleback2Name = function() {
    return (this.terrainBattleback2Name(this.autotileType(1)) ||
            this.terrainBattleback2Name(this.autotileType(0)) ||
            this.defaultBattleback2Name());
};

PBSpritesetBattle.prototype.terrainBattleback1Name = function(type) {
    switch (type) {
    case 24: case 25:
        return 'Wasteland';
    case 26: case 27:
        return 'DirtField';
    case 32: case 33:
        return 'Desert';
    case 34:
        return 'Lava1';
    case 35:
        return 'Lava2';
    case 40: case 41:
        return 'Snowfield';
    case 42:
        return 'Clouds';
    case 4: case 5:
        return 'PoisonSwamp';
    default:
        return null;
    }
};

PBSpritesetBattle.prototype.terrainBattleback2Name = function(type) {
    switch (type) {
    case 20: case 21:
        return 'Forest';
    case 22: case 30: case 38:
        return 'Cliff';
    case 24: case 25: case 26: case 27:
        return 'Wasteland';
    case 32: case 33:
        return 'Desert';
    case 34: case 35:
        return 'Lava';
    case 40: case 41:
        return 'Snowfield';
    case 42:
        return 'Clouds';
    case 4: case 5:
        return 'PoisonSwamp';
    }
};

PBSpritesetBattle.prototype.defaultBattleback1Name = function() {
    return 'Grassland';
};

PBSpritesetBattle.prototype.defaultBattleback2Name = function() {
    return 'Grassland';
};

PBSpritesetBattle.prototype.shipBattleback1Name = function() {
    return 'Ship';
};

PBSpritesetBattle.prototype.shipBattleback2Name = function() {
    return 'Ship';
};

PBSpritesetBattle.prototype.autotileType = function(z) {
    return $gameMap.autotileType($gamePlayer.x, $gamePlayer.y, z);
};

PBSpritesetBattle.prototype.createEnemies = function() {
    var enemies = $gameTroop.members();
    var sprites = [];
    for (var i = 0; i < enemies.length; i++) {
        sprites[i] = new Sprite_Enemy(enemies[i]);
    }
    sprites.sort(this.compareEnemySprite.bind(this));
    for (var j = 0; j < sprites.length; j++) {
        this._battleField.addChild(sprites[j]);
    }
    this._enemySprites = sprites;
};

PBSpritesetBattle.prototype.compareEnemySprite = function(a, b) {
    if (a.y !== b.y) {
        return a.y - b.y;
    } else {
        return b.spriteId - a.spriteId;
    }
};

PBSpritesetBattle.prototype.createActors = function() {
    this._actorSprites = [];
    for (var i = 0; i < $gameParty.maxBattleMembers(); i++) {
        this._actorSprites[i] = new Sprite_Actor();
        this._battleField.addChild(this._actorSprites[i]);
    }
};

PBSpritesetBattle.prototype.updateActors = function() {
    var members = $gameParty.battleMembers();
    for (var i = 0; i < this._actorSprites.length; i++) {
        this._actorSprites[i].setBattler(members[i]);
    }
};

PBSpritesetBattle.prototype.battlerSprites = function() {
    return this._enemySprites.concat(this._actorSprites);
};

PBSpritesetBattle.prototype.isAnimationPlaying = function() {
    return this.battlerSprites().some(function(sprite) {
        return sprite.isAnimationPlaying();
    });
};

PBSpritesetBattle.prototype.isEffecting = function() {
    return this.battlerSprites().some(function(sprite) {
        return sprite.isEffecting();
    });
};

PBSpritesetBattle.prototype.isAnyoneMoving = function() {
    return this.battlerSprites().some(function(sprite) {
        return sprite.isMoving();
    });
};

PBSpritesetBattle.prototype.isBusy = function() {
    return this.isAnimationPlaying() || this.isAnyoneMoving();
};

//-----------------------------------------------------------------------------
// PBBattleManager
//
// The static class that manages battle progress.

function PBBattleManager() {
    throw new Error('This is a static class');
}

PBBattleManager.setup = function(troopId, canEscape, canLose) {
    this.initMembers();
    this._canEscape = canEscape;
    this._canLose = canLose;
    $gameTroop.setup(troopId);
    $gameScreen.onBattleStart();
    this.makeEscapeRatio();
};

PBBattleManager.initMembers = function() {
    this._phase = 'init';
    this._canEscape = false;
    this._canLose = false;
    this._battleTest = false;
    this._eventCallback = null;
    this._preemptive = false;
    this._surprise = false;
    this._actorIndex = -1;
    this._actionForcedBattler = null;
    this._mapBgm = null;
    this._mapBgs = null;
    this._actionBattlers = [];
    this._subject = null;
    this._action = null;
    this._targets = [];
    this._logWindow = null;
    this._statusWindow = null;
    this._spriteset = null;
    this._escapeRatio = 0;
    this._escaped = false;
    this._rewards = {};
    this._turnForced = false;
};

PBBattleManager.isBattleTest = function() {
    return this._battleTest;
};

PBBattleManager.setBattleTest = function(battleTest) {
    this._battleTest = battleTest;
};

PBBattleManager.setEventCallback = function(callback) {
    this._eventCallback = callback;
};

PBBattleManager.setLogWindow = function(logWindow) {
    this._logWindow = logWindow;
};

PBBattleManager.setStatusWindow = function(statusWindow) {
    this._statusWindow = statusWindow;
};

PBBattleManager.setSpriteset = function(spriteset) {
    this._spriteset = spriteset;
};

PBBattleManager.onEncounter = function() {
    this._preemptive = (Math.random() < this.ratePreemptive());
    this._surprise = (Math.random() < this.rateSurprise() && !this._preemptive);
};

PBBattleManager.ratePreemptive = function() {
    return $gameParty.ratePreemptive($gameTroop.agility());
};

PBBattleManager.rateSurprise = function() {
    return $gameParty.rateSurprise($gameTroop.agility());
};

PBBattleManager.saveBgmAndBgs = function() {
    this._mapBgm = AudioManager.saveBgm();
    this._mapBgs = AudioManager.saveBgs();
};

PBBattleManager.playBattleBgm = function() {
    AudioManager.playBgm($gameSystem.battleBgm());
    AudioManager.stopBgs();
};

PBBattleManager.playVictoryMe = function() {
    AudioManager.playMe($gameSystem.victoryMe());
};

PBBattleManager.playDefeatMe = function() {
    AudioManager.playMe($gameSystem.defeatMe());
};

PBBattleManager.replayBgmAndBgs = function() {
    if (this._mapBgm) {
        AudioManager.replayBgm(this._mapBgm);
    } else {
        AudioManager.stopBgm();
    }
    if (this._mapBgs) {
        AudioManager.replayBgs(this._mapBgs);
    }
};

PBBattleManager.makeEscapeRatio = function() {
    this._escapeRatio = 0.5 * $gameParty.agility() / $gameTroop.agility();
};

PBBattleManager.update = function() {
    if (!this.isBusy() && !this.updateEvent()) {
        switch (this._phase) {
        case 'start':
            this.startInput();
            break;
        case 'turn':
            this.updateTurn();
            break;
        case 'action':
            this.updateAction();
            break;
        case 'turnEnd':
            this.updateTurnEnd();
            break;
        case 'battleEnd':
            this.updateBattleEnd();
            break;
        }
    }
};

PBBattleManager.updateEvent = function() {
    switch (this._phase) {
        case 'start':
        case 'turn':
        case 'turnEnd':
            if (this.isActionForced()) {
                this.processForcedAction();
                return true;
            } else {
                return this.updateEventMain();
            }
    }
    return this.checkAbort2();
};

PBBattleManager.updateEventMain = function() {
    $gameTroop.updateInterpreter();
    $gameParty.requestMotionRefresh();
    if ($gameTroop.isEventRunning() || this.checkBattleEnd()) {
        return true;
    }
    $gameTroop.setupBattleEvent();
    if ($gameTroop.isEventRunning() || SceneManager.isSceneChanging()) {
        return true;
    }
    return false;
};

PBBattleManager.isBusy = function() {
    return ($gameMessage.isBusy() || this._spriteset.isBusy() ||
            this._logWindow.isBusy());
};

PBBattleManager.isInputting = function() {
    return this._phase === 'input';
};

PBBattleManager.isInTurn = function() {
    return this._phase === 'turn';
};

PBBattleManager.isTurnEnd = function() {
    return this._phase === 'turnEnd';
};

PBBattleManager.isAborting = function() {
    return this._phase === 'aborting';
};

PBBattleManager.isBattleEnd = function() {
    return this._phase === 'battleEnd';
};

PBBattleManager.canEscape = function() {
    return this._canEscape;
};

PBBattleManager.canLose = function() {
    return this._canLose;
};

PBBattleManager.isEscaped = function() {
    return this._escaped;
};

PBBattleManager.actor = function() {
    return this._actorIndex >= 0 ? $gameParty.members()[this._actorIndex] : null;
};

PBBattleManager.clearActor = function() {
    this.changeActor(-1, '');
};

PBBattleManager.changeActor = function(newActorIndex, lastActorActionState) {
    var lastActor = this.actor();
    this._actorIndex = newActorIndex;
    var newActor = this.actor();
    if (lastActor) {
        lastActor.setActionState(lastActorActionState);
    }
    if (newActor) {
        newActor.setActionState('inputting');
    }
};

PBBattleManager.startBattle = function() {
    this._phase = 'start';
    $gameSystem.onBattleStart();
    $gameParty.onBattleStart();
    $gameTroop.onBattleStart();
    this.displayStartMessages();
};

PBBattleManager.displayStartMessages = function() {
    $gameTroop.enemyNames().forEach(function(name) {
        $gameMessage.add(TextManager.emerge.format(name));
    });
    if (this._preemptive) {
        $gameMessage.add(TextManager.preemptive.format($gameParty.name()));
    } else if (this._surprise) {
        $gameMessage.add(TextManager.surprise.format($gameParty.name()));
    }
};

PBBattleManager.startInput = function() {
    this._phase = 'input';
    $gameParty.makeActions();
    $gameTroop.makeActions();
    this.clearActor();
    if (this._surprise || !$gameParty.canInput()) {
        this.startTurn();
    }
};

PBBattleManager.inputtingAction = function() {
    return this.actor() ? this.actor().inputtingAction() : null;
};

PBBattleManager.selectNextCommand = function() {
    do {
        if (!this.actor() || !this.actor().selectNextCommand()) {
            this.changeActor(this._actorIndex + 1, 'waiting');
            if (this._actorIndex >= $gameParty.size()) {
                this.startTurn();
                break;
            }
        }
    } while (!this.actor().canInput());
};

PBBattleManager.selectPreviousCommand = function() {
    do {
        if (!this.actor() || !this.actor().selectPreviousCommand()) {
            this.changeActor(this._actorIndex - 1, 'undecided');
            if (this._actorIndex < 0) {
                return;
            }
        }
    } while (!this.actor().canInput());
};

PBBattleManager.refreshStatus = function() {
    this._statusWindow.refresh();
};

PBBattleManager.startTurn = function() {
    this._phase = 'turn';
    this.clearActor();
    $gameTroop.increaseTurn();
    this.makeActionOrders();
    $gameParty.requestMotionRefresh();
    this._logWindow.startTurn();
};

PBBattleManager.updateTurn = function() {
    $gameParty.requestMotionRefresh();
    if (!this._subject) {
        this._subject = this.getNextSubject();
    }
    if (this._subject) {
        this.processTurn();
    } else {
        this.endTurn();
    }
};

PBBattleManager.processTurn = function() {
    var subject = this._subject;
    var action = subject.currentAction();
    if (action) {
        action.prepare();
        if (action.isValid()) {
            this.startAction();
        }
        subject.removeCurrentAction();
    } else {
        subject.onAllActionsEnd();
        this.refreshStatus();
        this._logWindow.displayAutoAffectedStatus(subject);
        this._logWindow.displayCurrentState(subject);
        this._logWindow.displayRegeneration(subject);
        this._subject = this.getNextSubject();
    }
};

PBBattleManager.endTurn = function() {
    this._phase = 'turnEnd';
    this._preemptive = false;
    this._surprise = false;
    this.allBattleMembers().forEach(function(battler) {
        battler.onTurnEnd();
        this.refreshStatus();
        this._logWindow.displayAutoAffectedStatus(battler);
        this._logWindow.displayRegeneration(battler);
    }, this);
    if (this.isForcedTurn()) {
        this._turnForced = false;
    }
};

PBBattleManager.isForcedTurn = function () {
    return this._turnForced;
};

PBBattleManager.updateTurnEnd = function() {
    this.startInput();
};

PBBattleManager.getNextSubject = function() {
    for (;;) {
        var battler = this._actionBattlers.shift();
        if (!battler) {
            return null;
        }
        if (battler.isBattleMember() && battler.isAlive()) {
            return battler;
        }
    }
};

PBBattleManager.allBattleMembers = function() {
    return $gameParty.members().concat($gameTroop.members());
};

PBBattleManager.makeActionOrders = function() {
    var battlers = [];
    if (!this._surprise) {
        battlers = battlers.concat($gameParty.members());
    }
    if (!this._preemptive) {
        battlers = battlers.concat($gameTroop.members());
    }
    battlers.forEach(function(battler) {
        battler.makeSpeed();
    });
    battlers.sort(function(a, b) {
        return b.speed() - a.speed();
    });
    this._actionBattlers = battlers;
};

PBBattleManager.startAction = function() {
    var subject = this._subject;
    var action = subject.currentAction();
    var targets = action.makeTargets();
    this._phase = 'action';
    this._action = action;
    this._targets = targets;
    subject.useItem(action.item());
    this._action.applyGlobal();
    this.refreshStatus();
    this._logWindow.startAction(subject, action, targets);
};

PBBattleManager.updateAction = function() {
    var target = this._targets.shift();
    if (target) {
        this.invokeAction(this._subject, target);
    } else {
        this.endAction();
    }
};

PBBattleManager.endAction = function() {
    this._logWindow.endAction(this._subject);
    this._phase = 'turn';
};

PBBattleManager.invokeAction = function(subject, target) {
    this._logWindow.push('pushBaseLine');
    if (Math.random() < this._action.itemCnt(target)) {
        this.invokeCounterAttack(subject, target);
    } else if (Math.random() < this._action.itemMrf(target)) {
        this.invokeMagicReflection(subject, target);
    } else {
        this.invokeNormalAction(subject, target);
    }
    subject.setLastTarget(target);
    this._logWindow.push('popBaseLine');
    this.refreshStatus();
};

PBBattleManager.invokeNormalAction = function(subject, target) {
    var realTarget = this.applySubstitute(target);
    this._action.apply(realTarget);
    this._logWindow.displayActionResults(subject, realTarget);
};

PBBattleManager.invokeCounterAttack = function(subject, target) {
    var action = new Game_Action(target);
    action.setAttack();
    action.apply(subject);
    this._logWindow.displayCounter(target);
    this._logWindow.displayActionResults(target, subject);
};

PBBattleManager.invokeMagicReflection = function(subject, target) {
	this._action._reflectionTarget = target;
    this._logWindow.displayReflection(target);
    this._action.apply(subject);
    this._logWindow.displayActionResults(target, subject);
};

PBBattleManager.applySubstitute = function(target) {
    if (this.checkSubstitute(target)) {
        var substitute = target.friendsUnit().substituteBattler();
        if (substitute && target !== substitute) {
            this._logWindow.displaySubstitute(substitute, target);
            return substitute;
        }
    }
    return target;
};

PBBattleManager.checkSubstitute = function(target) {
    return target.isDying() && !this._action.isCertainHit();
};

PBBattleManager.isActionForced = function() {
    return !!this._actionForcedBattler;
};

PBBattleManager.forceAction = function(battler) {
    this._actionForcedBattler = battler;
    var index = this._actionBattlers.indexOf(battler);
    if (index >= 0) {
        this._actionBattlers.splice(index, 1);
    }
};

PBBattleManager.processForcedAction = function() {
    if (this._actionForcedBattler) {
        this._turnForced = true;
        this._subject = this._actionForcedBattler;
        this._actionForcedBattler = null;
        this.startAction();
        this._subject.removeCurrentAction();
    }
};

PBBattleManager.abort = function() {
    this._phase = 'aborting';
};

PBBattleManager.checkBattleEnd = function() {
    if (this._phase) {
        if (this.checkAbort()) {
            return true;
        } else if ($gameParty.isAllDead()) {
            this.processDefeat();
            return true;
        } else if ($gameTroop.isAllDead()) {
            this.processVictory();
            return true;
        }
    }
    return false;
};

PBBattleManager.checkAbort = function() {
    if ($gameParty.isEmpty() || this.isAborting()) {
        this.processAbort();
        return true;
    }
    return false;
};

PBBattleManager.checkAbort2 = function() {
    if ($gameParty.isEmpty() || this.isAborting()) {
        SoundManager.playEscape();
        this._escaped = true;
        this.processAbort();
    }
    return false;
};

PBBattleManager.processVictory = function() {
    $gameParty.removeBattleStates();
    $gameParty.performVictory();
    this.playVictoryMe();
    this.replayBgmAndBgs();
    this.makeRewards();
    this.displayVictoryMessage();
    this.displayRewards();
    this.gainRewards();
    this.endBattle(0);
};

PBBattleManager.processEscape = function() {
    $gameParty.performEscape();
    SoundManager.playEscape();
    var success = this._preemptive ? true : (Math.random() < this._escapeRatio);
    if (success) {
        this.displayEscapeSuccessMessage();
        this._escaped = true;
        this.processAbort();
    } else {
        this.displayEscapeFailureMessage();
        this._escapeRatio += 0.1;
        $gameParty.clearActions();
        this.startTurn();
    }
    return success;
};

PBBattleManager.processAbort = function() {
    $gameParty.removeBattleStates();
    this.replayBgmAndBgs();
    this.endBattle(1);
};

PBBattleManager.processDefeat = function() {
    this.displayDefeatMessage();
    this.playDefeatMe();
    if (this._canLose) {
        this.replayBgmAndBgs();
    } else {
        AudioManager.stopBgm();
    }
    this.endBattle(2);
};

PBBattleManager.endBattle = function(result) {
    this._phase = 'battleEnd';
    if (this._eventCallback) {
        this._eventCallback(result);
    }
    if (result === 0) {
        $gameSystem.onBattleWin();
    } else if (this._escaped) {
        $gameSystem.onBattleEscape();
    }
};

PBBattleManager.updateBattleEnd = function() {
    if (this.isBattleTest()) {
        AudioManager.stopBgm();
        SceneManager.exit();
    } else if (!this._escaped && $gameParty.isAllDead()) {
        if (this._canLose) {
            $gameParty.reviveBattleMembers();
            SceneManager.pop();
        } else {
            SceneManager.goto(Scene_Gameover);
        }
    } else {
        SceneManager.pop();
    }
    this._phase = null;
};

PBBattleManager.makeRewards = function() {
    this._rewards = {};
    this._rewards.gold = $gameTroop.goldTotal();
    this._rewards.exp = $gameTroop.expTotal();
    this._rewards.items = $gameTroop.makeDropItems();
};

PBBattleManager.displayVictoryMessage = function() {
    $gameMessage.add(TextManager.victory.format($gameParty.name()));
};

PBBattleManager.displayDefeatMessage = function() {
    $gameMessage.add(TextManager.defeat.format($gameParty.name()));
};

PBBattleManager.displayEscapeSuccessMessage = function() {
    $gameMessage.add(TextManager.escapeStart.format($gameParty.name()));
};

PBBattleManager.displayEscapeFailureMessage = function() {
    $gameMessage.add(TextManager.escapeStart.format($gameParty.name()));
    $gameMessage.add('\\.' + TextManager.escapeFailure);
};

PBBattleManager.displayRewards = function() {
    this.displayExp();
    this.displayGold();
    this.displayDropItems();
};

PBBattleManager.displayExp = function() {
    var exp = this._rewards.exp;
    if (exp > 0) {
        var text = TextManager.obtainExp.format(exp, TextManager.exp);
        $gameMessage.add('\\.' + text);
    }
};

PBBattleManager.displayGold = function() {
    var gold = this._rewards.gold;
    if (gold > 0) {
        $gameMessage.add('\\.' + TextManager.obtainGold.format(gold));
    }
};

PBBattleManager.displayDropItems = function() {
    var items = this._rewards.items;
    if (items.length > 0) {
        $gameMessage.newPage();
        items.forEach(function(item) {
            $gameMessage.add(TextManager.obtainItem.format(item.name));
        });
    }
};

PBBattleManager.gainRewards = function() {
    this.gainExp();
    this.gainGold();
    this.gainDropItems();
};

PBBattleManager.gainExp = function() {
    var exp = this._rewards.exp;
    $gameParty.allMembers().forEach(function(actor) {
        actor.gainExp(exp);
    });
};

PBBattleManager.gainGold = function() {
    $gameParty.gainGold(this._rewards.gold);
};

PBBattleManager.gainDropItems = function() {
    var items = this._rewards.items;
    items.forEach(function(item) {
        $gameParty.gainItem(item, 1);
    });
};