<template>
  <UModal v-model:open="open" :title="$t('addNewCategory')">
    <UButton
      class="cursor-pointer"
      :label="$t('addNewCategory')"
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
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="col-span-2 space-y-4">
            <UFormField
              :error="serverError?.name_en?.[0]"
              required
              :label="$t('name') + ' EN'"
              name="name_en"
            >
              <UInput v-model="state.name_en" class="w-full" />
            </UFormField>
            <UFormField
              :error="serverError?.name_ar?.[0]"
              required
              :label="$t('name')"
              name="name_ar"
            >
              <UInput v-model="state.name_ar" class="w-full" />
            </UFormField>

          </div>
          <div class="col-span-1">
            <UFormField
              :error="serverError?.image?.[0]"
              required
              :label="$t('image')"
              name="image"
            >
              <UFileUpload
                v-model="state.image"
                accept="image/*"
                class="w-full"
              />
            </UFormField>
          </div>

          <UFormField
            :error="serverError?.status?.[0]"
            :label="$t('status')"
            name="status"
          >
            <USwitch v-model="state.status" />
          </UFormField>
        </div>

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
  refresh: Function;
}>();

const schema = z.object({
  name_en: z.string().min(2, $t("fieldRequired")),
  name_ar: z.string().min(2, $t("fieldRequired")),
  image: z.any().refine((file) => file instanceof File, t("fieldRequired")),
  status: z.boolean().default(true),
});
const open = ref(false);

type Schema = z.output<typeof schema>;

const state = ref({
  name_en: "",
  name_ar:"",
  image: undefined,
  status: true,
});

const serverError = ref<any | null>(null);
const isLoading = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  serverError.value = null;
  isLoading.value = true;
  try {
    const formData = new FormData();
    formData.append("name_ar", state.value.name_ar);
    formData.append("name_en", state.value.name_en);
    if (state.value.image) {
      formData.append("image", state.value.image);
    }
    formData.append("status", state.value.status ? "1" : "0");
    const response: any = await useApiFetchRaw("categories", {
      method: "POST",
      body: formData,
    });
    await props.refresh();
    open.value = false;

    toast.add({
      title: response.message,
      color: "success",
      icon: "i-lucide-check-circle",
    });

    state.value = {
      name_en: "",
      name_ar: "",
      image: undefined,
      status: true,
    };
  } catch (error: any) {
    if (error.status === 422) {
      serverError.value = error.data.errors;
    }
  } finally {
    isLoading.value = false;
  }
}
</script>
