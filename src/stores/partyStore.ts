import { defineStore } from "pinia";
import { CharacterSheet } from "../types";

export const partyDataStore = defineStore({
  id: "party-data",
  state: () => ({
      party: [{name: 'gandalf', level: 20, class: 'wizard', race: 'aasimar'}, {name: 'frodo', level: 2, class: 'rogue', race: 'halfling'}] as CharacterSheet[]
  }),
  getters: {
      partyLevels(){
          return this.party.map(x => x.level)
      }
  },
  actions: {
      setParty(newParty: CharacterSheet[]){
          this.party = newParty
      }
  },
});
