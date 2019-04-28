import { IRoomConfigObject } from "./Interfaces/IRoomConfigObject";
import { IRoomObject } from "./Interfaces/IRoomObject";

export { TeamID } from "./Enums/TeamID";

export { IGeo } from "./Interfaces/IGeo";
export { IPlayerObject } from "./Interfaces/IPlayerObject";
export { IPosition } from "./Interfaces/IPosition";
export { IRoomConfigObject } from "./Interfaces/IRoomConfigObject";
export { IRoomObject } from "./Interfaces/IRoomObject";
export { IScoresObject } from "./Interfaces/IScoresObject";

// Declare the HBInit function on the global (window), so that it can be used from dependent
// modules and correctly transpiled into JS code when building for the browser.
declare global {

    interface Window {  // tslint:disable-line

        /**
         * Declaration of the global window.HBInit function available in the Headless host API.
         *
         * Should only be called once, when initializing the room.
         * @param roomConfig The room configuration object.
         */
        HBInit: (roomConfig: IRoomConfigObject) => IRoomObject;
    }
}