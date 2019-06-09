import { expect } from "chai";
import { ChatMessage, Player } from "inversihax";
import "mocha";

describe("ChatMessage", function () {
    it("Should correctly set initial property values on construction", function () {
        const player = new Player(null, null, null, null, null, null, null);
        const message = "This is a test message";

        const chatMessage = new ChatMessage(player, message);

        expect(chatMessage.sentBy).to.equal(player);
        expect(chatMessage.sentTo).to.be.undefined;
        expect(chatMessage.message).to.equal(message);
        expect(chatMessage.words).to.have.all.members(["This", "is", "a", "test", "message"]);
        expect(chatMessage.command).to.be.undefined;
        expect(chatMessage.commandParameters).to.be.undefined;
        expect(chatMessage.isCommand).to.be.false;
        expect(chatMessage.broadcastForward).to.be.true;
        expect(chatMessage.originalMessage).to.equal(message);
    });

    it("Should be able to modify the message", function () {
        const orgMessage = "This is a test message.";
        const newMessage = "This is a new modified message";
        const player = new Player(1, "TestPlayer", null, true, null, null, null);

        const chatMessage = new ChatMessage(player, orgMessage);
        expect(chatMessage.message).to.equal(orgMessage);

        chatMessage.message = newMessage;
        expect(chatMessage.message).to.equal(newMessage);
    });

    it("Should maintain the original message after modification", function () {
        const orgMessage = "This is a test message.";
        const newMessage = "This is a new modified message";

        const chatMessage = new ChatMessage(null, orgMessage);
        expect(chatMessage.originalMessage).to.equal(orgMessage);

        chatMessage.message = newMessage;
        expect(chatMessage.originalMessage).to.equal(orgMessage);
    });

    it("Should split the message by whitespace characters to get the message words", function () {
        const message = "This is  a   message    split by  whitespace";

        const chatMessage = new ChatMessage(null, message);
        expect(chatMessage.words).to.have.all.members(["This", "is", "a", "message", "split", "by", "whitespace"]);
    });
});