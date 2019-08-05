import { Color } from "./Color";

/**
 * The stadium segment model.
 *
 * A segment is a line (curved or straight) that connects two vertexes.
 * Discs can collide with segments and they can also be used as decoration.
 */
export class Segment {

    /**
     * Index of a vertex in the stadium vertex list to be used as first point of the segment.
     */
    public v0: number;

    /**
     * Index of a vertex in the stadium vertex list to be used as the second point of the segment.
     */
    public v1: number;

    /**
     * The bouncing coefficient.
     */
    public bCoef: number;

    /**
     * The angle in degrees with which the segment will curve forming an arc between it's two vertexes.
     *
     * Default value is 0 which makes the segment a straight line.
     */
    public curve: number = 0;

    /**
     * Alternative representation of the segment's curve. If this value is present the curve value will be ignored.
     *
     * This value is only useful for exporting stadiums without precision loss, it is recommended to remove curveF and use
     * only curve when editing an exported stadium.
     */
    public curveF: number;

    /**
     * If set to 0 the segment will collide normally on both sides.
     *
     * If greater or lower than 0 the bias determines the thickness of the segment. The segment also becomes a one-way
     * segment that collides only in one of it's sides.
     *
     * This property can be useful to create boundaries that small and fast moving balls are unable to pass through.
     *
     * Default value: 0
     */
    public bias: number = 0;

    /**
     * A list of flags that represent this object's collision mask.
     */
    public cMask: string[];

    /**
     * A list of flags that represent this object's collision group.
     */
    public cGroup: string[];

    /**
     * If set to false the segment will be invisible.
     *
     * Default value: true.
     */
    public vis: boolean = true;

    /**
     * The color with which the segment will be drawn.
     *
     * Default value: "000000" (black).
     */
    public color: Color;

    /**
     * The trait of the segment.
     */
    public trait: string;
}