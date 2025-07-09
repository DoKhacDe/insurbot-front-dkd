<script setup>
import { ref } from 'vue';
import ChatApp from "@/components/ChatApp.vue";
import { bgImageBase64 } from '@/assets/images';
import { insurbotLogo } from '@/assets/insurbot-logo';

const showIntro = ref(true);
const chatAppRef = ref(null);

function hideIntro() {
  showIntro.value = false;
}

function reloadChat() {
  chatAppRef.value?.reloadChat();
}

</script>

<template>
  <!-- Intro splash animation -->
  <div v-if="showIntro"
       class="fixed top-0 left-0 w-full h-screen bg-gradient-to-r from-secondary/30 to-primary/30 z-[9999] flex items-center justify-center">
    <img
        :src="bgImageBase64"
        alt="Intro Logo"
        class="w-64 h-64 intro-animation"
        @animationend="hideIntro"
    />
  </div>

  <!-- Main chat layout (có hiệu ứng mờ dần) -->
  <div :class="[
         'bg-gradient-to-r from-secondary/30 to-primary/30 w-full min-h-screen relative overflow-hidden transition-opacity duration-[2500ms]',
         showIntro ? 'opacity-0 pointer-events-none' : 'opacity-100'
       ]">

    <!-- Top bar -->
    <div class="bg-gradient-to-r opacity-1 from-secondary/50 to-primary fixed top-0 px-5 py-3 shadow-lg flex items-center justify-between z-100 w-full">
      <div class="w-6 h-6"></div>

      <a href="/" class="absolute left-1/2 -translate-x-1/2 flex items-center space-x-3">
        <img :src="insurbotLogo" alt="logo" class="w-12 h-12" />
        <span class="text-2xl font-extrabold tracking-wider text-purple-100 drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
          INSURBOT
        </span>
      </a>

      <div class="z-10">
        <button @click.prevent="reloadChat"
                class="text-white hover:text-gray-200 hover:scale-110 transition-all duration-200 text-2xl font-bold">
          ↻
        </button>
      </div>
    </div>

    <!-- Chat content -->
    <div class="w-full h-full flex justify-center">
      <div class="w-full h-[calc(100vh-60px)] mt-5">
        <ChatApp ref="chatAppRef" />
      </div>
    </div>
  </div>
</template>


<style scoped>
/* Logo bounce + fade out */
@keyframes bounceFade {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  30% {
    transform: translateY(-30px) scale(1.1);
  }
  60% {
    transform: translateY(0) scale(0.95);
  }
  90% {
    transform: translateY(-15px) scale(1.02);
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }
}

.intro-animation {
  animation: bounceFade 2s ease-in-out forwards;
}

/* Default styles */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#button-email-small {
  font-size: 10px;
  line-height: 1rem;
}
</style>
