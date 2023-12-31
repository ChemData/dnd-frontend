<template>
  <div>
    <select v-model="current_creature" id="creature_selector">
      <option v-for="creature in creature_list" :key="creature" :value="creature">{{ creature }}</option>
    </select>
  </div>
</template>

<script>
import {defineComponent} from 'vue';
import axios from 'axios';

export default defineComponent({
  name: "SetMaker",
  data() {
    return {
      creature_list: ["wolf", "bear", "moose"],
      selected_creatures: "wolf",
      set_list: {},
      selected_set: "wolves",
      set_contents: []
    }
  },
  methods: {
    async fetchEnemyNames() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/mob_set_names');
        this.set_list = response.data;
      } catch (error) {
        console.error('Error fetching enemy names:', error);
      }
    }
  }
}
)
</script>

<style scoped>
/* Add your component styles here */
</style>
