import { Room } from "./room.model";
import { Teacher } from "./teacher.model";

export interface SessionLookup {
    rooms: Room[];
    teachers: Teacher[];
}