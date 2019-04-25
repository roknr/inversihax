import { expect } from "chai";
import { Container } from "inversify";
import "mocha";
import "reflect-metadata";
import {
    CommandBase, CommandDecorator, DecoratorsHelper, ICommand, ICommandMetadataInternal, MetadataKeys, Player, Types,
} from "types-haxframework-core";
const Constants = {
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
            names: [Constants.CommandName1, Constants.CommandName2, Constants.CommandName3],
        })
        class TestCommand extends CommandBase<Player> {

            public execute(player: Player, args: string[]): void { }

            public canExecute(player: Player, args: string[]): boolean {
                return true;
            }
        }

        const metadata = DecoratorsHelper.getMetadata<ICommandMetadataInternal>(MetadataKeys.Command, TestCommand);

        expect(metadata.names).to.have.all.members([Constants.CommandName1, Constants.CommandName2, Constants.CommandName3]);
        expect(metadata.target).to.equal(TestCommand);
    });

    it("Should be able to get instantiated by inversify", function () {
        //#region Test commands

        @CommandDecorator({
            names: [Constants.CommandName1, Constants.CommandName2],
        })
        class TestCommand1 extends CommandBase<Player> {

            public execute(player: Player, args: string[]): void {
                throw new Error();
            }

            public canExecute(player: Player, args: string[]): boolean {
                return true;
            }
        }

        @CommandDecorator({
            names: [Constants.CommandName3],
        })
        class TestCommand2 extends CommandBase<Player> {

            public execute(player: Player, args: string[]): void {
                throw new Error();
            }

            public canExecute(player: Player, args: string[]): boolean {
                return true;
            }
        }

        //#endregion

        const container = new Container();

        const commandConstructors = DecoratorsHelper.getCommandsFromMetadata();

        commandConstructors.forEach((constructor) => {
            const commandName = constructor.name;
            container.bind<ICommand<Player>>(Types.ICommand).to(constructor as any).whenTargetNamed(commandName);

            // Assert that the commands are of type CommandBase
            expect(constructor.prototype).to.be.an.instanceOf(CommandBase);

            const command = container.getNamed<ICommand<Player>>(Types.ICommand, commandName);

            // Assert that canExecute returns true and execute throws an error, like defined in the commands
            expect(command.canExecute(null, null)).to.be.true;
            expect(function () { command.execute(null, null); }).to.throw();
        });
    });
});