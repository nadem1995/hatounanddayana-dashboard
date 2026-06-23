<template>
  <div
    class="rounded-lg border-1"
    :class="
      is_best_seller ? 'bg-success/5 border-success/30' : 'bg-error/5 border-error/30'
    "
  >
    <div class="flex items-center gap-3 px-5 py-4">
      <div
        class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        :class="is_best_seller ? 'bg-success' : 'bg-error'"
      >
        <UIcon
          size="20"
          :name="is_best_seller ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
          class="text-white"
        />
      </div>
      <div class="flex-1">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ $t("bestSeller") }}
        </p>
        <span
          class="text-lg font-bold"
          :class="is_best_seller ? 'text-success' : 'text-error'"
        >
          {{ is_best_seller ? $t("active") : $t("inactive") }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  is_best_seller: boolean;
}>();
</script>
