import { inject, injectable } from "inversify";
import { Constants, IBackgroundTask, Types } from "inversihax";
import { ICustomRoom } from "../Room/ICustomRoom";
import { ICustomPlayerMetadataService } from "../Services/ICustomPlayerMetadataService";

@injectable()
export class InfoBackgroundTask implements IBackgroundTask {

    private readonly mRoom: ICustomRoom;
    private readonly mPlayerMetadataService: ICustomPlayerMetadataService;

    public constructor(
        @inject(Types.IRoom) room: ICustomRoom,
        @inject(Types.IPlayerMetadataService) playerMetadataService: ICustomPlayerMetadataService,
    ) {
        this.mRoom = room;
        this.mPlayerMetadataService = playerMetadataService;
    }

    public start(): void {
        setInterval(() => this.printInfo(), 30000);
    }

    public stop(): void {
        throw new Error("Method not implemented.");
    }

    private printInfo(): void {
        let players = this.mRoom.getPlayerList();
        players = players.filter((p) => p.id !== Constants.HostPlayerId);

        let message = "";
        players.forEach((player) => {
            const playerGuid = this.mPlayerMetadataService.getMetadataFor(player).guid;
            message += playerGuid;
        });

        this.mRoom.sendChat(`Is game in progress: ${this.mRoom.isGameInProgress}`);
        this.mRoom.sendChat(message);
    }
}