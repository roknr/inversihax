/**
 * The stadium player physics model.
 */
export class PlayerPhysics {

    /**
     * The bounciness value of the player.
     */
    public bounce: number;

    /**
     * The player acceleration value.
     */
    public acceleration: number;

    /**
     * The player kicking acceleration.
     */
    public kickingAcceleration: number;

    /**
     * The player kicking damping.
     */
    public kickingDamping: number;

    /**
     * The player kick strength.
     */
    public kickStrength: number;
}

/**
 * The stadium ball physics model.
 */
export class BallPhysics {

    /**
     * The bounciness value of the ball.
     */
    public bounce: number;

    /**
     * The inverse mass of the ball.
     */
    public invMass: number;

    /**
     * The damping of the ball.
     */
    public damping: number;

    /**
     * The collision mask of the ball.
     */
    public cMask: string[];

    /**
     * The color of the ball.
     */
    public color: string | number[];

    /**
     * The radius of the ball.
     */
    public radius: number;
}