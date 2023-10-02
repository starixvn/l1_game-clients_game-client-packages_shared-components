import inversify from "inversify";
import { AudioConfigsStore, TAudioConfigs } from "../stores/audio-configs-store";

const { injectable, inject } = inversify;

@injectable()
export class AudioConfigsHandler {
    @inject(AudioConfigsStore) private readonly audioConfigsStore: AudioConfigsStore;

    async handle(audioConfigs: TAudioConfigs) {
        this.audioConfigsStore.audioConfigs = audioConfigs;
    }
}
