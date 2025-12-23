<template>
  <div
    class="header-logo flex items-center self-stretch relative cursor-pointer hover:scale-110 transition-transform transform-gpu duration-500"
    @click="handleLogoClick"
  >
    <span class="flex mr-3">
      <img
        v-if="avatarSrc"
        :class="avatarClass"
        :src="avatarSrc"
        alt="site-logo"
        @error="handleImageError"
      />
      <ob-skeleton v-else width="2rem" height="2rem" circle />
    </span>

    <div class="flex flex-col justify-center">
      <span
        class="text-invert flex text-xl leading-tight text-white font-extrabold"
        v-if="themeConfig.site.author"
      >
        {{ themeConfig.site.author }}
      </span>
      <span
        v-else
        class="text-invert flex text-xl leading-tight text-white font-extrabold"
      >
        LOADING
      </span>
      <span
        v-if="themeConfig.site.nick && themeConfig.site.nick !== themeConfig.site.author"
        class="text-invert font-extrabold text-[0.45rem] leading-tight uppercase text-white"
      >
        {{ themeConfig.site.nick }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { useAppStore } from '@/stores/app'
import { computed, defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'ArLogo',
  setup() {
    const appStore = useAppStore()
    const router = useRouter()

    const handleLogoClick = () => {
      router.push('/')
    }

    const avatarSrc = computed(() => {
      const config = appStore.themeConfig
      return config?.site?.logo || config?.site?.avatar || '/images/avatar.png'
    })

    const handleImageError = () => {
      console.warn('Failed to load avatar image')
    }

    return {
      handleLogoClick,
      avatarClass: computed(() => {
        return {
          'logo-image': true,
          [appStore.themeConfig.theme.profile_shape]: true
        }
      }),
      themeConfig: computed(() => appStore.themeConfig),
      avatarSrc,
      handleImageError
    }
  }
})
</script>

<style lang="scss">
.logo-image {
  @apply w-8 h-8 scale-125;
  transition: 0.3s all ease;
  border-radius: 50% !important;
  object-fit: cover;
}

.header-active {
  .logo-image {
    @apply scale-100;
  }
}
</style>
