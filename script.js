const X = 20;
const Y = 20;
const SIZE = 20;
let canvas = document.getElementById("somcanvas");
let context = canvas.getContext("2d");
const tElement = document.getElementById("step");
const lrElement = document.getElementById("lr");
const nElement = document.getElementById("neighbor");
let intervalElement;
let intervalElement2;
const neighborElement = document.getElementById("neighbornum");
let neighbor = Number(neighborElement.value);
const LElement = document.getElementById("size");
const input_sizeElement = document.getElementById("input_size");
const input_indexElement = document.getElementById("input_index");
let input_index = Number(input_indexElement.value) - 1;
const RElement = document.getElementById("R");
const GElement = document.getElementById("G");
const BElement = document.getElementById("B");
const testRElement = document.getElementById("testR");
const testGElement = document.getElementById("testG");
const testBElement = document.getElementById("testB");
const resultElement = document.getElementById("result");
const accuracyElement = document.getElementById("accuracy");
const testN = 1000;
const COLOR_X = X+SIZE*(Number(LElement.max)+3);

// パラメータ
let input_size = Number(input_sizeElement.value);
let L = Number(LElement.value);
let N = L*L;

// 並べ替える色（入力）
let COLOR;
initCOLOR();
// パネル
let panel;
initPanels();
// テスト
let test;
initTest();

// 時変パラメータ
let t = 0;
let count = 0;
let learningRate = 1;
initTimeParams();

RElement.value = COLOR[input_index].r;
GElement.value = COLOR[input_index].g;
BElement.value = COLOR[input_index].b;

paintAllPanels();
do_test();

// 時変パラメータの初期化
function initTimeParams(){
    t = 0;
    learningRate = 1;
    input_index = 0;
    tElement.innerHTML = t;
    lrElement.innerHTML = learningRate;
    nElement.innerHTML = neighbor;
}

// パネルの初期化
function initPanels(){
    panel = [{
        "x":X,
        "y":Y,
        "r":Math.random()*255,
        "g":Math.random()*255,
        "b":Math.random()*255
    }];
    for(let i=1;i<N;i++){
        panel.push({
            "x":X+(Math.floor(i/L))*SIZE,
            "y":Y+(i%L)*SIZE,
            "r":Math.random()*255,
            "g":Math.random()*255,
            "b":Math.random()*255
        });
    }
}

// 入力の初期化
function initCOLOR(){
    COLOR = [{
            "name":1,
            "nearest":0,
            "x":COLOR_X,
            "y":Y,
            "r":Math.round(Math.random()*255),
            "g":Math.round(Math.random()*255),
            "b":Math.round(Math.random()*255),
        },
    ];
    for(let i=1;i<input_size;i++){
        COLOR.push({
            "name":i+1,
            "nearest":0,
            "x":COLOR_X,
            "y":Y+SIZE*i,
            "r":Math.round(Math.random()*255),
            "g":Math.round(Math.random()*255),
            "b":Math.round(Math.random()*255)
        });
    }
}

// testの初期化
function initTest(){
    test = {
        "x":COLOR_X,
        "y":Y+SIZE*(input_size+1),
        "r":testRElement.value,
        "g":testGElement.value,
        "b":testBElement.value
    };
}

// 1パネルの描画
function paintPanel(panelObj){
    context.fillStyle = "rgb("+panelObj.r+","+panelObj.g+","+panelObj.b+")";
    context.fillRect(panelObj.x,panelObj.y,SIZE-4,SIZE-4);
}

// 1パネルの境界線描画
function paintBorder(panelObj,color="black"){
    context.strokeStyle = color;
    context.strokeRect(panelObj.x-2,panelObj.y-2,SIZE,SIZE);
}

// 全パネルの描画
function paintAllPanels(){
    // 全消去
    context.clearRect(0,0,1000,800);
    // パネルの描画
    for(let i=0;i<N;i++){
        paintPanel(panel[i]);
    }
    for(let i=0;i<input_size;i++){
        // 入力パネルの描画
        paintPanel(COLOR[i]);
        paintBorder(COLOR[i],"rgb("+COLOR[i].r+","+COLOR[i].g+","+COLOR[i].b+")")
        context.font = "12pt 'メイリオ'";
        context.fillStyle = "black";
        context.fillText(COLOR[i].name,COLOR[i].x-SIZE*1.5,COLOR[i].y+SIZE-5);
        // 各クラスタの中心ベクトルnearestの描画
        let nearest = dist3Dmin(COLOR[i],panel);
        COLOR[i].nearest = nearest;
        context.font = "12pt 'メイリオ'";
        if(panel[nearest].r+panel[nearest].g+panel[nearest].b<383){
            context.fillStyle = "white";
            context.fillText(COLOR[i].name,panel[nearest].x,panel[nearest].y+SIZE-5);
        }
        else{
            context.fillStyle = "black";
            context.fillText(COLOR[i].name,panel[nearest].x,panel[nearest].y+SIZE-5);
        }
    }
    // テストパネルの描画
    paintPanel(test);
    paintBorder(test,"rgb("+test.r+","+test.g+","+test.b+")");
    context.fillStyle = "black";
    context.fillText("Input",COLOR[0].x+SIZE*2,COLOR[input_index].y+SIZE-4);
    context.fillText("Test",test.x+SIZE*2,test.y+SIZE-4);
}

