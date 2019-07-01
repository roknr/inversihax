import { Role } from "inversihax";

/**
 * Our custom role model.
 */
export class InversihaxRole extends Role {

    // Our custom roles. We can use them like enums.
    public static readonly Player = new InversihaxRole(1, "player");
    public static readonly Admin = new InversihaxRole(1, "admin");
    public static readonly SuperAdmin = new InversihaxRole(1, "super-admin");

    /**
     * Private constructor so no instance can be created outside of this class, so that
     * we can use this class like an enum.
     * @param id The role id.
     * @param name The role name.
     */
    private constructor(id: number, name: string) {
        super(id, name);
    }
}