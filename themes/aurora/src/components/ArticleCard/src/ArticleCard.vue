<template>
  <li class="article-container" @click="handleCardClick(post?.slug)">
    <div class="article">
      <div class="article-thumbnail">
        <img v-if="post.cover" v-lazy="post.cover" alt="" />
        <img v-else src="@/assets/default-cover.jpg" />
        <span class="thumbnail-screen" :style="gradientBackground" />
      </div>
      <div class="article-content">
        <span>
          <b v-if="post.pinned" class="article-tag">
            <span>
              <SvgIcon
                icon-class="hot"
                width="1.rem"
                height="1.05rem"
                class="-mb-0.5"
                stroke="currentColor"
              />
              <span>{{ t('settings.pinned') }}</span>
            </span>
          </b>
          <b v-if="post.feature" class="article-tag">
            <span>
              <SvgIcon
                icon-class="hot"
                width="1.05rem"
                height="1.05rem"
                class="-mb-0.5"
                stroke="currentColor"
              />
              <span>{{ t('settings.featured') }}</span>
            </span>
          </b>
          <b
            v-if="post.categories && post.categories.length > 0"
            @click="navigateToCategory(post.categories[0].slug)"
          >
            {{ post.categories[0].name }}
          </b>
          <b v-else-if="post.categories && post.categories.length <= 0">
            {{ t('settings.default-category') }}
          </b>
          <ob-skeleton v-else tag="b" height="20px" width="35px" />
        </span>

        <span class="flex flex-wrap">
          <ul v-if="post.tags && post.tags.length > 0">
            <li
              v-for="tag in post.min_tags"
              :key="tag.slug"
              @click="navigateToTag(tag.slug)"
            >
              <em># </em><span>{{ tag.name }}</span>
            </li>
          </ul>
          <ul v-else-if="post.tags && post.tags.length <= 0">
            <li>
              <em>#</em><span>{{ t('settings.default-tag') }}</span>
            </li>
          </ul>
          <ul v-else>
            <ob-skeleton
              v-if="!post.tags"
              :count="2"
              tag="li"
              height="16px"
              width="35px"
            />
          </ul>
        </span>

        <router-link
          v-if="post.title"
          :to="{ name: 'post-slug', params: { slug: post.slug } }"
        >
          <h1 data-dia="article-link">{{ post.title }}</h1>
        </router-link>
        <ob-skeleton v-else tag="h1" height="3rem" />

        <p v-if="post.text">{{ post.text }}</p>
        <ob-skeleton v-else tag="p" :count="4" height="16px" />

        <div class="article-footer" v-if="post.date">
          <div class="flex flex-row items-center">
            <img
              :class="avatarClasses"
              :src="authorAvatar"
              :alt="`avatar-${authorName}`"
              @error="handleImageError"
              @click="handleAuthorClick(authorLink)"
            />
            <span class="text-ob-dim">
              <strong
                class="text-ob-normal pr-1.5 hover:text-ob hover:opacity-50 cursor-pointer"
                @click="handleAuthorClick(authorLink)"
              >
                {{ authorName }}
              </strong>
              {{ t('settings.shared-on') }} {{ t(post.date.month) }}
              {{ post.date.day }}, {{ post.date.year }}
            </span>
          </div>
        </div>

        <div class="article-footer" v-else>
          <div class="flex flex-row items-center mt-6">
            <ob-skeleton
              class="mr-2"
              height="28px"
              width="28px"
              :circle="true"
            />
            <span class="text-ob-dim mt-1">
              <ob-skeleton height="20px" width="150px" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { useAppStore } from '@/stores/app'
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'ARArticleCard',
  components: { SvgIcon },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    const appStore = useAppStore()
    const { t } = useI18n()

    const handleCardClick = (slug?: string) => {
      if (!slug) return
      router.push({ name: 'post-slug', params: { slug } })
    }

    const handleAuthorClick = (link: string) => {
      if (link === '') link = window.location.href
      window.location.href = link
    }

    const navigateToTag = (slug: string) => {
      router.push({ name: 'post-search', query: { tag: slug } })
    }

    const navigateToCategory = (slug: string) => {
      router.push({ name: 'post-search', query: { category: slug } })
    }

    // Get author info from post or fallback to site config
    const authorName = computed(() => {
      const post = props.data as any
      if (post?.author?.name) {
        return post.author.name
      }
      // Fallback to site author or authors config
      const siteAuthor = appStore.themeConfig?.site?.author
      if (siteAuthor) {
        // Check if there's an author config for this author
        const authors = appStore.themeConfig?.authors || {}
        if (authors[siteAuthor]?.name) {
          return authors[siteAuthor].name
        }
        return siteAuthor
      }
      return 'RR'
    })

    const authorAvatar = computed(() => {
      const post = props.data as any
      if (post?.author?.avatar) {
        return post.author.avatar
      }
      // Fallback to site avatar or authors config
      const siteAuthor = appStore.themeConfig?.site?.author
      if (siteAuthor) {
        const authors = appStore.themeConfig?.authors || {}
        if (authors[siteAuthor]?.avatar) {
          return authors[siteAuthor].avatar
        }
      }
      return appStore.themeConfig?.site?.avatar || appStore.themeConfig?.avatar?.source_path || '/images/avatar.png'
    })

    const authorLink = computed(() => {
      const post = props.data as any
      if (post?.author?.link) {
        return post.author.link
      }
      // Fallback to site author link or authors config
      const siteAuthor = appStore.themeConfig?.site?.author
      if (siteAuthor) {
        const authors = appStore.themeConfig?.authors || {}
        if (authors[siteAuthor]?.link) {
          return authors[siteAuthor].link
        }
      }
      return appStore.themeConfig?.site?.link || '/'
    })

    const handleImageError = (event: Event) => {
      const img = event.target as HTMLImageElement
      if (img && img.src !== '/images/avatar.png') {
        img.src = '/images/avatar.png'
      }
    }

    return {
      avatarClasses: computed(() => ({
        'hover:opacity-50 cursor-pointer': true,
        [appStore.themeConfig.theme.profile_shape]: true
      })),
      gradientBackground: computed(() => {
        return { background: appStore.themeConfig.theme.header_gradient_css }
      }),
      post: computed(() => props.data),
      authorName,
      authorAvatar,
      authorLink,
      handleImageError,
      navigateToTag,
      navigateToCategory,
      handleAuthorClick,
      handleCardClick,
      t
    }
  }
})
</script>

<style lang="scss" scoped>
.feature-sign {
  width: calc(100% - 0.5rem);
  height: calc(100% - 0.5rem);
  margin: 0.25rem;
}
</style>
