import { JsonProperty } from "json-typescript-mapper";

/**
 * The stadium traits model.
 */
export class Traits {

    /**
     * The ball area trait.
     */
    public ballArea: Trait = undefined;

    /**
     * The goal post trait.
     */
    public goalPost: Trait = undefined;

    /**
     * The goal net trait.
     */
    public goalNet: Trait = undefined;

    /**
     * The kick off barrier trait.
     */
    public kickOffBarrier: Trait = undefined;
}

/**
 * The stadium trait model.
 */
export class Trait {

    /**
     * Indicates whether the object with this trait is visible or not.
     */
    @JsonProperty("vis")
    public visible: boolean = undefined;

    /**
     * The bounce coefficient.
     */
    @JsonProperty("bCoef")
    public bounceCoefficient: number = undefined;

    /**
     * The collision mask.
     */
    @JsonProperty("cMask")
    public collisionMask: string[] = undefined;

    /**
     * The radius.
     */
    public radius: number = undefined;

    /**
     * The group that the object belongs to.
     */
    @JsonProperty("cGroup")
    public group: string[] = undefined;

    /**
     * The inverse mass of the object.
     */
    @JsonProperty("invMass")
    public inverseMass: number = undefined;
}