import { createApp } from 'vue'

import { router } from './router'
import { pinia } from './pinia'
import { PiniaColada } from '@pinia/colada'

import App from './App.vue'
import Notifications from '@kyvg/vue3-notification'

import './style.scss'

const app = createApp(App)

app.use(pinia)
app.use(PiniaColada)
app.use(router)
app.use(Notifications)
app.mount('#app')
