import { toHitPhase, toWoundPhase, injuryPhase, doRecovery, setUpAttacks, orderAttacksByInitiative } from './combat.js';
import { weapons, armour, ranged_weapons } from './equipment.js';

export const runTests = () => {
  let warrior_1 = {
    name: "warrior_1",
    ws: 3,
    strength: 3,
    toughness: 3,
    attacks: 1,
    wounds: 1,
    initiative: 3,
    status: "standing",
    weapons_mainhand: [weapons['handweapon']],
    weapons_offhand: [],
    weapons: [],
    armour: [],
    armour_save: 7,
    charger: false,
    stood_up: false,
    skills: [],
  }

  let warrior_2 = {
    name: "warrior_2",
    ws: 2,
    strength: 3,
    toughness: 3,
    attacks: 1,
    wounds: 1,
    initiative: 3,
    status: "standing",
    weapons_mainhand: [weapons['handweapon']],
    weapons_offhand: [],
    weapons: [],
    armour: [],
    armour_save: 7,
    charger: false,
    stood_up: false,
    skills: [],
  }

  let attack_group = []
  let main_hit_ratio = 0
  let main_wound_ratio = 0
  let crit_ratio = 0
  let crit_no_armour_ratio = 0
  let crit_bonus_injury_ratio = 0
  let knocked_ratio = 0
  let stunned_ratio = 0
  let ooa_ratio = 0

  let attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  let result = null
  let status = ""
  let old_status = ""
  let first_weapon = {}
  let last_weapon = {}
  let first_warrior = {}
  let last_warrior = {};

  // to Hit tests
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_2.ws = 2
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToHitPhase(warrior_1, warrior_2, attacks)
  main_hit_ratio = result.main_hit_ratio
  console.log("WS3 vs WS2, average number of hits:", main_hit_ratio)
  console.assert(main_hit_ratio > 0.66 && main_hit_ratio < 0.67, "WS3 vs WS2, average number of hits is not 0.666")

  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_2.ws = 3
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToHitPhase(warrior_1, warrior_2, attacks)
  main_hit_ratio = result.main_hit_ratio
  console.log("WS3 vs WS3, average number of hits:", main_hit_ratio)
  console.assert(main_hit_ratio > 0.49 && main_hit_ratio < 0.51, "WS3 vs WS3, average number of hits is not 0.5")

  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_1.ws = 2
  warrior_2.ws = 5
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  result = testToHitPhase(warrior_1, warrior_2, attacks)
  main_hit_ratio = result.main_hit_ratio
  console.log("WS2 vs WS5, average number of hits:", main_hit_ratio)
  console.assert(main_hit_ratio > 0.32 && main_hit_ratio < 0.34, "WS2 vs WS5, average number of hits is not 0.333")

  // to Wound-tests
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_2.toughness = 1
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToWoundPhase(warrior_1, warrior_2, attacks, 1, false, true)
  main_wound_ratio = result.main_wound_ratio
  console.log("S3 vs T1 (no crits), average number of wounds:", main_wound_ratio)
  console.assert(main_wound_ratio > 0.8275 && main_wound_ratio < 0.84, "S3 vs T1, average number of wounds is not 0.833")

  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_2.toughness = 2
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToWoundPhase(warrior_1, warrior_2, attacks, 1, false, true)
  main_wound_ratio = result.main_wound_ratio
  console.log("S3 vs T2 (no crits), average number of wounds:", main_wound_ratio)
  console.assert(main_wound_ratio > 0.66 && main_wound_ratio < 0.67, "S3 vs T2, average number of wounds is not 0.666")
  
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_2.toughness = 3
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToWoundPhase(warrior_1, warrior_2, attacks, 1, false, true)
  main_wound_ratio = result.main_wound_ratio
  console.log("S3 vs T3 (no crits), average number of wounds:", main_wound_ratio)
  console.assert(main_wound_ratio > 0.49 && main_wound_ratio < 0.51, "S3 vs T3, average number of wounds is not 0.5")
  
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_2.toughness = 4
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToWoundPhase(warrior_1, warrior_2, attacks, 1, false, true)
  main_wound_ratio = result.main_wound_ratio
  console.log("S3 vs T4 (no crits), average number of wounds:", main_wound_ratio)
  console.assert(main_wound_ratio > 0.325 && main_wound_ratio < 0.34, "S3 vs T4, average number of wounds is not 0.333")
  
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_2.toughness = 5
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToWoundPhase(warrior_1, warrior_2, attacks, 1, false, true)
  main_wound_ratio = result.main_wound_ratio
  console.log("S3 vs T5 (no crits), average number of wounds:", main_wound_ratio)
  console.assert(main_wound_ratio > 0.16 && main_wound_ratio < 0.17, "S3 vs T5, average number of wounds is not 0.166")
  
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_2.toughness = 6
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToWoundPhase(warrior_1, warrior_2, attacks, 1, false, true)
  main_wound_ratio = result.main_wound_ratio
  console.log("S3 vs T6 (no crits), average number of wounds:", main_wound_ratio)
  console.assert(main_wound_ratio > 0.16 && main_wound_ratio < 0.17, "S3 vs T6, average number of wounds is not 0.166")
  
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_2.toughness = 7
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToWoundPhase(warrior_1, warrior_2, attacks, 1, false, true)
  main_wound_ratio = result.main_wound_ratio
  console.log("S3 vs T7 (no crits), average number of wounds:", main_wound_ratio)
  console.assert(main_wound_ratio == 0, "S3 vs T7, average number of wounds is not 0")
  
  // check crits
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_2.toughness = 1
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToWoundPhase(warrior_1, warrior_2, attacks, 1, false, false)
  crit_ratio = result.crit_ratio
  crit_no_armour_ratio = result.crit_no_armour_ratio
  crit_bonus_injury_ratio = result.crit_bonus_injury_ratio
  console.log("S3 vs T1 (crits), average number of crits:", crit_ratio)
  console.log("S3 vs T1 (crits), average number of crits with no armour save:", crit_no_armour_ratio)
  console.log("S3 vs T1 (crits), average number of crits with bonus injury:", crit_bonus_injury_ratio)
  console.assert(crit_ratio > 0.16 && crit_ratio < 0.17, "S3 vs T1, average number of crits is not 0.166")
  console.assert(crit_no_armour_ratio > 0.16*2/3 && crit_no_armour_ratio < 0.17*2/3, "S3 vs T1, average number of crits with no armour save is not 0.166 * 2/3")
  console.assert(crit_bonus_injury_ratio > 0.05 && crit_bonus_injury_ratio < 0.6, "S3 vs T1, average number of crits with bonus injury is not 0.166 * 1/3")
  
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_2.toughness = 2
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToWoundPhase(warrior_1, warrior_2, attacks, 1, false, false)
  crit_ratio = result.crit_ratio
  crit_no_armour_ratio = result.crit_no_armour_ratio
  crit_bonus_injury_ratio = result.crit_bonus_injury_ratio
  console.log("S3 vs T2 (crits), average number of crits:", crit_ratio)
  console.log("S3 vs T2 (crits), average number of crits with no armour save:", crit_no_armour_ratio)
  console.log("S3 vs T2 (crits), average number of crits with bonus injury:", crit_bonus_injury_ratio)
  console.assert(crit_ratio > 0.16 && crit_ratio < 0.17, "S3 vs T2, average number of crits is not 0.166")
  console.assert(crit_no_armour_ratio > 0.16*2/3 && crit_no_armour_ratio < 0.17*2/3, "S3 vs T2, average number of crits with no armour save is not 0.166 * 2/3")
  console.assert(crit_bonus_injury_ratio > 0.16*1/3 && crit_bonus_injury_ratio < 0.17*1/3, "S3 vs T2, average number of crits with bonus injury is not 0.166 * 1/3")
  
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_2.toughness = 3
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToWoundPhase(warrior_1, warrior_2, attacks, 1, false, false)
  crit_ratio = result.crit_ratio
  crit_no_armour_ratio = result.crit_no_armour_ratio
  crit_bonus_injury_ratio = result.crit_bonus_injury_ratio
  console.log("S3 vs T3 (crits), average number of crits:", crit_ratio)
  console.log("S3 vs T3 (crits), average number of crits with no armour save:", crit_no_armour_ratio)
  console.log("S3 vs T3 (crits), average number of crits with bonus injury:", crit_bonus_injury_ratio)
  console.assert(crit_ratio > 0.16 && crit_ratio < 0.17, "S3 vs T3, average number of crits is not 0.166")
  console.assert(crit_no_armour_ratio > 0.16*2/3 && crit_no_armour_ratio < 0.17*2/3, "S3 vs T3, average number of crits with no armour save is not 0.166 * 2/3")
  console.assert(crit_bonus_injury_ratio > 0.16*1/3 && crit_bonus_injury_ratio < 0.17*1/3, "S3 vs T3, average number of crits with bonus injury is not 0.166 * 1/3")
  
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_2.toughness = 4
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToWoundPhase(warrior_1, warrior_2, attacks, 1, false, false)
  crit_ratio = result.crit_ratio
  crit_no_armour_ratio = result.crit_no_armour_ratio
  crit_bonus_injury_ratio = result.crit_bonus_injury_ratio
  console.log("S3 vs T4 (crits), average number of crits:", crit_ratio)
  console.log("S3 vs T4 (crits), average number of crits with no armour save:", crit_no_armour_ratio)
  console.log("S3 vs T4 (crits), average number of crits with bonus injury:", crit_bonus_injury_ratio)
  console.assert(crit_ratio > 0.16 && crit_ratio < 0.17, "S3 vs T4, average number of crits is not 0.166")
  console.assert(crit_no_armour_ratio > 0.16*2/3 && crit_no_armour_ratio < 0.17*2/3, "S3 vs T4, average number of crits with no armour save is not 0.166 * 2/3")
  console.assert(crit_bonus_injury_ratio > 0.16*1/3 && crit_bonus_injury_ratio < 0.17*1/3, "S3 vs T4, average number of crits with bonus injury is not 0.166 * 1/3")
  
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_2.toughness = 5
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToWoundPhase(warrior_1, warrior_2, attacks, 1, false, false)
  crit_ratio = result.crit_ratio
  crit_no_armour_ratio = result.crit_no_armour_ratio
  crit_bonus_injury_ratio = result.crit_bonus_injury_ratio
  console.log("S3 vs T5 (crits), average number of crits:", crit_ratio)
  console.log("S3 vs T5 (crits), average number of crits with no armour save:", crit_no_armour_ratio)
  console.log("S3 vs T5 (crits), average number of crits with bonus injury:", crit_bonus_injury_ratio)
  console.assert(crit_ratio == 0, "S3 vs T5, average number of crits is not 0")
  console.assert(crit_no_armour_ratio == 0, "S3 vs T5, average number of crits with no armour save is not 0")
  console.assert(crit_bonus_injury_ratio == 0, "S3 vs T5, average number of crits with bonus injury is not 0")
  
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_2.toughness = 6
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToWoundPhase(warrior_1, warrior_2, attacks, 1, false, false)
  crit_ratio = result.crit_ratio
  crit_no_armour_ratio = result.crit_no_armour_ratio
  crit_bonus_injury_ratio = result.crit_bonus_injury_ratio
  console.log("S3 vs T6 (crits), average number of crits:", crit_ratio)
  console.log("S3 vs T6 (crits), average number of crits with no armour save:", crit_no_armour_ratio)
  console.log("S3 vs T6 (crits), average number of crits with bonus injury:", crit_bonus_injury_ratio)
  console.assert(crit_ratio == 0, "S3 vs T6, average number of crits is not 0")
  console.assert(crit_no_armour_ratio == 0, "S3 vs T6, average number of crits with no armour save is not 0")
  console.assert(crit_bonus_injury_ratio == 0, "S3 vs T6, average number of crits with bonus injury is not 0")

  // Test holy vs possessed/undead
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_2.toughness = 3
  warrior_2.tags = ['undead']
  warrior_1.weapons_mainhand = [weapons['sigmarite hammer']]
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToWoundPhase(warrior_1, warrior_2, attacks, 1, false, true)
  main_wound_ratio = result.main_wound_ratio
  console.log("S3 vs T3 (no crits), sigmarite hammer vs undead/possessed, average number of wounds:", main_wound_ratio)
  console.assert(main_wound_ratio > 0.825 && main_wound_ratio < 0.84, "S3 vs T3, holy vs undead, average number of wounds is not 0.8333")
  warrior_1.weapons_mainhand = [weapons['handweapon']]
  
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_2.toughness = 3
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testInjuryPhase(warrior_1, warrior_2, attacks, 0, 1)
  knocked_ratio = result.knocked_ratio
  stunned_ratio = result.stunned_ratio
  ooa_ratio = result.ooa_ratio
  console.log("1 unsaved wound, ratio of knocked down injuries:", knocked_ratio)
  console.log("1 unsaved wound, ratio of stunned injuries:", stunned_ratio)
  console.log("1 unsaved wound, ratio of out of action injuries:", ooa_ratio)
  console.assert(knocked_ratio > 0.325 && knocked_ratio < 0.34, "1 unsaved wound, ratio of knocked down injuries is not 0.333")
  console.assert(stunned_ratio > 0.325 && stunned_ratio < 0.34, "1 unsaved wound, ratio of stunned injuries is not 0.333")
  console.assert(ooa_ratio > 0.325 && ooa_ratio < 0.34, "1 unsaved wound, ratio of out of action injuries is not 0.333")
  
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testInjuryPhase(warrior_1, warrior_2, attacks, 2, 1)
  knocked_ratio = result.knocked_ratio
  stunned_ratio = result.stunned_ratio
  ooa_ratio = result.ooa_ratio
  console.log("1 unsaved wound +2 to injury roll, ratio of knocked down injuries:", knocked_ratio)
  console.log("1 unsaved wound +2 to injury roll, ratio of stunned injuries:", stunned_ratio)
  console.log("1 unsaved wound +2 to injury roll, ratio of out of action injuries:", ooa_ratio)
  console.assert(knocked_ratio == 0, "1 unsaved wound, ratio of knocked down injuries is 0")
  console.assert(stunned_ratio > 0.325 && stunned_ratio < 0.34, "1 unsaved wound, ratio of stunned injuries is not 0.333")
  console.assert(ooa_ratio > 0.66 && ooa_ratio < 0.675, "1 unsaved wound, ratio of out of action injuries is not 0.666")
  
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_2.old_status = "knocked down"
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testInjuryPhase(warrior_1, warrior_2, attacks, 0, 1)
  knocked_ratio = result.knocked_ratio
  stunned_ratio = result.stunned_ratio
  ooa_ratio = result.ooa_ratio
  console.log("1 unsaved wound vs knocked down warrior, ratio of knocked down injuries:", knocked_ratio)
  console.log("1 unsaved wound vs knocked down warrior, ratio of stunned injuries:", stunned_ratio)
  console.log("1 unsaved wound vs knocked down warrior, ratio of out of action injuries:", ooa_ratio)
  console.assert(knocked_ratio == 0, "1 unsaved wound vs knocked down warrior, ratio of knocked down injuries is 0")
  console.assert(stunned_ratio == 0, "1 unsaved wound vs knocked down warrior, ratio of stunned injuries is 0")
  console.assert(ooa_ratio == 1, "1 unsaved wound vs knocked down warrior, ratio of out of action injuries is 1")
  
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_2.old_status = "stunned"
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testInjuryPhase(warrior_1, warrior_2, attacks, 0, 1)
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
  
  status = testDoRecovery(warrior_1, "knocked down", true)
  console.log("Knocked down warrior, recovery status:", warrior_1.status)
  console.assert(warrior_1.status === "standing", "Knocked down warrior, recovery status on own turn is not standing")
  console.assert(warrior_1.old_status === "standing", "Knocked down warrior, recovery old_status is not standing")
  console.assert(warrior_1.stood_up === true, "Knocked down warrior, stood_up is not true")
  
  //warrior_1.stood_up = false
  status = testDoRecovery(warrior_1, "stunned", true)
  console.log("Stunned warrior, recovery status:", warrior_1.status)
  console.assert(warrior_1.status === "knocked down", "Stunned warrior, recovery status on own turn is not knocked down")
  console.assert(warrior_1.old_status === "knocked down", "Stunned warrior, recovery old_status is not knocked down")
  console.assert(warrior_1.stood_up === false, "Stunned warrior, stood_up is not false")
  
  status = testDoRecovery(warrior_1, "out of action", true)
  console.log("Out of action warrior, recovery status:", warrior_1.status)
  console.assert(warrior_1.status === "out of action", "Out of action warrior, recovery status on own turn is not out of action")
  console.assert(warrior_1.old_status === "out of action", "Out of action warrior, recovery old_status is not out of action")
  console.assert(warrior_1.stood_up === false, "Out of action warrior, stood_up is not false")

   status = testDoRecovery(warrior_1, "knocked down", false)
  console.log("Knocked down warrior, recovery status:", warrior_1.status)
  console.assert(warrior_1.status === "knocked down", "Knocked down warrior, recovery status on enemies turn is not knocked down")
  console.assert(warrior_1.old_status === "knocked down", "Knocked down warrior, recovery old_status on enemies turn is not knocked down")
  console.assert(warrior_1.stood_up === false, "Knocked down warrior, stood_up is not true")
  
  //warrior_1.stood_up = false
  status = testDoRecovery(warrior_1, "stunned", false)
  console.log("Stunned warrior, recovery status:", warrior_1.status)
  console.assert(warrior_1.status === "stunned", "Stunned warrior, recovery status on enemies turn is not stunned")
  console.assert(warrior_1.old_status === "stunned", "Stunned warrior, recovery old_status on enemies turn is not stunned")
  console.assert(warrior_1.stood_up === false, "Stunned warrior, stood_up is not false")
  
  status = testDoRecovery(warrior_1, "out of action", false)
  console.log("Out of action warrior, recovery status:", warrior_1.status)
  console.assert(warrior_1.status === "out of action", "Out of action warrior, recovery status on enemies turn is not out of action")
  console.assert(warrior_1.old_status === "out of action", "Out of action warrior, recovery old_status on enemies turn is not out of action")
  console.assert(warrior_1.stood_up === false, "Out of action warrior, stood_up is not false")
  
  // Test parry
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_1.status = "standing"
  warrior_1.old_status = "standing"
  warrior_2.old_status = "standing"
  warrior_2.status = "standing"
  warrior_1.weapons_mainhand = [weapons['handweapon']]
  warrior_2.weapons_mainhand = [weapons['sword']]
  warrior_1.ws = 3
  warrior_2.ws = 2
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToHitPhase(warrior_1, warrior_2, attacks)
  main_hit_ratio = result.main_hit_ratio
  console.log("WS3 vs WS2, average number of hits with parry:", main_hit_ratio)
  console.assert(main_hit_ratio > 0.49 && main_hit_ratio < 0.51, "WS3 vs WS2, average number of hits with parry is not 0.5")
  
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_2.ws = 3
  warrior_2.weapons_mainhand = [weapons['sword']]
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToHitPhase(warrior_1, warrior_2, attacks)
  main_hit_ratio = result.main_hit_ratio
  console.log("WS3 vs WS3, average number of hits with parry:", main_hit_ratio)
  console.assert(main_hit_ratio > 0.41 && main_hit_ratio < 0.42, "WS3 vs WS2, average number of hits with parry is not 0.4167")
  
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_1.ws = 2
  warrior_2.ws = 5
  warrior_2.weapons_mainhand = [weapons['sword']]
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToHitPhase(warrior_1, warrior_2, attacks)
  main_hit_ratio = result.main_hit_ratio
  console.log("WS2 vs WS5, average number of hits with parry:", main_hit_ratio)
  console.assert(main_hit_ratio > 0.30 && main_hit_ratio < 0.31, "WS2 vs WS5, average number of hits with parry is not 0.3056")
  
  // test club's concussion rule
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_1.weapons_mainhand = [weapons['club']]
  warrior_2.weapons_mainhand = [weapons['handweapon']]
  warrior_1.ws = 3
  warrior_2.ws = 3
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testInjuryPhase(warrior_1, warrior_2, attacks, 0, 1)
  knocked_ratio = result.knocked_ratio
  stunned_ratio = result.stunned_ratio
  ooa_ratio = result.ooa_ratio
  console.log("1 unsaved wound with club, ratio of knocked down injuries:", knocked_ratio)
  console.log("1 unsaved wound with club, ratio of stunned injuries:", stunned_ratio)
  console.log("1 unsaved wound with club, ratio of out of action injuries:", ooa_ratio)
  console.assert(knocked_ratio > 0.16 && knocked_ratio < 0.17, "1 unsaved wound with club, ratio of knocked down injuries is not 0.1666")
  console.assert(stunned_ratio > 0.495 && stunned_ratio < 0.505, "1 unsaved wound with club, ratio of stunned injuries is not 0.5")
  console.assert(ooa_ratio > 0.325 && ooa_ratio < 0.34, "1 unsaved wound with club, ratio of out of action injuries is not 0.333")
  
  // test helmet's stun save
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_1.weapons_mainhand = [weapons['handweapon']]
  warrior_2.armour = [armour['helmet']]
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testInjuryPhase(warrior_1, warrior_2, attacks, 0, 1)
  knocked_ratio = result.knocked_ratio
  stunned_ratio = result.stunned_ratio
  ooa_ratio = result.ooa_ratio
  console.log("1 unsaved wound, ratio of knocked down injuries:", knocked_ratio)
  console.log("1 unsaved wound, ratio of stunned injuries:", stunned_ratio)
  console.log("1 unsaved wound, ratio of out of action injuries:", ooa_ratio)
  console.assert(knocked_ratio > 0.495 && knocked_ratio < 0.505, "1 unsaved wound, ratio of knocked down injuries is not 0.5")
  console.assert(stunned_ratio > 0.16 && stunned_ratio < 0.17, "1 unsaved wound, ratio of stunned injuries is not 0.16666")
  console.assert(ooa_ratio > 0.325 && ooa_ratio < 0.34, "1 unsaved wound, ratio of out of action injuries is not 0.333")

  //test armour save
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_1.strength = 3
  warrior_2.toughness = 3
  warrior_2.armour_save = 6
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToWoundPhase(warrior_1, warrior_2, attacks, 1, false, true)
  main_wound_ratio = result.main_wound_ratio
  console.log("S3 vs T3 6+ AS (no crits), average number of wounds:", main_wound_ratio)
  console.assert(main_wound_ratio > 0.41 && main_wound_ratio < 0.425, "S3 vs T3, 6+ AS, average number of wounds is not 0.41666")

  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_2.armour_save = 5
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToWoundPhase(warrior_1, warrior_2, attacks, 1, false, true)
  main_wound_ratio = result.main_wound_ratio
  console.log("S3 vs T3 5+ AS (no crits), average number of wounds:", main_wound_ratio)
  console.assert(main_wound_ratio > 0.325 && main_wound_ratio < 0.34, "S3 vs T3, 5+ AS, average number of wounds is not 0.3333")

  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_2.armour_save = 4
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToWoundPhase(warrior_1, warrior_2, attacks, 1, false, true)
  main_wound_ratio = result.main_wound_ratio
  console.log("S3 vs T3 4+ AS (no crits), average number of wounds:", main_wound_ratio)
  console.assert(main_wound_ratio > 0.24 && main_wound_ratio < 0.26, "S3 vs T3, 4+ AS, average number of wounds is not 0.25")

  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_2.armour_save = 3
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToWoundPhase(warrior_1, warrior_2, attacks, 1, false, true)
  main_wound_ratio = result.main_wound_ratio
  console.log("S3 vs T3 3+ AS (no crits), average number of wounds:", main_wound_ratio)
  console.assert(main_wound_ratio > 0.16 && main_wound_ratio < 0.175, "S3 vs T3, 3+ AS, average number of wounds is not 0.1666")

  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_2.armour_save = 2
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToWoundPhase(warrior_1, warrior_2, attacks, 1, false, true)
  main_wound_ratio = result.main_wound_ratio
  console.log("S3 vs T3 2+ AS (no crits), average number of wounds:", main_wound_ratio)
  console.assert(main_wound_ratio > 0.075 && main_wound_ratio < 0.09, "S3 vs T3, 2+ AS, average number of wounds is not 0.08333")

  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_2.armour_save = 1
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToWoundPhase(warrior_1, warrior_2, attacks, 1, false, true)
  main_wound_ratio = result.main_wound_ratio
  console.log("S3 vs T3 1+ AS (no crits), average number of wounds:", main_wound_ratio)
  console.assert(main_wound_ratio === 0, "S3 vs T3, 1+ AS, average number of wounds is not 0")
  
  // Test weapon initiative order
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_1.weapons_mainhand = [weapons['handweapon']]
  warrior_2.weapons_mainhand = [weapons['handweapon']]
  attacks = setUpAttacks(warrior_1, warrior_2, 1).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testOrderAttacksByInitiative(warrior_1, warrior_2, 2)
  console.log("I3 warrior fights I3 warrior, should strike first 50% of time", result.first_warrior['warrior_1'] || 0)
  console.assert(result.first_warrior['warrior_1'] > 0.495 && result.first_warrior['warrior_1'] < 0.505, "warrior_1 does not strike first 50% of time")
  
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_1.weapons_mainhand = [weapons['handweapon']]
  warrior_2.weapons_mainhand = [weapons['handweapon']]
  warrior_2.charger = true
  attacks = setUpAttacks(warrior_1, warrior_2, 1).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testOrderAttacksByInitiative(warrior_1, warrior_2, 1)
  console.log("I3 warrior gets charged by I3 warrior, should strike first 0% of time", result.first_warrior['warrior_1'] || 0)
  console.assert(result.first_warrior['warrior_1'] || 0 == 0, "warrior_1 does not strike first 0% of time")
  
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_1.weapons_mainhand = [weapons['spear']]
  warrior_2.weapons_mainhand = [weapons['handweapon']]
  warrior_2.charger = true
  attacks = setUpAttacks(warrior_1, warrior_2, 1).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testOrderAttacksByInitiative(warrior_1, warrior_2, 1)
  console.log("I3 Spear gets charged by I3 warrior, should strike first 50% of time", result.first_weapon['spear'])
  console.assert(result.first_weapon['spear'] > 0.495 && result.first_weapon['spear'] < 0.505, "spear does not strike first 50% of time")

  attacks = setUpAttacks(warrior_1, warrior_2, 2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 2)
  result = testOrderAttacksByInitiative(warrior_1, warrior_2, 1)
  console.log("I3 Spear fights I3 warrior in round 2, should strike first 50% of time", result.first_weapon['spear'])
  console.assert(result.first_weapon['spear'] > 0.495 && result.first_weapon['spear'] < 0.505, "spear does not strike first 50% of time")
  
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_1.weapons_mainhand = [weapons['spear']]
  warrior_2.weapons_mainhand = [weapons['handweapon']]
  warrior_2.charger = true
  warrior_1.initiative = 4
  attacks = setUpAttacks(warrior_1, warrior_2, 1).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testOrderAttacksByInitiative(warrior_1, warrior_2, 1)
  console.log("I4 Spear gets charged by I3 warrior, should strike first 100% of time", result.first_weapon['spear'])
  console.assert(result.first_weapon['spear'] == 1, "spear does not strike first 100% of time")
  
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_1.weapons_mainhand = [weapons['spear']]
  warrior_2.weapons_mainhand = [weapons['handweapon']]
  warrior_2.charger = true
  warrior_1.initiative = 2
  attacks = setUpAttacks(warrior_1, warrior_2, 1).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testOrderAttacksByInitiative(warrior_1, warrior_2, 1)
  console.log("I2 Spear gets charged by I3 warrior, should strike first 0% of time", result.first_weapon['spear'] || 0)
  console.assert((result.first_weapon['spear'] || 0) == 0, "spear does not strike first 0% of time")

    attacks = setUpAttacks(warrior_1, warrior_2, 2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 2)
  result = testOrderAttacksByInitiative(warrior_1, warrior_2, 2)
  console.log("I2 Spear fights I3 warrior in round 2, should strike first 0% of time", result.first_weapon['spear'] || 0)
  console.assert((result.first_weapon['spear'] || 0) == 0, "spear does not strike first 0% of time")
  
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_1.weapons_mainhand = [weapons['handweapon']]
  warrior_2.weapons_mainhand = [weapons['great weapon']]
  warrior_2.charger = true
  attacks = setUpAttacks(warrior_1, warrior_2, 1).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testOrderAttacksByInitiative(warrior_1, warrior_2, 1)
  console.log("I3 warrior gets charged by I3 warrior with great weapon, should strike first 100% of time", result.first_warrior['warrior_1'] || 0)
  console.assert((result.first_warrior['warrior_1'] || 0) == 1, "warrior_1 does not strike first 100% of time")

  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_1.weapons_mainhand = [weapons['handweapon']]
  warrior_2.weapons_mainhand = [weapons['great weapon']]
  warrior_1.stood_up = true
  attacks = setUpAttacks(warrior_1, warrior_2, 1).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testOrderAttacksByInitiative(warrior_1, warrior_2, 1)
  console.log("I3 warrior who just stood up fights a I3 warrior with great weapon, should strike last 100% of time", result.first_warrior['warrior_1'] || 0)
  console.assert((result.first_warrior['warrior_1'] || 0) == 0, "warrior_1 does not strike last 100% of time")

  // Steel whip tests
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_1.weapons_mainhand = [weapons['steel whip']]
  attacks = setUpAttacks(warrior_1, warrior_2, 1).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  console.log("Steel whip should have two attacks first turn of combat", attacks.length)
  console.assert(attacks.length == 2, "Steel whip does not have two attacks first turn of combat")
  console.log("Steel whip should have one attack with strike first in the first round of combat", attacks.filter((attack) => attack.initiative > 99).length)
  console.assert(attacks.filter((attack) => attack.initiative > 99).length == 1, "Steel whip does not have one attack with strike first in the first round of combat")
  attacks = setUpAttacks(warrior_1, warrior_2, 2).attack_slots
  console.log("Steel whip should have one attack second turn of combat", attacks.length)
  console.assert(attacks.length == 1, "Steel whip does not have one attack second turn of combat")

  // Weeping blade tests
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_1.weapons_mainhand = [weapons['weeping blades']]
  attacks = setUpAttacks(warrior_1, warrior_2, 1).attack_slots
  result = testPoisonedWeapons(warrior_1, warrior_2, attacks)
  console.log("Weeping blade should have 1/6 of attacks trigger poison", result.poisoned_ratio)
  console.assert(result.poisoned_ratio > 0.16 && result.poisoned_ratio < 0.173, "Weeping blade does not have 1/6 of attacks trigger poison")

   // Pistol tests
   warrior_1 = resetWarrior(warrior_1)
   warrior_2 = resetWarrior(warrior_2)
   warrior_1.weapons_mainhand = [weapons['handweapon'], ranged_weapons['pistol']]
   attacks = setUpAttacks(warrior_1, warrior_2, 1).attack_slots
   setUpAttacks(warrior_2, warrior_1, 1)
   console.log("A warrior armed with a pistol in the main hand should have a single pistol attack first turn of combat.", attacks.length, attacks[0].weapon.name, attacks[0].strength)
   console.assert(attacks.length == 1, "A warrior armed with a pistol does not have a single pistol attack first turn of combat")
   console.assert(attacks[0].weapon.name == 'pistol', "The single attack is not made with the pistol")
   console.assert(attacks[0].strength == 4, "The single attack is not made with the pistols strength")
   attacks = setUpAttacks(warrior_1, warrior_2, 2).attack_slots
   console.assert(attacks[0].weapon.name != 'pistol', "A warrior armed with a pistol has a pistol attack after first turn of combat")

   warrior_1 = resetWarrior(warrior_1)
   warrior_2 = resetWarrior(warrior_2)
   warrior_1.weapons_mainhand = [weapons['handweapon'], ranged_weapons['pistol']]
   warrior_1.weapons_offhand = [ranged_weapons['pistol']]
   attacks = setUpAttacks(warrior_1, warrior_2, 1).attack_slots
   setUpAttacks(warrior_2, warrior_1, 1)
   console.log("A warrior armed with a brace of pistols should have two pistol attacks first turn of combat.", attacks.length)
   console.assert(attacks.length == 2, "A warrior armed with a brace of pistols does not have two pistol attacks first turn of combat")
   console.assert(attacks[0].weapon.name == 'pistol' && attacks[1].weapon.name == 'pistol', "The attacks are not made with the pistols")
   attacks = setUpAttacks(warrior_1, warrior_2, 2).attack_slots
   console.assert(attacks[0].weapon.name != 'pistol', "A warrior armed with pistols has a pistol attack after first turn of combat")

   warrior_1 = resetWarrior(warrior_1)
   warrior_2 = resetWarrior(warrior_2)
   warrior_1.weapons_mainhand = [weapons['handweapon'], ranged_weapons['warplock pistol']]
   attacks = setUpAttacks(warrior_1, warrior_2, 1).attack_slots
   setUpAttacks(warrior_2, warrior_1, 1)
   console.log("A warrior armed with a warplock pistols first round attack should be strength 5. ", attacks[0].weapon.name, attacks[0].strength)
   console.assert(attacks[0].strength == 5, "The single attack is not made with the pistols strength")
   attacks = setUpAttacks(warrior_1, warrior_2, 2).attack_slots
   console.assert(attacks[0].weapon.name != 'warplock pistol', "A warrior armed with a warplock pistol has a pistol attack after first turn of combat")

  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_1.weapons_mainhand = [weapons['handweapon'], ranged_weapons['duelling pistol']]
  attacks = setUpAttacks(warrior_1, warrior_2, 1).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToHitPhase(warrior_1, warrior_2, attacks)
  main_hit_ratio = result.main_hit_ratio
  console.log("WS3 with duelling pistol vs WS3, average number of hits:", main_hit_ratio)
  console.assert(main_hit_ratio > 0.66 && main_hit_ratio < 0.67, "WS3 with duelling pistol vs WS3, average number of hits is not 0.666")
  
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_1.weapons_mainhand = [weapons['handweapon'], ranged_weapons['crossbow pistol']]
  attacks = setUpAttacks(warrior_1, warrior_2, 1).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  console.log("A warrior armed with handweapon + crossbow pistol should have two attacks first turn of combat", attacks.length)
  console.assert(attacks.length == 2, "A warrior armed with handweapon + crossbow pistol does not have two attacks first turn of combat")
  console.log("Crossbow pistol should have one attack with strike firstest in the first round of combat", attacks.filter((attack) => attack.initiative > 99).length)
  console.assert(attacks.filter((attack) => attack.initiative > 99).length == 1, "Crossbow pistol does not have one attack with strike firstest in the first round of combat")
  attacks = setUpAttacks(warrior_1, warrior_2, 2).attack_slots
  console.log("A warrior with hand weapon and crossbow pistol should have a single attack second turn of combat", attacks)
  console.assert(attacks.length == 1, "warrior with hand weapon and crossbow pistol does not have a single attack second turn of combat")
  console.assert(attacks[0].weapon.name != 'crossbow pistol', "A warrior armed with a crossbow pistol should not have a pistol attack after first turn of combat")
  //Skills
  // test Strike to injure's injury bonus
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_1.skills = ['strike to injure']
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testInjuryPhase(warrior_1, warrior_2, attacks, 0, 1)
  knocked_ratio = result.knocked_ratio
  stunned_ratio = result.stunned_ratio
  ooa_ratio = result.ooa_ratio
  console.log("1 unsaved wound with strike to injure, ratio of knocked down injuries:", knocked_ratio)
  console.log("1 unsaved wound with strike to injure, ratio of stunned injuries:", stunned_ratio)
  console.log("1 unsaved wound with strike to injure, ratio of out of action injuries:", ooa_ratio)
  console.assert(knocked_ratio > 0.16 && knocked_ratio < 0.17, "1 unsaved wound with strike to injure, ratio of knocked down injuries is not 0.1666")
  console.assert(stunned_ratio > 0.325 && stunned_ratio < 0.34, "1 unsaved wound with strike to injure, ratio of stunned injuries is not 0.33")
  console.assert(ooa_ratio > 0.495 && ooa_ratio < 0.505, "1 unsaved wound with strike to injure, ratio of out of action injuries is not 0.5")
  
  // test web of steel's crit bonus
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_1.skills = ['web of steel']
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToWoundPhase(warrior_1, warrior_2, attacks, 1, false, false)
  crit_ratio = result.crit_ratio
  crit_no_armour_ratio = result.crit_no_armour_ratio
  crit_bonus_injury_ratio = result.crit_bonus_injury_ratio
  console.log("S3 vs T1 (crits), average number of crits, with web of steel:", crit_ratio)
  console.log("S3 vs T1 (crits), average number of crits with no armour save, with web of steel:", crit_no_armour_ratio)
  console.log("S3 vs T1 (crits), average number of crits with bonus injury, with web of steel:", crit_bonus_injury_ratio)
  console.assert(crit_ratio > 0.16 && crit_ratio < 0.17, "S3 vs T1, average number of crits is not 0.166")
  console.assert(crit_no_armour_ratio > 0.16*5/6 && crit_no_armour_ratio < 0.17*5/6, "S3 vs T1, average number of crits with no armour save is not 0.166 * 5/6")
  console.assert(crit_bonus_injury_ratio > 0.075 && crit_bonus_injury_ratio < 0.85, "S3 vs T1, average number of crits with bonus injury is not 0.166 * 3/6")
  
  //test step aside
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_2.skills = ['step aside']
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToWoundPhase(warrior_1, warrior_2, attacks, 1, false, true)
  main_wound_ratio = result.main_wound_ratio
  console.log("S3 vs T3, average number of wounds with step aside:", main_wound_ratio)
  console.assert(main_wound_ratio > 0.3275 && main_wound_ratio < 0.34, "S3 vs T3, step aside, average number of wounds is not 0.333")
  //test mighty blow
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_1.skills = ['mighty blow']
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToWoundPhase(warrior_1, warrior_2, attacks, 1, false, true)
  main_wound_ratio = result.main_wound_ratio
  console.log("S3 + mighty blow vs T3, average number of wounds:", main_wound_ratio)
  console.assert(main_wound_ratio > 0.65 && main_wound_ratio < 0.675, "S3 + mighty blow vs T3, average number of wounds is not 0.666")
   
  //test resilient
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_2.skills = ['resilient']
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testToWoundPhase(warrior_1, warrior_2, attacks, 1, false, true)
  main_wound_ratio = result.main_wound_ratio
  console.log("S3 vs T3 + resilient, average number of wounds:", main_wound_ratio)
  console.assert(main_wound_ratio > 0.3275 && main_wound_ratio < 0.34, "S3 + resilient vs T3, average number of wounds is not 0.333")
  
  // Strongman
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_1.weapons_mainhand = [weapons['handweapon']]
  warrior_2.weapons_mainhand = [weapons['great weapon']]
  warrior_2.charger = true
  warrior_2.skills = ['strongman']
  attacks = setUpAttacks(warrior_1, warrior_2, 1).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testOrderAttacksByInitiative(warrior_1, warrior_2, 1)
  console.log("I3 warrior gets charged by I3 warrior with great weapon and strongman, should strike first 0% of time", result.first_warrior['warrior_1'] || 0)
  console.assert((result.first_warrior['warrior_1'] || 0) == 0, "warrior_1 does not strike first 0% of time")

  // Lightning reflexes
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_1.skills = ['lightning reflexes']
  warrior_2.charger = true
  attacks = setUpAttacks(warrior_1, warrior_2, 1).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testOrderAttacksByInitiative(warrior_1, warrior_2, 1)
  console.log("I3 lightning reflexes gets charged by I3 warrior, should strike first 50% of time", result.first_warrior['warrior_1'])
  console.assert(result.first_warrior['warrior_1']> 0.495 && result.first_warrior['warrior_1'] < 0.505, "lightning reflexes does not strike first 50% of time")
  
  attacks = setUpAttacks(warrior_1, warrior_2, 2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 2)
  result = testOrderAttacksByInitiative(warrior_1, warrior_2, 1)
  console.log("I3 lightning reflexes fights I3 warrior in round 2, should strike first 50% of time", result.first_warrior['warrior_1'])
  console.assert(result.first_warrior['warrior_1'] > 0.495 && result.first_warrior['warrior_1'] < 0.505, "lightning reflexes does not strike first 50% of time")
  
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_1.skills = ['lightning reflexes']
  warrior_2.weapons_mainhand = [weapons['handweapon']]
  warrior_2.charger = true
  warrior_1.initiative = 4
  attacks = setUpAttacks(warrior_1, warrior_2, 1).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testOrderAttacksByInitiative(warrior_1, warrior_2, 1)
  console.log("I4 lightning reflexes gets charged by I3 warrior, should strike first 100% of time", result.first_warrior['warrior_1'])
  console.assert(result.first_warrior['warrior_1'] == 1, "lightning reflexes does not strike first 100% of time")
  
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_1.skills = ['lightning reflexes']
  warrior_2.weapons_mainhand = [weapons['handweapon']]
  warrior_2.charger = true
  warrior_1.initiative = 2
  attacks = setUpAttacks(warrior_1, warrior_2, 1).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testOrderAttacksByInitiative(warrior_1, warrior_2, 1)
  console.log("I2 lightning reflexes gets charged by I3 warrior, should strike first 0% of time", result.first_warrior['warrior_1'] || 0)
  console.assert((result.first_warrior['warrior_1'] || 0) == 0, "lightning reflexes warrior with I2 does not strike first 0% of time")

  // Jump up
  warrior_1 = resetWarrior(warrior_1)
  warrior_2 = resetWarrior(warrior_2)
  warrior_2.skills = ['jump up']
  attacks = setUpAttacks(warrior_1, warrior_2).attack_slots
  setUpAttacks(warrior_2, warrior_1, 1)
  result = testInjuryPhase(warrior_1, warrior_2, attacks, 0, 1)
  knocked_ratio = result.knocked_ratio
  stunned_ratio = result.stunned_ratio
  ooa_ratio = result.ooa_ratio
  console.log("1 unsaved wound with jump up, ratio of knocked down injuries:", knocked_ratio)
  console.log("1 unsaved wound with jump up, ratio of stunned injuries:", stunned_ratio)
  console.log("1 unsaved wound with jump up, ratio of out of action injuries:", ooa_ratio)
  console.assert(knocked_ratio == 0, "1 unsaved wound with jump up, ratio of knocked down injuries is not 0")
  console.assert(stunned_ratio > 0.325 && stunned_ratio < 0.34, "1 unsaved wound with jump up, ratio of stunned injuries is not 0.333")
  console.assert(ooa_ratio > 0.325 && ooa_ratio < 0.34, "1 unsaved wound with jump up, ratio of out of action injuries is not 0.333")
}

