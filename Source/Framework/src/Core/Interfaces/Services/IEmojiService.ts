/**
 * Defines emoji service functionality.
 */
export interface IEmojiService {

    /**
     * The map between string values and emojis for all of the emojis that the service provides.
     */
    readonly emojis: ReadonlyMap<string, string>;

    /**
     * Returns the emoji for the specified word or undefined if a mapping doesn't exist. Can return the specified word by passing
     * "true" as the "returnWordIfNoMatch" parameter.
     * @param word The word to get the emoji for.
     * @param returnWordIfNoMatch Flag indicating whether the method should return the word if no mapping exists. False by default.
     */
    toEmoji(word: string, returnWordIfNoMatch?: boolean): string;

    /**
     * Returns a new message in which all of the patterns (represented by the keys of the emojis map) are replaces with the
     * corresponding emojis.
     * @param message The message in which to replace the patterns with emojis.
     */
    toEmojis(message: string): string;

    /**
     * Replaces every word that maps to an emoji with the corresponding emoji.
     * @param words The words which to replace with emojis.
     */
    toEmojisArray(words: string[]): void;
}