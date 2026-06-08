<template>
  <div class="page page-categories scroll-animate">
    <div class="list-category">
      <h2>所有分类</h2>
      <div>
        <a
          v-for="(posts, cat) in categories"
          :key="cat"
          :href="'#' + cat"
        >{{ cat }}</a>
      </div>
    </div>
    <div v-for="(posts, cat) in categories" :key="cat" class="list-post">
      <h2 :id="cat">{{ cat }}</h2>
      <ul>
        <li v-for="post in posts" :key="post.slug" class="scroll-animate">
          <span class="date">{{ formatDate(post.date) }}</span>
          <div class="title">
            <router-link :to="postUrl(post)" class="hover-underline">{{ post.title }}</router-link>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getCategories } from '@/data/posts'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

const categories = computed(() => getCategories())

function formatDate(dateStr) {
  return dateStr.replace(/-/g, '/')
}

function postUrl(post) {
  const [y, m, d] = post.date.split('-')
  return `/posts/${y}/${m}/${d}/${post.slug}`
}

useScrollAnimation()
</script>
