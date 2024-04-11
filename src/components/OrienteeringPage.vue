<script>
import {defineComponent} from 'vue'
import terrainData from '../assets/terrain.json';

export default defineComponent({
  name: "OrienteeringPage",
  data() {
    return {
      terrain_options: '',
      terrain: "farmland",
      weather: "other",
      weather_options: [
        {'name': 'Other', 'value': 'other', 'modifier': 0},
        {'name': 'Heavy Rain', 'value': 'heavy_rain', 'modifier': 2},
        {'name': 'Snow', 'value': 'snow', 'modifier': 2},
        {'name': 'Blizzard', 'value': 'blizzard', 'modifier': 5}
      ],
      familiarity: "unfamiliar",
      familiarity_options: [
        {'name': 'Unfamiliar', 'value': 'unfamiliar', 'modifier': 0},
        {'name': 'Passed Through Once or Twice', 'value': 'visited', 'modifier': -2},
        {'name': 'Well Explored', 'value': 'explored', 'modifier': -5},
        {'name': 'Like Your Own Backyard', 'value': 'familiar', 'modifier': -10},
      ]
    }
  },
  computed: {
    CheckDC(){
      const terrain_modifier = this.terrain_options[this.terrain]['orienteering_dc'];

      const selectedFamPick = this.familiarity_options.find(option => option.value === this.familiarity);
      let familiarity_modifier = selectedFamPick ? selectedFamPick.modifier : null;

      const selectedWeather = this.weather_options.find(option => option.value === this.weather);
      let weather_modifier = selectedWeather ? selectedWeather.modifier : null;

      return terrain_modifier + familiarity_modifier + weather_modifier;
    }
  },
  beforeMount() {
    this.terrain_options = terrainData
    console.log(this.terrain_options)
  }
})
</script>

<template>
  <hr>
  <div>
    Leaving the road carries a risk of getting lost. When traveling off road through an area they are unfamiliar with, the guiding player must make a Wisdom (Survival) check for each hour of cross-country travel. Upon failure, they wander uselessly for that hour, upon success they make one hour of progress towards their goal. Rangers in their favored terrain roll with advantage. Three successive failures results in the party ending up in an adjacent hex (whichever makes sense) if it is reasonable. The players are not explicitly told they have left their previous hex.
    <br>
    DC = {{ CheckDC }}
    <hr>
  </div>
  <div>
    <h3>Terrain</h3>
    <select v-model="terrain">
      <option v-for="(terrain_pick, terrain_id) in terrain_options" :key="terrain_id" :value="terrain_id">{{ terrain_pick.name }}</option>
    </select>
    <hr>
  </div>
  <div>
    <h3>Weather</h3>
    <select v-model="weather">
      <option v-for="weather_pick in weather_options" :key="weather_pick.value" :value="weather_pick.value">{{ weather_pick.name }}</option>
    </select>
    <hr>
  </div>
  <div>
    <h3>Familiarity</h3>
    <select v-model="familiarity">
      <option v-for="fam_pick in familiarity_options" :key="fam_pick.value" :value="fam_pick.value"> {{ fam_pick.name }}</option>
    </select>
    <hr>
  </div>
</template>

<style scoped>

</style>