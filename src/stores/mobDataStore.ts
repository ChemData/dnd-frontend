import { defineStore } from "pinia";
import { z } from "zod";
import mobSetJson from "../assets/stat_blocks/mob_sets.json";
import statBlocksData from "../assets/stat_blocks/mm.json";
import homebrewStatBlocks from "../assets/stat_blocks/monsters_homebrew.json";
import metaSetJson from "../assets/stat_blocks/meta_mob_sets.json";
import { MetaMobSet, MobSet, StatBlock, MetaMobSetsSchema, MobSetsSchema, StatBlocksSchema } from "../mobs";

function loadJson(data, schema) {
  let output = {};
  try {
    output = schema.parse(data);
  } catch (error) {
    output = {};
    if (error instanceof z.ZodError) {
      console.error("Validation failed:", error.errors);
    } else {
      console.error("Unexpected error:", error);
    }
  }
  return output;
}

export const mobDataStore = defineStore({
  id: "mob-data",
  state: () => ({
    metaMobSets: loadJson(metaSetJson, MetaMobSetsSchema),
    mobSets: loadJson(mobSetJson, MobSetsSchema),
    mobs: { ...loadJson(statBlocksData, StatBlocksSchema), ...loadJson(homebrewStatBlocks, StatBlocksSchema) },
  }),
  getters: {
    terrains(state) {
      return Object.entries(state.metaMobSets).map(([key, x]) => ({ name: x["name"], value: key }));
    },
  },
  actions: {
    addMob(newMob: StatBlock) {
      let newId = newMob["name"].replace(/ /g, "_");
      this.mobs[newId] = newMob;
    },
    addNewMobSet(newSet: MobSet) {
      let newId = newSet["name"];
      if (newId in this.mobSets) {
        newId = `${newId}_1`;
      }
      this.mobSets[newId] = newSet;
      return newId;
    },
    deleteMobSet(setId: string) {
      delete this.mobSets[setId];
    },
    setMetaMobSet(metaSetId: string, data: MetaMobSet) {
      this.metaMobSets[metaSetId] = data;
    },
    statBlock(id: string) {
      return this.mobs[id];
    },
  },
});
