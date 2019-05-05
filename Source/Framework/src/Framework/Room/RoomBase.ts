import { injectable, Container } from "inversify";
import { IPlayerObject, IPosition, IRoomConfigObject, IRoomObject, IScoresObject, TeamID } from "types-haxball-headless-api";
import { IRoom } from "../../Core/Interfaces/IRoom";
import { IChatMessageInterceptor } from "../../Core/Interfaces/Interceptors/IChatMessageInterceptor";
import { IPlayerManager } from "../../Core/Interfaces/Managers/IPlayerManager";
import { ChatMessage } from "../../Core/Models/ChatMessage";
import { Player } from "../../Core/Models/Player";
import { Constants } from "../../Core/Utility/Constants";
import { TypedEvent } from "../../Core/Utility/TypedEvent";
import { Types } from "../../Core/Utility/Types";

/**
 * The base room abstraction. Provides all of the functionality that the base Headless API room object provides, along with
 * events that support multiple handlers.
 * NOTE: you must inject the IRoomConfigObject, IPlayerManager<TPlayer> and the room's DI Container to the derived class and
 * pass it manually to the base's constructor.
 *
 * Is injectable.
 * @type {TPlayer} The type of player to use with the room.
 */
@injectable()
export abstract class RoomBase<TPlayer extends Player> implements IRoom<TPlayer> {

    //#region Protected members

    /**
     * The base Headless API room object.
     */
    protected readonly mRoom: IRoomObject;

    /**
     * The base Headless API room object's configuration.
     */
    protected readonly mRoomConfig: IRoomConfigObject;

    /**
     * The room's player manager.
     */
    protected readonly mPlayerManager: IPlayerManager<TPlayer>;

    /**
     * The room's dependency injection container.
     */
    protected readonly mContainer: Container;

    /**
     * Indicates whether the room has been initialized.
     */
    protected get isInitialized() {
        // Room is initialized if the base Headless API room object is defined
        return this.mRoom != null;
    }

    //#endregion

    //#region Public members

    //#region Events

    /**
     * The event that gets fired when a player joins the room.
     * @param player The player that joined.
     */
    public readonly onPlayerJoin: TypedEvent<(player: TPlayer) => void> = new TypedEvent();

    /**
     * The event that gets fired when a player leaves the room.
     * @param player The player that left.
     */
    public readonly onPlayerLeave: TypedEvent<(player: TPlayer) => void> = new TypedEvent();

    /**
     * The event that gets fired when a team wins.
     * @param scores The scores object.
     */
    public readonly onTeamVictory: TypedEvent<(scores: IScoresObject) => void> = new TypedEvent();

    /**
     * The event that gets fired when a player sends a message.
     *
     * The event function can return false in order to filter the chat message. This prevents
     * the chat message from reaching other players in the room.
     * @param player The player that sent the message.
     * @param message The message.
     */
    public readonly onPlayerChat: (player: TPlayer, message: string) => boolean;

    /**
     * The event that gets fired when a player kicks the ball.
     * @param player The player that kicked the ball.
     */
    public readonly onPlayerBallKick: TypedEvent<(player: TPlayer) => void> = new TypedEvent();

    /**
     * The event that gets fired when a team scores a goal.
     * @param team The ID of the team that scores the goal.
     */
    public readonly onTeamGoal: TypedEvent<(team: TeamID) => void> = new TypedEvent();

    /**
     * The event that gets fired when the game is started.
     * @param byPlayer The player that started the game (can be null if the event wasn't caused by a player).
     */
    public readonly onGameStart: TypedEvent<(byPlayer: TPlayer) => void> = new TypedEvent();

    /**
     * The event that gets fired when the game is stopped.
     * @param byPlayer The player that stopped the game (can be null if the event wasn't caused by a player).
     */
    public readonly onGameStop: TypedEvent<(byPlayer: TPlayer) => void> = new TypedEvent();

    /**
     * The event that gets fired when the player's admin rights change.
     * @param changedPlayer The player whose rights changed.
     * @param byPlayer The player who changed the rights (can be null if the event wasn't caused by a player).
     */
    public readonly onPlayerAdminChange: TypedEvent<(changedPlayer: TPlayer, byPlayer: TPlayer) => void> = new TypedEvent();

    /**
     * The event that gets fired when the player is moved to a different team.
     * @param changedPlayer The player whose team changed.
     * @param byPlayer The player who changed the other player's team (can be null if the event wasn't caused by a player).
     */
    public readonly onPlayerTeamChange: TypedEvent<(changedPlayer: TPlayer, byPlayer: TPlayer) => void> = new TypedEvent();

