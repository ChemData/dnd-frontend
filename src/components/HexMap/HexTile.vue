<script>
export default {
  name: 'HexTile',
  props: {
    size: {
      type: Number,
      default: 100
    },
    color: {
      type: String,
      default: '#3498db'
    },
    pos: {
      type: Array
    }
  },
  data() {
    return {
      points: ''
    };
  },
  mounted() {
    this.calculatePoints();
  },
  methods: {
    calculatePoints() {
      const radius = this.size / 2;
      const centerX = this.pos[0];
      const centerY = this.pos[1];
      const angleStep = (2 * Math.PI) / 6;
      const pointsArray = [];

      for (let i = 0; i < 6; i++) {
        const x = centerX + radius * Math.cos(i * angleStep);
        const y = centerY + radius * Math.sin(i * angleStep);
        pointsArray.push(`${x},${y}`);
      }

      this.points = pointsArray.join(' ');
    }
  }
};
</script>

<template>
<div>
  <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
    <polygon :points="points" :fill="color" />
  </svg>
</div>
</template>

<style scoped>

</style>