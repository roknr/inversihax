// ----------------
// -     CORE     -
// ----------------
// -Enums
//  --Chat
export { ChatMessageSound } from "./Core/Enums/Chat/ChatMessageSound";
export { ChatMessageStyle } from "./Core/Enums/Chat/ChatMessageStyle";
// -Interfaces
//  --BackgroundTask
export { IBackgroundTask } from "./Core/Interfaces/BackgroundTask/IBackgroundTask";
//  --Commands
export { ICommand } from "./Core/Interfaces/Commands/ICommand";
//  --Interceptors
export { IChatMessageInterceptor } from "./Core/Interfaces/Interceptors/IChatMessageInterceptor";
//  --Metadata
export { ICommandMetadata } from "./Core/Interfaces/Metadata/ICommandMetadata";
//  --Parsers
export { IChatMessageParser } from "./Core/Interfaces/Parsers/IChatMessageParser";
export { IParser } from "./Core/Interfaces/Parsers/IParser";
export { IStadiumParser } from "./Core/Interfaces/Parsers/IStadiumParser";
//  -- Room
export { IRoom } from "./Core/Interfaces/Room/IRoom";
export { IUtilityRoom } from "./Core/Interfaces/Room/IUtilityRoom";
//  --Services
export { ICommandService } from "./Core/Interfaces/Services/ICommandService";
export { IEmojiService } from "./Core/Interfaces/Services/IEmojiService";
export { IPlayerMetadataService } from "./Core/Interfaces/Services/IPlayerMetadataService";
// -Models
export { ChatMessage } from "./Core/Models/ChatMessage";
export { PlayerMetadata } from "./Core/Models/PlayerMetadata";
export { Role } from "./Core/Models/Role";
//  --Options
export { CommandOptions } from "./Core/Models/Options/CommandOptions";
export { EmojiOptions } from "./Core/Models/Options/EmojiOptions";
//  --Stadium
export { Background } from "./Core/Models/Stadium/Background";
export { Color } from "./Core/Models/Stadium/Color";
export { Disc } from "./Core/Models/Stadium/Disc";
export { Goal } from "./Core/Models/Stadium/Goal";
export { Joint } from "./Core/Models/Stadium/Joint";
export { Plane } from "./Core/Models/Stadium/Plane";
export { PlayerPhysics } from "./Core/Models/Stadium/PlayerPhysics";
export { Segment } from "./Core/Models/Stadium/Segment";
export { Stadium } from "./Core/Models/Stadium/Stadium";
export { Traits, Trait } from "./Core/Models/Stadium/Traits";
export { Vertex } from "./Core/Models/Stadium/Vertex";
// -Utility
export { TypedEvent } from "./Core/Utility/TypedEvent";
export {
    ConstructorType,
    Types,
    ICommandFactoryType,
    IChatMessageInterceptorFactoryType,
} from "./Core/Utility/Types";
export { Constants } from "./Core/Utility/Constants";
//  --Decorators
export { CommandDecorator } from "./Core/Utility/Decorators/CommandDecorator";

// ----------------
// -   FRAMEWORK  -
// ----------------
// -Commands
export { CommandBase } from "./Framework/Commands/CommandBase";
// -Parsers
export { ChatMessageParser } from "./Framework/Parsers/ChatMessageParser";
export { ParserBase } from "./Framework/Parsers/ParserBase";
export { StadiumParser } from "./Framework/Parsers/StadiumParser";
// -Room
export { RoomBase } from "./Framework/Room/RoomBase";
export { UtilityRoomBase } from "./Framework/Room/UtilityRoomBase";
// -Services
export { CommandService } from "./Framework/Services/CommandService";
export { EmojiService } from "./Framework/Services/EmojiService";
export { PlayerMetadataService } from "./Framework/Services/PlayerMetadataService";
// -Startup
export { StartupBase } from "./Framework/Startup/StartupBase";
export { RoomHostBuilder } from "./Framework/Startup/RoomHostBuilder";

// ----------------
// - HEADLESS API -
// ----------------
import { IRoomConfigObject } from "./HeadlessAPI/Interfaces/IRoomConfigObject";
import { IRoomObject } from "./HeadlessAPI/Interfaces/IRoomObject";
// -Enums
export { CollisionFlag } from "./HeadlessAPI/Enums/CollisionFlag";
export { TeamID } from "./HeadlessAPI/Enums/TeamID";
// -Interfaces
export { ICollisionFlagsObject } from "./HeadlessAPI/Interfaces/ICollisionFlagsObject";
export { IDiscPropertiesObject } from "./HeadlessAPI/Interfaces/IDiscPropertiesObject";
export { IGeo } from "./HeadlessAPI/Interfaces/IGeo";
export { IPlayerObject } from "./HeadlessAPI/Interfaces/IPlayerObject";
export { IPosition } from "./HeadlessAPI/Interfaces/IPosition";
export { IRoomConfigObject } from "./HeadlessAPI/Interfaces/IRoomConfigObject";
export { IRoomObject } from "./HeadlessAPI/Interfaces/IRoomObject";
export { IScoresObject } from "./HeadlessAPI/Interfaces/IScoresObject";

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