    /**
     * The event that gets raised when a player is kicked or banned. This is always called after the onPlayerLeave event.
     * @param kickedPlayer The player that was kicked/banned.
     * @param reason The reason for the kick/ban.
     * @param ban True if it was a ban, false if it was a kick.
     * @param byPlayer The player that kicked/banned the other player (can be null if the event wasn't caused by a player).
     */
    public readonly onPlayerKicked: TypedEvent<(kickedPlayer: TPlayer, reason: string, ban: boolean, byPlayer: TPlayer) => void>
        = new TypedEvent();

    /**
     * The event that gets raised once for every game tick (happens 60 times per second).
     *
     * This event is not called if the game is paused or stopped.
     */
    public readonly onGameTick: TypedEvent<() => void> = new TypedEvent();

    /**
     * The event that gets raised when the game is paused.
     * @param byPlayer The player that paused the game.
     */
    public readonly onGamePause: TypedEvent<(byPlayer: TPlayer) => void> = new TypedEvent();

    /**
     * The event that gets raised when the game is paused.
     *
     * After this event there's a timer before the game is fully un-paused,
     * to detect when the game has really resumed you can listen for the first onGameTick event after this event is called.
     * @param byPlayer The player that un-paused the game.
     */
    public readonly onGameUnpause: TypedEvent<(byPlayer: TPlayer) => void> = new TypedEvent();

    /**
     * The event that gets raised when the players and ball positions are reset after a goal happens.
     */
    public readonly onPositionsReset: TypedEvent<() => void> = new TypedEvent();

    /**
     * The event that gets raised when a player provides an activity, such as key press.
     * @param player The player that gave the activity.
     */
    public readonly onPlayerActivity: TypedEvent<(player: TPlayer) => void> = new TypedEvent();

    /**
     * The event that gets raised when a player changes the stadium.
     * @param newStadiumName The new stadium name.
     * @param byPlayer The player that changed the stadium.
     */
    public readonly onStadiumChange: TypedEvent<(newStadiumName: string, byPlayer: TPlayer) => void> = new TypedEvent();

    /**
     * The event that gets raised when the room link is obtained.
     * @param url The room link.
     */
    public readonly onRoomLink: TypedEvent<(url: string) => void> = new TypedEvent();

    //#endregion

    //#endregion

    //#region Constructor

    /**
     * Initializes a new instance of the Room class.
     * @param roomConfig The base Headless API room object's configuration.
     * @param playerManager The player manager.
     * @param container The room's dependency injection container.
     */
    public constructor(
        roomConfig: IRoomConfigObject,
        playerManager: IPlayerManager<TPlayer>,
        container: Container,
    ) {
        this.mRoomConfig = roomConfig;
        this.mPlayerManager = playerManager;
        this.mContainer = container;

        // Initialize the room
        this.mRoom = this.initializeRoom();

        // Link the events of the Headless API room object
        this.configureEvents();

        // Set the onPlayerChat event handler
        this.onPlayerChat = this.onPlayerChatHandler.bind(this);
    }

    //#endregion

    //#region Public methods

    //#region API specific

    /**
     * Sends a chat message using the host player. If targetId is defined the message is sent only to the player with a matching id.
     * @param message The message to send.
     */
    public sendChat(message: string, targetId?: number): void {
        this.mRoom.sendChat(message, targetId);
    }

    /**
     * Changes the admin status of the specified player.
     * @param playerID The id of the player whose admin status to change.
     * @param admin The admin status to set.
     */
    public setPlayerAdmin(playerID: number, admin: boolean): void {
        this.mRoom.setPlayerAdmin(playerID, admin);
    }

    /**
     *  Moves the specified player to a team.
     * @param playerID The id of the player whose team to change.
     * @param team The team in which to move the player to.
     */
    public setPlayerTeam(playerID: number, team: number): void {
        this.mRoom.setPlayerTeam(playerID, team);
    }

    /**
     * Kicks the specified player from the room.
     * @param playerID The player to kick.
     * @param reason The reason.
     * @param ban Specifies if the player should also be banned. False by default.
     */
    public kickPlayer(playerID: number, reason: string, ban: boolean = false): void {
        this.mRoom.kickPlayer(playerID, reason, ban);
    }

    /**
     * Clears the ban for a playerId that belonged to a player that was previously banned.
     * @param playerId The id of the player to un-ban.
     */
    public clearBan(playerID: number): void {
        this.mRoom.clearBan(playerID);
    }

    /**
     * Clears the list of banned players.
     */
    public clearBans(): void {
        this.mRoom.clearBans();
    }

