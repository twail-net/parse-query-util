# Parse Query Util

Provides utility functions for large parse queries (i.e. with more than 1000 results).

## Installation

```bash
npm install --save-dev parse-query-util
```

## Usage

In typescript (javascript is similar):

```typescript
import { getAllObjects, foldAllObjects } from "parse-query-util";

const query = new Parse.Query("Car")
    .equalTo("owner", "David Beckham");

getAllObjects(query, { useMasterKey: true }).then(cars => {
    // do smth with all cars
});

countAllObjects(query, { useMasterKey: true }).then(numberOfCars => {
    // do smth with total number
})

// this one iterates block-wise over all cars.
// Thus, we do not need to keep all of them in memory.
foldAllObjects(query,
    {},
    (akku, cars) => {
        for (car of cars) {
            const c = car.get("color");
            akku[c] = (akku[c] || 0) + 1;
        }
    },
    { sessionToken: "blah" }).then(allColorsOfMyCars => {
        // do smth with that number
    });
```

# Test

```bash
npm test
```
