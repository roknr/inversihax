import { TeamID } from "../../../HeadlessAPI/Enums/TeamID";
import { IPlayerObject } from "../../../HeadlessAPI/Interfaces/IPlayerObject";
import { TypedEvent } from "../../Utility/TypedEvent";
import { IRoom } from "./IRoom";

/**
 * Defines additional utility functionality for a room.
 */
export interface IUtilityRoom extends IRoom {

    //#region Public properties

    /**
     * Gets a value indicating whether the game is currently in progress.
     * If the game is paused, the game is still in progress.
     */
    readonly isGameInProgress: boolean;

    /**
     * Gets a value indicating whether the game is currently paused. Null if game is not in progress.
     */
    readonly isGamePaused: boolean;

    /**
     * Gets all the players in the red team, excluding the host player.
     */
    readonly teamRed: IPlayerObject[];

    /**
     * Gets all the players in the blue team, excluding the host player.
     */
    readonly teamBlue: IPlayerObject[];

    /**
     * Gets all the players in the spectators, excluding the host player.
     */
    readonly teamSpectators: IPlayerObject[];

    /**
     * Gets the player that touched the ball last. Resets to null when the game is started or positions are reset.
     */
    readonly lastTouchBy: IPlayerObject;

    /**
     * Gets the player that touched the ball second before last. Resets to null when the game is started or positions are reset.
     */
    readonly penultimateTouchBy: IPlayerObject;

    /**
     * Gets a value indicating whether the current game state is when the goal has been scored and before the positions
     * have been reset.
     */
    readonly goalScoredBeforePositionsResetState: boolean;

    //#region Events

    /**
     * The event that gets fired when a goal is scored.
     * @param scoredByTeam The team that scored the goal.
     * @param lastTouchBy The player that touched the ball last, before the goal was scored.
     * @param penultimateTouchBy The player that touched the ball second before last, before the goal was scored.
     */
    readonly onGoalScored: TypedEvent<(scoredByTeam: TeamID, lastTouchBy: IPlayerObject, penultimateTouchBy: IPlayerObject) => void>;

    //#endregion

    //#endregion

    //#region Public methods

    /**
     * Returns the current list of players, including or excluding the host player based on the passed in parameter (excluding by default).
     * @param includeHostPlayer Value indicating whether the host player should be included in the returned list of all players.
     */
    getPlayerList(includeHostPlayer?: boolean): IPlayerObject[];

    /**
     * Returns the current list of players in the specified teams, excluding the host player.
     * @param teams The team ids to get the players for.
     */
    getPlayersIn(...teams: TeamID[]): IPlayerObject[];

    /**
     * Swaps the players in the red and blue teams.
     */
    swapTeams(): void;

    /**
     * Restarts the current game, if one is in progress (even if game is paused). Does nothing otherwise.
     */
    restartGame(): void;

    //#endregion
}