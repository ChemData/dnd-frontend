<script>
import {defineComponent} from 'vue'
import axios from 'axios'
import {EmptyHexGrid} from '../dataStructures'

let API_URL = import.meta.env.VITE_API_URL;


export default defineComponent({
  name: "MapLoader",
  props: ['map'],
  emits: ['mapChange'],
  data() {
    return{
      selected_map_name: '',
      showModal: false,
      height: 10,
      width: 10
    }},
  methods: {
    async localSaveMap(){
      let save_name = prompt('Save name: ')
      if (!save_name || (save_name === '')) {
        return
      }
      const blob = new Blob([JSON.stringify(this.map)], {type: 'text/plain'})
      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = save_name + '.map';
      link.click();

    },

    async localLoadMap(event) {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          this.$emit('mapChange', JSON.parse(content))
        };
        reader.readAsText(file);
      } catch (error) {
        console.error('Error loading map:', error);
      }
    },
    newMap() {
      this.showModal = false
      this.$emit('mapChange', EmptyHexGrid(this.height, this.width))
    }
  }
})
</script>

<template>
  <div>
    <button
      type="button"
      class="button is-small"
      @click="showModal = true"
    >
      New
    </button>
    <button
      type="button"
      class="button is-small"
      @click="localSaveMap"
    >
      Save
    </button>
    <label class="file-input-label">
      <input
        type="file"
        accept=".map"
        style="display: none;"
        @change="localLoadMap"
      >
      <span class="button is-small">
        Load Map
      </span>
    </label>
  </div>
  <div
    v-if="showModal"
    class="modal"
  >
    <div class="modal-content">
      <label for="height">Height:</label>
      <input
        id="height"
        v-model="height"
        type="number"
      >

      <label for="width">Width:</label>
      <input
        id="width"
        v-model="width"
        type="number"
      >

      <button @click="newMap">
        Make
      </button>

      <button @click="showModal = false">
        Close
      </button>
    </div>
  </div>
</template>

<style scoped>

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* semi-transparent black overlay */
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff; /* white background for modal content */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3); /* drop shadow */
}
</style>