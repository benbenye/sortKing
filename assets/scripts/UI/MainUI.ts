import { _decorator, Component, Node, UIFlow, LabelComponent } from 'cc';
import { Constants } from '../data/Constants';
import { RunTimeData } from '../data/GameData';
import { Timer } from '../utils/Timer';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

@ccclass('MainUI')
export class MainUI extends Component {
    private _runTimeData: RunTimeData = null;

    public show() {
        this._runTimeData = RunTimeData.instance();
        this.node.getChildByName('Level-num').getComponent(LabelComponent).string = `LEVEL ${this._runTimeData.level}`;
        this.node.getChildByName('Level-time').getComponent(LabelComponent).string = `${Timer.formatTime(this._runTimeData.time)}`;
        this.node.getChildByName('Level-name').getComponent(LabelComponent).string = `${this._runTimeData.targetName}`;

    }
    private clickStart() {
        UIManager.showUI(Constants.UI.GAME_UI);
        UIManager.hideUI(Constants.UI.MAIN_UI);
    }
}
