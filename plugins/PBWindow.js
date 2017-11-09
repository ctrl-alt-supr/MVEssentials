
/*:
 * @plugindesc Base window classes for Pokemon Essentials MV.
 * @author MVEssentials
 *
 * @help 
 *
 * @param CategoryGeneric
 * @text General settings
 * @default ------
 * 
 * 
 */

var parameters = PluginManager.parameters('PBWindow');

SceneManager.snapForBackgroundNoBlur = function() {
    this._backgroundBitmap = this.snap();
};
Scene_Map.prototype.createMessageWindow = function() {
    this._messageWindow = new PBWindowMessage();
    this.addWindow(this._messageWindow);
    this._messageWindow.subWindows().forEach(function(window) {
        this.addWindow(window);
    }, this);
};
Scene_Battle.prototype.createMessageWindow = function() {
    this._messageWindow = new PBWindowMessage();
    this.addWindow(this._messageWindow);
    this._messageWindow.subWindows().forEach(function(window) {
        this.addWindow(window);
    }, this);
};



//-----------------------------------------------------------------------------
// PBWindowBase
//
// The superclass of all windows within the game. Modified version of Window_Base. Superclass of all Essential Windows

function PBWindowBase() {
    this.initialize.apply(this, arguments);
}

PBWindowBase.prototype = Object.create(Window.prototype);
PBWindowBase.prototype.constructor = PBWindowBase;

PBWindowBase.prototype.initialize = function(x, y, width, height) {
    Window.prototype.initialize.call(this);
    this.loadWindowskin();
    this.move(x, y, width, height);
    this.updatePadding();
    this.updateBackOpacity();
    this.updateTone();
    this.createContents();
    this._opening = false;
    this._closing = false;
    this._dimmerSprite = null;
};

PBWindowBase._iconWidth  = 32;
PBWindowBase._iconHeight = 32;
PBWindowBase._faceWidth  = 144;
PBWindowBase._faceHeight = 144;

PBWindowBase.prototype.lineHeight = function() {
    return 36;
};

PBWindowBase.prototype.standardFontFace = function() {
    if ($gameSystem.isChinese()) {
        return 'SimHei, Heiti TC, sans-serif';
    } else if ($gameSystem.isKorean()) {
        return 'Dotum, AppleGothic, sans-serif';
    } else {
        return 'GameFont';
    }
};

PBWindowBase.prototype.standardFontSize = function() {
    return 28;
};

PBWindowBase.prototype.standardPadding = function() {
    return 18;
};

PBWindowBase.prototype.textPadding = function() {
    return 6;
};

PBWindowBase.prototype.standardBackOpacity = function() {
    return 255;
};

PBWindowBase.prototype.loadWindowskin = function() {
    this.windowskin = ImageManager.loadSystem('Window');
};

PBWindowBase.prototype.updatePadding = function() {
    this.padding = this.standardPadding();
};

PBWindowBase.prototype.updateBackOpacity = function() {
    this.backOpacity = this.standardBackOpacity();
};

PBWindowBase.prototype.contentsWidth = function() {
    return this.width - this.standardPadding() * 2;
};

PBWindowBase.prototype.contentsHeight = function() {
    return this.height - this.standardPadding() * 2;
};

PBWindowBase.prototype.fittingHeight = function(numLines) {
    return numLines * this.lineHeight() + this.standardPadding() * 2;
};

PBWindowBase.prototype.updateTone = function() {
    var tone = $gameSystem.windowTone();
    this.setTone(tone[0], tone[1], tone[2]);
};

PBWindowBase.prototype.createContents = function() {
    this.contents = new Bitmap(this.contentsWidth(), this.contentsHeight());
    
    this.resetFontSettings();
    
};
PBWindowBase.prototype.usesCursorArrow = function() {
    return false;
};
PBWindowBase.prototype.setCursorRect = function(x, y, width, height) {
    Window.prototype.setCursorRect.call(this, x, y, width, height);
    this._refreshArrowCursor();
}
PBWindowBase.prototype._refreshAllParts = function() {
    Window.prototype._refreshAllParts.call(this);
    this._refreshArrowCursor();
}
PBWindowBase.prototype._refreshArrowCursor = function() {
    if(this.usesCursorArrow()){
        
        var pad = this._padding;
        var x = this._cursorRect.x + pad - this.origin.x;
        var y = this._cursorRect.y + pad - this.origin.y;
        var w = this._cursorRect.width;
        var h = this._cursorRect.height;
        var m = 4;
        var x2 = Math.max(x, pad);
        var y2 = Math.max(y, pad);
        var ox = x - x2;
        var oy = y - y2;
        var w2 = Math.min(w, this._width - pad - x2);
        var h2 = Math.min(h, this._height - pad - y2);
        var bitmap = ImageManager.loadSystem("selarrow");
        if(this._windowCursorArrowSprite==undefined || this._windowCursorArrowSprite==null){
            this._windowCursorArrowSprite = new Sprite();
            this.addChild(this._windowCursorArrowSprite);  
        }
        this._windowCursorArrowSprite.bitmap = bitmap;
        this._windowCursorArrowSprite.setFrame(0, 0, w2, h2);
        this._windowCursorArrowSprite.move(x2 - this.cursorArrowContainerWidth, y2);
    }else{
        if(this._windowCursorArrowSprite!=null){
            this._windowCursorArrowSprite.visible=false;  
        }
    }
};

PBWindowBase.prototype.resetFontSettings = function() {
    this.contents.fontFace = this.standardFontFace();
    this.contents.fontSize = this.standardFontSize();
    this.contents.outlineColor = 'rgba(0, 0, 0, 0.5)';
    this.contents.outlineWidth = 2;
    this.resetTextColor();
};

PBWindowBase.prototype.resetTextColor = function() {
    this.changeTextColor(this.normalColor());
};

PBWindowBase.prototype.update = function() {
    Window.prototype.update.call(this);
    this.updateTone();
    this.updateOpen();
    this.updateClose();
    this.updateBackgroundDimmer();
};

PBWindowBase.prototype.updateOpen = function() {
    if (this._opening) {
        this.openness += 32;
        if (this.isOpen()) {
            this._opening = false;
        }
    }
};

PBWindowBase.prototype.updateClose = function() {
    if (this._closing) {
        this.openness -= 32;
        if (this.isClosed()) {
            this._closing = false;
        }
    }
};

PBWindowBase.prototype.open = function() {
    if (!this.isOpen()) {
        this._opening = true;
    }
    this._closing = false;
};

PBWindowBase.prototype.close = function() {
    if (!this.isClosed()) {
        this._closing = true;
    }
    this._opening = false;
};

PBWindowBase.prototype.isOpening = function() {
    return this._opening;
};

PBWindowBase.prototype.isClosing = function() {
    return this._closing;
};

PBWindowBase.prototype.show = function() {
    this.visible = true;
};

PBWindowBase.prototype.hide = function() {
    this.visible = false;
};

PBWindowBase.prototype.activate = function() {
    this.active = true;
};

PBWindowBase.prototype.deactivate = function() {
    this.active = false;
};

PBWindowBase.prototype.textColor = function(n) {
    var px = 96 + (n % 8) * 12 + 6;
    var py = 144 + Math.floor(n / 8) * 12 + 6;
    return this.windowskin.getPixel(px, py);
};

PBWindowBase.prototype.normalColor = function() {
    return this.textColor(7);
};

