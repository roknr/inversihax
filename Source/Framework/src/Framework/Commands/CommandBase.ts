import { injectable } from "inversify";
import * as _ from "lodash";
import { ICommand } from "../../Core/Interfaces/Commands/ICommand";
import { Player } from "../../Core/Models/Player";
import { Role } from "../../Core/Models/Role";

/**
 * The base command class. Derive from it to implement a custom command.
 *
 * Is injectable.
 * @type {TPlayer} The type of player to use with the command.
 * @type {TRole} The type of roles to use with the command.
 */
@injectable()
export abstract class CommandBase<TPlayer extends Player<TRole>, TRole extends Role = Role> implements ICommand<TPlayer> {

    /**
     * The roles that this command allows execution for.
     */
    // TODO: can this somehow be moved to command metadata and be accessed from within this class?
    protected readonly mRoles: Set<Role> = null;

    /**
     * Returns a value indicating whether the specified player is allowed to invoke the command.
     * @param player The player trying to invoke the command.
     */
    public abstract canExecute(player: TPlayer): boolean;

    /**
     * Executes the command by the specified player with the specified arguments.
     * @param player The player executing the command.
     * @param args The arguments to the command.
     */
    public abstract execute(player: TPlayer, args: string[]): void;

    /**
     * Returns a value indicating whether the specified player has access to the command based on his roles.
     * By default this checks if a player's roles contain at least one role that the command specifies. Can be
     * overridden in the derived class to implement custom logic.
     * @param player The player trying to invoke the command.
     */
    protected hasRoleBasedAccess(player: TPlayer): boolean {
        // If command roles are not defined, treat this as no roles necessary for invocation
        if (this.mRoles == null || this.mRoles.size === 0) {
            return true;
        }

        // Otherwise check if there exists such a player role that is also among the command's roles and return the result
        const iterator = player.roles.values();
        let role = iterator.next().value;
        while (role) {
            if (this.mRoles.has(role)) {
                return true;
            }
            role = iterator.next().value;
        }

        return false;
    }
}