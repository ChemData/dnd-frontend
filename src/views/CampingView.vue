<template>
  <div>
    <h1>Making Camp</h1>
    <hr>
    <div>
      <table class="dc-table">
        <thead>
            <tr>
                <th>Survival DC</th>
                <th>Camp Environment</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>0</td>
                <td>Inn or home at a well established settlement</td>
            </tr>
            <tr>
                <td>5</td>
                <td>Peaceful countryside with bountyful resources</td>
            </tr>
            <tr>
                <td>10</td>
                <td>Tamed wilderness, or the streets of an urban setting</td>
            </tr>
            <tr>
                <td>15</td>
                <td>Untamed wilderness of hazardous or unknown terrain</td>
            </tr>
            <tr>
                <td>20</td>
                <td>Deadly wilderness or caves infested by dangerous monsters</td>
            </tr>
            <tr>
                <td>25</td>
                <td>Utterly inhospitable wilderness untraveled by most</td>
            </tr>
            <tr>
                <td>30</td>
                <td>Alien planes of unspeakable horror</td>
            </tr>
        </tbody>
    </table>
    </div>
    <div title="What fraction of the people making camp succeed on their survival check.">
      <label>Successes:</label> &nbsp
      <select v-model="successes">
        <option value="lessThanHalf">Less than half</option>
        <option value="halfOrMore">Half or more</option>
        <option value="everyone">Everyone</option>
      </select>
    </div>
    <hr>
    <div>
      <label>Location:</label> &nbsp
      <select v-model="location">
        <option value="dangerous">Dangerous</option>
        <option value="magicalDome">Magical Dome</option>
        <option value="safe">Safe</option>
      </select>
    </div>
    <hr>
    <div>
      <label>Weather:</label> &nbsp
      <select v-model="weather">
        <option value="extreme">Extreme</option>
        <option value="bad">Bad</option>
        <option value="normal">Normal</option>
        <option value="permanentStructure">Permanent Structure</option>
      </select>
    </div>
    <hr>
    <div>
      <label>Other Conditions:</label>
      <div title="The party makes camp before twilight hours or uses an already existing camp.">
        <input type="checkbox" v-model="properCamp"> Proper Camp
      </div>
      <div title="The party sleeps with at least two guard animals or hired men on watch.">
        <input type="checkbox" v-model="guards"> Guards
      </div>
      <div title="The campsite is naturally or magically hidden from view or easy detection.">
        <input type="checkbox" v-model="hidden"> Hidden
      </div>
    </div>
    <hr>
    <div></div>
    <div class="player_section">
      <PersonalCampingEvents v-for="index in n_players" :key="index" ref="player" :party_points="partyPoints"></PersonalCampingEvents>
    </div>
    <div>
      <button @click="addPlayer">Add Player</button> &nbsp
      <button @click="removePlayer">Remove Player</button> &nbsp
      <button @click="clear">Clear</button>
    </div>
    <div>
      Credit for this rule set goes to Phixium: <a href="https://www.gmbinder.com/share/-MmKzM9-KS2KZLQBcGsZ" target="_blank">PDF</a>
    </div>
  </div>

</template>

<script>

import PersonalCampingEvents from "@/components/PersonalCampingEvents.vue";
export default {
  name: "CampingView",
  components: {
    PersonalCampingEvents
  },
  data() {
    return {
      successes: '',
      location: '',
      weather: '',
      properCamp: false,
      guards: false,
      hidden: false,
      n_players: 2
    };
  },
  methods: {
    clear(){
      this.successes = ''
      this.location = ''
      this.weather = ''
      this.properCamp = false
      this.guards = false
      this.hidden = false
      let players = this.$refs.player
      for(let i=0; i<players.length; i++){
        players[i].resetCheckboxes()
      }
    },
    addPlayer(){
      this.n_players += 1
    },
    removePlayer(){
      this.n_players -= 1
      this.n_players = Math.max(0, this.n_players)
    }

  },
  computed: {
    partyPoints(){
      let points = 0
      if (this.successes && this.successes === 'everyone'){
        points += 2
      } else if (this.successes && this.successes === 'lessThanHalf') {
        points -= 2
      }
      if (this.location && this.location === 'dangerous') {
        points -= 3
      } else if (this.location && this.location === 'safe') {
        points += 3
      }
      if (this.weather && this.weather === 'extreme') {
        points -= 2
      } else if (this.weather && this.weather === 'bad') {
        points -= 1
      } else if (this.weather && this.weather === 'permanentStructure') {
        points += 1
      }
      points += this.properCamp + this.guards + this.hidden
      return points
    }
  }

};
</script>

<style>
.player_section {
  display: flex;
  justify-content: space-between;
}
.dc-table td{
  text-align: right
}
.dc-table td:first-child {
  text-align: left
}
.dc-table th{
  text-align: right
}
.dc-table th:first-child {
  text-align: left
}

</style>
