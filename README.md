# SuperElement.js
SuperElement.js 동적으로 CSS를 생성과 삽입이 가능하고 그런 동적CSS방식을 토대로 애니메이션을 쉽게 구현하기 위하여 만든 JAVASCRIPT라이브러리입니다.

## Installing
#### ES2015 module 사용시:
 <pre>
    <script type='module'>
        import {SuperElement, SvgElement} from './SuperElement.js';
    </script>
</pre>

## API
<pre>
  <h2>.dressup(styleJsonObj,  [isInternalCSS=true]) </h2>
  설명:
      isInternalCSS의 값이 true일때는 <style>태그안에 삽입합니다.
      false일때는 inline방식으로 style attribute에 styleJsonObj의  부여합니다.
      기본값은 true입니다.
  
  예:
        let elem = new SuperElement("div");
        elem.dressup({position:'absolute',width:'100px',height:'100px',background:'blue'},true);
        elem.appendTo();
</pre>

<pre>
  <h2>.setAttr(styleJsonObj) </h2>
  설명:
     html tag 속성(Attribute)에 값을 부여(賦予)할수 있습니다.
  
  예:
        let f = new SuperElement("font");
        f.setAttr({color:'red'})
        f.appendTo();
</pre>

<pre>
  <h2>.getAttr(styleJsonObj) </h2>
  설명:
     html tag 속성(Attribute)에 값을 가져올수 있습니다.
  
  예:
        let f = new SuperElement("font");
        f.getAttr({color:'red'})
</pre>


<pre>
  <h2>.appendTo([SuperElement]) </h2>
  설명:
     다른 SuperElement내부의 뒷부에 새로운 SuperElment를 추가합니다.
     매개변수가 null이면 document.body내부의 뒷부분에 SuperElement를 추가합니다.
  
  예:
        let f = new SuperElement("font");
        f.appendTo();   
</pre>

<pre>
  <h2>.prependTo([SuperElement]) </h2>
  설명:
     다른 SuperElement내부의 앞부분에 새로운 SuperElment를 추가합니다.
     매개변수가 null이면 document.body내부의 앞부분에 SuperElement를 추가합니다.
  
  예:
        let f = new SuperElement("font");
        f.appendTo();   
</pre>

<pre>
  <h2>.animate(keyframeInfo) </h2>
  설명:
    keyframeInfo는  css3에 @keyframe문법과 동일합니다. 다른것이라면 따옴표 대신 백틱(backtick``)부호를 사용하세요.
    아래와 같이 쓸수 있습니다. 주의할점은 분리부호로 >>>를 정확하게 입력하고 마지막에 세미코런(semicolen)이 있어서는 안됩니다.
    +부호로 한번에 N개의 keyframe을 정의할수있습니다. 그리고 서로 스위치할수 있습니다.
    리턴value는 object인데 3가지 메소드를 제공합니다.  play(frameIndex,cb) / back(frameIndex, cb) / cancel();
     1) play는 단어뜻 그대로 플레이 하는겁니다.  cb는 콜백함수로서 애니메이션 플레이가 끝나면 콜백됩니다.
             frameIndex는 스위치할때 사용하는 인덱스입니다. 기본값은 0입니다.
     2) back는 반대방향으로 플레이.  frameIndex와 cb는 위와 동일함.
     3) cancel() 동적으로 생성된 keyframe부터 inlineStyle속성까지 깨끗이 삭제합니다.
      
  예:
        let div = new SuperElement("div");
              div.appendTo();//add to body
              div.dressup({position:'absolute',width:'100px',height:'100px',background:'black'},false);
              div.animate(`
                    0%{ background: black; }
                    100%{ background:red; }
                    >>> ease 1s both
                    +
                    0%{ background: yellow; }
                    100% {background: blue;}
                    >>> ease 1s both infinite
              `
              div.play();
             // div.play(0, ()=>{alert("has finished.")});
             // div.back();
             // div.cancle();
</pre>

<pre>
  <h2>on(eventName,callback,[useCapture=false])</h2>
  설명:
     jquery에서의 on메스드 거의 같습니다.
  
  예:
         let div = new SuperElement("div");
         div.on("dblclick",(e)=>{ console.log(e); });
</pre>

<pre>
  <h2>.un(eventName,callback,[useCapture=false])</h2>
  설명:
    이벤트에서 콜백함수의 연관성을 삭제합니다.
  
  예:
         let div = new SuperElement("div");
         div.on("dblclick",callme});
         setTimeout(()=>{
              div.un("dblclick",callme});
             },1000);
         function callme(e){ console.log(e); }
</pre>

<pre>
  ...................
</pre>

<pre>
  <h2> 마지막으로 </h2>
        소스코드를 읽어보면 일반적으로 잘 사용되지 않은 많은 메소드들이 있을겁니다.
        하지만 시간상 여유가 없기에 문서화는 그냥 여기까지일것 같습니다. 
        소스는 그냥  수정이나 갇다가 마음대로 써도 괞찮습니다. 쓴지 오래된코드인데
        그냥  구석에 처박혀 세월보내는것 같아서 이렇게 간단히 문서화하기로 했습니다.
        
        이 라어버리의 애니메이션은 보통 jquery나 animation.js에서 사용하는 dom속성을
        JAVASCRIPT로 콘트롤하는 방식과 달리 , 동적으로 css를 생성하고 animation을 만듭니다.
        CSS는 GPU를 사용하여 렌더링하고 최적화가  다소 되여있기에 performance상에서 효율적입니다.
        
        사실 소스를 들여다 보면 쓸모없거나 로직상에서 이상한 부분들이 많을수 있습니다. 
</pre>
