import * as _ from "lodash";
import { IEmojiService } from "../../Core/Interfaces/Services/IEmojiService";
import { EmojiOptions } from "../../Core/Models/EmojiServiceOptions";

/**
 * The emoji service. Offers methods for working with emojis.
 */
export class EmojiService implements IEmojiService {

    /**
     * The words to emojis map.
     * TODO: Add more
     */
    private mEmojis: Map<string, string> = new Map([
        [":)", "🙂"],
        [":(", "🙁"],
        [":'D", "😂"],
    ]);

    /**
     * The map between string values and emojis for all of the emojis that the service provides.
     *
     * @example
     * const emoji = emojis.get(":)");  // emoji == 🙂
     */
    public get emojis(): ReadonlyMap<string, string> {
        return this.mEmojis;
    }

    /**
     * Initializes a new instance of the EmojiService class.
     * @param options The emoji service options.
     */
    public constructor(options: EmojiOptions) {
        this.initialize(options);
    }

    //#region Public methods

    // tslint:disable-next-line
    public toEmoji(word: string, returnWordIfNoMatch: boolean = false): string {
        const emoji = this.mEmojis.get(word);

        // Return the word if no match and so was specified
        if (emoji == null && returnWordIfNoMatch) {
            return word;
        }

        // Otherwise return the emoji or undefined if no match
        return emoji;
    }

    // tslint:disable-next-line
    public toEmojis(message: string): string {
        // The message will be modified in each iteration
        let newMessage = message;

        // Go through the whole emoji map
        this.emojis.forEach((emoji, word) => {
            // Regex-escape the word and construct a global regex with the pattern
            const escapedPattern = _.escapeRegExp(word);
            const regex = new RegExp(escapedPattern, "g");

            // Replace all found occurrences of the word with the corresponding emoji
            newMessage = newMessage.replace(regex, emoji);
        });

        // Return the modified message that has all of the emoji patterns replaced with the corresponding emojis
        return newMessage;
    }

    // tslint:disable-next-line
    public toEmojisArray(words: string[]): void {
        // Go through all the words
        for (let i = 0; i < words.length; i++) {
            // And get the emoji that maps to the word and replace the word with it, it it exists
            const emoji = this.emojis.get(words[i]);

            if (emoji != null) {
                words[i] = emoji;
            }
        }
    }

    //#endregion

    //#region Private helpers

    /**
     * Initializes the service by loading the custom emojis from the service options.
     * @param options The service options.
     */
    private initialize(options: EmojiOptions): void {
        // Nothing to do if custom emojis not specified
        if (options.customEmojis == null) {
            return;
        }

        // Completely overwrite the existing emojis if specified
        if (options.overwriteExisting) {
            this.mEmojis = new Map(options.customEmojis);
        }
        else {
            // Otherwise add the custom ones and overwrite any existing maps that are the same
            options.customEmojis.forEach((emoji, word) => {
                this.mEmojis.set(word, emoji);
            });
        }
    }

    //#endregion
}