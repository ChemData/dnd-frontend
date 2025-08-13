<script>
export default {
  name: "DeleteModal",
  props: {
    deleteTarget: null,
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    confirmDelete() {
      this.$emit("confirm-delete");
    },
  },
};
</script>

<template>
  <div class="modal-overlay">
    <div class="modal">
      <p>Are you sure you want to delete {{ deleteTarget || "this item" }}?</p>
      <div>
        <button class="button is-tertiary" @click="cancel">Cancel</button>
        <button class="button is-danger" @click="confirmDelete">CONFIRM DELETE</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