PBWindowBase.prototype.systemColor = function() {
    return this.textColor(16);
};

PBWindowBase.prototype.crisisColor = function() {
    return this.textColor(17);
};

PBWindowBase.prototype.deathColor = function() {
    return this.textColor(18);
};

PBWindowBase.prototype.gaugeBackColor = function() {
    return this.textColor(19);
};

PBWindowBase.prototype.hpGaugeColor1 = function() {
    return this.textColor(20);
};

PBWindowBase.prototype.hpGaugeColor2 = function() {
    return this.textColor(21);
};

PBWindowBase.prototype.mpGaugeColor1 = function() {
    return this.textColor(22);
};

PBWindowBase.prototype.mpGaugeColor2 = function() {
    return this.textColor(23);
};

PBWindowBase.prototype.mpCostColor = function() {
    return this.textColor(23);
};

PBWindowBase.prototype.powerUpColor = function() {
    return this.textColor(24);
};

PBWindowBase.prototype.powerDownColor = function() {
    return this.textColor(25);
};

PBWindowBase.prototype.tpGaugeColor1 = function() {
    return this.textColor(28);
};

PBWindowBase.prototype.tpGaugeColor2 = function() {
    return this.textColor(29);
};

PBWindowBase.prototype.tpCostColor = function() {
    return this.textColor(29);
};

PBWindowBase.prototype.pendingColor = function() {
    return this.windowskin.getPixel(120, 120);
};

PBWindowBase.prototype.translucentOpacity = function() {
    return 160;
};

PBWindowBase.prototype.changeTextColor = function(color) {
    this.contents.textColor = color;
};

PBWindowBase.prototype.changePaintOpacity = function(enabled) {
    this.contents.paintOpacity = enabled ? 255 : this.translucentOpacity();
};

PBWindowBase.prototype.drawText = function(text, x, y, maxWidth, align) {
    this.contents.drawText(text, x, y, maxWidth, this.lineHeight(), align);
};

PBWindowBase.prototype.textWidth = function(text) {
    return this.contents.measureTextWidth(text);
};

PBWindowBase.prototype.drawTextEx = function(text, x, y) {
    if (text) {
        var textState = { index: 0, x: x, y: y, left: x };
        textState.text = this.convertEscapeCharacters(text);
        textState.height = this.calcTextHeight(textState, false);
        this.resetFontSettings();
        while (textState.index < textState.text.length) {
            this.processCharacter(textState);
        }
        return textState.x - x;
    } else {
        return 0;
    }
};

PBWindowBase.prototype.convertEscapeCharacters = function(text) {
    text = text.replace(/\\/g, '\x1b');
    text = text.replace(/\x1b\x1b/g, '\\');
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
        return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
        return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
        return this.actorName(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
        return this.partyMemberName(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
    return text;
};

PBWindowBase.prototype.actorName = function(n) {
    var actor = n >= 1 ? $gameActors.actor(n) : null;
    return actor ? actor.name() : '';
};

PBWindowBase.prototype.partyMemberName = function(n) {
    var actor = n >= 1 ? $gameParty.members()[n - 1] : null;
    return actor ? actor.name() : '';
};

PBWindowBase.prototype.processCharacter = function(textState) {
    switch (textState.text[textState.index]) {
    case '\n':
        this.processNewLine(textState);
        break;
    case '\f':
        this.processNewPage(textState);
        break;
    case '\x1b':
        this.processEscapeCharacter(this.obtainEscapeCode(textState), textState);
        break;
    default:
        this.processNormalCharacter(textState);
        break;
    }
};

PBWindowBase.prototype.processNormalCharacter = function(textState) {
    var c = textState.text[textState.index++];
    var w = this.textWidth(c);
    this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
    textState.x += w;
};

PBWindowBase.prototype.processNewLine = function(textState) {
    textState.x = textState.left;
    textState.y += textState.height;
    textState.height = this.calcTextHeight(textState, false);
    textState.index++;
};

PBWindowBase.prototype.processNewPage = function(textState) {
    textState.index++;
};

PBWindowBase.prototype.obtainEscapeCode = function(textState) {
    textState.index++;
    var regExp = /^[\$\.\|\^!><\{\}\\]|^[A-Z]+/i;
    var arr = regExp.exec(textState.text.slice(textState.index));
    if (arr) {
        textState.index += arr[0].length;
        return arr[0].toUpperCase();
    } else {
        return '';
    }
};

PBWindowBase.prototype.obtainEscapeParam = function(textState) {
    var arr = /^\[\d+\]/.exec(textState.text.slice(textState.index));
    if (arr) {
        textState.index += arr[0].length;
        return parseInt(arr[0].slice(1));
    } else {
        return '';
    }
};

PBWindowBase.prototype.processEscapeCharacter = function(code, textState) {
    switch (code) {
    case 'C':
        this.changeTextColor(this.textColor(this.obtainEscapeParam(textState)));
        break;
    case 'I':
        this.processDrawIcon(this.obtainEscapeParam(textState), textState);
        break;
    case '{':
        this.makeFontBigger();
        break;
    case '}':
        this.makeFontSmaller();
        break;
    }
};

PBWindowBase.prototype.processDrawIcon = function(iconIndex, textState) {
    this.drawIcon(iconIndex, textState.x + 2, textState.y + 2);
    textState.x += PBWindowBase._iconWidth + 4;
};

PBWindowBase.prototype.makeFontBigger = function() {
    if (this.contents.fontSize <= 96) {
        this.contents.fontSize += 12;
    }
};

PBWindowBase.prototype.makeFontSmaller = function() {
    if (this.contents.fontSize >= 24) {
        this.contents.fontSize -= 12;
    }
};

PBWindowBase.prototype.calcTextHeight = function(textState, all) {
    var lastFontSize = this.contents.fontSize;
    var textHeight = 0;
    var lines = textState.text.slice(textState.index).split('\n');
    var maxLines = all ? lines.length : 1;

    for (var i = 0; i < maxLines; i++) {
        var maxFontSize = this.contents.fontSize;
        var regExp = /\x1b[\{\}]/g;
        for (;;) {
            var array = regExp.exec(lines[i]);
            if (array) {
                if (array[0] === '\x1b{') {
                    this.makeFontBigger();
                }
                if (array[0] === '\x1b}') {
                    this.makeFontSmaller();
                }
                if (maxFontSize < this.contents.fontSize) {
                    maxFontSize = this.contents.fontSize;
                }
            } else {
                break;
            }
        }
        textHeight += maxFontSize + 8;
    }

    this.contents.fontSize = lastFontSize;
    return textHeight;
};

PBWindowBase.prototype.drawIcon = function(iconIndex, x, y) {
    var bitmap = ImageManager.loadSystem('IconSet');
    var pw = PBWindowBase._iconWidth;
    var ph = PBWindowBase._iconHeight;
    var sx = iconIndex % 16 * pw;
    var sy = Math.floor(iconIndex / 16) * ph;
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y);
};

PBWindowBase.prototype.drawFace = function(faceName, faceIndex, x, y, width, height) {
    width = width || PBWindowBase._faceWidth;
    height = height || PBWindowBase._faceHeight;
    var bitmap = ImageManager.loadFace(faceName);
    var pw = PBWindowBase._faceWidth;
    var ph = PBWindowBase._faceHeight;
    var sw = Math.min(width, pw);
    var sh = Math.min(height, ph);
    var dx = Math.floor(x + Math.max(width - pw, 0) / 2);
    var dy = Math.floor(y + Math.max(height - ph, 0) / 2);
    var sx = faceIndex % 4 * pw + (pw - sw) / 2;
    var sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
    this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
};

PBWindowBase.prototype.drawCharacter = function(characterName, characterIndex, x, y) {
    var bitmap = ImageManager.loadCharacter(characterName);
    var big = ImageManager.isBigCharacter(characterName);
    var pw = bitmap.width / (big ? 3 : 12);
    var ph = bitmap.height / (big ? 4 : 8);
    var n = characterIndex;
    var sx = (n % 4 * 3 + 1) * pw;
    var sy = (Math.floor(n / 4) * 4) * ph;
    this.contents.blt(bitmap, sx, sy, pw, ph, x - pw / 2, y - ph);
};

PBWindowBase.prototype.drawGauge = function(x, y, width, rate, color1, color2) {
    var fillW = Math.floor(width * rate);
    var gaugeY = y + this.lineHeight() - 8;
    this.contents.fillRect(x, gaugeY, width, 6, this.gaugeBackColor());
    this.contents.gradientFillRect(x, gaugeY, fillW, 6, color1, color2);
};

PBWindowBase.prototype.hpColor = function(actor) {
    if (actor.isDead()) {
        return this.deathColor();
    } else if (actor.isDying()) {
        return this.crisisColor();
    } else {
        return this.normalColor();
    }
};

PBWindowBase.prototype.mpColor = function(actor) {
    return this.normalColor();
};

PBWindowBase.prototype.tpColor = function(actor) {
    return this.normalColor();
};

PBWindowBase.prototype.drawActorCharacter = function(actor, x, y) {
    this.drawCharacter(actor.characterName(), actor.characterIndex(), x, y);
};

PBWindowBase.prototype.drawActorFace = function(actor, x, y, width, height) {
    this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height);
};

