<script lang="ts">
import {defineComponent, watch} from 'vue'
import roadsData from '../../assets/roads.json';
import riversData from '../../assets/rivers.json';
import terrainData from '../../assets/terrain.json';
import settlementData from '../../assets/settlements.json';
import wildnessData from '../../assets/wildness.json';
import {
  Hex,
  EmptyHexGrid,
  Point,
  axialRound,
  axialToNormal,
  NormalCoord
} from "../../dataStructures";
import MapLoader from './MapLoader.vue'
import LocalMapLoader from './LocalMapLoader.vue'
import MapDrawingSelection from "./MapDrawingSelection.vue";
import ViewSelection from "./ViewSelection.vue";
import { view } from '../../store.ts';

let HEX_HEIGHT = 3 ** 0.5

const POSITIONS = {
  0: [0, 0],
  1: [30, 0.6],
  2: [90, 0.6],
  3: [150, 0.6],
  4: [210, 0.6],
  5: [270, 0.6],
  6: [330, 0.6],
}

function calcPositionInHex(positionNumber){
  let vector = POSITIONS[positionNumber]
  let x = Math.cos(vector[0]/180*Math.PI)*vector[1]*HEX_HEIGHT/2
  let y = Math.sin(vector[0]/180*Math.PI)*vector[1]*HEX_HEIGHT/2
  return [x, y]
}



