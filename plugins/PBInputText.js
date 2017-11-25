ImageManager.loadTextInput = function(filename, hue) {
    return this.loadBitmap('img/PBTextInput/', filename, hue, true);
};
//-----------------------------------------------------------------------------
// PBSceneTextInputActor
//
// The scene class of the name input screen.

function PBSceneTextInputActor() {
    this.initialize.apply(this, arguments);
}

PBSceneTextInputActor.prototype = Object.create(Scene_MenuBase.prototype);
PBSceneTextInputActor.prototype.constructor = PBSceneTextInputActor;

PBSceneTextInputActor.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

PBSceneTextInputActor.prototype.prepare = function(defaultText, maxLength, charImage, variableToStore, localVariableToStore) {
    this._actorId = defaultText;
    this._maxLength = maxLength;
    this._charImage = charImage;
    this._variableToStore=variableToStore;
    this._localVariableToStore=localVariableToStore;
};

PBSceneTextInputActor.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this._actor = $gameActors.actor(this._actorId);
    this.createEditWindow();
    this.createInputWindow();
};

PBSceneTextInputActor.prototype.createBackground = function() {
    this._backSprite = new Sprite();
    this._backSprite.bitmap = ImageManager.loadTextInput('bg');
    this._backSprite.width=Graphics.width;
    this._backSprite.height=Graphics.height;
    this.addChild(this._backSprite);
}

PBSceneTextInputActor.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._editWindow.refresh();
};

PBSceneTextInputActor.prototype.createEditWindow = function() {
    this._editWindow = new PBWindowTextInputActor(this._actor, this._maxLength);
    this.addWindow(this._editWindow);
};

PBSceneTextInputActor.prototype.createInputWindow = function() {
    this._inputWindow = new PBWindowTextInputPadActor(this._editWindow);
    this._inputWindow.setHandler('ok', this.onInputOk.bind(this));
    this.addWindow(this._inputWindow);
};

PBSceneTextInputActor.prototype.onInputOk = function() {
    this._actor.setName(this._editWindow.name());
    this.popScene();
};

//-----------------------------------------------------------------------------
// PBSceneTextInput
//
// The scene class of the name input screen.

function PBSceneTextInput() {
    this.initialize.apply(this, arguments);
}

PBSceneTextInput.prototype = Object.create(Scene_MenuBase.prototype);
PBSceneTextInput.prototype.constructor = PBSceneTextInput;

PBSceneTextInput.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

PBSceneTextInput.prototype.prepare = function(maxLength, defaultValue, labelText, characterImage, globalVariable) {
    this._maxLength=maxLength || 8;
    this._defaultValue=defaultValue || "";
    this._labelText=labelText || "Insert a text";
    this._characterImage=characterImage || null;
    this._globalVariable=globalVariable || null;
    lastInputText="";
};

PBSceneTextInput.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this._actor = $gameActors.actor(this._actorId);
    this.createEditWindow();
    this.createInputWindow();
};

PBSceneTextInput.prototype.createBackground = function() {
    this._backSprite = new Sprite();
    this._backSprite.bitmap = ImageManager.loadTextInput('bg');
    this._backSprite.width=Graphics.width;
    this._backSprite.height=Graphics.height;
    this.addChild(this._backSprite);
}

PBSceneTextInput.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._editWindow.refresh();
};

PBSceneTextInput.prototype.createEditWindow = function() {
    this._editWindow = new PBWindowTextInput(this._maxLength, this._defaultValue, this._labelText, this._characterImage, this._globalVariable);
    this.addWindow(this._editWindow);
};

PBSceneTextInput.prototype.createInputWindow = function() {
    this._inputWindow = new PBWindowTextInputPad(this._editWindow);
    this._inputWindow.setHandler('ok', this.onInputOk.bind(this));
    this.addWindow(this._inputWindow);
};

PBSceneTextInput.prototype.onInputOk = function() {
    lastInputText=this._editWindow.value();
    
    this.popScene();
};

//-----------------------------------------------------------------------------
// PBWindowTextInputActor
//
// The window for editing an actor's name on the name input screen.

function PBWindowTextInputActor() {
    this.initialize.apply(this, arguments);
}

PBWindowTextInputActor.prototype = Object.create(PBWindowBase.prototype);
PBWindowTextInputActor.prototype.constructor = PBWindowTextInputActor;

PBWindowTextInputActor.prototype.initialize = function(actor, maxLength) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    var x = (Graphics.boxWidth - width) / 2;
    var y = 0;
    PBWindowBase.prototype.initialize.call(this, x, y, width, height);
    this._actor = actor;
    this._name = actor.name().slice(0, this._maxLength);
    this._index = this._name.length;
    this._maxLength = maxLength;
    this._defaultName = this._name;
    this._labelText="Your name?";
    
    this.deactivate();
    this.refresh();
    this.setBackgroundType(3);
    this._animIndex=0;
    this._animCount=0;
    this._animStep=0;
    this.makeFontBigger();
    
    ImageManager.reserveFace(actor.faceName());
};

