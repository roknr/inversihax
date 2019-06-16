import { inject } from "inversify";
import { ChatMessage, IChatMessageParser, IPlayerService, IRoom, Player, RoomBase, Types } from "inversihax";
import { IChatMessageInterceptorFactoryType } from "inversihax/lib/Core/Utility/Types";
import { IRoomConfigObject, IRoomObject } from "types-haxball-headless-api";

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
        @inject(Types.IPlayerService) PlayerService: IPlayerService<Player>,
        @inject(Types.IChatMessageInterceptorFactory) chatMessageInterceptorFactory: IChatMessageInterceptorFactoryType,
        @inject(Types.IChatMessageParser) chatMessageParser: IChatMessageParser<ChatMessage<Player>>,
    ) {
        super(roomConfig, PlayerService, chatMessageInterceptorFactory, chatMessageParser);

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
    protected initialize(): IRoomObject {
        return {
            startGame: () => { this.onGameStart.invoke(null); },
            pauseGame: () => { this.onGamePause.invoke(null); },
            stopGame: () => { this.onGameStop.invoke(null); },
        } as any;
    }
}