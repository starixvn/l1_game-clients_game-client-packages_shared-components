export namespace ObjectUtils {
    export const getLowercaseObjectKeys = (data: object) => {
        return Object.keys(data).reduce((keys, key) => {
            keys[key.toLowerCase()] = key;
            return keys;
        }, {});
    };
}
