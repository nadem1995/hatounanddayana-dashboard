<template>
  <UDashboardPanel id="page-show">
    <template #header>
      <UDashboardNavbar :title="$t('pages')">
        <template #leading>
          <UDashboardSidebarCollapse/>
        </template>

        <template #right>
          <UButton
            class="cursor-pointer"
            :label="$t('edit')"
            icon="i-lucide-edit-2"
            :to="{
              name: 'admin-pages-slug-edit',
              params: { slug: route.params.slug },
            }"
          />
          <UButton
            class="cursor-pointer"
            :label="$t('pages')"
            icon="i-lucide-files"
            :to="{ name: 'admin-pages' }"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-4 sm:p-6">
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

          <!-- Sidebar -->
          <div class="xl:sticky xl:top-6 space-y-4">
            <StatusCard :status="page.status"/>
            <Timestamps
              :created-at="page.created_at"
              :updated-at="page.updated_at"
            />
          </div>

          <!-- Main Content -->
          <div class="xl:col-span-2 space-y-6">

            <!-- Titles Card -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-languages" class="size-4 text-(--ui-text-muted)"/>
                  <p class="font-semibold text-(--ui-text-highlighted)">
                    {{ $t('title') }}
                  </p>
                </div>
              </template>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <!-- English Title -->
                <div class="space-y-1">
                  <p class="text-xs font-medium uppercase tracking-wide text-(--ui-text-muted)">
                    {{ $t('title') }} EN
                  </p>
                  <p class="text-(--ui-text-highlighted) font-semibold text-lg">
                    {{ page.title_en }}
                  </p>
                </div>

                <!-- Arabic Title -->
                <div class="space-y-1 text-right" dir="rtl">
                  <p class="text-xs font-medium uppercase tracking-wide text-(--ui-text-muted)">
                    {{ $t('title') }} AR
                  </p>
                  <p class="text-(--ui-text-highlighted) font-semibold text-lg">
                    {{ page.title_ar }}
                  </p>
                </div>
              </div>
            </UCard>

            <!-- Content Card -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-file-text" class="size-4 text-(--ui-text-muted)"/>
                  <p class="font-semibold text-(--ui-text-highlighted)">
                    {{ $t('content') }}
                  </p>
                </div>
              </template>

              <UTabs
                :items="[
    { label: 'العربية', value: 'ar' },
    { label: 'English', value: 'en' },
  ]"
                default-value="ar"
              >
                <template #content="{ item }">
                  <div
                    v-if="item.value === 'en'"
                    class="prose prose-sm max-w-none text-(--ui-text) pt-4"
                    v-html="page.content_en"
                  />
                  <div
                    v-else
                    class="prose prose-sm max-w-none text-(--ui-text) pt-4"
                    dir="rtl"
                    v-html="page.content_ar"
                  />
                </template>
              </UTabs>
            </UCard>

          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup>
const {t} = useI18n();
const route = useRoute();
const {data: page} = await useApiFetch(`pages/${route.params.slug}`);
useHead({
  title: () => t('pages'),
});
</script>
