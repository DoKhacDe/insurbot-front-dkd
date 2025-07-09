  <template>
    <div class="relative h-full">
      <div class="mt-10 h-full">
        <!-- Chat Container -->
        <div id="chat-container"
             class="w-full h-full rounded-b-xl flex flex-col px-2 pb-2 overflow-hidden">
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
            <div ref="chatBox" class="flex-1 overflow-y-auto space-y-2 pr-2 chat-scrollbar pb-3" style="max-height: calc(100vh - 200px);">
              <div
                  class="max-w-[800px] mx-auto"
                  v-for="(msg, idx) in messages"
                  :key="idx"
                  :class="[
                'flex',
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              ]"
              >
                <div
                    :class="[
                  'px-4 py-3 rounded-3xl break-words mt-3 text-medium',
                  msg.sender === 'user'
                    ? 'bg-primary/80 max-w-sm ml-5'
                    : 'mr-5'
                ]"
                >
                  <div>
                    <!-- Sender name -->
                    <div
                        v-if="msg.sender === 'bot'"
                        class="text-primary text-left text-sm font-bold mb-1 flex items-center"
                    >
                      <img :src="insurbotLogo" alt="logo" class="w-[25px] inline mr-1 text-base" v-if="msg.sender === 'bot'"/>
                      Insurbot
                      <div class="ml-3 flex space-x-1">
                        <button
                            class="transition-transform transform hover:scale-110 active:scale-95 rounded-full p-1"
                            @click="toggleLike(msg)"
                        >
                          <img
                              :src="msg.liked ? likeIconActive : likeIcon"
                              alt="like"
                              class="w-[20px] h-[20px] rounded-full"
                          />
                        </button>
                        <button
                            class="transition-transform transform hover:scale-110 active:scale-95 rounded-full p-1"
                            @click="toggleDislike(msg)"
                        >
                          <img
                              :src="msg.disliked ? disLikeIconActive : disLikeIcon"
                              alt="dislike"
                              class="w-[20px] h-[20px] rounded-full"
                          />
                        </button>
                      </div>
                    </div>

                    <!-- Message content -->
                    <div
                        v-html="renderMarkdown(msg.text)"
                        class="prose prose-sm max-w-none leading-snug space-y-2"
                        style="word-break: break-word;"
                        :class="msg.sender === 'user' ? 'text-white' : 'text-gray-800'"
                    ></div>
                  </div>
                </div>
              </div>
              <div class="w-full max-w-[800px] mx-auto">
                <!-- Loading indicator -->
                <div v-if="loading" class="text-gray-500 italic text-sm pl-2 flex items-center">
                  <img :src="insurbotLogo" alt="logo" class="w-[20px] mr-1"/>
                  <span class="typing-dots">Insurbot đang phân tích<span class="dot-1">.</span><span
                      class="dot-2">.</span><span class="dot-3">.</span></span>
                </div>
              </div>
            </div>

            <!-- Input -->
            <div class="w-full max-w-[800px] mx-auto">
              <div
                  class="relative border bg-white rounded-3xl border-gray-300 focus-within:outline-none shadow-2xl
                  focus-within:ring-primary/50 focus-within:ring bg-transparent text-gray-800 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <input
                    ref="textareaRef"
                    dir="auto"
                    :disabled="disable"
                    maxlength="200"
                    v-model="message"
                    @input="autoResize"
                    @keyup="handleKeyUp"
                    placeholder="Insurbot có thể giúp gì cho bạn?"
                    class="w-full px-4 focus:outline-none text-fg-primary rounded-3xl align-bottom min-h-14 pt-3 my-0"
                    style="resize: none; overflow-y: hidden; height: 44px !important; max-height: 120px;"
                />
                <div
                    class="flex justify-between items-center p-4"
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
                              v-if="selected.id === ''"
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
                                  :key="option.id"
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
            </div>

            <span class="text-[12px] mt-2 text-center text-gray-700">Thông tin chỉ mang tính tham khảo, được tư vấn bởi Trí Tuệ Nhân Tạo</span>
          </div>
        </div>
      </div>
    </div>
    <!-- Feedback Modal -->
    <Transition name="fade-scale">
      <div v-if="showFeedbackModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white w-[90%] max-w-lg rounded-xl p-6 shadow-2xl">
          <h2 class="text-lg font-semibold mb-2 text-primary">Góp ý của bạn</h2>
          <p class="text-sm text-gray-600 mb-3">Bạn có thể cho chúng tôi biết lý do không hài lòng?</p>
          <textarea
              v-model="feedbackInput"
              rows="4"
              class="w-full border border-gray-300 rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring focus:ring-primary/50"
              placeholder="Nhập góp ý..."
          ></textarea>
          <div class="mt-4 flex justify-end space-x-2">
            <button @click="showFeedbackModal = false"
                    class="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 text-sm">
              Hủy
            </button>
            <button @click="submitFeedback"
                    class="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 text-sm">
              Gửi
            </button>
          </div>
        </div>
      </div>
    </Transition>


  </template>

  <script setup>
  import {ref, onMounted, defineExpose, nextTick, watch} from 'vue'
  import axios from 'axios'
  import echo from '../echo.js'
  import {marked} from 'marked'
  import {Listbox, ListboxButton, ListboxOptions, ListboxOption} from '@headlessui/vue'
  import {ChevronUpDownIcon, XMarkIcon} from '@heroicons/vue/20/solid'
  import {insurbotLogo} from '@/assets/insurbot-logo';
  import IconSend from "@/assets/imgs/send-icon.svg";
  import likeIcon from '@/assets/imgs/like.svg';
  import disLikeIcon from '@/assets/imgs/dislike.svg';
  import likeIconActive from '@/assets/imgs/like-active.svg';
  import disLikeIconActive from '@/assets/imgs/dislike-active.svg';
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  defineExpose({
    reloadChat
  })

  const messages = ref([])
  const message = ref('')
  const loading = ref(false)
  const disable = ref(false)
  const chatBox = ref(null)
  const chatStarted = ref(false)
  const conversationId = ref('')
  const textareaRef = ref(null);
  const showFeedbackModal = ref(false)
  const feedbackInput = ref('')
  const feedbackMessage = ref(null)

  let currentMessage = null

  const defaultOption = { id: '', name: 'Tư vấn sản phẩm' }
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
      textarea.style.height = '44px';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }

  const loadMessages = () => {
    const storedData = localStorage.getItem('chatData')
    if (storedData) {
      const {messages: storedMessages, conversationId: storedId} = JSON.parse(storedData)
      messages.value = storedMessages.map(msg => ({
        liked: false,
        disliked: false,
        ...msg
      }))
      conversationId.value = storedId
      chatStarted.value = true
    }
  }

  const handleKeyUp = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  function reloadChat() {
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

  const toggleLike = (msg) => {
    msg.liked = !msg.liked
    if (msg.liked) msg.disliked = false
    if (msg.liked) {
      feedback(msg, 'like', 'Phản hồi tích cực')
    }
    saveMessages()
  }

  const toggleDislike = (msg) => {
    if (msg.disliked) {
      msg.disliked = false
      saveMessages()
      return
    }

    feedbackMessage.value = msg
    feedbackInput.value = ''
    showFeedbackModal.value = true
  }

  const submitFeedback = async () => {
    const input = feedbackInput.value.trim()
    if (!input || !feedbackMessage.value) return

    try {
      await feedback(feedbackMessage.value, 'dislike', input)
      feedbackMessage.value.disliked = true
      feedbackMessage.value.liked = false
      saveMessages()
      showFeedbackModal.value = false
      feedbackInput.value = ''
      feedbackMessage.value = null
    } catch (error) {
      console.error('Gửi feedback thất bại:', error)
    }
  }

  const feedback = async (msg, type, feedback) => {
    try {
      await axios.post(import.meta.env.VITE_API_URL + '/feedback', {
        conversation_id: conversationId.value,
        feedback: feedback,
        index: msg.index,
        type: type
      })
    } catch (error) {
      console.error('Error sending feedback:', error)
    }
  }

  const startChat = () => {
    conversationId.value = generateUUID()
    chatStarted.value = true
    disable.value = false
    selected.value = defaultOption
    messages.value = [{
      sender: 'bot',
      text: 'Xin chào anh chị, **INSURBOT** sẵn sàng hỗ trợ! Anh chị cần tư vấn gì hôm nay?',
      index: -1,
      liked: false,
      disliked: false
    }]
    saveMessages()
    scrollToBottom()
  }


  const sendMessage = async () => {
    const userMsg = message.value.trim()
    if (!userMsg) return

    messages.value.push({
      sender: 'user',
      text: userMsg,
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
        product: selected.value.id ?? ''
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
    let i = 0;
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
                text: '',
                index: i++
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
  <style scoped>
  .fade-scale-enter-active,
  .fade-scale-leave-active {
    transition: all 0.25s ease;
  }
  .fade-scale-enter-from,
  .fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.95);
  }
  </style>