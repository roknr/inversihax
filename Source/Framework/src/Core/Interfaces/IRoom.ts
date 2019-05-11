import { IPosition, IScoresObject, TeamID } from "types-haxball-headless-api";
import { Player } from "../Models/Player";
import { TypedEvent } from "../Utility/TypedEvent";

/**
 * Defines the room abstraction functionality.
 * @type {TPlayer} The type of player to use with the room.
 */
export interface IRoom<TPlayer extends Player> {

    //#region Members

    //#region Events

    /**
     * The event that gets fired when a player joins the room.
     * @param player The player that joined.
     */
    readonly onPlayerJoin: TypedEvent<(player: TPlayer) => void>;

    /**
     * The event that gets fired when a player leaves the room.
     * @param player The player that left.
     */
    readonly onPlayerLeave: TypedEvent<(player: TPlayer) => void>;

    /**
     * The event that gets fired when a team wins.
     * @param scores The scores object.
     */
    readonly onTeamVictory: TypedEvent<(scores: IScoresObject) => void>;

    /**
     * The event that gets fired when a player sends a message.
     *
     * The event function can return false in order to filter the chat message. This prevents
     * the chat message from reaching other players in the room.
     * @param player The player that sent the message.
     * @param message The message.
     */
    readonly onPlayerChat: (player: TPlayer, message: string) => boolean;

    /**
     * The event that gets fired when a player kicks the ball.
     * @param player The player that kicked the ball.
     */
    readonly onPlayerBallKick: TypedEvent<(player: TPlayer) => void>;

    /**
     * The event that gets fired when a team scores a goal.
     * @param team The ID of the team that scores the goal.
     */
    readonly onTeamGoal: TypedEvent<(team: TeamID) => void>;

    /**
     * The event that gets fired when the game is started.
     * @param byPlayer The player that started the game (can be null if the event wasn't caused by a player).
     */
    readonly onGameStart: TypedEvent<(byPlayer: TPlayer) => void>;

    /**
     * The event that gets fired when the game is stopped.
     * @param byPlayer The player that stopped the game (can be null if the event wasn't caused by a player).
     */
    readonly onGameStop: TypedEvent<(byPlayer: TPlayer) => void>;

    /**
     * The event that gets fired when the player's admin rights change.
     * @param changedPlayer The player whose rights changed.
     * @param byPlayer The player who changed the rights (can be null if the event wasn't caused by a player).
     */
    readonly onPlayerAdminChange: TypedEvent<(changedPlayer: TPlayer, byPlayer: TPlayer) => void>;

    /**
     * The event that gets fired when the player is moved to a different team.
     * @param changedPlayer The player whose team changed.
     * @param byPlayer The player who changed the other player's team (can be null if the event wasn't caused by a player).
     */
    readonly onPlayerTeamChange: TypedEvent<(changedPlayer: TPlayer, byPlayer: TPlayer) => void>;

    /**
     * The event that gets raised when a player is kicked or banned. This is always called after the onPlayerLeave event.
     * @param kickedPlayer The player that was kicked/banned.
     * @param reason The reason for the kick/ban.
     * @param ban True if it was a ban, false if it was a kick.
     * @param byPlayer The player that kicked/banned the other player (can be null if the event wasn't caused by a player).
     */
    readonly onPlayerKicked: TypedEvent<(kickedPlayer: TPlayer, reason: string, ban: boolean, byPlayer: TPlayer) => void>;

    /**
     * The event that gets raised once for every game tick (happens 60 times per second).
     *
     * This event is not called if the game is paused or stopped.
     */
    readonly onGameTick: TypedEvent<() => void>;

    /**
     * The event that gets raised when the game is paused.
     * @param byPlayer The player that paused the game.
     */
    readonly onGamePause: TypedEvent<(byPlayer: TPlayer) => void>;

    /**
     * The event that gets raised when the game is paused.
     *
     * After this event there's a timer before the game is fully un-paused,
     * to detect when the game has really resumed you can listen for the first onGameTick event after this event is called.
     * @param byPlayer The player that un-paused the game.
     */
    readonly onGameUnpause: TypedEvent<(byPlayer: TPlayer) => void>;

    /**
     * The event that gets raised when the players and ball positions are reset after a goal happens.
     */
    readonly onPositionsReset: TypedEvent<() => void>;

    /**
     * The event that gets raised when a player provides an activity, such as key press.
     * @param player The player that gave the activity.
     */
    readonly onPlayerActivity: TypedEvent<(player: TPlayer) => void>;

    /**
     * The event that gets raised when a player changes the stadium.
     * @param newStadiumName The new stadium name.
     * @param byPlayer The player that changed the stadium.
     */
    readonly onStadiumChange: TypedEvent<(newStadiumName: string, byPlayer: TPlayer) => void>;

    /**
     * The event that gets raised when the room link is obtained.
     * @param url The room link.
     */
    readonly onRoomLink: TypedEvent<(url: string) => void>;

    //#endregion

    //#endregion

    //#region Methods

    /**
    * Sends a chat message using the host player. If targetId is defined the message is sent only to the player with a matching id.
    * @param message The message to send.
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
     * Sets the time limit of the room - the limit must be specified in number of minutes
     * (If a game is in progress this method does nothing).
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
    getPlayer(playerId: number): TPlayer;

    /**
     * Returns the current list of players.
     */
    getPlayerList(): TPlayer[];

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