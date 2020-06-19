/*~struct~MapConnection:
 * @param MapA
 * @text Map A ID
 * @desc First connected map id
 * @type number
 * @min 1
 * 
 * @param MapB
 * @text Map B ID
 * @desc Id of a map connected to Map A
 * @type number
 * @min 1
 *
 * @param Direction
 * @text Direction from Map A
 * @desc Direction from Map A to Map B
 * @type select
 * @option (↑) North
 * @value 8
 * @option (↓) South
 * @value 2
 * @option (→) East
 * @value 6
 * @option (←) West
 * @value 4
 * 
 * @param TileA
 * @text Tile in Map A
 * @desc Leftmost (North or south direction) or topmost (East or west direction) connected tile in Map A
 * @type number
 * @min 1
 * 
 * 
 */
/*:
 * @plugindesc Emulates seamless interconected maps. 
 * @author ctrl.alt.supr (git.ctrl.alt.supr@gmail.com)
 * @help This plugin does not provide plugin commands.
 *
 * == To connect two maps: ==
 * - Add a new entry to the 'List of connections' parameter of this plugin whith:
 *      · Map A ID: Should contain the ID of one of the connected maps that are 
 *        part of this connection.
 *      · Map B ID: Should contain the ID of the other connected map that is 
 *        part of this connection.
 *      · Direction from Map A:
 *          · North (8)
 *          · South (2)
 *          · East  (6)
 *          · West  (4)
 *      · Tile in Map A: An integer that indicates the leftmost (North or south 
 *        direction) or topmost (East or west direction) connected tile in 
 *        Map A (Default: 1)
 * - NOTE: Only one entry for each pair of connections is required. For example 
 *         (if you want to connect mapID 1 and mapID 2) only an entry with Map 
 *         A 1 and Map B 2 (or the other way around) is required.
 * 
 * @param MapConnections
 * @text List of connections
 * @desc A list where all map connections are defined.
 * @type struct<MapConnection>[]
 * @default []
 * 
 * @param MakeStep
 * @text Make fake step
 * @desc Simulates an step just before the transfer occurs, making more seamless the player transition between the maps. Very recommended to leave this on.
 * @type boolean
 * @default true
 * 
 * @param FadeType
 * @text Fade type
 * @desc How to fade the transition?
 * @type select
 * @option None
 * @value 2
 * @option Black
 * @value 0
 * @option White
 * @value 1
 * @default 2
 * 
 * @param AllwaysScrollingMaps
 * @text Centered on player maps
 * @desc A list of map ids where the camera will always be centered on the player, not taking in account any map boundaries
 * @type number[]
 * @min 0
 * @default []
 * 
 * @param NeigConnections
 * @text Draw indirect connections
 * @desc Paints maps connected to currently connected maps. May slow down execution. Recommended off when using big maps.
 * @type boolean
 * @default true
 * 
 */
//-----------------------------------------------------------------------------
// Plugin parameters
//
// Loading and parsing of plugin parameters
var parameters = PluginManager.parameters('PBConnectedMaps');
var cnInfo = String(parameters['MapConnections'] || '[]');
var cnInfoJson=JSON.parse(cnInfo);
var finalJsonInfo=[];
var alwaysScrollMaps = String(parameters['AllwaysScrollingMaps'] || '[]');
var jsonAlwScrMaps=JSON.parse(alwaysScrollMaps);
var useFakeStep = parameters['MakeStep']=="true";
var drawNeigCons = parameters['NeigConnections']=="true";
var fadeToUse = Number(parameters['FadeType'] || 2);
cnInfoJson.forEach(function(each){
    var parsed=JSON.parse(each);
    if(parsed.TileA==""){
        parsed.TileA = 1;
    }
    finalJsonInfo.push(parsed);
});



//-----------------------------------------------------------------------------
// $ConnectedMaps
//
// This is a window object where all map connection data is stored and some map connection methods are declared.

$ConnectedMaps = {
    connections:finalJsonInfo,
    outOfBoundsScrollMaps:jsonAlwScrMaps,
    fakeStep:useFakeStep,
    fadeType:fadeToUse,
    neigCons:drawNeigCons,
    connectedDataMaps:{},
    dataMapCache:{},
};

//It was supposed to also allow a mixed scrolling configuration (where oobsmaps doesnt contain a connected map and it scrolls as usual unless when going to a connected side)
//but because it made extrange camera jumps, all connected maps are automatically added to oobsmaps. Maybe continue with this idea later?
$ConnectedMaps.connections.map(function(each){
    if(!$ConnectedMaps.outOfBoundsScrollMaps.contains(each.MapA)){
        $ConnectedMaps.outOfBoundsScrollMaps.push(each.MapA)
    }
    if(!$ConnectedMaps.outOfBoundsScrollMaps.contains(each.MapB)){
        $ConnectedMaps.outOfBoundsScrollMaps.push(each.MapB)
    }
});

