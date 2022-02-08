const sha256 = require("crypto-js/sha256");

Number.prototype.countDecimals = function () {
    if(Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0; 
}

class Block {
    constructor(time, transaction) {
        this.time = time instanceof Date && time.getTime() <= new Date().getTime() ? time.getTime() : undefined;
        this.type = Object.keys(transaction)[0];
        this.tid = Object.keys(transaction)[1] === "tid" ? transaction["tid"] : undefined;
        this.amount = transaction[this.type];
        this.lastHash = 0;


        var _verified = !isNaN(this.time) && this._checkType() && this.tid != undefined && this.amount.countDecimals() == 2 && this.time != undefined;
        this.isVerified = function() { return _verified; };

        this.hash = this.calculatehash();
    }

    _checkType() {
        return (this.type === "debit" && (-1000 <= this.amount && this.amount < 0)) || (this.type === "credit" && (0 < this.amount && this.amount <= 1000));
    }

    calculatehash() {
        let hash = sha256(this.time + this.amount + this.tid + this.type + this.lastHash);
        return hash.toString();
    }

    isUnique(chain) {
        if (chain instanceof Chain) {
            for (let i = 0; i < chain.chain.length; i++) {
                if (chain.chain[i].tid === this.tid && chain.chain[i] != this) { return false; }
            }
            return true;
        }
    }

    validtransaction(chain) {
        return this.isVerified() && this.isUnique(chain)
    }
}

class Chain {
    constructor() {
        this.chain = [ this.genesisblock() ] ;
    }

    genesisblock() {
        return new Block(new Date(0), 'Genesis Block')
    }

    lastblock() {
        return this.chain[ this.chain.length -1 ];
    }

    addblock(newblock) {
        if (!(newblock instanceof Block) || !newblock.isVerified()) { return false; }
        // if (!this.isValid()) { this._correctchain();}
        if (!newblock.isUnique(this)) { return false; }

        newblock.lastHash = this.lastblock().hash;
        newblock.hash = newblock.calculatehash();

        this.chain.push(newblock);
        return true;
    }

    _correctchain() {
        let lastblock = this.chain.length - 2;
        while(!this.isValid()) {
            if (this.validateBlock(lastblock)) {
                lastblock--;
            } else {
                console.log("Block " + lastblock + " is NOT valid, rehashing...")
                let block = this.getBlock(lastblock);
                let prev = this.getBlock(lastblock-1);

                block.lastHash = prev.hash;
                block.hash = block.calculatehash();
                lastblock++;
            }
        }
    }

    getBlock(at) {
        if (isNaN(at)) { return undefined; }
        if (at >= 0 && at < this.chain.length){return this.chain[at];}
    }

    isValid() {
        for (let b = 1; b < this.chain.length; b++) {
            if (!this.validateBlock(b)) { return false; }
        }
        return true;
    }

    balance(range) {
        let vol = 0;
        let ranges = { "1h": 3.6e+6, "24h": 8.64e+7, "7d": 6.048e+8, "30d": 2.592e+9};

        if (ranges[range] === undefined) { range = "alltime"; }
        let frame = Date.now() - ranges[range];

        for (let i = 1; i < this.chain.length; i++) {
            const block = this.chain[i];

            if (range == "alltime" || block.time > frame) {
                vol += block.amount;
            }
        }
        return vol.toFixed(2);
    }

    validateBlock(num) {
        if (isNaN(num)) { return false; }
        const current = this.chain[num];
        if (current==undefined) { return false; }
        const last = this.chain[num-1];

        if (current.hash !== current.calculatehash()) {
            return false;
        }

        if (current.lastHash !== last.hash) {
            return false;
        }
        return true;
    }

    rebuild() {
        this._correctchain();
    }
}

// Calculate volume traded
// Validation individual transactions

// let adachain = new Chain();

// adachain.addblock(new Block(new Date('2021-01-1'), {credit: 5, tid: uuidv4()}));
// adachain.addblock(new Block(new Date('2021-01-1'), {credit: 10.5, tid: uuidv4()}));
// adachain.addblock(new Block(new Date('2021-01-1'), {credit: 25.25, tid: uuidv4()}));

// adachain.addblock(new Block(new Date('2021-01-1'), {debit: -10, tid: uuidv4()}));
// adachain.addblock(new Block(new Date('2021-01-1'), {debit: -5, tid: uuidv4()}));

// console.log(adachain.chain)
// console.log("All time: " + adachain.balance(""));

// adachain.getBlock(2).amount = 100;

// console.log("All time: " + adachain.balance(""));

// console.log("Is valid: " + adachain.isValid());

// adachain.rebuild();

// console.log("Is valid: " + adachain.isValid());

// adachain.addblock(new Block(new Date('2021-01-2'), {amount: 16}));
// adachain.addblock(new Block(new Date('2021-01-3'), {amount: 17}));
// adachain.addblock(new Block(new Date('2022-01-1'), {amount: 18}));
// adachain.addblock(new Block(new Date('2022-01-2'), {amount: 19}));
// adachain.addblock(new Block(new Date('2022-01-3'), {amount: 20}));
// adachain.addblock(new Block(new Date('2022-01-16'), {amount: 21}));
// adachain.addblock(new Block(new Date(), {amount: 22}));

// console.log(adachain.chain)
// // console.log("Is valid: " + adachain.isValid());

// // // Attempt to change the chain, causing a malformed chain
// adachain.chain[4].transaction = { amount: 100000 }

// adachain.revalidate();

// // // console.log(adachain.chain)
// // console.log("Is valid: " + adachain.isValid());

// // // Add a new block and perform self-healing algorithm
// // adachain.addblock(new Block(new Date(), {amount: 30}));

// // console.log("Is valid: " + adachain.isValid());

// console.log("Adding non legit: " + adachain.addblock("my cool block"));
// console.log("Adding non legit 2: " + adachain.addblock(new Block(2, { "hush": 4})));

// console.log("7 day: " + adachain.volume("7d"));
// console.log("30 day: " + adachain.volume("30d"));
// console.log("All time: " + adachain.volume("alltime"));

// console.log("All time: " + adachain.volume(""));

module.exports = { Block, Chain }