PBWindowTextInputActor.prototype.windowWidth = function() {
    return Graphics.width-(Graphics.width*0.05);
};

PBWindowTextInputActor.prototype.windowHeight = function() {
    return (Graphics.height*0.25);
};

PBWindowTextInputActor.prototype.name = function() {
    return this._name;
};

PBWindowTextInputActor.prototype.drawShadow = function() {
    
    this._shadowSprite = ImageManager.loadTextInput('icon_shadow');
    var pw = this._shadowSprite.width;
    var ph = this._shadowSprite.height;
    var n = 0;
    this.contents.blt(this._shadowSprite, 0, 0, pw, ph, 100-pw/2, 90, pw, ph);
    //this.children[0].addChild(this._shadowSprite);
   // this.children=move(this.children, this.children.length, 0);
    
};

PBWindowTextInputActor.prototype.drawAnimatedCharacter = function() {
    var bitmap = ImageManager.loadCharacter($gamePlayer._characterName);
    var big = ImageManager.isBigCharacter($gamePlayer._characterName);
    var pw = bitmap.width / (big ? 3 : 12);
    var ph = bitmap.height / (big ? 4 : 8);
    var n = 0;
    var sx = (n % 4 * 3 + 0) * pw;
    if(this._animCount>30){
        this._animCount=0;
        if(this._animIndex==3){
            this._animIndex=0;
        }else{
            this._animIndex+=1;
        }
    }else{
        this._animCount+=1;
    }
    if( this._animIndex==1){
        sx = (n % 4 * 3 + 1) * pw
    }else if( this._animIndex==2){
        sx = (n % 4 * 3 + 2) * pw
    }else if( this._animIndex==3){
        sx = (n % 4 * 3 + 1) * pw
    }
    var sy = (Math.floor(n / 4) * 4) * ph;
    this.contents.blt(bitmap, sx, sy, pw, ph, 100 - pw / 2, 100 - ph);
}

function move(arr, old_index, new_index) {
    while (old_index < 0) {
        old_index += arr.length;
    }
    while (new_index < 0) {
        new_index += arr.length;
    }
    if (new_index >= arr.length) {
        var k = new_index - arr.length;
        while ((k--) + 1) {
            arr.push(undefined);
        }
    }
     arr.splice(new_index, 0, arr.splice(old_index, 0)[0]);  
   return arr;
}

PBWindowTextInputActor.prototype.restoreDefault = function() {
    this._name = this._defaultName;
    this._index = this._name.length;
    this.refresh();
    return this._name.length > 0;
};

PBWindowTextInputActor.prototype.add = function(ch) {
    if (this._index < this._maxLength) {
        this._name += ch;
        this._index++;
        this.refresh();
        return true;
    } else {
        return false;
    }
};

PBWindowTextInputActor.prototype.back = function() {
    if (this._index > 0) {
        this._index--;
        this._name = this._name.slice(0, this._index);
        this.refresh();
        return true;
    } else {
        return false;
    }
};

PBWindowTextInputActor.prototype.faceWidth = function() {
    return 144;
};

PBWindowTextInputActor.prototype.charWidth = function() {
    var text = $gameSystem.isJapanese() ? '\uff21' : 'A';
    return this.textWidth(text);
};

PBWindowTextInputActor.prototype.left = function() {
    var nameCenter = (164);
    var nameWidth = (this._maxLength + 1) * this.charWidth();
    return nameCenter;
};

PBWindowTextInputActor.prototype.itemRect = function(index) {
    return {
        x: this.left() + index * this.charWidth(),
        y: this.height-this.lineHeight()*2,
        width: this.charWidth(),
        height: this.lineHeight()
    };
};

PBWindowTextInputActor.prototype.underlineRect = function(index) {
    var rect = this.itemRect(index);
    rect.x++;
    if(this._name.length==index){
       rect.y += rect.height - 6;
    }else{
      rect.y += rect.height - 8;
    }
    rect.width -= 2;
    rect.height = 6;
    return rect;
};

PBWindowTextInputActor.prototype.underlineColor = function() {
    return this.normalColor();
};

PBWindowTextInputActor.prototype.drawUnderline = function(index) {
    var rect = this.underlineRect(index);
    var color = this.underlineColor();
    this.contents.paintOpacity = 255;
    this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
    this.contents.paintOpacity = 255;
};

PBWindowTextInputActor.prototype.drawChar = function(index) {
    var rect = this.itemRect(index);
    this.resetTextColor();
    rect.y -= rect.height/2;
    this.drawText(this._name[index] || '', rect.x, rect.y);
};
PBWindowTextInputActor.prototype.refresh = function() {
    this.contents.clear();
    this.drawShadow();
    this.drawAnimatedCharacter(); 
    this.drawText("Your name?" || '', this.left(), 0);

    for (var i = 0; i < this._maxLength; i++) {
        this.drawUnderline(i);
    }
    for (var j = 0; j < this._name.length; j++) {
        this.drawChar(j);
    }
    var rect = this.itemRect(this._index);
    //this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
};

