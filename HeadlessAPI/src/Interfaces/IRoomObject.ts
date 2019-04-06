import { TeamID } from "../Enums/TeamID";
import { IPlayerObject } from "./IPlayerObject";
import { IPosition } from "./IPosition";
import { IScoresObject } from "./IScoresObject";

/**
 * The room object interface.
 */
export interface IRoomObject {

    //#region Members

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
     * The event function can return false in order to filter the chat message. This prevents the chat message from reaching other players in the room.
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
     * Sets the time limit of the room - the limit must be specified in number of minutes (If a game is in progress this method does nothing).
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

    //#endregion
}