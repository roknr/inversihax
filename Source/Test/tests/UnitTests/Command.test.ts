// tslint:disable
import { expect } from "chai";
import { CommandBase, Player, Role } from "inversihax";
import "mocha";
// tslint:enable

class TestRole extends Role {
    public static readonly Admin = new TestRole(1, "admin");
    public static readonly SuperAdmin = new TestRole(2, "super-admin");
    public static readonly Another = new TestRole(3, "another");

    private constructor(id: number, name: string) {
        super(id, name);
    }
}

class RoleTestCommand extends CommandBase<Player<TestRole>, TestRole> {
    protected mRoles = new Set([TestRole.SuperAdmin]);

    public execute(player: Player, args: string[]): void { }

    public canExecute(player: Player): boolean {
        return this.hasRoleBasedAccess(player);
    }
}

describe("Command", function () {
    describe("#hasRoleBasedAccess()", function () {
        it("Should return false if using roles and invoking player doesn't satisfy the role constraint", function () {
            const admin = new Player<TestRole>(1, "Admin", null, true, null, null, null, new Set([TestRole.Admin, TestRole.Another]));
            const command = new RoleTestCommand();

            const canAdminExecute = command.canExecute(admin);
            expect(canAdminExecute).to.be.false;
        });

        it("Should return true if using roles and invoking player satisfies the role constraint", function () {
            const superAdmin =
                new Player<TestRole>(1, "Super Admin", null, true, null, null, null, new Set([TestRole.Admin, TestRole.SuperAdmin]));
            const command = new RoleTestCommand();

            const canSuperAdminExecute = command.canExecute(superAdmin);
            expect(canSuperAdminExecute).to.be.true;
        });
    });
});