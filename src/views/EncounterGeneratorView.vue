<script>
import {capitalize, defineComponent} from 'vue';
import axios from 'axios';
import { mobDataStore } from "@/stores/mobDataStore";
import {singleEncounter} from "@/generation";
import Mob  from "@/components/EncounterGenerator/Mob.vue";

//let API_URL = 'http://192.168.4.106:8000'
//let API_URL = 'https://our-dm-tools.pexagons.com/api'
let API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL)

export default defineComponent({
  name: "EncounterGeneratorView",
  components: {Mob: Mob},
  data() {
    return{
      party_size: 4,
      party_level: 4,
      terrain: "southern_shore",
      terrain_options: mobDataStore().terrains,
      wildness: "peaceful",
      wildness_options: [
          {'name': "Peaceful Countryside", 'value': 'peaceful'},
          {'name': "Tamed Wilderness", 'value': 'tamed'},
          {'name': "Untamed Wilderness", 'value': 'untamed'},
          {'name': "Dangerous Wilderness", 'value': 'dangerous'},
          {'name': "Inhospitable Wilderness", 'value': 'inhospitable'},
          {'name': "Alien Plains of Horror", 'value': 'alien'}
          ],
      primary_enemy: "",
      max_enemies: 6,
      minimum_cr: '0',
      cr_options: ['0', '1/8', '1/4', '1/2', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
      '12', '13', '14', '15', '16', '17', '18', '19', '20'],
      roll_hp: true,
      difficulty: 'easy',
      difficulty_options: [
        {'name': 'Easy', 'value': 'easy'},
        {'name': 'Medium', 'value': 'medium'},
        {'name': 'Hard', 'value': 'hard'},
        {'name': 'Deadly', 'value': 'deadly'},
        {'name': 'Use Wildness', 'value': 'wildness'}
      ],
      currentEncounter: null,
      combatEncounter: null,
      enemy_options: mobDataStore().mobSets,
      mobKeyOffset: 0
    }
  },
  mounted() {
  },
  methods: {
    capitalize,
    async fetchEnemyNames() {
      try {
        const response = await axios.get(`${API_URL}/mob_set_names`);
        this.enemy_options = response.data;
      } catch (error) {
        console.error('Error fetching enemy names:', error);
      }
    },
    async fetchTerrainNames() {
      try {
        const response = await axios.get(`${API_URL}/environment_set_names`);
        this.terrain_options = response.data;
      } catch (error) {
        console.error('Error fetching terrain names:', error);
      }
    },
    generateBattle() {
      this.mobKeyOffset += this.combatEncounter?.group?.mobs?.length ?? 0
      let wildness_val = null
      if (this.difficulty === 'wildness') {
        wildness_val = this.wildness
      }
      let mobSets = mobDataStore().metaMobSets[this.terrain]["sets"]
      let setWeights = Object.values(mobSets)
      mobSets = Object.keys(mobSets).map(mobSet => mobDataStore().mobSets[mobSet])
      try{
        this.combatEncounter = singleEncounter(this.difficulty, Array(this.party_size).fill(this.party_level), mobSets, this.max_enemies, this.minimum_cr)
        this.currentEncounter = 'combat'
      } catch (e) {
        this.$toast.error('Could not find a valid battle - try loosening restrictions or increasing difficulty.')
      }

    },
    async generateEncounter() {
      let payload = {
        'wildness': this.wildness}
      try {
        const response = await axios.post(`${API_URL}/encounter`,  payload)
        if (response.data === 'hostile') {
          this.difficulty = 'wildness'
          await this.generateBattle()
        } else if (response.data === 'non-hostile') {
          await this.generateNonHostileEncounter()
        } else {
          this.encounter_text = response.data;
        }
      } catch (error) {
        if (error.response.status === 462) {
          alert('The specified wildness is not valid.')
        }
      }
    },
    async generateNonHostileEncounter() {
      try {
        const response = await axios.post(`${API_URL}/nonhostile_encounter`)
        this.encounter_text = response.data;
      } catch (error) {
        console.error(error.data);
      }
    }
  }
})
</script>

<template>
  <hr>
  <div id="inputs">
    <div id="party">
      <div>
        <label>Party Size</label>
        <select v-model="party_size" class="dropdown">
          <option v-for="number in 10" :key="number" :value="number">
            {{ number }}
          </option>
        </select>
      </div>
      <div>
        <label>Party Level</label>
        <select v-model="party_level" class="dropdown">
          <option v-for="number in 20" :key="number" :value="number">
            {{ number }}
          </option>
        </select>
      </div>
      <hr>
    </div>
    <div id="enemies">
      <div>
        <label>Maximum Enemies</label>
        <select id="max_enemy_select" v-model="max_enemies">
          <option v-for="number in 10" :key="number" :value="number">
            {{ number }}
          </option>
          <option value="">
            No Limit
          </option>
        </select>
      </div>
      <div>
        <label>Minimum CR</label>
        <select id="min_cr_select" v-model="minimum_cr">
          <option v-for="cr in cr_options" :key="cr" :value="cr">
            {{ cr }}
          </option>
        </select>
      </div>
      <div>
        <label>Primary Enemy</label>
        <select id="primary_enemy_select" v-model="primary_enemy">
          <option value="">
            None
          </option>
          <option v-for="enemy in enemy_options" :key="enemy.value" :value="enemy.value">
            {{ enemy.name }}
          </option>
        </select>
      </div>
      <div>
        <label for="roll_hp_checkbox">Roll HP?</label>
        <input id="roll_hp_checkbox" v-model="roll_hp" type="checkbox">
      </div>
      <hr>
    </div>
    <div id="surroundings">
      <div>
        <label>Terrain</label>
        <select id="terrain_select" v-model="terrain">
          <option value="">
            None
          </option>
          <option v-for="terrain in terrain_options" :key="terrain.value" :value="terrain.value">
            {{ terrain.name }}
          </option>
        </select>
      </div>
      <div>
        <label>Wildness</label>
        <select v-model="wildness">
          <option v-for="wildness_val in wildness_options" :key="wildness_val.value" :value="wildness_val.value">
            {{ wildness_val.name }}
          </option>
        </select>
      </div>
      <hr>
    </div>
    <div id="gen_buttons">
      <div>
        <button @click="generateEncounter">
          Generate Encounter
        </button>
      </div>
      <div>
        <button id="generate_button" @click="generateBattle">
          Generate Battle
        </button>
        <label for="difficulty_select">Difficulty</label>
        <select id="difficulty_select" v-model="difficulty">
          <option v-for="diff in difficulty_options" :key="diff.value" :value="diff.value">
            {{ diff.name }}
          </option>
        </select>
      </div>
      <div>
        <button id="non-hostile-button" @click="generateNonHostileEncounter">Generate Non-hostile Encounter</button>
      </div>
      <hr>
    </div>
  </div>
  <div id="encounter" v-if="currentEncounter==='combat'">
    <div class="section-title">
      {{ `${capitalize(this.combatEncounter.difficulty)}  ${capitalize(this.combatEncounter.enemyType)}` }}
    </div>
    <div>
      <Mob v-for="(mob, index) in combatEncounter.group.mobs" :key="index+mobKeyOffset" :mob="mob" :default-roll-hp="roll_hp"/>
    </div>
  </div>
  <br>
</template>

<style scoped>
  label {
    margin-right: 6px;
  }
  .dropdown {
    margin-left: 6px;
  }
  .section-title {
    font-size: 20px;
  }
</style>