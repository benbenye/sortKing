import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Timer')
export class Timer {
    public static formatTime(time: number) {
        let min = `${Math.floor(time / 60)}`;
        let second = `${Math.floor(time % 60)}`;

        if (+min <= -1 || +second <= -1) return `00:00`;

        +min < 10 && (min = `0${min}`);
        +second < 10 && (second = `0${second}`);

        return `${min}:${second}`
    }
}
