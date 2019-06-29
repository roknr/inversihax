import { JsonProperty } from "json-typescript-mapper";

/**
 * The stadium plane model.
 */
export class Plane {

    /**
     * The plane's normal (direction vector).
     */
    public normal: number[] = undefined;

    /**
     * The distance to point (0, 0);
     */
    public distanceTo0: number = undefined;

    /**
     * The trait of the plane.
     */
    public trait: string = undefined;

    /**
     * The bounce coefficient of the plane.
     */
    @JsonProperty("bCoef")
    public bounceCoefficient: number = undefined;

    /**
     * The collision mask of the plane - collection of collision layers.
     */
    @JsonProperty("cMask")
    public collisionMask: string[] = undefined;
}