<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    acgive: tab === 'your_feed'
                  }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your_feed'
                    }
                  }"
                  href
                  v-if="user"
                >Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    actice: tab === 'global_feed'
                  }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'global_feed'
                    }
                  }"
                  href
                >Global Feed</nuxt-link>
              </li>
              <li class="nav-item" v-if="tag">
                <a
                  class="nav-link"
                  :class="{
                    active: tag === 'tag'
                  }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'tag',
                      tag: tag
                    }
                  }"
                  href
                >#{{ tag }}</a>
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username
                  }
                }">
                <img :src="article.author.img" />
              </nuxt-link>
              <div class="info">
                <nuxt-link 
                  href class="author"
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username
                    }
                  }"
                >{{ article.author.username }}</nuxt-link>
                <span class="date">{{ article.createdAt | date('MMM DD, YYYY')}}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{
                  active: article.favorited
                }"
                @click="onFavorite(article)"
                :disabled="article.disabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link 
              class="preview-link"
              :to="{
                name: 'article',
                params: {
                  slug: article.slug
                }
              }"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>

        </div>
        <!-- 分页 -->
        <nav>
          <ul class="pagination">
            <li
              class="page-item"
              :class="{
                active: item === page
              }"
              v-for="item in totalPage"
              :key="item"
            >
              <nuxt-link
                class="page-link"
                :to="{
                  name: 'home',
                  query: {
                    page: item,
                    tag: $route.query.tag,
                    tab: tab
                  }
                }"
              >{{ item }}</nuxt-link>
            </li>
          </ul>
        </nav>
        <!-- 分页结束 -->

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <div class="tag-list">
              <nuxt-link
                href
                class="tag-pill tag-default"
                v-for="tag in tags"
                :key="tag"
                :to="{
                  name: 'home',
                  query: {
                    tab: 'tag',
                    tag
                  }
                }"
              >{{ tag }}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticles, getTags, getFeedArticles, addFavorite, deleteFavorite } from '@/api/article'
import { mapState } from 'vuex'

export default {
  name: 'HomePage',
  async asyncData ({ query, store }) {
    const page = Number.parseInt(query.page || 1)
    const limit = 2
    const { tag } = query
    const tab = query.tab || 'global_feed'
    const loadArticles = tab === 'your_feed' && store.state.user
      ? getFeedArticles
      : getArticles
    // 文章列表获取
    // 标签获取 
    const [articleRes, tagRes] = await Promise.all([
      loadArticles({
        limit,
        tag,
        offset: (page - 1) * limit
      }),
      getTags()
    ])

    const {articles, articlesCount} = articleRes.data
    const { tags } = tagRes.data
    articles.forEach(article => article.favoriteDisabled = false)

    return {
      limit,
      page,
      tags,
      tag,
      articles,
      articlesCount,
      tab: query.tab || 'global_feed'
    }
  },
  watchQuery: ['page', 'tag', 'tab'],
  computed: {
    ...mapState(['user']),
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  methods: {
    async onFavorite (article) {
      article.favoriteDisabled = true
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount--
      } else {
        // 添加点赞
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount++
      }
      article.favoriteDisabled = false
    }
  }
}
</script>

<style>
.row {
  flex-direction: column;
}
</style>