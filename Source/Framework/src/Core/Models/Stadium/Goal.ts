/**
 * The stadium goal model.
 */
export class Goal {

    /**
     * The coordinates of the fist point of the line in an array form [x, y].
     */
    public p0: number[];

    /**
     * The coordinates of the second point of the line in an array form [x, y].
     */
    public p1: number[];

    /**
     * The team the goal belongs to.
     *
     * Possible values: "red" or "blue".
     */
    public team: "red" | "blue";
}