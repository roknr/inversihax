import { Role } from "./Role";

/**
 * The (base) class for custom player object metadata. Derive from it to implement custom metadata.
 */
export class PlayerMetadata<TRole extends Role = Role> {

    /**
     * The player's roles.
     */
    public readonly roles: Set<TRole> = new Set();

    /**
     * Initializes a new instance of the PlayerMetadataBase class.
     * @param roles The player's roles.
     */
    public constructor(roles: Set<TRole> = null) {

        // Only set the roles if they exist, to not overwrite the empty set
        if (roles != null) {
            this.roles = roles;
        }
    }
}