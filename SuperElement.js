console.log("%cThe Library Created By https://jade.gleeze.com In April.2018 ",
        "font-size:12px;color:red;text-shadow:0px 0px 3px rgba(0,0,0,0.5);border:2px solid red;border-radius:10px;");
let internalCssElement = document.createElement("style");
    document.head.appendChild(internalCssElement);
let internalCnList = {};
let keyframeList = {};

export class SuperElement{//div
    constructor(el){
        this.element = document.createElement(el);
        this.el = this.element;
        this.className = this.__uniqueCode("cc","");//const
        this.addClassName(this.className);

        this.children = [];
        this.dressCnChain = [];
        this.dressMaxLength = 2; //..最大...
        this._isRuningTransition = false;
        this._onoff = false;
        this._isVisibleWhenSrolling = false;
        this._animationState = 0; //0:notstart, 1:started, 2:iterated, 3: ended

        this.needDetectAnimationState = true;
    }

    __jsonToCssDeclarationText(styleJson){
        //console.log(styleJson);
        let keys = Object.keys(styleJson);
        if(styleJson['transform'] && this.putTXY) {
            styleJson['transform'] = this.putTXY + styleJson['transform'];
        }
        let cssDeclarationText = ``;
        for(let i = 0; i<keys.length; i++){
            cssDeclarationText += "\t" + keys[i] + ":" + styleJson[keys[i]] +";\r\n";
        }
        //console.log("{\r\n" + cssDeclarationText + "}\r\n");
        return "{\r\n" + cssDeclarationText + "}\r\n";
    }

    __appendToInternalCSSElement(cssDeclaration,prefix="r",postfix=" ",
                                    isUnique=true, selectorType="."){
        //cssDeclaration-format: { width:"400px" };
        //1,static random code.
        //2,dynamic random code.
        //3.dynamic custom code
        let selector = isUnique ? this.__uniqueCode(prefix,postfix) : prefix + postfix;
        let cssText = selectorType + selector + cssDeclaration;
        let cssTextNode = document.createTextNode(cssText);
        internalCssElement.appendChild(cssTextNode);
        selector = this.trim(selector).replace(/ {2,}/gi,"");
        internalCnList[ selector ] = cssTextNode;
        return selector;
    }
    __getSelectorByClassname(classname){
        let keys = Object.keys(internalCnList);
        for(let i=0; i<keys.length; i++) {
            if(new RegExp(classname,'gi').test(keys[i])) return keys[i];
        }
        return undefined;
    }

    __appendJsonToInlineCSS(styleobj){
        let keys = Object.keys(styleobj);
        let sheetContent = ``;
        for(let i = 0; i<keys.length; i++){
            //this[keys[i]] = styleobj[keys[i]];//because of width/height setter/getter
            this.element.style[keys[i]] = styleobj[keys[i]];
        }
    }

    __uniqueCode(prefix='r', postfix=" "){
        return prefix + (Date.now() + this.randomInt(1,1000000)).toString(16)+postfix;
    }

    dressup(styleobj, isInternalCSS = true){
            let className;
            if( isInternalCSS ){
                if(this.dressCnChain.length >= this.dressMaxLength){
                    className = this.dressCnChain.shift();
                    this.removeCSS(className);
                }
                let cssDeclarationText = this.__jsonToCssDeclarationText(styleobj);
                className = this.__appendToInternalCSSElement(cssDeclarationText);
                this.addClassName(className);
                this.dressCnChain.push(className);
                return className;
            } else {
                this.__appendJsonToInlineCSS(styleobj);
            }
    }

    setAttr(styleobj){
        let keys = Object.keys(styleobj);
        for(let i = 0; i<keys.length; i++){
            this.element.setAttribute( keys[i], styleobj[keys[i]] );
        }
    }

    getAttr(propertyName){
        return this.element.getAttribute(propertyName);
    }

    removeKeyframe(keyframeName,waitMs=0){
        setTimeout(deleteKeyframe,waitMs);
        function deleteKeyframe(){
            if(keyframeList[keyframeName]!==undefined){
                keyframeList[keyframeName].remove(); 
                delete keyframeList[keyframeName];
            }    
        }
    }

    removeItself(){
        //clear parent's chldren-array.
        if(this.parent){
            let pIndex = this.parent.children.indexOf(this);
            this.parent.children.splice(pIndex, pIndex==-1?0:1);
        }
        //clear current object's css
        if(this.element){
            let thisCns = this.getClassName().trim().split(" ");
            for(let i=thisCns.length-1; i>0; i--) this.removeCSS(thisCns[i]);
            //clear current object's element 
            this.element.remove();
        }
        //repeating above operation for children;
        if(this.children){
            while(this.children.length>0) this.children.pop().removeItself(); 
            if(this.children.length===0){
                let keys = Object.keys(this);
                for(let i=0; i<keys.length; i++) delete this[keys[i]];
            }
        }
    }
    remove(){
        removeItself();
    }

