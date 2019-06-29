# Extras
Inversihax provides some extra features that you can use, but they are not used by default by Inversihax.

## Emoji service
The `EmojiService` is a service for making it easy to convert strings to emojis. The service implements the `IEmojiService` interface, that provides the following methods:

- `toEmoji(word: string, returnWordIfNoMatch?: boolean): string` - takes a string word as a parameter that it converts to an emoji. If no emoji mapping is found, it returns undefined, or the word that was passed in if the second parameter is used and set to `true`.
- `toEmojis(message: string): string` - takes a string message as a parameter and returns the message where all words that can be mapped to emojis are converted.
- `toEmojisArray(words: string[]): void` - takes an array of string words as parameter and modifies it - each word that can be mapped to an emoji is converted.

The service also provides a `readonly Map<string, string>` property named `emojis` which contains all the mappings between string literals to emojis.

As a constructor parameter, the service expects the `EmojiOptions`. This is a container for the emoji service configuration and it contains the following properties:
- `customEmojis: Map<string, string>` - a map that contains your custom emojis that you would like the service to use.
- `overwriteExisting: boolean` - a value indicating whether the existing emojis should be completely overwritten by the provided `customEmojis`. Adds the specified emojis to the existing ones if false, in which case it overrides the existing map with the custom one, if it exists. Overwrites all of the existing emojis otherwise.

The service can be used with DI by registering it and the emoji options to the services module on initialization:

```ts
import { ContainerModule } from "inversify";
import { Types, EmojiService, IEmojiService } from "inversihax";
import { customEmojis } from "./CustomEmojis";

const services = new ContainerModule((bind) => {
    bind<EmojiOptions>(Types.EmojiOptions)
        .toConstantValue(new EmojiOptions(customEmojis, true));

    bind<IEmojiService>(Types.IEmojiService)
        .to(EmojiService)
        .inRequestScope();
});
```

You can then request the service in any Inversihax feature such as the room, in commands etc.

## Parser
Inversihax uses two parsers by default - a chat message parser and a stadium parser. The base for both is the `ParserBase<T>` class which implements the `IParser<T>` interface, whose type parameter `T` indicates the return type of the content (string) parsed. You can use this class as a base for any parser you might implement.

## Stadium and stadium parser
Inversihax provides models for dealing with haxball stadiums and a parser for the stadium files (.hbs).

The models (classes) are:
- `Background`
- `Disc`
- `Goal`
- `PlayerPhysics`
- `BallPhysics`
- `Plane`
- `Segment`
- `Stadium`
- `Traits`
- `Vertex`

These are models for the objects that are contained in the .hbs file and are organized in the same hierarchical structure under the `Stadium` model. The models and their properties themselves won't be explained here, as this out of the scope of this documentation, but you can find more information [here](https://github.com/haxball/haxball-issues/wiki/HaxBall-Stadium-File).

Inversihax also provides a parser for the .hbs file (as string) in the form of the `StadiumParser` which inherits from the `ParserBase` class and implements the `IStadiumParser` interface. It provides the parse method that converts an .hbs file in string format to the before mentioned `Stadium` class model.

Like the `EmojiService`, it can also be used with DI by registering it to the services module on initialization.

```ts
import { ContainerModule } from "inversify";
import { Types, StadiumParser, IStadiumParser } from "inversihax";

const services = new ContainerModule((bind) => {
    bind<IStadiumParser>(Types.IStadiumParser)
        .to(StadiumParser)
        .inRequestScope();
});
```

You can implement your own and provide custom logic by creating a class that implements the `IStadiumParser` interface and registering your class as the type to be bound to instead of the Inversihax's `StadiumParser`.