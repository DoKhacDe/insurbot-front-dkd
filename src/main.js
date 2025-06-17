// import './assets/main.css'
import './style.css'

import { createApp } from 'vue'
import App from './App.vue'

const insurbotChat = document.createElement('div')
insurbotChat.id = 'chat-bot-insurbot'
document.body.appendChild(insurbotChat)


createApp(App).mount(insurbotChat)
