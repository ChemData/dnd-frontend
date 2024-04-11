<script>
import {defineComponent} from 'vue'
import names from '../assets/names.json';
import traits from '../assets/traits.json';
import misc_traits from '../assets/misc_traits.json';
import roles from '../assets/roles.json';
import locations from '../assets/locations.json';

export default defineComponent({
  name: "NPCGenerator",
  data() {
    return {
      first_name: 'Bill',
      last_name: 'Schnickler',
      short_name: '',
      names: names,
      social_role: 'blacksmith',
      roles: roles,
      location: 'port_hephoris',
      locations: locations,
      gender: 'male',
      race: 'human',
      age: 'Middle-aged',
      age_options: ['Child', 'Teenager', 'Young Adult', 'Middle-aged', 'Elder'],
      notable_feature: 'blind',
      features: traits,
      miscs: ["hates elves", "hates halflings"],
      misc_traits: misc_traits
    }
  },
  methods: {
    capitalize(str) {
      if (str.length === 0) {
        return str; // return empty string if input is empty
      } else if (str.length === 1) {
        return str.toUpperCase(); // capitalize single character string
      } else {
        return str.charAt(0).toUpperCase() + str.slice(1); // capitalize first character
      }
    },
    randomPick(arr) {
      let random_index = Math.floor(Math.random() * arr.length);
      return arr[random_index]
    },
    fullRandomize(){
      this.randomGender()
      this.randomRace()
      this.randomFirstName()
      this.randomLastName()
      this.randomAge()
      this.randomFeature()
      this.randomRole()
      this.randomLocation()
      for (let i=0; i<this.miscs.length; i++){
        this.randomMisc(i)
      }
    },
    randomFirstName(){
      this.first_name = this.randomPick(this.names[this.race]['first'][this.gender])
      this.short_name = this.first_name
    },
    randomLastName(){
      this.last_name = this.randomPick(this.names[this.race]['last'])
    },
    randomRace(){
      this.race = this.randomPick(Object.keys(this.names))
    },
    randomGender(){
      this.gender = this.randomPick(['male', 'female'])
    },
    randomAge(){
      this.age = this.randomPick(this.age_options)
    },
    randomFeature(){
      this.notable_feature = this.randomPick(this.features)
    },
    randomRole(){
      this.social_role = this.randomPick(this.roles)
    },
    randomLocation(){
      this.location = this.randomPick(Object.keys(this.locations))
    },
    randomMisc(index){
      this.miscs[index] = this.randomPick(this.misc_traits)
    },
    removeMisc(index){
      this.miscs.splice(index, 1)
    },
    addMisc(){
      this.miscs.push('')
      this.randomMisc(this.miscs.length-1)
    },
    copyForWiki(){
      let output = `===== ${this.first_name} ${this.last_name} =====\n\n`
      output += `${this.short_name} is a ${this.social_role} in ${this.locations[this.location]["link"]}. \n`
      output += "==== Summary ====\n"
      output += `  * **Description:** ${this.capitalize(this.gender)} ${this.capitalize(this.race)}, ${this.age}. ${this.capitalize(this.notable_feature)}.\n`
      output += `  * **Role:** ${this.capitalize(this.social_role)}. \n`
      output += `  * **Miscellaneous:** \n`
      for (let misc_fact of this.miscs){
        if (misc_fact !== ''){
          output += `    * ${this.capitalize(misc_fact)} \n`
        }
      }
      output += '\n'
      output += "==== Topics ====\n\n"
      output += "  * **Topic #1:** Topic of interest. \n  * **Topic #2:** Topic of interest. \n\n"
      output += "==== Party Interactions ====\n\n"
      output += "The party met (Insert NPC name here) on (Insert session number here). Describe further interactions in an unordered chronological list."
      console.log(output)
      navigator.clipboard.writeText(output)
    }
  },
  created(){
    this.fullRandomize()
  }
})
</script>

<template>
  <div>
    <div class="container horizontal-container">
      <div class="container horizontal-container input-and-randomize">
        <input v-model="first_name" type="text" placeholder="First Name" class="input input-area">
        <button class="button randomize-button" @click="randomFirstName">
          <img :src="'./assets/die.svg'"  class="die-icon" alt=""/>
        </button>
      </div>
      <div class="container horizontal-container input-and-randomize">
        <input v-model="last_name" type="text" placeholder="Last Name" class="input input-area">
        <button class="button randomize-button" @click="randomLastName">
          <img :src="'./assets/die.svg'"  class="die-icon" alt=""/>
        </button>
      </div>
      <div class="container horizontal-container input-and-randomize">
        <input v-model="short_name" type="text" placeholder="Short Name" class="input input-area">
      </div>
    </div>
    <div class="container horizontal-container">
      <select v-model="gender" class="select">
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="nb">Non-binary</option>
        <option value="na">Ungendered</option>
      </select>
      <select v-model="race" class="select">
        <option v-for="(_, race_option) in names" :key="race_option" :value="race_option">
          {{ capitalize(race_option) }}
        </option>
      </select>
      <select v-model="age" class="select">
        <option v-for="age_option in age_options" :key="age_option" :value="age_option">
          {{ age_option }}
        </option>
      </select>
    </div>
    <div class="container horizontal-container">
      <div class="container horizontal-container input-and-randomize">
        <input v-model="notable_feature" type="text" placeholder="Notable Physical Feature" class="input input-area">
        <button class="button randomize-button" @click="randomFeature">
          <img :src="'./assets/die.svg'"  class="die-icon" alt=""/>
        </button>
      </div>
      <div class="container horizontal-container input-and-randomize">
        <input v-model="social_role" type="text" placeholder="Social Role" class="input input-area">
        <button class="button randomize-button" @click="randomRole">
          <img :src="'./assets/die.svg'"  class="die-icon" alt=""/>
        </button>
      </div>
      <select v-model="location" class="select">
        <option v-for="(location_option, location_id) in locations" :key="location_id" :value="location_id">
          {{ location_option["name"] }}
        </option>
      </select>
    </div>
    <div>
      Assorted personality traits, interesting backstory events, objects owned, etc.
      <div v-for="(_, index) in miscs" :key="index"  class="container horizontal-container">
        <div class="container horizontal-container input-and-randomize">
          <input v-model="miscs[index]" type="text" class="input">
          <button class="button randomize-button" @click="randomMisc(index)">
            <img :src="'./assets/die.svg'"  class="die-icon" alt=""/>
          </button>
        </div>
        <button class="button is-light is-danger remove-button" @click="removeMisc(index)">-</button>
      </div>
      <div class="right-justified-div">
        <button class="button is-small is-light is-primary remove-button" @click="addMisc">+</button>
      </div>
    </div>
    <div>
      <button class="button" @click="fullRandomize">
        <img :src="'./assets/die.svg'"  class="die-icon"/>
      </button>
      <button class="button" @click="copyForWiki">Dump for Wiki</button>
    </div>
  </div>
</template>

<style scoped>
.horizontal-container {
  display: flex;
  flex-direction: row;
}
.remove-button {
  height: 24px;
  width: 24px;
  margin-top: 8px;
  margin-left: 6px;
  padding: 0 0 2px;

}

.die-icon {
  height: 30px;
  width: 30px;
}

.input-and-randomize {
  background-color: white;
  margin-right: 8px;
}

.input-area {
  border-color: white
}

.randomize-button {
  border-color: white;
  width: 30px;
  height: 30px;
  padding: 0 0 0;
}

.right-justified-div {
  display: flex;
  flex-direction: row-reverse;
}

</style>