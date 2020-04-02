// tslint:disable
import "reflect-metadata";
import { expect } from "chai";
import { Container } from "inversify";
import { CommandBase, CommandDecorator, ICommand, Types, IPlayerObject, IPlayerMetadataService } from "inversihax";
import { ICommandMetadataInternal } from "inversihax/lib/Core/Interfaces/Metadata/ICommandMetadata";
import { MetadataKeys } from "inversihax/lib/Core/Utility/Constants";
import { DecoratorsHelper } from "inversihax/lib/Core/Utility/Helpers/DecoratorsHelper";
import "mocha";
// tslint:enable

const ConstantsLocal = {
    CommandName1: "test",
    CommandName2: "t",
    CommandName3: "testCommand",
};

describe("CommandDecorator", function () {

    // This runs after each test to clear attached metadata from previous tests
    beforeEach((done) => {
        Reflect.deleteMetadata(MetadataKeys.Command, Reflect);
        done();
    });

    it("Should attach command metadata to the object being decorated with the @CommandDecorator", function () {
        @CommandDecorator({
            names: [ConstantsLocal.CommandName1, ConstantsLocal.CommandName2, ConstantsLocal.CommandName3],
        })
        class TestCommand extends CommandBase {

            public execute(player: IPlayerObject, args: string[]): void { }

            public canExecute(player: IPlayerObject): boolean {
                return true;
            }
        }

        const metadata = DecoratorsHelper.getMetadata<ICommandMetadataInternal>(MetadataKeys.Command, TestCommand);

        expect(metadata.metadata.names)
            .to.have.all.members([ConstantsLocal.CommandName1, ConstantsLocal.CommandName2, ConstantsLocal.CommandName3]);
        expect(metadata.target).to.equal(TestCommand);
    });

    it("Should be able to get instantiated by inversify", function () {
        //#region Test commands

        @CommandDecorator({
            names: [ConstantsLocal.CommandName1, ConstantsLocal.CommandName2],
        })
        class TestCommand1 extends CommandBase<IPlayerObject> {

            public execute(player: IPlayerObject, args: string[]): void {
                throw new Error();
            }

            public canExecute(player: IPlayerObject): boolean {
                return true;
            }
        }

        @CommandDecorator({
            names: [ConstantsLocal.CommandName3],
        })
        class TestCommand2 extends CommandBase {

            public execute(player: IPlayerObject, args: string[]): void {
                throw new Error();
            }

            public canExecute(player: IPlayerObject): boolean {
                return true;
            }
        }

        //#endregion

        const container = new Container();

        // We need to bind something to IPlayerMetadataService because it is required in the CommandBase constructor
        // but not needed in this test so it can be null
        container
            .bind<IPlayerMetadataService>(Types.IPlayerMetadataService)
            .toConstantValue(null);

        const commandsMetadata = DecoratorsHelper.getCommandsMetadata();

        commandsMetadata.forEach((commandMetadata) => {
            const commandName = commandMetadata.target.name;
            container.bind<ICommand>(Types.ICommand).to(commandMetadata.target as any).whenTargetNamed(commandName);

            // Assert that the commands are of type CommandBase
            expect(commandMetadata.target.prototype).to.be.an.instanceOf(CommandBase);

            const command = container.getNamed<ICommand>(Types.ICommand, commandName);

            // Assert that canExecute returns true and execute throws an error, like defined in the commands
            expect(command.canExecute(null)).to.be.true;
            expect(function () { command.execute(null, null); }).to.throw();
        });
    });
});