const testToHitPhase = (warrior_1_base, warrior_2_base, attack_group_base, number_of_simulations=100000) => {
  let total_hits = 0;
  for (let i = 0; i < number_of_simulations; i++) {
    const warrior1 = JSON.parse(JSON.stringify(warrior_1_base))
    const warrior2 = JSON.parse(JSON.stringify(warrior_2_base))
    let attack_group = JSON.parse(JSON.stringify(attack_group_base))
    attack_group = toHitPhase(warrior1, warrior2, attack_group);
    const hits = attack_group.filter((attack) => attack.hit).length
    total_hits += hits
  }
  return {
    main_hit_ratio: total_hits / number_of_simulations
  }
}

const testToWoundPhase = (warrior_1_base, warrior_2_base, attack_group_base, hits, first_round, no_crits, number_of_simulations=100000) => {
  let total_wounds = 0;
  let total_wounds_offhand = 0;
  let total_crits = 0;
  let total_crit_no_armour = 0;
  let total_crit_bonus_injury = 0;
  for (let i = 0; i < number_of_simulations; i++) {
    const warrior1 = JSON.parse(JSON.stringify(warrior_1_base))
    const warrior2 = JSON.parse(JSON.stringify(warrior_2_base))
    let attack_group = JSON.parse(JSON.stringify(attack_group_base))
    attack_group = attack_group.map((attack) => ({ ...attack, hit: true }))
    attack_group = toWoundPhase(warrior1, warrior2, attack_group, first_round, no_crits);
    total_wounds += attack_group.filter((attack) => attack.unsaved_wounds).length
    total_crits += attack_group.filter((attack) => attack.crit).length
    total_crit_no_armour += attack_group.filter((attack) => attack.no_armour_save).length
    total_crit_bonus_injury += attack_group.filter((attack) => attack.injury_bonus).length
  }
  return {
    main_wound_ratio: total_wounds / number_of_simulations,
    crit_ratio: total_crits / number_of_simulations,
    crit_no_armour_ratio: total_crit_no_armour / number_of_simulations,
    crit_bonus_injury_ratio: total_crit_bonus_injury / number_of_simulations
  }
}

