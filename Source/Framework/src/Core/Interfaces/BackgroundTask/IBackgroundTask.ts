/**
 * Defines a task that will run in the background.
 */
export interface IBackgroundTask {

    /**
     * Starts the task.
     */
    start(): void;

    /**
     * Stops the task.
     */
    stop(): void;
}