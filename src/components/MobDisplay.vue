<script>
import {defineComponent } from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import {mobDataStore} from "@/stores/mobDataStore";

export default defineComponent({
  name: "MobDisplay",
  components: {
    vSelect
  },
  props: {
    startMobId: {
      type: String,
      default: null
    },
    startReskin: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      mobId: this.startMobId,
      reskin: this.startReskin,
      mobs: {},
      mobOptions: []
    }
  },
  created(){
    this.mobs = mobDataStore().mobs
    this.mobOptions = Object.entries(this.mobs).map(([id, value]) => ({id, name: value.name}))
  },
  methods: {
  }
})
</script>

<template>
  <div class="container">
    <div class="name">
      <v-select
        v-model="mobId"
        :options="mobOptions"
        label="name" 
        item-value="id"
        :reduce="(option) => option.id"
        :clearable="false"
      />
    </div>
    <div class="reskin">
      <input v-model="reskin" type="text" placeholder="Reskin this mob">
    </div>
  </div>
</template>

<style scoped>

.name {
  width: 40%
}

.reskin {
  width: 30%
}
</style>