<script>
import {capitalize} from "vue";

export default {
  name: "TextInputModal",
  props: {
    question: '',
    default: '',
    placeholder: ''
  },
  data() {
    return {
      inputText: this.default
    }
  },
  methods: {
    capitalize,
    cancel() {
      this.$emit('cancel');
    },
    enter() {
      this.$emit('accepted', this.inputText);
    }
  }
};
</script>

<template>
  <div class="modal-overlay">
    <div class="modal">
      <p>{{ capitalize(question) }}</p>
      <div class="container">
        <input type="text" class="modal-input" :placeholder="placeholder" v-model="inputText"/>
        <div class="button-area">
          <button :disabled="!inputText" class="button is-secondary" @click="enter">ENTER</button>
          <button class="button is-tertiary" @click="cancel">CANCEL</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>



.button-area {
  padding: 8px;
}

</style>