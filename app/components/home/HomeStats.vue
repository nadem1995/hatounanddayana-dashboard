<template>
  <UPageGrid
    class="gap-4 sm:gap-6 lg:grid-cols-3"
  >
    <StatCard
      icon="i-lucide-picture-in-picture-2"
      :label="$t('categories')"
      :value="stats.categories"
      :to="{ name: 'admin-categories' }"
    />

    <StatCard
      icon="i-lucide-box"
      :label="$t('products')"
      :value="stats.products"
      :to="{ name: 'admin-products' }"
    />

    <!-- <StatCard
      icon="i-lucide-users"
      :label="$t('customers')"
      :value="stats.customers"
      :to="{ name: 'admin-customers' }"
    /> -->
  </UPageGrid>
</template>

<script setup lang="ts">
defineProps<{
  stats: {
    categories: number
    products: number
    customers: number
  }
}>()
</script>
