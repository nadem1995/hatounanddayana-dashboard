<template>
  <UDashboardPanel id="hero-slider" :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar :title="$t('heroImage')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right> </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="grid grid-cols-12 gap-5">
        <UFileUpload
          v-model="fileValue"
          size="xl"
          class="col-span-6 w-full h-full"
          variant="area"
          :label="$t('dropImagesHere')"
        />
        
        <div v-if="!error" class="relative col-span-6">
          <div class="absolute p-2 flex w-full justify-between">
            <UButton
            @click="deleteImage"
            icon="i-lucide-trash"
            :label="$t('delete')"
          />
          <UBadge :label="$t('existingImages')"/>
          </div>
          <img class="shadow" :src="heroImage.data.image" />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup>
const { t } = useI18n();

useHead({
  title: () => t("heroImage"),
});

const RESOURCE_PATH = "cms/hero-image";

const fileValue = ref(null);

const {
  data: heroImage,
  pending,
  refresh,
  error
} = await useApiFetch(`${RESOURCE_PATH}`, { lazy: true });

/* const isLoading = ref(false);

async function deleteImage() {
  isLoading.value = true;
  try {
    const response = await useApiFetchRaw("categories", {
      method: "POST",
      body: formData,
    });
    await 
  } catch (error) {
    if (error.status === 422) {
      console.log(error);
      
    }
  } finally {
    isLoading.value = false;
  }
} */


async function deleteImage(params) {
  try {
    const response = useApiFetchRaw(`${RESOURCE_PATH}`)
  } catch (error) {
    
  }
}
</script>
