<template>
  <UCard v-if="categories.length">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon
          name="i-lucide-picture-in-picture-2"
          size="20"
          class="text-gray-600 dark:text-gray-400"
        />
        <h3 class="font-semibold">{{ $t("categories") }}</h3>
      </div>
    </template>

    <div class="space-x-2">
      <UBadge
        variant="soft"
        v-for="category in categories"
        :key="category.id"
        color="neutral"
        >{{ category.name}}</UBadge>
    </div>
  </UCard>
</template>

<script setup>
const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
});
</script>
