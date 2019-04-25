import { ICommandMetadataInternal } from "../../Interfaces/Commands/ICommandMetadata";
import { MetadataKeys } from "../../Utility/Constants";

/**
 * Provides helper methods for working with decorators.
 */
export class DecoratorsHelper {

    /**
     * Private constructor, so the class cannot be instantiated and can act as a static class.
     */
    private constructor() { }

    //#region Public methods

    /**
     * Gets the metadata from the specified target for the specified key of the specified type. Acts as a typed wrapper around the
     * Reflect.getMetadata() method.
     * @param metadataKey The key under which the metadata was registered to the target.
     * @param target The target to get the metadata from. This is the "target" that the metadata was attached to.
     * @type {T} The type of metadata to get from the target.
     */
    public static getMetadata<T>(metadataKey: Symbol, target: Object): T {
        // Get the target's metadata as the specified type and return it
        const metadata = Reflect.getMetadata(metadataKey, target) as T;

        return metadata;
    }

    /**
     * Gets the commands (their constructors) from the commands metadata.
     */
    public static getCommandsFromMetadata(): Function[] {
        // Get all of the commands' metadata
        const commandsMetadata = this.getMetadata<ICommandMetadataInternal[]>(MetadataKeys.Command, Reflect) || [];

        // Return their targets/constructors
        return commandsMetadata.map((commandsMetadata) => commandsMetadata.target);
    }

    //#endregion
}