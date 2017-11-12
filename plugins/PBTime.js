/*~struct~TintConfig:
 * @param red
 * @text Red
 * @desc The amount of Red
 * @type number
 * @default 0
 * @min -255
 * @max 255
 * 
 * @param green
 * @text Green
 * @desc The amount of Green
 * @type number
 * @default 0
 * @min -255
 * @max 255
 * 
 * @param blue
 * @text Blue
 * @desc The amount of Blue
 * @type number
 * @default 0
 * @min -255
 * @max 255
 * 
 * @param gray
 * @text Gray
 * @desc The amount of Gray
 * @type number
 * @default 0
 * @min -255
 * @max 255
 * 
 */
/*:
 * @plugindesc Contains functions, classes and settings controlling the ingame flow of time
 * @author ctrl.alt.supr (git.ctrl.alt.supr@gmail.com)
 * 
 * @help This plugin does not provide plugin commands.
 * 
 * @param CatGeneral
 * @text General
 * 
 * @param useRealTime
 * @text Use real time
 * @desc If true, the time will be synced with the player's computer
 * @type boolean
 * @default false
 * @parent CatGeneral
 * 
 * @param dayNames
 * @text Day names
 * @desc A list of all the day names, separated by comma. If empty, the day number will be used. Element count must match weekLength.
 * @default ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
 * @type text[]
 * @parent CatGeneral
 *
 * @param dayShortNames
 * @text Short day names
 * @desc A list of all the day short names, separated by comma. If empty, the day number will be used. Element count must match weekLength.
 * @default ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"]
 * @type text[]
 * @parent CatGeneral
 *
 * @param monthNames
 * @text Month names
 * @desc A list of all the month names, separated by comma. If empty, the month number will be used. Element count must match yearLength.
 * @default ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
 * @type text[]
 * @parent CatGeneral
 *
 * @param monthShortNames
 * @text Short month names
 * @desc A list of all the month short names, separated by comma. If empty, the month number will be used. Element count must match yearLength.
 * @default ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
 * @type text[]
 * @parent CatGeneral
 * 
 * @param pauseClockDuringConversations
 * @text Paused during messages
 * @desc If true, it will stop the flow of time while messages are being displayed on screen.
 * @default true
 * @type boolean
 * @parent CatGeneral
 * 
 * @param weekDayOffset
 * @text First weekday
 * @desc Change the value here to a number betwen 0 and 6 to change the week day of the first day of the firstyear
 * @default 0
 * @parent CatGeneral
 *
 * @param CatLengths
 * @text Lenghts
 * 
 * @param secondLength
 * @text Second length
 * @desc How many frames should an ingame second last
 * @default 100
 * @type number
 * @min 0
 * @parent CatLengths
 * 
 * @param secondSpeedMultiplier
 * @text Second length mult
 * @desc Increase this to make everything faster
 * @default 1
 * @type number
 * @min 1
 * @max 10
 * @parent CatLengths
 *
 *
 * @param CatPeriods
 * @text Periods
 * 
 * @param dayPeriod1Hour
 * @text Hour [Nigth -> Morning]
 * @desc At what hour does night turn into early morning
 * @default 6
 * @type number
 * @min 0
 * @max 23
 * @parent CatPeriods
 *
 * @param dayPeriod2Hour
 * @text Hour [Morning -> Day]
 * @desc At what hour does early morning turn into day
 * @default 9
 * @type number
 * @min 0
 * @max 23
 * @parent CatPeriods
 *
 * @param dayPeriod3Hour
 * @text Hour [Day -> Evening]
 * @desc At what hour does day turn into evening
 * @default 18
 * @type number
 * @min 0
 * @max 23
 * @parent CatPeriods
 *
 * @param dayPeriod4Hour
 * @text Hour [Evening -> Night]
 * @desc At what hour does evening turn into night
 * @default 20
 * @type number
 * @min 0
 * @max 23
 * @parent CatPeriods
 * 
 * @param CatInitials
 * @text Initials
 * 
 * @param initialSecond
 * @desc At what second will the game start?
 * @default 0
 * @parent CatInitials
 *
 * @param initialMinute
 * @desc At what minute will the game start?
 * @default 0
 * @parent CatInitials
 *
 * @param initialHour
 * @desc At what hour will the game start?
 * @default 6
 * @parent CatInitials
 *
 * @param initialDay
 * @desc At what day will the game start?
 * @default 1
 * @parent CatInitials
 *
 * @param initialMonth
 * @desc At what month will the game start?
 * @default 1
 * @parent CatInitials
 *
 * @param initialYear
 * @desc At what year will the game start?
 * @default 1
 * @parent CatInitials
 *
 * @param CatTints
 * @text Tints
 * 
 * @param useTint
 * @text Apply tints
 * @desc Are tints applied?
 * @type boolean
 * @default true
 * @parent CatTints
 * 
 * @param morningTint
 * @desc Red, Green, Blue and Gray values to use in the morning
 * @type struct<TintConfig>
 * @default {"red": "-34", "green": "-17", "blue":"10", "gray": "68"}
 * @parent CatTints
 *
 * @param middayTint
 * @desc Red, Green, Blue and Gray values to use during the day
 * @type struct<TintConfig>
 * @default {"red": "0", "green": "0", "blue":"0", "gray": "0"}
 * @parent CatTints
 *
 * @param eveningTint
 * @desc Red, Green, Blue and Gray values to use in the evening
 * @type struct<TintConfig>
 * @default {"red": "17", "green": "-34", "blue":"-68", "gray": "17"}
 * @parent CatTints
 *
 * @param nightTint
 * @desc Red, Green, Blue and Gray values to use at night
 * @type struct<TintConfig>
 * @default {"red": "-102", "green": "-85", "blue":"0", "gray": "140"}
 * @parent CatTints
 *
 * @param tintSpeed
 * @desc how many frames should the tint effect take to complete?
 * @default 300
 * @type number
 * @min 0
 * @parent CatTints
 *
 * 
 *
 * 
 * 
 */
