<script>
import { WikiRpcClient, WikiService, DokuwikiService } from "@glen/wiki-rpc-client";
import { defineComponent } from "vue";
import names from "../assets/names.json";
import traits from "../assets/traits.json";
import misc_traits from "../assets/misc_traits.json";
import roles from "../assets/roles.json";
import locations from "../assets/locations.json";

export default defineComponent({
  name: "NPCGeneratorView",
  data() {
    return {
      first_name: "Bill",
      last_name: "Schnickler",
      short_name: "",
      names: names,
      social_role: "blacksmith",
      roles: roles,
      location: "port_hephoris",
      locations: locations,
      gender: "male",
      race: "human",
      age: "Middle-aged",
      age_options: ["Child", "Teenager", "Young Adult", "Middle-aged", "Elder"],
      notable_feature: "blind",
      features: traits,
      miscs: ["hates elves", "hates halflings"],
      misc_traits: misc_traits,
      session_number: 15,
      voiced_by: "Unspecified",
      voice_options: ["Unspecified", "Daniel", "Jessie"],
      voice_description: "",
      text_for_wiki: "",
    };
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
      return arr[random_index];
    },
    fullRandomize() {
      this.randomGender();
      this.randomRace();
      this.randomFirstName();
      this.randomLastName();
      this.randomAge();
      this.randomFeature();
      this.randomRole();
      this.randomLocation();
      for (let i = 0; i < this.miscs.length; i++) {
        this.randomMisc(i);
      }
    },
    randomFirstName() {
      this.first_name = this.randomPick(this.names[this.race]["first"][this.gender]);
      this.short_name = this.first_name;
    },
    randomLastName() {
      this.last_name = this.randomPick(this.names[this.race]["last"]);
    },
    randomRace() {
      this.race = this.randomPick(Object.keys(this.names));
    },
    randomGender() {
      this.gender = this.randomPick(["male", "female"]);
    },
    randomAge() {
      this.age = this.randomPick(this.age_options);
    },
    randomFeature() {
      this.notable_feature = this.randomPick(this.features);
    },
    randomRole() {
      this.social_role = this.randomPick(this.roles);
    },
    randomLocation() {
      this.location = this.randomPick(Object.keys(this.locations));
    },
    randomMisc(index) {
      this.miscs[index] = this.randomPick(this.misc_traits);
    },
    removeMisc(index) {
      this.miscs.splice(index, 1);
    },
    addMisc() {
      this.miscs.push("");
      this.randomMisc(this.miscs.length - 1);
    },
    async copyForWiki() {
      navigator.clipboard.writeText(this.text_for_wiki);
      window.open(`${import.meta.env.VITE_WIKI_API}?id=npc:${this.first_name}_${this.last_name}`, "_blank");
    },
  },
  created() {
    this.fullRandomize();
    this.text_for_wiki = this.wikiOutput;
  },
  watch: {
    wikiOutput(newVal) {
      this.text_for_wiki = newVal;
    },
  },
  computed: {
    wikiOutput() {
      let output = `===== ${this.first_name} ${this.last_name} =====\n\n`;
      output += `${this.short_name} is a ${this.social_role} in ${this.locations[this.location]["link"]}. \n`;
      output += "==== Summary ====\n";
      output += `  * **Description:** ${this.capitalize(this.gender)} ${this.capitalize(this.race)}, ${this.age}. ${this.capitalize(this.notable_feature)}.\n`;
      output += `  * **Role:** ${this.capitalize(this.social_role)}. \n`;
      output += `  * **Voiced By:** ${this.voiced_by} (${this.voice_description}). \n`;
      output += `  * **Miscellaneous:** \n`;
      for (let misc_fact of this.miscs) {
        if (misc_fact !== "") {
          output += `    * ${this.capitalize(misc_fact)} \n`;
        }
      }
      output += "\n";
      output += "==== Topics ====\n\n";
      output += "  * **Topic #1:** Topic of interest. \n  * **Topic #2:** Topic of interest. \n\n";
      output += "==== Party Interactions ====\n\n";
      let session_string = "0".repeat(Math.max(3 - this.session_number.toString().length, 0)) + this.session_number;
      output += `The party met ${this.short_name} on [[session:session_${session_string}|Session ${this.session_number}]]. Describe further interactions in an unordered chronological list.`;
      return output;
    },
  },
});
</script>

<template>
  <div>
    <div class="container horizontal-container">
      <div class="container horizontal-container input-and-randomize">
        <input v-model="first_name" type="text" placeholder="First Name" class="input input-area" />
        <button class="button randomize-button" @click="randomFirstName">
          <img :src="'./assets/die.svg'" class="die-icon" alt="" />
        </button>
      </div>
      <div class="container horizontal-container input-and-randomize">
        <input v-model="last_name" type="text" placeholder="Last Name" class="input input-area" />
        <button class="button randomize-button" @click="randomLastName">
          <img :src="'./assets/die.svg'" class="die-icon" alt="" />
        </button>
      </div>
      <div class="container horizontal-container input-and-randomize">
        <input v-model="short_name" type="text" placeholder="Short Name" class="input input-area" />
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
        <input v-model="notable_feature" type="text" placeholder="Notable Physical Feature" class="input input-area" />
        <button class="button randomize-button" @click="randomFeature">
          <img :src="'./assets/die.svg'" class="die-icon" alt="" />
        </button>
      </div>
      <div class="container horizontal-container input-and-randomize">
        <input v-model="social_role" type="text" placeholder="Social Role" class="input input-area" />
        <button class="button randomize-button" @click="randomRole">
          <img :src="'./assets/die.svg'" class="die-icon" alt="" />
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
      <div v-for="(_, index) in miscs" :key="index" class="container horizontal-container">
        <div class="container horizontal-container input-and-randomize">
          <input v-model="miscs[index]" type="text" class="input" />
          <button class="button randomize-button" @click="randomMisc(index)">
            <img :src="'./assets/die.svg'" class="die-icon" alt="" />
          </button>
        </div>
        <button class="button is-light is-danger remove-button" @click="removeMisc(index)">-</button>
      </div>
      <div class="right-justified-div">
        <button class="button is-small is-light is-primary remove-button" @click="addMisc">+</button>
      </div>
    </div>
    <div class="container horizontal-container">
      <label style="margin-right: 10px">Session: </label>
      <input type="number" class="input" v-model="session_number" />
    </div>
    <div class="container horizontal-container">
      <div>
        <label class="label">Voiced by: </label>
        <select v-model="voiced_by" class="select">
          <option v-for="voice in voice_options" :key="voice" :value="voice">
            {{ voice }}
          </option>
        </select>
      </div>
      <div>
        <label class="label">Voice Description</label>
        <input type="text" class="input" v-model="voice_description" />
      </div>
    </div>
    <div>
      <button class="button" @click="fullRandomize">
        <img :src="'./assets/die.svg'" class="die-icon" />
      </button>
    </div>
    <div>
      <textarea class="textarea output-box" v-model="text_for_wiki"></textarea>
    </div>
  </div>
  <div>
    <button class="button" @click="copyForWiki">Dump to Wiki</button>
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
  border-color: white;
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

.output-box {
  margin-top: 10px;
  height: auto;
}
</style>
