import { expect } from "chai";
import { EmojiOptions, EmojiService, IEmojiService } from "inversihax";
import "mocha";

const emojis: Map<string, string> = new Map([
    [":)", "🙂"],
    [":D", "😃"],
    [":(", "🙁"],
]);

describe("EmojiService", function () {
    describe("#toEmoji()", function () {
        it("Should return the emoji that corresponds to the word if it exists", function () {
            const emojiService: IEmojiService = new EmojiService(new EmojiOptions(emojis, true));

            const emoji = emojiService.toEmoji(":)");
            expect(emoji).to.equal("🙂");
        });

        it("Should return the word if no corresponding emoji match and was specified as such", function () {
            const emojiService: IEmojiService = new EmojiService(new EmojiOptions(emojis, true));

            const emoji = emojiService.toEmoji(":P", true);
            expect(emoji).to.equal(":P");
        });

        it("Should return undefined if no corresponding emoji match", function () {
            const emojiService: IEmojiService = new EmojiService(new EmojiOptions(emojis, true));

            const emoji = emojiService.toEmoji(":P");
            expect(emoji).to.be.undefined;
        });
    });

    describe("#toEmojis()", function () {
        it("Should return the message in which all patterns are replaces with emojis", function () {
            const emojiService: IEmojiService = new EmojiService(new EmojiOptions(emojis, true));

            const replaced = emojiService.toEmojis("This :) is :P a :D test :( message :)");
            expect(replaced).to.equal("This 🙂 is :P a 😃 test 🙁 message 🙂");
        });
    });

    describe("#toEmojisArray()", function () {
        it("Should replace all words in the original array that map to emoji patterns", function () {
            const emojiService: IEmojiService = new EmojiService(new EmojiOptions(emojis, true));
            const wordsOriginal = ["This", ":)", "is", ":P", "a", ":D", "test", ":(", "message", ":)"];
            const wordsReplaced = ["This", "🙂", "is", ":P", "a", "😃", "test", "🙁", "message", "🙂"];

            emojiService.toEmojisArray(wordsOriginal);
            expect(wordsOriginal).to.have.all.members(wordsReplaced);
        });
    });

    describe("#constructor()", function () {
        it("Should initialize the service by overwriting the existing emojis", function () {
            const emojiService = new EmojiService(new EmojiOptions(emojis, true));

            expect(emojiService.emojis).to.deep.equal(emojis);
        });

        it("Should initialize the service by adding specified emojis to existing emojis", function () {
            const emojiService = new EmojiService(new EmojiOptions(emojis, false));

            expect(emojiService.emojis.get(":)")).to.equal("🙂");
            expect(emojiService.emojis.get(":(")).to.equal("🙁");
            expect(emojiService.emojis.get(":D")).to.equal("😃");
            expect(emojiService.emojis.get(":'D")).to.equal("😂");
        });
    });
});