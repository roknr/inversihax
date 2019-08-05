import { Color } from "./Color";

/**
 * The stadium background model.
 */
export class Background {

    /**
     * The type of background to use for the stadium. Possible values are "grass", "hockey", and "none".
     *
     * Default value: "none".
     */
    public type: "grass" | "hockey" | "none" = "none";

    /**
     * Width of the background rectangle.
     *
     * Default value: 0.
     */
    public width: number = 0;

    /**
     * Height of the background rectangle.
     *
     * Default value: 0.
     */
    public height: number = 0;

    /**
     * Radius of the kickoff circle.
     *
     * Default value: 0.
     */
    public kickOffRadius: number = 0;

    /**
     * Radius of the corners of the circle (creates rounded corners if > 0).
     *
     * Default value: 0.
     */
    public cornerRadius: number = 0;

    /**
     * Horizontal distance to the goals from position <0,0>, used by "hockey" background only.
     *
     * Default value: 0.
     */
    public goalLine: number = 0;

    /**
     * Background color for the stadium.
     *
     * Default value: "718C5A"
     */
    public color: Color = "718C5A";
}