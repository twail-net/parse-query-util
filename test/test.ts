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

    before(done => {
        ParseMockDB.mockDB();

        let p: Parse.IPromise<Parse.Object> = Parse.Promise.as(null);
        for (let i = 0; i < CAR_CNT; ++i) {
            p = p.then(() => new Car().save({
                owner: "A"
            }));
        }
        p.then(() =>
            new Car().save({
                owner: "B"
            })
        ).then(() => done(), done);
    })

    after(() => {
        ParseMockDB.unMockDB();
    });

    describe("getAllObjects", () => {
        it("returns all objects", done => {
            ParseQueryUtil.getAllObjects(query).then(objs => {
                expect(objs.length).to.equal(CAR_CNT);
                expect(objs[0].className).to.equal("Car");
            }).then(() => done(), done);
        });
    });

});