export default defineComponent({
  name: "HexMap",
  components: {
    ViewSelection,
    MapDrawingSelection,
    MapLoader,
    LocalMapLoader
  },
  data() {
    return {
      view,
      canvas: null,
      ctx: null,
      terrain_info: [],
      terrain_texture_images: {},
      river_info: [],
      road_info: [],
      settlement_info: [],
      wildness_info: {},
      editable: false,
      map: EmptyHexGrid(0, 0),
      previous_hex: null,
      brush: {'property': null, value: false},
      cursor: {'function': null, 'trigger_on_move': true, 'edits': true},
      map_width: 800,
      map_height: 600
    }
  },
  methods: {
    refreshMap() {
      this.clearHexCanvas()
      let visible_range = this.visibleHexes()
      for (let row = visible_range['y'][0]; row < visible_range['y'][1]; row++){
        for (let col = visible_range['x'][0]; col < visible_range['x'][1]; col++) {
          this.drawHex(this.map.array[row][col])
        }
      }
      if (!this.view['show_settlement_names']) {
        return
      }
      for (let row = visible_range['y'][0]; row < visible_range['y'][1]; row++) {
        for (let col = visible_range['x'][0]; col < visible_range['x'][1]; col++) {
          this.drawText(this.map.array[row][col])
        }
      }
    },
    drawText(hex){
      if (hex.settlement != null) {
        if (this.view['show_settlement_names']) {
          this.writeText(hex, 2, hex.settlement.name, 0.3)
          }
      }
    },
    clearHexCanvas(){
      this.ctx.clearRect(0, 0, this.map_width, this.map_height)
    },
    drawHex(hex, clear_first=false) {
      //x and y are the center pixel positions of the hexagon
      let x = 3/2 * hex.position.col * this.view['scale'] + this.view['offset_x']
      let offset_down = (Boolean(hex.position.col % 2) == this.map.first_is_up)
      let y = HEX_HEIGHT * this.view['scale'] * (hex.position.row + 0.5 * +offset_down) + this.view['offset_y']
      // Draw the basic hexagon
      if (clear_first){
        this.drawHexagon(x, y, this.view['scale'], '#ffffff', '#ffffff')
      }
      if (this.view['player_view'] && !hex.player_visible) {
          return
      }

      // Add Terrain color
      let color = this.terrain_info['empty']['color']
      try {
        if (this.view['show_terrain']) {
          color = this.terrain_info[hex.terrain]['color']
        }
      } catch (error) {
        return
      }
      this.drawHexagon(x, y, this.view['scale'], color, "#000000")

      //Add rivers and roads
      for (let direction = 0; direction < hex.rivers.length; direction ++) {
          if (this.terrain_info[hex.terrain]['ocean']){
              break
          }
          if (hex.rivers[direction] != 'none' && this.view['show_rivers']){
              let river_info = this.river_info[hex.rivers[direction]]
              this.drawLine(x, y, direction, river_info['color'], river_info['width']*this.view['scale'], this.ctx)
          }
          if (hex.roads[direction] != 'none' && this.view['show_roads']){
              let road_info = this.road_info[hex.roads[direction]]
              this.drawLine(x, y, direction, road_info['color'], road_info['width']*this.view['scale'], this.ctx)
          }
      }

      //Add terrain textures
      if (this.view['show_terrain']) {
          if ('textures' in this.terrain_info[hex.terrain]){
            let textures = this.terrain_info[hex.terrain]['textures']
            for (let c=0; c<2; c++){
              let position = [4, 6][c]
              let texture = this.terrain_texture_images[textures[c%textures.length]]
              this.drawSVG(hex, position, texture, 0.7)
            }
          }
      }
      // Add coordinates
      if (this.view['show_coordinates']) {
        let coordinate_label = hex.position.col + ', ' + (hex.position.row)
          this.ctx.font = `${Math.floor(0.3*this.view['scale'])}px Arial`;
          this.ctx.fillStyle = 'black'
          this.ctx.fillText(coordinate_label, x-this.view['scale']*0.4, y+this.view['scale']*0.4*HEX_HEIGHT)
      }
      //Add settlement symbols
      if (hex.settlement != null) {
          if (this.view['show_settlements']) {
              this.drawSVG(hex, 0, this.settlement_info[hex.settlement.type]['icon'], 0.8)
          }
      }
    },
    drawHexagon(x: number, y: number, s: number, color: string, border_color: string='black'): void {
      let half_height = 3 ** 0.5 / 2;
    let vertexes = [
        [-0.5, -half_height], [0.5, -half_height], [1, 0], [0.5, half_height],
        [-0.5, half_height], [-1, 0]
    ]
    this.ctx.lineWidth = 1
    this.ctx.beginPath()
    this.ctx.moveTo(x + s * vertexes[0][0], y + s * vertexes[0][1])
    for (let i = 1; i < vertexes.length; i++) {
        this.ctx.lineTo(x + s * vertexes[i][0], y + s * vertexes[i][1])
    }
    this.ctx.closePath()
    this.ctx.strokeStyle = border_color
    this.ctx.stroke()
    this.ctx.fillStyle = color
    this.ctx.fill()
    },
    drawLine(x: number, y: number, direction: number, color: string, line_width: number, ctx: CanvasRenderingContext2D){
        ctx.lineWidth = line_width
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + this.view['scale'] * HEX_HEIGHT/2 * Math.sin(direction/3 * Math.PI),
            y - this.view['scale'] * HEX_HEIGHT/2 * Math.cos(direction/3 * Math.PI))
        ctx.closePath()
        ctx.strokeStyle = color
        ctx.stroke()
    },
    visibleHexes() {
      let x_min = Math.ceil(-this.view.offset_x/this.view.scale/1.5) - 1
      let y_min = Math.ceil(-this.view.offset_y/this.view.scale/HEX_HEIGHT) - 1
      let x_max = Math.ceil((this.map_width - this.view.offset_x)/this.view.scale/1.5) + 1
      let y_max = Math.ceil((this.map_height - this.view.offset_y)/this.view.scale/HEX_HEIGHT) + 1
      let x_range = [0, 0]
      let y_range = [0, 0]
      try {
        x_range = [Math.max(0, x_min), Math.min(x_max, this.map.array[0].length)]
        y_range = [Math.max(0, y_min), Math.min(y_max, this.map.array.length)]
      } catch (error) {

      }
      return({'x': x_range, 'y': y_range})
    },
    handleMapChange(data){
      this.map = data
      this.refreshMap()
    },
    handleBrushChange(data){
      this.brush = data
      this.cursor = {'function': this.paintPath, 'trigger_on_move': true, 'edits': true}
      if (this.brush['property'] == 'terrain' || this.brush['property'] == 'visibility') {
        this.cursor['function'] = this.paintHex
      } else if (this.brush['property'] == 'settlement'){
        this.cursor['function'] = this.addSettlement
        this.cursor['trigger_on_move'] = false
      }
    },
    paintPath(hex: Hex, coords: NormalCoord){
      if(hex == this.previous_hex){return}
      let movement_direction = this.movementDirection(this.previous_hex, hex);
      if (movement_direction == null){return}
      this.previous_hex[this.brush.property][movement_direction[0]] = this.brush.value
      hex[this.brush.property][movement_direction[1]] = this.brush.value
      this.refreshMap()
    },
    movementDirection(from_hex: Hex, to_hex: Hex) {
      let delta_x = to_hex.position.col - from_hex.position.col;
      let delta_y = to_hex.position.row - from_hex.position.row - (from_hex.position.col % 2);
      if (delta_x == 0){
          if (from_hex.position.row == to_hex.position.row){
              return null
          }
          if (from_hex.position.row < to_hex.position.row){
              return [3, 0]
          } else {
              return [0, 3]
          }
      }
      if (delta_x == -1 && delta_y == -1) {
          return [5, 2]
      }
      if (delta_x == 1 && delta_y == -1) {
          return [1, 4]
      }
      if (delta_x == -1 && delta_y == 0) {
          return [4, 1]
      }
      if (delta_x == 1 && delta_y == 0) {
          return [2, 5]
      }
      return null
    },
    paintHex(hex: Hex, coords: NormalCoord){
      hex[this.brush.property] = this.brush.value
      this.refreshMap()
    },
    addSettlement(hex: Hex, coords: NormalCoord){
      if(this.brush.value == 'delete'){
          hex.settlement = null
          this.refreshMap()
          return
      }
      if(hex.settlement != null){
          window.alert('A settlement already exists on this hex.')
          return
      }
      let new_name = window.prompt("What would you like to name the new settlement?")
      if(new_name == null){
          return
      }
      hex.settlement = {'name': new_name, 'type': this.brush.value}
      this.refreshMap()
    },
    moveMap(event) {
        this.clearHexCanvas()
        if (event.key == 'a') {
            this.view['offset_x'] += this.view['scale']
            this.view['offset_x'] = Math.min(this.view['scale'], this.view['offset_x'])
        } else if (event.key == 'd') {
            this.view['offset_x'] -= this.view['scale']
            this.view['offset_x'] = Math.max(-(this.view['scale'] * (1.5 * (this.map.array[0].length - 1) + 2) - this.canvas.width), this.view['offset_x'])
        } else if (event.key == 'w') {
            this.view['offset_y'] += this.view['scale']
            this.view['offset_y'] = Math.min(HEX_HEIGHT / 2 * this.view['scale'], this.view['offset_y'])
        } else if (event.key == 's') {
            this.view['offset_y'] -= this.view['scale']
            this.view['offset_y'] = Math.max(-(this.view['scale'] * HEX_HEIGHT * (this.map.array.length + 0.5) - this.canvas.height), this.view['offset_y'])
        }
    },
    zoom(event) {
      this.clearHexCanvas()
      let bounds = this.canvas.getBoundingClientRect()
      let pt = {'x': event.clientX - bounds.left, 'y': event.clientY - bounds.top}
      pt.x -= this.view['offset_x']
      pt.y -= this.view['offset_y']
      let old_scale = this.view['scale']
      if (event.deltaY > 0){
        this.view['scale'] = Math.max(10, this.view['scale']*0.8)
      } else {
        this.view['scale'] = Math.min(300, this.view['scale']*1.2)
      }

      let scaling_factor = this.view['scale']/old_scale
      if (scaling_factor == 1){
        this.refreshMap()
      }
      if (pt != null){
          this.view['offset_x'] -= pt.x * (scaling_factor-1)
          this.view['offset_y'] -= pt.y * (scaling_factor-1)
      } else {
          this.view['offset_x'] *= this.view['scale']/old_scale
          this.view['offset_y'] *= this.view['scale']/old_scale
      }
    },
    showView() {
      console.log(this.view)
    },
    downOnMap(event) {
      let coordinates = this.clickCoordinates(event)
      this.previous_hex = this.map.array[coordinates.row][coordinates.col]
    },
    upOnMap(event) {
        if (this.cursor.edits && !this.editable){return}
        let coordinates = this.clickCoordinates(event)
        let hex = this.map.array[coordinates.row][coordinates.col];
        if (hex == null){return}
        if(this.cursor.function != null){
            this.cursor.function(hex, coordinates)
        }
        this.previous_hex = null;
    },
    moveOnMap(event) {
      if(event.buttons != 1){return}
        event.preventDefault()
        if (this.cursor.edits && !this.editable){return}
        if (!this.cursor.trigger_on_move) {
            return
        }
        let coordinates = this.clickCoordinates(event)
        try {
          //This will catch a case where the user clicks on some space that isn't a hex
            let hex = this.map.array[coordinates.row][coordinates.col];
        }
        catch (error) {
            return
        }
        let hex = this.map.array[coordinates.row][coordinates.col];
        if (hex == null){return}
        if (hex == this.previous_hex){return}
        if(this.cursor.function != null){
            this.cursor.function(hex, coordinates)
        }
        this.previous_hex = hex;
    },
    clickCoordinates(event){
      let bounds = this.canvas.getBoundingClientRect()
      let pt = {'x': event.clientX - bounds.left, 'y': event.clientY - bounds.top}
      return this.pixel_to_normal(pt)
    },
    pixel_to_normal(pt: Point) {
        pt = this.standardPosition(pt)
        let q = (2 / 3 * pt.x)
        let r = (-1 / 3 * pt.x + HEX_HEIGHT / 3 * pt.y)
        return axialToNormal(axialRound({'q': q, 'r': r}), this.map.first_is_up);
    },
    standardPosition(pt: Point): Point {
        return {'x': (pt.x - this.view.offset_x) / this.view.scale, 'y': (pt.y - this.view.offset_y) / this.view.scale}
    },
    hexCenter(hex: Hex){
      let x = 3/2 * hex.position.col * this.view['scale'] + this.view['offset_x']
      let offset_down = (Boolean(hex.position.col % 2) == this.map.first_is_up)
      let y = HEX_HEIGHT * (hex.position.row + 0.5 * +offset_down) * this.view['scale'] + this.view['offset_y']
      return [x, y]
    },
    drawSVG(hex: Hex, position, image, size){
      let hexCenter = this.hexCenter(hex)
      let x = hexCenter[0]
      let y = hexCenter[1]

      let hexCoord = calcPositionInHex(position)
      x += hexCoord[0] * this.view['scale']
      y += hexCoord[1] * this.view['scale']

      x -= 0.5 * size * this.view['scale']
      y -= 0.5 * size * this.view['scale']

      this.ctx.drawImage(image, x, y, size*this.view['scale'], size*this.view['scale'])
    },
    writeText(hex: Hex, position, text, size){
      let hexCenter = this.hexCenter(hex)
      let x = hexCenter[0]
      let y = hexCenter[1]

      let hexCoord = calcPositionInHex(position)
      x += hexCoord[0] * this.view['scale']
      y += hexCoord[1] * this.view['scale']


      this.ctx.font = `${Math.floor(size*this.view['scale'])}px Arial`;
      this.ctx.fillStyle = 'black'
      const textSize = this.ctx.measureText(text)
      let width = textSize.width
      let height = textSize.actualBoundingBoxAscent + textSize.actualBoundingBoxDescent

      x -= width * 0.5
      y -= height * 0.5

      this.ctx.fillText(text, x, y)
    }
  },
  mounted() {
    this.canvas = <HTMLCanvasElement>document.getElementById('hexcanvas')
    this.ctx = this.canvas.getContext('2d')
    watch(this.view, (newVal, oldVal) => {
      this.refreshMap()
    })

    this.refreshMap()
  },
  beforeMount() {
    this.terrain_info = terrainData
    for (let k in this.terrain_info) {
      if ('textures' in this.terrain_info[k]){
        for (let texture_name of this.terrain_info[k]['textures']) {
          let new_image = new Image()
          new_image.src = 'assets/map/terrain/' + texture_name + '.svg'
          this.terrain_texture_images[texture_name] = new_image
        }
      }
    }
    console.log(this.terrain_texture_images)

    this.river_info = riversData
    this.road_info = roadsData
    this.settlement_info = settlementData
    for (let k in this.settlement_info) {
      let new_image = new Image()
      new_image.src = 'assets/map/settlements/' + this.settlement_info[k]['icon_path']
      this.settlement_info[k]['icon'] = new_image
    }
    this.wildness_info = wildnessData
  },
  computed: {
    mapLoaderComponent() {

      return import.meta.env.VITE_LOADER_TYPE === 'personal' ? 'MapLoader' : 'LocalMapLoader';
    }
  }
})
</script>

