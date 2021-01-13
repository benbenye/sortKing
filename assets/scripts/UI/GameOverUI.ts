import { _decorator, Component, Node, Label, LabelComponent, Button } from 'cc';
import { Constants } from '../data/Constants';
import { RunTimeData } from '../data/GameData';
import { CustomEventListener } from '../utils/CustomEventListener';
const { ccclass, property } = _decorator;

@ccclass('GameOverUI')
export class GameOverUI extends Component {
    private _runTimeData: RunTimeData = null;
    private statusLabel: LabelComponent = null;
    private nextButton: Node = null;

    public show(args) {
        this._runTimeData = RunTimeData.instance();
        this.statusLabel = this.node.getChildByName('status').getComponent(LabelComponent);

        
        if (args[0].status) {
            // 游戏成功
            this.statusLabel.string = 'COMPLETE';
            this.nextButton = this.node.getChildByName('nextButton');
            this.nextButton.active = true;
            return;
        }

        this.statusLabel.string = 'TIME OUT';
    }

    public hide() {
        if (this.nextButton)
            this.nextButton.active = false;
    }

    public replay() {
        CustomEventListener.dispatchEvent(Constants.EventName.GAME_START)
    }
    public next() {
        CustomEventListener.dispatchEvent(Constants.EventName.GAME_NEXT_START)
    }
}
