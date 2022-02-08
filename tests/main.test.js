const { Block, Chain } = require("../src/main.js");
const {v4:uuidv4} = require("uuid");

describe('validtransaction test suite', () => {

    test('Valid transaction-type tests', () => {
        let adachain = new Chain();
        adachain.addblock(new Block(new Date(), { credit: 100.25, tid: uuidv4() }));
        adachain.addblock(new Block(new Date(), { credit: 100.25, tid: uuidv4() }));
        adachain.addblock(new Block(new Date(), { credit: 100.25, tid: uuidv4() }));
        adachain.addblock(new Block(new Date(), { debit: -100.25, tid: uuidv4() }));
        adachain.addblock(new Block(new Date(), { debit: -100.25, tid: uuidv4() }));
        adachain.addblock(new Block(new Date(), { debit: -100.25, tid: uuidv4() }));

        expect(adachain.getBlock(1).validtransaction(adachain)).toBeTruthy();
        expect(adachain.getBlock(2).validtransaction(adachain)).toBeTruthy();
        expect(adachain.getBlock(3).validtransaction(adachain)).toBeTruthy();
        expect(adachain.getBlock(4).validtransaction(adachain)).toBeTruthy();
        expect(adachain.getBlock(5).validtransaction(adachain)).toBeTruthy();
        expect(adachain.getBlock(6).validtransaction(adachain)).toBeTruthy();
    });

    test('Invalid transaction_type tests', () => {
        let chain = new Chain();
        expect(new Block(new Date(), { hello: 100.25, tid: uuidv4() }).validtransaction(chain)).toBeFalsy();
        expect(new Block(new Date(), { world: 100.25, tid: uuidv4() }).validtransaction(chain)).toBeFalsy();
        expect(new Block(new Date(), { goodbyte: 100.25, tid: uuidv4() }).validtransaction(chain)).toBeFalsy();
        expect(new Block(new Date(), { 4: 100.25, tid: uuidv4() }).validtransaction(chain)).toBeFalsy();
        expect(new Block(new Date(), { "lol": 100.25, tid: uuidv4() }).validtransaction(chain)).toBeFalsy();
        expect(new Block(new Date(), { 3.14159: 100.25, tid: uuidv4() }).validtransaction(chain)).toBeFalsy();
    });

    test('Invalid transaction-case tests', () => {
        let chain = new Chain();
        expect(new Block(new Date(), { CREDIT: 100.25, tid: uuidv4() }).validtransaction(chain)).toBeFalsy();
        expect(new Block(new Date(), { DEBIT: 100.25, tid: uuidv4() }).validtransaction(chain)).toBeFalsy();
        expect(new Block(new Date(), { cReDiT: 100.25, tid: uuidv4() }).validtransaction(chain)).toBeFalsy();
        expect(new Block(new Date(), { DeBiT: 100.25, tid: uuidv4() }).validtransaction(chain)).toBeFalsy();
    });

    test('Invalid transaction amount (debit) tests', () => {
        let chain = new Chain();
        expect(new Block(new Date(), { debit: -34534.25, tid: uuidv4() }).validtransaction(chain)).toBeFalsy();
        expect(new Block(new Date(), { debit: 104.25, tid: uuidv4() }).validtransaction(chain)).toBeFalsy();
        expect(new Block(new Date(), { debit: 13.25, tid: uuidv4() }).validtransaction(chain)).toBeFalsy();
    });

    test('Invalid transaction amount (credit) tests', () => {
        let chain = new Chain();
        expect(new Block(new Date(), { credit: 34534.25, tid: uuidv4() }).validtransaction(chain)).toBeFalsy();
        expect(new Block(new Date(), { credit: -104.25, tid: uuidv4() }).validtransaction(chain)).toBeFalsy();
        expect(new Block(new Date(), { credit: -13.25, tid: uuidv4() }).validtransaction(chain)).toBeFalsy();
    });

    test('Border range transaction amount (debit) tests', () => {
        let chain = new Chain();
        expect(new Block(new Date(), { debit: -999.99, tid: uuidv4() }).validtransaction(chain)).toBeTruthy();
        expect(new Block(new Date(), { debit: -1000.25, tid: uuidv4() }).validtransaction(chain)).toBeFalsy();
        expect(new Block(new Date(), { debit: -0.01, tid: uuidv4() }).validtransaction(chain)).toBeTruthy();
    });

    test('Border range transaction amount (credit) tests', () => {
        let chain = new Chain();
        expect(new Block(new Date(), { credit: 999.99, tid: uuidv4() }).validtransaction(chain)).toBeTruthy();
        expect(new Block(new Date(), { credit: 1000.25, tid: uuidv4() }).validtransaction(chain)).toBeFalsy();
        expect(new Block(new Date(), { credit: 0.01, tid: uuidv4() }).validtransaction(chain)).toBeTruthy();
    });

    test('Transaction amount 0 tests', () => {
        let chain = new Chain();
        expect(new Block(new Date(), { credit: 0, tid: uuidv4() }).validtransaction(chain)).toBeFalsy();
        expect(new Block(new Date(), { debit: 0, tid: uuidv4() }).validtransaction(chain)).toBeFalsy();
        expect(new Block(new Date(), { credit: -0, tid: uuidv4() }).validtransaction(chain)).toBeFalsy();
        expect(new Block(new Date(), { debit: -0, tid: uuidv4() }).validtransaction(chain)).toBeFalsy();
    });

    test('Transaction amount non 2dp tests', () => {
        let chain = new Chain();
        expect(new Block(new Date(), { credit: 10, tid: uuidv4() }).validtransaction(chain)).toBeFalsy();
        expect(new Block(new Date(), { debit: 10.003, tid: uuidv4() }).validtransaction(chain)).toBeFalsy();
        expect(new Block(new Date(), { credit: 2.4, tid: uuidv4() }).validtransaction(chain)).toBeFalsy();
        expect(new Block(new Date(), { debit: 6.886, tid: uuidv4() }).validtransaction(chain)).toBeFalsy();
    });

    test('Non-Unique tid tests', () => {
        let adachain = new Chain();
        let id = uuidv4();

        // Add a block with a tid we can use later, as we know this will be unique now
        adachain.addblock(new Block(new Date(), { credit: 100.25, tid: id }));

        // If we try check if a block is unique if the id is the same as the one already in the chain, it should be false
        expect(new Block(new Date(), { credit: 100.25, tid: id }).validtransaction(adachain)).toBeFalsy();
    });
});

