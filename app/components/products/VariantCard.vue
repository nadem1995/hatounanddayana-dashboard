<template>
  <div
    class="group relative w-full rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5"
  >
    <!-- Carousel — no arrows, swipe only -->
    <div class="relative">
      <UCarousel
        v-slot="{ item }"
        :items="variant.images.map((img) => img.image)"
        :loop="true"
        dots
        :ui="{
          item: 'basis-full',
          controls: 'absolute inset-x-0 bottom-3',
          dots: 'gap-1.5',
          dot: 'w-1.5 h-1.5 rounded-full',
        }"
      >
        <div class="relative w-full aspect-square">
          <!-- Error State -->
          <div
            v-if="imageErrors[item]"
            class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-100 dark:bg-gray-800"
          >
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-gray-200 dark:bg-gray-700">
              <UIcon name="i-lucide-image-off" class="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </div>
            <span class="text-xs text-gray-400 dark:text-gray-500 font-medium">
              Image unavailable
            </span>
          </div>

          <!-- Actual Image -->
          <NuxtImg
            v-else
            :src="item"
            :alt="variant.color.name"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
            width="320"
            height="320"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            decoding="async"
            placeholder
            @error="handleImageError(item)"
          />
        </div>
      </UCarousel>

      <!-- Top row badges -->
      <div class="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none">
       

        <!-- Photo count -->
        <div
          v-if="variant.images.length > 1"
          class="flex items-center gap-1 px-2.5 py-1.5 rounded-full backdrop-blur-md bg-white/80 dark:bg-black/50 shadow-sm"
        >
          <UIcon name="i-lucide-layers" class="w-3 h-3 text-gray-500 dark:text-gray-400" />
          <span class="text-xs font-medium text-gray-600 dark:text-gray-300">
            {{ variant.images.length }}
          </span>
        </div>
      </div>
    </div>

    <!-- Bottom info bar -->
    <div
      class="flex items-center gap-3 px-4 py-3 border-t border-gray-100 dark:border-gray-800"
    >
      <!-- Swatch with glow -->
      <div class="relative shrink-0">
        <div
          class="w-9 h-9 rounded-xl transition-transform duration-300 group-hover:scale-110"
          :style="{ backgroundColor: variant.color.code }"
        />
        <div
          class="absolute inset-0 rounded-xl blur-md opacity-50 -z-10"
          :style="{ backgroundColor: variant.color.code }"
        />
      </div>

      <!-- Hex code -->
      <div class="flex flex-col">
        <span class="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
          {{ variant.color_name }}
        </span>
        <span class="text-xs font-mono text-gray-400 dark:text-gray-500 mt-0.5 tracking-widest">
          {{ variant.color.code }}
        </span>
      </div>

      
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: Object,
    required: true,
  },
});

const imageErrors = reactive({});

function handleImageError(src) {
  imageErrors[src] = true;
}
</script>
