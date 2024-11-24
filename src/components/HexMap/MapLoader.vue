<script>
import {defineComponent} from 'vue'
import axios from 'axios'
import {EmptyHexGrid} from '../../dataStructures'

let API_URL = import.meta.env.VITE_API_URL;


export default defineComponent({
  name: "MapLoader",
  props: ['map'],
  emits: ['mapChange'],
  data() {
    return{
      map_list: [],
      selected_map_name: '',
      showModal: false,
      height: 10,
      width: 10
    }},
  mounted() {
    this.loadMapNames()
  },
  methods: {
    async loadMapNames(){
      try {
        let response = await axios.get(`${API_URL}/saved_map_names`)
        this.map_list = response.data
      } catch (error) {
        console.error('Error loading map names:', error)
      }
    },
    async saveMap(){
      let save_name = prompt('Save name: ')
      if (!save_name || (save_name === '')){
        return
      }
      let payload = {'save_name': save_name, 'map_data': this.map}
      try {
        await axios.post(`${API_URL}/save_map`, payload)
      } catch (error) {
        console.error('Error saving map:', error)
      }
      await this.loadMapNames()
    },

    async loadMap() {
      try {
        let response = await axios.get(`${API_URL}/load_map/${this.selected_map_name}`)
        this.$emit('mapChange', response.data)
      } catch (error) {
        console.error('Error loading map:', error)
      }
    },

    async localLoadMap() {
      let x = 10;
    },
    async deleteMap() {
      try {
        await axios.post(`${API_URL}/delete_save`, {to_delete: this.selected_map_name})
      } catch (error) {
        console.error('Error deleting map:', error)
      }
      await this.loadMapNames()
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
      @click="saveMap"
    >
      Save
    </button>
    <button
      type="button"
      class="button is-small"
      @click="loadMap"
    >
      Load
    </button>
    <button
      type="button"
      class="button is-small"
      @click="deleteMap"
    >
      Delete
    </button>
    <select
      v-model="selected_map_name"
      class="select is-small"
    >
      <option
        disabled
        value=""
      >
        Select a Map
      </option>
      <option
        v-for="map_name in map_list"
        :value="map_name"
      >
        {{ map_name }}
      </option>
    </select>
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