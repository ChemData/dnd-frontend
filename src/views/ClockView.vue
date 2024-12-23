<!-- ClockApp.vue -->
<template>
  <div>
    <div class="clock-container">
      <h1>{{ currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</h1>
      <img :src="`./assets/${timeImage}`" alt="Time Image" class="time-image">
    </div>
    <hr>
    <div>
      <button class="button is-small" @click="changeTime(1, 0)">Short Rest</button>
      <button class="button is-small" @click="changeTime(8, 0)">Long Rest</button>
    </div>
    <hr>
    <div>
      <div>
        <select id="paceDropdown" v-model="pace" class="select">
          <option value="4">Fast Pace</option>
          <option value="3">Normal Pace</option>
          <option value="2">Slow Pace</option>
        </select>
        <label for="difficult_terrain_checkbox">Difficult Terrain?</label>
        <input id="difficult_terrain_checkbox" v-model="difficult_terrain" type="checkbox" class="checkbox">
      </div>
      <div>
        <button class="button is-small" @click="travel(1)">Travel 1 Mile</button>
        <button class="button is-small" @click="travel(6)">Travel 6 Miles</button>
        <button class="button is-small" @click="changeTime(1, 0)">Travel 1 Hour ({{ distanceTraveled(1) }} miles)</button>
        <button class="button is-small" @click="changeTime(4, 0)">Travel 4 Hours ({{ distanceTraveled(4) }} miles)</button>
      </div>
    </div>
    <hr>
    <div>
      <button class="button is-small" @click="changeTime(0, 15)">Visit Shop</button>
    </div>
    <hr>
    <div>
      <table>
        <tr>
          <td colspan="6">Add:</td>
        </tr>
        <tr>
          <td><button class="button is-small" @click="changeTime(0, 5)">5 Minutes</button></td>
          <td><button class="button is-small" @click="changeTime(0, 15)">15 Minutes</button></td>
          <td><button class="button is-small" @click="changeTime(1, 0)">1 Hour</button></td>
          <td><button class="button is-small" @click="changeTime(6, 0)">6 Hours</button></td>
          <td><button class="button is-small" @click="changeTime(24, 0)">24 Hours</button></td>
          <td />
        </tr>
        <tr>
          <td colspan="6">Remove:</td>
        </tr>
        <tr>
          <td><button class="button is-small" @click="changeTime(0, -5)">5 Minutes</button></td>
          <td><button class="button is-small" @click="changeTime(0, -15)">15 Minutes</button></td>
          <td><button class="button is-small" @click="changeTime(-1, 0)">1 Hour</button></td>
          <td><button class="button is-small" @click="changeTime(-6, 0)">6 Hours</button></td>
          <td><button class="button is-small" @click="changeTime(-24, 0)">24 Hours</button></td>
          <td />
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentTime: new Date(0, 0, 0, 12, 0), // Default to 12 PM
      pace: 3,
      difficult_terrain: false
    };
  },
  computed: {
    timeImage() {
      const hour = this.currentTime.getHours();
      return hour >= 6 && hour < 18 ? 'sun.png' : 'moon.png';
    }
  },
  methods: {
    changeTime(hours, minutes) {
      const newTime = new Date(this.currentTime)
      newTime.setHours(newTime.getHours() + hours)
      newTime.setMinutes(newTime.getMinutes() + minutes)
      this.currentTime = newTime;
      console.log(this.currentTime)
    },
    travel(distance) {
      let hours = distance/parseInt(this.pace)*(1+this.difficult_terrain);
      let minutes = Math.round(hours * 60)
      this.changeTime(0, minutes)
    },
    distanceTraveled(hours) {
      return hours * this.pace / (1+this.difficult_terrain)
    }

  }
};
</script>

<style>
.clock-container {
  display: flex;
  align-items: center;
}

.time-image {
  margin-left: 10px; /* Adjust the margin as needed */
}

.button {
  margin-right: 6px;
}
.select {
  margin-right: 6px;
}
</style>
