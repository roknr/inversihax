import { expect } from "chai";
import { TypedEvent } from "inversihax";
import "mocha";

describe("TypedEvent", function () {
    describe("#addHandler()", function () {
        it("Should register a handler for the event", function () {
            const event = new TypedEvent<() => void>();

            const registered = event.addHandler(() => { });
            event.invoke([]);

            expect(registered).to.be.true;
        });

        it("Should support multiple handler registrations", function () {
            const event = new TypedEvent<() => void>();
            const registered = [];

            registered.push(event.addHandler(() => { }));
            registered.push(event.addHandler(() => { }));

            expect(registered).to.have.all.members([true, true]);
        });

        it("Should not allow multiple same handler registrations", function () {
            const event = new TypedEvent<() => void>();
            const registered = [];
            const handler = () => { };

            registered.push(event.addHandler(handler));
            registered.push(event.addHandler(handler));

            expect(registered).to.have.all.members([true, false]);
        });

        it("Should support reference handler registrations", function () {
            class TestClass {
                private readonly TWO = 2;
                public result: number;
                public timesTWO(param: number): void {
                    this.result = param * this.TWO;
                }
            }

            const testClass = new TestClass();
            const event = new TypedEvent<(param: number) => void>();

            event.addHandler(testClass.timesTWO.bind(testClass));
            event.invoke([3]);

            expect(testClass.result).to.equal(6);
        });
    });

    describe("#invoke()", function () {
        it("Should invoke all registered handlers", function () {
            const event = new TypedEvent<() => void>();
            let testVariable = 1;

            event.addHandler(() => testVariable++);
            event.addHandler(() => testVariable += 2);
            event.addHandler(() => testVariable += 3);
            event.invoke([]);

            expect(testVariable).to.equal(7);
        });
    });

    describe("#removeHandler()", function () {
        it("Should remove the specified registered handler", function () {
            const event = new TypedEvent<() => void>();
            const handler = () => { };

            event.addHandler(handler);
            const removed = event.removeHandler(handler);

            expect(removed).to.be.true;
        });
    });

    describe("#removeAllHandlers()", function () {
        it("Should remove all registered handlers", function () {
            const event = new TypedEvent<() => void>();
            let testVariable = true;

            event.addHandler(() => testVariable = false);
            event.addHandler(() => testVariable = null);
            event.removeAllHandlers();

            expect(testVariable).to.be.true;
        });
    });
});