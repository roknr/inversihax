import { IPosition } from "../../../HeadlessAPI/Interfaces/IPosition";

/**
 * Provides helper methods for working with geometry.
 */
export class GeometryHelper {

    /**
     * Private constructor, so the class cannot be instantiated and can act as a static class.
     */
    private constructor() { }

    /**
     * Calculates the distance between the two specified positions
     * @param p1 The first point.
     * @param p2 The second point.
     */
    public static calculatePointDistance(p1: IPosition, p2: IPosition): number {
        const d1 = p1.x - p2.x;
        const d2 = p1.y - p2.y;

        return Math.sqrt((d1 * d1) + (d2 * d2));
    }
}