PBWindowBase.prototype.drawActorName = function(actor, x, y, width) {
    width = width || 168;
    this.changeTextColor(this.hpColor(actor));
    this.drawText(actor.name(), x, y, width);
};

PBWindowBase.prototype.drawActorClass = function(actor, x, y, width) {
    width = width || 168;
    this.resetTextColor();
    this.drawText(actor.currentClass().name, x, y, width);
};

PBWindowBase.prototype.drawActorNickname = function(actor, x, y, width) {
    width = width || 270;
    this.resetTextColor();
    this.drawText(actor.nickname(), x, y, width);
};

PBWindowBase.prototype.drawActorLevel = function(actor, x, y) {
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.levelA, x, y, 48);
    this.resetTextColor();
    this.drawText(actor.level, x + 84, y, 36, 'right');
};

PBWindowBase.prototype.drawActorIcons = function(actor, x, y, width) {
    width = width || 144;
    var icons = actor.allIcons().slice(0, Math.floor(width / PBWindowBase._iconWidth));
    for (var i = 0; i < icons.length; i++) {
        this.drawIcon(icons[i], x + PBWindowBase._iconWidth * i, y + 2);
    }
};

PBWindowBase.prototype.drawCurrentAndMax = function(current, max, x, y,
                                                   width, color1, color2) {
    var labelWidth = this.textWidth('HP');
    var valueWidth = this.textWidth('0000');
    var slashWidth = this.textWidth('/');
    var x1 = x + width - valueWidth;
    var x2 = x1 - slashWidth;
    var x3 = x2 - valueWidth;
    if (x3 >= x + labelWidth) {
        this.changeTextColor(color1);
        this.drawText(current, x3, y, valueWidth, 'right');
        this.changeTextColor(color2);
        this.drawText('/', x2, y, slashWidth, 'right');
        this.drawText(max, x1, y, valueWidth, 'right');
    } else {
        this.changeTextColor(color1);
        this.drawText(current, x1, y, valueWidth, 'right');
    }
};

PBWindowBase.prototype.drawActorHp = function(actor, x, y, width) {
    width = width || 186;
    var color1 = this.hpGaugeColor1();
    var color2 = this.hpGaugeColor2();
    this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.hpA, x, y, 44);
    this.drawCurrentAndMax(actor.hp, actor.mhp, x, y, width,
                           this.hpColor(actor), this.normalColor());
};

PBWindowBase.prototype.drawActorMp = function(actor, x, y, width) {
    width = width || 186;
    var color1 = this.mpGaugeColor1();
    var color2 = this.mpGaugeColor2();
    this.drawGauge(x, y, width, actor.mpRate(), color1, color2);
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.mpA, x, y, 44);
    this.drawCurrentAndMax(actor.mp, actor.mmp, x, y, width,
                           this.mpColor(actor), this.normalColor());
};

PBWindowBase.prototype.drawActorTp = function(actor, x, y, width) {
    width = width || 96;
    var color1 = this.tpGaugeColor1();
    var color2 = this.tpGaugeColor2();
    this.drawGauge(x, y, width, actor.tpRate(), color1, color2);
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.tpA, x, y, 44);
    this.changeTextColor(this.tpColor(actor));
    this.drawText(actor.tp, x + width - 64, y, 64, 'right');
};

PBWindowBase.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
    var lineHeight = this.lineHeight();
    var x2 = x + 180;
    var width2 = Math.min(200, width - 180 - this.textPadding());
    this.drawActorName(actor, x, y);
    this.drawActorLevel(actor, x, y + lineHeight * 1);
    this.drawActorIcons(actor, x, y + lineHeight * 2);
    this.drawActorClass(actor, x2, y);
    this.drawActorHp(actor, x2, y + lineHeight * 1, width2);
    this.drawActorMp(actor, x2, y + lineHeight * 2, width2);
};

PBWindowBase.prototype.drawItemName = function(item, x, y, width) {
    width = width || 312;
    if (item) {
        var iconBoxWidth = PBWindowBase._iconWidth + 4;
        this.resetTextColor();
        this.drawIcon(item.iconIndex, x + 2, y + 2);
        this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
    }
};

PBWindowBase.prototype.drawCurrencyValue = function(value, unit, x, y, width) {
    var unitWidth = Math.min(80, this.textWidth(unit));
    this.resetTextColor();
    this.drawText(value, x, y, width - unitWidth - 6, 'right');
    this.changeTextColor(this.systemColor());
    this.drawText(unit, x + width - unitWidth, y, unitWidth, 'right');
};

PBWindowBase.prototype.paramchangeTextColor = function(change) {
    if (change > 0) {
        return this.powerUpColor();
    } else if (change < 0) {
        return this.powerDownColor();
    } else {
        return this.normalColor();
    }
};

PBWindowBase.prototype.setBackgroundType = function(type) {
    if (type === 0) {
        this.opacity = 255;
    } else {
        this.opacity = 0;
    }
    if (type === 1) {
        this.showBackgroundDimmer();
    } else {
        this.hideBackgroundDimmer();
    }
};

PBWindowBase.prototype.showBackgroundDimmer = function() {
    if (!this._dimmerSprite) {
        this._dimmerSprite = new Sprite();
        this._dimmerSprite.bitmap = new Bitmap(0, 0);
        this.addChildToBack(this._dimmerSprite);
    }
    var bitmap = this._dimmerSprite.bitmap;
    if (bitmap.width !== this.width || bitmap.height !== this.height) {
        this.refreshDimmerBitmap();
    }
    this._dimmerSprite.visible = true;
    this.updateBackgroundDimmer();
};

