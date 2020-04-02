import { PlayerMetadata } from "inversihax";
import { newGuid } from "../Utilities";
import { CustomRole } from "./CustomRole";

export class CustomPlayerMetadata extends PlayerMetadata<CustomRole> {

    public readonly guid: string;

    public readonly conn: string;

    constructor(conn: string) {
        super();

        this.guid = newGuid();
        this.conn = conn;
    }
}