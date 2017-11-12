function PBPokemon() {
    this.initialize.apply(this, arguments);
}
//Shared container for overrided functions.
PBPokemon.overrides={};
PBPokemon.prototype = Object.create(Object.prototype);
PBPokemon.prototype.constructor = PBPokemon;

PBPokemon.prototype.initialize = function() {
    //Object.prototype.initialize.call(this);
    this._hp=0;
    this._totalHp=0;
    this._attack=0;
    this._defense=0;
    this._spatk=0;
    this._spdef=0;
    this._iv=[0,0,0,0,0,0];
    this._ev=0;
    this._species=0;
    this._id=0;
    this._trainerId=0;
    this._pokerus=false;
    this._item=null;
    this._consumedItem=null;
    this._resultingItem=null;
    this._mail=null;
    this._mailText="";
    this._name="";
    this._exp=0;
    this._happiness=0;
    this._status=0;
    this._statusCount=0;
    this._eggSteps=0;
    this._firstMoves=[];
    this._ballUsed=0;
    this._markings=0;
    //0 - met, 1 - as egg, 2 - traded,
    //4 - fateful encounter
    this._obtainMode=0;
    this._obtainMap=0;
    this._obtainText="";
    this._obtainLevel=0;
    this._hatchedMap=0;
    this._ot="";
    this._otGender=2;

};