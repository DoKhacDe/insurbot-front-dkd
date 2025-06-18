<template>
  <div class="relative">
    <div class="max-w-lg mt-10 md:fixed md:right-5 right-1 mx-2 bottom-[100px]">
      <!-- Header -->
      <div
          class="bg-gradient-to-r from-secondary/50 to-primary/100 rounded-t-xl px-3 py-2 flex justify-between items-center shadow-lg">
        <div class="text-white text-xl font-extrabold tracking-wide flex justify-center items-center">
          <img :src="insurbotLogo" alt="logo" class="w-[30px] mr-2"/>
          INSURBOT
        </div>
        <div class="flex gap-2">
          <button @click.prevent="reloadChat"
                  class="text-white hover:text-gray-200 hover:scale-110 transition-all duration-200 text-2xl font-bold">
            ↻
          </button>
          <button @click.prevent="closePopup"
                  class="text-white hover:text-gray-200 hover:scale-110 transition-all duration-200 text-3xl font-bold">
            –
          </button>
        </div>
      </div>

      <!-- Chat Container -->
      <div id="chat-container"
           class="max-w-2xl w-full h-[550px] bg-white rounded-b-xl flex flex-col px-4 pb-2 md:min-w-[450px] border border-gray-200">
        <!-- Start Chat Screen -->
        <div v-if="!chatStarted" class="flex-1 flex items-center justify-center">
          <button
              @click="startChat"
              class="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
          >
            Bắt đầu đoạn chat
          </button>
        </div>

        <!-- Chat Interface -->
        <div v-else class="flex flex-col h-full">
          <!-- Chat box -->
          <div ref="chatBox" class="flex-1 overflow-y-auto space-y-2 pr-2 chat-scrollbar pb-3">
            <div
                v-for="(msg, idx) in messages"
                :key="idx"
                :class="[
              'flex',
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            ]"
            >
              <div
                  :class="[
                'px-4 py-3 rounded-xl break-words mt-3',
                msg.sender === 'user'
                  ? 'bg-primary text-white max-w-xs ml-5'
                  : 'bg-gradient-to-r from-secondary/10 to-primary/10 text-gray-700 max-w-sm mr-5'
              ]"
              >
                <div>
                  <!-- Sender name -->
                  <div
                      v-if="msg.sender === 'bot'"
                      class="text-primary text-left text-sm font-bold mb-1 flex items-center"
                  >
                    <img :src="insurbotLogo" alt="logo" class="w-[20px] inline mr-1" v-if="msg.sender === 'bot'"/>
                    Insurbot
                  </div>

                  <!-- Message content -->
                  <div
                      v-html="renderMarkdown(msg.text)"
                      class="prose prose-sm max-w-none leading-snug space-y-2"
                      style="word-break: break-word;"
                      :class="msg.sender === 'user' ? 'text-white' : 'text-gray-700'"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Loading indicator -->
            <div v-if="loading" class="text-gray-500 italic text-sm pl-2">
              <img :src="insurbotLogo" alt="logo" class="w-[20px] mr-2"/>
              <span class="typing-dots">Insurbot đang phân tích<span class="dot-1">.</span><span
                  class="dot-2">.</span><span class="dot-3">.</span></span>
            </div>
          </div>

          <!-- Input -->
          <div
              class="relative border rounded-xl border-gray-300 focus-within:outline-none focus-within:ring-primary/50 focus-within:ring bg-transparent text-gray-800 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
           <textarea
               id="input-insurbot"
               ref="textareaRef"
               aria-label="Nhập nội dung"
               dir="auto"
               :disabled="disable"
               maxlength="200"
               v-model="message"
               @input="autoResize"
               @keyup="handleKeyUp"
               placeholder="Insurbot có thể giúp gì cho bạn?"
               class="w-full px-3 text-fg-primary rounded-xl min-h-14 pt-3
                     border-0 focus:border-0
                     outline-none focus:outline-none
                     ring-0 focus:ring-0
                     resize-none overflow-y-hidden
              "
               style="resize: none; overflow-y: hidden; height: 44px !important; max-height: 120px; border: 0!important;"
           ></textarea>
            <div
                class="flex justify-between items-center p-2"
                @click="focusTextarea"
            >
              <div>
                <Listbox as="div" v-model="selected" :disabled="disable">
                  <div class="relative">
                    <ListboxButton
                        class="disabled:opacity-50 isabled:cursor-not-allowed max-w-[250px] w-full cursor-pointer rounded-2xl border border-primary bg-transparent py-2 pl-3 pr-10 text-left text-sm text-primary shadow-sm focus:outline-none relative"
                    >
                      {{ selected.name }}
                      <span
                          v-if="selected.handle === ''"
                          class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
                      >
                        <ChevronUpDownIcon class="h-4 w-4 text-primary" />
                      </span>
                      <button
                          :disabled="disable"
                          v-else
                          class="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
                          @click.stop="clearSelection"
                      >
                        <XMarkIcon class="h-4 w-4 text-primary" />
                      </button>
                    </ListboxButton>
                    <Transition
                        enter-active-class="transition ease-out duration-200"
                        enter-from-class="opacity-0 translate-y-1"
                        enter-to-class="opacity-100 translate-y-0"
                        leave-active-class="transition ease-in duration-200"
                        leave-from-class="opacity-100 translate-y-0"
                        leave-to-class="opacity-0 translate-y-1"
                    >
                      <ListboxOptions
                          class="absolute mb-2 bottom-full z-10 mt-1 min-w-[250px] max-h-[300px] max-w-[300px] w-full
                          rounded-lg border border-primary bg-white text-sm text-primary shadow-lg p-0"
                      >
                        <!-- Scrollable inner container -->
                        <div
                            class="max-h-[280px] overflow-y-auto rounded-2xl px-1 py-1
                            scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent"
                        >
                          <ListboxOption
                              v-for="option in options"
                              :key="option.handle"
                              :value="option"
                              class="cursor-pointer select-none px-4 py-2 hover:bg-primary hover:text-white"
                          >
                            {{ option.name }}
                          </ListboxOption>
                        </div>
                      </ListboxOptions>
                    </Transition>
                  </div>
                </Listbox>
              </div>
              <button
                  :disabled="disable"
                  @click="sendMessage"
                  class="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Send"
              >
                <div class="flex items-center justify-center">
                  <img
                      :src="IconSend"
                      class="w-[20px] h-[20px] rounded-full"
                      alt="send"
                  />
                </div>
              </button>
            </div>
          </div>
          <span class="text-[10px] mt-2 text-center text-gray-500">Thông tin chỉ mang tính tham khảo, được tư vấn bởi Trí Tuệ Nhân Tạo</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, nextTick, watch} from 'vue'
