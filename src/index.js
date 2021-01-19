import * as Tone from "tone"
import Population from "./geneticAlgorithm"
import MarkovChain from "./markovChains"

function createGenerations(sequence, generations) {
    var population = new Population(sequence, sequence.length / 4);
    for (let i = 0; i < generations; i++) {
        population.generation();
    }
    return population.members[population.members.length - 1]
}

function playSequence(sequence) {
    const synth = new Tone.PolySynth().toDestination();
    const now = Tone.now()
    let d = 0.5
    for (let i = 0; i < sequence.length; i++) {
        sequence[i] ? 
            synth.triggerAttackRelease(Tone.Frequency(sequence[i], "midi").toNote(), d, now + (i*d))
            : 
            synth.triggerAttackRelease(null, d, now + (i*d))
    }
  }

var notes = [];

// Observe the user interaction
const observer = new MutationObserver(function() {
    let lastNote = document.getElementById("notesPlayed").innerHTML.slice(-3) // last 2 items + space
    notes.push(Number(lastNote)) // "69 "
});

const elementToObserve = document.getElementById("notesPlayed");
observer.observe(elementToObserve, {subtree: true, childList: true});

document.getElementById("generate-genetic").addEventListener("click", function() {
    var lastGeneration = createGenerations(notes, 12)
    playSequence(lastGeneration.items.slice(0, 12))    
})

document.getElementById("generate-markov").addEventListener("click", function() {
    var markov = new MarkovChain()
    markov.updateChainStates(notes)
    markov.train()
    playSequence(markov.generate()) 
})