const testInjuryPhase = (warrior_1_base, warrior_2_base, attack_group_base, injury_bonus, unsaved_wounds, number_of_simulations=100000) => {
  let knocked = 0
  let stunned = 0
  let ooa = 0

  for (let i = 0; i < number_of_simulations; i++) {
    const warrior1 = JSON.parse(JSON.stringify(warrior_1_base))
    const warrior2 = JSON.parse(JSON.stringify(warrior_2_base))
    let attack_group = JSON.parse(JSON.stringify(attack_group_base))
    attack_group = attack_group.map((attack) => ({ ...attack, injury_bonus: injury_bonus, unsaved_wounds: unsaved_wounds }))
    attack_group = injuryPhase(warrior1, warrior2, attack_group);
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
const testDoRecovery = (warrior_base, status, your_turn) => {
  warrior_base.status = status
  doRecovery(warrior_base, your_turn)
  return {status: warrior_base.status, old_status: warrior_base.old_status}
}

const testOrderAttacksByInitiative = (warrior_1_base, warrior_2_base, round_number, number_of_simulations=100000) => {
  const first_weapon = {}
  const last_weapon = {}
  const first_warrior = {}
  const last_warrior = {}
  for (let i = 0; i < number_of_simulations; i++) {
    let warrior1 = JSON.parse(JSON.stringify(warrior_1_base))
    let warrior2 = JSON.parse(JSON.stringify(warrior_2_base))
    warrior1 = setUpAttacks(warrior1, warrior2, round_number)
    warrior2 = setUpAttacks(warrior2, warrior1, round_number)
    
    const grouped_attacks = orderAttacksByInitiative(warrior1, warrior2, round_number)
    const first_attack = grouped_attacks[0][0]
    const last_attack = grouped_attacks[grouped_attacks.length-1][0]
    first_weapon[first_attack.weapon.name] = (first_weapon[first_attack.weapon.name] || 0) + 1
    last_weapon[last_attack.weapon.name] = (last_weapon[last_attack.weapon.name] || 0) + 1
    first_warrior[first_attack.source] = (first_warrior[first_attack.source] || 0) + 1
    last_warrior[last_attack.source] = (last_warrior[last_attack.source] || 0) + 1
  }

  for (const weapon in first_weapon) {
    first_weapon[weapon] = first_weapon[weapon] / number_of_simulations
  }
  for (const weapon in last_weapon) {
    last_weapon[weapon] = last_weapon[weapon] / number_of_simulations
  }
  for (const warrior in first_warrior) {
    first_warrior[warrior] = first_warrior[warrior] / number_of_simulations
  }
  for (const warrior in last_warrior) {
    last_warrior[warrior] = last_warrior[warrior] / number_of_simulations
  }

  return {first_weapon, last_weapon, first_warrior, last_warrior}
}

const resetWarrior = (warrior) => {
  warrior = {
    name: warrior.name,
    ws: 3,
    strength: 3,
    toughness: 3,
    attacks: 1,
    wounds: 1,
    initiative: 3,
    status: "standing",
    old_status: "standing",
    weapons_mainhand: [weapons['handweapon']],
    weapons_offhand: [],
    weapons: [],
    armour: [],
    armour_save: 7,
    charger: false,
    stood_up: false,
    skills: [],
  }
  return warrior
}

const testPoisonedWeapons = (warrior_1_base, warrior_2_base, attack_group_base, number_of_simulations=100000) => {
  let total_poisoned_hits = 0;
  for (let i = 0; i < number_of_simulations; i++) {
    const warrior1 = JSON.parse(JSON.stringify(warrior_1_base))
    const warrior2 = JSON.parse(JSON.stringify(warrior_2_base))
    let attack_group = JSON.parse(JSON.stringify(attack_group_base))
    attack_group = toHitPhase(warrior1, warrior2, attack_group);
    total_poisoned_hits += attack_group.filter((attack) => attack.poison_proc).length
  }
  return {poisoned_ratio: total_poisoned_hits / number_of_simulations}
}