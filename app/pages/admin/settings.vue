<template>
  <UDashboardPanel id="settings" :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar :title="$t('settings')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <!-- NOTE: The `-mx-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
        <UNavigationMenu :items="links" class="-mx-1" highlight />
      </UDashboardToolbar>
    </template>

    <template #body>
      <div
        class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto"
      >
        <NuxtPage />
      </div>
    </template>
  </UDashboardPanel>
</template>



<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const { t } = useI18n();

useHead({
  title: () => t("settings"),
});

const links = [
  [
    {
      label: computed(() => t("socialMedia")),
       icon: "i-lucide-tablet-smartphone",
      to: { name: "admin-settings" },
      exact: true,
    },

    /* {
      label: computed(() => t("contactInfo")),
      icon: "i-lucide-phone",
      to: { name: "admin-settings-contact-info" },
    }, */
    
    {
      label: computed(() => t("security")),
      icon: "i-lucide-shield",
      to: { name: "admin-settings-security" },
    },
  ],
] satisfies NavigationMenuItem[][];
</script>
