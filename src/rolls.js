export default function () {

    const rollDice = function (number_of_dice) {
        const dice_results = []
        for (i = 0; i < number_of_dice; i++) {
            dice_results.push(Math.floor(Math.random() * 6) + 1)
        }
        return dice_results
    }

    const toHit = function (attacker_ws, defender_ws) {
        target_value = 4
        if (attacker_ws > defender_ws) {
            target_value = 3
        }
        if (attacker_ws < defender_ws * 2 + 1) {
            target_value = 5
        }
        target_value

    }

    const toWound = function (strength, toughness) {
        target_value = 4
        if (strength = toughness + 1) {
            target_value = 3
        }
        if (strength >= toughness + 2) {
            target_value = 2
        }
        if (strength = toughness - 1) {
            target_value = 5
        }
        if (strength = toughness - 2) {
            target_value = 6
        }
        if (strength = toughness - 3) {
            target_value = 6
        }
        if (strength <= toughness - 4) {
            target_value = 7
        }

        dice_roll >= target_value
    }

    const ableToCrit = function (strength, toughness) {
        strength >= toughness - 1
    }

    const isACrit = function (dice_roll) {
        return dice_roll == 6
    }

    const parry = function (attacker_roll, defender_roll) {
        return attacker_roll < defender_roll
    }

    const injury = function (injury_roll) {
        if (injury_roll == 1 || injury_roll == 2) {
            return "knocked down"
        }
        if (injury_roll == 3 || injury_roll == 4) {
            return "stunned"
        }
        if (injury_roll == 5 || injury_roll == 6) {
            return "out of action"
        }
    }
}