    keyframes(str,waitMs=0,aniName=undefined) {//wait for ms and then delete automatically.
        if(aniName === undefined) aniName = this.__uniqueCode("kf");
        let r = "@keyframes " + aniName + "{\r\n" + str + "\r\n}";
        var rTextNode = document.createTextNode(r);
        internalCssElement.appendChild(rTextNode);
        keyframeList[aniName] = rTextNode;
        if(waitMs) this.removeKeyframe(aniName,waitMs);
        return aniName;
    }

    animate(keyframeInfo){
            //format:keyframe-Name >>> duration timingFn dealy....info.
            //keyframeInfo[0] is keyframeName, keyframeInfo[1] is otherInfo
            if(this.anime===undefined) this.anime = {};
            let keyframeSchedules = keyframeInfo.split("+");
            let keyInfos = [];
            keyframeSchedules.map( (v)=>keyInfos.push(v.split(">>>")) );
            let kfn = null;
                //
            this.anime.cancel = ()=>{
                //console.log(window.getComputedStyle(this.element).animation);
                if(kfn) this.removeKeyframe(kfn);
                this.dressup( {animation:''}, false );
            };
                //
            this.anime.play = (schedulesIndex=0,callback)=>{
                    if(kfn) this.anime.cancel();
                        kfn = this.keyframes( keyInfos[schedulesIndex][0] );//keyFrameName
                    this.dressup({ 
                        animation: kfn+' '+keyInfos[schedulesIndex][1]
                    }, false); 
                    this.animated('strict').then(()=>{
                        if(callback) callback();
                    })
            }
                //
            this.anime.back = (schedulesIndex=0,callback)=>{
                    if(kfn) this.anime.cancel();
                        kfn = this.keyframes( keyInfos[schedulesIndex][0] );//keyFrameName
                    this.dressup({ 
                        animation: kfn+' '+keyInfos[schedulesIndex][1],
                        'animation-direction':'reverse'
                    }, false); 
                    this.animated('strict').then(()=>{
                        if(callback) callback();
                    })
            }

            return this.anime;
    }

    transition(stops={}, transitInfo=''){//ridiculous？
            //stops = Object|[Object,Obj..], transitInfo=''
            if(this.transit===undefined) this.transit = {};
            let originalTransitionProperty = getComputedStyle(this.element).transition;

            if(!Array.isArray(stops)){
                let copy = stops;
                stops = [];
                stops.push(copy);
            }

            let saveOriginalPropertyValue = (stops)=>{
                let original = {};
                stops.map((stop)=>{
                    Object.keys(stop).map((prop) => {
                         original[prop]=getComputedStyle(this.element)[prop]; 
                    });
                });
                return original;
            }
            let infoBeforeTransit = saveOriginalPropertyValue(stops);
                //original property and value;
            this.transit.play = (stopsIndex=0)=>{
                this.dressup(stops[stopsIndex], false);
            }
                //
            this.transit.back = (stopsIndex=0)=>{
                this.dressup(infoBeforeTransit, false);
            }
                //
            this.transit.cancel = ()=>{
                this.dressup({transition:originalTransitionProperty},false);
                this.transit.back();                
            }
                //set transition
            this.transit.setup = ()=>{
                this.dressup({transition: originalTransitionProperty+","+transitInfo}, false);
            }
            this.transit.setup();

            return this.transit;
    }

    set needDetectAnimationState(value){
        if(value===true){
            let startHandler = (e)=>{ 
                this._animationState = 1; 
                //this.un('animationstart',startHandler);

            }
            let iterationHandler = (e)=>{ 
                this._animationState = 2; 
                //this.un('animationiteration',iterationHandler);
            }
            let endHandler = (e)=>{ 
                this._animationState = 3; 
                //this.un('animationiteration',endHandler);
            }

            this.on('animationstart',startHandler);
            this.on('animationiteration',iterationHandler);
            this.on('animationend',endHandler);
        }
    }
    get getAnimationState(){ return this._animationState; }//0:notstart, 1:started, 2:iterated, 3: ended

    appendTo(superel=document.body){
            if(superel.tagName!=='BODY'){
                superel.children.push(this);
                this.parent = superel;
                superel = superel.element;
            }
            return superel.appendChild(this.element);
                    //appendToBody|appendToSuperElement
    }