$ConnectedMaps.getConnectedMapsInfo=function(mapId){
    var infoRet=[];
    infoRet=$ConnectedMaps.connections.filter(function(each){
        return (each.MapA==String(mapId) || each.MapB==mapId);
    });
    return infoRet;
}

$ConnectedMaps.getNeigConnectedMapsInfo=function(mapId){
    if(!$ConnectedMaps.neigCons){
        return [];
    }
    var infoRet=[];
    infoRet=$ConnectedMaps.connections.filter(function(each){
        return (each.MapA==String(mapId) || each.MapB==mapId);
    });
    var neigCons = [];
    var neigIds=infoRet.map(function(each){
        return each.MapA==mapId?each.MapB:each.MapA;
    });
    neigIds.forEach(function(neigId){
        var neigConnections=$ConnectedMaps.getConnectedMapsInfo(neigId).filter(function(each){
            var otherId = each.MapA==neigId?each.MapB:each.MapA;
            return !(otherId == neigId || otherId == mapId);
        });
        neigConnections.forEach(function(nc){
            if(neigCons.filter(function(ec){return ((ec.MapA == nc.MapA &&  ec.MapB == nc.MapB) || (ec.MapA == nc.MapB &&  ec.MapB == nc.MapA))}).length<=0){
                neigCons.push(nc);
            }
        });
    })
    return neigCons;
}
$ConnectedMaps.getCombinedConnectedMapsInfo=function(mapId){
    var direct=$ConnectedMaps.getConnectedMapsInfo(mapId);
    var neig=$ConnectedMaps.getNeigConnectedMapsInfo(mapId);
    var toRet = direct;
    neig.forEach(function(each){
        if((each.MapA != mapId) || (each.MapB != mapId)){
            toRet.push(each);
        }
    });
    return toRet;
}


$ConnectedMaps.loadMapData = function(mapId) {
    var oldConectedDataMaps=$ConnectedMaps.connectedDataMaps;
    for (var mId in $ConnectedMaps.connectedDataMaps) {
        if ($ConnectedMaps.connectedDataMaps.hasOwnProperty(mId)) {
            $ConnectedMaps.dataMapCache[mId]=$ConnectedMaps.connectedDataMaps[mId]
        }
    }
    $ConnectedMaps.connectedDataMaps={};
    if (mapId > 0) {
        this._mapId=mapId;
        var connectedMapInfos=$ConnectedMaps.getConnectedMapsInfo(mapId);
        var connectedNeigMapInfos=$ConnectedMaps.getNeigConnectedMapsInfo(mapId);
        if(connectedMapInfos.length>0){
            var connectedMapIds=connectedMapInfos.map(function(each){
                return each.MapA==mapId?each.MapB:each.MapA;
            });
            var connectedNeigMapIds = [];
            connectedNeigMapInfos.forEach(function(each){
                if(connectedNeigMapIds.indexOf(each.MapA)<0){
                    connectedNeigMapIds.push(each.MapA);
                }
                if(connectedNeigMapIds.indexOf(each.MapB)<0){
                    connectedNeigMapIds.push(each.MapB);
                }
            });
            var combinedMapIds = connectedMapIds;
            connectedNeigMapIds.forEach(function(each){
                if(each!=mapId && combinedMapIds.indexOf(each)<0){
                    combinedMapIds.push(each);
                }
            });
            combinedMapIds.forEach(function(each){
                if(Number(each)>0){
                    if($ConnectedMaps.dataMapCache["MAP_"+each]==undefined || $ConnectedMaps.dataMapCache["MAP_"+each]==null){
                        var filename = 'Map%1.json'.format(Number(each).padZero(3));
                        $ConnectedMaps._mapLoader = ResourceHandler.createLoader('data/' + filename, $ConnectedMaps.loadDataFile.bind($ConnectedMaps, 'MAP_'+each, filename));
                        $ConnectedMaps.loadDataFile('MAP_'+each, filename);
                    }else{
                        $ConnectedMaps.connectedDataMaps['MAP_'+each]=$ConnectedMaps.dataMapCache["MAP_"+each];
                    }
                }
            });
        }
    }
};
$ConnectedMaps.loadDataFile = function(name, src) {
    var xhr = new XMLHttpRequest();
    var url = 'data/' + src;
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
        if (xhr.status < 400) {
            $ConnectedMaps.connectedDataMaps[name] = JSON.parse(xhr.responseText);
            DataManager.onLoad($ConnectedMaps.connectedDataMaps[name]);
        }
    };
    xhr.onerror = this._mapLoader || function() {
        DataManager._errorUrl = DataManager._errorUrl || url;
    };
    $ConnectedMaps.connectedDataMaps[name] = null;
    xhr.send();
};

