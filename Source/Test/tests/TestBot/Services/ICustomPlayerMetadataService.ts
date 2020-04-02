import { IPlayerMetadataService, IPlayerObject } from "inversihax";
import { CustomPlayerMetadata } from "../Models/CustomPlayerMetadata";
import { CustomRole } from "../Models/CustomRole";

export interface ICustomPlayerMetadataService extends IPlayerMetadataService<CustomPlayerMetadata> {

    getRolesFor(player: IPlayerObject): Set<CustomRole>;
}