    /**
     * Sets the score limit of the room (If a game is in progress this method does nothing).
     * @param limit The score limit.
     */
    public setScoreLimit(limit: number): void {
        this.mRoom.setScoreLimit(limit);
    }

    /**
     * Sets the time limit of the room - the limit must be specified in number of minutes
     * (If a game is in progress this method does nothing).
     * @param limitInMinutes The time limit in minutes.
     */
    public setTimeLimit(limitInMinutes: number): void {
        this.mRoom.setTimeLimit(limitInMinutes);
    }

    /**
     * Parses the stadiumFileContents as a .hbs stadium file and sets it as the selected stadium.
     *
     * There must not be a game in progress, If a game is in progress this method does nothing.
     * @param stadiumFileContents The stadium file contents.
     */
    public setCustomStadium(stadiumFileContents: string): void {
        this.mRoom.setCustomStadium(stadiumFileContents);
    }

    /**
     * Sets the selected stadium to one of the default stadiums. The name must match exactly (case sensitive).
     *
     * There must not be a game in progress, If a game is in progress this method does nothing.
     * @param stadiumName The name of the stadium.
     */
    public setDefaultStadium(stadiumName: string): void {
        this.mRoom.setDefaultStadium(stadiumName);
    }

    /**
     *  Sets the teams lock. When teams are locked players are not able to change team unless they are moved by an admin.
     * @param locked True to lock, false to unlock.
     */
    public setTeamsLock(locked: boolean): void {
        this.mRoom.setTeamsLock(locked);
    }

    /**
     * Sets the colors of a team.
     *
     * Colors are represented as an int, for example a pure red color is 0xFF0000.
     *
     * /colors <team> <angle> <textColor> <color1> <color2> <color3>
     * @param team The team whose color to set.
     * @param angle The angle of the colors.
     * @param textColor The color of the player avatars.
     * @param colors The colors.
     */
    public setTeamColors(team: TeamID, angle: number, textColor: number, colors: Int32Array): void {
        this.mRoom.setTeamColors(team, angle, textColor, colors);
    }

    /**
     * Starts the game, if a game is already in progress this method does nothing.
     */
    public startGame(): void {
        this.mRoom.startGame();
    }

    /**
     * Stops the game, if no game is in progress this method does nothing.
     */
    public stopGame(): void {
        this.mRoom.stopGame();
    }

    /**
     * Sets the pause state of the game.
     * @param pauseState True to pause, false to unpause.
     */
    public pauseGame(pauseState: boolean): void {
        this.mRoom.pauseGame(pauseState);
    }

    /**
     * Returns the player with the specified id. Returns null if the player doesn't exist.
     * @param playerId The id of the player to get. If not specified, returns the room's host player.
     */
    public getPlayer(playerId: number = Constants.HostPlayerId): TPlayer {
        // Get the base player object, cast it into the correct player type and return it
        const playerBase = this.mRoom.getPlayer(playerId);
        const player = this.mPlayerManager.cast(playerBase);

        return player;
    }

    /**
     * Returns the current list of players.
     */
    public getPlayerList(): TPlayer[] {
        // Get the base player objects, cast them to the correct player types and return them
        const playersBase = this.mRoom.getPlayerList();
        const players = playersBase.map((playerBase) => {
            return this.mPlayerManager.cast(playerBase);
        }, this);

        return players;
    }

    /**
     * If a game is in progress it returns the current score information, otherwise it returns null.
     */
    public getScores(): IScoresObject {
        return this.mRoom.getScores();
    }

    /**
     * Returns the ball's position in the field or null if no game is in progress.
     */
    public getBallPosition(): IPosition {
        return this.mRoom.getBallPosition();
    }

    /**
     * Starts recording of a haxball replay.
     *
     * Don't forget to call stop recording or it will cause a memory leak.
     */
    public startRecording(): void {
        this.mRoom.startRecording();
    }

    /**
     * Stops the recording previously started with startRecording and returns the replay file contents as a Uint8Array.
     *
     * Returns null if recording was not started or had already been stopped.
     */
    public stopRecording(): Uint8Array {
        return this.mRoom.stopRecording();
    }

    //#endregion

    //#endregion

    //#region Protected methods

    /**
     * Initializes the room by calling the HBInit Headless API method and returns the IRoomObject, if not already initialized.
     * IMPORTANT:
     * ---
     * Can be overridden to implement custom room initialization, but do this only for testing purposes (e.g. unit testing).
     */
    protected initializeRoom(): IRoomObject {
        // Room can only be initialized once
        if (this.isInitialized) {
            return null;
        }

        return window.HBInit(this.mRoomConfig);
    }

