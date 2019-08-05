import { Background } from "./Background";
import { Disc } from "./Disc";
import { Goal } from "./Goal";
import { Joint } from "./Joint";
import { Plane } from "./Plane";
import { PlayerPhysics } from "./PlayerPhysics";
import { Segment } from "./Segment";
import { Traits } from "./Traits";
import { Vertex } from "./Vertex";

/**
 * The model for a haxball stadium (an .hbs file).
 */
export class Stadium<
    TBackground extends Background = Background,
    TVertex extends Vertex = Vertex,
    TSegment extends Segment = Segment,
    TGoal extends Goal = Goal,
    TPlane extends Plane = Plane,
    TDisc extends Disc = Disc,
    TPlayerPhysics extends PlayerPhysics = PlayerPhysics,
    TJoint extends Joint = Joint> {

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
     * The width of a rectangle centered in coordinates <0,0> in which the camera will be contained.
     * The camera follows the player and ball until it reaches the bounds of this rectangle.
     */
    public cameraWidth: number;

    /**
     * The height of a rectangle centered in coordinates <0,0> in which the camera will be contained.
     * The camera follows the player and ball until it reaches the bounds of this rectangle.
     */
    public cameraHeight: number;

    /**
     * The maximum allowed viewable width for the level. If the player screen were wide enough
     * for him to see more width than maxViewWidth then the game will zoom in to prevent that.
     * Setting maxViewWidth to 0 disables this feature.
     *
     * Default value: 0.
     */
    public maxViewWidth: number = 0;

    /**
     * Changes the camera following behavior.
     *
     * If set to "player" the camera will follow the player only, ignoring the ball.
     *
     * If set to "ball" the camera will follow the average position between the player and the ball,
     * the camera will prioritize the player in case player and ball are too far apart.
     *
     * Default value: "ball".
     */
    public cameraFollow: "player" | "ball" = "ball";

    /**
     * The distance from <0,0> at which the teams will spawn during kickoff.
     * This value is ignored if redSpawnPoints or blueSpawnPoints are not empty.
     */
    public spawnDistance: number;

    /**
     * This value defines whether this stadium can be stored with the /store command.
     *
     * Default value: true.
     */
    public canBeStored: boolean = true;

    /**
     * Can be set to either "full" or "partial".
     * When set to "partial" only the ball and player discs are reset for the kickoff.
     * When set to "full" all discs will be reset for the kickoff.
     *
     * Default value: "partial".
     */
    public kickOffReset: "full" | "partial" = "partial";

    /**
     * The stadium background.
     */
    public bg: TBackground;

    /**
     * The stadium traits.
     */
    public traits: Traits;

    /**
     * The collection of vertexes in the stadium.
     */
    public vertexes: TVertex[];

    /**
     * The collection of segments in the stadium.
     */
    public segments: TSegment[];

    /**
     * The goals in the stadium.
     */
    public goals: TGoal[];

    /**
     * The collection of discs in the stadium.
     */
    public discs: TDisc[];

    /**
     * The collection of planes in the stadium.
     */
    public planes: TPlane[];

    /**
     * The collection of joints in the stadium.
     */
    public joints: TJoint[];

    /**
     * List of spawn points used for the red team kickoff.
     * If the list is empty then the default spawn behavior is employed.

     * When a player is moved into a team after a game has started he will be positioned in the last
     * point in this list. (Unless the list is empty in which case the old spawn behavior is employed).
     *
     * Example: "redSpawnPoints" : [[100, 0], [100, 30], [100, -30], [100, 60], [100, -60], [130,0]]

     * Default value: [].
     */
    public redSpawnPoints: number[][];

    /**
     * List of spawn points used for the blue team kickoff.
     * If the list is empty then the default spawn behavior is employed.

     * When a player is moved into a team after a game has started he will be positioned in the last
     * point in this list. (Unless the list is empty in which case the old spawn behavior is employed).
     *
     * Example: "blueSpawnPoints" : [[100, 0], [100, 30], [100, -30], [100, 60], [100, -60], [130,0]]

     * Default value: [].
     */
    public blueSpawnPoints: number[][];

    /**
     * Object describing the player physics.
     *
     * If omitted player default player physics will be used.
     */
    public playerPhysics: TPlayerPhysics;

    /**
     * The Disc used to create the ball. The collision flags "kick" and "score" will be automatically added.
     *
     * Setting ballPhysics to the string "disc0" will instead use the first disc as the ball.
     * In this case the cGroup will be left unmodified.
     *
     * If omitted default ball physics will be used.
     */
    public ballPhysics: Disc | "disc0";
}