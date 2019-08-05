import { Color } from "./Color";

/**
 * The stadium disc model.
 *
 * Discs are circular physical objects that are placed in the stadium, they can move and collide with
 * other discs.
 */
export class Disc {

    /**
     * The starting position of the object in array form [x, y].
     */
    public pos: number[];

    /**
     * The disc trait.
     */
    public trait: string;

    /**
     * The starting speed of the object in array form [x, y].
     */
    public speed: number[];

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
     * The damping factor of the disc.
     */
    public damping: number;

    /**
     * The disc fill color. Supports "transparent" color.
     *
     * Default value: "FFFFFF".
     */
    public color: Color = "FFFFFF";

    /**
     * The bouncing coefficient.
     */
    public bCoef: number;

    /**
     * A list of flags that represent this object's collision mask.
     */
    public cMask: string[];

    /**
     * A list of flags that represent this object's collision group.
     */
    public cGroup: string[];
}