PBWindowTextInputActor.prototype.update = function() {
    PBWindowBase.prototype.update.call(this);
    this.refresh();
    
};

//-----------------------------------------------------------------------------
// PBWindowTextInput
//
// The window for editing an actor's name on the name input screen.

function PBWindowTextInput() {
    this.initialize.apply(this, arguments);
}

PBWindowTextInput.prototype = Object.create(PBWindowBase.prototype);
PBWindowTextInput.prototype.constructor = PBWindowTextInput;

PBWindowTextInput.prototype.initialize = function(maxLength,defaultValue,labelText,characterImage,globalVariable) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    var x = (Graphics.boxWidth - width) / 2;
    var y = 0;
    PBWindowBase.prototype.initialize.call(this, x, y, width, height);

    this._maxLength=maxLength || 8;
    this._defaultValue=defaultValue || "";
    this._labelText=labelText || "Insert a text";
    this._characterImage=characterImage || null;
    this._globalVariable=globalVariable || null;
    
    this._currentValue=this._defaultValue;

    this._index = this._currentValue.length;

    this.deactivate();
    this.refresh();
    this.setBackgroundType(3);
    this._animIndex=0;
    this._animCount=0;
    this._animStep=0;
    this.makeFontBigger();
};

PBWindowTextInput.prototype.windowWidth = function() {
    return Graphics.width-(Graphics.width*0.05);
};

PBWindowTextInput.prototype.windowHeight = function() {
    return (Graphics.height*0.25);
};

PBWindowTextInput.prototype.value = function() {
    return this._currentValue;
};

PBWindowTextInput.prototype.drawShadow = function() {
    if(this._characterImage){
        this._shadowSprite = ImageManager.loadTextInput('icon_shadow');
        var pw = this._shadowSprite.width;
        var ph = this._shadowSprite.height;
        var n = 0;
        this.contents.blt(this._shadowSprite, 0, 0, pw, ph, 100-pw/2, 90, pw, ph);
    }    
};

PBWindowTextInput.prototype.drawAnimatedCharacter = function() {
    if(this._characterImage){
        var bitmap = ImageManager.loadCharacter(this._characterImage);
        var big = ImageManager.isBigCharacter(this._characterImage);
        var pw = bitmap.width / (big ? 3 : 12);
        var ph = bitmap.height / (big ? 4 : 8);
        var n = 0;
        var sx = (n % 4 * 3 + 0) * pw;
        if(this._animCount>30){
            this._animCount=0;
            if(this._animIndex==3){
                this._animIndex=0;
            }else{
                this._animIndex+=1;
            }
        }else{
            this._animCount+=1;
        }
        if( this._animIndex==1){
            sx = (n % 4 * 3 + 1) * pw
        }else if( this._animIndex==2){
            sx = (n % 4 * 3 + 2) * pw
        }else if( this._animIndex==3){
            sx = (n % 4 * 3 + 1) * pw
        }
        var sy = (Math.floor(n / 4) * 4) * ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, 100 - pw / 2, 100 - ph);   
    }
}

PBWindowTextInput.prototype.restoreDefault = function() {
    this._currentValue = this._defaultValue;
    this._index = this._currentValue.length;
    this.refresh();
    return this._currentValue.length > 0;
};

PBWindowTextInput.prototype.add = function(ch) {
    if (this._index < this._maxLength) {
        this._currentValue += ch;
        this._index++;
        this.refresh();
        return true;
    } else {
        return false;
    }
};

PBWindowTextInput.prototype.back = function() {
    if (this._index > 0) {
        this._index--;
        this._currentValue = this._currentValue.slice(0, this._index);
        this.refresh();
        return true;
    } else {
        return false;
    }
};

PBWindowTextInput.prototype.faceWidth = function() {
    return 144;
};

PBWindowTextInput.prototype.charWidth = function() {
    var text = $gameSystem.isJapanese() ? '\uff21' : 'A';
    return this.textWidth(text);
};

PBWindowTextInput.prototype.left = function() {
    var nameCenter = ( 64 + (this._characterImage?100:0));
    var nameWidth = (this._maxLength + 1) * this.charWidth();
    return nameCenter;
};

PBWindowTextInput.prototype.itemRect = function(index) {
    return {
        x: this.left() + index * this.charWidth(),
        y: this.height-this.lineHeight()*2,
        width: this.charWidth(),
        height: this.lineHeight()
    };
};

PBWindowTextInput.prototype.underlineRect = function(index) {
    var rect = this.itemRect(index);
    rect.x++;
    if(this._currentValue.length==index){
       rect.y += rect.height - 6;
    }else{
      rect.y += rect.height - 8;
    }
    rect.width -= 2;
    rect.height = 6;
    return rect;
};

