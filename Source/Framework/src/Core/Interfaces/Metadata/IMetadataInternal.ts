/**
 * The generic internal metadata interface that encapsulates the custom generic metadata and the target that this metadata applies to.
 *
 * @type {TMetadata} The type of metadata to extend.
 */
export interface IMetadataInternal<TMetadata> {

    /**
     * The target for which this metadata is for. Expected to be a constructor.
     */
    target: Function;

    /**
     * The custom metadata.
     */
    metadata: TMetadata;
}