    prependTo(superel=document.body){//e
        if(superel.tagName!=='BODY'){
            superel.children.splice(0,0,this);
            this.parent = superel;
            superel = superel.element;
        }
        return superel.insertBefore(this.element, superel.childNodes[0]);
    }

    appendChildrenOf(superel){
        //参数所指定的对象的一系列子项 追加到 该对象子项的尾部中。简称“子项追加”
            for(let i=0; i<superel.children.length; i++){
                this.children.push(superel.children[i]);
                this.element.appendChild(superel.children[i].element);
            }
            return this;
    }

    prependChildrenOf(superel){
        //参数所指定的对象的子项 前加到 该对象子项的前部。简称“子项前加”
            for(let i=0; i<superel.children.length; i++){
                this.children.splice(i, 0, superel.children[i]);
                this.element.insertBefore(superel.children[i].element, this.element.childNodes[i]);
            }
            return this;
    }

    randomInt(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min; }
    
    get x() { return parseFloat(getComputedStyle(this.element).left); }
    get y() { return parseFloat(getComputedStyle(this.element).top); }
    get gx(){ return this.element.getBoundingClientRect().left; }//relative to viewport.
    get gy(){ return this.element.getBoundingClientRect().top; }//...
    get width(){ return this.element.getBoundingClientRect().width; }//border-box rect
    get height(){ return this.element.getBoundingClientRect().height; }//...NumberType
    get widthC(){ return parseFloat(getComputedStyle(this.element).width); }//content-box rect.
    get heightC(){ return parseFloat(getComputedStyle(this.element).height); }//...StringType.+'px'
    get animationName(){ return getComputedStyle(this.element).animationName; }
    get borderWidth() { return parseFloat(getComputedStyle(this.element).borderWidth); }
    get name(){ return this.element.getAttribute("name"); }
    set name(v){ this.element.setAttribute("name",v);}
    get id(){ return this.element.getAttribute("id"); }
    set id(value) { this.element.setAttribute("id",value); }
    get previousSibling(){ return this.element.previousSibling; }
    get bgcolor(){ return getComputedStyle(this.element).backgroundColor; } 
    isExist(value){ return document.querySelector("#"+value)===null ? false : true; }
    get randomColor(){ 
        return "#" + ("000000" + this.randomInt(0,16777215).toString(16)).slice(-6); 
    }
    addClassName(className,el=this.element,separator=" "){
        this.element.setAttribute("class",(el.getAttribute("class")||"")+className+separator);
    }
    getClassName(el=this.element){ return el.getAttribute("class"); }
    get onoff(){ this._onoff = !this._onoff;  return this._onoff; }


    triggerScrollEvent(waitMs=0){ 
        setTimeout(()=>{
            this.element.scrollTop=1;
            this.element.scrollTop=0;
        },waitMs) ;
    }
    visibleOn(parent,sensitivityOffset={sx:0,sy:0,scase:'minYmaxY'}){
        //if not pass parent, the argument[0] is just window. when scrolling
        //it must accompanies with scroll-event.
        //if sensitivityOffset is positive number, stands for the range of visibility will be bigger.
            //otherwise ..
        //rangeX/rangeY stands for range offsetX/Y.
        let f = sensitivityOffset;
        let minX = -this.width - f.sx,
            maxX = parent ?  parent.width - parent.borderWidth*2 + f.sx : window.innerWidth + f.sx;
        let minY = -this.height - f.sy,
            maxY = parent ? parent.height - parent.borderWidth*2 + f.sy : window.innerHeight + f.sy;
        let curX = parent ? this.gx - parent.gx - parent.borderWidth : this.gx, 
            curY = parent ? this.gy - parent.gy - parent.borderWidth : this.gy;

        switch(sensitivityOffset.scase){//sensibility case
            case 'minX':
                if(curX > minX) return true; break;
            case 'maxX':
                if(curX < maxX) return true; break;
            case 'minY':
                if(curY > minY) return true; break;
            case 'maxY':
                if(curY < maxY) return true; break;
            case 'minXmaxX':
                if(curX > minX && curX < maxX) return true; break;
            case 'minYmaxY':
                if(curY > minY && curY < maxY) return true; break;
            case 'all':
            default:
                if( curX > minX && curX < maxX && curY > minY && curY < maxY ) return true; break;
        }
        return false;
    }

