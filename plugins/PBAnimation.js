/*:
 * @plugindesc Battle animation classes for Pokemon Essentials MV.
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

PBAnimationFrameElement=function(){
    this.pattern=0;
    this.anchor=0;
    this.pivot=0;
    this.x=0;
    this.y=0;
    this.scale_x=1;
    this.scale_y=1;
    this.angle=0;
    this.opacity=255;
    this.priority=0;
    this.flip=false;
};
PBAnimationFrameElement.parse=function(jsonData){
    var toRet=new PBAnimationFrameElement();
    for (var name in jsonData) {
        if (jsonData.hasOwnProperty(name) && toRet.hasOwnProperty(name)) {
            toRet[name]=jsonData[name];
        }
    }
    return toRet;
};
PBAnimationFrame=function(){
    //Array of PBAnimationFrameElement
    this.elements=[];
};
PBAnimationFrame.parse=function(jsonData){
    var toRet=new PBAnimationFrame();
    var elems=[];
    if(jsonData==null){
        return null;
    }
    if(Object.prototype.toString.call(jsonData) === '[object Array]'){
        elems=jsonData;
    }else if(jsonData.elements!=undefined && jsonData.elements!=null && Object.prototype.toString.call(jsonData.elements) === '[object Array]'){
        elems=jsonData.elements;
    }else{
        elems=[];
    }
    for (var elem in elems) {
        var elElem=PBAnimationFrameElement.parse(elem);
        toRet.elements.push(elElem);
    }
    return toRet;
};
//Representation of each of the animations as stored in "data/pbanimations.json"
PBAnimation=function(){
    this.name="Animation_name";
    this.description="No_description"
    this.id=0;
    this.sheet="default";
    //Array of PBAnimationFrame
    this.frames=[];
    this.fx_sound=[];
    this.fx_bg=[];
    this.fx_fash=[];
};
PBAnimation.parse=function(jsonData){
    var toRet=new PBAnimation();
    for (var name in jsonData) {
        if (jsonData.hasOwnProperty(name) && toRet.hasOwnProperty(name)) {
            toRet[name]=jsonData[name];
        }
    }
    toRet.frames=[];
    var frames=[];
    if(Object.prototype.toString.call(jsonData) === '[object Array]'){
        frames=jsonData;
    }else if(jsonData.elements!=undefined && jsonData.elements!=null && Object.prototype.toString.call(jsonData.elements) === '[object Array]'){
        frames=jsonData.elements;
    }else{
        frames=[];
    }
    for (var frame in frames) {
        var elFrame=PBAnimationFrame.parse(frame);
        toRet.frames.push(elFrame);
    }
};
PBAnimation.get=function(animId){
    if($PBAnimations[animId]!=undefined){
        return PBAnimation.parse($PBAnimations[animId]);
    }
    return null;
}
PBAnimation.prototype.frameCount=function(){
    return this.frames.length-1;
}