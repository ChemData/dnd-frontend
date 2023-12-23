<!-- ClockApp.vue -->
<template>
  <div>
    <div class="clock-container">
      <h1>{{ currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</h1>
      <img :src="`./assets/${timeImage}`" alt="Time Image" class="time-image" />
    </div>
    <div>
      <button @click="changeTime(1, 0)">Short Rest</button>
      <button @click="changeTime(8, 0)">Long Rest</button>
    </div>
    <div>
      <select id="paceDropdown" v-model="pace">
        <option value="4">Fast Pace</option>
        <option value="3">Normal Pace</option>
        <option value="2">Slow Pace</option>
      </select>
      &nbsp
      <label for="difficult_terrain_checkbox">Difficult Terrain?</label> &nbsp
      <input type="checkbox" v-model="difficult_terrain" id="difficult_terrain_checkbox">&nbsp
      <button @click="travel(1)">Travel 1 Mile</button>
      <button @click="travel(6)">Travel 6 Miles</button>
    </div>
    <div>
      <button @click="changeTime(0, 15)">Visit Shop</button>
    </div>
    <div>
      Add:
      <button @click="changeTime(0, 5)">5 Minutes</button>
      <button @click="changeTime(0, 15)">15 Minutes</button>
      <button @click="changeTime(1, 0)">1 Hour</button>
      <button @click="changeTime(6, 0)">6 Hours</button>
      <button @click="changeTime(24, 0)">24 Hours</button>
    </div>
    <div>
      Remove:
      <button @click="changeTime(0, -5)">5 Minutes</button>
      <button @click="changeTime(0, -15)">15 Minutes</button>
      <button @click="changeTime(-1, 0)">1 Hour</button>
      <button @click="changeTime(-6, 0)">6 Hours</button>
      <button @click="changeTime(-24, 0)">24 Hours</button>
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
    }

  },
  computed: {
    timeImage() {
      const hour = this.currentTime.getHours();
      return hour >= 6 && hour < 18 ? 'sun.png' : 'moon.png';
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
</style>
