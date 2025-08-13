<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "PersonalCampingEvents",
  props: ["party_points"],
  data() {
    return {
      character_name: "Character Name",
      inspired: false,
      uninjured: false,
      defeated: false,
      satiated: false,
      hungry: false,
      on_watch: false,
      disturbed_slumber: false,
    };
  },
  methods: {
    addUninjured() {
      if (this.uninjured && this.defeated) {
        this.defeated = false;
      }
    },
    addDefeated() {
      if (this.uninjured && this.defeated) {
        this.uninjured = false;
      }
    },
    addSatiated() {
      if (this.satiated && this.hungry) {
        this.hungry = false;
      }
    },
    addHungry() {
      if (this.satiated && this.hungry) {
        this.satiated = false;
      }
    },
    resetCheckboxes() {
      this.inspired = false;
      this.uninjured = false;
      this.defeated = false;
      this.satiated = false;
      this.hungry = false;
      this.on_watch = false;
      this.disturbed_slumber = false;
    },
  },
  computed: {
    sleepQuality() {
      if (this.points >= 5) {
        return "Long Rest & Inspiration";
      } else if (this.points >= 0) {
        return "Long Rest";
      } else if (this.points >= -4) {
        return "Short Rest";
      }
      return "Short Rest & Exhaustion";
    },
    points() {
      let points = this.party_points;
      points +=
        2 * this.inspired +
        this.uninjured -
        2 * this.defeated +
        this.satiated -
        this.hungry -
        this.on_watch -
        this.disturbed_slumber;
      return points;
    },
  },
});
</script>

<template>
  <div class="player-box">
    <div>
      <input type="text" v-model="character_name" />
    </div>
    <hr />
    <div title="The character overcame a difficult challenge the previous day without suffering any major setback.">
      <input type="checkbox" v-model="inspired" /> Inspired
    </div>
    <div title="The character goes to sleep at full hit points.">
      <input type="checkbox" v-model="uninjured" id="uninjured_checkbox" @change="addUninjured" /> Uninjured
    </div>
    <div title="The character dropped to 0 hit point the previous day.">
      <input type="checkbox" v-model="defeated" id="defeated_checkbox" @change="addDefeated" /> Defeated
    </div>
    <div title="The character eats twice the amount of daily rations.">
      <input type="checkbox" v-model="satiated" id="satiated_checkbox" @change="addSatiated" /> Satiated
    </div>
    <div title="The character does not eat the required amount of daily rations.">
      <input type="checkbox" v-model="hungry" id="hungry_checkbox" @change="addHungry" /> Hungry
    </div>
    <div title="The character takes a turn watching during the long rest.">
      <input type="checkbox" v-model="on_watch" /> On Watch
    </div>
    <div title="The character' sleep is interrupted by streneous activity.">
      <input type="checkbox" v-model="disturbed_slumber" /> Disturbed Slumber
    </div>
    <hr />
    <div>{{ sleepQuality }} ({{ points }})</div>
  </div>
</template>

<style scoped>
.player-box {
  padding: 10px;
  text-align: left;
  margin-right: 20px; /* Adjust this value to increase or decrease the space between components */
}
</style>
