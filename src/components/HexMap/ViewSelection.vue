<script lang="ts">
import { defineComponent } from "vue";
import { view } from "../../store.ts";

export default defineComponent({
  name: "ViewSelection",
  data() {
    return {
      view,
    };
  },
});
</script>

<template>
  <div>
    <h3>Visibility</h3>
    <div>
      <input id="terrain_checkbox" v-model="view['show_terrain']" type="checkbox" />
      <label for="terrain_checkbox">Terrain</label>
    </div>
    <div>
      <input id="river_checkbox" v-model="view['show_rivers']" type="checkbox" />
      <label for="river_checkbox">Rivers</label>
    </div>
    <div>
      <input id="road_checkbox" v-model="view['show_roads']" type="checkbox" />
      <label for="road_checkbox">Roads</label>
    </div>
    <div>
      <input id="settlement_checkbox" v-model="view['show_settlements']" type="checkbox" />
      <label for="settlement_checkbox">Settlements</label>
    </div>
    <div>
      <input id="settlement_name_checkbox" v-model="view['show_settlement_names']" type="checkbox" />
      <label for="settlement_name_checkbox">Settlement Names</label>
    </div>
    <div>
      <input id="wildness_checkbox" v-model="view['show_wildness']" type="checkbox" />
      <label for="wildness_checkbox">Wildness</label>
    </div>
    <div>
      <input id="coordinate_checkbox" v-model="view['show_coordinates']" type="checkbox" />
      <label for="coordinate_checkbox">Coordinates</label>
    </div>
    <div>
      <input id="player_view_checkbox" v-model="view['player_view']" type="checkbox" />
      <label for="player_view_checkbox">Player View</label>
    </div>
  </div>
</template>

<style scoped></style>
