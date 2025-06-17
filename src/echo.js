import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher

const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    wsHost: import.meta.env.VITE_WSBHOST,
    forceTLS: true,
    wsPort: 6001,
    // wsHost: window.location.hostname,
    // wsPort: 8080,
    // forceTLS: false,
    cluster: '',
    disableStats: true,
})

export default echo
