// tslint:disable
import "reflect-metadata";
import { expect } from "chai";
import { CommandBase, CommandDecorator, Player } from "inversihax";
import { MetadataKeys } from "inversihax/lib/Core/Utility/Constants";
import { DecoratorsHelper } from "inversihax/lib/Core/Utility/Helpers/DecoratorsHelper";
import "mocha";
// tslint:enable

const ConstantsLocal = {
    TestSymbol: Symbol.for("TestSymbol"),
    Key: Symbol.for("TestMetadataKey"),
    TestCommand1: "TestCommand1",
    TestCommand2: "TestCommand2",
    TestCommand3: "TestCommand3",
};

// Test metadata
interface ITestMetadata {
    testProperty: Symbol;
}

// A test decorator
function testDecorator(metadata: ITestMetadata): (target: Function) => void {
    return (target: Function) => {
        Reflect.defineMetadata(ConstantsLocal.Key, metadata, target);
    };
}

describe("DecoratorsHelper", function () {

    // This runs after each test to clear attached metadata from previous tests
    afterEach((done) => {
        Reflect.deleteMetadata(MetadataKeys.Command, Reflect);
        done();
    });

    describe("#getMetadata()", function () {
        it("Should return the metadata that has been attached to an object", function () {
            @testDecorator({ testProperty: ConstantsLocal.TestSymbol })
            class TestClass { }

            const metadata = DecoratorsHelper.getMetadata<ITestMetadata>(ConstantsLocal.Key, TestClass);

            expect(metadata.testProperty).to.equal(ConstantsLocal.TestSymbol);
        });

        it("Should return no metadata (undefined) for an object that has no metadata attached", function () {
            class NoMetadataClass { }

            const metadata = DecoratorsHelper.getMetadata<ITestMetadata>(ConstantsLocal.Key, NoMetadataClass);

            expect(metadata).to.equal(undefined);
        });
    });

    describe("#getCommandsFromMetadata()", function () {
        it("Should return all commands that have been decorated with the @CommandDecorator", function () {
            //#region Test commands

            @CommandDecorator({ names: [ConstantsLocal.TestCommand1] })
            class TestCommand1 extends CommandBase<Player> {
                canExecute(player: Player): boolean {
                    throw new Error("Method not implemented.");
                }
                execute(player: Player, args: string[]): void {
                    throw new Error("Method not implemented.");
                }
            }
            @CommandDecorator({ names: [ConstantsLocal.TestCommand2] })
            class TestCommand2 extends CommandBase<Player> {
                canExecute(player: Player): boolean {
                    throw new Error("Method not implemented.");
                }
                execute(player: Player, args: string[]): void {
                    throw new Error("Method not implemented.");
                }
            }
            @CommandDecorator({ names: [ConstantsLocal.TestCommand3] })
            class TestCommand3 extends CommandBase<Player> {
                canExecute(player: Player): boolean {
                    throw new Error("Method not implemented.");
                }
                execute(player: Player, args: string[]): void {
                    throw new Error("Method not implemented.");
                }
            }

            //#endregion

            const commandsMetadata = DecoratorsHelper.getCommandsMetadata().map((metadata) => metadata.target);

            expect(commandsMetadata).to.have.all.members([TestCommand1, TestCommand2, TestCommand3]);
        });

        it("Should return no commands (empty array) if no commands have been decorated with @CommandDecorator", function () {
            const commandConstructors = DecoratorsHelper.getCommandsMetadata().map((metadata) => metadata.target);

            expect(commandConstructors).to.not.contain.any.members;
        });
    });
});