const IS_MUTATE_PROBABILITY = 0.8
const MUTATE_PROBABILITY = 0.7

class Gene {
    constructor(sequence, items) {
        this.sequence = sequence;
        this.cost = 999999;
        this.items = items;
    }

    random(length) {
        while (length--) {
            let rand = Math.floor(Math.random() * this.sequence.length)
            this.items.push(this.sequence[rand])
        }
    }

    mutate(chance) {
        if (Math.random() > chance) return;
        var index = Math.floor(Math.random() * this.items.length);
        var mutateItem = Math.random() <= MUTATE_PROBABILITY ? 63 : 66;
        var newItem = [];
        for (let i = 0; i < this.items.length; i++) {
            if (i === index) newItem.push(mutateItem);
            else newItem.push(this.items[i]);
        }
        this.items = newItem;
    }
    
    mate(gene) {
        var pivot = Math.round(this.items.length / 2) - 1;
        var child1 = this.items.slice(0, pivot).concat(gene.items.slice(pivot));
        var child2 = gene.items.slice(0, pivot).concat(this.items.slice(pivot));
        return [new Gene(this.sequence, child1), new Gene(this.sequence, child2)];
    }

    fitness(comparableItem) {
        var total = 0;
        for (let i = 0; i < this.items.length; i++) {
            total += (this.items[i] - comparableItem[i]) * (this.items[i] - comparableItem[i]);
        }
        this.cost = (total || 500);
    }
}

class Population {
    constructor(goal, size) {
        this.members = [];
        this.goal = goal;
        this.generationNumber = 0;
        let i = 0;
        while (size > 0) {
            if (goal.length > i+4) {
                /**
                 * Sorting, reverse, shuffle, shifting, scale, and more...
                 */
                var gene = new Gene(goal.slice(i, i+4), []); // array.slice(a, b) [a, ..., b-1]
                var rev_gene = new Gene(goal.slice(i, i+4).reverse(), []);
                i += 4;
            }
            gene.random(this.goal.length);
            rev_gene.random(this.goal.length);
            this.members.push(gene);
            this.members.push(rev_gene);
            size--;
        }
    }

    sortMembersByCost() {
        // array of objects
        this.members.sort(function(a, b) {
            return a.cost - b.cost;
        });
    }

    generation() {
        for (let i = 0; i < this.members.length; i++) {
            this.members[i].fitness(this.goal);
        }
    
        this.sortMembersByCost();
        this.printProcess();
        var children = this.members[0].mate(this.members[1]);
        this.members.splice(this.members.length - 2, 2, children[0], children[1]);
    
        for (let i = 0; i < this.members.length; i++) {
            this.members[i].mutate(IS_MUTATE_PROBABILITY);
            this.members[i].fitness(this.goal);
            if (this.members[i].items === this.goal) {
                this.sortMembersByCost();
                this.printProcess();
                return true;
            }
        }
        this.generationNumber++;
    }

    printProcess() {
        console.log("Generation:", this.generationNumber)
        for (var i = 0; i < this.members.length; i++) {
            console.log("Item:", this.members[i].items, ", Cost:", this.members[i].cost)
        }
    }
}

export default Population;
