import { inject } from "inversify";
import { StartupBase, Types, IRoom, Player } from "inversihax";

/**
 * Our startup class where we can configure any services through dependency injection.
 * We don't need it in this example, so we only need to provide a constructor that takes an IRoom
 */
export class Startup extends StartupBase {

    // Use the type identifiers from the Inversihax Types object
    public constructor(@inject(Types.IRoom) room: IRoom<Player>) {
        super(room);
    }

    configure(): void {
        // Empty as we need no special configuration in this example
    }
}