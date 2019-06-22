import { JsonProperty } from "json-typescript-mapper";

/**
 * The stadium segment model.
 */
export class Segment {

    /**
     * The ID of the first vertex this segment connects.
     */
    @JsonProperty("v0")
    public vertex1Id: number = undefined;

    /**
     * The ID of the second vertex this segment connects.
     */
    @JsonProperty("v1")
    public vertex2Id: number = undefined;

    /**
     * The angle of how much this segment curves.
     */
    public curve: number = undefined;

    /**
     * The flag indicating whether this segment is visible or not.
     */
    @JsonProperty("vis")
    public visible: boolean = undefined;

    /**
     * The color of the segment. Can be defined as a HEX string or array of numbers (3 RGB values).
     */
    public color: string | number[] = undefined;
}