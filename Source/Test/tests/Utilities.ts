import { Container } from "inversify";
import { RoomHostBuilder } from "inversihax";

/**
 * Gets the container from the room host builder. Hackish way - the container is a private property on the builder, since it shouldn't
 * be exposed, but we're know what we're doing, since it's only for testing.
 * @param builder The room host builder.
 */
export function getContainer(builder: RoomHostBuilder): Container {
    return ((builder as any).container) as Container;
}