PBWindowBase.prototype.hideBackgroundDimmer = function() {
    if (this._dimmerSprite) {
        this._dimmerSprite.visible = false;
    }
};

PBWindowBase.prototype.updateBackgroundDimmer = function() {
    if (this._dimmerSprite) {
        this._dimmerSprite.opacity = this.openness;
    }
};

PBWindowBase.prototype.refreshDimmerBitmap = function() {
    if (this._dimmerSprite) {
        var bitmap = this._dimmerSprite.bitmap;
        var w = this.width;
        var h = this.height;
        var m = this.padding;
        var c1 = this.dimColor1();
        var c2 = this.dimColor2();
        bitmap.resize(w, h);
        bitmap.gradientFillRect(0, 0, w, m, c2, c1, true);
        bitmap.fillRect(0, m, w, h - m * 2, c1);
        bitmap.gradientFillRect(0, h - m, w, m, c1, c2, true);
        this._dimmerSprite.setFrame(0, 0, w, h);
    }
};

PBWindowBase.prototype.dimColor1 = function() {
    return 'rgba(0, 0, 0, 0.6)';
};

PBWindowBase.prototype.dimColor2 = function() {
    return 'rgba(0, 0, 0, 0)';
};

PBWindowBase.prototype.canvasToLocalX = function(x) {
    var node = this;
    while (node) {
        x -= node.x;
        node = node.parent;
    }
    return x;
};

PBWindowBase.prototype.canvasToLocalY = function(y) {
    var node = this;
    while (node) {
        y -= node.y;
        node = node.parent;
    }
    return y;
};

PBWindowBase.prototype.reserveFaceImages = function() {
    $gameParty.members().forEach(function(actor) {
        ImageManager.reserveFace(actor.faceName());
    }, this);
};

//-----------------------------------------------------------------------------
// PBWindowSelectable
//
// The window class with cursor movement and scroll functions. A modified version of Window_Selectable.

function PBWindowSelectable() {
    this.initialize.apply(this, arguments);
}

PBWindowSelectable.prototype = Object.create(PBWindowBase.prototype);
PBWindowSelectable.prototype.constructor = PBWindowSelectable;

PBWindowSelectable.prototype.initialize = function(x, y, width, height) {
    PBWindowBase.prototype.initialize.call(this, x, y, width, height);
    this._index = -1;
    this._cursorFixed = false;
    this._cursorAll = false;
    this._stayCount = 0;
    this._helpWindow = null;
    this._handlers = {};
    this._touching = false;
    this._scrollX = 0;
    this._scrollY = 0;
    this._no_cursor_arrow=false;
    this.deactivate();
};

PBWindowSelectable.prototype.standardFontFace = function() {
    if ($gameSystem.isChinese() || $gameSystem.isKorean()) {
        return PBWindowBase.prototype.standardFontFace.call(this);
    } else {
        return 'GameFont';
    }
};

PBWindowSelectable.prototype.index = function() {
    return this._index;
};

PBWindowSelectable.prototype.standardBackOpacity = function() {
    return 255;
};

PBWindowSelectable.prototype.setUsesCursorArrow = function(setting) {
    this._no_cursor_arrow=!setting;
    this.refresh();
};

PBWindowSelectable.prototype.cursorFixed = function() {
    return this._cursorFixed;
};

PBWindowSelectable.prototype.setCursorFixed = function(cursorFixed) {
    this._cursorFixed = cursorFixed;
};

PBWindowSelectable.prototype.cursorAll = function() {
    return this._cursorAll;
};

PBWindowSelectable.prototype.setCursorAll = function(cursorAll) {
    this._cursorAll = cursorAll;
};

PBWindowSelectable.prototype.maxCols = function() {
    return 1;
};

PBWindowSelectable.prototype.maxItems = function() {
    return 0;
};

PBWindowSelectable.prototype.spacing = function() {
    return 12;
};

PBWindowSelectable.prototype.itemWidth = function() {
    return Math.floor((this.width - this.padding * 2 +
                       this.spacing()) / this.maxCols() - this.spacing());
};

PBWindowSelectable.prototype.itemHeight = function() {
    return this.lineHeight();
};

PBWindowSelectable.prototype.maxRows = function() {
    return Math.max(Math.ceil(this.maxItems() / this.maxCols()), 1);
};

PBWindowSelectable.prototype.activate = function() {
    PBWindowBase.prototype.activate.call(this);
    this.reselect();
};

PBWindowSelectable.prototype.deactivate = function() {
    PBWindowBase.prototype.deactivate.call(this);
    this.reselect();
};

PBWindowSelectable.prototype.select = function(index) {
    this._index = index;
    this._stayCount = 0;
    this.ensureCursorVisible();
    this.updateCursor();
    this.callUpdateHelp();
};

PBWindowSelectable.prototype.deselect = function() {
    this.select(-1);
};

PBWindowSelectable.prototype.reselect = function() {
    this.select(this._index);
};

PBWindowSelectable.prototype.row = function() {
    return Math.floor(this.index() / this.maxCols());
};

PBWindowSelectable.prototype.topRow = function() {
    return Math.floor(this._scrollY / this.itemHeight());
};

PBWindowSelectable.prototype.maxTopRow = function() {
    return Math.max(0, this.maxRows() - this.maxPageRows());
};

PBWindowSelectable.prototype.setTopRow = function(row) {
    var scrollY = row.clamp(0, this.maxTopRow()) * this.itemHeight();
    if (this._scrollY !== scrollY) {
        this._scrollY = scrollY;
        this.refresh();
        this.updateCursor();
    }
};

PBWindowSelectable.prototype.resetScroll = function() {
    this.setTopRow(0);
};

PBWindowSelectable.prototype.maxPageRows = function() {
    var pageHeight = this.height - this.padding * 2;
    return Math.floor(pageHeight / this.itemHeight());
};

PBWindowSelectable.prototype.maxPageItems = function() {
    return this.maxPageRows() * this.maxCols();
};

PBWindowSelectable.prototype.isHorizontal = function() {
    return this.maxPageRows() === 1;
};

PBWindowSelectable.prototype.bottomRow = function() {
    return Math.max(0, this.topRow() + this.maxPageRows() - 1);
};

PBWindowSelectable.prototype.setBottomRow = function(row) {
    this.setTopRow(row - (this.maxPageRows() - 1));
};

PBWindowSelectable.prototype.topIndex = function() {
    return this.topRow() * this.maxCols();
};
PBWindowSelectable.prototype.usesCursorArrow = function() {
    return (!(this.maxCols()>1) && !this._no_cursor_arrow);
};

PBWindowSelectable.prototype.cursorArrowContainerWidth=20;
PBWindowSelectable.prototype.itemRect = function(index) {
    var rect = new Rectangle();
    var maxCols = this.maxCols();
    rect.width = this.itemWidth();
    rect.height = this.itemHeight();
    if(this.usesCursorArrow()){
         rect.x = this.cursorArrowContainerWidth+(index % maxCols * (rect.width + this.spacing()) - this._scrollX);
    }else{
        rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
    }
    rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
    return rect;
}; 

PBWindowSelectable.prototype.itemRectForText = function(index) {
    var rect = this.itemRect(index);
    rect.x += this.textPadding();
    rect.width -= this.textPadding() * 2;
    return rect;
};

PBWindowSelectable.prototype.setHelpWindow = function(helpWindow) {
    this._helpWindow = helpWindow;
    this.callUpdateHelp();
};

