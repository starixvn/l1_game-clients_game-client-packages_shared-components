export const render = jest.fn().mockImplementation((ctor, callback) => () => {
    const instance = new ctor();

    callback(instance);
});

export const handle = jest.fn().mockImplementation(() => () => {});

export const observer = jest.fn().mockImplementation(() => () => {});

export const configure = jest.fn();

export default { render, handle, configure, observer };