    //#endregion

    //#region Private helpers

    /**
     * Links the Headless API's room object events to the room abstraction events.
     */
    private configureEvents(): void {
        this.mRoom.onPlayerJoin = (player) => {
            const typedPlayer = this.mPlayerManager.cast(player);
            this.onPlayerJoin.invoke([typedPlayer]);
        };

        this.mRoom.onPlayerLeave = (player) => {
            const typedPlayer = this.mPlayerManager.cast(player);
            this.onPlayerLeave.invoke([typedPlayer]);
        };

        this.mRoom.onTeamVictory = (scores) => {
            this.onTeamVictory.invoke([scores]);
        };

        this.mRoom.onPlayerChat = (player: IPlayerObject, message: string) => {
            const typedPlayer = this.mPlayerManager.cast(player);

            return this.onPlayerChat(typedPlayer, message);
        };

        this.mRoom.onPlayerBallKick = (player) => {
            const typedPlayer = this.mPlayerManager.cast(player);

            this.onPlayerBallKick.invoke([typedPlayer]);
        };

        this.mRoom.onTeamGoal = (team) => {
            this.onTeamGoal.invoke([team]);
        };

        this.mRoom.onGameStart = (player) => {
            const typedPlayer = this.mPlayerManager.cast(player);

            this.onGameStart.invoke([typedPlayer]);
        };

        this.mRoom.onGameStop = (player) => {
            const typedPlayer = this.mPlayerManager.cast(player);

            this.onGameStop.invoke([typedPlayer]);
        };

        this.mRoom.onPlayerAdminChange = (changedPlayer, byPlayer) => {
            const typedChangedPlayer = this.mPlayerManager.cast(changedPlayer);
            const typedByPlayer = this.mPlayerManager.cast(byPlayer);

            this.onPlayerAdminChange.invoke([typedChangedPlayer, typedByPlayer]);
        };

        this.mRoom.onPlayerTeamChange = (changedPlayer, byPlayer) => {
            const typedChangedPlayer = this.mPlayerManager.cast(changedPlayer);
            const typedByPlayer = this.mPlayerManager.cast(byPlayer);

            this.onPlayerTeamChange.invoke([typedChangedPlayer, typedByPlayer]);
        };

        this.mRoom.onPlayerKicked = (kickedPlayer, reason, ban, byPlayer) => {
            const typedKickedPlayer = this.mPlayerManager.cast(kickedPlayer);
            const typedByPlayer = this.mPlayerManager.cast(byPlayer);

            this.onPlayerKicked.invoke([typedKickedPlayer, reason, ban, typedByPlayer]);
        };

        this.mRoom.onGameTick = () => {
            this.onGameTick.invoke([]);
        };

        this.mRoom.onGamePause = (byPlayer) => {
            const typedByPlayer = this.mPlayerManager.cast(byPlayer);

            this.onGamePause.invoke([typedByPlayer]);
        };

        this.mRoom.onGameUnpause = (byPlayer) => {
            const typedByPlayer = this.mPlayerManager.cast(byPlayer);

            this.onGameUnpause.invoke([typedByPlayer]);
        };

        this.mRoom.onPositionsReset = () => {
            this.onPositionsReset.invoke([]);
        };

        this.mRoom.onPlayerActivity = (player) => {
            const typedPlayer = this.mPlayerManager.cast(player);

            this.onPlayerActivity.invoke([typedPlayer]);
        };

        this.mRoom.onStadiumChange = (newStadiumName, byPlayer) => {
            const typedByPlayer = this.mPlayerManager.cast(byPlayer);

            this.onStadiumChange.invoke([newStadiumName, typedByPlayer]);
        };
    }

    /**
     * The onPlayerChat event handler.
     */
    private onPlayerChatHandler(player: TPlayer, message: string): boolean {
        // Get all the registered chat message interceptors
        const interceptors = this.mContainer.getAll<IChatMessageInterceptor<ChatMessage<Player>>>(Types.IChatMessageInterceptor);

        // Create the initial chat message objects
        let chatMessage = new ChatMessage<TPlayer>(player, message);

        // Go through all the interceptors in the order they were registered to the container
        for (let i = 0; i < interceptors.length; i++) {
            // Intercept the message (first interceptor will always intercept)
            const continueChain = interceptors[i].intercept(chatMessage);

            // End intercepting if the interceptor ended the intercepting chain
            if (!continueChain) {
                break;
            }
        }

        // Return the broadcast forward flag of the message indicating whether the message should be broadcasted forward
        return chatMessage.broadcastForward;
    }

    //#endregion
}