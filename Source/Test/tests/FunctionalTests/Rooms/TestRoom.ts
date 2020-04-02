import { inject } from "inversify";
import {
    IChatMessageInterceptorFactoryType,
    IChatMessageParser,
    IPlayerMetadataService,
    IRoomConfigObject,
    IRoomObject,
    RoomBase,
    Types,
} from "inversihax";

export class TestRoom extends RoomBase {

    public constructor(
        @inject(Types.IRoomConfigObject) roomConfig: IRoomConfigObject,
        @inject(Types.IPlayerMetadataService) PlayerService: IPlayerMetadataService,
        @inject(Types.IChatMessageInterceptorFactory) chatMessageInterceptorFactory: IChatMessageInterceptorFactoryType,
        @inject(Types.IChatMessageParser) chatMessageParser: IChatMessageParser,
    ) {
        super(roomConfig, PlayerService, chatMessageInterceptorFactory, chatMessageParser);
    }

    /**
     * Override for the initialize room method, so that we can use a mock room object, since HBInit only exists in the browser.
     */
    protected initialize(): IRoomObject {
        return {} as any;
    }
}