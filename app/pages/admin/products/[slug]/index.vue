<template>
  <UDashboardPanel id="products-show">
    <template #header>
      <UDashboardNavbar :title="$t('products')">
        <template #leading>
          <UDashboardSidebarCollapse/>
        </template>

        <template #right>
          <UButton
            class="cursor-pointer"
            :label="$t('edit')"
            icon="i-lucide-edit-2"
            :to="{
              name: 'admin-products-slug-edit',
              params: { slug: route.params.slug },
            }"
          />
          <UButton
            class="cursor-pointer"
            :label="$t('products')"
            icon="i-lucide-box"
            :to="{ name: 'admin-products' }"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-4 sm:p-6">
        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <!-- Left Sidebar - Quick Info -->
          <div class="space-y-6">
            <!-- Status Card -->
            <StatusCard :status="product.data.status"/>
            <!-- Price Card -->
            <ProductsPriceCard :product="product"/>
            <!-- Categories Card -->
            <ProductsCategoriesCard :categories="product.data.categories"/>
            <!-- Timestamps Card -->
            <Timestamps
              :created-at="product.data.created_at"
              :updated-at="product.data.updated_at"
            />
          </div>

          <!-- Main Content Area -->
          <div class="xl:col-span-2 space-y-6">
            <!-- Product Information Tabs -->
            <UCard>
              <div class="space-y-6" dir="rtl">
                <!-- Name -->
                <div class="flex items-start gap-4">
                  <div class="p-2 rounded-lg bg-primary-50 dark:bg-primary-950 shrink-0">
                    <UIcon
                      name="i-lucide-tag"
                      size="20"
                      class="text-primary-600 dark:text-primary-400"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                      {{ $t("name") }}
                    </p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white truncate">
                      {{ product.data.name.en }}
                    </p>
                    <p class="text-base font-semibold text-gray-600 dark:text-gray-400 truncate mt-0.5">
                      {{ product.data.name.ar }}
                    </p>
                  </div>
                </div>

                <USeparator />

                <!-- Description -->
                <div class="flex items-start gap-4">
                  <div class="p-2 rounded-lg bg-primary-50 dark:bg-primary-950 shrink-0">
                    <UIcon
                      name="i-lucide-align-left"
                      size="20"
                      class="text-primary-600 dark:text-primary-400"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                      {{ $t("description") }}
                    </p>
                    <div class="content" v-html="product.data.description.en"/>
                    <div class="mt-2 content" v-html="product.data.description.ar" />
                  </div>
                </div>
              </div>
            </UCard>
            <!-- Product Variants -->
            <div>
              <div class="flex items-center gap-3 mb-6">
                <div
                  class="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500"
                >
                  <UIcon name="i-lucide-palette" class="w-6 h-6 text-white"/>
                </div>
                <div>
                  <h3 class="text-2xl font-bold">
                    {{ $t("productVariants") }}
                  </h3>
                  <p class="text-sm text-gray-500">
                    {{ $t("availableColors") }}
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProductsVariantCard
                  v-for="variant in product.data.variants"
                  :key="variant.id"
                  :variant="variant"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup>
const {t} = useI18n();
const route = useRoute();
const {data: product} = await useApiFetch(`products/${route.params.slug}`);
useHead({
  title: () => t("products"),
});

</script>


<style scoped>
  .content :deep(h1) { font-size: 2.25rem; font-weight: 700; }
  .content :deep(h2) { font-size: 1.875rem; font-weight: 700; }
  .content :deep(h3) { font-size: 1.5rem; font-weight: 600; }
  .content :deep(h4) { font-size: 1.25rem; font-weight: 600; }
  .content :deep(ul) { list-style: disc; padding-left: 1.5rem; }
  .content :deep(ol) { list-style: decimal; padding-left: 1.5rem; }
</style>



