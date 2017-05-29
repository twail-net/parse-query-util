import * as Parse from "parse/node";
import * as ParseMockDB from "parse-mockdb";
import { expect } from "chai";

import * as ParseQueryUtil from "../src/query-util";


class Car extends Parse.Object {
    constructor(options?) {
        super("Car", options);
    }
}
Parse.Object.registerSubclass("Car", Car);

describe("query-util:", () => {
    const CAR_CNT = 5000;
    const query = new Parse.Query(Car).equalTo("owner", "A");

    before(async () => {
        ParseMockDB.mockDB();

        for (let i = 0; i < CAR_CNT; ++i) {
            await new Car().save({
                owner: "A"
            });
        }

        await new Car().save({
            owner: "B"
        });
    })

    after(() => {
        ParseMockDB.unMockDB();
    });

    describe("getAllObjects", () => {
        it("returns all objects", async () => {
            const objs = await ParseQueryUtil.getAllObjects(query);

            expect(objs.length).to.equal(CAR_CNT);
            expect(objs[0].className).to.equal("Car");
        });
    });

    describe("countAllObjects", () => {
        it("returns correct count", async () => {
            const cnt = await ParseQueryUtil.countAllObjects(query);

            expect(cnt).to.equal(CAR_CNT);
        });
    });

});