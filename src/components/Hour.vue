<!-- Hour.vue -->
<template>
  <div
    :class="{ active: active }"
    class="hour"
    :style="{
      transform: `rotate(${angle}deg) translate(250px) rotate(${-angle}deg)` /* Adjust the translate value as needed */,
      backgroundColor: color,
    }"
    @click="toggleColor"
  >
    <span class="hour-text">{{ label }}</span>
  </div>
</template>

<script>
export default {
  props: {
    angle: {
      type: Number,
      required: true,
    },
    activeHour: {
      type: Number,
      required: true,
    },
    hourIndex: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      color: "brown",
    };
  },
  methods: {
    toggleColor() {
      this.color = this.color === "brown" ? "blue" : "brown";
      this.$emit("toggleColor");
    },
  },
  computed: {
    label() {
      let index = (((this.angle + 90) % 360) / 360) * 24;
      let hour = index % 12;
      if (hour === 0) {
        hour = 12;
      }
      let period = " AM";
      if (index > 11) {
        period = " PM";
      }
      return hour + period;
    },
    active() {
      if (this.hourIndex === this.activeHour) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style scoped>
.hour {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px; /* Adjust the font size as needed */
}
.active {
  border: 2px solid yellow;
}
.hour-text {
  color: white; /* Adjust text color as needed */
  font-size: 18px;
}
</style>