$ConnectedMaps.isMapLoaded = function() {
    var connectedMapInfos=$ConnectedMaps.getConnectedMapsInfo(this._mapId);
    var allOK=true;
    connectedMapInfos.forEach(function(each){
        if(allOK){
            allOK = ($ConnectedMaps.connectedDataMaps["MAP_"+each.MapA] || $ConnectedMaps.connectedDataMaps["MAP_"+each.MapB]);
        }else{
            return;
        }
    });
    var connectedNeigMapInfos=$ConnectedMaps.getNeigConnectedMapsInfo(this._mapId);
    connectedNeigMapInfos.forEach(function(each){
        if(allOK){
            if(each.MapA==this._mapId){
                allOK = $ConnectedMaps.connectedDataMaps["MAP_"+each.MapB];
            }else{
                allOK = $ConnectedMaps.connectedDataMaps["MAP_"+each.MapA] 
            }
        }else{
            return;
        }
    });
    return allOK;
};


//-----------------------------------------------------------------------------
// DataManager
//
// We override some DataManager methods to take in account connected maps while loading map data.
DataManager.loadMapData = function(mapId) {
    if (mapId > 0) {
        if($gameMap){
            $ConnectedMaps.dataMapCache["MAP_"+$gameMap.mapId()]=$dataMap;
        }
        //If the new map is connected to the current one, we can use the data that is already loaded for the connected map instead of reading the file
        //again, what can save us from some extra loading times.
        if($ConnectedMaps.connectedDataMaps["MAP_"+mapId]!=undefined && $ConnectedMaps.connectedDataMaps["MAP_"+mapId]!=null){
            $dataMap=$ConnectedMaps.connectedDataMaps["MAP_"+mapId];
        }else if($ConnectedMaps.dataMapCache["MAP_"+mapId]!=undefined && $ConnectedMaps.dataMapCache["MAP_"+mapId]!=null ){
            $dataMap=$ConnectedMaps.dataMapCache["MAP_"+mapId];
        }else{
            var filename = 'Map%1.json'.format(mapId.padZero(3));
            this._mapLoader = ResourceHandler.createLoader('data/' + filename, this.loadDataFile.bind(this, '$dataMap', filename));
            this.loadDataFile('$dataMap', filename);
        }
        $ConnectedMaps.loadMapData(mapId);
    } else {
        this.makeEmptyMap();
    }
};
DataManager.isMapLoaded = function() {
    this.checkError();
    return !!$dataMap && $ConnectedMaps.isMapLoaded();
};


//-----------------------------------------------------------------------------
// Game_Player
//
// Added teleport on connected edge functionality. Based on Map Edge Transfer by Shaz.

Game_Player.prototype.waitingForConnectedMapEdgeTransfer=false;
Game_Player.prototype.connectedMapEdgeTransferInfo=null;
$ConnectedMaps.Game_Player_update = Game_Player.prototype.update;
Game_Player.prototype.update = function(sceneActive) {
    $ConnectedMaps.Game_Player_update.call(this, sceneActive);
    if (!this.isMoving()) {
        if(!this.waitingForConnectedMapEdgeTransfer){
            this.connectedMapEdgeTransferUpdate();
        }else if(this.connectedMapEdgeTransferInfo!=null){
            this.reserveTransfer(this.connectedMapEdgeTransferInfo.destMId, this.connectedMapEdgeTransferInfo.destX, this.connectedMapEdgeTransferInfo.destY, this.connectedMapEdgeTransferInfo.pDir, $ConnectedMaps.fadeType);
            this.connectedMapEdgeTransferInfo=null;
            this.waitingForConnectedMapEdgeTransfer=false;
            $gameTemp.clearDestination();
        }
    }
};
Game_Player.prototype.connectedMapEdgeTransferUpdate = function() {
    if (this.x === 0 && this.direction() === 4 && Input.isPressed('left')) {
        var connectedMapInfos=$ConnectedMaps.getConnectedMapsInfo($gameMap.mapId());
        var connectedMapInfosInDirection=connectedMapInfos.filter(function(each){
            return (each.MapA==$gameMap.mapId() && each.Direction==4 || each.MapB==$gameMap.mapId() && each.Direction==6);
        });
        if(connectedMapInfosInDirection.length>0){
            this.connectedMapEdgeTransfer(connectedMapInfosInDirection);
        }
    }
    if (this.x === $dataMap.width - 1 && this.direction() === 6 && Input.isPressed('right')) {
        var connectedMapInfos=$ConnectedMaps.getConnectedMapsInfo($gameMap.mapId());
        var connectedMapInfosInDirection=connectedMapInfos.filter(function(each){
            return (each.MapA==$gameMap.mapId() && each.Direction==6 || each.MapB==$gameMap.mapId() && each.Direction==4);
        });
        if(connectedMapInfosInDirection.length>0){
            this.connectedMapEdgeTransfer(connectedMapInfosInDirection);
        }
    }
    if (this.y === 0 && this.direction() === 8 && Input.isPressed('up')) {
        var connectedMapInfos=$ConnectedMaps.getConnectedMapsInfo($gameMap.mapId());
        var connectedMapInfosInDirection=connectedMapInfos.filter(function(each){
            return (each.MapA==$gameMap.mapId() && each.Direction==8 || each.MapB==$gameMap.mapId() && each.Direction==2);
        });
        if(connectedMapInfosInDirection.length>0){
            this.connectedMapEdgeTransfer(connectedMapInfosInDirection);
        }
        
    }
    if (this.y === $dataMap.height - 1 && this.direction() === 2 && Input.isPressed('down')) {
        var connectedMapInfos=$ConnectedMaps.getConnectedMapsInfo($gameMap.mapId());
        var connectedMapInfosInDirection=connectedMapInfos.filter(function(each){
            return (each.MapA==$gameMap.mapId() && each.Direction==2 || each.MapB==$gameMap.mapId() && each.Direction==8);
        });
        if(connectedMapInfosInDirection.length>0){
            this.connectedMapEdgeTransfer(connectedMapInfosInDirection);
        }
    }
  };

