/**
 * The stadium vertex model.
 *
 * A vertex is a point which can collide with discs but cannot move and is not visible.
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