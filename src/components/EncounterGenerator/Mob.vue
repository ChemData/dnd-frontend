<script>
import {capitalize, defineComponent} from 'vue';
import { mobDataStore } from "@/stores/mobDataStore";
import {roll} from "@/utils"

export default defineComponent({
  name: "Mob",
  methods: {capitalize},
  props: {
    mob: {},
    defaultRollHp: {}
  },
  data() {
    return {
      statBlock: mobDataStore().statBlock(this.mob.statBlockId),
      rollHp: this.defaultRollHp,
      roll
    }
  }
})
</script>

<template>
  <div>
    <table class="info-table">
        <tr>
            <td class="half">{{capitalize(statBlock.name)}}</td>
            <td class="quarter">CR {{statBlock.cr}}</td>
            <td class="quarter">{{rollHp ? roll(statBlock.hp.roll) : statBlock.hp.average}} hp</td>
        </tr>
    </table>
  </div>
</template>

<style scoped>
.info-table {
  width: 300px;
}
td {
    text-align: center;
}
.half {
    width: 50%;
}
.quarter {
    width: 25%;
}
</style>