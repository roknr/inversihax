import { JsonProperty } from "json-typescript-mapper";
import { Background } from "./Background";
import { Disc } from "./Disc";
import { Goal } from "./Goal";
import { BallPhysics, PlayerPhysics } from "./Physics";
import { Plane } from "./Plane";
import { Segment } from "./Segment";
import { Traits } from "./Traits";
import { Vertex } from "./Vertex";

/**
 * The model for a haxball stadium (an .hbs file).
 */
export class Stadium {

    /**
     * The stadium name.
     */
    public name: string = undefined;

    /**
     * The stadium width.
     */
    public width: number = undefined;

    /**
     * The stadium height.
     */
    public height: number = undefined;

    /**
     * The spawn distance - how far from the ball the teams will spawn.
     */
    public spawnDistance: number = undefined;

    /**
     * The stadium background.
     */
    @JsonProperty("bg")
    public background: Background = undefined;

    /**
     * The collection of vertexes in the stadium.
     */
    public vertexes: Vertex[] = undefined;

    /**
     * The collection of segments in the stadium.
     */
    public segments: Segment[] = undefined;

    /**
     * The goals in the stadium.
     */
    public goals: Goal[] = undefined;

    /**
     * The collection of discs in the stadium.
     */
    public discs: Disc[] = undefined;

    /**
     * The collection of planes in the stadium.
     */
    public planes: Plane[] = undefined;

    /**
     * The stadium traits.
     */
    public traits: Traits = undefined;

    /**
     * The player physics in the stadium.
     */
    public playerPhysics: PlayerPhysics = undefined;

    /**
     * The ball physics in the stadium.
     */
    public ballPhysics: BallPhysics = undefined;
}