PBWindowTextInput.prototype.underlineColor = function() {
    return this.normalColor();
};

PBWindowTextInput.prototype.drawUnderline = function(index) {
    var rect = this.underlineRect(index);
    var color = this.underlineColor();
    this.contents.paintOpacity = 255;
    this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
    this.contents.paintOpacity = 255;
};

PBWindowTextInput.prototype.drawChar = function(index) {
    var rect = this.itemRect(index);
    this.resetTextColor();
    rect.y -= rect.height/2;
    this.drawText(this._currentValue[index] || '', rect.x, rect.y);
};
PBWindowTextInput.prototype.refresh = function() {
    this.contents.clear();
    this.drawShadow();
    this.drawAnimatedCharacter(); 
    this.drawText(this._labelText || '', this.left(), 0);

    for (var i = 0; i < this._maxLength; i++) {
        this.drawUnderline(i);
    }
    for (var j = 0; j < this._currentValue.length; j++) {
        this.drawChar(j);
    }
    var rect = this.itemRect(this._index);
    //this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
};

PBWindowTextInput.prototype.update = function() {
    PBWindowBase.prototype.update.call(this);
    this.refresh();
    
};


//-----------------------------------------------------------------------------
// PBWindowTextInputPadActor
//
// The window for selecting text characters on the name input screen.

function PBWindowTextInputPadActor() {
    this.initialize.apply(this, arguments);
}

PBWindowTextInputPadActor.prototype = Object.create(PBWindowSelectable.prototype);
PBWindowTextInputPadActor.prototype.constructor = PBWindowTextInputPadActor;
PBWindowTextInputPadActor.LATIN1 =
        [ 'A','B','C','D','E',  'a','b','c','d','e',
          'F','G','H','I','J',  'f','g','h','i','j',
          'K','L','M','N','O',  'k','l','m','n','o',
          'P','Q','R','S','T',  'p','q','r','s','t',
          'U','V','W','X','Y',  'u','v','w','x','y',
          'Z','[',']','^','_',  'z','{','}','|','~',
          '0','1','2','3','4',  '!','#','$','%','&',
          '5','6','7','8','9',  '(',')','*','+','-',
          '/','=','@','<','>',  ':',';',' ','Page','OK' ];
PBWindowTextInputPadActor.LATIN2 =
        [ 'Á','É','Í','Ó','Ú',  'á','é','í','ó','ú',
          'À','È','Ì','Ò','Ù',  'à','è','ì','ò','ù',
          'Â','Ê','Î','Ô','Û',  'â','ê','î','ô','û',
          'Ä','Ë','Ï','Ö','Ü',  'ä','ë','ï','ö','ü',
          'Ā','Ē','Ī','Ō','Ū',  'ā','ē','ī','ō','ū',
          'Ã','Å','Æ','Ç','Ð',  'ã','å','æ','ç','ð',
          'Ñ','Õ','Ø','Š','Ŵ',  'ñ','õ','ø','š','ŵ',
          'Ý','Ŷ','Ÿ','Ž','Þ',  'ý','ÿ','ŷ','ž','þ',
          'Ĳ','Œ','ĳ','œ','ß',  '«','»',' ','Page','OK' ];
PBWindowTextInputPadActor.RUSSIA =
        [ 'А','Б','В','Г','Д',  'а','б','в','г','д',
          'Е','Ё','Ж','З','И',  'е','ё','ж','з','и',
          'Й','К','Л','М','Н',  'й','к','л','м','н',
          'О','П','Р','С','Т',  'о','п','р','с','т',
          'У','Ф','Х','Ц','Ч',  'у','ф','х','ц','ч',
          'Ш','Щ','Ъ','Ы','Ь',  'ш','щ','ъ','ы','ь',
          'Э','Ю','Я','^','_',  'э','ю','я','%','&',
          '0','1','2','3','4',  '(',')','*','+','-',
          '5','6','7','8','9',  ':',';',' ','','OK' ];
PBWindowTextInputPadActor.JAPAN1 =
        [ 'あ','い','う','え','お',  'が','ぎ','ぐ','げ','ご',
          'か','き','く','け','こ',  'ざ','じ','ず','ぜ','ぞ',
          'さ','し','す','せ','そ',  'だ','ぢ','づ','で','ど',
          'た','ち','つ','て','と',  'ば','び','ぶ','べ','ぼ',
          'な','に','ぬ','ね','の',  'ぱ','ぴ','ぷ','ぺ','ぽ',
          'は','ひ','ふ','へ','ほ',  'ぁ','ぃ','ぅ','ぇ','ぉ',
          'ま','み','む','め','も',  'っ','ゃ','ゅ','ょ','ゎ',
          'や','ゆ','よ','わ','ん',  'ー','～','・','＝','☆',
          'ら','り','る','れ','ろ',  'ゔ','を','　','カナ','決定' ];
