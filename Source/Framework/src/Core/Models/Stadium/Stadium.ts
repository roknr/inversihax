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
    public name: string;

    /**
     * The stadium width.
     */
    public width: number;

    /**
     * The stadium height.
     */
    public height: number;

    /**
     * The spawn distance - how far from the ball the teams will spawn.
     */
    public spawnDistance: number;

    /**
     * The stadium background.
     */
    public bg: Background;

    /**
     * The collection of vertexes in the stadium.
     */
    public vertexes: Vertex[];

    /**
     * The collection of segments in the stadium.
     */
    public segments: Segment[];

    /**
     * The goals in the stadium.
     */
    public goals: Goal[];

    /**
     * The collection of discs in the stadium.
     */
    public discs: Disc[];

    /**
     * The collection of planes in the stadium.
     */
    public planes: Plane[];

    /**
     * The stadium traits.
     */
    public traits: Traits;

    /**
     * The player physics in the stadium.
     */
    public playerPhysics: PlayerPhysics;

    /**
     * The ball physics in the stadium.
     */
    public ballPhysics: BallPhysics;
}