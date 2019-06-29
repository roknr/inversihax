/**
 * The stadium goal model.
 */
export class Goal {

    /**
     * The first point of the goal. An array of two numbers that represent coordinates.
     */
    public point1: number[] = undefined;

    /**
     * The second point of the goal. An array of two numbers that represent coordinates.
     */
    public point2: number[] = undefined;

    /**
     * The team whose goal this is.
     */
    public team: "red" | "blue" = undefined;
}