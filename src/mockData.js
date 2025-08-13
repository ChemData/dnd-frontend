export function mockMetaMobSets() {
  return {
    "southern forests": {
      wolves: 50,
      bears: 25,
    },
    "southern swamps": {
      wolves: 5,
      bears: 50,
    },
  };
}

export function mockMobSets() {
  return {
    wolves: {
      name: "wolves",
      mobs: [{ id: "wolf" }, { id: "dire_wolf" }, { id: "mastiff", reskin: "wolf pup" }],
    },
    bears: {
      name: "bears",
      mobs: [{ id: "black_bear" }, { id: "brown_bear" }],
    },
  };
}

export function mockMobs() {
  return {
    wolf: { name: "wolf" },
    dire_wolf: { name: "dire wolf" },
    skeleton: { name: "skeleton" },
    bandit: { name: "bandit" },
    sailor: { name: "sailor" },
    goblin: { name: "goblin" },
    mastiff: { name: "mastiff" },
    black_bear: { name: "black bear" },
    brown_bear: { name: "brown bear" },
  };
}
