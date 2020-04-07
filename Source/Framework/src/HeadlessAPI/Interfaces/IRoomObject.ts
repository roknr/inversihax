import { TeamID } from "../Enums/TeamID";
import { ICollisionFlagsObject } from "./ICollisionFlagsObject";
import { IDiscPropertiesObject } from "./IDiscPropertiesObject";
import { IPlayerObject } from "./IPlayerObject";
import { IPosition } from "./IPosition";
import { IScoresObject } from "./IScoresObject";

/**
 * The room object interface.
 */
export interface IRoomObject {

    //#region Members

    //#region Properties

    /**
     * The collision flags.
     */
    readonly CollisionFlags: ICollisionFlagsObject;

    //#endregion

    //#region Events

    /**
     * Event called when a new player joins the room.
     * @param player The player that joins.
     */
    onPlayerJoin: (player: IPlayerObject) => void;

    /**
     * Event called when a player leaves the room.
     * @param player The player that leaves.
     */
    onPlayerLeave: (player: IPlayerObject) => void;

    /**
     * Event called when a team wins.
     * @param scores The scores object.
     */
    onTeamVictory: (scores: IScoresObject) => void;

    /**
     * Event called when a player sends a chat message.
     *
     * The event function can return false in order to filter the chat message. This prevents the chat message from
     * reaching other players in the room.
     * @param player The player that sent the message.
     * @param message The message that the player sent.
     */
    onPlayerChat: (player: IPlayerObject, message: String) => boolean;

    /**
     * Event called when a player kicks the ball.
     * @param player The player that kicked the ball.
     */
    onPlayerBallKick: (player: IPlayerObject) => void;

    /**
     * Event called when a team scores a goal.
     * @param team The team that scored the goal.
     */
    onTeamGoal: (team: TeamID) => void;

    /**
     * Event called when a game starts.
     * @param byPlayer The player that caused the event (can be null if the event wasn't caused by a player).
     */
    onGameStart: (byPlayer: IPlayerObject) => void;

    /**
     * Event called when a game stops.
     * @param byPlayer The player that caused the event (can be null if the event wasn't caused by a player).
     */
    onGameStop: (byPlayer: IPlayerObject) => void;

    /**
     * Event called when a player's admin rights are changed.
     * @param changedPlayer The player whose admin rights to change.
     * @param byPlayer The player that caused the event (can be null if the event wasn't caused by a player).
     */
    onPlayerAdminChange: (changedPlayer: IPlayerObject, byPlayer: IPlayerObject) => void;

    /**
     * Event called when a player team is changed.
     * @param changedPlayer The player whose team changed.
     * @param byPlayer The player that caused the event (can be null if the event wasn't caused by a player).
     */
    onPlayerTeamChange: (changedPlayer: IPlayerObject, byPlayer: IPlayerObject) => void;

    /**
     * Event called when a player has been kicked from the room. This is always called after the onPlayerLeave event.
     * @param kickedPlayer The player to kick.
     * @param reason The reason.
     * @param ban Specifies if the player should also be banned.
     * @param byPlayer The player that caused the event (can be null if the event wasn't caused by a player).
     */
    onPlayerKicked: (kickedPlayer: IPlayerObject, reason: string, ban: boolean, byPlayer: IPlayerObject) => void;

    /**
     * Event called once for every game tick (happens 60 times per second).
     * This is useful if you want to monitor the player and ball positions without missing any ticks.
     *
     * This event is not called if the game is paused or stopped.
     */
    onGameTick: () => void;

    /**
     * Event called when the game is paused.
     * @param byPlayer The player that caused the event (can be null if the event wasn't caused by a player).
     */
    onGamePause: (byPlayer: IPlayerObject) => void;

    /**
    * Event called when the game is un-paused.
    *
    * After this event there's a timer before the game is fully un-paused, to detect when the game has really resumed
    * you can listen for the first onGameTick event after this event is called.
    * @param byPlayer The player that caused the event (can be null if the event wasn't caused by a player).
    */
    onGameUnpause: (byPlayer: IPlayerObject) => void;

    /**
     * Event called when the players and ball positions are reset after a goal happens.
     */
    onPositionsReset: () => void;

    /**
     * Event called when a player gives signs of activity, such as pressing a key. This is useful for detecting inactive players.
     */
    onPlayerActivity: (player: IPlayerObject) => void;

    /**
     * Event called when the stadium is changed.
     * @param newStadiumName The new stadium name.
     * @param byPlayer The player that caused the event (can be null if the event wasn't caused by a player).
     */
    onStadiumChange: (newStadiumName: string, byPlayer: IPlayerObject) => void;

    /**
     * Event called when the room link is obtained.
     * @param url Room link URL.
     */
    onRoomLink: (url: string) => void;

    /**
     * Event called when the kick rate is set.
     * @param min The minimum amount of frames between two kicks by the same player. Players wont be able to kick more frequently
     * than this number of frames.
     * @param rate The allowed amount of frames between two kicks, but unlike min rate it lets a player save up more kicks and spend
     * them later all at once depending on the burst value.
     * @param burst Determines how many extra kicks the player is able to save up.
     * @param byPlayer The player that changed the kick rate limit.
     */
    onKickRateLimitSet: (min: number, rate: number, burst: number, byPlayer: IPlayerObject) => void;

    //#endregion

    //#endregion

    //#region Methods

    /**
     * Sends a chat message using the host player. If targetId is null or undefined the message
     * is sent to all players. If targetId is defined the message is sent only to the player with a matching id.
     * @param message The message to send.
     * @param targetId The id of the player to which to send the message.
     */
    sendChat(message: string, targetId?: number): void;

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
    sendAnnouncement(msg: string, targetId?: number, color?: number, style?: string, sound?: number): void;

