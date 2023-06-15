import { DateTimeUtils } from "../../../../assets/shared/utils";

describe("DateTimeUtils", () => {
    describe("getStringDateByTime", () => {
        test("should returns formatted string date and time without senconds", () => {
            const time = "2023-06-18T18:45:00";
            const expectedOutput = "18:45 18/06/2023";

            jest.mock("moment", () => () => ({ format: () => expectedOutput }));

            const result = DateTimeUtils.getStringDateByTime(time);

            expect(result).toEqual(expectedOutput);
        });
    });

    describe("getStringDateByTime", () => {
        test("should returns formatted string date and time within senconds", () => {
            const time = "2023-06-18T18:45:30";
            const expectedOutput = "18:45:30 18/06/2023";

            jest.mock("moment", () => () => ({ format: () => expectedOutput }));

            const result = DateTimeUtils.formatDateTime(time);

            expect(result).toEqual(expectedOutput);
        });
    });

    describe("getStringHourByTime", () => {
        test("should returns formatted string date and hour-minute-second", () => {
            const time = "2023-06-18T18:45:30";
            const expectedOutput = "18:45:30";

            jest.mock("moment", () => () => ({ format: () => expectedOutput }));

            const result = DateTimeUtils.getStringHourByTime(time);

            expect(result).toEqual(expectedOutput);
        });
    });

    describe("getStringDate", () => {
        test("should returns formatted string with date", () => {
            const time = "2023-06-18T18:45:30";
            const expectedOutput = "18/06/2023";

            jest.mock("moment", () => () => ({ format: () => expectedOutput }));

            const result = DateTimeUtils.getStringDate(time);

            expect(result).toEqual(expectedOutput);
        });
    });
});