import axios from 'axios'
import echo from '../echo.js'
import {marked} from 'marked'
import {Listbox, ListboxButton, ListboxOptions, ListboxOption} from '@headlessui/vue'
import {ChevronUpDownIcon, XMarkIcon} from '@heroicons/vue/20/solid'
import {insurbotLogo} from '@/assets/insurbot-logo';
import IconSend from "@/assets/imgs/send-icon.svg";

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const emit = defineEmits(['close']);
const messages = ref([])
const message = ref('')
const loading = ref(false)
const disable = ref(false)
const chatBox = ref(null)
const chatStarted = ref(false)
const conversationId = ref('')
const textareaRef = ref(null);
let currentMessage = null

const defaultOption = { handle: '', name: 'Tư vấn sản phẩm' }
const options = ref([])

const selected = ref(defaultOption)

const focusTextarea = () => {
  if (!disable.value) {
    textareaRef.value?.focus();
  }
}

const clearSelection = () => {
  selected.value = defaultOption
}

const autoResize = () => {
  const textarea = textareaRef.value;
  if (textarea) {
    textarea.style.height = '44px'; // Reset to initial height
    const scrollHeight = textarea.scrollHeight;
    textarea.style.height = `${Math.min(scrollHeight, 120)}px`; // Set height, cap at max-height
  }
}

const loadMessages = () => {
  const storedData = localStorage.getItem('chatData')
  if (storedData) {
    const {messages: storedMessages, conversationId: storedId} = JSON.parse(storedData)
    messages.value = storedMessages
    conversationId.value = storedId
    chatStarted.value = true
  }
}

const closePopup = () => {
  emit('close');
};

const handleKeyUp = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

const reloadChat = () => {
  messages.value = []
  localStorage.removeItem('chatData')
  chatStarted.value = false
  loading.value = false
  conversationId.value = ''
  currentMessage = null
}

const saveMessages = () => {
  localStorage.setItem('chatData', JSON.stringify({
    messages: messages.value,
    conversationId: conversationId.value,
  }))
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatBox.value) {
      chatBox.value.scrollTop = chatBox.value.scrollHeight
    }
  })
}

const renderMarkdown = (text) => {
  return marked.parse(text || '', {async: false})
}

const startChat = () => {
  conversationId.value = generateUUID()
  chatStarted.value = true
  disable.value = false
  selected.value = defaultOption
  messages.value = [{
    sender: 'bot',
    text: 'Xin chào anh chị, **INSURBOT** sẵn sàng hỗ trợ! Anh chị cần tư vấn gì hôm nay?'
  }]
  saveMessages()
  scrollToBottom()
}

const sendMessage = async () => {
  const userMsg = message.value.trim()
  if (!userMsg) return

  messages.value.push({
    sender: 'user',
    text: userMsg
  })
  message.value = ''
  loading.value = true
  disable.value = true
  saveMessages()
  scrollToBottom()
  // Reset textarea height after sending message
  if (textareaRef.value) {
    textareaRef.value.style.height = '44px';
  }

  try {
    await axios.post(import.meta.env.VITE_API_URL + '/chatbot', {
      prompt: userMsg,
      conversation_id: conversationId.value,
      product: selected.value.handle ?? ''
    })
  } catch (error) {
    console.error('Error sending message:', error)
    loading.value = false
    messages.value.push({
      sender: 'bot',
      text: '[Error]: Không thể gửi tin nhắn.'
    })
    saveMessages()
    scrollToBottom()
  }
}

const getProducts = async () => {
  try {
    const response = await axios.get(import.meta.env.VITE_API_URL + '/products')
    options.value = response.data.data || []
  } catch (error) {
    console.error('Failed to fetch products:', error)
    options.value = []
  }
}

onMounted(async () => {
  await getProducts()
  loadMessages()
  await nextTick()
  scrollToBottom()
})

watch(() => conversationId.value, (newId, oldId) => {
  if (oldId) {
    echo.leave(`chatroom_${oldId}`);
  }
  if (newId) {
    echo.channel('chatroom_' + newId)
        .listen('MessageChunkSent', (e) => {
          loading.value = false
          if (!currentMessage) {
            currentMessage = {
              sender: 'bot',
              text: ''
            }
            messages.value.push(currentMessage)
          } else {
            messages.value = [
              ...messages.value.slice(0, -1),
              {...currentMessage, text: currentMessage.text + e.chunk}
            ]
          }

          nextTick(() => {
            scrollToBottom()
          })
        })
        .listen('MessageStreamEnded', () => {
          currentMessage = null
          disable.value = false
          saveMessages()
          nextTick(() => {
            scrollToBottom()
          })
        })
  }
})
</script>