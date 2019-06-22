import { JsonProperty } from "json-typescript-mapper";

/**
 * The stadium disc model.
 */
export class Disc {

    /**
     * The position of the disc. An array of two numbers that represent coordinates.
     */
    @JsonProperty("pos")
    public position: number[] = undefined;

    /**
     * The disc trait.
     */
    public trait: string = undefined;

    /**
     * The color of the disc.
     */
    public color: string | number[] = undefined;

    /**
     * The radius of the disc.
     */
    public radius: number = undefined;

    /**
     * The inverse of the mass for the disc.
     */
    @JsonProperty("invMass")
    public inverseMass: number = undefined;
}