import { Role } from "inversihax";

export class CustomRole extends Role {
    public static readonly Player = new CustomRole(1, "player", 10);
    public static readonly Admin = new CustomRole(2, "admin", 50);
    public static readonly SuperAdmin = new CustomRole(3, "super-admin", 90);
    public static readonly Owner = new CustomRole(4, "owner", 100);

    public readonly weight: number;

    private constructor(id: number, name: string, weight: number) {
        super(id, name);
        this.weight = weight;
    }
}