import { RoomBase, Types, IRoomConfigObject, IPlayerService, IChatMessageInterceptorFactoryType, IChatMessageParser } from "inversihax";
import { InversihaxPlayer } from "./Models/InversihaxPlayer";
import { inject } from "inversify";

/**
 * Our room class. For simplicity, we derive from the RoomBase, as recommended.
 */
export class InversihaxRoom extends RoomBase<InversihaxPlayer> {

    // The private variable which we can modify to keep track of the game state
    private mIsGameInProgress: boolean = false;

    // The public property that keeps track of the game state
    public get isGameInProgress(): boolean {
        return this.mIsGameInProgress;
    }

    /**
     * We need to require the following parameters as the base room expects them.
     * @param roomConfig The (base Headless API) room configuration object.
     * @param playerService The player service.
     * @param chatMessageInterceptorFactory The factory that creates chat message interceptors. Just require it here and pass
     * it to the base class, as it is used internally.
     * @param chatMessageParser The parser for chat messages.
     */
    public constructor(
        @inject(Types.IRoomConfigObject) roomConfig: IRoomConfigObject,
        @inject(Types.IPlayerService) playerService: IPlayerService<InversihaxPlayer>,
        @inject(Types.IChatMessageInterceptorFactory) chatMessageInterceptorFactory: IChatMessageInterceptorFactoryType,
        @inject(Types.IChatMessageParser) chatMessageParser: IChatMessageParser,
    ) {
        super(roomConfig, playerService, chatMessageInterceptorFactory, chatMessageParser);

        // Change the is game in progress property based on event
        this.onGameStart.addHandler((byPlayer) => this.mIsGameInProgress = true);
        this.onGameStop.addHandler((byPlayer) => this.mIsGameInProgress = false);
        this.onGamePause.addHandler((byPlayer) => this.mIsGameInProgress = false);
        this.onGameUnpause.addHandler((byPlayer) => this.mIsGameInProgress = true);
    }
}