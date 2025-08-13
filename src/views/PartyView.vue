<script>
import {capitalize} from "vue";
import Cross from "@/assets/icons/cross.svg"
import Add from "@/assets/icons/plus.svg"
import { partyDataStore } from "@/stores/partyStore";
import DeleteModal from "@/modals/DeleteModal.vue";
export default {
  name: "PartyView",
  components: {DeleteModal, Cross, Add},
  data() {
    return {
      partyData: partyDataStore().party,
      showDeleteModal: false,
      selectedPlayer: null
    }
  },
  methods: {
    capitalize,
    addPartyMember(){
      this.partyData.push({name: 'The New Guy', level: 1})
    },
    deleteMember(){
      this.showDeleteModal = false
      let deletedName = this.partyData[this.selectedPlayer].name
      this.partyData.splice(this.selectedPlayer, 1)
      this.$toast.success(`Deleted ${capitalize(deletedName)}`)

    }
  },

}
</script>

<template>
<div class="view-div">
  <div class="card-container">
    <div class="card" v-for="(player, index) in partyData" :key="index">
      <div class="name-area">
        <input type="text" class="text-input" v-model="partyData[index].name"/>
        <button class="icon-button" @click="showDeleteModal=true; selectedPlayer=index">
          <Cross class="remove-icon"/>
        </button>
      </div>
      <div class="stat-area">
        <div class="level-area">
          <label for="level">Level</label>
          <input type="number" class="text-input" v-model="partyData[index].level" id="level">
        </div>
      <input type="text" class="text-input" v-model="partyData[index].race" placeholder="race">
      <input type="text" class="text-input" v-model="partyData[index].class" placeholder="class">
      </div>
    </div>
    <div class="card add-card">
      <button class="icon-button" @click="addPartyMember">
        <Add class="add-icon"/>
      </button>
    </div>
  </div>
  <DeleteModal
    :delete-target="capitalize(partyData[selectedPlayer].name)"
    v-if="showDeleteModal"
    @cancel="showDeleteModal=false"
    @confirm-delete="deleteMember"
  />
</div>
</template>

<style scoped>
.card-container {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* Responsive columns */
}

.card {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
}

.name-area {
  display:flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.stat-area {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.level-area{
  display: flex;
  flex-direction: row;
  align-items: center;
}

.remove-icon {
  padding: 0px;
  height: 30px;
  width: 30px;
  fill: red;
}

.add-card {
  display:flex;
  flex-direction: column;
  align-items: center;
}

.add-icon {
  padding: 0px;
  height: 50px;
  width: 50px;
  fill: #05af19;
}
</style>