// 2次元距離の計算
function dist2D(panelObj1,panelObj2){
    return Math.sqrt(
        Math.pow(panelObj1.x-panelObj2.x,2)
        + Math.pow(panelObj1.y-panelObj2.y,2)
    );
}

// 3次元距離の計算
function dist3D(panelObj1,panelObj2){
    return Math.sqrt(
        Math.pow(panelObj1.r-panelObj2.r,2)
        + Math.pow(panelObj1.g-panelObj2.g,2)
        + Math.pow(panelObj1.b-panelObj2.b,2)
    );
}

// 3次元距離が最小の要素
function dist3Dmin(panelObj1,panelObj2){
    let minvalue = dist3D(panelObj1,panelObj2[0]);
    let minindex = 0;
    for(let i=1;i<panelObj2.length;i++){
        let d = dist3D(panelObj1,panelObj2[i]);
        if(d<minvalue){
            minindex = i;
            minvalue = d;
        }
    }
    return minindex;
}

// 近傍関数
function neighborFunc(dist){
    if (dist/SIZE > Math.max(neighbor, 1)){
        return 0;
    }
    else{
        return 1;
    }
}

// Testに近い色の判定
function do_test(){
    let nearest_color = dist3Dmin(test,COLOR);
    let test_like_index = dist3Dmin(test,panel);
    let pred_nearest_color = 0
    let min_dist2D = dist2D(panel[test_like_index],panel[COLOR[pred_nearest_color].nearest]);
    for(let i=1;i<input_size;i++){
        let dist_2D = dist2D(panel[test_like_index],panel[COLOR[i].nearest]);
        if(dist_2D < min_dist2D){
            min_dist2D = dist_2D;
            pred_nearest_color = i;
        }
    }
    paintBorder(panel[test_like_index],"rgb("+test.r+","+test.g+","+test.b+")");
    if(nearest_color==pred_nearest_color){
        resultElement.innerHTML = "Pred : " + COLOR[pred_nearest_color].name + ", Truth : " + COLOR[nearest_color].name + " [ ○ ]";
        return 1;
    }
    else{
        resultElement.innerHTML = "Pred : " + COLOR[pred_nearest_color].name + ", Truth : " + COLOR[nearest_color].name + " [ x ]";
        return 0;
    }
}

// SOM
function som(){
    let minindex = dist3Dmin(COLOR[input_index],panel);
    for(let j=0;j<N;j++){
        let neighborFuncValue = neighborFunc(dist2D(panel[j],panel[minindex]));
        panel[j].r += learningRate * neighborFuncValue * (COLOR[input_index].r-panel[j].r);
        panel[j].g += learningRate * neighborFuncValue * (COLOR[input_index].g-panel[j].g);
        panel[j].b += learningRate * neighborFuncValue * (COLOR[input_index].b-panel[j].b);
        if(neighborFuncValue==1){
            paintBorder(panel[j]);
        }
    }
    input_indexElement.value = input_index;
    RElement.value = COLOR[input_index].r;
    GElement.value = COLOR[input_index].g;
    BElement.value = COLOR[input_index].b;
    paintAllPanels();
    for(let j=0;j<N;j++){
        let neighborFuncValue = neighborFunc(dist2D(panel[j],panel[minindex]));
        if(neighborFuncValue==1){
            paintBorder(panel[j]);
        }
    }
    do_test();
    
    input_index++;
    if(input_index >= input_size){
        t++;
        input_index = 0
        if(t%100==0){
            clearInterval(intervalElement);
            paintAllPanels();
            do_test();
        }
        tElement.innerHTML = t;
        learningRate = 1 / t
        lrElement.innerHTML = Math.round(learningRate*1000000)/1000000;
        neighbor = neighbor-0.5;
        nElement.innerHTML = Math.max(neighbor, 1);
    }
}

// 正解率の計算
function accuracy(){
    test.r = Math.round(Math.random()*255);
    test.g = Math.round(Math.random()*255);
    test.b = Math.round(Math.random()*255);
    testRElement.innerHTML = test.r;
    testGElement.innerHTML = test.g;
    testBElement.innerHTML = test.b;
    paintAllPanels();
    count += do_test();
    accuracyElement.innerHTML = count/testN*100 + "%";
}

// L(panel_size)が変更された時
LElement.addEventListener("change",function(){
    // 値の更新
    L = Number(LElement.value);
    N = L*L;
    initTimeParams();
    panel = [{
        "x":X,
        "y":Y,
        "r":Math.random()*255,
        "g":Math.random()*255,
        "b":Math.random()*255
    }];
    for(let i=1;i<N;i++){
        panel.push({
            "x":X+(Math.floor(i/L))*SIZE,
            "y":Y+(i%L)*SIZE,
            "r":Math.random()*255,
            "g":Math.random()*255,
            "b":Math.random()*255
        });
    }
    paintAllPanels();
},false);

