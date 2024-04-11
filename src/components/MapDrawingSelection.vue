<script>
import {defineComponent} from 'vue'
import {EmptyHexGrid} from "@/dataStructures";

export default defineComponent({
  name: "MapDrawingSelection",
  props: ['terrain_info', 'river_info', 'road_info', 'settlement_info', 'wildness_info', 'brush'],
  emits: ['brushChange'],
  data() {
    return {
      terrain: "",
      rivers: "",
      roads: "",
      settlement: "",
      wildness: "",
      visibility: "false",
      active_selector: ""
    }
  },
  methods: {
    selectorChanged(changed_selector){
      this.active_selector = changed_selector
      this.$emit('brushChange', {'property': this.active_selector, 'value': this[this.active_selector]})
    }
  }
})
</script>

<template>
  <div>
    <select
      v-model="terrain"
      :class="{ 'active': active_selector === 'terrain', 'inactive': active_selector !== 'terrain'}"
      class="select is-small"
      @change="selectorChanged('terrain')"
    >
      <option
        disabled
        value=""
        class="dropdown"
      >
        Terrain
      </option>
      <option
        v-for="(info, key) in terrain_info"
        :key="key"
        :value="key"
        class="dropdown"
      >
        {{ info.name }}
      </option>
    </select>
    <select
      v-model="rivers"
      :class="{ 'active': active_selector === 'rivers', 'inactive': active_selector !== 'rivers'}"
      class="select is-small"
      @change="selectorChanged('rivers')"
    >
      <option
        disabled
        value=""
        class="dropdown"
      >
        River
      </option>
      <option
        v-for="(info, key) in river_info"
        :key="key"
        :value="key"
        class="dropdown"
      >
        {{ info.display }}
      </option>
      <option
        value="none"
        class="dropdown"
      >
        Delete
      </option>
    </select>
    <select
      v-model="roads"
      :class="{ 'active': active_selector === 'roads', 'inactive': active_selector !== 'roads'}"
      class="select is-small"
      @change="selectorChanged('roads')"
    >
      <option
        disabled
        value=""
        class="dropdown"
      >
        Road
      </option>
      <option
        v-for="(info, key) in road_info"
        :key="key"
        :value="key"
        class="dropdown"
      >
        {{ info.display }}
      </option>
      <option
        value="none"
        class="dropdown"
      >
        Delete
      </option>
    </select>
    <select
      v-model="settlement"
      :class="{ 'active': active_selector === 'settlement', 'inactive': active_selector !== 'settlement'}"
      class="select is-small"
      @change="selectorChanged('settlement')"
    >
      <option
        disabled
        value=""
        class="dropdown"
      >
        Settlement
      </option>
      <option
        v-for="(info, key) in settlement_info"
        :key="key"
        :value="key"
        class="dropdown"
      >
        {{ info.display }}
      </option>
    </select>
    <select
      v-model="wildness"
      :class="{ 'active': active_selector === 'wildness', 'inactive': active_selector != 'wildness'}"
      class="select is-small"
      @change="selectorChanged('wildness')"
    >
      <option
        disabled
        value=""
        class="dropdown"
      >
        Wildness
      </option>
      <option
        v-for="(info, key) in wildness_info"
        :key="key"
        :value="key"
        class="dropdown"
      >
        {{ info.name }}
      </option>
      <option value="">
        Delete
      </option>
    </select>
    <select
      v-model="visibility"
      :class="{ 'active': active_selector === 'visibility', 'inactive': active_selector !== 'visibility'}"
      class="select is-small"
      @change="selectorChanged('visibility')"
    >
      <option
        disabled
        value=""
        class="dropdown"
      >
        Visibility
      </option>
      <option
        value="false"
        class="dropdown"
      >
        DM Only
      </option>
      <option
        value="true"
        class="dropdown"
      >
        Players & DM
      </option>
    </select>
  </div>
</template>

<style scoped>

.active{
  background-color: lightblue;
}
.inactive{
  background-color: white;
}
.dropdown{
  background-color: white;
  color: black;
}

</style>