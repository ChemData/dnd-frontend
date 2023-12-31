<script>
import {defineComponent} from 'vue';
import axios from 'axios';

export default defineComponent({
  name: "EncounterGenerator",
  data() {
    return{
      difficulty: 'easy',
      party_size: 4,
      party_level: 1,
      terrain: "",
      primary_enemy: "",
      enemy_options: [],
      terrain_options: [],
      max_enemies: 6,
      encounter_text: '',
      cr_options: ['0', '1/8', '1/4', '1/2', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
      '12', '13', '14', '15', '16', '17', '18', '19', '20'],
      minimum_cr: '0',
      roll_hp: true
    }
  },
  methods: {
    async fetchEnemyNames() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/mob_set_names');
        this.enemy_options = response.data;
      } catch (error) {
        console.error('Error fetching enemy names:', error);
      }
    },
    async fetchTerrainNames() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/environment_set_names');
        this.terrain_options = response.data;
      } catch (error) {
        console.error('Error fetching terrain names:', error);
      }
    },
    async generateEncounter() {

      let payload = {
        'party_size': this.party_size, 'party_level': this.party_level,
        'max_enemies': this.max_enemies, 'environment_type': this.terrain,
        'primary_enemy': this.primary_enemy, 'difficulty': this.difficulty,
        'minimum_cr': this.minimum_cr, 'roll_hp': this.roll_hp}
      try {
        const response = await axios.post('http://127.0.0.1:8000/encounter',  payload)
        this.encounter_text = response.data;
      } catch (error) {
        if (error.response.status === 460){
          alert('You must specify either an environment or a primary enemy.')
        } else if (error.response.status === 461) {
          alert('Could not find a group of enemies that meets all conditions. Try relaxing the CR or maximum enemy requirements.')
        }
      }
    }
  },
  mounted() {
    // Call the fetchEnemyNames method when the component is mounted
    this.fetchEnemyNames();
    this.fetchTerrainNames();
  }
})
</script>

<template>
  <div id="inputs">
    <label for="party_size">Party Size</label>
    <select id="party_size" v-model="party_size">
      <option v-for="number in 10" :key="number" :value="number"> {{ number }}</option>
    </select>
    &nbsp
    <label for="party_level">Party Level</label>
    <select id="party_level" v-model="party_level">
      <option v-for="number in 20" :key="number" :value="number"> {{ number }}</option>
    </select>
    &nbsp
    <label for="difficulty_select">Difficulty</label>
    <select id="difficulty_select" v-model='difficulty'>
      <option value="easy">Easy</option>
      <option value="medium">Medium</option>
      <option value="hard">Hard</option>
      <option value="deadly">Deadly</option>
      <option value="peaceful">Peaceful Countryside</option>
      <option value="tamed">Tamed Wilderness</option>
      <option value="untamed">Untamed Wilderness</option>
      <option value="dangerous">Deadly Wilderness</option>
      <option value="inhospitable">Inhospitable Wilderness</option>
      <option value="alien">Alien Horror Plane</option>
    </select>
    <br>
    <label for="max_enemy_select">Maximum Enemies</label>
    <select id="max_enemy_select" v-model="max_enemies">
      <option value="">No Limit</option>
      <option v-for="number in 8" :key="number" :value="number">
        {{ number }}
      </option>
    </select>
    &nbsp
    <label for="min_cr_select">Minimum CR</label>
    <select id="min_cr_select" v-model="minimum_cr">
      <option v-for="cr in cr_options" :key="cr" :value="cr">
        {{ cr }}
      </option>
    </select>
    <br>
    <label for="terrain_select">Terrain</label>
    <select id="terrain_select" v-model="terrain">
      <option value="">None</option>
      <option v-for="terrain in terrain_options" :key="terrain.value" :value="terrain.value">
        {{ terrain.name }}
      </option>
    </select>
    &nbsp
    <label for="primary_enemy_select">Primary Enemy</label>
    <select id="primary_enemy_select" v-model="primary_enemy">
      <option value="">None</option>
      <option v-for="enemy in enemy_options" :key="enemy.value" :value="enemy.value">
        {{ enemy.name }}
      </option>
    </select>
    <br>
    <label for="roll_hp_checkbox">Roll HP?</label>
    <input type="checkbox" id="roll_hp_checkbox" v-model="roll_hp">
    <br>
    <button id="generate_button" @click="generateEncounter">Generate Encounter</button>
  </div>
  <div id="encounter" v-html="encounter_text"></div>

</template>

<style scoped>
  label {
    margin-right: 6px;
  }
</style>