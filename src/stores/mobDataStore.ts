import {defineStore} from "pinia"
import { mockMobs, mockMetaMobSets, mockMobSets } from '../mockData.js'
import mobSetJson from '../assets/mob_sets.json';
import mobsJson from '../assets/monsters.json';

export const mobDataStore = defineStore({
    id: 'mob-data',
    state: () => ({
        metaMobSets: mockMetaMobSets(),
        mobSets: mobSetJson,
        mobs: mobsJson
    }),
    actions: {
        addMob(newMob){
            let newId = newMob['name'].replace(/ /g, '_')
            this.mobs[newId] = newMob
        },
        addMobSet(newSet){
            let newId = newSet['name']
            this.mobSets[newId] = newSet
        },
        deleteMobSet(setId){
            delete this.mobSets[setId]
        },
        setMetaMobSet(metaSetId, data){
            this.metaMobSets[metaSetId] = data
        }
    }
})