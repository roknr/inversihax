/**
 * The stadium segment model.
 */
export class Segment {

    /**
     * The ID of the first vertex this segment connects.
     */
    public v0: number;

    /**
     * The ID of the second vertex this segment connects.
     */
    public v1: number;

    /**
     * The angle of how much this segment curves.
     */
    public curve: number;

    /**
     * The flag indicating whether this segment is visible or not.
     */
    public vis: boolean;

    /**
     * The color of the segment. Can be defined as a HEX string or array of numbers (3 RGB values).
     */
    public color: string | number[];
}