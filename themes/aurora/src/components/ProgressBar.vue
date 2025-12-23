<template>
  <div
    id="progress-bar"
    class="rounded-full shadow-2xl"
    :style="progressBarStyle"
  ></div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue'
import throttle from 'lodash/throttle'

export default defineComponent({
  name: 'ObProgressBar',
  setup() {
    const progress = ref(0)

    const scrollHandler = throttle(
      () => {
        progress.value =
          (window.scrollY /
            (document.documentElement.scrollHeight - window.innerHeight)) *
          100
      },
      100,
      { trailing: true, leading: true }
    )

    onMounted(() => {
      scrollHandler()
      document.addEventListener('scroll', scrollHandler)
    })

    onUnmounted(() => {
      document.removeEventListener('scroll', scrollHandler)
    })

    return {
      progressBarStyle: computed(() => {
        return { width: `${progress.value}%` }
      })
    }
  }
})
</script>

<style lang="scss" scoped>
#progress-bar {
  content: '';
  position: fixed;
  z-index: 9999;
  top: 0;
  height: 3px;
  background: var(--main-gradient);
}
</style>
