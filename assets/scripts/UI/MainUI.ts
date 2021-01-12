import { _decorator, Component, Node, UIFlow } from 'cc';
import { Constants } from '../data/Constants';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

@ccclass('MainUI')
export class MainUI extends Component {
    private clickStart() {
        UIManager.showUI(Constants.UI.GAME_UI);
        UIManager.hideUI(Constants.UI.MAIN_UI);
    }
}
