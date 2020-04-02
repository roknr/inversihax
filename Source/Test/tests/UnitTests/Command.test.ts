// tslint:disable
import { expect } from "chai";
import { CommandBase, Role, IPlayerObject, IPlayerMetadataService, PlayerMetadata } from "inversihax";
import "mocha";
import * as TypeMoq from "typemoq";
// tslint:enable

class TestRole extends Role {
    public static readonly Admin = new TestRole(1, "admin");
    public static readonly SuperAdmin = new TestRole(2, "super-admin");
    public static readonly Another = new TestRole(3, "another");

    private constructor(id: number, name: string) {
        super(id, name);
    }
}

const playerMetadataServiceMock = TypeMoq.Mock.ofType<IPlayerMetadataService>();
playerMetadataServiceMock
    .setup((x) => x.getMetadataFor(TypeMoq.It.is((p) => p.id === 1)))
    .returns(() => new PlayerMetadata(new Set([TestRole.Admin, TestRole.Another])));
playerMetadataServiceMock
    .setup((x) => x.getMetadataFor(TypeMoq.It.is((p) => p.id === 2)))
    .returns(() => new PlayerMetadata(new Set([TestRole.Admin, TestRole.SuperAdmin])));

class RoleTestCommand extends CommandBase<TestRole> {
    protected mRoles = new Set([TestRole.SuperAdmin]);

    public execute(player: IPlayerObject, args: string[]): void { }

    public canExecute(player: IPlayerObject): boolean {
        return this.hasRoleBasedAccess(player);
    }
}

describe("Command", function () {
    describe("#hasRoleBasedAccess()", function () {
        it("Should return false if using roles and invoking player doesn't satisfy the role constraint", function () {
            const admin = <IPlayerObject>
                { "admin": null, "auth": null, "conn": null, "id": 1, "name": "Admin", "position": null, "team": null };

            const command = new RoleTestCommand(playerMetadataServiceMock.object);

            const canAdminExecute = command.canExecute(admin);
            expect(canAdminExecute).to.be.false;
        });

        it("Should return true if using roles and invoking player satisfies the role constraint", function () {
            const superAdmin = <IPlayerObject>
                { "admin": null, "auth": null, "conn": null, "id": 2, "name": "Super Admin", "position": null, "team": null };

            const command = new RoleTestCommand(playerMetadataServiceMock.object);

            const canSuperAdminExecute = command.canExecute(superAdmin);
            expect(canSuperAdminExecute).to.be.true;
        });
    });
});