PBWindowSelectable.prototype.showHelpWindow = function() {
    if (this._helpWindow) {
        this._helpWindow.show();
    }
};

PBWindowSelectable.prototype.hideHelpWindow = function() {
    if (this._helpWindow) {
        this._helpWindow.hide();
    }
};

PBWindowSelectable.prototype.setHandler = function(symbol, method) {
    this._handlers[symbol] = method;
};

PBWindowSelectable.prototype.isHandled = function(symbol) {
    return !!this._handlers[symbol];
};

PBWindowSelectable.prototype.callHandler = function(symbol) {
    if (this.isHandled(symbol)) {
        this._handlers[symbol]();
    }
};

PBWindowSelectable.prototype.isOpenAndActive = function() {
    return this.isOpen() && this.active;
};

PBWindowSelectable.prototype.isCursorMovable = function() {
    return (this.isOpenAndActive() && !this._cursorFixed &&
            !this._cursorAll && this.maxItems() > 0);
};

PBWindowSelectable.prototype.cursorDown = function(wrap) {
    var index = this.index();
    var maxItems = this.maxItems();
    var maxCols = this.maxCols();
    if (index < maxItems - maxCols || (wrap && maxCols === 1)) {
        this.select((index + maxCols) % maxItems);
    }
};

PBWindowSelectable.prototype.cursorUp = function(wrap) {
    var index = this.index();
    var maxItems = this.maxItems();
    var maxCols = this.maxCols();
    if (index >= maxCols || (wrap && maxCols === 1)) {
        this.select((index - maxCols + maxItems) % maxItems);
    }
};

PBWindowSelectable.prototype.cursorRight = function(wrap) {
    var index = this.index();
    var maxItems = this.maxItems();
    var maxCols = this.maxCols();
    if (maxCols >= 2 && (index < maxItems - 1 || (wrap && this.isHorizontal()))) {
        this.select((index + 1) % maxItems);
    }
};

PBWindowSelectable.prototype.cursorLeft = function(wrap) {
    var index = this.index();
    var maxItems = this.maxItems();
    var maxCols = this.maxCols();
    if (maxCols >= 2 && (index > 0 || (wrap && this.isHorizontal()))) {
        this.select((index - 1 + maxItems) % maxItems);
    }
};

PBWindowSelectable.prototype.cursorPagedown = function() {
    var index = this.index();
    var maxItems = this.maxItems();
    if (this.topRow() + this.maxPageRows() < this.maxRows()) {
        this.setTopRow(this.topRow() + this.maxPageRows());
        this.select(Math.min(index + this.maxPageItems(), maxItems - 1));
    }
};

PBWindowSelectable.prototype.cursorPageup = function() {
    var index = this.index();
    if (this.topRow() > 0) {
        this.setTopRow(this.topRow() - this.maxPageRows());
        this.select(Math.max(index - this.maxPageItems(), 0));
    }
};

PBWindowSelectable.prototype.scrollDown = function() {
    if (this.topRow() + 1 < this.maxRows()) {
        this.setTopRow(this.topRow() + 1);
    }
};

PBWindowSelectable.prototype.scrollUp = function() {
    if (this.topRow() > 0) {
        this.setTopRow(this.topRow() - 1);
    }
};

PBWindowSelectable.prototype.update = function() {
    PBWindowBase.prototype.update.call(this);
    this.updateArrows();
    this.processCursorMove();
    this.processHandling();
    this.processWheel();
    this.processTouch();
    this._stayCount++;
};

PBWindowSelectable.prototype.updateArrows = function() {
    var topRow = this.topRow();
    var maxTopRow = this.maxTopRow();
    this.downArrowVisible = maxTopRow > 0 && topRow < maxTopRow;
    this.upArrowVisible = topRow > 0;
};

PBWindowSelectable.prototype.processCursorMove = function() {
    if (this.isCursorMovable()) {
        var lastIndex = this.index();
        if (Input.isRepeated('down')) {
            this.cursorDown(Input.isTriggered('down'));
        }
        if (Input.isRepeated('up')) {
            this.cursorUp(Input.isTriggered('up'));
        }
        if (Input.isRepeated('right')) {
            this.cursorRight(Input.isTriggered('right'));
        }
        if (Input.isRepeated('left')) {
            this.cursorLeft(Input.isTriggered('left'));
        }
        if (!this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
            this.cursorPagedown();
        }
        if (!this.isHandled('pageup') && Input.isTriggered('pageup')) {
            this.cursorPageup();
        }
        if (this.index() !== lastIndex) {
            SoundManager.playCursor();
        }
    }
};

PBWindowSelectable.prototype.processHandling = function() {
    if (this.isOpenAndActive()) {
        if (this.isOkEnabled() && this.isOkTriggered()) {
            this.processOk();
        } else if (this.isCancelEnabled() && this.isCancelTriggered()) {
            this.processCancel();
        } else if (this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
            this.processPagedown();
        } else if (this.isHandled('pageup') && Input.isTriggered('pageup')) {
            this.processPageup();
        }
    }
};

PBWindowSelectable.prototype.processWheel = function() {
    if (this.isOpenAndActive()) {
        var threshold = 20;
        if (TouchInput.wheelY >= threshold) {
            this.scrollDown();
        }
        if (TouchInput.wheelY <= -threshold) {
            this.scrollUp();
        }
    }
};

PBWindowSelectable.prototype.processTouch = function() {
    if (this.isOpenAndActive()) {
        if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
            this._touching = true;
            this.onTouch(true);
        } else if (TouchInput.isCancelled()) {
            if (this.isCancelEnabled()) {
                this.processCancel();
            }
        }
        if (this._touching) {
            if (TouchInput.isPressed()) {
                this.onTouch(false);
            } else {
                this._touching = false;
            }
        }
    } else {
        this._touching = false;
    }
};

PBWindowSelectable.prototype.isTouchedInsideFrame = function() {
    var x = this.canvasToLocalX(TouchInput.x);
    var y = this.canvasToLocalY(TouchInput.y);
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
};

PBWindowSelectable.prototype.onTouch = function(triggered) {
    var lastIndex = this.index();
    var x = this.canvasToLocalX(TouchInput.x);
    var y = this.canvasToLocalY(TouchInput.y);
    var hitIndex = this.hitTest(x, y);
    if (hitIndex >= 0) {
        if (hitIndex === this.index()) {
            if (triggered && this.isTouchOkEnabled()) {
                this.processOk();
            }
        } else if (this.isCursorMovable()) {
            this.select(hitIndex);
        }
    } else if (this._stayCount >= 10) {
        if (y < this.padding) {
            this.cursorUp();
        } else if (y >= this.height - this.padding) {
            this.cursorDown();
        }
    }
    if (this.index() !== lastIndex) {
        SoundManager.playCursor();
    }
};

PBWindowSelectable.prototype.hitTest = function(x, y) {
    if (this.isContentsArea(x, y)) {
        var cx = x - this.padding;
        var cy = y - this.padding;
        var topIndex = this.topIndex();
        for (var i = 0; i < this.maxPageItems(); i++) {
            var index = topIndex + i;
            if (index < this.maxItems()) {
                var rect = this.itemRect(index);
                var right = rect.x + rect.width;
                var bottom = rect.y + rect.height;
                if (cx >= rect.x && cy >= rect.y && cx < right && cy < bottom) {
                    return index;
                }
            }
        }
    }
    return -1;
};

