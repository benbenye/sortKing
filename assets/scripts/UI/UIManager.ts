import { _decorator, Node, find, loader, Prefab, instantiate } from 'cc';
const { ccclass } = _decorator;

@ccclass('UIManager')
export class UIManager {
    static _dictPanel = new Map<string, Node>();

    public static showUI(name: string, cb?: Function, ...args: any[]) {
        const scriptName = name.substr(0, 1).toUpperCase() + name.substr(1);
        if (!this._dictPanel.has(scriptName)) {
            const path = `UI/${name}`;
            loader.loadRes(path, Prefab, (err: any, prefab: Prefab) => {
                if (err) {
                    return
                }

                const _panel = instantiate(prefab) as Node;

                this._dictPanel.set(scriptName, _panel);
                this.showPanel(scriptName, cb, args);
            })
            return;
        }
        this.showPanel(scriptName, cb, args);
    }
    private static showPanel(name: string, cb?: Function, ...args: any[]) {
        let parentName = 'Canvas';
        if (args && args[0].parent) {
            parentName = args[0].parent;
        }
        const panel = this._dictPanel.get(name);
        const parent = find(parentName);
        panel.parent = parent;
        const comp = panel.getComponent(name);

        if (comp && comp['show']) {
            console.log(name)
            comp['show'].apply(comp, args);
        }

        if(cb) {
            cb();
        }
    }

    public static hideUI(name: string, cb?: Function) {
        const scriptName = name.substr(0, 1).toUpperCase() + name.substr(1);
        if (this._dictPanel.has(scriptName)) {
            const panel = this._dictPanel.get(scriptName);
            panel.parent = null;
            const comp = panel.getComponent(scriptName)
            if (comp && comp['hide']) {
                comp['hide'].apply(comp);
            }
            if (cb) {
                cb();
            }
        }
    }
}
