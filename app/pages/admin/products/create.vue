<template>
  <UDashboardPanel id="products-create">
    <template #header>
      <UDashboardNavbar :title="$t('createProduct')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            :label="$t('products')"
            icon="i-lucide-box"
            :to="{ name: 'admin-products' }"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-4 sm:p-6">
        <UForm
          :schema="schema"
          :state="state"
          :disabled="isLoading"
          @submit="onSubmit"
          class="space-y-6"
        >
          <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div class="space-y-6">
              <ProductsStatusForm :state="state" />
              <ProductsBestSellerForm :state="state" />
              <ProductsCategoriesForm
                :state="state"
                :categories="data?.data?.categories"
                :loading="pending"
                :server-error="serverError"
              />
              <ProductsPriceForm
                :state="state"
                :server-error="serverError"
              />
              <!-- <ProductsDiscountForm
                v-model="_discount"
                :state="state"
                :discounts="data?.data?.discounts"
                :loading="pending"
                :server-error="serverError"
              /> -->
            </div>
            <div class="xl:col-span-2 space-y-6">
              <ProductsInformationForm
                :state="state"
                :server-error="serverError"
              />

              <ProductsVariantsForm :state="state" />
            </div>
          </div>

          <div class="pt-6 border-t">
            <UButton
              type="submit"
              block
              :loading-auto="true"
              icon="i-lucide-save"
              :label="$t('save')"
            />
          </div>
        </UForm>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup>
import * as z from "zod";

const { t } = useI18n();
const toast = useToast();

useHead({
  title: () => t("products"),
});

const schema = z.object({}).passthrough();

// Fetch data
const { data, pending } = await useApiFetch("products/create-data", {
  lazy: true,
});
const _discount = ref(null);

const state = ref({
  name: "",
  description: "",
  price: 0,
  status: false,
  is_best_seller: false,
  variants: [
    {
      color_name: "",
      color_code: "#000000",
      status: true,
      images: [],
    },
  ],
  categories: [],
});

const serverError = ref(null);
const isLoading = ref(false);

async function onSubmit(event) {
  isLoading.value = true;
  serverError.value = null;
  try {
    const formData = new FormData();

    formData.append("name", state.value.name);
    formData.append("description", state.value.description);
    formData.append("price", state.value.price);
    formData.append("status", state.value.status ? "1" : "0");
    formData.append("is_best_seller", state.value.is_best_seller ? "1" : "0");

    // Add variants
    state.value.variants.forEach((variant, index) => {
      formData.append(
        `variants[${index}][color_name]`,
        variant.color_name,
      );
      
      formData.append(`variants[${index}][color_code]`, variant.color_code);
      formData.append(`variants[${index}][status]`, variant.status ? "1" : "0");

      if (variant.images) {
        variant.images.forEach((image, imgIndex) => {
          if (image instanceof File) {
            formData.append(`variants[${index}][images][${imgIndex}]`, image);
          }
        });
      }
    });

    state.value.categories.forEach((categoryId, index) => {
      formData.append(`categories[${index}]`, categoryId);
    });

    const response = await useApiFetchRaw("products", {
      method: "POST",
      body: formData,
    });

    toast.add({
      title: response.message,
      color: "success",
      icon: "i-lucide-check-circle",
    });

    navigateTo({
      name: "admin-products",
    });
  } catch (error) {
    if (error.status === 422) {
      serverError.value = error.data.errors;
    } else {
      toast.add({
        title: t("error"),
        description: error.message || t("somethingWentWrong"),
        color: "error",
      });
    }
  } finally {
    isLoading.value = false;
  }
}
</script>