<template>
  <div>
    <component :is="mapLoaderComponent" :map="map" @mapChange="handleMapChange"></component>
  </div>
  <div>
    <MapDrawingSelection
        :terrain_info="terrain_info"
        :river_info="river_info"
        :road_info="road_info"
        :settlement_info="settlement_info"
        :wildness_info="wildness_info"
        :brush="brush"
        @brushChange="handleBrushChange"></MapDrawingSelection>
    <label class="switch is rounded">
      <input type="checkbox" v-model="editable"/>
      <span class="check is-info"></span>
      <span class="control-label">Editable</span>
    </label>
  </div>
  <div>

  </div>
  <div class="horizontal-container">
    <div class="view-selection-container">
      <ViewSelection></ViewSelection>
    </div>
    <div class="container" @keydown="moveMap" @wheel.prevent="zoom" tabindex="0" @mousedown="downOnMap" @mouseup="upOnMap" @mousemove="moveOnMap">
    <canvas id="hexcanvas" :width="this.map_width" :height="this.map_height"></canvas>
      </div>
  </div>

</template>

<style scoped>
.horizontal-container {
  display: flex;
}

.view-selection-container {
  /* Set any specific styles for the ViewSelection component here */
  margin-right: 20px; /* Adjust the margin as needed */
  width: 100px;
}
</style>