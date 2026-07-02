<template>
  <UDashboardPanel id="products-edit">
    <template #header>
      <UDashboardNavbar :title="$t('edit')">
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
              <ProductsCategoriesForm
                :state="state"
                :categories="data?.meta?.categories"
                :loading="pending"
                :server-error="serverError"
              />
              <ProductsPriceForm :state="state" :server-error="serverError" />
            </div>

            <div class="xl:col-span-2 space-y-6">
              <ProductsInformationForm
                :state="state"
                :server-error="serverError"
              />
              <ProductsVariantsFormEdit :state="state" :is-edit="true" />
            </div>
          </div>

          <div class="flex items-center gap-3 pt-6 border-t dark:border-gray-700">
            <UButton
              type="submit"
              block
              size="lg"
              :loading="isLoading"
              icon="i-lucide-edit"
              :label="$t('edit')"
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
const route = useRoute();

useHead({
  title: () => t("edit"),
});

const schema = z.object({}).passthrough();

const { data, pending, error: fetchError } = await useApiFetch(
  `products/edit/${route.params.slug}`,
);

if (fetchError.value) {
  throw createError({ statusCode: 404, message: t("productNotFound") });
}

const state = ref({
  name_ar: "",
  name_en: "",
  description_ar: "",
  description_en: "",
  price: 0,
  status: false,
  variants: [],
  categories: [],
});

const serverError = ref(null);
const isLoading = ref(false);

function mapProductToState(productData) {
  return {
    name_en: productData.product.name.en,
    name_ar: productData.product.name.ar,
    description_ar: productData.product.description.ar,
    description_en: productData.product.description.en,
    price: productData.product.price,
    status: productData.product.status,
    variants: productData.product.variants.map((variant) => ({
      id: variant.id,
      color_name_ar: variant.color.name.ar,
      color_name_en: variant.color.name.en,
      color_code: variant.color.code,
      status: variant.status ?? true,
      images: variant.images.map((img) => ({
        id: img.id,
        url: img.image,
      })),
      newImages: [],
      _deleted_images: [],
    })),
    categories: productData.product.categories.map((cat) => cat.id),
  };
}

watch(
  data,
  (val) => {
    if (val) state.value = mapProductToState(val);
  },
  { immediate: true },
);

async function onSubmit() {
  isLoading.value = true;
  serverError.value = null;

  try {
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name_ar", state.value.name_ar);
    formData.append("name_en", state.value.name_en);
    formData.append("description_ar", state.value.description_ar);
    formData.append("description_en", state.value.description_en);
    formData.append("price", state.value.price);
    formData.append("status", state.value.status ? "1" : "0");

    state.value.categories.forEach((categoryId, index) => {
      formData.append(`categories[${index}]`, categoryId);
    });

    state.value.variants.forEach((variant, index) => {
      if (variant.id) formData.append(`variants[${index}][id]`, variant.id);
      formData.append(`variants[${index}][color_name_ar]`, variant.color_name_ar);
      formData.append(`variants[${index}][color_name_en]`, variant.color_name_en);
      formData.append(`variants[${index}][color_code]`, variant.color_code);
      formData.append(`variants[${index}][status]`, variant.status ? "1" : "0");

      variant.newImages?.forEach((file, imgIndex) => {
        formData.append(`variants[${index}][new_images][${imgIndex}]`, file);
      });

      const existingImages = variant.images?.filter(
        (img) => !variant._deleted_images?.includes(img.id),
      );
      existingImages?.forEach((img, imgIndex) => {
        formData.append(`variants[${index}][existing_images][${imgIndex}]`, img.id);
      });

      variant._deleted_images?.forEach((deletedId, delIndex) => {
        formData.append(`variants[${index}][deleted_images][${delIndex}]`, deletedId);
      });
    });

    const response = await useApiFetchRaw(`products/${data.value.product.id}`, {
      method: "POST",
      body: formData,
    });

    const result = typeof response === "object" && response !== null ? response : {};

    toast.add({
      title: result.message ?? t("updatedSuccessfully"),
      color: "success",
      icon: "i-lucide-check-circle",
    });

    navigateTo({ name: "admin-products" });
  } catch (err) {
    if (err?.status === 422) {
      serverError.value = err.data?.errors ?? null;
    }
    toast.add({
      title: t("error"),
      description: err?.message || t("somethingWentWrong"),
      color: "error",
      icon: "i-lucide-alert-circle",
    });
  } finally {
    isLoading.value = false;
  }
}
</script>
