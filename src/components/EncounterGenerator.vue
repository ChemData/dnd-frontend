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
      terrain: "none",
      primary_enemy: "none",
      enemy_options: [],
      max_enemies: 6
    }
  },
  methods: {
    generateEncounter(){
      let x = 1
    },
    async fetchEnemyNames() {
      try {
        const response = await axios.get('/mob_set_names');
        this.enemy_options = response.data;
      } catch (error) {
        console.error('Error fetching enemy names:', error);
      }
    }
  },
  mounted() {
    // Call the fetchEnemyNames method when the component is mounted
    this.fetchEnemyNames();
  }
})
</script>

<template>
  <div id="inputs">
    <label for="party_size">Party Size</label>
    <select id="party_size" v-model="party_size">
      <option v-for="number in 10" :key="number" :value="number"> {{ number }}</option>
    </select>
    <label for="party_level">Party Level</label>
    <select id="party_level" v-model="party_level">
      <option v-for="number in 20" :key="number" :value="number"> {{ number }}</option>
    </select>
    <select id="difficulty_select" v-model='difficulty'>
      <option value="easy">Easy</option>
      <option value="medium">Medium</option>
      <option value="hard">Hard</option>
      <option value="random">Random</option>
    </select>
    <select id="terrain_select" v-model="terrain"></select>
    <select id="primary_enemy_select" v-model="primary_enemy"></select>
    <select id="max_enemy_select" v-model="max_enemies"></select>
    <button id="generate_button" @click="generateEncounter">Generate Encounter</button>
  </div>

</template>

<style scoped>

</style>