Game_Player.prototype.connectedMapEdgeTransferRelevantMapInfo=function(connectedMapInfosInDirection){
    var toRet=[];
    var pX=this.x;
    var pY=this.y;
    var cMId=$gameMap.mapId();
    if(connectedMapInfosInDirection.length>0){
        for(var i=0; i<connectedMapInfosInDirection.length; i++){
            var isValid=true;
            var destMId=((connectedMapInfosInDirection[i].MapA==String(cMId))?connectedMapInfosInDirection[i].MapB:connectedMapInfosInDirection[i].MapA);
            var destWidth=$ConnectedMaps.connectedDataMaps["MAP_"+destMId].width;
            var destHeight=$ConnectedMaps.connectedDataMaps["MAP_"+destMId].height;
            var tileC=0;
            if(this.direction()==connectedMapInfosInDirection[i].Direction){
                tileC=(connectedMapInfosInDirection[i].TileA-1);
            }else{
                tileC=-1*(connectedMapInfosInDirection[i].TileA-1);
            }
            if(connectedMapInfosInDirection[i].Direction==4 || connectedMapInfosInDirection[i].Direction==6){
                if(pY<0+tileC || pY>=destHeight+tileC){
                    isValid=false;
                }
            }else if(connectedMapInfosInDirection[i].Direction==2 || connectedMapInfosInDirection[i].Direction==8){
                if(pX<0+tileC || pX>=destWidth+tileC){
                    isValid=false;
                }
            }
            if(isValid){
                toRet.push(connectedMapInfosInDirection[i]);
            }
        }
    }   
    return toRet;
}

Game_Player.prototype.connectedMapEdgeTransfer = function(connectedMapInfosInDirection) {
    var pX=this.x;
    var pY=this.y;
    var pDir = this.direction();
    connectedMapInfosInDirection=this.connectedMapEdgeTransferRelevantMapInfo(connectedMapInfosInDirection);
    if(connectedMapInfosInDirection.length>0){
        var cMId=$gameMap.mapId();
        var destX=0;
        var destY=0;
        var destMId=((connectedMapInfosInDirection[0].MapA==String(cMId))?connectedMapInfosInDirection[0].MapB:connectedMapInfosInDirection[0].MapA);
        var destWidth=$ConnectedMaps.connectedDataMaps["MAP_"+destMId].width;
        var destHeight=$ConnectedMaps.connectedDataMaps["MAP_"+destMId].height;
        if(pDir==4){
            destX=destWidth-1;
            destY=pY;
            if(pDir==connectedMapInfosInDirection[0].Direction){
                destY-=(connectedMapInfosInDirection[0].TileA-1);
            }else{
                destY+=(connectedMapInfosInDirection[0].TileA-1);
            }
        }else if(pDir==6){
            destX=0
            destY=pY;
            if(pDir==connectedMapInfosInDirection[0].Direction){
                destY-=(connectedMapInfosInDirection[0].TileA-1);
            }else{
                destY+=(connectedMapInfosInDirection[0].TileA-1);
            }
        }else if(pDir==2){
            destY=0;
            destX=pX;
            if(pDir==connectedMapInfosInDirection[0].Direction){
                destX-=(connectedMapInfosInDirection[0].TileA-1);
            }else{
                destX+=(connectedMapInfosInDirection[0].TileA-1);
            }
        }else if(pDir==8){
            destY=destHeight-1;
            destX=pX;
            if(pDir==connectedMapInfosInDirection[0].Direction){
                destX-=(connectedMapInfosInDirection[0].TileA-1);
            }else{
                destX+=(connectedMapInfosInDirection[0].TileA-1);
            }
        }
        //The following lines force the player to go an step ahead to make the
        //transition more "seamless"
        if($ConnectedMaps.fakeStep){
            this.setDirection(pDir);
            this._x = $gameMap.roundXWithDirection(this._x, pDir);
            this._y = $gameMap.roundYWithDirection(this._y, pDir);
            this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(pDir));
            this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(pDir));
            this.increaseSteps();
        }
        this.waitingForConnectedMapEdgeTransfer=true;
        this.connectedMapEdgeTransferInfo={destMId:destMId, destX:destX, destY:destY, pDir:pDir}; 
    }
};

