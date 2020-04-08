/**
 * The collision flag.
 */
export enum CollisionFlag {

    /**
     * The default collision group of the ball.
     */
    ball = 1 << 0,

    /**
     * The red team collision flag. This layer is automatically added to players of the red team.
     */
    red = 1 << 1,

    /**
     * The blue team collision flag. This layer is automatically added to players of the blue team.
     */
    blue = 1 << 2,

    /**
     * The red KO collision flag. This layer represents kickoff barriers that become active during kickOff for the red team.
     */
    redKO = 1 << 3,

    /**
     * The blue KO collision flag. This layer represents kickoff barriers that become active during kickOff for the blue team.
     */
    blueKO = 1 << 4,

    /**
     * The default collision group for vertexes segments and planes.
     */
    wall = 1 << 5,

    /**
     * Represents a set including ball, red, blue, redKO, blueKO and wall collision flags.
     */
    all = ball | red | blue | redKO | blueKO | wall,

    /**
     * The kick collision flag. Objects with this flag in their cGroup will become kickable by the players.
     */
    kick = 1 << 6,

    /**
     * The score collision flag. Objects with this flag in their cGroup will score goals if they cross a goal line.
     */
    score = 1 << 7,

    /**
     * The c0 collision flag. Has no special meaning and can be used for any purpose.
     */
    c0 = 1 << 28,

    /**
     * The c1 collision flag. Has no special meaning and can be used for any purpose.
     */
    c1 = 1 << 29,

    /**
     * The c2 collision flag. Has no special meaning and can be used for any purpose.
     */
    c2 = 1 << 30,

    /**
     * The c3 collision flag. Has no special meaning and can be used for any purpose.
     */
    c3 = 1 << 31,
}