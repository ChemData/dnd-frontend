<template>
  <div>
    <h1>Useful D&D Tools</h1>
    <router-link to="/camping">Camping</router-link>
    |
    <router-link to="/orienteering">Orienteering</router-link>
    |
    <router-link to="/clock">Time Tracking</router-link>
    |
    <router-link to="encounter_gen">Encounter Generator</router-link>
    |
    <router-link to="npc_gen">NPC Generator</router-link>
    |
    <router-link to="hexmap">Map Maker</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  // Component options
}
</script>
