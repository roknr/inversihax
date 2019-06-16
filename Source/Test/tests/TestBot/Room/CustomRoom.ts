import { inject } from "inversify";
import { ChatMessage, IChatMessageInterceptorFactoryType, IChatMessageParser, IPlayerService, RoomBase, Types } from "inversihax";
import { IRoomConfigObject } from "../../../../HeadlessAPI/lib";
import { CustomPlayer } from "../Models/CustomPlayer";
import { ICustomRoom } from "./ICustomRoom";

export class CustomRoom extends RoomBase<CustomPlayer> implements ICustomRoom {

    private mIsGameInProgress: boolean = false;

    public get isGameInProgress(): boolean {
        return this.mIsGameInProgress;
    }

    public constructor(
        @inject(Types.IRoomConfigObject) roomConfig: IRoomConfigObject,
        @inject(Types.IPlayerService) playerService: IPlayerService<CustomPlayer>,
        @inject(Types.IChatMessageInterceptorFactory) chatMessageInterceptorFactory: IChatMessageInterceptorFactoryType,
        @inject(Types.IChatMessageParser) chatMessageParser: IChatMessageParser<ChatMessage<CustomPlayer>>,
    ) {
        super(roomConfig, playerService, chatMessageInterceptorFactory, chatMessageParser);

        this.onGameStart.addHandler((byPlayer) => this.mIsGameInProgress = true);
        this.onGameStop.addHandler((byPlayer) => this.mIsGameInProgress = false);
        this.onGamePause.addHandler((byPlayer) => this.mIsGameInProgress = false);
        this.onGameUnpause.addHandler((byPlayer) => this.mIsGameInProgress = true);
    }
}