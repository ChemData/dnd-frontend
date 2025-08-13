<script>
import { capitalize, defineComponent } from "vue";
import { mobDataStore } from "@/stores/mobDataStore";

export default defineComponent({
  name: "MobSetWithSlider",
  props: {
    mobSetId: {
      type: String,
      default: "",
    },
    slider: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      weight: this.slider,
      mobSets: mobDataStore().mobSets,
      mobs: mobDataStore().mobs,
      expanded: false,
    };
  },
  methods: {
    capitalize,
    setWeight(value) {
      this.weight = value;
    },
    displayName(mob_id) {
      return this.mobs[mob_id] ? this.mobs[mob_id].Name : `${mob_id} [Missing Entry]`;
    },
  },
});
</script>

<template>
  <div @mouseover="expanded = true" @mouseleave="expanded = false">
    <div class="horizontal-container">
      <div class="mob-name">
        {{ capitalize(mobSets[mobSetId].name) }}
      </div>
      <div v-if="slider">
        <input v-model="weight" type="range" min="0" max="100" />
      </div>
    </div>
    <div class="mob-list" :class="{ expanded: expanded }">
      <div v-for="mob in mobSets[mobSetId].mobs" :key="mob.id">
        {{ displayName(mob.id) }} <span v-if="mob.reskin">({{ mob.reskin }})</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.horizontal-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.mob-list {
  opacity: 0;
  height: 0;
  overflow: hidden;
  transition:
    height 0.3s ease-in-out,
    opacity 0.3s ease-in-out;
}

.expanded {
  opacity: 1;
  height: auto;
}

.mob-name {
  font-size: 18px;
}
</style>
