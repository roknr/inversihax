/**
 * The stadium plane model.
 *
 * Planes are collision objects that divide the map in two by an infinite line.
 * They are useful for creating the boundaries of the stadium.
 */
export class Plane {

    /**
     * The plane's normal (direction vector) in an array form [x, y].
     */
    public normal: number[];

    /**
     * The distance from coordinates [0, 0] (in direction of the normal) in which the plane is located at.
     */
    public dist: number;

    /**
     * The trait of the plane.
     */
    public trait: string;

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