PBWindowSelectable.prototype.isContentsArea = function(x, y) {
    var left = this.padding;
    var top = this.padding;
    var right = this.width - this.padding;
    var bottom = this.height - this.padding;
    return (x >= left && y >= top && x < right && y < bottom);
};

PBWindowSelectable.prototype.isTouchOkEnabled = function() {
    return this.isOkEnabled();
};

PBWindowSelectable.prototype.isOkEnabled = function() {
    return this.isHandled('ok');
};

PBWindowSelectable.prototype.isCancelEnabled = function() {
    return this.isHandled('cancel');
};

PBWindowSelectable.prototype.isOkTriggered = function() {
    return Input.isRepeated('ok');
};

PBWindowSelectable.prototype.isCancelTriggered = function() {
    return Input.isRepeated('cancel');
};

PBWindowSelectable.prototype.processOk = function() {
    if (this.isCurrentItemEnabled()) {
        this.playOkSound();
        this.updateInputData();
        this.deactivate();
        this.callOkHandler();
    } else {
        this.playBuzzerSound();
    }
};

PBWindowSelectable.prototype.playOkSound = function() {
    SoundManager.playOk();
};

PBWindowSelectable.prototype.playBuzzerSound = function() {
    SoundManager.playBuzzer();
};

PBWindowSelectable.prototype.callOkHandler = function() {
    this.callHandler('ok');
};

PBWindowSelectable.prototype.processCancel = function() {
    SoundManager.playCancel();
    this.updateInputData();
    this.deactivate();
    this.callCancelHandler();
};

PBWindowSelectable.prototype.callCancelHandler = function() {
    this.callHandler('cancel');
};

PBWindowSelectable.prototype.processPageup = function() {
    SoundManager.playCursor();
    this.updateInputData();
    this.deactivate();
    this.callHandler('pageup');
};

PBWindowSelectable.prototype.processPagedown = function() {
    SoundManager.playCursor();
    this.updateInputData();
    this.deactivate();
    this.callHandler('pagedown');
};

PBWindowSelectable.prototype.updateInputData = function() {
    Input.update();
    TouchInput.update();
};

PBWindowSelectable.prototype.updateCursor = function() {
    if (this._cursorAll) {
        var allRowsHeight = this.maxRows() * this.itemHeight();
        this.setCursorRect(0, 0, this.contents.width, allRowsHeight);
        this.setTopRow(0);
    } else if (this.isCursorVisible()) {
        var rect = this.itemRect(this.index());
        this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
    } else {
        this.setCursorRect(0, 0, 0, 0);
    }
};

PBWindowSelectable.prototype.isCursorVisible = function() {
    var row = this.row();
    return row >= this.topRow() && row <= this.bottomRow();
};

PBWindowSelectable.prototype.ensureCursorVisible = function() {
    var row = this.row();
    if (row < this.topRow()) {
        this.setTopRow(row);
    } else if (row > this.bottomRow()) {
        this.setBottomRow(row);
    }
};

PBWindowSelectable.prototype.callUpdateHelp = function() {
    if (this.active && this._helpWindow) {
        this.updateHelp();
    }
};

PBWindowSelectable.prototype.updateHelp = function() {
    this._helpWindow.clear();
};

PBWindowSelectable.prototype.setHelpWindowItem = function(item) {
    if (this._helpWindow) {
        this._helpWindow.setItem(item);
    }
};

PBWindowSelectable.prototype.isCurrentItemEnabled = function() {
    return true;
};

PBWindowSelectable.prototype.drawAllItems = function() {
    var topIndex = this.topIndex();
    for (var i = 0; i < this.maxPageItems(); i++) {
        var index = topIndex + i;
        if (index < this.maxItems()) {
            this.drawItem(index);
        }
    }
};

PBWindowSelectable.prototype.drawItem = function(index) {
};

PBWindowSelectable.prototype.clearItem = function(index) {
    var rect = this.itemRect(index);
    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
};

PBWindowSelectable.prototype.redrawItem = function(index) {
    if (index >= 0) {
        this.clearItem(index);
        this.drawItem(index);
    }
};

PBWindowSelectable.prototype.redrawCurrentItem = function() {
    this.redrawItem(this.index());
};

PBWindowSelectable.prototype.refresh = function() {
    if (this.contents) {
        this.contents.clear();
        this.drawAllItems();
    }
};

//-----------------------------------------------------------------------------
// PBWindowCommand
//
// The superclass of windows for selecting a command. Modified version of Window_Command.

function PBWindowCommand() {
    this.initialize.apply(this, arguments);
}

PBWindowCommand.prototype = Object.create(PBWindowSelectable.prototype);
PBWindowCommand.prototype.constructor = PBWindowCommand;

PBWindowCommand.prototype.initialize = function(x, y) {
    this.clearCommandList();
    this.makeCommandList();
    var width = this.windowWidth();
    var height = this.windowHeight();
    PBWindowSelectable.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
    this.select(0);
    this.activate();
};

PBWindowCommand.prototype.windowWidth = function() {
    return 240;
};

PBWindowCommand.prototype.windowHeight = function() {
    return this.fittingHeight(this.numVisibleRows());
};

PBWindowCommand.prototype.numVisibleRows = function() {
    return Math.ceil(this.maxItems() / this.maxCols());
};

PBWindowCommand.prototype.maxItems = function() {
    return this._list.length;
};

PBWindowCommand.prototype.clearCommandList = function() {
    this._list = [];
};

PBWindowCommand.prototype.makeCommandList = function() {
};

PBWindowCommand.prototype.addCommand = function(name, symbol, enabled, ext) {
    if (enabled === undefined) {
        enabled = true;
    }
    if (ext === undefined) {
        ext = null;
    }
    this._list.push({ name: name, symbol: symbol, enabled: enabled, ext: ext});
};

PBWindowCommand.prototype.commandName = function(index) {
    return this._list[index].name;
};

PBWindowCommand.prototype.commandSymbol = function(index) {
    return this._list[index].symbol;
};

PBWindowCommand.prototype.isCommandEnabled = function(index) {
    return this._list[index].enabled;
};

PBWindowCommand.prototype.currentData = function() {
    return this.index() >= 0 ? this._list[this.index()] : null;
};

PBWindowCommand.prototype.isCurrentItemEnabled = function() {
    return this.currentData() ? this.currentData().enabled : false;
};

PBWindowCommand.prototype.currentSymbol = function() {
    return this.currentData() ? this.currentData().symbol : null;
};

PBWindowCommand.prototype.currentExt = function() {
    return this.currentData() ? this.currentData().ext : null;
};

PBWindowCommand.prototype.findSymbol = function(symbol) {
    for (var i = 0; i < this._list.length; i++) {
        if (this._list[i].symbol === symbol) {
            return i;
        }
    }
    return -1;
};

PBWindowCommand.prototype.selectSymbol = function(symbol) {
    var index = this.findSymbol(symbol);
    if (index >= 0) {
        this.select(index);
    } else {
        this.select(0);
    }
};

PBWindowCommand.prototype.findExt = function(ext) {
    for (var i = 0; i < this._list.length; i++) {
        if (this._list[i].ext === ext) {
            return i;
        }
    }
    return -1;
};

PBWindowCommand.prototype.selectExt = function(ext) {
    var index = this.findExt(ext);
    if (index >= 0) {
        this.select(index);
    } else {
        this.select(0);
    }
};

PBWindowCommand.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    var align = this.itemTextAlign();
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};