describe('Adding blocks test suite', () => {

    test('Valid date tests', () => {
        let adachain = new Chain();
        adachain.addblock(new Block(new Date("2021-01-1"), { credit: 100.25, tid: uuidv4() }));
        adachain.addblock(new Block(new Date("2021-11-24"), { credit: 100.25, tid: uuidv4() }));
        adachain.addblock(new Block(new Date("2022-01-16"), { credit: 100.25, tid: uuidv4() }));
        expect(adachain.chain.length).toBe(4);
    });

    test('Future (invalid) date tests', () => {
        let adachain = new Chain();
        adachain.addblock(new Block(new Date("2023-01-1"), { credit: 100.25, tid: uuidv4() }));
        adachain.addblock(new Block(new Date("2022-11-24"), { credit: 100.25, tid: uuidv4() }));
        adachain.addblock(new Block(new Date() + 10000, { credit: 100.25, tid: uuidv4() }));

        // These will all fail as all these dates arein the future from the time of adding, and so they won't be added to the chain
        expect(adachain.chain.length).toBe(1);
    });

    test('Invalid date tests', () => {
        let adachain = new Chain();
        adachain.addblock(new Block(new Date("hello"), { credit: 100.25, tid: uuidv4() }));
        adachain.addblock(new Block(new Date([]), { credit: 100.25, tid: uuidv4() }));
        adachain.addblock(new Block(new Date({ world: "hello" }), { credit: 100.25, tid: uuidv4() }));

        // These will all fail as all these datatypes are incorrect and not Date types, which is what we are looking for
        expect(adachain.chain.length).toBe(1);
    });

    test('Invalid type date tests', () => {
        let adachain = new Chain();
        adachain.addblock(new Block("2023-01-1", { credit: 100.25, tid: uuidv4() }));
        adachain.addblock(new Block(0, { credit: 100.25, tid: uuidv4() }));
        adachain.addblock(new Block("Hello World!", { credit: 100.25, tid: uuidv4() }));

        // These will all fail as all these datatypes are incorrect and not Date types, which is what we are looking for
        expect(adachain.chain.length).toBe(1);
    });



    test('Unique TID tests', () => {
        let adachain = new Chain();
        adachain.addblock(new Block(new Date(), { credit: 100.25, tid: uuidv4() }));
        adachain.addblock(new Block(new Date(), { credit: 100.25, tid: uuidv4() }));
        adachain.addblock(new Block(new Date(), { credit: 100.25, tid: uuidv4() }));
        expect(adachain.chain.length == 4);
    });

    test('Non-Unique TID tests', () => {
        let adachain = new Chain();
        let id = uuidv4();
        adachain.addblock(new Block(new Date(), { credit: 100.25, tid: id }));
        adachain.addblock(new Block(new Date(), { credit: 100.25, tid: id }));
        adachain.addblock(new Block(new Date(), { credit: 100.25, tid: id }));

        // Should be two as the first added block isn't duplicated, but the two after are, so only one block has been added
        expect(adachain.chain.length == 2);
    });


    test('Balance test', () => {
        let adachain = new Chain();
        adachain.addblock(new Block(new Date("2020-11-13"), { credit: 100.25, tid: uuidv4() }));
        adachain.addblock(new Block(new Date("2020-11-15"), { credit: 650.75, tid: uuidv4() }));
        adachain.addblock(new Block(new Date("2021-7-11"), { credit: 100.25, tid: uuidv4() }));
        adachain.addblock(new Block(new Date("2022-1-18"), { credit: 460.75, tid: uuidv4() }));
        adachain.addblock(new Block(new Date("2022-2-3"), { credit: 380.25, tid: uuidv4() }));

        // These all have to be strings as we need the return to have 2dp, but js will automatically remove trailing 0's, so to combat this we return strings
        expect(adachain.balance()).toBe("1692.25");
        expect(adachain.balance("7d")).toBe("380.25");
        expect(adachain.balance("30d")).toBe("841.00");
    });
});

describe('Chain editing & rebuilding test suite', () => {
    var adachain = new Chain();
    adachain.addblock(new Block(new Date(), { credit: 100.25, tid: uuidv4() }));
    adachain.addblock(new Block(new Date(), { credit: 450.75, tid: uuidv4() }));
    adachain.addblock(new Block(new Date(), { debit: -324.75, tid: uuidv4() }));
    adachain.addblock(new Block(new Date(), { debit: -34.56, tid: uuidv4() }));

    test('isValid after edit tests', () => {
        adachain.getBlock(2).amount = 999.99;

        // Should be the edited amount balance
        expect(adachain.balance()).toBe("740.93");

        // The chain should now not be valid as we edited it above
        expect(adachain.isValid()).toBeFalsy();
    });

    test('Rebuilding after edit tests', () => {
        // Now when we rebuild the chain it should be valid
        adachain.rebuild();

        expect(adachain.isValid()).toBeTruthy();
    });
});