//-----------------------------------------------------------------------------
// Game_Map
//
// Change the way scrolling is handled when connected maps are involved

$ConnectedMaps.Game_Map_setup=Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId) {
    $ConnectedMaps.Game_Map_setup.call(this,mapId);

};
Game_Map.prototype.scrollDown = function(distance) {
    if (this.isLoopVertical()) {
        this._displayY += distance;
        this._displayY %= $dataMap.height;
        if (this._parallaxLoopY) {
            this._parallaxY += distance;
        }
    } else if (this.height() >= this.screenTileY()) {
        var lastY = this._displayY;
        var mId=this.mapId();
        
        if($ConnectedMaps.outOfBoundsScrollMaps.contains(String(mId))){
            this._displayY = this._displayY + distance;
        }else{
            this._displayY = Math.min(this._displayY + distance,
                this.height() - this.screenTileY());
        }
        this._parallaxY += this._displayY - lastY;
    }
};

Game_Map.prototype.scrollLeft = function(distance) {
    if (this.isLoopHorizontal()) {
        this._displayX += $dataMap.width - distance;
        this._displayX %= $dataMap.width;
        if (this._parallaxLoopX) {
            this._parallaxX -= distance;
        }
    } else if (this.width() >= this.screenTileX()) {
        var lastX = this._displayX;
        var mId=this.mapId();
        if( $ConnectedMaps.outOfBoundsScrollMaps.contains(String(mId))){
            this._displayX = this._displayX - distance;
        }else{
            this._displayX = Math.max(this._displayX - distance, 0);
        }
        this._parallaxX += this._displayX - lastX;
    }
};

Game_Map.prototype.scrollRight = function(distance) {
    if (this.isLoopHorizontal()) {
        this._displayX += distance;
        this._displayX %= $dataMap.width;
        if (this._parallaxLoopX) {
            this._parallaxX += distance;
        }
    } else if (this.width() >= this.screenTileX()) {
        var lastX = this._displayX;
        var mId=this.mapId();
        if($ConnectedMaps.outOfBoundsScrollMaps.contains(String(mId))){
            this._displayX = this._displayX + distance; 
        }else{
            this._displayX = Math.min(this._displayX + distance,
                this.width() - this.screenTileX()); 
        }
        this._parallaxX += this._displayX - lastX;
    }
};

Game_Map.prototype.scrollUp = function(distance) {
    if (this.isLoopVertical()) {
        this._displayY += $dataMap.height - distance;
        this._displayY %= $dataMap.height;
        if (this._parallaxLoopY) {
            this._parallaxY -= distance;
        }
    } else if (this.height() >= this.screenTileY()) {
        var lastY = this._displayY;
        var mId=this.mapId();
        if($ConnectedMaps.outOfBoundsScrollMaps.contains(String(mId))){
            this._displayY = this._displayY - distance;
        }else{
            this._displayY = Math.max(this._displayY - distance, 0);
        }
        this._parallaxY += this._displayY - lastY;
    }
};

