<template>
  <UDashboardPanel id="categories-show">
    <template #header>
      <UDashboardNavbar :title="$t('category')">
        <template #leading>
          <UDashboardSidebarCollapse/>
        </template>
        <template #right>

          <UButton
            icon="i-lucide-picture-in-picture-2"
            :to="{ name: 'admin-categories' }"
          >{{ $t("categories") }}
          </UButton
          >
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="md:grid grid-cols-3 md:gap-5 space-y-5">
        <div class="space-y-4">
          <StatusCard :status="category.data.status"/>
          <Timestamps
            :created-at="category.data.created_at"
            :updated-at="category.data.updated_at"
          />
        </div>
        <UCard class="col-span-2">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-info"
                size="20"
                class="text-gray-600 dark:text-gray-400"
              />
              <h3 class="font-semibold">{{ $t("categoryInformation") }}</h3>
            </div>
          </template>
          <div class="sm:grid flex flex-col grid-cols-5 gap-5 ">
            <div class="col-span-3">
              <div class="flex flex-col gap-4 rounded-xl  p-2 border border-gray-200">

                <!-- Top row: language indicator + English name -->
                  <span class="font-extrabold" lang="en">
                      {{ category.data.name.en }}
                  </span>

                <!-- Separator -->
                <USeparator/>

                      <span
                        class="font-extrabold "
                        lang="ar"
                      >
                        {{ category.data.name.ar }}
                      </span>

              </div>
            </div>
            <div class="col-span-2">
              <NuxtImg
                :src="category.data.image"
                :alt="category.data.slug"
                sizes="(max-width: 640px) 100vw,
         (max-width: 1024px) 50vw,
         320px"
                width="300"
                height="300"
                class="w-full aspect-square object-cover"
                priority
                loading="eager"
                placeholder
              />
            </div>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup>
import {LazyCategoriesEditModal} from "#components";

const overlay = useOverlay();
const editCategoryModal = overlay.create(LazyCategoriesEditModal);

const RESOURCE_PATH = "categories";
const {t} = useI18n();
const route = useRoute();
useHead({
  title: () => t("categories"),
});
const {data: category, refresh} = await useApiFetch(
  `${RESOURCE_PATH}/${route.params.slug}`,
);
</script>
