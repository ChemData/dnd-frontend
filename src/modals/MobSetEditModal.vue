<script>
import { mobDataStore } from "@/stores/mobDataStore";
import vSelect from "vue-select";
import Plus from "@/assets/icons/plus.svg";
import Cross from "@/assets/icons/cross.svg";
import { capitalize } from "vue";
import SortUp from "@/assets/icons/caret-up.svg";
import SortDown from "@/assets/icons/caret-down.svg";
import SortBoth from "@/assets/icons/caret-both.svg";
import { parseCR } from "@/utils";

export default {
  name: "MobSetEditModal",
  components: { SortBoth, SortDown, SortUp, Cross, Plus, vSelect },
  props: { mobSetId: null },
  data() {
    return {
      mobDataStore: null,
      mobs: [],
      mobOptions: [],
      changesMade: false,
      sortColumn: "mob",
      sortDescending: false,
    };
  },
  methods: {
    capitalize,
    cancel() {
      this.$emit("cancel");
    },
    addMob() {
      this.mobs.push({});
      this.changesMade = true;
    },
    removeMob(index) {
      this.mobs.splice(index, 1);
      this.changesMade = true;
      if (this.mobs.length === 0) {
        this.addMob();
      }
    },
    save() {
      let cleanMobs = [];
      for (let mob of this.mobs) {
        if (mob.statBlockId) {
          let cleanMob = { ...mob };
          if (cleanMob.reskin) {
            cleanMob.reskin = cleanMob.reskin.toLowerCase();
          }
          delete cleanMob.cr;
          delete cleanMob.name;
          cleanMobs.push(cleanMob);
        }
      }
      this.mobDataStore.mobSets[this.mobSetId].mobs = cleanMobs;
      this.$toast.success(`Saved changes to ${this.mobDataStore.mobSets[this.mobSetId].name}`);
      this.$emit("save");
    },
    changeSort(sortColumn) {
      if (sortColumn === this.sortColumn) {
        this.sortDescending = !this.sortDescending;
      } else {
        this.sortDescending = true;
      }
      this.sortColumn = sortColumn;

      this.sortMobs();
    },
    sortMobs() {
      this.mobs.forEach((mob) => (mob.cr = parseCR(this.mobDataStore.mobs[mob.statBlockId].cr)));
      this.mobs.forEach((mob) => (mob.name = this.mobDataStore.mobs[mob.statBlockId].name));
      let isNumerical = typeof this.mobs[0][this.sortColumn] === "number";
      if (this.sortDescending) {
        if (isNumerical) {
          this.mobs = this.mobs.sort((a, b) => b[this.sortColumn] - a[this.sortColumn]);
        } else {
          this.mobs = this.mobs.sort((a, b) => b[this.sortColumn].localeCompare(a[this.sortColumn]));
        }
      } else {
        if (isNumerical) {
          this.mobs = this.mobs.sort((a, b) => a[this.sortColumn] - b[this.sortColumn]);
        } else {
          this.mobs = this.mobs.sort((a, b) => a[this.sortColumn].localeCompare(b[this.sortColumn]));
        }
      }
    },
  },
  created() {
    this.mobDataStore = mobDataStore();
    this.mobOptions = this.mobDataStore.mobs;
    let mobSet = this.mobDataStore.mobSets[this.mobSetId];
    this.mobs = mobSet.mobs.map((mob) => ({ ...mob }));
    if (this.mobs.length === 0) {
      this.mobs = [{}];
    }
  },
  computed: {
    formattedMobOptions() {
      return Object.keys(this.mobOptions).map((key) => ({ id: key, name: this.mobOptions[key].name }));
    },
  },
};
</script>

<template>
  <div class="modal-overlay">
    <div class="modal">
      <div class="title-area">
        {{ capitalize(this.mobDataStore.mobSets[mobSetId].name) }}
      </div>
      <div>
        <button class="button is-secondary" :disabled="!changesMade" @click="save">Save</button>
        <button class="button is-danger-light" @click="cancel">Cancel</button>
      </div>
      <div class="table-area">
        <table class="mob-display-table">
          <thead>
            <tr>
              <th></th>
              <th>
                Stat Block
                <button class="icon-button" @click="changeSort('name')">
                  <SortBoth v-if="sortColumn !== 'name'" class="sort-icon" />
                  <SortUp v-if="sortColumn === 'name' && !sortDescending" class="sort-icon" />
                  <SortDown v-if="sortColumn === 'name' && sortDescending" class="sort-icon" />
                </button>
              </th>
              <th>
                CR
                <button class="icon-button" @click="changeSort('cr')">
                  <SortBoth v-if="sortColumn !== 'cr'" class="sort-icon" />
                  <SortUp v-if="sortColumn === 'cr' && !sortDescending" class="sort-icon" />
                  <SortDown v-if="sortColumn === 'cr' && sortDescending" class="sort-icon" />
                </button>
              </th>
              <th>Reskin</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(mob, index) in mobs" :key="index">
              <td class="button-cell">
                <button @click="removeMob(index)" class="icon-button">
                  <Cross class="remove-icon" />
                </button>
              </td>
              <td>
                <v-select
                  class="selector"
                  v-model="mobs[index].statBlockId"
                  label="name"
                  :options="formattedMobOptions"
                  :reduce="(name) => name.id"
                  @update:modelValue="changesMade = true"
                />
              </td>
              <td>
                {{ mobOptions[mob.statBlockId]?.cr || "-" }}
              </td>
              <td>
                <input v-model="mob.reskin" class="reskin-entry" type="text" @input="changesMade = true" />
              </td>
            </tr>
            <tr>
              <td class="button-cell">
                <div class="container">
                  <button @click="addMob" class="icon-button"><Plus class="add-icon" /></button>
                </div>
              </td>
              <td class="button-cell" />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title-area {
  font-size: 20px;
}
.table-area {
  flex: 1;
  overflow-y: auto;
}

.mob-display-table {
  border-collapse: collapse;
  margin: 20px 0;
  min-width: 600px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  overflow-y: auto;
  display: block;
  min-height: 300px;
}

th,
td {
  padding: 4px;
  text-align: left;
  border: 1px solid #ddd;
}

th:nth-child(1),
td:nth-child(1) {
  width: 10px;
}
th:nth-child(2),
td:nth-child(2) {
  width: 300px;
}
th:nth-child(3),
td:nth-child(3) {
  width: 60px;
}
th:nth-child(4),
td:nth-child(4) {
  width: 150px;
}

.mob-display-table thead th,
.mob-display-table thead td {
  text-align: center;
  border-style: none;
  background-color: #ffffff;
}

.v-select :deep(.vs__dropdown-toggle) {
  --vs-border-style: none;
}

.reskin-entry {
  border-style: none;
  outline: none;
  font-size: 14px;
  text-align: center;
}

.button-cell {
  border-style: none;
}

.remove-icon {
  padding: 0px;
  height: 20px;
  width: 20px;
  fill: red;
}

.add-icon {
  padding: 0px;
  height: 15px;
  width: 15px;
  fill: green;
}
</style>
