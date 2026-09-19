<template>
  <UCard v-if="sizes.length">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon
          name="i-lucide-ruler"
          size="20"
          class="text-gray-600 dark:text-gray-400"
        />
        <h3 class="font-semibold">{{ $t("sizes") }}</h3>
      </div>
    </template>

    <div class="space-x-2">
      <UBadge
        variant="soft"
        v-for="size in sizes"
        :key="size"
        color="neutral"
      >{{size}}</UBadge>
    </div>
  </UCard>
</template>

<script setup>
const props = defineProps({
  sizes: {
    type: Array,
    required: true,
  },
});
</script>