Game_Map.prototype.setDisplayPos = function(x, y) {
    if (this.isLoopHorizontal()) {
        this._displayX = x.mod(this.width());
        this._parallaxX = x;
    } else {
        var endX = this.width() - this.screenTileX();
        var mId=this.mapId();
        if($ConnectedMaps.outOfBoundsScrollMaps.contains(String(mId))){
            this._displayX = endX < 0 ? endX / 2 : x;
        }else{
            this._displayX = endX < 0 ? endX / 2 : x.clamp(0, endX);
        }
        this._parallaxX = this._displayX;
    }
    if (this.isLoopVertical()) {
        this._displayY = y.mod(this.height());
        this._parallaxY = y;
    } else {
        var endY = this.height() - this.screenTileY();
        var mId=this.mapId();
        if($ConnectedMaps.outOfBoundsScrollMaps.contains(String(mId))){
            this._displayY = endY < 0 ? endY / 2 : y;
        }else{
            this._displayY = endY < 0 ? endY / 2 : y.clamp(0, endY);
        }
        this._parallaxY = this._displayY;
    }
};



//-----------------------------------------------------------------------------
// Spriteset_Map
//
// Added methods to display and control tilemaps for each of the connected maps.

Spriteset_Map.prototype.createLowerLayer = function() {
    Spriteset_Base.prototype.createLowerLayer.call(this);
    this._connectedTilemaps=[];
    this._connectedTilesets=[];
    this.createParallax();
    this.createConnectedTilemaps();
    this.createTilemap();
    this.createCharacters();
    this.createShadow();
    this.createDestination();
    this.createWeather();
};

Spriteset_Map.prototype.update = function() {
    Spriteset_Base.prototype.update.call(this);
    this.updateTileset();
    this.updateParallax();
    this.updateConnectedTilemaps();
    this.updateTilemap();
    this.updateShadow();
    this.updateWeather();
};

