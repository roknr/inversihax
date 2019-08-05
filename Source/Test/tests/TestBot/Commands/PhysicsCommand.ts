import { inject } from "inversify";
import { CommandBase, CommandDecorator, IDiscPropertiesObject, Types } from "inversihax";
import { CustomPlayer } from "../Models/CustomPlayer";
import { ICustomRoom } from "../Room/ICustomRoom";

@CommandDecorator({
    names: ["p"],
})
export class PhysicsCommand extends CommandBase<CustomPlayer> {

    private readonly mRoom: ICustomRoom;

    public constructor(
        @inject(Types.IRoom) room: ICustomRoom,
    ) {
        super();

        this.mRoom = room;
    }

    public canExecute(player: CustomPlayer): boolean {
        return true;
    }

    public execute(player: CustomPlayer, args: string[]): void {
        let increase: boolean;
        if (args[0] === "+") {
            increase = true;
        }
        else if (args[0] === "-") {
            increase = false;
        }
        else {
            return;
        }

        let playerDiscProps = this.mRoom.getPlayerDiscProperties(player.id);
        let props = <IDiscPropertiesObject>{};

        if (increase) {
            props.xgravity = playerDiscProps.xgravity + 0.01;
            props.ygravity = playerDiscProps.ygravity + 0.01;
        }
        else {
            props.xgravity = playerDiscProps.xgravity - 0.01;
            props.ygravity = playerDiscProps.ygravity - 0.01;
        }

        this.mRoom.setPlayerDiscProperties(player.id, props);
    }
}