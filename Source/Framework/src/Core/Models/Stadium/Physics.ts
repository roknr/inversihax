import { JsonProperty } from "json-typescript-mapper";

/**
 * The stadium player physics model.
 */
export class PlayerPhysics {

    /**
     * The bounciness value of the player.
     */
    public bounce: number = undefined;

    /**
     * The player acceleration value.
     */
    public acceleration: number = undefined;

    /**
     * The player kicking acceleration.
     */
    public kickingAcceleration: number = undefined;

    /**
     * The player kicking damping.
     */
    public kickingDamping: number = undefined;

    /**
     * The player kick strength.
     */
    public kickStrength: number = undefined;
}

/**
 * The stadium ball physics model.
 */
export class BallPhysics {

    /**
     * The bounciness value of the ball.
     */
    public bounce: number = undefined;

    /**
     * The inverse mass of the ball.
     */
    @JsonProperty("invMass")
    public inverseMass: number = undefined;

    /**
     * The damping of the ball.
     */
    public damping: number = undefined;

    /**
     * The collision mask of the ball.
     */
    @JsonProperty("cMask")
    public collisionMask: string[] = undefined;

    /**
     * The color of the ball.
     */
    public color: string | number[] = undefined;

    /**
     * The radius of the ball.
     */
    public radius: number = undefined;
}