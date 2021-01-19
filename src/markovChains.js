import * as Markov from "js-markov"

class MarkovChains {
    constructor() {
        this.chain = new Markov('numeric');
    }

    updateChainStates(sequence) {
        let notes = sequence.filter(this.onlyUnique);
        for (let item of notes) {
            this.chain.addStates({
                state: item, // what state do you want to add
                predictions: notes // 
              });
        }
    }

    train() {
        this.chain.train();
    }

    generate() {
        return this.chain.generateRandom()
    }

    predict(value) {
        return this.chain.predict(value)
    }

    generateAndPredict() {
        let items = this.chain.generateRandom()
        let res = []
        for (let item of items) {
            res.push(this.predict(item))
        }
        return res
    }

    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

}

export default MarkovChains;