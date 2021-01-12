import { _decorator, Component, Node, systemEvent, SystemEvent, Camera, find, Vec3, PhysicsSystem, TERRAIN_HEIGHT_BASE, CanvasComponent, ColliderComponent, BoxColliderComponent, Label, tween, Tween, ParticleSystemComponent, Prefab, instantiate, ParticleUtils, ParticleSystem } from 'cc';
import { Constants } from './data/Constants';
import { RunTimeData } from './data/GameData';
import { UIManager } from './UI/UIManager';
import { CustomEventListener } from './utils/CustomEventListener';
const { ccclass, property } = _decorator;

enum STATE {
    IDLE = 1,
    START,
    MOVE,
    ON_COLLISION,
    DROP
}

enum GameState {
    INIT = 1,
    PLAYING,
    OVER
}

enum modelGroup {
    SECONDARY = 1 << 0,
    OTHER_MODEL = 1 << 1
}

enum mask {
    FOR_NONE = 0
}
@ccclass('GameCtrl')
export class GameCtrl extends Component {
    private Sphere: Node = null;
    private Cube: Node = null;
    private Capsule: Node = null;
    private Torus: Node = null;
    private Cone: Node = null;
    private Cylinder:Node = null;
    private SecondaryPlane:Node = null;
    @property(Node)
    private Hole:Node = null;
    @property(Label)
    private Score:Label = null;
    @property(Camera)
    private camera: Camera = null;
    @property(Prefab)
    private gas: Prefab = null;
    private state: number = STATE.IDLE;
    private screenPos = null;
    private targetModel: Node = null;
    private targetModelTween: Tween = null;
    private _gas = null;
    private _runTimeData: RunTimeData = null;
    
