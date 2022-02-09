import * as PIXI from "pixi.js";
import "./style.css";
import {  ease } from 'pixi-ease'
import { Timer } from "eventemitter3-timer";
import {wordData} from "../assets/data/wordData";
import * as particles from 'pixi-particles'
import { addStats, Stats } from 'pixi-stats';
import {POLICY, Size, getScaledRect} from 'adaptive-scale/lib';
declare const VERSION: string;
// // @ts-ignore
// window['PIXI'] = PIXI;

const gameWidth = 800;
const gameHeight = 600;

console.log(`Welcome from pixi-typescript-boilerplate ${VERSION}`);

const app = new PIXI.Application({
    backgroundColor: 0xd3d3d3,
    width: gameWidth,
    height: gameHeight,
});

// @ts-ignore
const stats: Stats = addStats(document, app);
app.ticker.add(stats.update, stats);

//increment timer in ticker loop
app.ticker.add(() => Timer.timerManager.update(app.ticker.elapsedMS), this);

window.onload = async (): Promise<void> => {

    document.body.appendChild(app.view);
    resizeCanvas()

    CreateUI();

    app.stage.interactive = true;
};


const background = PIXI.Sprite.from('/assets/images/background.png');

function getScaledRectangle(obj: any){
    let options =   {
        container: new Size(window.innerWidth, window.innerHeight),
        target: new Size(obj.width, obj.height),
        policy: POLICY.ExactFit, // null | ExactFit | NoBorder | FullHeight | FullWidth | ShowAll
    }

    return getScaledRect(options);
}

function resizeCanvas(): void {

    const resize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
    };

    let rect = getScaledRectangle(app.stage)
    app.stage.width = rect.width;
    app.stage.height = rect.height;

    for (let i = 0; i < app.stage.children.length; i++) {
        const obj : any = app.stage.getChildAt(i);
        let rect = getScaledRectangle(obj)
        obj.width = rect.width;
        obj.height = rect.height;
        obj.x = rect.x;
        obj.y = rect.y;
    }

    background.scale.x = window.innerWidth / gameWidth;
    background.scale.y = window.innerHeight / gameHeight;
    resize();
    app.renderer.render(app.stage);


    window.addEventListener("resize", resize);
}

let cardCount = 0;

function CreateUI(){

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
        app.stage.addChild(background);
        CreateThirdTask()
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

    const last: any = deckContainerStart.getChildAt(143)

    timer.on('start', () => console.log('start'));
    timer.on('end', () => {
        console.log('end')
    });
    timer.on('repeat', () => {
        const nextCard = deckContainerStart.getChildAt(i)
        ease.add(nextCard, {x: last.x - (i++ * 4  *  app.renderer.width / gameWidth) , y: last.height * (4 * window.innerHeight/gameHeight) } , { reverse: false, duration: 2000, ease: 'easeInOutQuad' })
    });

    timer.start();

    const turnBack = AddButton(app.renderer.width / 2 , app.renderer.height * 5 / 6, 'blue', 'Go back to menu');
    turnBack.on("pointerdown", function (){
        timer.stop();
        app.stage.removeChildren()
        deckContainerStart.destroy()
        CreateUI()
    });
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
    card.x = app.renderer.width / (30 *gameWidth  / app.renderer.width) + cardCount++ * 4  *  app.renderer.width / gameWidth;
    card.y = app.renderer.height / 4;
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

    const turnBack = AddButton(app.renderer.width / 2 , app.renderer.height * 5 / 6, 'blue', 'Go back to menu.');
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
        const randomScale = (Math.floor(Math.random() * 5) + 10) * app.renderer.width / gameWidth;
        const image = PIXI.Sprite.from(`/assets/images/task-2/EmojisActivity-${random}.png`);
        image.scale.x = randomScale;
        image.scale.y = randomScale;
        app.stage.addChild(OrderLocation(image,order))
        return image
    } else {
        const randomText = Math.floor(Math.random() * wordData.length);
        const randomFont =( Math.floor(Math.random() * 24) + 24) * app.renderer.width / gameWidth; // It gives us a number between 16-48
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


/* THIRD TASK */

let emitter: any;

function CreateEmitter(){
    let particleContainer = new PIXI.ParticleContainer();
    app.stage.addChild(particleContainer)

    emitter = new particles.Emitter(
        particleContainer,
        [PIXI.Texture.from('assets/images/task-3/fire.png'),PIXI.Texture.from('assets/images/task-3/particle.png')],
        {
            alpha: {
                list: [
                    {
                        value: 0.8,
                        time: 0
                    },
                    {
                        value: 0.1,
                        time: 1
                    }
                ],
                isStepped: false
            },
            scale: {
                list: [
                    {
                        value: 1,
                        time: 0
                    },
                    {
                        value: 0.3,
                        time: 1
                    }
                ],
                isStepped: false
            },
            color: {
                list: [
                    {
                        value: "fb1010",
                        time: 0
                    },
                    {
                        value: "f5b830",
                        time: 1
                    }
                ],
                isStepped: false
            },
            speed: {
                list: [
                    {
                        value: 200,
                        time: 0
                    },
                    {
                        value: 100,
                        time: 1
                    }
                ],
                isStepped: false
            },
            startRotation: {
                min: 0,
                max: 360
            },
            rotationSpeed: {
                min: 0,
                max: 0
            },
            lifetime: {
                min: 2,
                max: 5
            },
            frequency: 0.016,
            spawnChance: 100,
            particlesPerWave: 10,
            emitterLifetime: 0.31,
            maxParticles: 1000,
            pos: {
                x: 0,
                y: 0
            },
            addAtBack: true,
            spawnType: "circle",
            spawnCircle: {
                x: 0,
                y: 0,
                r: 10
            }
        }
    );


    let elapsed = Date.now();
    // Update function every frame
    const update = function(){

        // Update the next frame
        requestAnimationFrame(update);

        const now = Date.now();

        // The emitter requires the elapsed
        // number of seconds since the last update
        emitter.update((now - elapsed) * 0.001);

        elapsed = now;
        // Should re-render the PIXI Stage
        app.renderer.render(app.stage);
    };

    update();
}

function CreateThirdTask(){
    CreateEmitter();
    emitter.emit = true;
    emitter.updateOwnerPos(300, 300);
    emitter.autoUpdate = true;

    const playButton = AddButton(app.renderer.width/2, app.renderer.height / 2, 'orange' , 'Play!')
    playButton.width = 200;
    playButton.on('pointerdown', function(){
        emitter.emit = true;
    });

    const turnBack = AddButton(app.renderer.width / 2 , playButton.y + playButton.height* 1.25, 'blue', 'Go back to menu');
    turnBack.width = 200;
    turnBack.on("pointerdown", function (){
        app.stage.removeChildren();
        emitter.destroy();
        CreateUI()
    })
}

