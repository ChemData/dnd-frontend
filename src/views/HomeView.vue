<template>
  <div class="full-area">
    <div class="link-area">
      <h1>Useful D&D Tools</h1>
      <router-link to="/camping">Camping</router-link>
      |
      <router-link to="/orienteering">Orienteering</router-link>
      |
      <router-link to="/clock">Time Tracking</router-link>
      |
      <router-link to="/encounter-gen">Encounter Generator</router-link>
      |
      <router-link to="/npc-gen">NPC Generator</router-link>
      |
      <router-link to="/hexmap">Map Maker</router-link>
      |
      <router-link to="/mob-set-designer">Mob Set Maker</router-link>
      |
      <router-link to="/mob-meta-set-designer">Meta Mob Set Maker</router-link>
      |
      <router-link to="/dungeon-maker">Dungeon Maker</router-link>
      |
      <router-link to="/test">Test</router-link>
    </div>
    <hr>
    <div class="view-area">
      <router-view />
    </div>

  </div>
</template>

<script>
export default {
  // Component options
}
</script>

<style>
.full-area{
  height: 100vh
}

.link-area{
  margin-top: 30px;
}

.view-area{
  height: 100vh
}
</style>

