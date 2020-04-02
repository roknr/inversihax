import { injectable } from "inversify";
import { IPlayerObject } from "inversihax";
import { CustomPlayerMetadata } from "../Models/CustomPlayerMetadata";
import { CustomRole } from "../Models/CustomRole";
import { ICustomPlayerMetadataService } from "./ICustomPlayerMetadataService";

@injectable()
export class CustomPlayerMetadataService implements ICustomPlayerMetadataService {

    getRolesFor(player: IPlayerObject): Set<CustomRole> {
        return this.mPlayerMetadataMap.get(player.id).roles;
    }

    private mPlayerMetadataMap: Map<number, CustomPlayerMetadata> = new Map();
    private mSuperAdminsMap: Map<string, CustomPlayerMetadata> = new Map();

    getMetadataFor(player: IPlayerObject): CustomPlayerMetadata {
        return this.mPlayerMetadataMap.get(player.id);
    }

    setMetadataFor(player: IPlayerObject, metadata: CustomPlayerMetadata): void {
        this.mPlayerMetadataMap.set(player.id, metadata);
    }

    handleOnPlayerJoin(player: IPlayerObject): void {
        let metadata = this.mSuperAdminsMap.get(player.conn);

        if (metadata == null) {
            metadata = new CustomPlayerMetadata(player.conn);
        }

        this.mPlayerMetadataMap.set(player.id, metadata);
    }

    handleOnPlayerLeave(player: IPlayerObject): void {
        const metadata = this.mPlayerMetadataMap.get(player.id);
        this.mPlayerMetadataMap.delete(player.id);

        if (metadata.roles.has(CustomRole.SuperAdmin)) {
            this.mSuperAdminsMap.set(metadata.conn, metadata);
        }
    }
}