PBWindowCommand.prototype.itemTextAlign = function() {
    return 'left';
};

PBWindowCommand.prototype.isOkEnabled = function() {
    return true;
};

PBWindowCommand.prototype.callOkHandler = function() {
    var symbol = this.currentSymbol();
    if (this.isHandled(symbol)) {
        this.callHandler(symbol);
    } else if (this.isHandled('ok')) {
        PBWindowSelectable.prototype.callOkHandler.call(this);
    } else {
        this.activate();
    }
};

PBWindowCommand.prototype.refresh = function() {
    this.clearCommandList();
    this.makeCommandList();
    this.createContents();
    PBWindowSelectable.prototype.refresh.call(this);
};

//-----------------------------------------------------------------------------
// PBWindowCommandHorizontal
//
// The command window for the horizontal selection format. Modified version of Window_HorzCommand.

function PBWindowCommandHorizontal() {
    this.initialize.apply(this, arguments);
}

PBWindowCommandHorizontal.prototype = Object.create(PBWindowCommand.prototype);
PBWindowCommandHorizontal.prototype.constructor = PBWindowCommandHorizontal;

PBWindowCommandHorizontal.prototype.initialize = function(x, y) {
    PBWindowCommand.prototype.initialize.call(this, x, y);
};

PBWindowCommandHorizontal.prototype.numVisibleRows = function() {
    return 1;
};

PBWindowCommandHorizontal.prototype.maxCols = function() {
    return 4;
};

PBWindowCommandHorizontal.prototype.itemTextAlign = function() {
    return 'center';
};


//-----------------------------------------------------------------------------
// PBWindowChoiceList
//
// The window used for the event command [Show Choices]. Modified version of Window_ChoiceList.

function PBWindowChoiceList() {
    this.initialize.apply(this, arguments);
}

PBWindowChoiceList.prototype = Object.create(PBWindowCommand.prototype);
PBWindowChoiceList.prototype.constructor = PBWindowChoiceList;

PBWindowChoiceList.prototype.initialize = function(messageWindow) {
    this._messageWindow = messageWindow;
    PBWindowCommand.prototype.initialize.call(this, 0, 0);
    this.openness = 0;
    this.deactivate();
    this._background = 0;
};

PBWindowChoiceList.prototype.start = function() {
    this.updatePlacement();
    this.updateBackground();
    this.refresh();
    this.selectDefault();
    this.open();
    this.activate();
};

PBWindowChoiceList.prototype.selectDefault = function() {
    this.select($gameMessage.choiceDefaultType());
};

PBWindowChoiceList.prototype.updatePlacement = function() {
    var positionType = $gameMessage.choicePositionType();
    var messageY = this._messageWindow.y;
    this.width = this.windowWidth();
    this.height = this.windowHeight();
    switch (positionType) {
    case 0:
        this.x = 0;
        break;
    case 1:
        this.x = (Graphics.boxWidth - this.width) / 2;
        break;
    case 2:
        this.x = Graphics.boxWidth - this.width;
        break;
    }
    if (messageY >= Graphics.boxHeight / 2) {
        this.y = messageY - this.height;
    } else {
        this.y = messageY + this._messageWindow.height;
    }
};

PBWindowChoiceList.prototype.updateBackground = function() {
    this._background = $gameMessage.choiceBackground();
    this.setBackgroundType(this._background);
};

PBWindowChoiceList.prototype.windowWidth = function() {
    var width = this.maxChoiceWidth() + this.padding * 2;
    return Math.min(width, Graphics.boxWidth);
};

PBWindowChoiceList.prototype.numVisibleRows = function() {
    var messageY = this._messageWindow.y;
    var messageHeight = this._messageWindow.height;
    var centerY = Graphics.boxHeight / 2;
    var choices = $gameMessage.choices();
    var numLines = choices.length;
    var maxLines = 8;
    if (messageY < centerY && messageY + messageHeight > centerY) {
        maxLines = 4;
    }
    if (numLines > maxLines) {
        numLines = maxLines;
    }
    return numLines;
};

PBWindowChoiceList.prototype.maxChoiceWidth = function() {
    var maxWidth = 96;
    var choices = $gameMessage.choices();
    for (var i = 0; i < choices.length; i++) {
        var choiceWidth = this.textWidthEx(choices[i]) + this.textPadding() * 2;
        if (maxWidth < choiceWidth) {
            maxWidth = choiceWidth;
        }
    }
    return maxWidth;
};

PBWindowChoiceList.prototype.textWidthEx = function(text) {
    return this.drawTextEx(text, 0, this.contents.height);
};

PBWindowChoiceList.prototype.contentsHeight = function() {
    return this.maxItems() * this.itemHeight();
};

PBWindowChoiceList.prototype.makeCommandList = function() {
    var choices = $gameMessage.choices();
    for (var i = 0; i < choices.length; i++) {
        this.addCommand(choices[i], 'choice');
    }
};

PBWindowChoiceList.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    this.drawTextEx(this.commandName(index), rect.x, rect.y);
};

PBWindowChoiceList.prototype.isCancelEnabled = function() {
    return $gameMessage.choiceCancelType() !== -1;
};

PBWindowChoiceList.prototype.isOkTriggered = function() {
    return Input.isTriggered('ok');
};

PBWindowChoiceList.prototype.callOkHandler = function() {
    $gameMessage.onChoice(this.index());
    this._messageWindow.terminateMessage();
    this.close();
};

PBWindowChoiceList.prototype.callCancelHandler = function() {
    $gameMessage.onChoice($gameMessage.choiceCancelType());
    this._messageWindow.terminateMessage();
    this.close();
};

//-----------------------------------------------------------------------------
// PBWindowMessage
//
// The window for displaying text messages. Overrides Window_Message.

function PBWindowMessage() {
    this.initialize.apply(this, arguments);
}

PBWindowMessage.prototype = Object.create(PBWindowBase.prototype);
PBWindowMessage.prototype.constructor = PBWindowMessage;

PBWindowMessage.prototype.initialize = function() {
    var width = this.windowWidth();
    var height = this.windowHeight();
    var x = (Graphics.boxWidth - width) / 2;
    PBWindowBase.prototype.initialize.call(this, x, 0, width, height);
    this.openness = 0;
    this.initMembers();
    this.createSubWindows();
    this.updatePlacement();
};

PBWindowMessage.prototype.initMembers = function() {
    this._imageReservationId = Utils.generateRuntimeId();
    this._background = 0;
    this._positionType = 2;
    this._waitCount = 0;
    this._faceBitmap = null;
    this._textState = null;
    this.clearFlags();
};

PBWindowMessage.prototype.subWindows = function() {
    return [this._goldWindow, this._choiceWindow,
            this._numberWindow, this._itemWindow];
};

PBWindowMessage.prototype.createSubWindows = function() {
    this._goldWindow = new Window_Gold(0, 0);
    this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
    this._goldWindow.openness = 0;
    this._choiceWindow = new PBWindowChoiceList(this);
    this._numberWindow = new Window_NumberInput(this);
    this._itemWindow = new Window_EventItem(this);
};

PBWindowMessage.prototype.windowWidth = function() {
    return Graphics.boxWidth;
};

PBWindowMessage.prototype.windowHeight = function() {
    return this.fittingHeight(this.numVisibleRows());
};

PBWindowMessage.prototype.clearFlags = function() {
    this._showFast = false;
    this._lineShowFast = false;
    this._pauseSkip = false;
};

