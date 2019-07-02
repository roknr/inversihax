/**
 * The stadium traits model.
 */
export class Traits {

    /**
     * The ball area trait.
     */
    public ballArea: Trait;

    /**
     * The goal post trait.
     */
    public goalPost: Trait;

    /**
     * The goal net trait.
     */
    public goalNet: Trait;

    /**
     * The kick off barrier trait.
     */
    public kickOffBarrier: Trait;
}

/**
 * The stadium trait model.
 */
export class Trait {

    /**
     * Indicates whether the object with this trait is visible or not.
     */
    public vis: boolean;

    /**
     * The bounce coefficient.
     */
    public bCoef: number;

    /**
     * The collision mask.
     */
    public cMask: string[];

    /**
     * The radius.
     */
    public radius: number;

    /**
     * The group that the object belongs to.
     */
    public cGroup: string[];

    /**
     * The inverse mass of the object.
     */
    public invMass: number;
}