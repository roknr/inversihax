/**
 * The model for a role that a player can have.
 */
export abstract class Role {

    /**
     * The role identifier.
     */
    public readonly id: number;

    /**
     * The role name.
     */
    public readonly name: string;

    /**
     * Initializes a new instance of the Role class.
     * @param id The role identifier.
     * @param name The name of the role.
     */
    protected constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    /**
     * Returns the string representation of the Role class. The name property be default.
     */
    public toString() {
        return this.name;
    }
}