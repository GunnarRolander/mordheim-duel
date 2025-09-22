import { runSimulateCombat } from './combat.js';
import { weapons, armour, ranged_weapons } from './equipment.js';

const printResults = (simulations) => {
    console.table(simulations['A1'])
    console.table(simulations['A2'])
    console.table(simulations['A3'])
    console.table(simulations['A4'])
}

export const runBatch = () => {
    const simulations = {}
    let houseRules = {
        minus1ToHitOffhand: false,
        minus2ToHitOffhand: false,
        minusStrengthToOffhand: false,
        minusToHitDW: true,
        addWSToParry: false,
        ogSpears: false,
        ap5: false,
        noStrengthBasedAP: false
    }

    let warrior_1 = {
        WS: 3,
        BS: 3,
        S: 3,
        T: 3,
        W: 1,
        I: 3,
        A: 1,
        LD: 7,
        mainHand: 'club',
        mainHandPistol: 'emptyHand',
        offHand: 'sword',
        offHandPistol: 'emptyHand',
        selectedArmour: ['buckler'],
        charger: false,
        tags: [],
        armourSave: 7,
        skills: [],
    }

    let warrior_2 = {
        WS: 3,
        BS: 3,
        S: 3,
        T: 3,
        W: 1,
        I: 3,
        A: 1,
        LD: 7,
        mainHand: 'sword',
        mainHandPistol: 'emptyHand',
        offHand: 'emptyHand',
        offHandPistol: 'emptyHand',
        selectedArmour: [],
        charger: false,
        tags: [],
        armourSave: 6,
    }
    const ws_array = [1,2,3,4,7]
    //const ws_array = [1,4]

    let winRates = runSimulateCombat(warrior_1, warrior_2, houseRules, 100000)
    console.log(winRates)
    for (let a = 1; a <= 4; a++) {
        const akey = 'A' + a
        simulations[akey] = {}
        for (let wsidx = 0; wsidx < ws_array.length; wsidx++) {
            const ws = ws_array[wsidx]
            const wskey = 'WS' + ws
            simulations[akey][wskey] = {}
            for (let t = 1; t <= 6; t++) {
                const tkey = 'T' + t
                warrior_2.WS = ws
                warrior_2.T = t
                warrior_1.A = a
                winRates = runSimulateCombat(warrior_1, warrior_2, houseRules, 100000)
                simulations[akey][wskey][tkey] = winRates['win_rate_warrior_1']
                console.log(`Finished simulation for A:${a} WS:${ws} T:${t}`, winRates)
            }
        }
    }
    printResults(simulations)
}
    


