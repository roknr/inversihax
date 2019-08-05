/**
 * The stadium player physics model.
 *
 * PlayerPhysics describes physical constants affecting the players.
 */
export class PlayerPhysics {

    /**
     * The gravity vector of the object in array form [x, y].
     */
    public gravity: number[];

    /**
     * The radius of the disc.
     */
    public radius: number;

    /**
     * The inverse of the disc's mass.
     */
    public invMass: number;

    /**
     * The bouncing coefficient.
     */
    public bCoef: number;

    /**
     * The damping factor of the disc.
     */
    public damping: number;

    /**
     * A list of flags that represent this object's collision group.
     */
    public cGroup: string[];

    /**
     * How fast a player accelerates when moving around with his keys.
     */
    public acceleration: number;

    /**
     * Replaces acceleration when the player is holding the kick button.
     */
    public kickingAcceleration: number;

    /**
     * Replaces damping when the player is holding the kick button.
     */
    public kickingDamping: number;

    /**
     * How much force the player applies to the a ball when kicking.
     */
    public kickStrength: number;

    /**
     * Much like kickStrength but it's applied to the kicking player instead.
     */
    public kickBack: number;
}