PBWindowTextInputPadActor.JAPAN2 =
        [ 'ア','イ','ウ','エ','オ',  'ガ','ギ','グ','ゲ','ゴ',
          'カ','キ','ク','ケ','コ',  'ザ','ジ','ズ','ゼ','ゾ',
          'サ','シ','ス','セ','ソ',  'ダ','ヂ','ヅ','デ','ド',
          'タ','チ','ツ','テ','ト',  'バ','ビ','ブ','ベ','ボ',
          'ナ','ニ','ヌ','ネ','ノ',  'パ','ピ','プ','ペ','ポ',
          'ハ','ヒ','フ','ヘ','ホ',  'ァ','ィ','ゥ','ェ','ォ',
          'マ','ミ','ム','メ','モ',  'ッ','ャ','ュ','ョ','ヮ',
          'ヤ','ユ','ヨ','ワ','ン',  'ー','～','・','＝','☆',
          'ラ','リ','ル','レ','ロ',  'ヴ','ヲ','　','英数','決定' ];
PBWindowTextInputPadActor.JAPAN3 =
        [ 'Ａ','Ｂ','Ｃ','Ｄ','Ｅ',  'ａ','ｂ','ｃ','ｄ','ｅ',
          'Ｆ','Ｇ','Ｈ','Ｉ','Ｊ',  'ｆ','ｇ','ｈ','ｉ','ｊ',
          'Ｋ','Ｌ','Ｍ','Ｎ','Ｏ',  'ｋ','ｌ','ｍ','ｎ','ｏ',
          'Ｐ','Ｑ','Ｒ','Ｓ','Ｔ',  'ｐ','ｑ','ｒ','ｓ','ｔ',
          'Ｕ','Ｖ','Ｗ','Ｘ','Ｙ',  'ｕ','ｖ','ｗ','ｘ','ｙ',
          'Ｚ','［','］','＾','＿',  'ｚ','｛','｝','｜','～',
          '０','１','２','３','４',  '！','＃','＄','％','＆',
          '５','６','７','８','９',  '（','）','＊','＋','－',
          '／','＝','＠','＜','＞',  '：','；','　','かな','決定' ];

PBWindowTextInputPadActor.prototype.initialize = function(editWindow) {
    var x = editWindow.x;
    var y = editWindow.y + editWindow.height + 8;
    var width = editWindow.width;
    var height = this.windowHeight();
    PBWindowSelectable.prototype.initialize.call(this, x, y, width, height);
    this._editWindow = editWindow;
    this._page = 0;
    this._index = 0;
    this.refresh();
    this.updateCursor();
    this.activate();
};

PBWindowTextInputPadActor.prototype.windowHeight = function() {
    return this.fittingHeight(9);
};

PBWindowTextInputPadActor.prototype.table = function() {
    if ($gameSystem.isJapanese()) {
        return [PBWindowTextInputPadActor.JAPAN1,
            PBWindowTextInputPadActor.JAPAN2,
            PBWindowTextInputPadActor.JAPAN3];
    } else if ($gameSystem.isRussian()) {
        return [PBWindowTextInputPadActor.RUSSIA];
    } else {
        return [PBWindowTextInputPadActor.LATIN1,
                PBWindowTextInputPadActor.LATIN2];
    }
};

PBWindowTextInputPadActor.prototype.maxCols = function() {
    return 10;
};

PBWindowTextInputPadActor.prototype.maxItems = function() {
    return 90;
};

PBWindowTextInputPadActor.prototype.character = function() {
    return this._index < 88 ? this.table()[this._page][this._index] : '';
};

PBWindowTextInputPadActor.prototype.isPageChange = function() {
    return this._index === 88;
};

PBWindowTextInputPadActor.prototype.isOk = function() {
    return this._index === 89;
};

PBWindowTextInputPadActor.prototype.itemRect = function(index) {
    return {
        x: index % 10 * 42 + Math.floor(index % 10 / 5) * 24,
        y: Math.floor(index / 10) * this.lineHeight(),
        width: 42,
        height: this.lineHeight()
    };
};

PBWindowTextInputPadActor.prototype.refresh = function() {
    var table = this.table();
    this.contents.clear();
    this.resetTextColor();
    for (var i = 0; i < 90; i++) {
        var rect = this.itemRect(i);
        rect.x += 3;
        rect.width -= 6;
        this.drawText(table[this._page][i], rect.x, rect.y, rect.width, 'center');
    }
};

PBWindowTextInputPadActor.prototype.updateCursor = function() {
    var rect = this.itemRect(this._index);
    this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
};

PBWindowTextInputPadActor.prototype.isCursorMovable = function() {
    return this.active;
};

PBWindowTextInputPadActor.prototype.cursorDown = function(wrap) {
    if (this._index < 80 || wrap) {
        this._index = (this._index + 10) % 90;
    }
};