    ifVisibleThenElse(visible,invisible,sensitivityOffset={sx:0,sy:0,scase:'maxY'},parent=this.parent){
        //when scrolling if visible or not then....
        //it must accompanies with scroll-event.
        if(this._isVisibleWhenSrolling !== this.visibleOn(parent,sensitivityOffset)){
            this._isVisibleWhenSrolling = !this._isVisibleWhenSrolling;
            if(this._isVisibleWhenSrolling) {
                if(visible) visible();
            } else{
                if(invisible) invisible();
            } 
        }
    }


    
    animated(strict='normal', animationName=''){
        return new Promise((resolve)=>{
            let main = (e)=>{
                    let removeEventListener = ()=>this.element.removeEventListener("animationend",main);
                    //console.log(e);
                    let escn = this.trim(e.target.className+'');
                    switch(strict){
                            case 'very strict':
                                if(animationName === e.animationName){
                                    if( escn.indexOf(this.trim(this.className))>-1 ) {
                                        removeEventListener();
                                        resolve(e);
                                    }
                                }else{
                                    removeEventListener();
                                }
                                break;
                            case 'strict':
                                if( escn.indexOf(this.trim(this.className))>-1 ) {
                                    this.element.removeEventListener("animationend",main);
                                    resolve(e);
                                }
                                break;
                            case 'normal':
                            default:
                                if(e.target.parentNode.uniqueTimeID === undefined){
                                    e.target.parentNode.uniqueTimeID = [];
                                }//execute a time at the same time.
                                if(e.target.parentNode.uniqueTimeID.indexOf(e.timeStamp)===-1){
                                    e.target.parentNode.uniqueTimeID.push(e.timeStamp);
                                    removeEventListener();
                                    resolve(e);
                                }
                                break;
                    }
            };
            this.element.addEventListener("animationend",main);
        });
    }


    writeCSS(styleJson, prefix = "", postfix = "", isUnique = true, selectorType = "."){
        //if(isUnique) selectorType + prefix + __uniqueCode + postfix;
                //else selectorType + prifix + postfix;
        let cssDeclarationText = this.__jsonToCssDeclarationText(styleJson);
        let selector = this.__appendToInternalCSSElement(
            cssDeclarationText, 
            prefix, postfix, 
            isUnique, selectorType 
        );

        let className = selector.replace(postfix,"");
        //this.element.className += className+" ";
        this.addClassName(className);
        return className;
    }

    //writecss({width:'100px'},":hover", parent)
    writecss(styleJson, selector = ":hover", parent = null){ 
        //always uniquely write CSS to the other(exp.class-pseudo or parent);
        //writeCSS to class-pseudo or for parent
        if(parent === null){
            return this.writeCSS( styleJson, "me", selector );
        } else {
            return parent.writeCSS( styleJson, "ma", selector + " ." + this.className );
        }
    }

    removeCSS(className){
        let selector = className;
        if(!internalCnList[className]){
            selector = this.__getSelectorByClassname(className);
        }
        internalCnList[selector].remove(); 
        delete internalCnList[selector];
        this.element.setAttribute(
            "class",
            this.trim(this.getClassName().replace(className,"").replace(/ {2,}/gi," "))+" "
        );
        let indexToRemove = this.dressCnChain.indexOf(className);
        this.dressCnChain.splice(indexToRemove,indexToRemove===-1?0:1);
    }

    trim(str){ 
        //console.log("trim str: ",str);
        return str.replace(/^ *| *$/gi,"");
    }
 
    on(eventName,callback,useCapture=false){
        this.element.addEventListener(eventName,callback,useCapture);
    }

    un(eventName,callback,useCapture=false){
        this.element.removeEventListener(eventName,callback,useCapture);
    }

    centerText(text=""){
        this.text(text);
        this.dressup({'text-align':'center','line-height':this.heightC},false);
    }
    text(text=""){ this.element.innerText = text; }

    beRound(magnitude='6px'){
        this.dressup({'border-radius':magnitude});
    }

    border(param="3px solid black"){
        let el = this.element;
        el.style.border = param;
    }

    onTransition(transitionValue, sync = true){//jsonOBJ
        let afterTransitionend = () => {
            if( this._isRunningTransition === false ){
                //alert(1);
                let r = this.element.className.match(new RegExp(theMark+"[\\w]{11}","gi"));
                //console.log(r);
                //if( r && 2 <= r.length ){ this.removeCSS( r[0] ); }
                this._isRunningTransition = sync;
                let className = this.writeCSS(transitionValue, "TRS");
                return className; 
            }
        }
        let theMark = "TRS";//transition Mark
        if( !this.__runTransitionOnce ){
            this.element.addEventListener("transitionend", (e)=>{ 
                alert("tr");
                this._isRunningTransition  = false; 
                afterTransitionend();
            });
            this.__runTransitionOnce = true;
        }
    }

