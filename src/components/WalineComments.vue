<template>
  <Waline
    :serverURL="serverURL"
    :path="path"
    :dark="darkSelector"
    :emoji="emojiList"
    :pageview="true"
    :search="false"
  />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import { Waline } from '@waline/client/component'
import '@waline/client/style'

const props = defineProps({
  serverURL: {
    type: String,
    required: true,
  },
})

const route = useRoute()
const { darkMode } = useTheme()

const path = computed(() => route.path)
const darkSelector = computed(() => (darkMode.value ? 'html[class="dark"]' : ''))

const emojiList = [
  '//cdn.jsdelivr.net/gh/Sanksu/Waline_Bang_Dream_emoji@1.9.0/src/BangDream/',
  '//cdn.jsdelivr.net/gh/Sanksu/Waline_Bang_Dream_emoji@1.9.0/src/Popipa/',
  '//cdn.jsdelivr.net/gh/Sanksu/Waline_Bang_Dream_emoji@1.9.0/src/Afterglow/',
  '//cdn.jsdelivr.net/gh/Sanksu/Waline_Bang_Dream_emoji@1.9.0/src/RAS/',
  '//cdn.jsdelivr.net/gh/Sanksu/Waline_Bang_Dream_emoji@1.9.0/src/PastelPalettes/',
  '//cdn.jsdelivr.net/gh/Sanksu/Waline_Bang_Dream_emoji@1.9.0/src/Mygo/',
  '//cdn.jsdelivr.net/gh/Sanksu/Waline_Bang_Dream_emoji@1.9.0/src/AveMujica/',
]
</script>
