<template>
  <UModal v-model:open="open" :title="$t('editSlide')">
    <UButton
      class="cursor-pointer"
      :label="$t('editSlide')"
      icon="i-lucide-edit-2"
      color="neutral"
      variant="subtle"
    />

    <template #body>
      <UForm
        :disabled="isLoading"
        :schema="schema"
        :state="state"
        class="space-y-5"
        @submit="onSubmit"
      >
        <!-- Current Image Preview -->
        <div v-if="props.slide?.image && !state.image" class="space-y-1">
          <p class="text-sm text-muted">{{ $t('currentImage') }}</p>
          <img
            :src="props.slide.image"
            :alt="$t('currentImage')"
            class="w-full h-40 object-cover rounded-lg border border-default"
          />
        </div>

        <UFormField required :label="$t('image')" name="image">
          <UFileUpload
            v-model="state.image"
            accept="image/*"
            icon="i-lucide-image"
            :label="$t('dropImageHere')"
            description="PNG, JPG, GIF, WEBP (max. 2MB)"
            class="w-full min-h-40"
          />
        </UFormField>

        <USeparator color="primary" type="solid" />

        <div class="flex gap-2">
          <UButton
            block
            :label="$t('cancel')"
            color="neutral"
            icon="i-lucide-x"
            variant="subtle"
            @click="useOverlay().closeAll()"
          />
          <UButton
            loading-auto
            block
            :label="$t('save')"
            color="primary"
            variant="solid"
            icon="i-lucide-save"
            type="submit"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const toast = useToast();
const { t } = useI18n();

const props = defineProps<{
  slide: any;
  refresh: () => Promise<void>;
}>();

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_TYPES = ["image/png", "image/jpg", "image/jpeg", "image/gif", "image/webp"];

// Image is optional in edit mode — only validate if a new file is selected
const schema = z.object({
  image: z
    .instanceof(File, { message: t("fieldRequired") })
    .refine((file) => file.size <= MAX_FILE_SIZE, t("fileTooLarge"))
    .refine((file) => ACCEPTED_TYPES.includes(file.type), t("invalidFileType"))
    .optional(),
});

type Schema = z.output<typeof schema>;

const open = ref(false);
const isLoading = ref(false);

const state = reactive<{ image: File | undefined }>({
  image: undefined,
});

function resetState() {
  state.image = undefined;
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true;

  try {
    const formData = new FormData();
    formData.append("_method", "PUT"); // Laravel method spoofing
    if (event.data.image) {
      formData.append("image", event.data.image);
    }

    const response: any = await useApiFetchRaw(`cms/hero-slider/${props.slide.id}`, {
      method: "POST", // POST with _method: PUT for FormData
      body: formData,
    });

    await props.refresh();

    toast.add({
      title: response.message,
      color: "success",
      icon: "i-lucide-check-circle",
    });

    resetState();
    open.value = false;
    useOverlay().closeAll();
  } catch (error: any) {
    toast.add({
      title: t("error"),
      description:
        error.status === 422
          ? Object.values(error.data.errors).flat().join(", ")
          : error.message || t("somethingWentWrong"),
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
}
</script>