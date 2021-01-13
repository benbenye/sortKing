import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('RunTimeData')
export class RunTimeData {
    static _instance: RunTimeData = null;

    public static instance() {
        if (!this._instance) {
            this._instance = new RunTimeData();
        }
        return this._instance;
    }

    public level = 1;
    public currProgress = 0;
    public maxProgress = 0;
    public time = 150; // 秒
    public targetName = '';
    public isTakeInHoleOver = true;
}