    start () {
        this.Sphere = this.node.getChildByName('Sphere');
        this.Cube = this.node.getChildByName('Cube');
        this.Capsule = this.node.getChildByName('Capsule');
        this.Torus = this.node.getChildByName('Torus');
        this.Cone = this.node.getChildByName('Cone');
        this.Cylinder = this.node.getChildByName('Cylinder');
        this.SecondaryPlane = this.node.getChildByName('SecondaryPlane'); // 辅助器，用于移动3d目标检测碰撞使用
        this.SecondaryPlane.active = false;
        this.state = STATE.IDLE;
        // this.Sphere.setWorldPosition(new Vec3(0, 2, 8.522))
        this.gameStart();
        systemEvent.on(SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
        systemEvent.on(SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
        systemEvent.on(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
        systemEvent.on(SystemEvent.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        CustomEventListener.on(Constants.EventName.GAME_START, this.gameStart, this)
    }

    update() {
        if (this._runTimeData.time <= 0) {
            this.gameFail();
            return;
        }
    }

    private lookAtTarget() {
        if (!this.screenPos) return;
        const ray = this.camera.screenPointToRay(this.screenPos.x, this.screenPos.y);
        if(PhysicsSystem.instance.raycastClosest(ray)) {
            let nodeName = PhysicsSystem.instance.raycastClosestResult.collider.node.name
            console.log(nodeName)
            if (nodeName.match('Wall')) {
                return;
            }
            if (nodeName === 'hole-node') {
                if(!this.targetModel) return;
                nodeName = this.targetModel.name
            }
            const hitPoint = PhysicsSystem.instance.raycastClosestResult.hitPoint;
            hitPoint.y = this[nodeName].getWorldPosition().y
            this.SecondaryPlane.setWorldPosition(new Vec3(0, hitPoint.y, 0));

            if(this.targetModel) {
                this.targetModel.setWorldPosition(hitPoint);
                return;
            }
            this[nodeName].setWorldPosition(hitPoint);
            this.targetModel = this[nodeName];
        }

        // 为什么在移动过程中，节点会越来越近？
        // A: 因为每次的hitpoint都是3d模型的顶部，如果不对Y进行保持，那么Y会越来越靠近人眼

        // 我是如何解决直接操控3d model随手指运动的，
        /*
        1: 通过屏幕坐标获得一个从世界相机发出的射线
        2：射线碰撞到的model为手指想要控制的model
        3：保存下这个model
        4：之后设置一个虚拟的碰撞盒，手指移动产生的新射线只和这个碰撞盒进行检测
        5：将碰撞点设置到上一步保存下来的碰撞model
        可以解决手机快速移动会有model掉落的问题
        */
    }

    private distanceHole() {
        if (!this.targetModel) return;
        const distance = Vec3.distance(this.targetModel.worldPosition, this.Hole.worldPosition)
        if(distance < 3.5) {
            this.takeInTheHole();
        }
    }

    private takeInTheHole() {
        if (!this.targetModel || this.state === STATE.ON_COLLISION) return;
        this.state = STATE.ON_COLLISION;
        console.log('take')
        tween(this.targetModel).to(0.3, {
            worldPosition: new Vec3(0, 1, 8.225),
            eulerAngles: new Vec3(0, 0, 0)
        }).call(() => {
            // this.targetModel.lookAt(new Vec3(0, 5, 8.225));
        }).start();
        this.SecondaryPlane.setWorldPosition(new Vec3(0, 0, 0));
        this.SecondaryPlane.active = false;
        this.scheduleOnce(() => {
            systemEvent.emit(SystemEvent.EventType.TOUCH_CANCEL)
            this.targetModel.active = false;
            // this.node.removeChild(this.targetModel);
            this.showGas();
            this.screenPos = null;
            this.targetModel = null;
            this._runTimeData.currProgress += 1;
            this.Score.string = `收集：${this._runTimeData.currProgress}`;
            if (this._runTimeData.currProgress >= 3) {
                // this.gameSuccess();
                this.gameFail();
            }
        }, 1)

    }

    private showGas() {
        if(!this._gas){
            const gas = instantiate(this.gas) as Node;
            gas.setParent(this.Hole);
            this._gas = gas.getComponent(ParticleSystem);
        }

        this._gas!.play();
    }

    private onTouchStart(e) {
        console.log(this.state)
        if (this.state !== STATE.IDLE) return;
        this.state = STATE.START;
        this.screenPos = e.getLocation();
        this.lookAtTarget()
        if (this.targetModel)
            this.targetModelTween = tween(this.targetModel)
            .by(0.5, { eulerAngles: new Vec3(0, 10, 0) })
            .repeatForever()
            .start();
    }
    private onTouchMove(e) {
        if (this.state !== STATE.START && this.state !== STATE.MOVE) return;
        this.state = STATE.MOVE;
        this.screenPos = e.getLocation();
        if (!this.SecondaryPlane.active)
            this.SecondaryPlane.active = true;
        this.lookAtTarget();
        this.distanceHole();
    }
    private onTouchEnd() {
        if(this.state !== STATE.MOVE) return;

        this.state = STATE.DROP;
        this.screenPos = null;
        this.targetModel = null;
        this.SecondaryPlane.setWorldPosition(new Vec3(0, 0, 0));
        this.SecondaryPlane.active = false;
        this.scheduleOnce(() => {
            this.state = STATE.IDLE;
            this.clearTween();
        }, 1)
    }
    private onTouchCancel() {
        this.state = STATE.IDLE;
            this.clearTween();
    }

    private clearTween() {
        if(this.targetModelTween)
            this.targetModelTween.stop();
            this.targetModelTween = null;
    }

    private initGameData() {
        this._runTimeData = RunTimeData.instance();
        this._runTimeData.maxProgress = 5;
        this._runTimeData.currProgress = 0;
        this._runTimeData.time = 3;
        this._runTimeData.isTakeInHoleOver = true;
    }

    private initMap() {
        this.Sphere.active = true;
        this.Cube.active = true;
        this.Capsule.active = true;
        this.Torus.active = true;
        this.Cone.active = true;
        this.Cylinder.active = true;
    }

    public gameStart() {
        this.initGameData();
        this.initMap();
        UIManager.showUI(Constants.UI.MAIN_UI);
        UIManager.hideUI(Constants.UI.GAME_OVER_UI);
    }
    
    private gameSuccess() {
        UIManager.showUI(Constants.UI.GAME_OVER_UI, () => {}, {status: true});
        UIManager.hideUI(Constants.UI.GAME_UI);
    }
    private gameFail() {
        UIManager.showUI(Constants.UI.GAME_OVER_UI, () => {}, {status: false});
        UIManager.hideUI(Constants.UI.GAME_UI);
    }
}
