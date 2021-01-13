import { _decorator, Component, Node, JsonAsset, Prefab, Vec3, instantiate, loader, find } from "cc";
import { CustomEventListener } from "../utils/CustomEventListener";
import { MapRes } from "../utils/MapRes";
import { PoolManager } from "../utils/PoolManager";
const { ccclass, property } = _decorator;

type DicPrefab = { [name: string]: Prefab };

@ccclass("MapManager")
export class MapManager extends Component {
    static _dictMaps = new Map<string, Node>();

    public static showMap(name: string, cb?: Function, ...args: any[]) {
        if (this._dictMaps.has(name)) {
            this.showMapPanel(name, cb, args);
            return;
        }
        const path = `gameMap/${name}`;
        loader.loadRes(path, Prefab, (err: any, prefab: Prefab) => {
            if (err) {
                console.warn(err)
                return;
            }
            const _map = instantiate(prefab) as Node;

            this._dictMaps.set(name, _map);
            this.showMapPanel(name, cb, args)
        });
    }

    private static showMapPanel(name, cb, ...args: any[]) {
        const _map = this._dictMaps.get(name);
        const parent = find('mapManager');
        _map.parent = parent;
        const mapComp = _map.getComponent('GameMap');

        if (mapComp && mapComp['show']) {
            console.log(name)
            mapComp['show'].apply(mapComp, args)
        }
        if (cb) cb(mapComp);
    }
    public static hideMap(name: string, cb?: Function) {
        if (this._dictMaps.has(name)) {
            const panel = this._dictMaps.get(name);
            panel.parent = null;
            const comp = panel.getComponent('GameMap')
            if (comp && comp['hide']) {
                comp['hide'].apply(comp);
            }
            if (cb) {
                cb();
            }
        }
    }
}