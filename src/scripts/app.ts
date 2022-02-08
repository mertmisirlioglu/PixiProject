// app.ts

import * as PIXI from 'pixi.js'
import { Ease, ease } from 'pixi-ease'
import { Timer, TimerManager } from "eventemitter3-timer";

import { FpsMeter } from './fps-meter';

interface EngineParams {
    containerId: string,
    canvasW: number,
    canvasH: number,
    fpsMax: number
}

class Engine {
    public container: HTMLElement;
    public loader: PIXI.Loader;
    public renderer: PIXI.Renderer;
    public stage: PIXI.Container;
    public graphics: PIXI.Graphics;
    public fpsMax: number;

    constructor(params: EngineParams) {
        this.loader = PIXI.Loader.shared;
        this.renderer = PIXI.autoDetectRenderer({
            width: params.canvasW,
            height: params.canvasH,
            antialias: true,
            backgroundColor: 0xd3d3d3,
        });
        this.stage = new PIXI.Container();
        this.graphics = new PIXI.Graphics();
        this.fpsMax = params.fpsMax;

        this.container = params.containerId ? document.getElementById(params.containerId) || document.body : document.body;
        this.container.appendChild(this.renderer.view);
    } // constructor
} // Engine

const engine: any = new Engine({
    containerId: 'game',
    canvasW: 800,
    canvasH: 450,
    fpsMax: 60
});

let fpsMeter: FpsMeter;
let cardCount = 0;


const ticker = new PIXI.Ticker();
ticker.add(() => {
    engine.renderer.render(engine.stage);
}, PIXI.UPDATE_PRIORITY.LOW);
ticker.start();

//create timer
const timer = new Timer(1000); // in ms
timer.on("end", () => {
    console.log("Timer ended.");
});
timer.start();

//increment timer in ticker loop
ticker.add(() => Timer.timerManager.update(ticker.elapsedMS), this);

window.onload = load;

function load() {
    create();
} // load

function create() {
  createUI();
  setInterval(update, 1000.0 / engine.fpsMax);
  render();
} // create

function createUI(){
    const background = PIXI.Sprite.from('images/background.png');
    engine.stage.addChild(background);

    /* Buttons */
    const firstButton = addButton(engine.renderer.width / 2 , engine.renderer.height / 3, 'blue', 'Mini Task 1');
    firstButton.on("pointerdown", function (){
        engine.stage.removeChildren()
        engine.stage.addChild(background);
        createFirstTask()
    })

    const secondButton = addButton(engine.renderer.width / 2 , firstButton.y + firstButton.height * 5 / 4, 'green', 'Mini Task 2');
    secondButton.on("pointerdown", function (){
        engine.stage.removeChildren()
    })

    const thirdButton = addButton(engine.renderer.width / 2 , secondButton.y + firstButton.height * 5/4 , 'orange', 'Mini Task 3');
    thirdButton.on("pointerdown", function (){
        engine.stage.removeChildren()
    })

    /* FPS */
    const fpsMeterItem = document.createElement('div');
    fpsMeterItem.classList.add('fps');
    engine.container.appendChild(fpsMeterItem);

    fpsMeter = new FpsMeter(() => {
        fpsMeterItem.innerHTML = 'FPS: ' + fpsMeter.getFrameRate().toFixed(2).toString();
    });


}

function addButton(x: number,y: number,color: string, message: string): any {
    const button = PIXI.Sprite.from(`images/button/${color}_large_button.png`);
    button.anchor.set(0.5);
    button.x = x;
    button.y = y;
    button.interactive = true;
    button.buttonMode = true;
    button.width = 400;
    button.height = 70;
    engine.stage.addChild(button);

    button.on("mouseover", function () {
        button.alpha = 0.7
    });

    button.on("mouseout", function () {
        button.alpha = 1.0
    });

    const text = new PIXI.Text(message,{fontFamily : 'Arial', fontSize: 32, fill : 'black'});
    text.anchor.set(0.5)
    button.addChild(text)
    return button;
}

/* FIRST TASK */

function createFirstTask(){
    // if you want to start again this task card count has to be reset
    cardCount = 0

    const deckContainerStart = new PIXI.Container();

    // We have 52 cards in one deck so we have to work that function 3 times.
    for (let i = 0; i < 3; i++) {
        addCartsToDeck(deckContainerStart)
    }
    engine.stage.addChild(deckContainerStart)

    const timer = new Timer(1000);
    timer.on('start', () => console.log('delay for start'));
    timer.on('end', () => StartCartAnimation(deckContainerStart));
    timer.start();
}

function StartCartAnimation(deckContainerStart: PIXI.Container){
    let i = 0

    const timer = new Timer(1000);
    timer.repeat = 144;

    const last = deckContainerStart.getChildAt(143)

    timer.on('start', () => console.log('start'));
    timer.on('end', () => {
        console.log('end')
        const turnBack = addButton(engine.renderer.width / 2 , engine.renderer.height * 5 / 6, 'blue', 'Do you wanna come back ?');
        turnBack.on("pointerdown", function (){
            engine.stage.removeChildren()
            deckContainerStart.destroy()
            createUI()
        })
    });
    timer.on('repeat', () => {
        const nextCard = deckContainerStart.getChildAt(i)
        ease.add(nextCard, {x: last.x - i++ * 3 , y: 250 } , { reverse: false, duration: 2000, ease: 'easeInOutQuad' })
    });

    timer.start();
}

function addCartsToDeck(deckContainer: PIXI.Container){
    for (let i = 0; i < 13; i++) {
        addSingleCard(deckContainer,'clover',i+1)
        addSingleCard(deckContainer,'diamond',i+1)
        addSingleCard(deckContainer,'heart',i+1)
        addSingleCard(deckContainer,'spade',i+1)
    }
}

function addSingleCard(deckContainer: PIXI.Container, type: string, order: number){
    if (cardCount >= 144) return;
    const card = PIXI.Sprite.from(`images/task-1/${type}/card_${order}_${type}.png`);
    card.x = 150 + cardCount++ * 3;
    card.y = 100
    deckContainer.addChild(card);
}

/* FIRST TASK */


function update() {
    fpsMeter.updateTime();

    /* ***************************** */
    /* Update your Game Objects here */
    /* ***************************** */

} // update

function render() {
    requestAnimationFrame(render);

    /* ***************************** */
    /* Render your Game Objects here */
    /* ***************************** */

    /* Sprite */

    engine.renderer.render(engine.stage);
    fpsMeter.tick();
} // render