var parameters = PluginManager.parameters('PBTime');
function PBGameTime() {
    this.initialize.apply(this, arguments);
}
//Shared container for overrided functions.
PBGameTime.overrides={};
PBGameTime.prototype = Object.create(Object.prototype);
PBGameTime.prototype.constructor = PBGameTime;

PBGameTime.prototype.initialize = function() {
    //Object.prototype.initialize.call(this);
    this._currentTime=0;
    this._initialized=false;
    this._frameCount=0;
    this._currentPeriod=null;
    this.settings={
        general:{
            useRealTime:(String(parameters['useRealTime'] || 'false')=="true")
        },
        lengths:{
            secondSpeedMultiplier:Number(parameters['secondSpeedMultiplier'] || '1'),
            second:Number(parameters['secondLength'] || '1000'),
            minute:Number(parameters['minuteLength'] || '60'),
            hour:Number(parameters['hourLength'] || '60'),
            day:Number(parameters['dayLength'] || '24'),
            week:Number(parameters['weekLength'] || '7'),
            month:Number(parameters['monthLength'] || '31'),
            year:Number(parameters['yearLength'] || '12')
        },
        initials:{
            second:Number(parameters['initialSecond'] || '0'),
            minute:Number(parameters['initialMinute'] || '0'),
            hour:Number(parameters['initialHour'] || '0'),
            day:Number(parameters['initialDay'] || '1'),
            month:Number(parameters['initialMonth'] || '1'),
            year:Number(parameters['initialYear'] || '1')
        },
        periods:{
            morning:Number(parameters['dayPeriod1Hour'] || '6'),
            day:Number(parameters['dayPeriod2Hour'] || '9'),
            evening:Number(parameters['dayPeriod3Hour'] || '18'),
            night:Number(parameters['dayPeriod4Hour'] || '20')
        },
        tints:{
            useTint:(String(parameters['useTint'] || 'false')=="true"),
            morning:JSON.parse(String(parameters['morningTint'] || '{"red": "-34", "green": "-17", "blue":"10", "gray": "68"}')),
            day:JSON.parse(String(parameters['middayTint'] || '{"red": "0", "green": "0", "blue":"0", "gray": "0"}')),
            evening:JSON.parse(String(parameters['eveningTint'] || '{"red": "17", "green": "-34", "blue":"-68", "gray": "17"}')),
            night:JSON.parse(String(parameters['nightTint'] || '{"red": "-102", "green": "-85", "blue":"0", "gray": "140"}'))
        }
    };
    
};
PBGameTime.prototype.newGameSetup=function(){
    if(this.useRealTime()){
        this._currentTime=new Date().getTime();
        this._frameCount=60;
        this._currentPeriod=this.getHourPeriod(new Date(this._currentTime).getHours());
    }else{
        //year, month, day, hours, minutes, seconds, milliseconds
        this._currentTime=new Date(2000+this.initialYear(), this.initialMonth(), this.initialDay(), this.initialHour(), this.initialMinute(), this.initialSecond(), 0).getTime();
        this._frameCount=this.secondLength();
        this._currentPeriod=this.getHourPeriod(new Date(this._currentTime).getHours());
    }
};