PBWindowMessage.prototype.numVisibleRows = function() {
    return 4;
};

PBWindowMessage.prototype.update = function() {
    this.checkToNotClose();
    PBWindowBase.prototype.update.call(this);
    while (!this.isOpening() && !this.isClosing()) {
        if (this.updateWait()) {
            return;
        } else if (this.updateLoading()) {
            return;
        } else if (this.updateInput()) {
            return;
        } else if (this.updateMessage()) {
            return;
        } else if (this.canStart()) {
            this.startMessage();
        } else {
            this.startInput();
            return;
        }
    }
};

PBWindowMessage.prototype.checkToNotClose = function() {
    if (this.isClosing() && this.isOpen()) {
        if (this.doesContinue()) {
            this.open();
        }
    }
};

PBWindowMessage.prototype.canStart = function() {
    return $gameMessage.hasText() && !$gameMessage.scrollMode();
};

PBWindowMessage.prototype.startMessage = function() {
    this._textState = {};
    this._textState.index = 0;
    this._textState.text = this.convertEscapeCharacters($gameMessage.allText());
    this.newPage(this._textState);
    this.updatePlacement();
    this.updateBackground();
    this.open();
};
PBWindowMessage.prototype._refreshPauseSign = function() {
   var sx = 144;
   var sy = 96;
   var p = 24;
   this._windowPauseSignSprite.bitmap = this._windowskin;
   this._windowPauseSignSprite.anchor.x = 0.5;
   this._windowPauseSignSprite.anchor.y = 1;
   this._windowPauseSignSprite.move(this._width -50, this._height-20);
   this._windowPauseSignSprite.setFrame(sx, sy, p, p);
   this._windowPauseSignSprite.alpha = 0;
};

PBWindowMessage.prototype.updatePlacement = function() {

    
    this._positionType = $gameMessage.positionType();
    this.y = this._positionType * (Graphics.boxHeight - this.height) / 2;
    this._goldWindow.y = this.y > 0 ? 0 : Graphics.boxHeight - this._goldWindow.height;
};

PBWindowMessage.prototype.updateBackground = function() {
    this._background = $gameMessage.background();
    this.setBackgroundType(this._background);
};

PBWindowMessage.prototype.terminateMessage = function() {
    this.close();
    this._goldWindow.close();
    $gameMessage.clear();
};

PBWindowMessage.prototype.updateWait = function() {
    if (this._waitCount > 0) {
        this._waitCount--;
        return true;
    } else {
        return false;
    }
};

PBWindowMessage.prototype.updateLoading = function() {
    if (this._faceBitmap) {
        if (this._faceBitmap.isReady()) {
            this.drawMessageFace();
            this._faceBitmap = null;
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
};

PBWindowMessage.prototype.updateInput = function() {
    if (this.isAnySubWindowActive()) {
        return true;
    }
    if (this.pause) {
        if (this.isTriggered()) {
            Input.update();
            this.pause = false;
            if (!this._textState) {
                this.terminateMessage();
            }
        }
        return true;
    }
    return false;
};

PBWindowMessage.prototype.isAnySubWindowActive = function() {
    return (this._choiceWindow.active ||
            this._numberWindow.active ||
            this._itemWindow.active);
};

PBWindowMessage.prototype.updateMessage = function() {
    if (this._textState) {
        while (!this.isEndOfText(this._textState)) {
            if (this.needsNewPage(this._textState)) {
                this.newPage(this._textState);
            }
            this.updateShowFast();
            this.processCharacter(this._textState);
            if (!this._showFast && !this._lineShowFast) {
                break;
            }
            if (this.pause || this._waitCount > 0) {
                break;
            }
        }
        if (this.isEndOfText(this._textState)) {
            this.onEndOfText();
        }
        return true;
    } else {
        return false;
    }
};

PBWindowMessage.prototype.onEndOfText = function() {
    if (!this.startInput()) {
        if (!this._pauseSkip) {
            this.startPause();
        } else {
            this.terminateMessage();
        }
    }
    this._textState = null;
};

PBWindowMessage.prototype.startInput = function() {
    if ($gameMessage.isChoice()) {
        this._choiceWindow.start();
        return true;
    } else if ($gameMessage.isNumberInput()) {
        this._numberWindow.start();
        return true;
    } else if ($gameMessage.isItemChoice()) {
        this._itemWindow.start();
        return true;
    } else {
        return false;
    }
};

PBWindowMessage.prototype.isTriggered = function() {
    return (Input.isRepeated('ok') || Input.isRepeated('cancel') ||
            TouchInput.isRepeated());
};

PBWindowMessage.prototype.doesContinue = function() {
    return ($gameMessage.hasText() && !$gameMessage.scrollMode() &&
            !this.areSettingsChanged());
};

PBWindowMessage.prototype.areSettingsChanged = function() {
    return (this._background !== $gameMessage.background() ||
            this._positionType !== $gameMessage.positionType());
};

PBWindowMessage.prototype.updateShowFast = function() {
    if (this.isTriggered()) {
        this._showFast = true;
    }
};

PBWindowMessage.prototype.newPage = function(textState) {
    this.contents.clear();
    this.resetFontSettings();
    this.clearFlags();
    this.loadMessageFace();
    textState.x = this.newLineX();
    textState.y = 0;
    textState.left = this.newLineX();
    textState.height = this.calcTextHeight(textState, false);
};

PBWindowMessage.prototype.loadMessageFace = function() {
    this._faceBitmap = ImageManager.reserveFace($gameMessage.faceName(), 0, this._imageReservationId);
};

PBWindowMessage.prototype.drawMessageFace = function() {
    this.drawFace($gameMessage.faceName(), $gameMessage.faceIndex(), 0, 0);
    ImageManager.releaseReservation(this._imageReservationId);
};

PBWindowMessage.prototype.newLineX = function() {
    return $gameMessage.faceName() === '' ? 0 : 168;
};

PBWindowMessage.prototype.processNewLine = function(textState) {
    this._lineShowFast = false;
    PBWindowBase.prototype.processNewLine.call(this, textState);
    if (this.needsNewPage(textState)) {
        this.startPause();
    }
};

PBWindowMessage.prototype.processNewPage = function(textState) {
    PBWindowBase.prototype.processNewPage.call(this, textState);
    if (textState.text[textState.index] === '\n') {
        textState.index++;
    }
    textState.y = this.contents.height;
    this.startPause();
};

PBWindowMessage.prototype.isEndOfText = function(textState) {
    return textState.index >= textState.text.length;
};

PBWindowMessage.prototype.needsNewPage = function(textState) {
    return (!this.isEndOfText(textState) &&
            textState.y + textState.height > this.contents.height);
};

PBWindowMessage.prototype.processEscapeCharacter = function(code, textState) {
    switch (code) {
    case '$':
        this._goldWindow.open();
        break;
    case '.':
        this.startWait(15);
        break;
    case '|':
        this.startWait(60);
        break;
    case '!':
        this.startPause();
        break;
    case '>':
        this._lineShowFast = true;
        break;
    case '<':
        this._lineShowFast = false;
        break;
    case '^':
        this._pauseSkip = true;
        break;
    default:
        PBWindowBase.prototype.processEscapeCharacter.call(this, code, textState);
        break;
    }
};

PBWindowMessage.prototype.startWait = function(count) {
    this._waitCount = count;
};

PBWindowMessage.prototype.startPause = function() {
    this.startWait(10);
    this.pause = true;
};

