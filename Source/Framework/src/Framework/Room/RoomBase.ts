import { injectable } from "inversify";
import { IRoom } from "../../Core/Interfaces/IRoom";
import { IChatMessageParser } from "../../Core/Interfaces/Parsers/IChatMessageParser";
import { IPlayerMetadataService } from "../../Core/Interfaces/Services/IPlayerMetadataService";
import { ChatMessage } from "../../Core/Models/ChatMessage";
import { Constants } from "../../Core/Utility/Constants";
import { TypedEvent } from "../../Core/Utility/TypedEvent";
import { IChatMessageInterceptorFactoryType } from "../../Core/Utility/Types";
import { TeamID } from "../../HeadlessAPI/Enums/TeamID";
import { IDiscPropertiesObject } from "../../HeadlessAPI/Interfaces/IDiscPropertiesObject";
import { IPlayerObject } from "../../HeadlessAPI/Interfaces/IPlayerObject";
import { IPosition } from "../../HeadlessAPI/Interfaces/IPosition";
import { IRoomConfigObject } from "../../HeadlessAPI/Interfaces/IRoomConfigObject";
import { IRoomObject } from "../../HeadlessAPI/Interfaces/IRoomObject";
import { IScoresObject } from "../../HeadlessAPI/Interfaces/IScoresObject";

/**
 * The base room abstraction. Provides all of the functionality that the base Headless API room object provides, along with
 * events that support multiple handlers.
 *
 * NOTE: you must inject the IRoomConfigObject, IPlayerMetadataService<TPlayerMetadata>, IChatMessageInterceptor factory and
 * the IChatMessageParser to the derived class and pass it manually to the base's constructor.
 *
 * Is injectable.
 * @type {TPlayerMetadataService} The type of player metadata service to use with the room.
 */
@injectable()
export abstract class RoomBase<TPlayerMetadataService extends IPlayerMetadataService = IPlayerMetadataService> implements IRoom {

    //#region Private members

    /**
     * The chat message interceptor factory.
     */
    private readonly mChatMessageInterceptorFactory: IChatMessageInterceptorFactoryType;

    //#endregion

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
     * The room's player metadata service.
     */
    protected readonly mPlayerMetadataService: TPlayerMetadataService;

    /**
     * The chat message parser.
     */
    protected readonly mChatMessageParser: IChatMessageParser;

