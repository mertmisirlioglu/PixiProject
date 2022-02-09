import * as PIXI from "pixi.js";
import "./style.css";
import {  ease } from 'pixi-ease'
import { Timer } from "eventemitter3-timer";
import {wordData} from "../assets/data/wordData";

declare const VERSION: string;

const gameWidth = 800;
const gameHeight = 600;

console.log(`Welcome from pixi-typescript-boilerplate ${VERSION}`);

const app = new PIXI.Application({
    backgroundColor: 0xd3d3d3,
    width: gameWidth,
    height: gameHeight,
});

//create timer
const timer = new Timer(1000); // in ms
timer.on("end", () => {
    console.log("Timer ended.");
});
timer.start();

//increment timer in ticker loop
app.ticker.add(() => Timer.timerManager.update(app.ticker.elapsedMS), this);

window.onload = async (): Promise<void> => {
    await loadGameAssets();

    document.body.appendChild(app.view);

    CreateUI();
    // resizeCanvas();


    app.stage.interactive = true;
};

async function loadGameAssets(): Promise<void> {
    return new Promise((res, rej) => {
        const loader = PIXI.Loader.shared;
        loader.add("rabbit", "./assets/simpleSpriteSheet.json");
        loader.add("pixie", "./assets/spine-assets/pixie.json");

        loader.onComplete.once(() => {
            res();
        });

        loader.onError.once(() => {
            rej();
        });

        loader.load();
    });
}

function resizeCanvas(): void {
    const resize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        app.stage.scale.x = window.innerWidth / gameWidth;
        app.stage.scale.y = window.innerHeight / gameHeight;
    };

    resize();

    window.addEventListener("resize", resize);
}

let cardCount = 0;

function CreateUI(){
    const background = PIXI.Sprite.from('/assets/images/background.png');
    app.stage.addChild(background);

    /* Buttons */
    const firstButton = AddButton(app.renderer.width / 2 , app.renderer.height / 3, 'blue', 'Mini Task 1');
    firstButton.on("pointerdown", function (){
        app.stage.removeChildren()
        app.stage.addChild(background);
        CreateFirstTask()
    })

    const secondButton = AddButton(app.renderer.width / 2 , firstButton.y + firstButton.height * 5 / 4, 'green', 'Mini Task 2');
    secondButton.on("pointerdown", function (){
        app.stage.removeChildren()
        app.stage.addChild(background);
        CreateSecondTask()
    })

    const thirdButton = AddButton(app.renderer.width / 2 , secondButton.y + firstButton.height * 5/4 , 'orange', 'Mini Task 3');
    thirdButton.on("pointerdown", function (){
        app.stage.removeChildren()
    })
}

function AddButton(x: number,y: number,color: string, message: string): any {
    const button = PIXI.Sprite.from(`/assets/images/button/${color}_large_button.png`);
    button.anchor.set(0.5);
    button.x = x;
    button.y = y;
    button.interactive = true;
    button.buttonMode = true;
    button.width = 400;
    button.height = 70;
    app.stage.addChild(button);

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

function CreateFirstTask(){
    // if you want to start again this task card count has to be reset
    cardCount = 0

    const deckContainerStart = new PIXI.Container();

    // We have 52 cards in one deck so we have to work that function 3 times.
    for (let i = 0; i < 3; i++) {
        AddCartsToDeck(deckContainerStart)
    }
    app.stage.addChild(deckContainerStart)

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
        const turnBack = AddButton(app.renderer.width / 2 , app.renderer.height * 5 / 6, 'blue', 'Do you wanna come back ?');
        turnBack.on("pointerdown", function (){
            app.stage.removeChildren()
            deckContainerStart.destroy()
            CreateUI()
        })
    });
    timer.on('repeat', () => {
        const nextCard = deckContainerStart.getChildAt(i)
        ease.add(nextCard, {x: last.x - i++ * 3 , y: 250 } , { reverse: false, duration: 2000, ease: 'easeInOutQuad' })
    });

    timer.start();
}

function AddCartsToDeck(deckContainer: PIXI.Container){
    for (let i = 0; i < 13; i++) {
        AddSingleCard(deckContainer,'clover',i+1)
        AddSingleCard(deckContainer,'diamond',i+1)
        AddSingleCard(deckContainer,'heart',i+1)
        AddSingleCard(deckContainer,'spade',i+1)
    }
}

function AddSingleCard(deckContainer: PIXI.Container, type: string, order: number){
    if (cardCount >= 144) return;
    const card = PIXI.Sprite.from(`/assets/images/task-1/${type}/card_${order}_${type}.png`);
    card.x = 150 + cardCount++ * 3;
    card.y = 100
    deckContainer.addChild(card);
}

/* FIRST TASK */


/* SECOND TASK */

function CreateSecondTask(){
    let obj1: any,obj2: any,obj3: any;

    const timer = new Timer(2000);
    timer.loop = true;

    timer.on('start', () => console.log('delay for start'));
    timer.on('repeat', () => {
        obj1 = CreateRandomObject(1, obj1);
        obj2 = CreateRandomObject(2, obj2);
        obj3 = CreateRandomObject(3, obj3);
    });
    timer.start();

    const turnBack = AddButton(app.renderer.width / 2 , app.renderer.height * 5 / 6, 'blue', 'Do you wanna come back ?');
    turnBack.on("pointerdown", function (){
        app.stage.removeChildren()
        timer.stop();
        CreateUI()
    })
}

function CreateRandomObject(order: number, object: any): any{
    if (object) object.destroy();
    const isImage = Math.random() > 0.5;

    if (isImage){
        const random = Math.floor(Math.random() * 82);
        const randomScale = Math.floor(Math.random() * 10) + 10 ;
        const image = PIXI.Sprite.from(`/assets/images/task-2/EmojisActivity-${random}.png`);
        image.width *= randomScale;
        image.height *= randomScale;
        app.stage.addChild(OrderLocation(image,order))
        return image
    } else {
        const randomText = Math.floor(Math.random() * wordData.length);
        const randomFont = Math.floor(Math.random() * 24) + 24; // It gives us a number between 16-48
        const text = new PIXI.Text(wordData[randomText],{fontFamily : 'Arial', fontSize: randomFont, fill : 'black'});
        app.stage.addChild(OrderLocation(text,order))
        return text
    }
}

function OrderLocation(obj: any, order: number){
    obj.anchor.set(0.5);
    obj.y = app.renderer.height / 2;
    obj.x = app.renderer.width / 2
    if (order == 1) obj.x = app.renderer.width / 4;
    if (order == 3) obj.x = app.renderer.width * 3 / 4;
    return obj;
}

/* SECOND TASK */

