<template>
  <div class="page page-index scroll-animate">
    <div v-for="(yearPosts, year) in postsByYear" :key="year" class="list-post">
      <h2 :id="year">{{ year }}</h2>
      <ul>
        <li
          v-for="post in yearPosts"
          :key="post.slug"
          class="scroll-animate"
        >
          <span class="date">{{ formatDate(post.date) }}</span>
          <div class="title">
            <router-link :to="postUrl(post)" class="hover-underline">{{ post.title }}</router-link>
          </div>
          <div class="categories">
            <router-link
              v-for="cat in post.categories"
              :key="cat"
              to="/categories"
              class="hover-underline"
            >{{ cat }}</router-link>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getPostsByYear } from '@/data/posts'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

const postsByYear = computed(() => getPostsByYear())

function formatDate(dateStr) {
  return dateStr.replace(/-/g, '/')
}

function postUrl(post) {
  const [y, m, d] = post.date.split('-')
  return `/posts/${y}/${m}/${d}/${post.slug}`
}

useScrollAnimation()
</script>