    /**
     * Indicates whether the room has been initialized.
     */
    protected get isInitialized(): boolean {
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
    public readonly onPlayerJoin: TypedEvent<(player: IPlayerObject) => void> = new TypedEvent();

    /**
     * The event that gets fired when a player leaves the room.
     * @param player The player that left.
     */
    public readonly onPlayerLeave: TypedEvent<(player: IPlayerObject) => void> = new TypedEvent();

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
    public readonly onPlayerChat: (player: IPlayerObject, message: string) => boolean;

    /**
     * The event that gets fired when a player kicks the ball.
     * @param player The player that kicked the ball.
     */
    public readonly onPlayerBallKick: TypedEvent<(player: IPlayerObject) => void> = new TypedEvent();

    /**
     * The event that gets fired when a team scores a goal.
     * @param team The ID of the team that scores the goal.
     */
    public readonly onTeamGoal: TypedEvent<(team: TeamID) => void> = new TypedEvent();

    /**
     * The event that gets fired when the game is started.
     * @param byPlayer The player that started the game (can be null if the event wasn't caused by a player).
     */
    public readonly onGameStart: TypedEvent<(byPlayer: IPlayerObject) => void> = new TypedEvent();

    /**
     * The event that gets fired when the game is stopped.
     * @param byPlayer The player that stopped the game (can be null if the event wasn't caused by a player).
     */
    public readonly onGameStop: TypedEvent<(byPlayer: IPlayerObject) => void> = new TypedEvent();

    /**
     * The event that gets fired when the player's admin rights change.
     * @param changedPlayer The player whose rights changed.
     * @param byPlayer The player who changed the rights (can be null if the event wasn't caused by a player).
     */
    public readonly onPlayerAdminChange: TypedEvent<(changedPlayer: IPlayerObject, byPlayer: IPlayerObject) => void> = new TypedEvent();

    /**
     * The event that gets fired when the player is moved to a different team.
     * @param changedPlayer The player whose team changed.
     * @param byPlayer The player who changed the other player's team (can be null if the event wasn't caused by a player).
     */
    public readonly onPlayerTeamChange: TypedEvent<(changedPlayer: IPlayerObject, byPlayer: IPlayerObject) => void> = new TypedEvent();

    /**
     * The event that gets raised when a player is kicked or banned. This is always called after the onPlayerLeave event.
     * @param kickedPlayer The player that was kicked/banned.
     * @param reason The reason for the kick/ban.
     * @param ban True if it was a ban, false if it was a kick.
     * @param byPlayer The player that kicked/banned the other player (can be null if the event wasn't caused by a player).
     */
    public readonly onPlayerKicked: TypedEvent<(kickedPlayer: IPlayerObject, reason: string, ban: boolean, byPlayer: IPlayerObject) => void>
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
    public readonly onGamePause: TypedEvent<(byPlayer: IPlayerObject) => void> = new TypedEvent();

    /**
     * The event that gets raised when the game is paused.
     *
     * After this event there's a timer before the game is fully un-paused,
     * to detect when the game has really resumed you can listen for the first onGameTick event after this event is called.
     * @param byPlayer The player that un-paused the game.
     */
    public readonly onGameUnpause: TypedEvent<(byPlayer: IPlayerObject) => void> = new TypedEvent();

    /**
     * The event that gets raised when the players and ball positions are reset after a goal happens.
     */
    public readonly onPositionsReset: TypedEvent<() => void> = new TypedEvent();

    /**
     * The event that gets raised when a player provides an activity, such as key press.
     * @param player The player that gave the activity.
     */
    public readonly onPlayerActivity: TypedEvent<(player: IPlayerObject) => void> = new TypedEvent();

    /**
     * The event that gets raised when a player changes the stadium.
     * @param newStadiumName The new stadium name.
     * @param byPlayer The player that changed the stadium.
     */
    public readonly onStadiumChange: TypedEvent<(newStadiumName: string, byPlayer: IPlayerObject) => void> = new TypedEvent();

    /**
     * The event that gets raised when the room link is obtained.
     * @param url The room link.
     */
    public readonly onRoomLink: TypedEvent<(url: string) => void> = new TypedEvent();

    /**
     * The event that gets raised when the kick rate is set.
     * @param min The minimum amount of frames between two kicks by the same player. Players wont be able to kick more frequently
     * than this number of frames.
     * @param rate The allowed amount of frames between two kicks, but unlike min rate it lets a player save up more kicks and spend
     * them later all at once depending on the burst value.
     * @param burst Determines how many extra kicks the player is able to save up.
     * @param byPlayer The player that changed the kick rate limit.
     */
    public readonly onKickRateLimitSet: TypedEvent<(min: number, rate: number, burst: number, byPlayer: IPlayerObject) => void>
        = new TypedEvent();

    //#endregion

    //#endregion

    //#region Constructor

    /**
     * Initializes a new instance of the RoomBase class.
     * @param roomConfig The base Headless API room object's configuration.
     * @param playerMetadataService The player metadata service.
     * @param chatMessageInterceptorFactory The chat message interceptor factory.
     * @param chatMessageParser The chat message parser.
     */
    public constructor(
        roomConfig: IRoomConfigObject,
        playerMetadataService: TPlayerMetadataService,
        chatMessageInterceptorFactory: IChatMessageInterceptorFactoryType,
        chatMessageParser: IChatMessageParser,
    ) {
        this.mRoomConfig = roomConfig;
        this.mPlayerMetadataService = playerMetadataService;
        this.mChatMessageInterceptorFactory = chatMessageInterceptorFactory;
        this.mChatMessageParser = chatMessageParser;

        // Initialize the room
        this.mRoom = this.initialize();

        // Link the events of the Headless API room object
        this.configureEvents();

        // Set the onPlayerChat event handler
        this.onPlayerChat = this.onPlayerChatHandler.bind(this);

        // Handle metadata for players joining and leaving
        this.onPlayerJoin.addHandler((player) => this.mPlayerMetadataService.handleOnPlayerJoin(player));
        this.onPlayerLeave.addHandler((player) => this.mPlayerMetadataService.handleOnPlayerLeave(player));
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
     * Sends a host announcement with msg as contents. Unlike sendChat, announcements will work without a host player and has a larger
     * limit on the number of characters.
     * @param msg The message content to send.
     * @param targetId The id of the target to send the announcement to. If null or undefined the message is sent to all players, otherwise
     * it's sent only to the player with matching targetId.
     * @param color Will set the color of the announcement text. It's encoded as an integer
     * (0xFF0000 is red, 0x00FF00 is green, 0x0000FF is blue). If null or undefined the text will use the default chat color.
     * @param style Will set the style of the announcement text, it must be one of the following strings:
     * "normal","bold","italic", "small", "small-bold", "small-italic". If null or undefined "normal" style will be used.
     * @param sound If set to 0 the announcement will produce no sound. If set to 1 the announcement will produce a normal chat sound.
     * If set to 2 it will produce a notification sound.
     */
    public sendAnnouncement(msg: string, targetId?: number, color?: number, style?: string, sound?: number): void {
        this.mRoom.sendAnnouncement(msg, targetId, color, style, sound);
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
     * @param playerId The id of the player to get. If not specified, returns the room's host player. If room was configured to
     * use no host player, the return value will be null.
     */
    public getPlayer(playerId: number = Constants.HostPlayerId): IPlayerObject {
        return this.mRoom.getPlayer(playerId);
    }

    /**
     * Returns the current list of players.
     */
    public getPlayerList(): IPlayerObject[] {
        return this.mRoom.getPlayerList();
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

    /**
     * Changes the password of the room.
     * @param pass The password. If null, password will be cleared.
     */
    public setPassword(pass: string): void {
        this.mRoom.setPassword(pass);
    }

    /**
     * Overrides the avatar of the target player. If avatar is set to null the override is cleared and the
     * player will be able to use his own avatar again.
     */
    public setPlayerAvatar(playerId: number, avatar: string): void {
        this.mRoom.setPlayerAvatar(playerId, avatar);
    }

    /**
     * Reorders the player list. First all players listed are removed, then they are reinserted in the same order
     * they appear in the playerIdList.
     * @param playerIdList The list of players to reorder.
     * @param moveToTop If true players are inserted at the top of the list, otherwise they are inserted at the bottom of the list.
     */
    public reorderPlayers(playerIdList: number[], moveToTop: boolean): void {
        this.mRoom.reorderPlayers(playerIdList, moveToTop);
    }

    /**
     * Gets the number of discs in the game including the ball and player discs.
     */
    public getDiscCount(): number {
        return this.mRoom.getDiscCount();
    }

    /**
     * Gets the properties of the disc at discIndex. Returns null if discIndex is out of bounds.
     * @param discIndex The index of the disc whose properties to get.
     */
    public getDiscProperties(discIndex: number): IDiscPropertiesObject {
        return this.mRoom.getDiscProperties(discIndex);
    }

    /**
     * Sets properties of the target disc.
     *
     * Properties that are null or undefined will not be set and therefor will preserve whatever value the disc already had.
     * @param discIndex The index of the target disc.
     * @param properties The disc properties to set.
     */
    public setDiscProperties(discIndex: number, properties: IDiscPropertiesObject): void {
        this.mRoom.setDiscProperties(discIndex, properties);
    }

    /**
     * Gets the properties of the specified player's disc.
     * @param playerId The id of the player whose disc properties to get.
     */
    public getPlayerDiscProperties(playerId: number): IDiscPropertiesObject {
        return this.mRoom.getPlayerDiscProperties(playerId);
    }

    /**
     * Sets properties of the target player's disc.
     *
     * Properties that are null or undefined will not be set and therefor will preserve whatever value the disc already had.
     * @param playerId The id of the player whose disc properties to set.
     * @param properties The disc properties to set.
     */
    public setPlayerDiscProperties(playerId: number, properties: IDiscPropertiesObject): void {
        this.mRoom.setPlayerDiscProperties(playerId, properties);
    }

    /**
     * Sets the room's kick rate limits.
     * @param min The minimum amount of frames between two kicks by the same player. Players wont be able to kick more frequently
     * than this number of frames. Default is 2.
     * @param rate The allowed amount of frames between two kicks, but unlike min rate it lets a player save up more kicks and spend
     * them later all at once depending on the burst value. Default is 0.
     * @param burst Determines how many extra kicks the player is able to save up. Default is 0.
     *
     * Example for setting values to min = 2, rate = 15 and burst = 3:
     *
     * If a player spams kick he'll kick every 2 frames for the first 4 kicks and after that he'll be limited to one kick every 15
     * frames (which is 4 kicks per second). If the player doesn't kick for 1 second he'll save enough for another burst of 4 kicks.
     */
    public setKickRateLimit(min?: number, rate?: number, burst?: number): void {
        this.mRoom.setKickRateLimit(min, rate, burst);
    }

    /**
     * Activates or deactivates the recaptcha requirement to join the room.
     */
    public setRequireRecaptcha(required: boolean): void {
        this.mRoom.setRequireRecaptcha(required);
    }

    //#endregion

    //#endregion

    //#region Protected methods

    /**
     * Initializes the room by calling the HBInit Headless API method and returns the IRoomObject, if not already initialized.
     *
     * Can be overridden. You can use it to:
     * - implement custom room initialization. Do this only for testing purposes (e.g. unit testing) - shown in example 1
     * - implement additional room initialization (e.g. custom services) - shown in example 2
     *
```
// Example 1 - Custom room initialization
export class TestRoom extends RoomBase<Player> {
    ...
    protected initialize(): IRoomObject {
        return {} as any;
    }
    ...
}

// Example 2 - additional room initialization
export class CustomRoom extends RoomBase<Player> {
    ...
    protected initialize(): IRoomObject {
        const baseInit = super.initialize();

        // Initialize your things here...

        return baseInit;
    }
    ...
}
```
     */
    protected initialize(): IRoomObject {
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
            this.onPlayerJoin.invoke([player]);
        };

        this.mRoom.onPlayerLeave = (player) => {
            this.onPlayerLeave.invoke([player]);
        };

        this.mRoom.onTeamVictory = (scores) => {
            this.onTeamVictory.invoke([scores]);
        };

        this.mRoom.onPlayerChat = (player: IPlayerObject, message: string) => {
            return this.onPlayerChat(player, message);
        };

        this.mRoom.onPlayerBallKick = (player) => {
            this.onPlayerBallKick.invoke([player]);
        };

        this.mRoom.onTeamGoal = (team) => {
            this.onTeamGoal.invoke([team]);
        };

        this.mRoom.onGameStart = (player) => {
            this.onGameStart.invoke([player]);
        };

        this.mRoom.onGameStop = (player) => {
            this.onGameStop.invoke([player]);
        };

        this.mRoom.onPlayerAdminChange = (changedPlayer, byPlayer) => {
            this.onPlayerAdminChange.invoke([changedPlayer, byPlayer]);
        };

        this.mRoom.onPlayerTeamChange = (changedPlayer, byPlayer) => {
            this.onPlayerTeamChange.invoke([changedPlayer, byPlayer]);
        };

        this.mRoom.onPlayerKicked = (kickedPlayer, reason, ban, byPlayer) => {
            this.onPlayerKicked.invoke([kickedPlayer, reason, ban, byPlayer]);
        };

        this.mRoom.onGameTick = () => {
            this.onGameTick.invoke([]);
        };

        this.mRoom.onGamePause = (byPlayer) => {
            this.onGamePause.invoke([byPlayer]);
        };

        this.mRoom.onGameUnpause = (byPlayer) => {
            this.onGameUnpause.invoke([byPlayer]);
        };

        this.mRoom.onPositionsReset = () => {
            this.onPositionsReset.invoke([]);
        };

        this.mRoom.onPlayerActivity = (player) => {
            this.onPlayerActivity.invoke([player]);
        };

        this.mRoom.onStadiumChange = (newStadiumName, byPlayer) => {
            this.onStadiumChange.invoke([newStadiumName, byPlayer]);
        };

        this.mRoom.onRoomLink = (url) => {
            this.onRoomLink.invoke([url]);
        };

        this.mRoom.onKickRateLimitSet = (min, rate, burst, byPlayer) => {
            this.onKickRateLimitSet.invoke([min, rate, burst, byPlayer]);
        };
    }

    /**
     * The onPlayerChat event handler.
     * @param player The player that sent the message.
     * @param message The message being sent.
     */
    private onPlayerChatHandler(player: IPlayerObject, message: string): boolean {
        // Get all the registered chat message interceptors
        const interceptors = this.mChatMessageInterceptorFactory();

        // Use the chat message parser to parse the original message into words and create the chat message object
        const words = this.mChatMessageParser.parse(message);
        const chatMessage = new ChatMessage(player, message, words);

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