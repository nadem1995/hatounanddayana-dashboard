<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar :title="$t('home')" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <!-- <template #right>
          <UTooltip text="Notifications" :shortcuts="['N']">
            <UButton
              color="neutral"
              variant="ghost"
              square
              @click="isNotificationsSlideoverOpen = true"
            >
              <UChip color="error" inset>
                <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
              </UChip>
            </UButton>
          </UTooltip>
        </template> -->
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left> </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <UPageGrid class="gap-4 sm:gap-6 lg:grid-cols-3">
        <template v-if="pending">
          <StatCardSkeleton v-for="i in 3" :key="i" />
        </template>

        <template v-else>
          <StatCard
            icon="i-lucide-picture-in-picture-2"
            :label="$t('categories')"
            :value="data.stats.categories"
            :to="{ name: 'admin-categories' }"
          />

          <StatCard
            icon="i-lucide-box"
            :label="$t('products')"
            :value="data.stats.products"
            :to="{ name: 'admin-products' }"
          />

          <!-- <StatCard
            icon="i-lucide-users"
            :label="$t('customers')"
            :value="data.stats.customers"
            :to="{ name: 'admin-customers' }"
          /> -->
        </template>
      </UPageGrid>
    </template>
  </UDashboardPanel>
</template>

<script setup>
const { isNotificationsSlideoverOpen } = useDashboard();
const { t } = useI18n();
const { data, pending } = await useApiFetch(``, {
  lazy: true,
});

useHead({
  title: () => t("dashboard"),
});
</script>
