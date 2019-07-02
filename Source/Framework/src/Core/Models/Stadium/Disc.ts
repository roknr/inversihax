/**
 * The stadium disc model.
 */
export class Disc {

    /**
     * The position of the disc. An array of two numbers that represent coordinates.
     */
    public pos: number[];

    /**
     * The disc trait.
     */
    public trait: string;

    /**
     * The color of the disc.
     */
    public color: string | number[];

    /**
     * The radius of the disc.
     */
    public radius: number;

    /**
     * The inverse of the mass for the disc.
     */
    public invMass: number;
}