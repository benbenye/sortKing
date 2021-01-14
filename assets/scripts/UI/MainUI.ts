import { _decorator, Component, Node, UIFlow, LabelComponent, loader, SpriteFrame, instantiate, Sprite, SpriteComponent, SpriteAtlas, Prefab, Vec3 } from 'cc';
import { Constants } from '../data/Constants';
import { RunTimeData } from '../data/GameData';
import { GameMap } from '../gameMap/GameMap';
import { Timer } from '../utils/Timer';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

@ccclass('MainUI')
export class MainUI extends Component {
    private _runTimeData: RunTimeData = null;
    private _listItemBox: Node = null;

    public show() {
        this._runTimeData = RunTimeData.instance();
        this.node.getChildByName('Level-num').getComponent(LabelComponent).string = `LEVEL ${this._runTimeData.level}`;
        this.node.getChildByName('Level-time').getComponent(LabelComponent).string = `${Timer.formatTime(this._runTimeData.time)}`;
        this.node.getChildByName('Level-name').getComponent(LabelComponent).string = `${this._runTimeData.targetName}`;
        if (this._runTimeData.mapInfo.type === GameMap.MapGoalType.OBJECT){
            this._listItemBox = this.node.getChildByName('object-box');
            this.listItem();
        }

    }
    private clickStart() {
        UIManager.showUI(Constants.UI.GAME_UI);
        UIManager.hideUI(Constants.UI.MAIN_UI);
    }

    private listItem() {
        loader.loadRes(`UI/Level-img`, Prefab, (err, prefab) => {
            if(err) {
                console.error(err)
                return
            }
            this.node.addChild(this._listItemBox);
            const goalsLength = this._runTimeData.mapInfo.goals.length;
            this._runTimeData.mapInfo.goals.map((item: string, index: number)=> {
                let num = '1';
                let name = item;
                if (item.match(/\*/)) {
                    const matchRes = item.match(/(.*)\*(.*)/)
                    name = matchRes[1];
                    num = matchRes[2];
                }
                const url =  `textures/${name}/spriteFrame`
                loader.loadRes(url, SpriteFrame, (err, asset) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    const goalItemNode = instantiate(prefab) as Node;
                    const w = new Node(name);
                    const sprite = w.addComponent(SpriteComponent)
                    sprite.spriteFrame = asset;

                    goalItemNode.setWorldPosition(new Vec3(Math.floor(index % goalsLength)* 280, Math.floor(index / goalsLength) * -280, 0));
                    goalItemNode.addChild(w);
                    goalItemNode.getChildByName('num-bg').getChildByName('num').getComponent(LabelComponent).string = num;
                    this._listItemBox.addChild(goalItemNode)
                });
            });
        })
    }
}
