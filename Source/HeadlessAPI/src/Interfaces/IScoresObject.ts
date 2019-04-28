/**
 * The scores object interface.
 */
export interface IScoresObject {

    /**
     * The number of goals scored by the red team.
     */
    red: number;

    /**
     * The number of goals scored by the blue team.
     */
    blue: number;

    /**
     * The number of seconds elapsed (seconds don't advance while the game is paused).
     */
    time: number;

    /**
     * The score limit for the game.
     */
    scoreLimit: number;

    /**
     * The time limit for the game.
     */
    timeLimit: number;
}