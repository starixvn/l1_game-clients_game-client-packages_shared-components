export const convertToChipStack = (value: number, options: number[]): { [chipValue: string]: number } => {
    const list = [...options].reverse();
    const stack = calculateChipStack(list, value);
    const values = stack.values;

    if (stack.remain > 0) {
        values[0] = 1;
    }
    return values;
};

const calculateChipStack = (options: number[], total) => {
    const values = {};
    let remain = total;
    options.forEach((value) => {
        const count = Math.floor(remain / value);
        values[value] = count;
        remain = remain % value;
    });

    return { values, remain };
};
