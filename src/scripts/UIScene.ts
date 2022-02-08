export default class UIScene extends PIXI.State {
    public init(): void {
        const header = new PIXI.Text('My Game Studio');
        header.x = 300;
        header.y = 500;
        header.anchor.set(0.5);
        // this.addChild(header);
    }

    public start(): void {
        setTimeout(() => {
            // this.scenes.start('menu');
        }, 5000);
    }

}
