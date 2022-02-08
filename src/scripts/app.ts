// app.ts

import * as PIXI from 'pixi.js'
// const tweenManager = require('pixi-tween');

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

const sceneContainer = new PIXI.Container();

// engine.ticker.add(function() {
//     PIXI.tweenManager.update();
// });

window.onload = load;

function load() {
    create();
} // load

function create() {
    const background = PIXI.Sprite.from('images/background.png');
    engine.stage.addChild(background);
    engine.stage.addChild(sceneContainer);


    /* Buttons */
    const firstButton = addButton(engine.renderer.width / 2 , engine.renderer.height / 3, 'blue', 1);
    firstButton.on("click", function (){
        sceneContainer.removeChildren()
        createFirstTask()
    })

    const secondButton = addButton(engine.renderer.width / 2 , firstButton.y + firstButton.height * 5 / 4, 'green', 2);
    secondButton.on("click", function (){
        sceneContainer.removeChildren()
    })

    const thirdButton = addButton(engine.renderer.width / 2 , secondButton.y + firstButton.height * 5/4 , 'orange', 3);
    thirdButton.on("click", function (){
        sceneContainer.removeChildren()
    })

    /* FPS */
    const fpsMeterItem = document.createElement('div');
    fpsMeterItem.classList.add('fps');
    engine.container.appendChild(fpsMeterItem);

    fpsMeter = new FpsMeter(() => {
        fpsMeterItem.innerHTML = 'FPS: ' + fpsMeter.getFrameRate().toFixed(2).toString();
    });

    setInterval(update, 1000.0 / engine.fpsMax);
    render();
} // create

function addButton(x: number,y: number,color: string, order: number): any {
    const button = PIXI.Sprite.from(`images/button/${color}_large_button.png`);
    button.anchor.set(0.5);
    button.x = x;
    button.y = y;
    button.interactive = true;
    button.buttonMode = true;
    button.width = 400;
    button.height = 70;
    sceneContainer.addChild(button);

    button.on("mouseover", function () {
        button.alpha = 0.7
    });

    button.on("mouseout", function () {
        button.alpha = 1.0
    });

    const text = new PIXI.Text(`Mini task ${order}`,{fontFamily : 'Arial', fontSize: 32, fill : 'black'});
    text.anchor.set(0.5)
    button.addChild(text)
    return button;
}

function createFirstTask(){
    const deckContainerStart = new PIXI.Container();

    // We have 52 cards in one deck so we have to work that function 3 times.
    for (let i = 0; i < 3; i++) {
        addCartsToDeck(deckContainerStart)
    }

    sceneContainer.addChild(deckContainerStart)

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
