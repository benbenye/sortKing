import { _decorator, Component, Node, UIFlow, LabelComponent, ProgressBarComponent } from 'cc';
import { Constants } from '../data/Constants';
import { RunTimeData } from '../data/GameData';
import { CustomEventListener } from '../utils/CustomEventListener';
import { Timer } from '../utils/Timer';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

@ccclass('GameUI')
export class GameUI extends Component {
    private _runTimeData: RunTimeData = null;
    private countDown: LabelComponent = null;
    private progressBar: ProgressBarComponent = null;

    public show() {
        this._runTimeData = RunTimeData.instance();
        console.log(this._runTimeData)
        this.countDown = this.node.getChildByName('topBar').getChildByName('Level-countdown').getComponent(LabelComponent);
        this.countDown.string = `${Timer.formatTime(this._runTimeData.time)}`
        this.progressBar = this.node.getChildByName('topBar').getChildByName('ProgressBar').getComponent(ProgressBarComponent);
        this.progressBar.progress = 0;
        CustomEventListener.dispatchEvent(Constants.GameState.PLAYING)
        CustomEventListener.on(Constants.EventName.UPDATE_PROGRESS, this.updateProgress, this)
    }

    update(dt) {
        this._runTimeData.time -= dt;
        this.countDown.string = `${Timer.formatTime(this._runTimeData.time)}`
        if (this._runTimeData.time <= 0) {
            CustomEventListener.dispatchEvent(Constants.GameState.OVER)
        }
    }

    private updateProgress() {
        const rate = this._runTimeData.currProgress / this._runTimeData.maxProgress;
        this.progressBar.progress = rate;
    }
}
