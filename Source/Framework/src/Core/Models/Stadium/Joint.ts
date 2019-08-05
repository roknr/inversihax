import { Color } from "./Color";

/**
 * The stadium joint model.
 *
 * Joints are physical connections between two Discs.
 */
export class Joint {

    /**
     * Index of one of the two discs connected by the joint.
     *
     * Note: Index 0 will be used by the ball disc if StadiumObject.ballPhysics is not set to "disc0".
     */
    public d0: number;

    /**
     * Index of one of the two discs connected by the joint.
     *
     * Note: Index 0 will be used by the ball disc if StadiumObject.ballPhysics is not set to "disc0".
     */
    public d1: number;

    /**
     * If set to null then the length will be automatically computed to match the distance between the two discs connected by the joint.
     *
     * If set to a float value then the joint will use that as length.
     *
     * If set to a 2 elements array [min, max] then the joint will have a min length and max length. The joint will apply no forces if the
     * distance between the discs is inside of that range.
     *
     * Default value: null.
     */
    public length: number | number[] | null = null;

    /**
     * If set to "rigid" then the joint acts like a solid.
     *
     * If set to a float value then the joint will act like a spring.
     *
     * Default value: "rigid".
     */
    public strength: number | "rigid" = "rigid";

    /**
     * The color of the joint. Supports "transparent" color.
     *
     * Default value: "000000" (black).
     */
    public color: Color = "000000";
}