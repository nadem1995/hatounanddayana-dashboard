<template>
  <UDashboardGroup unit="rem">

    <UDashboardSidebar
      id="default"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }"> logo </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />
      </template>

      <template #footer="{ collapsed }">
        <UButton
          icon="i-lucide-log-out"
          variant="subtle"
          color="neutral"
          class="w-full"
          loading-auto
          @click="logout"
        >
          {{ $t("logout") }}
        </UButton>
      </template>
    </UDashboardSidebar>
    <slot />
  </UDashboardGroup>
</template>
<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
const { t } = useI18n();

const toast = useToast();

const links = [
  [
    {
      label: computed(() => t("home")),
      icon: "i-lucide-house",
      to: { name: "admin" },
    },
    {
      label: computed(() => t("categories")),
      icon: "i-lucide-picture-in-picture-2",
      to: { name: "admin-categories" },
    },
    {
      label: computed(() => t("products")),
      icon: "i-lucide-box",
      to: { name: "admin-products" },
    },
    {
      label: computed(() => t("marketing")),
      icon: "i-lucide-megaphone",
      to: { name: "admin-marketing" },
    },
    {
      label: computed(() => t("cms")),
      icon: "i-lucide-book",
      defaultOpen: true,
      type: "trigger",
      children: [
        {
          label: computed(() => t("testimonials")),
          to: { name: "admin-cms-testimonials" },
          onSelect: () => {
            open.value = false;
          },
        },
        {
          label: computed(() => t("FAQ")),
          to: { name: "admin-cms-F&Q" },
          onSelect: () => {
            open.value = false;
          },
        },
        {
          label: computed(() => t("heroImage")),
          to: { name: "admin-cms-hero-image" },
          onSelect: () => {
            open.value = false;
          },
        },

      ],
    },
    {
      label: computed(() => t("settings")),
      to: { name: "admin-settings" },
      icon: "i-lucide-settings",
    },
  ],
] satisfies NavigationMenuItem[][];

async function logout() {
  try {
    const logoutResponce = await useLogout();
    toast.add({
      title: t("logoutSuccess"),
      description: logoutResponce.message || t("logoutSuccessDesc"),
      color: "success",
      icon: "i-lucide-check-circle",
    });

    await navigateTo({ name: "admin-login" });
  } catch (error: any) {
    toast.add({
      title: t("loginError"),
      description: error.data.message || t("invalidCredentials"),
      color: "error",
      icon: "i-lucide-alert-circle",
    });
  }
}
</script>
