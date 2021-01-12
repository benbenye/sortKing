import { _decorator, Component, Node, UIFlow, LabelComponent } from 'cc';
import { Constants } from '../data/Constants';
import { RunTimeData } from '../data/GameData';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

@ccclass('GameUI')
export class GameUI extends Component {
    private _runTimeData: RunTimeData = null;
    private countDown: LabelComponent = null;

    public show() {
        this._runTimeData = RunTimeData.instance();
        console.log(this._runTimeData)
        this.countDown = this.node.getChildByName('topBar').getChildByName('Level-countdown').getComponent(LabelComponent);
        this.countDown.string = `${this.formatTime()}`
    }

    update(dt) {
        this._runTimeData.time -= dt;
        this.countDown.string = `${this.formatTime()}`
    }

    formatTime() {
        let min = `${Math.floor(this._runTimeData.time / 60)}`;
        let second = `${Math.floor(this._runTimeData.time % 60)}`;

        if (+min <= -1 || +second <= -1) return `00:00`;

        +min < 10 && (min = `0${min}`);
        +second < 10 && (second = `0${second}`);

        return `${min}:${second}`
    }
}
