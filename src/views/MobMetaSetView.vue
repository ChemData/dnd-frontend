<script>
import { defineComponent } from 'vue'
import vSelect from "vue-select";
import { mobDataStore } from "@/stores/mobDataStore";
import MobSetWithSlider from "@/components/MobDesigner/MobSetWithSlider.vue";

export default defineComponent({
  name: "MobMetaSetView",
  components: {MobSetWithSlider, vSelect},
  data() {
    return {
      currentMetaSet: "",
      metaSets: null,
      mobSets: null,
      selectedSets: [],
    }
  },
  computed: {
    unselectedSets(){
      let output = Object.keys(this.mobSets)
      return output.filter(value => !this.selectedSets.includes(value))
    }
  },
  created() {
    this.mobSets = mobDataStore().mobSets
    this.metaSets = mobDataStore().metaMobSets
  },
  methods: {
    addToSelected(setKey) {
      this.selectedSets.push(setKey)
    },
    removeFromSelected(setKey) {
      const index = this.selectedSets.indexOf(setKey)
      if (index !== -1){
        this.selectedSets.splice(index, 1)
      }
    },
    async loadSet(){
      this.selectedSets =  Object.keys(this.metaSets[this.currentMetaSet])
      await this.$nextTick()
      for (let setId of this.selectedSets){
        this.$refs[setId][0].setWeight(this.metaSets[this.currentMetaSet][setId])
      }
    },
    saveSet(){
      let newSet = {}
      for (let setId of this.selectedSets){
        newSet[setId] = Number(this.$refs[setId][0].weight)
      }
      mobDataStore().setMetaMobSet(this.currentMetaSet, newSet)
    },
    saveAsSet(){
      let name = prompt("What should this Metaset be called?", "New Name")
      if (name){
        this.currentMetaSet = name
        this.saveSet()
      }
    }
  }
})
</script>

<template>
  <div>
    <div>
      <v-select v-model="currentMetaSet" :options="Object.keys(metaSets)" :clearable="false" @option:selected="loadSet" />
      <button class="button is-small" @click="saveSet">Save</button>
      <button class="button is-small" @click="saveAsSet">Save As</button>
    </div>
    <div>
      <div class="set-options">
        <h3>Available Sets</h3>
        <ul>
          <li v-for="mobSetId in unselectedSets" :key="mobSetId" @dblclick="addToSelected(mobSetId)">
            <MobSetWithSlider :mob-set-id="mobSetId" />
          </li>
        </ul>
      </div>
      <div class="selected-sets">
        <h3>Selected Sets</h3>
        <ul>
          <li v-for="mobSetId in selectedSets" :key="mobSetId" @dblclick="removeFromSelected(mobSetId)">
            <MobSetWithSlider :ref="`${mobSetId}`" :mob-set-id="mobSetId" :slider="50" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.set-options, .selected-sets {
  margin: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  width: 45%;
  display: inline-block;
  vertical-align: top;
}

.set-options ul, .selected-sets ul {
  list-style-type: none;
  padding: 0;
}

.set-options li, .selected-sets li {
  cursor: pointer;
  padding: 5px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 3px;
  transition: background-color 0.3s;
}

.set-options li:hover, .selected-sets li:hover {
  background-color: #090202;
}
</style>
