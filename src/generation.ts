import { MobType, MobSet } from "./mobs";
import { shuffleArray, stringHash, choice } from "./utils";
import { Exception } from "sass";
import { mobDataStore } from "./stores/mobDataStore";

const NUMBER_MULTIPLIER = {
  1: 1,
  2: 1.5,
  3: 2,
  4: 2,
  5: 2,
  6: 2,
  7: 2.5,
  8: 2.5,
  9: 2.5,
  10: 2.5,
  11: 3,
  12: 3,
  13: 3,
  14: 3,
  15: 4,
};
const DIFFICULTIES = {
  easy: [25, 50, 75, 125, 250, 300, 350, 450, 550, 600, 800, 1000, 1100, 1250, 1400, 1600, 2000, 2100, 2400, 2800],
  medium: [
    50, 100, 150, 250, 500, 600, 750, 900, 1100, 1200, 1600, 2000, 2200, 2500, 2800, 3200, 3900, 4200, 4900, 5700,
  ],
  hard: [
    75, 150, 225, 375, 750, 900, 1100, 1400, 1600, 1900, 2400, 3000, 3400, 3800, 4300, 4800, 5900, 6300, 7300, 8500,
  ],
  deadly: [
    100, 200, 400, 500, 1100, 1400, 1700, 2100, 2400, 2800, 3600, 4500, 5100, 5700, 6400, 7200, 8800, 9500, 10900,
    12700,
  ],
};

enum Difficulty {
  easy = "easy",
  medium = "medium",
  hard = "hard",
  deadly = "deadly",
  beyond_deadly = "beyond deadly",
}

enum Wildness {
  peaceful = "peaceful",
  tamed = "tamed",
  untamed = "untamed",
  dangerous = "dangerous",
  inhospitable = "inhospitable",
  alien = "alien",
}

/**
 * Calculates the experience point (XP) range for the monsters fought by a party based on a given difficulty level.
 *
 * @param {number[]} party - An array of party member levels, where each number represents a member's level.
 * @param {Difficulty} difficulty - The difficulty level for which the XP range is calculated.
 *                                   Can be one of `"easy"`, `"medium"`, `"hard"`, or `"deadly"`.
 * @returns {[number, number]} A tuple representing the lower and upper bounds of the XP range for the given difficulty.
 */
function difficultyRange(party: number[], difficulty: Difficulty): [number, number] {
  let xpLowerLimit = party.reduce((sum, x) => sum + DIFFICULTIES[difficulty][x], 0);
  let xpUpperLimit = null;
  if (difficulty == "easy") {
    xpUpperLimit = party.reduce((sum, x) => sum + DIFFICULTIES["medium"][x], 0);
  } else if (difficulty == "medium") {
    xpUpperLimit = party.reduce((sum, x) => sum + DIFFICULTIES["hard"][x], 0);
  } else if (difficulty == "hard") {
    xpUpperLimit = party.reduce((sum, x) => sum + DIFFICULTIES["deadly"][x], 0);
  } else if (difficulty == "deadly") {
    xpUpperLimit = xpLowerLimit * 1.6;
  }
  xpUpperLimit -= 1;
  return [xpLowerLimit, xpUpperLimit];
}

class Group {
  public mobs: MobType[];
  public xpTotal: number;
  constructor(mobs) {
    this.mobs = mobs;
    this.xpTotal = 0;
    this.addMob([]);
  }
  addMob(newMobs?: MobType | MobType[]) {
    if (!Array.isArray(newMobs)) {
      newMobs = [newMobs];
    }
    this.mobs.push(...newMobs);
    let mobData = mobDataStore();
    this.xpTotal =
      this.mobs.reduce((total, mob) => total + mobData.statBlock(mob.statBlockId).xp, 0) *
      (NUMBER_MULTIPLIER[this.mobs.length] || 4);
    this.mobs.sort((a, b) => mobData.statBlock(b.statBlockId).num_cr - mobData.statBlock(a.statBlockId).num_cr);
  }
  groupId(): number {
    return this.mobs.map((x) => stringHash(x.reskin ?? x.statBlockId)).reduce((partialSum, a) => partialSum + a, 0);
  }
  copyOf(): Group {
    let output = new Group([]);
    output.addMob(this.mobs);
    return output;
  }
}

