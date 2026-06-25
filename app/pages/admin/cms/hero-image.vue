<template>
  <UDashboardPanel id="hero-slider">
    <template #header>
      <UDashboardNavbar :title="$t('heroImage')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UButton
            color="primary"
            icon="i-lucide-save"
            :loading="isSaving"
            :disabled="!isFile(state.image)"
            @click="saveImage"
          >
            {{ $t('save') }}
          </UButton>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
        <UFileUpload
          v-slot="{ open, removeFile }"
          v-model="state.image"
          accept="image/*"
        >
            <div class="relative rounded-xl max-w-[500px] overflow-hidden ">

              <!-- New file -->
              <img
                v-if="isFile(state.image)"
                :src="previewUrl"
                class="w-full h-auto object-cover"
              />

              <!-- Server image -->
              <NuxtImg
                v-else-if="heroImage?.data?.image"
                :src="heroImage.data.image"
                class="w-full h-full object-cover"
              />

              <!-- Empty -->
              <div
                v-else
                class="flex h-full items-center justify-center"
              >
                <UIcon name="i-lucide-image" class="size-16 text-muted/30" />
              </div>
              <!-- Dark gradient overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <!-- Top-right action buttons -->
              <div class="absolute top-3 right-3 flex gap-2">
                <UButton
                  icon="i-lucide-pencil"
                  size="xs"
                  color="neutral"
                  variant="solid"
                  class="backdrop-blur-sm bg-white/20 hover:bg-white/30 text-white border-0"
                  @click="open()"
                />
                <UButton
                  v-if="isFile(state.image)"
                  icon="i-lucide-x"
                  size="xs"
                  color="error"
                  variant="solid"
                  class="backdrop-blur-sm"
                  @click.stop="removeFile()"
                />
              </div>
            </div>
        </UFileUpload>
    </template>
  </UDashboardPanel>
</template>

<script setup>
const { t } = useI18n()
const toast = useToast()

useHead({ title: () => t('heroImage') })

const RESOURCE_PATH = 'cms/hero-image'
const isSaving = ref(false)

const { data: heroImage, refresh: refreshHeroImage } = await useApiFetch(RESOURCE_PATH, { lazy: true })

const state = ref({ image: null })

// SSR-safe File check
function isFile(value) {
  return typeof File !== 'undefined' && value instanceof File
}

// Reactive object URL
const previewUrl = computed(() => {
  return isFile(state.value.image)
    ? URL.createObjectURL(state.value.image)
    : null
})

// Revoke old object URL when file changes
watch(previewUrl, (newUrl, oldUrl) => {
  if (oldUrl) URL.revokeObjectURL(oldUrl)
})

onUnmounted(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

async function saveImage() {
  if (!isFile(state.value.image)) return

  isSaving.value = true   // ✅ start loading
  try {
    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('image', state.value.image)

    const response = await useApiFetchRaw(RESOURCE_PATH, {
      method: 'POST',
      body: formData,
    })

    // ✅ Reset file + refresh server image
    state.value.image = null
    await refreshHeroImage()

    toast.add({
      title: response?.message ?? t('savedSuccessfully'),
      color: 'success',
      icon: 'i-lucide-check-circle',
    })
  } catch (error) {
    const is422 = error?.status === 422
    toast.add({
      title: is422
        ? Object.values(error.data?.errors ?? {}).flat().join(', ')
        : t('errorOccurred'),
      color: 'error',
      icon: 'i-lucide-alert-circle',
    })
  } finally {
    isSaving.value = false  // ✅ always stop loading
  }
}
</script>
