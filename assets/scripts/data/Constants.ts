import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

enum UI {
    MAIN_UI = 'mainUI',
    GAME_UI = 'gameUI',
    PAUSE_UI = 'pauseUI',
    GAME_OVER_UI = 'gameOverUI'
}

enum EventName {
    GAME_START = 'game_start',
    GAME_NEXT_START = 'game_next_start',
    UPDATE_PROGRESS = 'update_progress'
}

enum TouchState {
    IDLE = 1,
    START,
    MOVE,
    IN_THE_HOLE,
    DROP
}

enum GameState {
    INIT = 'init',
    PLAYING = 'playing',
    OVER = 'over'
}

enum ModelGroup {
    SECONDARY = 1 << 0,
    OTHER_MODEL = 1 << 1
}

enum mask {
    FOR_NONE = 0
}

@ccclass('Constants')
export class Constants {
    public static UI = UI;
    public static EventName = EventName;
    public static TouchState = TouchState;
    public static GameState = GameState;
}
