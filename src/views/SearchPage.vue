<template>
  <div class="page page-search scroll-animate">
    <input
      id="search-input"
      v-model="searchQuery"
      @input="handleInput(searchQuery)"
      type="text"
      placeholder="请在这里输入关键词^_^"
    />
    <h1>
      <span>搜索结果</span>
      <i v-if="searchQuery && !results.length" class="icon-loading" style="opacity:0"></i>
    </h1>
    <ul class="list-search">
      <li v-for="r in results" :key="r.slug">
        <router-link :to="postUrl(r)">
          <p class="title" v-html="r.titleHighlight"></p>
          <p class="content" v-html="r.excerptHighlight"></p>
        </router-link>
      </li>
      <li v-if="searchQuery && results.length === 0">
        <p class="title">未找到相关结果</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSearch } from '@/composables/useSearch'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

const searchQuery = ref('')
const { results, handleInput } = useSearch()

function postUrl(post) {
  const [y, m, d] = post.date.split('-')
  return `/posts/${y}/${m}/${d}/${post.slug}`
}

useScrollAnimation()
</script>
