<template>
  <UModal v-model:open="open" :title="$t('addNewSlide')">
    <UButton
      class="cursor-pointer"
      :label="$t('addNewSlide')"
      icon="i-lucide-plus"
    />

    <template #body>
      <UForm
        :disabled="isLoading"
        :schema="schema"
        :state="state"
        class="space-y-5"
        @submit="onSubmit"
      >
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
            @click="open = false"
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
  refresh: () => Promise<void>;
}>();

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_TYPES = ["image/png", "image/jpg", "image/jpeg", "image/gif", "image/webp"];

const schema = z.object({
  image: z
    .instanceof(File, { message: t("fieldRequired") })
    .refine((file) => file.size <= MAX_FILE_SIZE, t("fileTooLarge"))
    .refine((file) => ACCEPTED_TYPES.includes(file.type), t("invalidFileType")),
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
    formData.append("image", event.data.image);
    const response: any = await useApiFetchRaw("cms/hero-slider", {
      method: "POST",
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
