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
 * The internal command metadata interface that adds the target to the base ICommandMetadata interface for which the metadata is for.
 */
export interface ICommandMetadataInternal extends ICommandMetadata {

    /**
     * The target for which this metadata is for. Expected to be a constructor.
     */
    target: Function;
}