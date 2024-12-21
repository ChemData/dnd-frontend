<script>
import {capitalize, defineComponent} from 'vue'
import {view} from "@/store";
import {EmptyHexGrid} from "@/dataStructures";
import { mobDataStore } from "@/stores/mobDataStore";
import MobDisplay from "@/components/MobDisplay.vue";
import vSelect from "vue-select";
import {replaceAll} from "@/utils";

export default defineComponent({
  name: "MobSetView",
  components: {vSelect, MobDisplay},
  data() {
    return {
      currentSet: 'wolves',
      mobDataStore: null,
      displayedSetName: 'wolves',
      selectedSet: 'wolves',
      setMobs: []
    }
  },
  computed: {
    mobSetIds(){
      return Object.keys(this.mobDataStore.mobSets)
    }
  },
  watch: {

  },
  created(){
    this.mobDataStore = mobDataStore()
    this.loadSet()
    console.log(this.mobDataStore.statBlocks)
  },
  methods: {
    capitalize,
    deleteMob(index){
      this.setMobs.splice(index, 1)
    },
    addMob(){
      let newMob = {id: null}
      this.setMobs.push(newMob)
    },
    loadSet(){
      this.currentSet = this.selectedSet
      this.displayedSetName = this.selectedSet
      this.setMobs = [...this.mobDataStore.mobSets[this.currentSet]['mobs']]
    },
    saveSet(){
      let newSet = {}
      newSet['name'] = this.displayedSetName
      newSet['mobs'] = []
      Object.keys(this.$refs).forEach(refKey => {
        if (refKey.startsWith('mob-')) {
          const mob = this.$refs[refKey][0];
          if (mob ){
            newSet['mobs'].push({id: mob.mobId, reskin: mob.reskin})
          }
        }
      })
      this.mobDataStore.addMobSet(newSet)
      this.selectedSet = newSet['name']
    },
    deleteSet(){
      this.mobDataStore.deleteMobSet(this.currentSet)
      this.selectedSet = Object.keys(this.mobDataStore.mobSets)[0]
      this.loadSet()
    }
  }
})
</script>

<template>
  <div>
    <div class="set-options">
      <input v-model="displayedSetName" type="text" class="title-display">
      <div class="load-area">
        <div class="set-selector">
          <v-select v-model="selectedSet" :options="mobSetIds" :clearable="false" @option:selected="loadSet" />
        </div>
        <button class="button is-small" @click="saveSet">
          Save
        </button>
        <button class="button is-small" @click="deleteSet">
          Delete
        </button>
      </div>
    </div>
    <hr>
    <div class="mob-list">
      <div v-for="(mob, index) in setMobs" :key="mob.id+'-'+mob.reskin" class="container">
        <MobDisplay
          :ref="`mob-${index}`"
          :start-mob-id="mob['id']"
          :start-reskin="mob['reskin']"
        />
        <div class="delete-button-area">
          <button class="button is-small is-danger is-light delete-button" @click="deleteMob(index)">X</button>
        </div>
      </div>
      <button class="button is-small is-success is-light delete-button" @click="addMob">+</button>
    </div>
  </div>
</template>

<style scoped>

.set-options {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

}

.delete-button-area{
  width: 20%
}

.delete-button{
  height: 22px;
  margin-left: 8px;
  margin-top: 1px;
}
.load-area{
  display: flex;
  justify-content: center;
  align-items: center;
}
.set-selector{
  width: 150px;
}
.title-display{
  font-size: 24pt; /* Increase the font size to look like a title */
    padding: 5px 5px; /* Add some padding for better spacing */
    border: 2px solid #ccc; /* Light grey border */
    border-radius: 5px; /* Rounded corners */
    width: 50%; /* Full width */
    box-sizing: border-box; /* Ensure padding and border are included in the element's total width and height */
    background-color: #f9f9f9; /* Light background color */
    font-weight: bold; /* Make the text bold */
    text-align: center; /* Center the text */
}

</style>