class UniqueGroups {
  public groups: Group[];
  public groupIds: number[];

  constructor(groups: Group[]) {
    this.groups = [];
    this.groupIds = [];
    for (let group of groups) {
      this.addGroup(group);
    }
  }
  addGroup(newGroup: Group) {
    let newId = newGroup.groupId();
    if (!this.groupIds.includes(newId)) {
      this.groups.push(newGroup);
      this.groupIds.push(newId);
    }
  }

  contains(group: Group) {
    return group.groupId() in this.groupIds;
  }
}

function fillGroup(group: Group, possibleMobs: MobType[], minXpVal: number, maxXpVal: number, maxSize: number | null) {
  if (maxSize && group.mobs.length > maxSize) {
    throw new NoLegalGroups("Could not find a set that works.");
  }
  possibleMobs = [...possibleMobs];
  if (group.xpTotal > minXpVal) {
    possibleMobs.push(null);
  }
  possibleMobs = shuffleArray(possibleMobs);
  for (let pick of possibleMobs) {
    if (!pick) {
      return group;
    }
    let newGroup = group.copyOf();
    newGroup.addMob(pick);
    if (newGroup.xpTotal > maxXpVal) {
    } else {
      return fillGroup(newGroup, possibleMobs, minXpVal, maxXpVal, maxSize);
    }
  }
  throw new NoLegalGroups("Could not find a set that works.");
}

function uniqueGroup(
  possibleMobs: MobType[],
  party: number[],
  difficulty: Difficulty,
  maxSize?: number,
  minCr?: number,
  avoidThese?: Group[],
): Group {
  if (possibleMobs.length === 0) {
    throw new Error("No encounter can be generated if no mobs are provided. There must be at least one.");
  }
  if (!avoidThese) {
    avoidThese = [];
  }
  let existingGroups = new UniqueGroups(avoidThese);
  const [minXp, maxXp] = difficultyRange(party, difficulty);
  if (minCr) {
    possibleMobs = possibleMobs.filter((mob) => mobDataStore().statBlock(mob.statBlockId).num_cr >= minCr);
  }
  let redundantGenerations = 0;
  while (redundantGenerations < 500) {
    try {
      let newGroup = fillGroup(new Group([]), possibleMobs, minXp, maxXp, maxSize);
      if (!existingGroups.contains(newGroup)) {
        return newGroup;
      }
    } catch (error) {
      console.log(error);
      if (error instanceof NoLegalGroups) {
      } else {
        throw error;
      }
    }
    redundantGenerations += 1;
  }
  throw new NoUniqueGroup("No acceptable groups were found.");
}

class CombatEncounter {
  public group: Group;
  public enemyType: string;
  public difficulty: Difficulty;

  constructor(group, enemyType, difficulty) {
    this.group = group;
    this.enemyType = enemyType;
    this.difficulty = difficulty;
  }
}

export function singleEncounter(
  difficulty: Difficulty,
  party: number[],
  mobSets: MobSet[],
  maxMobs?: number,
  minCr?: number,
): CombatEncounter {
  let mobSet = choice(mobSets);
  console.log(mobSet);
  let group = uniqueGroup(mobSet.mobs, party, difficulty, maxMobs, minCr);
  return new CombatEncounter(group, mobSet.name, difficulty);
}

class NoLegalGroups extends Error {
  constructor(message) {
    super(message);
    this.name = "NoLegalGroups";
  }
}

class NoUniqueGroup extends Error {
  constructor(message) {
    super(message);
    this.name = "NoUniqueGroup";
  }
}
