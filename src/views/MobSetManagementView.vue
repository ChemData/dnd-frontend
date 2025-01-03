<script>
import { capitalize, defineComponent } from "vue";
import { mobDataStore } from "@/stores/mobDataStore";
import vSelect from "vue-select";
import Cross from "@/assets/icons/cross.svg";
import Edit from "@/assets/icons/pencil.svg";
import Rename from "@/assets/icons/rename.svg";
import Copy from "@/assets/icons/square-on-square.svg";
import SortUp from "@/assets/icons/caret-up.svg";
import SortDown from "@/assets/icons/caret-down.svg";
import SortBoth from "@/assets/icons/caret-both.svg";
import DeleteModal from "@/modals/DeleteModal.vue";
import TextInputModal from "@/modals/TextInputModal.vue";
import MobSetEditModal from "@/modals/MobSetEditModal.vue";

export default defineComponent({
  name: "MobSetManagementView",
  components: {
    MobSetEditModal,
    TextInputModal,
    DeleteModal,
    vSelect,
    SortUp,
    SortDown,
    SortBoth,
    Cross,
    Rename,
    Copy,
    Edit,
  },
  data() {
    return {
      mobDataStore: null,
      mobSetOptions: [],
      showDeleteModal: false,
      showRenameModal: false,
      showCopyModal: false,
      showSetEditModal: false,
      showNewSetModal: false,
      selectedSet: null,
      sortColumn: "name",
      sortDescending: false,
    };
  },
  created() {
    this.mobDataStore = mobDataStore();
    this.mobSetOptions = this.mobDataStore.mobSets;
  },
  methods: {
    capitalize,
    copySet(newName) {
      newName = newName.toLowerCase();
      let newSet = JSON.parse(JSON.stringify(this.mobDataStore.mobSets[this.selectedSet.id]));
      newSet.name = newName;
      newSet.source = "user";
      this.mobDataStore.addNewMobSet(newSet);
      this.showCopyModal = false;
      this.$toast.success(`Created a set called ${newName}`);
    },
    renameSet(newName) {
      newName = newName.toLowerCase();
      this.$toast.success(`Renamed ${this.selectedSet.name} to ${newName}`);
      this.mobDataStore.mobSets[this.selectedSet.id].name = newName;
      this.showRenameModal = false;
    },
    deleteSet(setId) {
      this.$toast.error(`Deleted ${this.mobSetOptions[setId].name}.`);
      this.mobDataStore.deleteMobSet(setId);
      this.showDeleteModal = false;
    },
    changeSort(sortColumn) {
      if (sortColumn === this.sortColumn) {
        this.sortDescending = !this.sortDescending;
        return;
      }
      this.sortColumn = sortColumn;
      this.sortDescending = true;
    },
    saveSet() {
      this.showSetEditModal = false;
    },
    newSet(setName) {
      this.showNewSetModal = false;
      let newId = this.mobDataStore.addNewMobSet({ name: setName, mobs: [], source: "user" });
      this.selectedSet = { id: newId };
      this.showSetEditModal = true;
    },
  },
  computed: {
    formattedSetOptions() {
      let formatted = Object.keys(this.mobSetOptions).map((key) => ({
        id: key,
        name: this.mobSetOptions[key].name,
        source: this.mobSetOptions[key].source,
      }));
      if (this.sortDescending) {
        return formatted.sort((a, b) => b[this.sortColumn].localeCompare(a[this.sortColumn]));
      }
      return formatted.sort((a, b) => a[this.sortColumn].localeCompare(b[this.sortColumn]));
    },
  },
});
</script>

<template>
  <div class="view-div">
    <div class="table-area">
      <table class="mob-set-table">
        <thead>
          <tr>
            <th>
              Set Name
              <button class="icon-button" @click="changeSort('name')">
                <SortBoth v-if="sortColumn !== 'name'" class="sort-icon" />
                <SortUp v-if="sortColumn === 'name' && !sortDescending" class="sort-icon" />
                <SortDown v-if="sortColumn === 'name' && sortDescending" class="sort-icon" />
              </button>
            </th>
            <th>
              Source
              <button class="icon-button" @click="changeSort('source')">
                <SortBoth v-if="sortColumn !== 'source'" class="sort-icon" />
                <SortUp v-if="sortColumn === 'source' && !sortDescending" class="sort-icon" />
                <SortDown v-if="sortColumn === 'source' && sortDescending" class="sort-icon" />
              </button>
            </th>

            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(set, index) in formattedSetOptions" :key="index">
            <td>{{ capitalize(set.name) }}</td>
            <td>{{ set.source || "N/A" }}</td>
            <td>
              <button
                class="icon-button"
                @click="
                  selectedSet = set;
                  showSetEditModal = true;
                "
                title="Edit set"
              >
                <Edit class="icon" />
              </button>
              <button
                class="icon-button"
                @click="
                  selectedSet = set;
                  showRenameModal = true;
                "
                title="Rename set"
              >
                <Rename class="icon" />
              </button>
              <button
                class="icon-button"
                @click="
                  selectedSet = set;
                  showCopyModal = true;
                "
                title="Copy set"
              >
                <Copy class="icon" />
              </button>
              <button
                class="icon-button"
                @click="
                  selectedSet = set;
                  showDeleteModal = true;
                "
                title="Delete set"
              >
                <Cross class="remove-icon" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <button class="button is-primary" @click="showNewSetModal = true">New Set</button>
    <DeleteModal
      :delete-target="selectedSet.name"
      v-if="showDeleteModal"
      @cancel="showDeleteModal = false"
      @confirm-delete="deleteSet(selectedSet.id)"
    />
    <TextInputModal
      placeholder="New name"
      question="What would you like to rename it to?"
      v-if="showRenameModal"
      @cancel="showRenameModal = false"
      @accepted="renameSet"
    />
    <TextInputModal
      placeholder="New name"
      question="What would you like to name the new set?"
      v-if="showCopyModal"
      @cancel="showCopyModal = false"
      @accepted="copySet"
    />
    <MobSetEditModal
      :mob-set-id="selectedSet.id"
      v-if="showSetEditModal"
      @cancel="showSetEditModal = false"
      @save="saveSet"
    />
    <TextInputModal
      placeholder="New name"
      question="What would you like to name the new set?"
      v-if="showNewSetModal"
      @cancel="showNewSetModal = false"
      @accepted="newSet"
    />
  </div>
</template>

<style scoped>
.mob-set-table {
  width: 100%;
  border-collapse: collapse;
}

.table-area {
  flex: 1;
  overflow-y: auto;
}

.mob-set-table th,
.mob-set-table td {
  padding: 10px;
  text-align: left;
}

.mob-set-table th {
  background-color: #f4f4f4;
  position: sticky;
  top: 0;
  z-index: 1;
}

.mob-set-table td {
  border-bottom: 1px solid #ddd;
}

.remove-icon {
  padding: 0px;
  height: 25px;
  width: 25px;
  fill: red;
}

.icon {
  padding: 0px;
  height: 20px;
  width: 20px;
  fill: black;
}

.button.is-primary {
  margin-top: 5px;
}
</style>
