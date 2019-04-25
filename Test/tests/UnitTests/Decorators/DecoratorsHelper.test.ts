import { expect } from "chai";
import "mocha";
import "reflect-metadata";
import { CommandBase, CommandDecorator, DecoratorsHelper, MetadataKeys, Player } from "types-haxframework-core";

const Constants = {
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
        Reflect.defineMetadata(Constants.Key, metadata, target);
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
            @testDecorator({ testProperty: Constants.TestSymbol })
            class TestClass { }

            const metadata = DecoratorsHelper.getMetadata<ITestMetadata>(Constants.Key, TestClass);

            expect(metadata.testProperty).to.equal(Constants.TestSymbol);
        });
    });

    describe("#getMetadata()", function () {
        it("Should return no metadata (undefined) for an object that has no metadata attached", function () {
            class NoMetadataClass { }

            const metadata = DecoratorsHelper.getMetadata<ITestMetadata>(Constants.Key, NoMetadataClass);

            expect(metadata).to.equal(undefined);
        });
    });

    describe("#getCommandsFromMetadata()", function () {
        it("Should return all commands that have been decorated with the @CommandDecorator", function () {
            //#region Test commands

            @CommandDecorator({ names: [Constants.TestCommand1] })
            class TestCommand1 extends CommandBase<Player> {
                canExecute(player: Player, args: string[]): boolean {
                    throw new Error("Method not implemented.");
                }
                execute(player: Player, args: string[]): void {
                    throw new Error("Method not implemented.");
                }
            }
            @CommandDecorator({ names: [Constants.TestCommand2] })
            class TestCommand2 extends CommandBase<Player> {
                canExecute(player: Player, args: string[]): boolean {
                    throw new Error("Method not implemented.");
                }
                execute(player: Player, args: string[]): void {
                    throw new Error("Method not implemented.");
                }
            }
            @CommandDecorator({ names: [Constants.TestCommand3] })
            class TestCommand3 extends CommandBase<Player> {
                canExecute(player: Player, args: string[]): boolean {
                    throw new Error("Method not implemented.");
                }
                execute(player: Player, args: string[]): void {
                    throw new Error("Method not implemented.");
                }
            }

            //#endregion

            const commandConstructors = DecoratorsHelper.getCommandsFromMetadata();

            expect(commandConstructors).to.have.all.members([TestCommand1, TestCommand2, TestCommand3]);
        });
    });

    describe("#getCommandsFromMetadata()", function () {
        it("Should return no commands (empty array) if no commands have been decorated with @CommandDecorator", function () {
            const commandConstructors = DecoratorsHelper.getCommandsFromMetadata();

            expect(commandConstructors).to.not.contain.any.members;
        });
    });
});