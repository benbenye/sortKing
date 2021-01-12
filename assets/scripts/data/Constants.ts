import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

enum UI {
    MAIN_UI = 'mainUI',
    GAME_UI = 'gameUI',
    PAUSE_UI = 'pauseUI',
    GAME_OVER_UI = 'gameOverUI'
}

enum EventName {
    GAME_START = 'game_start'
}

@ccclass('Constants')
export class Constants {
    public static UI = UI;
    public static EventName = EventName;
}
