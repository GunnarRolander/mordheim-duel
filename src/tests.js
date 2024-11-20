import { toHitPhase, toWoundPhase, injuryPhase, doRecovery } from './combat.js';
import { weapons, armour } from './equipment.js';

export const runTests = () => {
  const warrior_1 = {
    name: "warrior_1",
    ws: 3,
    strength: 3,
    toughness: 3,
    attacks: 1,
    wounds: 1,
    initiative: 3,
    status: "standing",
    weapons: [weapons['handweapon'], weapons['handweapon']],
    armour: [],
    armour_save: 7,
    charger: false,
    stood_up: false
  }

  const warrior_2 = {
    name: "warrior_1",
    ws: 2,
    strength: 3,
    toughness: 3,
    attacks: 1,
    wounds: 1,
    initiative: 3,
    status: "standing",
    weapons: [weapons['handweapon'], weapons['handweapon']],
    armour: [],
    armour_save: 7,
    charger: false,
    stood_up: false
  }

  // to Hit tests
  let result = testToHitPhase(warrior_1, warrior_2)
  let main_hit_ratio = result.main_hit_ratio
  let off_hit_ratio = result.off_hit_ratio
  console.log("WS3 vs WS2, average number of hits:", main_hit_ratio)
  console.log("WS3 vs WS2, average number of offhand hits:", off_hit_ratio)
  console.assert(main_hit_ratio > 0.66 && main_hit_ratio < 0.67, "WS3 vs WS2, average number of hits is not 0.666")
  console.assert(off_hit_ratio > 0.66 && off_hit_ratio < 0.67, "WS3 vs WS2, average number of offhand hits is not 0.666")

  warrior_2.ws = 3
  result = testToHitPhase(warrior_1, warrior_2)
  main_hit_ratio = result.main_hit_ratio
  off_hit_ratio = result.off_hit_ratio
  console.log("WS3 vs WS3, average number of hits:", main_hit_ratio)
  console.log("WS3 vs WS3, average number of offhand hits:", off_hit_ratio)
  console.assert(main_hit_ratio > 0.49 && main_hit_ratio < 0.51, "WS3 vs WS3, average number of hits is not 0.5")
  console.assert(off_hit_ratio > 0.49 && off_hit_ratio < 0.51, "WS3 vs WS3, average number of offhand hits is not 0.5")

  warrior_1.ws = 2
  warrior_2.ws = 5
  result = testToHitPhase(warrior_1, warrior_2)
  main_hit_ratio = result.main_hit_ratio
  off_hit_ratio = result.off_hit_ratio
  console.log("WS2 vs WS5, average number of hits:", main_hit_ratio)
  console.log("WS2 vs WS5, average number of offhand hits:", off_hit_ratio)
  console.assert(main_hit_ratio > 0.32 && main_hit_ratio < 0.34, "WS3 vs WS3, average number of hits is not 0.333")
  console.assert(off_hit_ratio > 0.32 && off_hit_ratio < 0.34, "WS3 vs WS3, average number of offhand hits is not 0.333")

  // to Wound-tests
  warrior_2.toughness = 1
  result = testToWoundPhase(warrior_1, warrior_2, 1, 1, false, true)
  let main_wound_ratio = result.main_wound_ratio
  let off_wound_ratio = result.off_wound_ratio
  console.log("S3 vs T1 (no crits), average number of wounds:", main_wound_ratio)
  console.log("S3 vs T1 (no crits), average number of offhand wounds:", off_wound_ratio)
  console.assert(main_wound_ratio > 0.83 && main_wound_ratio < 0.84, "S3 vs T1, average number of wounds is not 0.833")
  console.assert(off_wound_ratio > 0.83 && off_wound_ratio < 0.84, "S3 vs T1, average number of offhand wounds is not 0.833")

  warrior_2.toughness = 2
  result = testToWoundPhase(warrior_1, warrior_2, 1, 1, false, true)
  main_wound_ratio = result.main_wound_ratio
  off_wound_ratio = result.off_wound_ratio
  console.log("S3 vs T2 (no crits), average number of wounds:", main_wound_ratio)
  console.log("S3 vs T2 (no crits), average number of offhand wounds:", off_wound_ratio)
  console.assert(main_wound_ratio > 0.66 && main_wound_ratio < 0.67, "S3 vs T2, average number of wounds is not 0.666")
  console.assert(off_wound_ratio > 0.66 && off_wound_ratio < 0.67, "S3 vs T2, average number of offhand wounds is not 0.666")

  warrior_2.toughness = 3
  result = testToWoundPhase(warrior_1, warrior_2, 1, 1, false, true)
  main_wound_ratio = result.main_wound_ratio
  off_wound_ratio = result.off_wound_ratio
  console.log("S3 vs T3 (no crits), average number of wounds:", main_wound_ratio)
  console.log("S3 vs T3 (no crits), average number of offhand wounds:", off_wound_ratio)
  console.assert(main_wound_ratio > 0.49 && main_wound_ratio < 0.51, "S3 vs T3, average number of wounds is not 0.5")
  console.assert(off_wound_ratio > 0.49 && off_wound_ratio < 0.51, "S3 vs T3, average number of offhand wounds is not 0.5")

  warrior_2.toughness = 4
  result = testToWoundPhase(warrior_1, warrior_2, 1, 1, false, true)
  main_wound_ratio = result.main_wound_ratio
  off_wound_ratio = result.off_wound_ratio
  console.log("S3 vs T4 (no crits), average number of wounds:", main_wound_ratio)
  console.log("S3 vs T4 (no crits), average number of offhand wounds:", off_wound_ratio)
  console.assert(main_wound_ratio > 0.325 && main_wound_ratio < 0.34, "S3 vs T4, average number of wounds is not 0.333")
  console.assert(off_wound_ratio > 0.325 && off_wound_ratio < 0.34, "S3 vs T4, average number of offhand wounds is not 0.333")

  warrior_2.toughness = 5
  result = testToWoundPhase(warrior_1, warrior_2, 1, 1, false, true)
  main_wound_ratio = result.main_wound_ratio
  off_wound_ratio = result.off_wound_ratio
  console.log("S3 vs T5 (no crits), average number of wounds:", main_wound_ratio)
  console.log("S3 vs T5 (no crits), average number of offhand wounds:", off_wound_ratio)
  console.assert(main_wound_ratio > 0.16 && main_wound_ratio < 0.17, "S3 vs T5, average number of wounds is not 0.166")
  console.assert(off_wound_ratio > 0.16 && off_wound_ratio < 0.17, "S3 vs T5, average number of offhand wounds is not 0.166")

  warrior_2.toughness = 6
  result = testToWoundPhase(warrior_1, warrior_2, 1, 1, false, true)
  main_wound_ratio = result.main_wound_ratio
  off_wound_ratio = result.off_wound_ratio
  console.log("S3 vs T6 (no crits), average number of wounds:", main_wound_ratio)
  console.log("S3 vs T6 (no crits), average number of offhand wounds:", off_wound_ratio)
  console.assert(main_wound_ratio > 0.16 && main_wound_ratio < 0.17, "S3 vs T6, average number of wounds is not 0.166")
  console.assert(off_wound_ratio > 0.16 && off_wound_ratio < 0.17, "S3 vs T6, average number of offhand wounds is not 0.166")

  warrior_2.toughness = 7
  result = testToWoundPhase(warrior_1, warrior_2, 1, 1, false, true)
  main_wound_ratio = result.main_wound_ratio
  off_wound_ratio = result.off_wound_ratio
  console.log("S3 vs T7 (no crits), average number of wounds:", main_wound_ratio)
  console.log("S3 vs T7 (no crits), average number of offhand wounds:", off_wound_ratio)
  console.assert(main_wound_ratio == 0, "S3 vs T7, average number of wounds is not 0")
  console.assert(off_wound_ratio == 0, "S3 vs T7, average number of offhand wounds is not 0")

  // check crits
  warrior_2.toughness = 1
  result = testToWoundPhase(warrior_1, warrior_2, 1, 0, false, false)
  let crit_ratio = result.crit_ratio
  let crit_no_armour_ratio = result.crit_no_armour_ratio
  let crit_bonus_injury_ratio = result.crit_bonus_injury_ratio
  console.log("S3 vs T1 (crits), average number of crits:", crit_ratio)
  console.log("S3 vs T1 (crits), average number of crits with no armour save:", crit_no_armour_ratio)
  console.log("S3 vs T1 (crits), average number of crits with bonus injury:", crit_bonus_injury_ratio)
  console.assert(crit_ratio > 0.16 && crit_ratio < 0.17, "S3 vs T1, average number of crits is not 0.166")
  console.assert(crit_no_armour_ratio > 0.16*2/3 && crit_no_armour_ratio < 0.17*2/3, "S3 vs T1, average number of crits with no armour save is not 0.166 * 2/3")
  console.assert(crit_bonus_injury_ratio > 0.16*1/3 && crit_bonus_injury_ratio < 0.17*1/3, "S3 vs T1, average number of crits with bonus injury is not 0.166 * 1/3")

  warrior_2.toughness = 2
  result = testToWoundPhase(warrior_1, warrior_2, 1, 0, false, false)
  crit_ratio = result.crit_ratio
  crit_no_armour_ratio = result.crit_no_armour_ratio
  crit_bonus_injury_ratio = result.crit_bonus_injury_ratio
  console.log("S3 vs T2 (crits), average number of crits:", crit_ratio)
  console.log("S3 vs T2 (crits), average number of crits with no armour save:", crit_no_armour_ratio)
  console.log("S3 vs T2 (crits), average number of crits with bonus injury:", crit_bonus_injury_ratio)
  console.assert(crit_ratio > 0.16 && crit_ratio < 0.17, "S3 vs T2, average number of crits is not 0.166")
  console.assert(crit_no_armour_ratio > 0.16*2/3 && crit_no_armour_ratio < 0.17*2/3, "S3 vs T2, average number of crits with no armour save is not 0.166 * 2/3")
  console.assert(crit_bonus_injury_ratio > 0.16*1/3 && crit_bonus_injury_ratio < 0.17*1/3, "S3 vs T2, average number of crits with bonus injury is not 0.166 * 1/3")

  warrior_2.toughness = 3
  result = testToWoundPhase(warrior_1, warrior_2, 1, 0, false, false)
  crit_ratio = result.crit_ratio
  crit_no_armour_ratio = result.crit_no_armour_ratio
  crit_bonus_injury_ratio = result.crit_bonus_injury_ratio
  console.log("S3 vs T3 (crits), average number of crits:", crit_ratio)
  console.log("S3 vs T3 (crits), average number of crits with no armour save:", crit_no_armour_ratio)
  console.log("S3 vs T3 (crits), average number of crits with bonus injury:", crit_bonus_injury_ratio)
  console.assert(crit_ratio > 0.16 && crit_ratio < 0.17, "S3 vs T3, average number of crits is not 0.166")
  console.assert(crit_no_armour_ratio > 0.16*2/3 && crit_no_armour_ratio < 0.17*2/3, "S3 vs T3, average number of crits with no armour save is not 0.166 * 2/3")
  console.assert(crit_bonus_injury_ratio > 0.16*1/3 && crit_bonus_injury_ratio < 0.17*1/3, "S3 vs T3, average number of crits with bonus injury is not 0.166 * 1/3")

  warrior_2.toughness = 4
  result = testToWoundPhase(warrior_1, warrior_2, 1, 0, false, false)
  crit_ratio = result.crit_ratio
  crit_no_armour_ratio = result.crit_no_armour_ratio
  crit_bonus_injury_ratio = result.crit_bonus_injury_ratio
  console.log("S3 vs T4 (crits), average number of crits:", crit_ratio)
  console.log("S3 vs T4 (crits), average number of crits with no armour save:", crit_no_armour_ratio)
  console.log("S3 vs T4 (crits), average number of crits with bonus injury:", crit_bonus_injury_ratio)
  console.assert(crit_ratio > 0.16 && crit_ratio < 0.17, "S3 vs T4, average number of crits is not 0.166")
  console.assert(crit_no_armour_ratio > 0.16*2/3 && crit_no_armour_ratio < 0.17*2/3, "S3 vs T4, average number of crits with no armour save is not 0.166 * 2/3")
  console.assert(crit_bonus_injury_ratio > 0.16*1/3 && crit_bonus_injury_ratio < 0.17*1/3, "S3 vs T4, average number of crits with bonus injury is not 0.166 * 1/3")

  warrior_2.toughness = 5
  result = testToWoundPhase(warrior_1, warrior_2, 1, 0, false, false)
  crit_ratio = result.crit_ratio
  crit_no_armour_ratio = result.crit_no_armour_ratio
  crit_bonus_injury_ratio = result.crit_bonus_injury_ratio
  console.log("S3 vs T5 (crits), average number of crits:", crit_ratio)
  console.log("S3 vs T5 (crits), average number of crits with no armour save:", crit_no_armour_ratio)
  console.log("S3 vs T5 (crits), average number of crits with bonus injury:", crit_bonus_injury_ratio)
  console.assert(crit_ratio == 0, "S3 vs T5, average number of crits is not 0")
  console.assert(crit_no_armour_ratio == 0, "S3 vs T5, average number of crits with no armour save is not 0")
  console.assert(crit_bonus_injury_ratio == 0, "S3 vs T5, average number of crits with bonus injury is not 0")

  warrior_2.toughness = 6
  result = testToWoundPhase(warrior_1, warrior_2, 1, 0, false, false)
  crit_ratio = result.crit_ratio
  crit_no_armour_ratio = result.crit_no_armour_ratio
  crit_bonus_injury_ratio = result.crit_bonus_injury_ratio
  console.log("S3 vs T6 (crits), average number of crits:", crit_ratio)
  console.log("S3 vs T6 (crits), average number of crits with no armour save:", crit_no_armour_ratio)
  console.log("S3 vs T6 (crits), average number of crits with bonus injury:", crit_bonus_injury_ratio)
  console.assert(crit_ratio == 0, "S3 vs T6, average number of crits is not 0")
  console.assert(crit_no_armour_ratio == 0, "S3 vs T6, average number of crits with no armour save is not 0")
  console.assert(crit_bonus_injury_ratio == 0, "S3 vs T6, average number of crits with bonus injury is not 0")

  warrior_2.toughness = 3
  result = testInjuryPhase(warrior_1, warrior_2, 1, 0, 0)
  let knocked_ratio = result.knocked_ratio
  let stunned_ratio = result.stunned_ratio
  let ooa_ratio = result.ooa_ratio
  console.log("1 unsaved wound, ratio of knocked down injuries:", knocked_ratio)
  console.log("1 unsaved wound, ratio of stunned injuries:", stunned_ratio)
  console.log("1 unsaved wound, ratio of out of action injuries:", ooa_ratio)
  console.assert(knocked_ratio > 0.325 && knocked_ratio < 0.34, "1 unsaved wound, ratio of knocked down injuries is not 0.333")
  console.assert(stunned_ratio > 0.325 && stunned_ratio < 0.34, "1 unsaved wound, ratio of stunned injuries is not 0.333")
  console.assert(ooa_ratio > 0.325 && ooa_ratio < 0.34, "1 unsaved wound, ratio of out of action injuries is not 0.333")

  result = testInjuryPhase(warrior_1, warrior_2, 0, 1, 0)
  knocked_ratio = result.knocked_ratio
  stunned_ratio = result.stunned_ratio
  ooa_ratio = result.ooa_ratio
  console.log("1 unsaved wound (offhand), ratio of knocked down injuries:", knocked_ratio)
  console.log("1 unsaved wound (offhand), ratio of stunned injuries:", stunned_ratio)
  console.log("1 unsaved wound (offhand), ratio of out of action injuries:", ooa_ratio)
  console.assert(knocked_ratio > 0.325 && knocked_ratio < 0.34, "1 unsaved wound, ratio of knocked down injuries is not 0.333")
  console.assert(stunned_ratio > 0.325 && stunned_ratio < 0.34, "1 unsaved wound, ratio of stunned injuries is not 0.333")
  console.assert(ooa_ratio > 0.325 && ooa_ratio < 0.34, "1 unsaved wound, ratio of out of action injuries is not 0.333")

  result = testInjuryPhase(warrior_1, warrior_2, 1, 0, 2)
  knocked_ratio = result.knocked_ratio
  stunned_ratio = result.stunned_ratio
  ooa_ratio = result.ooa_ratio
  console.log("1 unsaved wound +2 to injury roll, ratio of knocked down injuries:", knocked_ratio)
  console.log("1 unsaved wound +2 to injury roll, ratio of stunned injuries:", stunned_ratio)
  console.log("1 unsaved wound +2 to injury roll, ratio of out of action injuries:", ooa_ratio)
  console.assert(knocked_ratio == 0, "1 unsaved wound, ratio of knocked down injuries is 0")
  console.assert(stunned_ratio > 0.325 && stunned_ratio < 0.34, "1 unsaved wound, ratio of stunned injuries is not 0.333")
  console.assert(ooa_ratio > 0.66 && ooa_ratio < 0.675, "1 unsaved wound, ratio of out of action injuries is not 0.666")

  warrior_2.status = "knocked down"
  result = testInjuryPhase(warrior_1, warrior_2, 1, 0, 0)
  knocked_ratio = result.knocked_ratio
  stunned_ratio = result.stunned_ratio
  ooa_ratio = result.ooa_ratio
  console.log("1 unsaved wound vs knocked down warrior, ratio of knocked down injuries:", knocked_ratio)
  console.log("1 unsaved wound vs knocked down warrior, ratio of stunned injuries:", stunned_ratio)
  console.log("1 unsaved wound vs knocked down warrior, ratio of out of action injuries:", ooa_ratio)
  console.assert(knocked_ratio == 0, "1 unsaved wound vs knocked down warrior, ratio of knocked down injuries is 0")
  console.assert(stunned_ratio == 0, "1 unsaved wound vs knocked down warrior, ratio of stunned injuries is 0")
  console.assert(ooa_ratio == 1, "1 unsaved wound vs knocked down warrior, ratio of out of action injuries is 1")

  warrior_2.status = "stunned"
  result = testInjuryPhase(warrior_1, warrior_2, 0, 0, 0)
  knocked_ratio = result.knocked_ratio
  stunned_ratio = result.stunned_ratio
  ooa_ratio = result.ooa_ratio
  console.log("No unsaved wounds vs stunned warrior, ratio of knocked down injuries:", knocked_ratio)
  console.log("No unsaved wounds vs stunned warrior, ratio of stunned injuries:", stunned_ratio)
  console.log("No unsaved wounds vs stunned warrior, ratio of out of action injuries:", ooa_ratio)
  console.assert(knocked_ratio == 0, "No unsaved wounds vs stunned warrior, ratio of knocked down injuries is 0")
  console.assert(stunned_ratio == 0, "No unsaved wounds vs stunned warrior, ratio of stunned injuries is 0")
  console.assert(ooa_ratio == 1, "No unsaved wounds vs stunned warrior, ratio of out of action injuries is 1")
  warrior_2.status = "standing"

  let status = testDoRecovery(warrior_1, "knocked down")
  console.log("Knocked down warrior, recovery status:", status)
  console.assert(status === "standing", "Knocked down warrior, recovery status is not standing")
  console.assert(warrior_1.stood_up === true, "Knocked down warrior, stood_up is not stood up")

  warrior_1.stood_up = false
  status = testDoRecovery(warrior_1, "stunned")
  console.log("Stunned warrior, recovery status:", status)
  console.assert(status === "knocked down", "Stunned warrior, recovery status is not knocked down")
  console.assert(warrior_1.stood_up === false, "Out of action warrior, stood_up is not false")

  status = testDoRecovery(warrior_1, "out of action")
  console.log("Out of action warrior, recovery status:", status)
  console.assert(status === "out of action", "Out of action warrior, recovery status is not out of action")
  console.assert(warrior_1.stood_up === false, "Out of action warrior, stood_up is not false")

  // Test parry
  warrior_1.weapons = [weapons['handweapon']]
  warrior_2.weapons = [weapons['sword']]
  warrior_1.ws = 3
  warrior_2.ws = 2
  result = testToHitPhase(warrior_1, warrior_2)
  main_hit_ratio = result.main_hit_ratio
  off_hit_ratio = result.off_hit_ratio
  console.log("WS3 vs WS2, average number of hits with parry:", main_hit_ratio)
  console.assert(main_hit_ratio > 0.49 && main_hit_ratio < 0.51, "WS3 vs WS2, average number of hits with parry is not 0.5")

  warrior_2.ws = 3
  result = testToHitPhase(warrior_1, warrior_2)
  main_hit_ratio = result.main_hit_ratio
  off_hit_ratio = result.off_hit_ratio
  console.log("WS3 vs WS3, average number of hits with parry:", main_hit_ratio)
  console.assert(main_hit_ratio > 0.41 && main_hit_ratio < 0.42, "WS3 vs WS2, average number of hits with parry is not 0.4167")

  warrior_1.ws = 2
  warrior_2.ws = 5
  result = testToHitPhase(warrior_1, warrior_2)
  main_hit_ratio = result.main_hit_ratio
  off_hit_ratio = result.off_hit_ratio
  console.log("WS2 vs WS5, average number of hits with parry:", main_hit_ratio)
  console.assert(main_hit_ratio > 0.30 && main_hit_ratio < 0.31, "WS2 vs WS5, average number of hits with parry is not 0.3056")
}