Spriteset_Map.prototype.createConnectedTilemaps = function() {
    this._connectedTilemaps=[];
    this._connectedTilesets=[];
    var connectedMapInfos=$ConnectedMaps.getConnectedMapsInfo($ConnectedMaps._mapId);
    var slf=this;
    var cont=0;
    
    connectedMapInfos.forEach(function(cadaConnMapInfo){
        var laId=((cadaConnMapInfo.MapA==String($ConnectedMaps._mapId))?cadaConnMapInfo.MapB:cadaConnMapInfo.MapA);
        var newTileMap=null;
        //Using ShaderTilemaps when more than a tileset is involved causes it to lag incredibly, so only Tilemap is used.
        newTileMap=new Tilemap();
        //We set the original Y position of the connected tilemap based on the side its attached to and the tile offset
        //If the side is North or South
        if(cadaConnMapInfo.Direction==2 && cadaConnMapInfo.MapA==String($ConnectedMaps._mapId)){
            newTileMap.originalX=0-(cadaConnMapInfo.TileA-1);
            newTileMap.originalY=-1*$gameMap.height();
        }else if(cadaConnMapInfo.Direction==2 && cadaConnMapInfo.MapB==String($ConnectedMaps._mapId)){
            newTileMap.originalX=0+(cadaConnMapInfo.TileA-1);
            newTileMap.originalY=$ConnectedMaps.connectedDataMaps["MAP_"+laId].height;
        }else if(cadaConnMapInfo.Direction==8 && cadaConnMapInfo.MapA==String($ConnectedMaps._mapId)){
            newTileMap.originalX=0-(cadaConnMapInfo.TileA-1);
            newTileMap.originalY=$ConnectedMaps.connectedDataMaps["MAP_"+laId].height;
        }else if(cadaConnMapInfo.Direction==8 && cadaConnMapInfo.MapB==String($ConnectedMaps._mapId)){
            newTileMap.originalX=0+(cadaConnMapInfo.TileA-1);
            newTileMap.originalY=-1*$gameMap.height();
        }

        //If the side is East or West
        if(cadaConnMapInfo.Direction==4 && cadaConnMapInfo.MapA==String($ConnectedMaps._mapId)){
            newTileMap.originalX=$ConnectedMaps.connectedDataMaps["MAP_"+laId].width;
            newTileMap.originalY=0-(cadaConnMapInfo.TileA-1);
        }else if(cadaConnMapInfo.Direction==4 && cadaConnMapInfo.MapB==String($ConnectedMaps._mapId)){
            newTileMap.originalX=-1*$gameMap.width();
            newTileMap.originalY=0+(cadaConnMapInfo.TileA-1);
        }else if(cadaConnMapInfo.Direction==6 && cadaConnMapInfo.MapA==String($ConnectedMaps._mapId)){
            newTileMap.originalX=-1*$gameMap.width();
            newTileMap.originalY=0-(cadaConnMapInfo.TileA-1);
        }else if(cadaConnMapInfo.Direction==6 && cadaConnMapInfo.MapB==String($ConnectedMaps._mapId)){
            newTileMap.originalX=$ConnectedMaps.connectedDataMaps["MAP_"+laId].width;
            newTileMap.originalY=0+(cadaConnMapInfo.TileA-1);
        }
        slf._connectedTilemaps.push(newTileMap);
        newTileMap.tileWidth = $gameMap.tileWidth();
        newTileMap.tileHeight = $gameMap.tileHeight();
        newTileMap.setData($ConnectedMaps.connectedDataMaps["MAP_"+laId].width, $ConnectedMaps.connectedDataMaps["MAP_"+laId].height, $ConnectedMaps.connectedDataMaps["MAP_"+laId].data);
        newTileMap.horizontalWrap = ($ConnectedMaps.connectedDataMaps["MAP_"+laId].scrollType === 2 ||$ConnectedMaps.connectedDataMaps["MAP_"+laId] === 3);
        newTileMap.verticalWrap = ($ConnectedMaps.connectedDataMaps["MAP_"+laId].scrollType === 1 || $ConnectedMaps.connectedDataMaps["MAP_"+laId].scrollType === 3);
        slf.loadConnectedTileset(laId, cont);
        slf._baseSprite.addChild(newTileMap);
        cont+=1;
        //We should also show the connections of this connection
        if($ConnectedMaps.neigCons){
            var connectedNeigMapInfos=$ConnectedMaps.getNeigConnectedMapsInfo($ConnectedMaps._mapId);
            var connectionsToThisNeig=connectedNeigMapInfos.filter(function(ecn){
                return ((ecn.MapA!=$ConnectedMaps._mapId && ecn.MapB!=$ConnectedMaps._mapId) && (ecn.MapA==laId || ecn.MapB==laId));
            });
            connectionsToThisNeig.forEach(function(cadaNeigConnMapInfo){
                if((cadaNeigConnMapInfo.MapA == $ConnectedMaps._mapId && cadaNeigConnMapInfo.MapB == laId) || (cadaNeigConnMapInfo.MapB == $ConnectedMaps._mapId && cadaNeigConnMapInfo.MapA == laId)){
                    return;
                }
                var laNeigId=((cadaNeigConnMapInfo.MapA==String(laId))?cadaNeigConnMapInfo.MapB:cadaNeigConnMapInfo.MapA);
                var newNeigTileMap=null;
                //Using ShaderTilemaps when more than a tileset is involved causes it to lag incredibly, so only Tilemap is used.
                newNeigTileMap=new Tilemap();
                //We set the original Y position of the connected tilemap based on the side its attached to and the tile offset
                //If the side is North or South
                if(cadaNeigConnMapInfo.Direction==2 && cadaNeigConnMapInfo.MapA==String(laId)){
                    newNeigTileMap.originalX= newTileMap.originalX - (cadaNeigConnMapInfo.TileA -1);
                    newNeigTileMap.originalY= newTileMap.originalY + (-1*$ConnectedMaps.connectedDataMaps["MAP_"+laId].height);
                }else if(cadaNeigConnMapInfo.Direction==2 && cadaNeigConnMapInfo.MapB==String(laId)){
                    newNeigTileMap.originalX= newTileMap.originalX + (cadaNeigConnMapInfo.TileA-1);
                    newNeigTileMap.originalY= newTileMap.originalY + $ConnectedMaps.connectedDataMaps["MAP_"+laNeigId].height;
                }else if(cadaNeigConnMapInfo.Direction==8 && cadaNeigConnMapInfo.MapA==String(laId)){
                    newNeigTileMap.originalX= newTileMap.originalX - (cadaNeigConnMapInfo.TileA-1);
                    newNeigTileMap.originalY= newTileMap.originalY + $ConnectedMaps.connectedDataMaps["MAP_"+laNeigId].height;
                }else if(cadaNeigConnMapInfo.Direction==8 && cadaNeigConnMapInfo.MapB==String(laId)){
                    newNeigTileMap.originalX= newTileMap.originalX + (cadaNeigConnMapInfo.TileA-1);
                    newNeigTileMap.originalY= newTileMap.originalY + (-1*$ConnectedMaps.connectedDataMaps["MAP_"+laId].height);
                }
    
                //If the side is East or West
                if(cadaNeigConnMapInfo.Direction==4 && cadaNeigConnMapInfo.MapA==String(laId)){
                    newNeigTileMap.originalX= newTileMap.originalX + $ConnectedMaps.connectedDataMaps["MAP_"+laNeigId].width;
                    newNeigTileMap.originalY= newTileMap.originalY - (cadaNeigConnMapInfo.TileA-1);
                }else if(cadaNeigConnMapInfo.Direction==4 && cadaNeigConnMapInfo.MapB==String(laId)){
                    newNeigTileMap.originalX= newTileMap.originalX + (-1*$ConnectedMaps.connectedDataMaps["MAP_"+laId].width);
                    newNeigTileMap.originalY= newTileMap.originalY + (cadaNeigConnMapInfo.TileA-1);
                }else if(cadaNeigConnMapInfo.Direction==6 && cadaNeigConnMapInfo.MapA==String(laId)){
                    newNeigTileMap.originalX= newTileMap.originalX + (-1*$ConnectedMaps.connectedDataMaps["MAP_"+laId].width);
                    newNeigTileMap.originalY= newTileMap.originalY - (cadaNeigConnMapInfo.TileA-1);
                }else if(cadaNeigConnMapInfo.Direction==6 && cadaNeigConnMapInfo.MapB==String(laId)){
                    newNeigTileMap.originalX= newTileMap.originalX + $ConnectedMaps.connectedDataMaps["MAP_"+laNeigId].width;
                    newNeigTileMap.originalY= newTileMap.originalY + (cadaNeigConnMapInfo.TileA-1);
                }
                slf._connectedTilemaps.push(newNeigTileMap);
                newNeigTileMap.tileWidth = $gameMap.tileWidth();
                newNeigTileMap.tileHeight = $gameMap.tileHeight();
                newNeigTileMap.setData($ConnectedMaps.connectedDataMaps["MAP_"+laNeigId].width, $ConnectedMaps.connectedDataMaps["MAP_"+laNeigId].height, $ConnectedMaps.connectedDataMaps["MAP_"+laNeigId].data);
                newNeigTileMap.horizontalWrap = ($ConnectedMaps.connectedDataMaps["MAP_"+laNeigId].scrollType === 2 ||$ConnectedMaps.connectedDataMaps["MAP_"+laNeigId] === 3);
                newNeigTileMap.verticalWrap = ($ConnectedMaps.connectedDataMaps["MAP_"+laNeigId].scrollType === 1 || $ConnectedMaps.connectedDataMaps["MAP_"+laNeigId].scrollType === 3);
                slf.loadConnectedTileset(laNeigId, cont);
                slf._baseSprite.addChild(newNeigTileMap);
                cont+=1;
            });
        }
    });
    
};
Spriteset_Map.connectedTilesetCache={};
Spriteset_Map.clearConnectedTilesetCache=function(){
    Spriteset_Map.connectedTilesetCache=[];
};
Spriteset_Map.prototype.loadTileset = function() {
    this._tileset = $gameMap.tileset();
    if (this._tileset) {
        var tilesetNames = this._tileset.tilesetNames;
        for (var i = 0; i < tilesetNames.length; i++) {
            Spriteset_Map.connectedTilesetCache[tilesetNames[i]]=ImageManager.loadTileset(tilesetNames[i]);
            this._tilemap.bitmaps[i] = Spriteset_Map.connectedTilesetCache[tilesetNames[i]];
        }
        var newTilesetFlags = $gameMap.tilesetFlags();
        this._tilemap.refreshTileset();
        if (!this._tilemap.flags.equals(newTilesetFlags)) {
            this._tilemap.refresh();
        }
        this._tilemap.flags = newTilesetFlags;
    }
};
Spriteset_Map.prototype.loadConnectedTileset = function(laId, connectedId) {
    var tlSet=$dataTilesets[$ConnectedMaps.connectedDataMaps["MAP_"+laId].tilesetId];
    this._connectedTilesets.push(tlSet)
    if (tlSet) {
        var tilesetNames = tlSet.tilesetNames;
        for (var i = 0; i < tilesetNames.length; i++) {
            if(!Spriteset_Map.connectedTilesetCache[tilesetNames[i]]){
                Spriteset_Map.connectedTilesetCache[tilesetNames[i]]= ImageManager.loadTileset(tilesetNames[i]);  
            }
            this._connectedTilemaps[connectedId].bitmaps[i] = Spriteset_Map.connectedTilesetCache[tilesetNames[i]]; 
        }
        var newTilesetFlags = tlSet.flags;
        this._connectedTilemaps[connectedId].refreshTileset();
        if (!this._connectedTilemaps[connectedId].flags.equals(newTilesetFlags)) {
            this._connectedTilemaps[connectedId].refresh();
        }
        this._connectedTilemaps[connectedId].flags = newTilesetFlags;
    }
};

Spriteset_Map.prototype.updateConnectedTilemaps = function() {
    this._connectedTilemaps.forEach(function(cadaTlmp){
        cadaTlmp.origin.x = cadaTlmp.originalX* $gameMap.tileHeight()+$gameMap.displayX() * $gameMap.tileWidth();
        cadaTlmp.origin.y = cadaTlmp.originalY* $gameMap.tileHeight()+$gameMap.displayY() * $gameMap.tileHeight();
    });
};


