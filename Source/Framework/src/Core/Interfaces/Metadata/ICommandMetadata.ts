import { IMetadataInternal } from "./IMetadataInternal";

/**
 * The command metadata interface. Defines the metadata that can be attached to commands.
 */
export interface ICommandMetadata {

    /**
     * The names that identify the command. The names must be unique for each and between all commands.
     */
    names: string[];
}

/**
 * The internal command metadata interface.
 */
export interface ICommandMetadataInternal extends IMetadataInternal<ICommandMetadata> { }