// input_indexが変更された時
input_indexElement.addEventListener("change",function(){
    input_index = Number(input_indexElement.value)- 1;
    RElement.value = COLOR[input_index].r;
    GElement.value = COLOR[input_index].g;
    BElement.value = COLOR[input_index].b;
},false);

// inputのRが変更された時
RElement.addEventListener("change",function(){
    COLOR[input_index].r = RElement.value;
    paintPanel(COLOR[input_index]);
},false);

// inputのGが変更された時
GElement.addEventListener("change",function(){
    COLOR[input_index].g = GElement.value;
    paintPanel(COLOR[input_index]);
},false);

// input_sizeが変更された時
input_sizeElement.addEventListener("change",function(){
    // 値の更新
    input_size = Number(input_sizeElement.value);
    initTimeParams();
    if(input_index+1 > input_size){
        input_index = input_size-1;
        input_indexElement.value = input_index;
        RElement.value = COLOR[input_index].r;
        GElement.value = COLOR[input_index].g;
        BElement.value = COLOR[input_index].b;
    }
    // 入力フォームの最大値を変更
    input_indexElement.max = input_size;
    // input_sizeが小さくなったらCOLORからpop
    if(COLOR.length > input_size){
        while(COLOR.length > input_size){
            COLOR.pop();
        }
    }
    // input_sizeが大きくなったらCOLORにpush
    else if(COLOR.length < input_size){
        while(COLOR.length < input_size){
            COLOR.push({
                "name":COLOR.length+1,
                "nearest":0,
                "x":COLOR_X,
                "y":Y+SIZE*COLOR.length,
                "r":Math.round(Math.random()*255),
                "g":Math.round(Math.random()*255),
                "b":Math.round(Math.random()*255)
            });
        }
    }
    paintAllPanels();
},false);

// neighborが変更された時
neighborElement.addEventListener("change",function(){
    neighbor = Number(neighborElement.value);
},false);


// input_indexが変更された時
input_indexElement.addEventListener("change",function(){
    input_index = Number(input_indexElement.value)- 1;
    RElement.value = COLOR[input_index].r;
    GElement.value = COLOR[input_index].g;
    BElement.value = COLOR[input_index].b;
},false);

// inputのRが変更された時
RElement.addEventListener("change",function(){
    COLOR[input_index].r = RElement.value;
    paintPanel(COLOR[input_index]);
},false);

// inputのGが変更された時
GElement.addEventListener("change",function(){
    COLOR[input_index].g = GElement.value;
    paintPanel(COLOR[input_index]);
},false);

// inputのBが変更された時
BElement.addEventListener("change",function(){
    COLOR[input_index].b = BElement.value;
    paintPanel(COLOR[input_index]);
},false);

// testのRが変更された時
testRElement.addEventListener("change",function(){
    test.r = testRElement.value;
    paintAllPanels();
    do_test();
},false);

// testのGが変更された時
testGElement.addEventListener("change",function(){
    test.g = testGElement.value;
    paintAllPanels();
    do_test();
},false);

// testのBが変更された時
testBElement.addEventListener("change",function(){
    test.b = testBElement.value;
    paintAllPanels();
    do_test();
},false);

const startButtonElement=document.getElementById("startButton");
startButtonElement.addEventListener("click",function(){
    clearInterval(intervalElement);
    intervalElement = setInterval("som()",10);
},false);	

const stopButtonElement=document.getElementById("stopButton");
stopButtonElement.addEventListener("click",function(){
    if(intervalElement){
        clearInterval(intervalElement);
    }
    paintAllPanels();
    
},false);

const nextButtonElement=document.getElementById("nextButton");
nextButtonElement.addEventListener("click",function(){
    som();
},false);

const testButtonElement=document.getElementById("testButton");
testButtonElement.addEventListener("click",function(){
    count = 0;
    clearInterval(intervalElement2);
    intervalElement2 = setInterval("accuracy()",10);
    setTimeout("clearInterval(intervalElement2)",10*testN);
},false);


const resetPanelButtonElement=document.getElementById("resetPanelButton");
resetPanelButtonElement.addEventListener("click",function(){
    if(intervalElement){
        clearInterval(intervalElement);
    }
    L = Number(LElement.value);
    N = L*L;
    neighbor = Number(neighborElement.value);
    input_size = Number(input_sizeElement.value);
    initTimeParams();
    initPanels();
    paintAllPanels();
},false);

const resetButtonElement=document.getElementById("resetButton");
resetButtonElement.addEventListener("click",function(){
    if(intervalElement){
        clearInterval(intervalElement);
    }
    L = Number(LElement.value);
    N = L*L;
    neighbor = Number(neighborElement.value);
    input_size = Number(input_sizeElement.value);
    initTimeParams();
    initPanels();
    initCOLOR();
    initTest();
    paintAllPanels();
},false);
