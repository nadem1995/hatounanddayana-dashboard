<template>
  <UDashboardPanel id="products-show">
    <template #header>
      <UDashboardNavbar :title="$t('products')">
        <template #leading>
          <UDashboardSidebarCollapse />
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

            <StatusCard :status="product.data.status" />


            <!-- Best seller Card -->
            <BestSellerCard :status="product.data.is_best_seller" />



            <!-- Price Card -->
            <ProductsPriceCard :product="product"/>

            
            <!-- Categories Card -->
            <ProductsCategoriesCard :categories="product.data.categories" />

            <!-- Timestamps Card -->
            <Timestamps
              :created-at="product.data.created_at"
              :updated-at="product.data.updated_at"
            />

            <!-- Variant Summary -->
            <!-- <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-layers" size="20" />
                  <h3 class="font-semibold">{{ $t("summary") }}</h3>
                </div>
              </template>

              <div class="space-y-4">
                <div
                  class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{
                    $t("totalVariants")
                  }}</span>
                  <span class="text-lg font-bold">{{
                    product.data.variants.length
                  }}</span>
                </div>
                <div
                  class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{
                    $t("totalStock")
                  }}</span>
                  <span class="text-lg font-bold text-primary">
                    {{
                      product.data.variants.reduce((sum, v) => sum + v.stock, 0)
                    }}
                  </span>
                </div>
              </div>
            </UCard> -->
          </div>

          <!-- Main Content Area -->
          <div class="xl:col-span-2 space-y-6">
            <!-- Product Information Tabs -->
            <UCard>
              <div class="py-4 space-y-6" dir="rtl">
                    <div>
                      <div class="flex items-center gap-2 mb-3">
                        <UIcon
                          size="20"
                          name="i-lucide-tag"
                          class="text-green-600 dark:text-green-400"
                        />
                        <h4
                          class="text-sm font-semibold text-gray-700 dark:text-gray-300"
                        >
                          {{ $t("name") }}
                        </h4>
                      </div>
                      <p class="text-xl font-bold mr-10">
                        {{ product.data.name}}
                      </p>
                    </div>

                    <div
                      class="border-t border-gray-200 dark:border-gray-700 pt-6"
                    >
                      <div class="flex items-center gap-2 mb-3">
                        <UIcon
                          size="20"
                          name="i-lucide-align-left"
                          class="text-green-600 dark:text-green-400"
                        />
                        <h4
                          class="text-sm font-semibold text-gray-700 dark:text-gray-300"
                        >
                          {{ $t("description") }}
                        </h4>
                      </div>
                      <p
                        class="text-base text-gray-700 dark:text-gray-300 leading-relaxed mr-10"
                      >
                        {{ product.data.description }}
                      </p>
                    </div>
                  </div>
            </UCard>

            <!-- Product Variants -->
            <div>
              <div class="flex items-center gap-3 mb-6">
                <div
                  class="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500"
                >
                  <UIcon name="i-lucide-palette" class="w-6 h-6 text-white" />
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
const { t } = useI18n();
const route = useRoute();
const { data: product } = await useApiFetch(`products/${route.params.slug}`);
useHead({
  title: () => t("products"),
});
</script>