PBWindowTextInputPadActor.prototype.cursorUp = function(wrap) {
    if (this._index >= 10 || wrap) {
        this._index = (this._index + 80) % 90;
    }
};

PBWindowTextInputPadActor.prototype.cursorRight = function(wrap) {
    if (this._index % 10 < 9) {
        this._index++;
    } else if (wrap) {
        this._index -= 9;
    }
};

PBWindowTextInputPadActor.prototype.cursorLeft = function(wrap) {
    if (this._index % 10 > 0) {
        this._index--;
    } else if (wrap) {
        this._index += 9;
    }
};

PBWindowTextInputPadActor.prototype.cursorPagedown = function() {
    this._page = (this._page + 1) % this.table().length;
    this.refresh();
};

PBWindowTextInputPadActor.prototype.cursorPageup = function() {
    this._page = (this._page + this.table().length - 1) % this.table().length;
    this.refresh();
};

PBWindowTextInputPadActor.prototype.processCursorMove = function() {
    var lastPage = this._page;
    PBWindowSelectable.prototype.processCursorMove.call(this);
    this.updateCursor();
    if (this._page !== lastPage) {
        SoundManager.playCursor();
    }
};

PBWindowTextInputPadActor.prototype.processHandling = function() {
    if (this.isOpen() && this.active) {
        if (Input.isTriggered('shift')) {
            this.processJump();
        }
        if (Input.isRepeated('cancel')) {
            this.processBack();
        }
        if (Input.isRepeated('ok')) {
            this.processOk();
        }
    }
};

PBWindowTextInputPadActor.prototype.isCancelEnabled = function() {
    return true;
};

PBWindowTextInputPadActor.prototype.processCancel = function() {
    this.processBack();
};

PBWindowTextInputPadActor.prototype.processJump = function() {
    if (this._index !== 89) {
        this._index = 89;
        SoundManager.playCursor();
    }
};

PBWindowTextInputPadActor.prototype.processBack = function() {
    if (this._editWindow.back()) {
        SoundManager.playCancel();
    }
};

PBWindowTextInputPadActor.prototype.processOk = function() {
    if (this.character()) {
        this.onNameAdd();
    } else if (this.isPageChange()) {
        SoundManager.playOk();
        this.cursorPagedown();
    } else if (this.isOk()) {
        this.onNameOk();
    }
};

PBWindowTextInputPadActor.prototype.onNameAdd = function() {
    if (this._editWindow.add(this.character())) {
        SoundManager.playOk();
    } else {
        SoundManager.playBuzzer();
    }
};

PBWindowTextInputPadActor.prototype.onNameOk = function() {
    if (this._editWindow.name() === '') {
        if (this._editWindow.restoreDefault()) {
            SoundManager.playOk();
        } else {
            SoundManager.playBuzzer();
        }
    } else {
        SoundManager.playOk();
        this.callOkHandler();
    }
};



//-----------------------------------------------------------------------------
// PBWindowTextInputPad
//
// The window for selecting text characters on the name input screen.

function PBWindowTextInputPad() {
    this.initialize.apply(this, arguments);
}

PBWindowTextInputPad.prototype = Object.create(PBWindowSelectable.prototype);
PBWindowTextInputPad.prototype.constructor = PBWindowTextInputPad;
PBWindowTextInputPad.LATIN1 =
        [ 'A','B','C','D','E',  'a','b','c','d','e',
          'F','G','H','I','J',  'f','g','h','i','j',
          'K','L','M','N','O',  'k','l','m','n','o',
          'P','Q','R','S','T',  'p','q','r','s','t',
          'U','V','W','X','Y',  'u','v','w','x','y',
          'Z','[',']','^','_',  'z','{','}','|','~',
          '0','1','2','3','4',  '!','#','$','%','&',
          '5','6','7','8','9',  '(',')','*','+','-',
          '/','=','@','<','>',  ':',';',' ','Page','OK' ];
PBWindowTextInputPad.LATIN2 =
        [ 'Á','É','Í','Ó','Ú',  'á','é','í','ó','ú',
          'À','È','Ì','Ò','Ù',  'à','è','ì','ò','ù',
          'Â','Ê','Î','Ô','Û',  'â','ê','î','ô','û',
          'Ä','Ë','Ï','Ö','Ü',  'ä','ë','ï','ö','ü',
          'Ā','Ē','Ī','Ō','Ū',  'ā','ē','ī','ō','ū',
          'Ã','Å','Æ','Ç','Ð',  'ã','å','æ','ç','ð',
          'Ñ','Õ','Ø','Š','Ŵ',  'ñ','õ','ø','š','ŵ',
          'Ý','Ŷ','Ÿ','Ž','Þ',  'ý','ÿ','ŷ','ž','þ',
          'Ĳ','Œ','ĳ','œ','ß',  '«','»',' ','Page','OK' ];
