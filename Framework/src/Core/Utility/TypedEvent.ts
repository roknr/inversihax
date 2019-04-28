/**
 * The event with typed handlers.
 */
export class TypedEvent<THandler extends (...args: any[]) => any> {

    /**
     * The set of event handlers for this event.
     */
    private mHandlers: Set<THandler> = new Set<THandler>();

    //#region Public methods

    /**
     * Adds the specified event handler to this event and returns true if the handler is not yet registered.
     * Returns false otherwise.
     * @param handler The event handler to add.
     */
    public addHandler(handler: THandler): boolean {
        if (this.mHandlers.has(handler)) {
            return false;
        }
        else {
            this.mHandlers.add(handler);
            return true;
        }
    }

    /**
     * Removes the specified event handler from this event and return true if exists.
     * Returns false otherwise.
     * @param handler The event handler to remove.
     */
    public removeHandler(handler: THandler): boolean {
        return this.mHandlers.delete(handler);
    }

    /**
     * Removes all registered event handlers.
     */
    public removeAllHandlers(): void {
        this.mHandlers.clear();
    }

    /**
     * Invokes all registered event handlers with the specified parameters.
     * @param parameters The parameters to invoke the event handlers with.
     */
    public invoke(parameters: Parameters<THandler>): void {
        this.mHandlers.forEach((handler) => {
            handler(parameters);
        });
    }

    //#endregion
}