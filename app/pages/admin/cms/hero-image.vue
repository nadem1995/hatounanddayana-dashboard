<template>
  <UDashboardPanel id="hero-slider" :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar :title="$t('heroImage')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <div class="flex items-center gap-2">
            <UButton
              v-if="heroImage?.url && !fileValue"
              color="error"
              variant="soft"
              icon="i-lucide-trash-2"
              :loading="isDeleting"
              @click="deleteImage"
            >
              {{ $t('delete') }}
            </UButton>
            <UButton
              v-if="fileValue"
              color="neutral"
              variant="outline"
              icon="i-lucide-x"
              :disabled="isSaving"
              @click="cancelSelection"
            >
              {{ $t('cancel') }}
            </UButton>
            <UButton
              color="primary"
              icon="i-lucide-save"
              :loading="isSaving"
              :disabled="!fileValue"
              @click="saveImage"
            >
              {{ $t('save') }}
            </UButton>
          </div>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="max-w-4xl mx-auto space-y-6">

        <!-- Dimension info badge -->
        <div class="flex items-center gap-2 text-sm text-muted">
          <UIcon name="i-lucide-info" class="size-4 shrink-0" />
          <span>{{ $t('recommendedSize') }}: <strong>1200 × 570 px</strong></span>
        </div>

        <!-- Current Image Preview -->
        <UCard v-if="heroImage?.url && !fileValue">
          <template #header>
            <div class="flex items-center justify-between">
              <p class="font-semibold text-highlighted">{{ $t('currentImage') }}</p>
              <UButton
                size="sm"
                variant="soft"
                icon="i-lucide-pencil"
                @click="editMode = true"
              >
                {{ $t('changeImage') }}
              </UButton>
            </div>
          </template>

          <div class="relative w-full overflow-hidden rounded-lg bg-muted/30">
            <div class="w-full" style="aspect-ratio: 1200 / 570">
              <img
                :src="heroImage.url"
                alt="Hero Image"
                class="w-full h-full object-cover"
              />
            </div>
          </div>

          <!-- Image meta -->
          <template #footer>
            <div class="flex items-center gap-4 text-sm text-muted">
              <span class="flex items-center gap-1">
                <UIcon name="i-lucide-image" class="size-4" />
                {{ heroImage.filename ?? $t('heroImage') }}
              </span>
            </div>
          </template>
        </UCard>

        <!-- File Upload (shown when no image exists OR edit mode is on) -->
        <UCard v-if="!heroImage?.url || editMode">
          <template #header>
            <p class="font-semibold text-highlighted">
              {{ heroImage?.url ? $t('changeImage') : $t('uploadImage') }}
            </p>
          </template>

          <!-- New Image Preview -->
          <div v-if="previewUrl" class="mb-5">
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm font-medium text-muted">{{ $t('preview') }}</p>
              <UBadge color="warning" variant="soft">{{ $t('notSavedYet') }}</UBadge>
            </div>
            <div class="relative w-full overflow-hidden rounded-lg border border-default">
              <div class="w-full" style="aspect-ratio: 1200 / 570">
                <img
                  :src="previewUrl"
                  alt="Preview"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>

            <!-- Dimension warning -->
            <div v-if="dimensionWarning" class="mt-3">
              <UAlert
                color="warning"
                variant="soft"
                icon="i-lucide-triangle-alert"
                :title="$t('dimensionWarning')"
                :description="`${$t('uploadedSize')}: ${imageDimensions.width} × ${imageDimensions.height}px — ${$t('recommendedSize')}: 1200 × 570px`"
              />
            </div>
          </div>

          <UFileUpload
            v-model="fileValue"
            accept="image/*"
            icon="i-lucide-image"
            :label="$t('dropImageHere')"
            description="PNG, JPG, WEBP (recommended: 1200 × 570 px)"
            class="w-full"
            :ui="{ base: 'min-h-48' }"
          />
        </UCard>

        <!-- API error -->
        <UAlert
          v-if="error"
          color="error"
          variant="soft"
          icon="i-lucide-circle-x"
          :title="$t('errorLoadingImage')"
          :description="error.message"
        />

      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup>
const { t } = useI18n();

useHead({
  title: () => t('heroImage'),
});

const RESOURCE_PATH = 'cms/hero-image';

// ── State ────────────────────────────────────────────────
const fileValue = ref(null);
const previewUrl = ref(null);
const isSaving = ref(false);
const isDeleting = ref(false);
const editMode = ref(false);
const imageDimensions = ref({ width: 0, height: 0 });

// ── Computed ─────────────────────────────────────────────
const dimensionWarning = computed(() =>
  imageDimensions.value.width > 0 &&
  (imageDimensions.value.width !== 1200 || imageDimensions.value.height !== 570)
);

// ── Data fetching ─────────────────────────────────────────
const {
  data: heroImage,
  error,
  refresh,
} = await useApiFetch(RESOURCE_PATH, { lazy: true });

// ── Watch fileValue (File | null from UFileUpload v-model) ─
watch(fileValue, (file) => {
  if (!file) {
    previewUrl.value = null;
    imageDimensions.value = { width: 0, height: 0 };
    return;
  }

  // Generate preview URL
  const reader = new FileReader();
  reader.onload = (e) => {
    previewUrl.value = e.target.result;

    // Check actual dimensions
    const img = new Image();
    img.onload = () => {
      imageDimensions.value = { width: img.width, height: img.height };
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file); // file is guaranteed to be a File/Blob
});

// ── Actions ───────────────────────────────────────────────
function cancelSelection() {
  fileValue.value = null;
  previewUrl.value = null;
  imageDimensions.value = { width: 0, height: 0 };
  editMode.value = false;
}

async function saveImage() {
  if (!fileValue.value) return;
  isSaving.value = true;
  try {
    const formData = new FormData();
    formData.append('image', fileValue.value);

    await useApiFetchRaw(RESOURCE_PATH, {
      method: 'POST',
      body: formData,
    });

    cancelSelection();
    await refresh();
  } catch (err) {
    console.error(err);
  } finally {
    isSaving.value = false;
  }
}

async function deleteImage() {
  isDeleting.value = true;
  try {
    await useApiFetchRaw(RESOURCE_PATH, { method: 'DELETE' });
    await refresh();
  } catch (err) {
    console.error(err);
  } finally {
    isDeleting.value = false;
  }
}
</script>
