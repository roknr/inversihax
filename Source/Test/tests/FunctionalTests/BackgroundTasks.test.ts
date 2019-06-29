// tslint:disable
import "reflect-metadata";
import { expect } from "chai";
import { ContainerModule, injectable, inject } from "inversify";
import { RoomHostBuilder, Types, IBackgroundTask, IRoomConfigObject } from "inversihax";
import "mocha";
import { StartupTest } from "./Startups/StartupTest";
import { getContainer } from "../Utilities";
import { TestRoom } from "./Rooms/TestRoom";
// tslint:enable

const constantsLocal = {
    ITestService: Symbol.for("ITestService"),
};

interface ITestService {
    testProperty: boolean;
}

@injectable()
class TestService implements ITestService {
    public testProperty = null;
}

@injectable()
class TestBackgroundTask implements IBackgroundTask {
    private readonly mTestService: ITestService;

    constructor(@inject(constantsLocal.ITestService) testService: ITestService) {
        this.mTestService = testService;
    }

    public start(): void {
        this.mTestService.testProperty = true;
    }

    public stop(): void { }
}

const services = new ContainerModule((bind) => {
    bind<IRoomConfigObject>(Types.IRoomConfigObject).toConstantValue({});
    bind<ITestService>(constantsLocal.ITestService).to(TestService).inSingletonScope();
    bind<IBackgroundTask>(Types.IBackgroundTask).to(TestBackgroundTask).inSingletonScope();
});

describe("BackgroundTasks", function () {
    it("Should start after room has been configured", function () {
        const builder = new RoomHostBuilder(StartupTest, TestRoom, services);
        builder.buildAndRun();

        const container = getContainer(builder);
        const testService = container.get<ITestService>(constantsLocal.ITestService);

        expect(testService.testProperty).to.be.true;
    });
});