/**
 * The emoji service options.
 */
export class EmojiOptions {

    /**
     * The custom emojis to use.
     */
    public readonly customEmojis: ReadonlyMap<string, string>;

    /**
     * Flag indicating whether to completely overwrite the existing emojis with the custom specified ones. Adds the specified emojis
     * to the existing ones if false, in which case it overrides the existing map with the custom one, if it exists. Overwrites all of the
     * existing emojis otherwise.
     */
    public readonly overwriteExisting: boolean;

    /**
     * Initializes a new instance of the EmojiOptions class.
     * @param customEmojis The custom emojis.
     * @param overwriteExisting The overwrite existing emojis flag.
     */
    public constructor(customEmojis: Map<string, string>, overwriteExisting: boolean) {
        this.customEmojis = customEmojis;
        this.overwriteExisting = overwriteExisting;
    }
}