const testToHitPhase = (warrior_1_base, warrior_2_base, number_of_simulations=100000) => {
  let total_hits = 0;
  let total_hits_offhand = 0;
  for (let i = 0; i < number_of_simulations; i++) {
    const warrior1 = JSON.parse(JSON.stringify(warrior_1_base))
    const warrior2 = JSON.parse(JSON.stringify(warrior_2_base))
    const {
      main_hits,
      offhand_hits,
    } = toHitPhase(warrior1, warrior2);
    total_hits += main_hits
    total_hits_offhand += offhand_hits
  }
  return {
    main_hit_ratio: total_hits / number_of_simulations,
    off_hit_ratio: total_hits_offhand / number_of_simulations
  }
}

const testToWoundPhase = (warrior_1_base, warrior_2_base, hits, offhand_hits, first_round, no_crits, number_of_simulations=100000) => {
  let total_wounds = 0;
  let total_wounds_offhand = 0;
  let total_crits = 0;
  let total_crit_no_armour = 0;
  let total_crit_bonus_injury = 0;
  for (let i = 0; i < number_of_simulations; i++) {
    const warrior1 = JSON.parse(JSON.stringify(warrior_1_base))
    const warrior2 = JSON.parse(JSON.stringify(warrior_2_base))
    const {
      main_wounds,
      offhand_wounds,
      injury_bonus,
      no_armour_save,
      extra_wounds
    } = toWoundPhase(warrior1, warrior2, hits, offhand_hits, first_round, no_crits);
    total_wounds += main_wounds
    total_wounds_offhand += offhand_wounds
    total_crits += extra_wounds
    if (no_armour_save) total_crit_no_armour += 1
    if (injury_bonus > 0) total_crit_bonus_injury += 1
  }
  return {
    main_wound_ratio: total_wounds / number_of_simulations,
    off_wound_ratio: total_wounds_offhand / number_of_simulations,
    crit_ratio: total_crits / number_of_simulations,
    crit_no_armour_ratio: total_crit_no_armour / number_of_simulations,
    crit_bonus_injury_ratio: total_crit_bonus_injury / number_of_simulations
  }
}

const testInjuryPhase = (warrior_1_base, warrior_2_base, main_wounds, offhand_wounds, injury_bonus, number_of_simulations=100000) => {
  let knocked = 0
  let stunned = 0
  let ooa = 0

  for (let i = 0; i < number_of_simulations; i++) {
    const warrior1 = JSON.parse(JSON.stringify(warrior_1_base))
    const warrior2 = JSON.parse(JSON.stringify(warrior_2_base))
    const {
      main_injury_roll,
      offhand_injury_roll,
    } = injuryPhase(warrior1, warrior2, main_wounds, offhand_wounds, injury_bonus);
    if (warrior2.status === "knocked down") knocked += 1
    if (warrior2.status === "stunned") stunned += 1
    if (warrior2.status === "out of action") ooa += 1
  }

  return {
    knocked_ratio: knocked / number_of_simulations,
    stunned_ratio: stunned / number_of_simulations,
    ooa_ratio: ooa / number_of_simulations
  }

}

const testDoRecovery = (warrior_base, status) => {
  warrior_base.status = status
  doRecovery(warrior_base)
  return warrior_base.status
}