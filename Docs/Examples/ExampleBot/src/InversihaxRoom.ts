import {
    RoomBase,
    Types,
    IRoomConfigObject,
    IChatMessageInterceptorFactoryType,
    IChatMessageParser,
} from "inversihax";
import { InversihaxPlayer } from "./Models/InversihaxPlayer";
import { inject } from "inversify";
import { InversihaxRole } from "./Models/InversihaxRole";
import { IInversihaxPlayerService } from "./Interfaces/IInversihaxPlayerService";

/**
 * Our room class. For simplicity, we derive from the RoomBase, as recommended.
 */
export class InversihaxRoom extends RoomBase<InversihaxPlayer> {

    private readonly playerService: IInversihaxPlayerService;

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
        @inject(Types.IPlayerService) playerService: IInversihaxPlayerService,
        @inject(Types.IChatMessageInterceptorFactory) chatMessageInterceptorFactory: IChatMessageInterceptorFactoryType,
        @inject(Types.IChatMessageParser) chatMessageParser: IChatMessageParser,
    ) {
        super(roomConfig, playerService, chatMessageInterceptorFactory, chatMessageParser);

        this.playerService = playerService;

        // Change the is game in progress property based on event
        this.onGameStart.addHandler((byPlayer) => this.mIsGameInProgress = true);
        this.onGameStop.addHandler((byPlayer) => this.mIsGameInProgress = false);
        this.onGamePause.addHandler((byPlayer) => this.mIsGameInProgress = false);
        this.onGameUnpause.addHandler((byPlayer) => this.mIsGameInProgress = true);

        // Add another handler for when the game ends so we can reset our custom player types positions
        this.onGameStop.addHandler((byPlayer) => {
            this.getPlayerList().forEach((player) => player.position = null);
        });

        this.onPlayerKicked.addHandler((kickedPlayer, reason, ban, byPlayer) => {
            // Let's kick the player who kicked a player if he is not a super admin
            if (!byPlayer.roles.has(InversihaxRole.SuperAdmin)) {
                this.kickPlayer(byPlayer.id, "You do not have sufficient rights to kick/ban players.");
            }
        });

        // Handle our player types - hook up the player service handle methods
        this.onPlayerJoin.addHandler((player) => {
            this.playerService.handlePlayerJoin(player);
        });

        this.onPlayerLeave.addHandler((player) => this.playerService.handlePlayerLeave(player));

        this.onPlayerAdminChange.addHandler((changedPlayer, byPlayer) => {
            const playerBase = this.getPlayerBase(changedPlayer.id);
            this.playerService.handlePlayerAdminChange(playerBase);
        });

        this.onPlayerTeamChange.addHandler((changedPlayer, byPlayer) => {
            const playerBase = this.getPlayerBase(changedPlayer.id);
            this.playerService.handlePlayerTeamChange(playerBase);
        });

        this.onGameTick.addHandler(() => {
            const players = this.getPlayerListBase();
            this.playerService.handlePlayerPositions(players);
        });
    }
}