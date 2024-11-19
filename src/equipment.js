export const weapons = {
  'handweapon': {
      strength_mod: 0,
      type: "slashing",
      tags: []
  },
  'sword': {
      strength_mod: 0,
      type: "slashing",
      tags: ['parry']
  },
  'club': {
      strength_mod: 0,
      type: "bashing",
      tags: ['concussion']
  },
  'morning_star': {
      strength_mod: 1,
      type: "bashing",
      tags: ['first round bonus']
  },
  'flail': {
      strength_mod: 2,
      type: "bashing",
      tags: ['first round bonus']
  },
  'halberd': {
      strength_mod: 1,
      type: "bashing",
      tags: []
  },
  'spear': {
      strength_mod: 0,
      type: "bashing",
      tags: ['strike first']
  },
  'great weapon': {
      strength_mod: 2,
      type: "bashing",
      tags: ['strike last']
  },
}

export const armour = {
  'buckler': {
    tags: ['parry', 'reroll parry'],
    save: 0
  },
  'shield': {
    tags: [],
    save: 1
  },
  'light armour': {
    tags: [],
    save: 1
  },
  'heavy armour': {
    tags: [],
    save: 2
  },
  'helmet': {
    tags: ['avoid stun'],
    save: 0
  },
}