PBGameTime.prototype.update=function(active){
    this.updateCurrentTime(active);
}
PBGameTime.prototype.updateCurrentTime=function(active){
    if(active){
        if(this._frameCount<=0){
            if(!this.useRealTime()){
                var lastTime=this._currentTime;
                var newTime=moment(this._currentTime).add(1,"seconds").valueOf();
                this._currentTime=newTime;
                this._frameCount=this.secondLength()/this.settings.lengths.secondSpeedMultiplier;
                this.onTimePassed(lastTime);
            }else{
                var lastTime=this._currentTime;
                this._currentTime=new Date().getTime();
                this._frameCount=60/this.settings.lengths.secondSpeedMultiplier;
                this.onTimePassed(lastTime);
            }  
        }else{
            this._frameCount--;
        }   
    }
}
PBGameTime.prototype.onTimePassed=function(oldTime){
    var oldDate=new Date(oldTime);
    var newDate=new Date(this._currentTime);
    var oldPeriod=this._currentPeriod;
    this._currentPeriod=this.getHourPeriod(newDate.getHours())
    if(this._currentPeriod!=oldPeriod){
        this.updateTint(this.settings.tints[this._currentPeriod], 300);
    }
}
PBGameTime.prototype.getHourPeriod=function(hour){
    if(hour>=this.settings.periods.morning && hour<this.settings.periods.day){
        return "morning";
    }else if(hour>=this.settings.periods.day && hour<this.settings.periods.evening){
        return "day";
    }else if(hour>=this.settings.periods.evening && hour<this.settings.periods.night){
        return "evening";
    }else {
        return "night";
    }
}
//Current time getters
PBGameTime.prototype.getTime=function(){
    return this._currentTime;
}
PBGameTime.prototype.getHour=function(){
    return new Date(this._currentTime).getHours();
}
PBGameTime.prototype.getHours=function(){
    return this.getHour();
}
PBGameTime.prototype.getMinute=function(){
    return new Date(this._currentTime).getMinutes();
}
PBGameTime.prototype.getMinutes=function(){
    return this.getMinute();
}
PBGameTime.prototype.getSecond=function(){
    return new Date(this._currentTime).getSeconds();
}
PBGameTime.prototype.getSeconds=function(){
    return this.getSecond();
}
PBGameTime.prototype.getMillisecond=function(){
    return new Date(this._currentTime).getMilliseconds();
}
PBGameTime.prototype.getMilliseconds=function(){
    return this.getMillisecond();
}
PBGameTime.prototype.getDay=function(){
    return new Date(this._currentTime).getDate();
}
PBGameTime.prototype.getMonthDay=function(){
    return this.getDay();
}
PBGameTime.prototype.getWeekDay=function(){
    return new Date(this._currentTime).getDay();
}
PBGameTime.prototype.getMonth=function(){
    return new Date(this._currentTime).getMonth();
}
PBGameTime.prototype.getYear=function(){
    return new Date(this._currentTime).getFullYear();
}
//General
PBGameTime.prototype.useRealTime=function(){
    return this.settings.general.useRealTime;
}
//Initials
PBGameTime.prototype.initialDay=function(){
    return this.settings.initials.day;
}
PBGameTime.prototype.initialHour=function(){
    return this.settings.initials.hour;
}
PBGameTime.prototype.initialMinute=function(){
    return this.settings.initials.minute;
}
PBGameTime.prototype.initialSecond=function(){
    return this.settings.initials.second;
}
PBGameTime.prototype.initialMonth=function(){
    return this.settings.initials.month;
}
PBGameTime.prototype.initialYear=function(){
    return this.settings.initials.year;
}

//Lengths
PBGameTime.prototype.secondLength=function(){
    return this.settings.lengths.second;
}

PBGameTime.prototype.canTintScreen=function(){
    return this.settings.tints.useTint;
}

//Overrided DataManager methods to take in account time.
PBGameTime.overrides.DataManager_createGameObjects=DataManager.createGameObjects;
DataManager.createGameObjects = function() {
    PBGameTime.overrides.DataManager_createGameObjects.call(this);
    $PBTime        = new PBGameTime();
};
PBGameTime.overrides.DataManager_makeSaveContents=DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
    var contents = PBGameTime.overrides.DataManager_makeSaveContents.call(this);
    contents.time       = $PBTime;
    return contents;
};
PBGameTime.overrides.DataManager_extractSaveContents=DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
    if(contents.time!=undefined && contents.time!=null){
       $PBTime             = contents.time; 
    }
    PBGameTime.overrides.DataManager_extractSaveContents.call(this, contents);
};
PBGameTime.overrides.DataManager_setupNewGame=DataManager.setupNewGame;
DataManager.setupNewGame = function() {
    PBGameTime.overrides.DataManager_setupNewGame.call(this);
    $PBTime.newGameSetup();
};
//Overrided DataManager methods to take in account time.
PBGameTime.overrides.Scene_Map_updateMain=Scene_Map.prototype.updateMain;
Scene_Map.prototype.updateMain = function() {
    var active = this.isActive();
    $PBTime.update(active);
    PBGameTime.overrides.Scene_Map_updateMain.call(this);
};

PBGameTime.prototype.updateTint = function(tintInfo, speed) {
    var data = [0, 0, 0, 0];
    if (this.canTintScreen()) {
        data = [tintInfo.red, tintInfo.green, tintInfo.blue, tintInfo.gray];
    }
    if (data.length > 0) {
      data[0] = parseInt(data[0], 10);
    } else {
      data.push(0);
    }
    if (data.length > 1) {
      data[1] = parseInt(data[1], 10);
    } else {
      data.push(0);
    }
    if (data.length > 2) {
      data[2] = parseInt(data[2], 10);
    } else {
      data.push(0);
    }
    if (data.length > 3) {
      data[3] = parseInt(data[3], 10);
    } else {
      data.push(0);
    }
    $gameScreen.startTint(data, speed);
};