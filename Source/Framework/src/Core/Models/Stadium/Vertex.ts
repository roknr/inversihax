import { JsonProperty } from "json-typescript-mapper";

/**
 * The stadium vertex model.
 */
export class Vertex {

    /**
     * The vertex's X coordinate.
     */
    public x: number = undefined;

    /**
     * The vertex's Y coordinate.
     */
    public y: number = undefined;

    /**
     * The trait of the vertex.
     */
    public trait: string = undefined;

    /**
     * The collision mask - collection of collision layers.
     */
    @JsonProperty("cMask")
    public collisionMask: string[] = undefined;

    /**
     * The bouncing coefficient.
     */
    @JsonProperty("bCoef")
    public bounceCoefficient: number = undefined;
}