import { inject, Container } from "inversify";
import { IRoomConfigObject, IRoomObject } from "types-haxball-headless-api";
import { IPlayerManager, IRoom, Player, RoomBase, Types } from "types-haxframework";

/**
 * Custom IRoom interface.
 */
export interface ICustomTestRoom extends IRoom<Player> {
    isGameInProgress: boolean;
}

/**
 * Custom room that implements a custom IRoom interface.
 */
export class CustomTestRoom extends RoomBase<Player> implements ICustomTestRoom {

    private mIsGameInProgress: boolean = false;

    public get isGameInProgress(): boolean {
        return this.mIsGameInProgress;
    }

    public constructor(
        @inject(Types.IRoomConfigObject) roomConfig: IRoomConfigObject,
        @inject(Types.IPlayerManager) playerManager: IPlayerManager<Player>,
        @inject(Types.Container) container: Container,
    ) {
        super(roomConfig, playerManager, container);

        this.onGameStart.addHandler((byPlayer) => {
            this.mIsGameInProgress = true;
        });
        this.onGameStop.addHandler((byPlayer) => {
            this.mIsGameInProgress = false;
        });
        this.onGamePause.addHandler((byPlayer) => {
            this.mIsGameInProgress = false;
        });
    }

    /**
     * Override for the initialize room method, so that we can use a mock room object, since HBInit only exists in the browser.
     */
    protected initializeRoom(): IRoomObject {
        return {
            startGame: () => { this.onGameStart.invoke(null); },
            pauseGame: () => { this.onGamePause.invoke(null); },
            stopGame: () => { this.onGameStop.invoke(null); },
        } as any;
    }
}