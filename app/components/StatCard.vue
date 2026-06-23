<template>
  <NuxtLink v-if="to" :to="to" class="block group">
    <UCard
      variant="outline"
      class="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50"
      :ui="{ body: 'p-6' }"
    >
      <!-- Background gradient effect on hover -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      <div class="relative flex items-center gap-5">
        <!-- Icon with modern styling -->
        <div
          class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 ring-1 ring-primary/30 shadow-sm transition-all duration-300 group-hover:shadow-primary/20 group-hover:shadow-lg group-hover:scale-105 group-hover:-rotate-3"
        >
          <UIcon
            :name="icon"
            class="text-primary transition-transform duration-300 group-hover:scale-110"
            size="32"
          />
        </div>

        <!-- Content -->
        <div class="flex flex-col gap-1.5 min-w-0 flex-1">
          <span
            class="text-sm font-medium uppercase tracking-wide text-muted-foreground group-hover:text-foreground transition-colors"
          >
            {{ label }}
          </span>
          <span class="text-4xl font-bold text-foreground tabular-nums">
            {{ value }}
          </span>
        </div>

        <!-- Arrow indicator -->
        <div
          class="shrink-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
        >
          <UIcon
            :name="
              locale === 'ar' ? 'i-lucide-arrow-left' : 'i-lucide-arrow-right'
            "
            class="text-primary"
            size="24"
          />
        </div>
      </div>
    </UCard>
  </NuxtLink>
</template>

<script setup lang="ts">
const { locale } = useI18n();
defineProps<{
  icon: string;
  label: string;
  value: number | string;
  to?: any;
}>();
</script>
