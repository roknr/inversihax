import { inject } from "inversify";
import { ChatMessage, IChatMessageInterceptorFactoryType, IChatMessageParser, IPlayerService, Player, RoomBase, Types } from "inversihax";
import { IRoomConfigObject, IRoomObject } from "types-haxball-headless-api";

export class TestRoom extends RoomBase<Player> {

    public constructor(
        @inject(Types.IRoomConfigObject) roomConfig: IRoomConfigObject,
        @inject(Types.IPlayerService) PlayerService: IPlayerService<Player>,
        @inject(Types.IChatMessageInterceptorFactory) chatMessageInterceptorFactory: IChatMessageInterceptorFactoryType,
        @inject(Types.IChatMessageParser) chatMessageParser: IChatMessageParser<ChatMessage<Player>>,
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