<script lang="ts">
import { defineComponent, watch } from "vue";

export default defineComponent({
  name: "DungeonMap",
  data() {
    return {
      canvas: null,
      ctx: null,
      map: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
      map_width: 800,
      map_height: 600,
    };
  },
  methods: {
    refreshMap() {},
    drawHexagon(x: number, y: number, s: number, color: string, border_color: string = "black"): void {
      let half_height = 3 ** 0.5 / 2;
      let vertexes = [
        [-0.5, -half_height],
        [0.5, -half_height],
        [1, 0],
        [0.5, half_height],
        [-0.5, half_height],
        [-1, 0],
      ];
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(x + s * vertexes[0][0], y + s * vertexes[0][1]);
      for (let i = 1; i < vertexes.length; i++) {
        this.ctx.lineTo(x + s * vertexes[i][0], y + s * vertexes[i][1]);
      }
      this.ctx.closePath();
      this.ctx.strokeStyle = border_color;
      this.ctx.stroke();
      this.ctx.fillStyle = color;
      this.ctx.fill();
    },
  },
  mounted() {
    this.canvas = <HTMLCanvasElement>document.getElementById("hexcanvas");
    this.ctx = this.canvas.getContext("2d");
    watch(this.view, (newVal, oldVal) => {
      this.refreshMap();
    });

    this.refreshMap();
  },
  beforeMount() {
    this.terrain_info = terrainData;
    for (let k in this.terrain_info) {
      if ("textures" in this.terrain_info[k]) {
        for (let texture_name of this.terrain_info[k]["textures"]) {
          let new_image = new Image();
          new_image.src = "assets/map/terrain/" + texture_name + ".svg";
          this.terrain_texture_images[texture_name] = new_image;
        }
      }
    }
    console.log(this.terrain_texture_images);

    this.river_info = riversData;
    this.road_info = roadsData;
    this.settlement_info = settlementData;
    for (let k in this.settlement_info) {
      let new_image = new Image();
      new_image.src = "assets/map/settlements/" + this.settlement_info[k]["icon_path"];
      this.settlement_info[k]["icon"] = new_image;
    }
    this.wildness_info = wildnessData;
  },
  computed: {
    mapLoaderComponent() {
      return import.meta.env.VITE_LOADER_TYPE === "personal" ? "MapLoader" : "LocalMapLoader";
    },
  },
});
</script>

<template>
  <div>
    <canvas id="canvas" :width="map_width" :height="map_height"></canvas>
  </div>
</template>

<style scoped></style>
