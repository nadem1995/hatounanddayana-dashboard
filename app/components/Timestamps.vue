<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon
          name="i-lucide-history"
          size="20"
          class="text-gray-600 dark:text-gray-400"
        />
        <h3 class="font-semibold">{{ $t("dates") }}</h3>
      </div>
    </template>
    <UTimeline
      :items="[
        {
          date: formatDate(createdAt),
          title: $t('createdAt'),
          icon: 'i-lucide-plus',
        },
        {
          date: formatDate(updatedAt),
          title: $t('updatedAt'),
          icon: 'i-lucide-check',
        },
      ]"
    />
  </UCard>
</template>

<script setup>
const { formatDate } = useDateFormat();
const props = defineProps({
  createdAt: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: String,
    required: true,
  },
});
</script>
