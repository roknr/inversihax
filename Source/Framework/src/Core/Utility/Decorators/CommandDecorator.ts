import { ICommandMetadata, ICommandMetadataInternal } from "../../Interfaces/Metadata/ICommandMetadata";
import { MetadataKeys } from "../Constants";

/**
 * The command decorator. Provides a way of decorating a class with the command attribute and providing metadata to it.
 * @param metadata The command metadata to attach to the command.
 */
export function CommandDecorator(metadata: ICommandMetadata): (target: Function) => void {
    return (target: Function) => {
        // Create the internal metadata for this command - its constructor
        const thisCommandMetadata = <ICommandMetadataInternal>{
            metadata: {
                names: metadata.names,
            },
            target: target,
        };

        // Attach the metadata to the target (this command - its constructor)
        Reflect.defineMetadata(MetadataKeys.Command, thisCommandMetadata, target);

        // We store all of the commands' metadata on the global reflect object, so we can access them as an array
        // So get all of the other commands' metadata or an empty array if none exist
        const allCommandsMetadata: ICommandMetadataInternal[] = Reflect.getMetadata(MetadataKeys.Command, Reflect) || [];

        // Add this command's metadata to all the others
        allCommandsMetadata.push(thisCommandMetadata);

        // And update the global metadata array, so that it contains this metadata and all of the others
        Reflect.defineMetadata(MetadataKeys.Command, allCommandsMetadata, Reflect);
    };
}