PBWindowTextInputPad.RUSSIA =
        [ 'А','Б','В','Г','Д',  'а','б','в','г','д',
          'Е','Ё','Ж','З','И',  'е','ё','ж','з','и',
          'Й','К','Л','М','Н',  'й','к','л','м','н',
          'О','П','Р','С','Т',  'о','п','р','с','т',
          'У','Ф','Х','Ц','Ч',  'у','ф','х','ц','ч',
          'Ш','Щ','Ъ','Ы','Ь',  'ш','щ','ъ','ы','ь',
          'Э','Ю','Я','^','_',  'э','ю','я','%','&',
          '0','1','2','3','4',  '(',')','*','+','-',
          '5','6','7','8','9',  ':',';',' ','','OK' ];
PBWindowTextInputPad.JAPAN1 =
        [ 'あ','い','う','え','お',  'が','ぎ','ぐ','げ','ご',
          'か','き','く','け','こ',  'ざ','じ','ず','ぜ','ぞ',
          'さ','し','す','せ','そ',  'だ','ぢ','づ','で','ど',
          'た','ち','つ','て','と',  'ば','び','ぶ','べ','ぼ',
          'な','に','ぬ','ね','の',  'ぱ','ぴ','ぷ','ぺ','ぽ',
          'は','ひ','ふ','へ','ほ',  'ぁ','ぃ','ぅ','ぇ','ぉ',
          'ま','み','む','め','も',  'っ','ゃ','ゅ','ょ','ゎ',
          'や','ゆ','よ','わ','ん',  'ー','～','・','＝','☆',
          'ら','り','る','れ','ろ',  'ゔ','を','　','カナ','決定' ];
PBWindowTextInputPad.JAPAN2 =
        [ 'ア','イ','ウ','エ','オ',  'ガ','ギ','グ','ゲ','ゴ',
          'カ','キ','ク','ケ','コ',  'ザ','ジ','ズ','ゼ','ゾ',
          'サ','シ','ス','セ','ソ',  'ダ','ヂ','ヅ','デ','ド',
          'タ','チ','ツ','テ','ト',  'バ','ビ','ブ','ベ','ボ',
          'ナ','ニ','ヌ','ネ','ノ',  'パ','ピ','プ','ペ','ポ',
          'ハ','ヒ','フ','ヘ','ホ',  'ァ','ィ','ゥ','ェ','ォ',
          'マ','ミ','ム','メ','モ',  'ッ','ャ','ュ','ョ','ヮ',
          'ヤ','ユ','ヨ','ワ','ン',  'ー','～','・','＝','☆',
          'ラ','リ','ル','レ','ロ',  'ヴ','ヲ','　','英数','決定' ];
PBWindowTextInputPad.JAPAN3 =
        [ 'Ａ','Ｂ','Ｃ','Ｄ','Ｅ',  'ａ','ｂ','ｃ','ｄ','ｅ',
          'Ｆ','Ｇ','Ｈ','Ｉ','Ｊ',  'ｆ','ｇ','ｈ','ｉ','ｊ',
          'Ｋ','Ｌ','Ｍ','Ｎ','Ｏ',  'ｋ','ｌ','ｍ','ｎ','ｏ',
          'Ｐ','Ｑ','Ｒ','Ｓ','Ｔ',  'ｐ','ｑ','ｒ','ｓ','ｔ',
          'Ｕ','Ｖ','Ｗ','Ｘ','Ｙ',  'ｕ','ｖ','ｗ','ｘ','ｙ',
          'Ｚ','［','］','＾','＿',  'ｚ','｛','｝','｜','～',
          '０','１','２','３','４',  '！','＃','＄','％','＆',
          '５','６','７','８','９',  '（','）','＊','＋','－',
          '／','＝','＠','＜','＞',  '：','；','　','かな','決定' ];

PBWindowTextInputPad.prototype.initialize = function(editWindow) {
    var x = editWindow.x;
    var y = editWindow.y + editWindow.height + 8;
    var width = editWindow.width;
    var height = this.windowHeight();
    PBWindowSelectable.prototype.initialize.call(this, x, y, width, height);
    this._editWindow = editWindow;
    this._page = 0;
    this._index = 0;
    this.refresh();
    this.updateCursor();
    this.activate();
};

PBWindowTextInputPad.prototype.windowHeight = function() {
    return this.fittingHeight(9);
};

PBWindowTextInputPad.prototype.table = function() {
    if ($gameSystem.isJapanese()) {
        return [PBWindowTextInputPad.JAPAN1,
            PBWindowTextInputPad.JAPAN2,
            PBWindowTextInputPad.JAPAN3];
    } else if ($gameSystem.isRussian()) {
        return [PBWindowTextInputPad.RUSSIA];
    } else {
        return [PBWindowTextInputPad.LATIN1,
                PBWindowTextInputPad.LATIN2];
    }
};

PBWindowTextInputPad.prototype.maxCols = function() {
    return 10;
};

PBWindowTextInputPad.prototype.maxItems = function() {
    return 90;
};

