<!-- Day.vue -->
<template>
  <div class="circle-container">
    <div class="circle">
      <Hour
        v-for="index in n_hours"
        :key="index"
        :angle="index * (360 / n_hours)"
        :hourIndex="index - 1"
        ref="hour"
        :activeHour="currentHour"
      />
      <button @click="advanceHour">+Hour</button>
      <button @click="retreatHour">-Hour</button>
    </div>
  </div>
  <hr />
  <div class="table-container">
    <table class="dc-table">
      <thead>
        <tr>
          <th>Activity</th>
          <th>Time (hr)</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>4 Miles Fast Pace</td>
          <td>1</td>
          <td>-5 penalty to passive Perception</td>
        </tr>
        <tr>
          <td>2 Mile Fast Pace (Difficult Terrain)</td>
          <td>1</td>
          <td>-5 penalty to passive Perception</td>
        </tr>
        <tr>
          <td>3 Miles Normal Pace</td>
          <td>1</td>
          <td></td>
        </tr>
        <tr>
          <td>1.5 Miles Normal Pace (Difficult Terrain)</td>
          <td>1</td>
          <td></td>
        </tr>
        <tr>
          <td>2 Miles Slow Pace</td>
          <td>1</td>
          <td>Able to use stealth</td>
        </tr>
        <tr>
          <td>1 Mile Slow Pace (Difficult Terrain)</td>
          <td>1</td>
          <td>Able to use stealth</td>
        </tr>
        <tr>
          <td>Short Rest</td>
          <td>1</td>
        </tr>
        <tr>
          <td>Long Rest</td>
          <td>8</td>
        </tr>
        <tr>
          <td>Visiting a shop</td>
          <td>0.5</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Hour from "./Hour.vue";

export default {
  components: {
    Hour,
  },
  data() {
    return {
      n_hours: 24,
      currentHour: 0,
    };
  },
  methods: {
    advanceHour() {
      this.currentHour = (this.currentHour + 1) % this.n_hours;
    },
    retreatHour() {
      this.currentHour = (this.currentHour - 1 + this.n_hours) % this.n_hours;
    },
  },
};
</script>

<style scoped>
.day-container {
  display: flex;
}

.circle-container {
  position: relative; /* Needed for absolute positioning of Hour components */
  margin-left: 300px;
  margin-top: 200px;
}

.table-container {
  margin-top: 250px; /* Adjust the margin as needed for spacing between the circle and the table */
}
</style>
