import { inject } from "inversify";
import { IChatMessageParser } from "../../Core/Interfaces/Parsers/IChatMessageParser";
import { IUtilityRoom } from "../../Core/Interfaces/Room/IUtilityRoom";
import { IPlayerMetadataService } from "../../Core/Interfaces/Services/IPlayerMetadataService";
import { Constants } from "../../Core/Utility/Constants";
import { GeometryHelper } from "../../Core/Utility/Helpers/GeometryHelper";
import { TypedEvent } from "../../Core/Utility/TypedEvent";
import { IChatMessageInterceptorFactoryType, Types } from "../../Core/Utility/Types";
import { TeamID } from "../../HeadlessAPI/Enums/TeamID";
import { IPlayerObject } from "../../HeadlessAPI/Interfaces/IPlayerObject";
import { IRoomConfigObject } from "../../HeadlessAPI/Interfaces/IRoomConfigObject";
import { RoomBase } from "./RoomBase";

/**
 * The base room with additional utility functionality.
 */
export abstract class UtilityRoomBase<TPlayerMetadataService extends IPlayerMetadataService = IPlayerMetadataService>
    extends RoomBase implements IUtilityRoom {

    //#region Private members

    /**
     * The trigger distance that is used in detection of player ball collisions.
     */
    private mTouchTriggerDistance: number;

    //#region Property specific

    /**
     * The flag indicating whether the game is currently in progress.
     */
    private mIsGameInProgress: boolean = false;

    /**
     * The flag indicating whether the game is currently paused.
     */
    private mIsGamePaused?: boolean = null;

    /**
     * The variable keeping track of the player that touched the ball last.
     */
    private mLastTouchBy: IPlayerObject;

    /**
     * The variable keeping track of the player that touched the ball second before last.
     */
    private mPenultimateTouchBy: IPlayerObject;

    /**
     * The flag keeping track of the game state when the goal has been scored and before
     * the positions have been reset.
     */
    private mGoalScoredBeforePositionsReset: boolean = false;

    //#endregion

    //#endregion

    //#region Protected members

    /**
     * The player radius, used in touch trigger distance calculation for player ball detection. Is set to the
     * default player radius by default. If using custom player radius, set it before the game is started so that
     * player-ball collision detection will work correctly.
     */
    protected mPlayerRadius: number;

    //#endregion

    //#region Public properties

    /**
     * Gets all the players in the red team, excluding the host player.
     */
    public get teamRed(): IPlayerObject[] {
        const redTeam = this.getPlayersIn(TeamID.RedTeam);

        return redTeam;
    }

    /**
     * Gets all the players in the blue team, excluding the host player.
     */
    public get teamBlue(): IPlayerObject[] {
        const blueTeam = this.getPlayersIn(TeamID.BlueTeam);

        return blueTeam;
    }

    /**
     * Gets all the players in the spectators, excluding the host player.
     */
    public get teamSpectators(): IPlayerObject[] {
        const specs = this.getPlayersIn(TeamID.Spectators);

        return specs;
    }

    /**
     * Gets a value indicating whether the game is currently in progress.
     * If the game is paused, the game is still in progress.
     */
    public get isGameInProgress(): boolean {
        return this.mIsGameInProgress;
    }

    /**
     * Gets a value indicating whether the game is currently paused. Null if game is not in progress.
     */
    public get isGamePaused(): boolean {
        return this.mIsGamePaused;
    }

    /**
     * Gets the player that touched the ball last. Resets to null when the game is started or positions are reset.
     *
     * Can be null or incorrect if using incorrect mPlayerRadius.
     */
    public get lastTouchBy(): IPlayerObject {
        return this.mLastTouchBy;
    }

    /**
     * Gets the player that touched the ball second before last. Resets to null when the game is started or positions are reset.
     *
     * Can be null if only one player touched the ball since the positions reset.
     *
     * Can also be null or incorrect if using incorrect mPlayerRadius.
     */
    public get penultimateTouchBy(): IPlayerObject {
        return this.mPenultimateTouchBy;
    }

    /**
     * Gets a value indicating whether the current game state is when the goal has been scored and before the positions
     * have been reset.
     */
    public get goalScoredBeforePositionsResetState(): boolean {
        return this.mGoalScoredBeforePositionsReset;
    }

    //#region Events

    /**
     * The event that gets fired when a goal is scored.
     * @param scoredByTeam The team that scored the goal.
     * @param lastTouchBy The player that touched the ball last, before the goal was scored.
     * @param penultimateTouchBy The player that touched the ball second before last, before the goal was scored.
     */
    public readonly onGoalScored: TypedEvent<(scoredByTeam: TeamID, lastTouchBy: IPlayerObject, penultimateTouchBy: IPlayerObject) => void>
        = new TypedEvent();

    //#endregion

    //#endregion

    //#region Constructor

    /**
     * Initializes a new instance of the UtilityRoomBase class.
     * @param roomConfig The base Headless API room object's configuration.
     * @param playerMetadataService The player metadata service.
     * @param chatMessageInterceptorFactory The factory that creates chat message interceptors. Just require it here and pass
     * it to the base class, as it is used internally.
     * @param chatMessageParser The parser for chat messages.
     */
    public constructor(
        @inject(Types.IRoomConfigObject) roomConfig: IRoomConfigObject,
        @inject(Types.IPlayerMetadataService) playerMetadataService: TPlayerMetadataService,
        @inject(Types.IChatMessageInterceptorFactory) chatMessageInterceptorFactory: IChatMessageInterceptorFactoryType,
        @inject(Types.IChatMessageParser) chatMessageParser: IChatMessageParser,
    ) {
        super(roomConfig, playerMetadataService, chatMessageInterceptorFactory, chatMessageParser);

        // Set the initial player radius to the default one
        this.mPlayerRadius = Constants.PlayerRadius;

        this.init();
    }

    //#endregion

    //#region Public methods

    /**
     * Returns the current list of players, including or excluding the host player based on the passed in parameter (excluding by default).
     * @param includeHostPlayer Value indicating whether the host player should be included in the returned list of all players.
     */
    public getPlayerList(includeHostPlayer = false): IPlayerObject[] {
        // Get all players including the host player
        const players = super.getPlayerList();

        // If specified to include the host player return the list as is, otherwise filter out the host player
        return includeHostPlayer ? players : players.filter((p) => p.id !== Constants.HostPlayerId);
    }

    /**
     * Returns the current list of players in the specified teams, excluding the host player.
     * @param teams The team ids to get the players for.
     */
    public getPlayersIn(...teams: TeamID[]): IPlayerObject[] {
        const players = this.getPlayerList()
            .filter((player) => teams.includes(player.team) && player.id !== Constants.HostPlayerId);

        return players;
    }

    /**
     * Swaps the players in the red and blue teams.
     */
    public swapTeams(): void {
        // Get all players in the room (including the host, to prevent an additional filtering) that are not in spectators and change their
        // team by subtracting it from 3 (red = 1, blue = 2 so 3 - red == blue && 3 - blue == red)
        this.getPlayerList(true)
            .filter((player) => player.team !== TeamID.Spectators)
            .forEach((player) => {
                this.setPlayerTeam(player.id, 3 - player.team);
            });
    }

    /**
     * Restarts the current game, if one is in progress (even if game is paused). Does nothing otherwise.
     */
    public restartGame(): void {
        if (!this.isGameInProgress) {
            return;
        }

        this.stopGame();
        this.startGame();
    }

    //#endregion

    //#region Private helpers

    /**
     * Initializes necessary things on startup (e.g. event handlers).
     */
    private init(): void {
        this.onGamePause.addHandler((byPlayer) => this.mIsGamePaused = true);
        this.onGameUnpause.addHandler((byPlayer) => this.mIsGamePaused = false);

        this.onGameStart.addHandler((byPlayer) => {
            this.mIsGameInProgress = true;
            this.mIsGamePaused = false;

            // Each time the game starts, recalculate the touch trigger distance, since ball radius might have changed
            this.recalculateTouchTriggerDistance();

            // Reset the last player touches when game is started
            this.mLastTouchBy = null;
            this.mPenultimateTouchBy = null;

            this.mGoalScoredBeforePositionsReset = false;
        });

        this.onGameStop.addHandler((byPlayer) => {
            this.mIsGameInProgress = false;
            this.mIsGamePaused = null;

            this.mGoalScoredBeforePositionsReset = false;
        });

        this.onTeamGoal.addHandler((team) => {
            // When a goal is scored, raise the goal scored event with the team that scored and the two players that touched the ball last
            this.onGoalScored.invoke([team, this.mLastTouchBy, this.mPenultimateTouchBy]);

            // Set the game state as the state when a goal is scored and positions have not yet been reset
            this.mGoalScoredBeforePositionsReset = true;
        });

        this.onPositionsReset.addHandler(() => {
            // Reset the last player touches when positions are reset
            this.mLastTouchBy = null;
            this.mPenultimateTouchBy = null;

            // No longer the state when a goal is scored and before positions are reset
            this.mGoalScoredBeforePositionsReset = false;
        });

        this.onGameTick.addHandler(() => {
            // Check and update last player touches on every game tick
            this.updateLastTouchesOnTick();
        });

        this.onPlayerBallKick.addHandler((player) => {
            // Update the last player touches when the ball is kicked
            this.updateLastTouchesOnKick(player);
        });
    }

    /**
     * Updates the players who touched the ball last. Should only be called on every game tick inside onGameTick.
     */
    private updateLastTouchesOnTick(): void {
        // Get all the players that are playing and the ball position
        const playingPlayers = this.getPlayersIn(TeamID.RedTeam, TeamID.BlueTeam);
        const ballPosition = this.getBallPosition();

        // Check the distance to ball for every player that is playing
        for (let i = 0; i < playingPlayers.length; i++) {
            const player = playingPlayers[i];

            const distanceToBall = GeometryHelper.calculatePointDistance(player.position, ballPosition);

            // If the distance to the ball is less than the touch distance and the last touch player
            // is different from the current one, (check team too because the player might have changed team)
            if (distanceToBall < this.mTouchTriggerDistance &&
                (this.mLastTouchBy?.id !== player.id ||
                    this.mLastTouchBy?.team !== player.team)) {
                // Update the players that last touched the ball
                this.mPenultimateTouchBy = this.mLastTouchBy;
                this.mLastTouchBy = player;
            }
        }
    }

    /**
     * Updates the players who touched the ball last. Should only be called onPlayerBallKick.
     * @param player The player that kicked the ball.
     */
    private updateLastTouchesOnKick(player: IPlayerObject): void {
        if (this.mLastTouchBy?.id !== player.id || this.mLastTouchBy?.team !== player.team) {
            this.mPenultimateTouchBy = this.mLastTouchBy;
            this.mLastTouchBy = player;
        }
    }

    /**
     * Recalculates the touch trigger distance for player ball collision detection. If mPlayerRadius property is not
     * set, the default player radius is used.
     *
     * Should only be called once every time the game starts.
     */
    private recalculateTouchTriggerDistance(): void {
        // Make sure that the player radius is set
        if (this.mPlayerRadius == null) {
            this.mPlayerRadius = Constants.PlayerRadius;
        }

        // Get the ball radius from the current game's ball disc properties
        const ballRadius = this.getDiscProperties(Constants.BallDiscIndex).radius;

        // The trigger distance for the player and ball collision detection is the sum of the player and ball radius
        // along with a very small epsilon value for correct floating point number comparisons
        this.mTouchTriggerDistance = this.mPlayerRadius + ballRadius + Constants.TouchTriggerDistanceEpsilon;
    }

    //#endregion
}