    /**
     * Changes the admin status of the specified player.
     * @param playerID The id of the player whose admin status to change.
     * @param admin The admin status to set.
     */
    setPlayerAdmin(playerID: number, admin: boolean): void;

    /**
     *  Moves the specified player to a team.
     * @param playerID The id of the player whose team to change.
     * @param team The team in which to move the player to.
     */
    setPlayerTeam(playerID: number, team: number): void;

    /**
     * Kicks the specified player from the room.
     * @param playerID The player to kick.
     * @param reason The reason.
     * @param ban Specifies if the player should also be banned.
     */
    kickPlayer(playerID: number, reason: string, ban: boolean): void;

    /**
     * Clears the ban for a playerId that belonged to a player that was previously banned.
     * @param playerId The id of the player to un-ban.
     */
    clearBan(playerId: number): void;

    /**
     * Clears the list of banned players.
     */
    clearBans(): void;

    /**
     * Sets the score limit of the room (If a game is in progress this method does nothing).
     * @param limit The score limit.
     */
    setScoreLimit(limit: number): void;

    /**
     * Sets the time limit of the room - the limit must be specified in number of minutes (If a game is in progress
     * this method does nothing).
     * @param limitInMinutes The time limit in minutes.
     */
    setTimeLimit(limitInMinutes: number): void;

    /**
     * Parses the stadiumFileContents as a .hbs stadium file and sets it as the selected stadium.
     *
     * There must not be a game in progress, If a game is in progress this method does nothing.
     * @param stadiumFileContents The stadium file contents.
     */
    setCustomStadium(stadiumFileContents: string): void;

    /**
     * Sets the selected stadium to one of the default stadiums. The name must match exactly (case sensitive).
     *
     * There must not be a game in progress, If a game is in progress this method does nothing.
     * @param stadiumName The name of the stadium.
     */
    setDefaultStadium(stadiumName: string): void;

    /**
     *  Sets the teams lock. When teams are locked players are not able to change team unless they are moved by an admin.
     * @param locked True to lock, false to unlock.
     */
    setTeamsLock(locked: boolean): void;

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
    setTeamColors(team: TeamID, angle: number, textColor: number, colors: Int32Array): void;

    /**
     * Starts the game, if a game is already in progress this method does nothing.
     */
    startGame(): void;

    /**
     * Stops the game, if no game is in progress this method does nothing.
     */
    stopGame(): void;

    /**
     * Sets the pause state of the game.
     * @param pauseState True to pause, false to unpause.
     */
    pauseGame(pauseState: boolean): void;

    /**
     * Returns the player with the specified id. Returns null if the player doesn't exist.
     * @param playerId The id of the player to get.
     */
    getPlayer(playerId: number): IPlayerObject;

    /**
     * Returns the current list of players.
     */
    getPlayerList(): IPlayerObject[];

    /**
     * If a game is in progress it returns the current score information, otherwise it returns null.
     */
    getScores(): IScoresObject;

    /**
     * Returns the ball's position in the field or null if no game is in progress.
     */
    getBallPosition(): IPosition;

    /**
     * Starts recording of a haxball replay.
     *
     * Don't forget to call stop recording or it will cause a memory leak.
     */
    startRecording(): void;

    /**
     * Stops the recording previously started with startRecording and returns the replay file contents as a Uint8Array.
     *
     * Returns null if recording was not started or had already been stopped.
     */
    stopRecording(): Uint8Array;

    /**
     * Changes the password of the room.
     * @param pass The password. If null, password will be cleared.
     */
    setPassword(pass: string): void;

    /**
     * Overrides the avatar of the target player. If avatar is set to null the override is cleared and the
     * player will be able to use his own avatar again.
     */
    setPlayerAvatar(playerId: number, avatar: string): void;

    /**
     * Reorders the player list. First all players listed are removed, then they are reinserted in the same order
     * they appear in the playerIdList.
     * @param playerIdList The list of players to reorder.
     * @param moveToTop If true players are inserted at the top of the list, otherwise they are inserted at the bottom of the list.
     */
    reorderPlayers(playerIdList: number[], moveToTop: boolean): void;

    /**
     * Gets the number of discs in the game including the ball and player discs.
     */
    getDiscCount(): number;

    /**
     * Gets the properties of the disc at discIndex. Returns null if discIndex is out of bounds.
     * @param discIndex The index of the disc whose properties to get.
     */
    getDiscProperties(discIndex: number): IDiscPropertiesObject;

    /**
     * Sets properties of the target disc.
     *
     * Properties that are null or undefined will not be set and therefor will preserve whatever value the disc already had.
     * @param discIndex The index of the target disc.
     * @param properties The disc properties to set.
     */
    setDiscProperties(discIndex: number, properties: IDiscPropertiesObject): void;

    /**
     * Gets the properties of the specified player's disc.
     * @param playerId The id of the player whose disc properties to get.
     */
    getPlayerDiscProperties(playerId: number): IDiscPropertiesObject;

    /**
     * Sets properties of the target player's disc.
     *
     * Properties that are null or undefined will not be set and therefor will preserve whatever value the disc already had.
     * @param playerId The id of the player whose disc properties to set.
     * @param properties The disc properties to set.
     */
    setPlayerDiscProperties(playerId: number, properties: IDiscPropertiesObject): void;

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
    setKickRateLimit(min?: number, rate?: number, burst?: number): void;

    /**
     * Activates or deactivates the recaptcha requirement to join the room.
     */
    setRequireRecaptcha(required: boolean): void;

    //#endregion
}