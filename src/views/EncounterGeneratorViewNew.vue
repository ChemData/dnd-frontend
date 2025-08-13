<script>
import { capitalize, defineComponent } from "vue";
import vSelect from "vue-select";
import { mobDataStore } from "@/stores/mobDataStore";
import { partyDataStore } from "@/stores/partyStore";
import { singleEncounter } from "@/generation";
import Mob from "@/components/EncounterGenerator/Mob.vue";

export default defineComponent({
  name: "EncounterGeneratorView",
  components: { Mob: Mob, vSelect },
  data() {
    return {
      mobData: mobDataStore(),
      partyData: partyDataStore(),
      primaryEnemy: Object.keys(this.mobData.mobSets)[0]||null,
      maxEnemies: "6",
      maxEnemyOptions: Array.from({length: 10}, (_, x) => (x+1).toString()).concat(["No Limit"]),
      minCr: "0",
      crOptions: ["0", "1/8", "1/4", "1/2"].concat(Array.from({ length: 20 }, (_, x) => (x + 1).toString())),
      rollHp: true,
      difficulty: "easy",
      difficulty_options: ['easy', 'medium', 'hard', 'deadly', 'wildness'],
      currentEncounter: null,
      combatEncounter: null,
      mobKeyOffset: 0,

    };
  },
  methods: {
    capitalize,
    generateBattle() {
      this.mobKeyOffset += this.combatEncounter?.group?.mobs?.length ?? 0;
      let mobSets = [this.mobData.mobSets[this.primaryEnemy]];
      let partyLevels = this.partyData.partyLevels
      try {
        this.combatEncounter = singleEncounter(
          this.difficulty,
          partyLevels,
          mobSets,
          this.maxEnemies,
          this.minCr,
        );
        this.currentEncounter = "combat";
      } catch (e) {
        this.$toast.error("Could not find a valid battle - try loosening restrictions or increasing difficulty.");
      }
    },
  },
  computed: {
    mobSetOptions() {
      return Object.keys(this.mobData.mobSets).map((key) => ({
        id: key,
        name: this.mobData.mobSets[key].name,
      }));
    },
  },
});
</script>

<template>
  <hr />
  <div id="inputs">
    <div id="enemies">
      <div>
        <label>Maximum Enemies</label>
        <v-select
          class="selector"
          v-model="maxEnemies"
          :options="maxEnemyOptions"

        />
        <select id="max_enemy_select" v-model="maxEnemies">
          <option v-for="number in 10" :key="number" :value="number">
            {{ number }}
          </option>
          <option value="">No Limit</option>
        </select>
      </div>
      <div>
        <label>Minimum CR</label>
        <select id="min_cr_select" v-model="minCr">
          <option v-for="cr in crOptions" :key="cr" :value="cr">
            {{ cr }}
          </option>
        </select>
      </div>
      <div class="horiz-container">
        <label>Primary Enemy</label>
        <v-select
          class="selector"
          v-model="primaryEnemy"
          label="name"
          :options="mobSetOptions"
          :reduce="(name) => name.id"
        />
      </div>
      <div>
        <label for="roll_hp_checkbox">Roll HP?</label>
        <input id="roll_hp_checkbox" v-model="rollHp" type="checkbox" />
      </div>
      <hr />
    </div>
    <div class="gen-buttons">
      <div class="horiz-container">
        <label for="difficulty_select">Difficulty</label>
        <select id="difficulty_select" v-model="difficulty">
          <option v-for="diff in difficulty_options" :key="diff.value" :value="diff.value">
            {{ diff.name }}
          </option>
        </select>
      </div>
      <button class="button is-primary" @click="generateBattle">Generate Battle</button>

    </div>
  </div>
  <div id="encounter" v-if="currentEncounter === 'combat'">
    <div class="section-title">
      {{ `${capitalize(this.combatEncounter.difficulty)}  ${capitalize(this.combatEncounter.enemyType)}` }}
    </div>
    <div>
      <Mob
        v-for="(mob, index) in combatEncounter.group.mobs"
        :key="index + mobKeyOffset"
        :mob="mob"
        :default-roll-hp="rollHp"
      />
    </div>
  </div>
  <br />
</template>

<style scoped>
label {
  margin-right: 6px;
}
.section-title {
  font-size: 20px;
}

.gen-buttons {
  display: flex;
  flex-direction: column;
}

.horiz-container {
  display: flex;
  flex-direction: row;
}
</style>
