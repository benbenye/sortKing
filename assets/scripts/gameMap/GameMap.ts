import { _decorator, Component, Node, Enum, BoxColliderComponent, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

enum TARGET {
    OBJECT = 1,
    PAIRS,
    // COLORS = 'colors'
}

Enum(TARGET);

@ccclass('GameMap')
export class GameMap extends Component {
    public static MapGoalType = TARGET;

    @property({
        type: TARGET,
        displayOrder: 1
    })
    type = TARGET.OBJECT;

     @property({
        type: String,
        displayOrder: 2
    })
    targetName: String = ''

     @property({
        type: [String],
        displayOrder: 3,
        visible: function (this: GameMap) { return this.type === TARGET.OBJECT}
    })
    goals: String[] = []

    @property()
    maxProgress: number = 2;
    @property()
    time: number = 10;

    public resetMap() {
        const wall = this.node.getChildByName('container').getChildByName('Wall');
        const wallScale = wall.scale;
        const wallSize = wall.getComponent(BoxColliderComponent).size;
        console.log(wallSize, wallScale)
        this.node.children.forEach(node => {
            console.log(node.name)
            if (node.name === 'container' || node.name === 'SecondaryPlane') return;
            node.active = true;
            const preX = Math.random() > 0.499 ? 1 : -1; 
            const preY = Math.random() > 0.499 ? 1 : -1; 
            const x = Math.random() * wallSize.x * wallScale.x / 2 * preX;
            const z = Math.random() * (wallSize.y * wallScale.y / 2 - 2) * preY
            node.setWorldPosition(new Vec3(x, 10, z))
        })
    }
}