PBWindowTextInputPad.prototype.character = function() {
    return this._index < 88 ? this.table()[this._page][this._index] : '';
};

PBWindowTextInputPad.prototype.isPageChange = function() {
    return this._index === 88;
};

PBWindowTextInputPad.prototype.isOk = function() {
    return this._index === 89;
};

PBWindowTextInputPad.prototype.itemRect = function(index) {
    return {
        x: index % 10 * 42 + Math.floor(index % 10 / 5) * 24,
        y: Math.floor(index / 10) * this.lineHeight(),
        width: 42,
        height: this.lineHeight()
    };
};

PBWindowTextInputPad.prototype.refresh = function() {
    var table = this.table();
    this.contents.clear();
    this.resetTextColor();
    for (var i = 0; i < 90; i++) {
        var rect = this.itemRect(i);
        rect.x += 3;
        rect.width -= 6;
        this.drawText(table[this._page][i], rect.x, rect.y, rect.width, 'center');
    }
};

PBWindowTextInputPad.prototype.updateCursor = function() {
    var rect = this.itemRect(this._index);
    this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
};

PBWindowTextInputPad.prototype.isCursorMovable = function() {
    return this.active;
};

PBWindowTextInputPad.prototype.cursorDown = function(wrap) {
    if (this._index < 80 || wrap) {
        this._index = (this._index + 10) % 90;
    }
};

PBWindowTextInputPad.prototype.cursorUp = function(wrap) {
    if (this._index >= 10 || wrap) {
        this._index = (this._index + 80) % 90;
    }
};

PBWindowTextInputPad.prototype.cursorRight = function(wrap) {
    if (this._index % 10 < 9) {
        this._index++;
    } else if (wrap) {
        this._index -= 9;
    }
};

PBWindowTextInputPad.prototype.cursorLeft = function(wrap) {
    if (this._index % 10 > 0) {
        this._index--;
    } else if (wrap) {
        this._index += 9;
    }
};

PBWindowTextInputPad.prototype.cursorPagedown = function() {
    this._page = (this._page + 1) % this.table().length;
    this.refresh();
};

PBWindowTextInputPad.prototype.cursorPageup = function() {
    this._page = (this._page + this.table().length - 1) % this.table().length;
    this.refresh();
};

PBWindowTextInputPad.prototype.processCursorMove = function() {
    var lastPage = this._page;
    PBWindowSelectable.prototype.processCursorMove.call(this);
    this.updateCursor();
    if (this._page !== lastPage) {
        SoundManager.playCursor();
    }
};

PBWindowTextInputPad.prototype.processHandling = function() {
    if (this.isOpen() && this.active) {
        if (Input.isTriggered('shift')) {
            this.processJump();
        }
        if (Input.isRepeated('cancel')) {
            this.processBack();
        }
        if (Input.isRepeated('ok')) {
            this.processOk();
        }
    }
};

PBWindowTextInputPad.prototype.isCancelEnabled = function() {
    return true;
};

PBWindowTextInputPad.prototype.processCancel = function() {
    this.processBack();
};

PBWindowTextInputPad.prototype.processJump = function() {
    if (this._index !== 89) {
        this._index = 89;
        SoundManager.playCursor();
    }
};

PBWindowTextInputPad.prototype.processBack = function() {
    if (this._editWindow.back()) {
        SoundManager.playCancel();
    }
};

PBWindowTextInputPad.prototype.processOk = function() {
    if (this.character()) {
        this.onNameAdd();
    } else if (this.isPageChange()) {
        SoundManager.playOk();
        this.cursorPagedown();
    } else if (this.isOk()) {
        this.onNameOk();
    }
};

PBWindowTextInputPad.prototype.onNameAdd = function() {
    if (this._editWindow.add(this.character())) {
        SoundManager.playOk();
    } else {
        SoundManager.playBuzzer();
    }
};

PBWindowTextInputPad.prototype.onNameOk = function() {
    if (this._editWindow.value() === '') {
        if (this._editWindow.restoreDefault()) {
            SoundManager.playOk();
        } else {
            SoundManager.playBuzzer();
        }
    } else {
        SoundManager.playOk();
        this.callOkHandler();
    }
};


Game_Interpreter.prototype.command303 = function() {
    if (!$gameParty.inBattle()) {
        if ($dataActors[this._params[0]]) {
            SceneManager.push(PBSceneTextInputActor);
            SceneManager.prepareNextScene(this._params[0], this._params[1]);
        }
    }
    return true;
};
var aliasInterpreterPluginCommand=Game_Interpreter.prototype.pluginCommand;
var lastInputText="";
var getInputText=function(){
    return lastInputText;
}
var showTextInput=function(maxLength, defaultValue, labelText, characterImage){
    SceneManager.push(PBSceneTextInput);
    SceneManager.prepareNextScene(maxLength,defaultValue,labelText,characterImage);
}