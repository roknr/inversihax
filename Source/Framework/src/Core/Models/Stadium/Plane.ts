/**
 * The stadium plane model.
 */
export class Plane {

    /**
     * The plane's normal (direction vector).
     */
    public normal: number[];

    /**
     * The distance to point (0, 0);
     */
    public distanceTo0: number;

    /**
     * The trait of the plane.
     */
    public trait: string;

    /**
     * The bounce coefficient of the plane.
     */
    public bCoef: number;

    /**
     * The collision mask of the plane - collection of collision layers.
     */
    public cMask: string[];
}