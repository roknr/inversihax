/**
 * The stadium vertex model.
 */
export class Vertex {

    /**
     * The vertex's X coordinate.
     */
    public x: number;

    /**
     * The vertex's Y coordinate.
     */
    public y: number;

    /**
     * The trait of the vertex.
     */
    public trait: string;

    /**
     * The collision mask - collection of collision layers.
     */
    public cMask: string[];

    /**
     * The bouncing coefficient.
     */
    public bCoef: number;
}