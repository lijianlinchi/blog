<template>
  <div
    class="h-98 w-full rounded-2xl relative shadow-xl mb-8"
    :style="gradientBackground"
  >
    <div
      class="ob-gradient-cut-plate absolute bg-ob-deep-900 rounded-xl opacity-90 flex justify-center items-center pt-4 px-6 shadow-lg hover:shadow-2xl duration-300"
      data-dia="author"
    >
      <div
        class="profile absolute w-full flex flex-col justify-center items-center"
      >
        <div class="flex flex-col justify-center items-center">
          <img
            v-if="avatarSrc"
            :class="avatarClass"
            :src="avatarSrc"
            alt="avatar"
            @error="handleImageError"
          />
          <ob-skeleton v-else width="6.4rem" height="6.4rem" circle />

          <h2 class="text-center pt-2 text-3xl font-semibold text-ob-bright">
            <template v-if="authorData.name">
              {{ authorData.name }}
            </template>
            <ob-skeleton v-else height="2.25rem" width="7rem" />
          </h2>
          <span
            class="h-1 w-14 rounded-full mt-2"
            :style="gradientBackground"
          />
        </div>
        <div
          class="h-full w-full flex flex-col flex-1 justify-center items-end"
        >
          <p
            v-if="authorData.description"
            class="flex-1 pt-6 px-8 w-full text-sm leading-8 text-center"
            v-html="authorData.description"
          />
          <p
            v-else
            class="pt-8 px-8 w-full text-sm text-center flex flex-col gap-2 justify-center"
          >
            <ob-skeleton :count="2" height="20px" width="100%" />
          </p>

          <Social :socials="authorData.socials" />
          <ul class="grid grid-cols-4 pt-2 w-full px-2 text-lg">
            <li class="col-span-1 text-center">
              <span class="text-ob-bright">{{ authorData.word_count }}</span>
              <p class="text-xs">{{ t('settings.words') }}</p>
            </li>
            <li class="col-span-1 text-center">
              <span class="text-ob-bright">
                {{ authorData.post_list.length }}
              </span>
              <p class="text-xs">{{ t('settings.articles') }}</p>
            </li>
            <li class="col-span-1 text-center">
              <span class="text-ob-bright">{{ authorData.categories }}</span>
              <p class="text-xs">{{ t('settings.categories') }}</p>
            </li>
            <li class="col-span-1 text-center">
              <span class="text-ob-bright">{{ authorData.tags }}</span>
              <p class="text-xs">{{ t('settings.tags') }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { AuthorPosts } from '@/models/Post.class'
import { useAppStore } from '@/stores/app'
import { useAuthorStore } from '@/stores/author'
import { computed, defineComponent, onMounted, ref, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Social from '@/components/Social.vue'

export default defineComponent({
  name: 'ObProfile',
  components: { Social },
  props: {
    author: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  setup(props) {
    const appStore = useAppStore()
    const authorStore = useAuthorStore()
    const { t } = useI18n()

    const author = toRefs(props).author
    const authorData = ref(new AuthorPosts())

    const fetchData = async () => {
      await appStore.fetchStat()
      await fetchAuthor()
    }

    const fetchAuthor = async () => {
      const authorSlug = author.value || 'blog-author'
      try {
        await authorStore.fetchAuthorData(authorSlug).then(data => {
          authorData.value = data
        })
      } catch (error) {
        console.warn('Failed to fetch author data:', error)
        // Use fallback data if API fails
        if (authorData.value.name === '') {
          authorData.value.name = appStore.themeConfig?.site?.author || 'RR'
          authorData.value.avatar = appStore.themeConfig?.site?.avatar || '/images/avatar.png'
          authorData.value.description = appStore.themeConfig?.site?.description || ''
        }
      }
    }

    watch(
      () => props.author,
      (newAuthor, oldAuthor) => {
        if (newAuthor && newAuthor !== oldAuthor) {
          fetchAuthor()
        }
      }
    )

    onMounted(fetchData)

    const avatarSrc = computed(() => {
      if (authorData.value && authorData.value.avatar && authorData.value.avatar !== '') {
        return authorData.value.avatar
      }
      // Fallback to theme config avatar
      return appStore.themeConfig?.site?.avatar || appStore.themeConfig?.avatar?.source_path || '/images/avatar.png'
    })

    const handleImageError = (event: Event) => {
      console.warn('Failed to load avatar image:', avatarSrc.value)
      const img = event.target as HTMLImageElement
      if (img && img.src !== '/images/avatar.png') {
        img.src = '/images/avatar.png'
      }
    }

    return {
      avatarClass: computed(() => {
        return {
          'ob-avatar': true,
          [appStore.themeConfig.theme.profile_shape]: true
        }
      }),
      themeConfig: computed(() => appStore.themeConfig),
      gradientBackground: computed(() => {
        return { background: appStore.themeConfig.theme.header_gradient_css }
      }),
      socials: computed(() => {
        return appStore.themeConfig.socials
      }),
      statistic: computed(() => appStore.statistic),
      authorData,
      avatarSrc,
      handleImageError,
      t
    }
  }
})
</script>

<style lang="scss" scoped>
.profile {
  top: -7%;
  height: 100%;
  max-height: 100%;
}

.ob-avatar {
  animation: rotate 20s linear infinite;
  transition: transform 0.3s ease;
  border-radius: 50% !important;
  object-fit: cover;
}

.ob-avatar:hover {
  animation-play-state: paused;
  transform: scale(1.1);
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
