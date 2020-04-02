import { inject, injectable } from "inversify";
import { ICommand } from "../../Core/Interfaces/Commands/ICommand";
import { IPlayerMetadataService } from "../../Core/Interfaces/Services/IPlayerMetadataService";
import { Role } from "../../Core/Models/Role";
import { Types } from "../../Core/Utility/Types";
import { IPlayerObject } from "../../HeadlessAPI/Interfaces/IPlayerObject";

/**
 * The base command class. Derive from it to implement a custom command.
 *
 * Is injectable.
 * @type {TRole} The type of roles to use with the command.
 * @type {TPlayerMetadataService} The type of player metadata service to use with the room and command.
 */
@injectable()
export abstract class CommandBase<
    TRole extends Role = Role,
    TPlayerMetadataService extends IPlayerMetadataService = IPlayerMetadataService> implements ICommand {

    //#region Protected members

    /**
     * The roles that this command allows execution for.
     */
    // TODO: can this somehow be moved to command metadata and be accessed from within this class?
    protected readonly mRoles: Set<TRole> = null;

    /**
     * The player metadata service.
     */
    protected readonly mPlayerMetadataService: TPlayerMetadataService;

    //#endregion

    //#region Constructor

    /**
     * Initializes a new instance of the CommandBase class.
     * @param playerMetadataService The player metadata service.
     */
    public constructor(@inject(Types.IPlayerMetadataService) playerMetadataService: TPlayerMetadataService) {
        this.mPlayerMetadataService = playerMetadataService;
    }

    //#endregion

    //#region Public methods

    /**
     * Returns a value indicating whether the specified player is allowed to invoke the command.
     * @param player The player trying to invoke the command.
     */
    public abstract canExecute(player: IPlayerObject): boolean;

    /**
     * Executes the command by the specified player with the specified arguments.
     * @param player The player executing the command.
     * @param args The arguments to the command.
     */
    public abstract execute(player: IPlayerObject, args: string[]): void;

    //#endregion

    //#region Protected methods

    /**
     * Returns a value indicating whether the specified player has access to the command based on his roles.
     * By default this checks if a player's roles contain at least one role that the command specifies. Can be
     * overridden in the derived class to implement custom logic.
     * @param player The player trying to invoke the command.
     */
    protected hasRoleBasedAccess(player: IPlayerObject): boolean {
        // If command roles are not defined, treat this as no roles necessary for invocation
        if (this.mRoles == null || this.mRoles.size === 0) {
            return true;
        }

        // Otherwise get the player's roles from his metadata
        const playerRoles = this.mPlayerMetadataService.getMetadataFor(player).roles;

        // And check if there exists such a player role that is also among the command's roles and return the result
        const iterator = playerRoles.values();
        let role = <TRole>iterator.next().value;
        while (role) {
            if (this.mRoles.has(role)) {
                return true;
            }

            role = iterator.next().value;
        }

        return false;
    }

    //#endregion
}