    dynamicShowText(str,interval=500, tagName=undefined){
        function makeElement(char, tagName){
            let el,chars;
            chars = document.createTextNode(char);
            if(tagName !== undefined){
                 el = document.createElement(tagName);
                 el.appendChild(chars);
            }
            return tagName ? el : chars;
        }
        for(let i=0; i<str.length; i++){
            let char = makeElement(str[i], tagName);
            setTimeout(()=>{
                this.element.appendChild(char);
            },i * interval);
        }
    }
    
}


export class SvgElement extends SuperElement{
    constructor(eln){
        super();
        this.ns = "http://www.w3.org/2000/svg";
        this.element = document.createElementNS(this.ns, eln);
        this.el = this.element;
        this.className = this.__uniqueCode("ccv","");
        this.addClassName(this.className);
    }

    get getPathLength(){  
        //rect|polygan|line|circle|path
        let lenObj = {
                getRectLength:(el)=>{
                    var w = el.getAttribute('width');
                    var h = el.getAttribute('height');
                    return (w * 2) + (h * 2);
                },
                getPolygonLength: (el)=>{
                    var points = el.getAttribute('points');
                        points = points.split(" ");
                    var x1 = null,
                        x2, y1 = null,
                        y2, lineLength = 0,
                        x3, y3;
                    for (var i = 0; i < points.length; i++) {
                        var coords = points[i].split(",");
                        if (x1 == null && y1 == null) {
                            if (/(\r\n|\n|\r)/gm.test(coords[0])) {
                                coords[0] = coords[0].replace(/(\r\n|\n|\r)/gm, "");
                                coords[0] = coords[0].replace(/\s+/g, "");
                            }
                            if (/(\r\n|\n|\r)/gm.test(coords[1])) {
                                coords[0] = coords[1].replace(/(\r\n|\n|\r)/gm, "");
                                coords[0] = coords[1].replace(/\s+/g, "");
                            }
                    
                            x1 = coords[0];
                            y1 = coords[1];
                            x3 = coords[0];
                            y3 = coords[1];
                        } else {
                            if (coords[0] != "" && coords[1] != "") {
                                if (/(\r\n|\n|\r)/gm.test(coords[0])) {
                                    coords[0] = coords[0].replace(/(\r\n|\n|\r)/gm, "");
                                    coords[0] = coords[0].replace(/\s+/g, "");
                                }
                    
                                if (/(\r\n|\n|\r)/gm.test(coords[1])) {
                                    coords[0] = coords[1].replace(/(\r\n|\n|\r)/gm, "");
                                    coords[0] = coords[1].replace(/\s+/g, "");
                                }
                    
                                x2 = coords[0];
                                y2 = coords[1];
                    
                                lineLength += Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
                    
                                x1 = x2;
                                y1 = y2;
                                if (i == points.length - 2) {
                                    lineLength += Math.sqrt(Math.pow((x3 - x1), 2) + Math.pow((y3 - y1), 2));
                                }
                            }
                        }
                    }
                    return lineLength;
                },
    
                getLineLength: (el)=>{
                    var x1 = el.getAttribute('x1');
                    var x2 = el.getAttribute('x2');
                    var y1 = el.getAttribute('y1');
                    var y2 = el.getAttribute('y2');
                    var lineLength = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
                    return lineLength;
                },
            
                getCircleLength: (el)=>{
                    var r = el.getAttribute('r');
                    var circleLength = 2 * Math.PI * r;
                    return circleLength;
                },

                getPolylineLength: (el)=>{
                    function dis(p,q){
                        return Math.sqrt((p.x-q.x)*(p.x-q.x) + (p.y-q.y)*(p.y-q.y));
                    }
                    let ps = el.points, n = ps.numberOfItems, len=0;
                    for(var i=1; i<n; i++){
                        len += dis(ps.getItem(i-1),ps.getItem(i));
                    }
                    return len;
                },
            
                getPathLength: (el)=>{
                    var pathLength = el.getTotalLength();
                    return pathLength;
                }
        }

        let name = this.element.nodeName;
        let r;
        try{
            let fn = lenObj['get' + name[0].toUpperCase()+name.slice(1) + 'Length'];
            if( fn ){
                return fn(this.element);
            }else{
                return lenObj['getPathLength'](this.element);
            }
        }catch(err){
            console.error(err);
            return undefined;
        }
    }
}
