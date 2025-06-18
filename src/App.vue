<script setup>
import { ref } from 'vue';
import ChatApp from "@/components/ChatApp.vue";
import insurbotLogo from '@/assets/imgs/logo.png';
import {bgImageBase64} from '@/assets/images';

const showModal = ref(false);

const toggleModal = () => {
  showModal.value = !showModal.value;
};

const handleClose = () => {
  showModal.value = false;
};
</script>

<template>
  <button
      id="button-email-small"
      @click="toggleModal"
      :class="['chat-button', showModal ? 'button-hidden' : 'button-visible']"
  >
    <img :src="bgImageBase64" alt="logo" class="button-image"/>
  </button>

  <div
      :class="['chat-modal', showModal ? 'modal-visible' : 'modal-hidden']"
  >
    <ChatApp v-if="showModal" @close="handleClose" />
  </div>
</template>

<style scoped>
.chat-button {
  position: fixed;
  bottom: 3.5rem;
  right: 0.5rem;
  z-index: 50;
  padding: 0.5rem;
  font-weight: bold;
  cursor: pointer;
  width: 100px;
  height: 100px;
  border-radius: 9999px;
  transition: all 500ms ease-in-out;
}

.button-hidden {
  transform: translateY(5rem);
  opacity: 0;
}

.button-visible {
  transform: translateY(0);
  opacity: 1;
}

.button-image {
  width: 100%;
}

.chat-modal {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  z-index: 50;
  transition: all 500ms ease-in-out;
  overflow: hidden;
}

.modal-visible {
  transform: translateY(0);
  opacity: 1;
}

.modal-hidden {
  transform: translateY(100%);
  opacity: 0;
}

#button-email-small {
  font-size: 10px;
  line-height: 1rem;
}
</style>