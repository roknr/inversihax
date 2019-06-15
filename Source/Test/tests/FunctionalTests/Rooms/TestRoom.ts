import { inject } from "inversify";
import { IChatMessageInterceptorFactoryType, IPlayerService, Player, RoomBase, Types } from "inversihax";
import { IRoomConfigObject, IRoomObject } from "types-haxball-headless-api";

export class TestRoom extends RoomBase<Player> {

    public constructor(
        @inject(Types.IRoomConfigObject) roomConfig: IRoomConfigObject,
        @inject(Types.IPlayerService) PlayerService: IPlayerService<Player>,
        @inject(Types.IChatMessageInterceptorFactory) chatMessageInterceptorFactory: IChatMessageInterceptorFactoryType,
    ) {
        super(roomConfig, PlayerService, chatMessageInterceptorFactory);
    }

    /**
     * Override for the initialize room method, so that we can use a mock room object, since HBInit only exists in the browser.
     */
    protected initialize(): IRoomObject {
        return {} as any;
    }
}