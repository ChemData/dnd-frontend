<script>
import { defineComponent } from "vue";
import HexTile from "@/components/HexMap/HexTile.vue";

export default defineComponent({
  name: "MapView",
  components: { HexTile },
});
</script>

<template>
  <div class="main-area">
    <HexTile :size="70" :pos="[40, 30]"></HexTile>
    <HexTile :size="50" :pos="[10, 30]" color="red"></HexTile>
  </div>
</template>

<style scoped>
.main-area {
  position: relative;
  height: 500px;
  width: 500px;
}
</style>
