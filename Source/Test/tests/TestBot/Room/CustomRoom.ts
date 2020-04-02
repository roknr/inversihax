import { inject } from "inversify";
import { IChatMessageInterceptorFactoryType, IChatMessageParser, IRoomConfigObject, RoomBase, Types }
    from "inversihax";
import { CustomRole } from "../Models/CustomRole";
import { ICustomPlayerMetadataService } from "../Services/ICustomPlayerMetadataService";
import { ICustomRoom } from "./ICustomRoom";

export class CustomRoom extends RoomBase<ICustomPlayerMetadataService> implements ICustomRoom {

    private mIsGameInProgress: boolean = false;

    public get isGameInProgress(): boolean {
        return this.mIsGameInProgress;
    }

    public constructor(
        @inject(Types.IRoomConfigObject) roomConfig: IRoomConfigObject,
        @inject(Types.IPlayerMetadataService) playerMetadataService: ICustomPlayerMetadataService,
        @inject(Types.IChatMessageInterceptorFactory) chatMessageInterceptorFactory: IChatMessageInterceptorFactoryType,
        @inject(Types.IChatMessageParser) chatMessageParser: IChatMessageParser,
    ) {
        super(roomConfig, playerMetadataService, chatMessageInterceptorFactory, chatMessageParser);

        this.onGameStart.addHandler((byPlayer) => this.mIsGameInProgress = true);
        this.onGameStop.addHandler((byPlayer) => this.mIsGameInProgress = false);
        this.onGamePause.addHandler((byPlayer) => this.mIsGameInProgress = false);
        this.onGameUnpause.addHandler((byPlayer) => this.mIsGameInProgress = true);
        this.onPlayerJoin.addHandler((player) => {
            const metadata = this.mPlayerMetadataService.getMetadataFor(player);

            if (metadata.roles.has(CustomRole.SuperAdmin)) {
                this.setPlayerAdmin(player.id, true);
            }
        });
    }
}