export const systemTypes = {
    HD: "HD",
    SC: "SC",
    VG: "VG",
} as const;

export type SystemType = typeof systemTypes[keyof typeof systemTypes];

export namespace SystemTypeUtils {
    export const getCurrentSystemType = (): SystemType | undefined => {
        return window.envConfig?.systemType as SystemType;
    };

    export const isSystemType = (systemType: SystemType): boolean => {
        return getCurrentSystemType() === systemType;
    };
}