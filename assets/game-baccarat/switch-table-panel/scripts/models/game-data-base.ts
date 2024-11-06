import EventEmitterBase from "../emitter/EventEmitterBase";
import { StoreBase } from "./definitions";
export abstract class GameDataBase extends EventEmitterBase {
    abstract getStore(storeName: string): StoreBase;
}
