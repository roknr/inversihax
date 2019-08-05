/**
 * The collision flags interface. Provides collision flag constants - like an enum.
 */
export interface ICollisionFlagsObject {

    /**
     * The ball collision flag.
     */
    readonly ball: number;

    /**
     * The red team collision flag.
     */
    readonly red: number;

    /**
     * The blue team collision flag.
     */
    readonly blue: number;

    /**
     * The red KO collision flag.
     */
    readonly redKO: number;

    /**
     * The blue KO collision flag.
     */
    readonly blueKO: number;

    /**
     * The wall collision flag.
     */
    readonly wall: number;

    /**
     * The kick collision flag.
     */
    readonly kick: number;

    /**
     * The all collision flag.
     */
    readonly all: number;

    /**
     * The score collision flag.
     */
    readonly score: number;

    /**
     * The c0 collision flag.
     */
    readonly c0: number;

    /**
     * The c1 collision flag.
     */
    readonly c1: number;

    /**
     * The c2 collision flag.
     */
    readonly c2: number;

    /**
     * The c3 collision flag.
     */
    readonly c3: number;
}