<template>
  <UModal v-model:open="open" :title="$t('addNewTestimonial')">
    <UButton
      class="cursor-pointer"
      :label="$t('addNewTestimonial')"
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
        <div class="grid grid-cols-1 xs:grid-cols-3 gap-4">
          <!-- Name -->
          <UFormField required :label="$t('name')" name="name">
            <UInput
              v-model="state.name"
              class="w-full"
            />
          </UFormField>

          <!-- Rating -->
          <UFormField required :label="$t('rating')" name="rating">
            <USelect
              v-model="state.rating"
              class="w-full"
              :items="[1, 2, 3, 4, 5]"
            />
          </UFormField>

          <!-- Message (full width) -->
          <UFormField
          required
            :label="$t('message') + ' EN'"
            name="message_en"
            class="md:col-span-3"
          >
            <UTextarea
              v-model="state.message_en"
              class="w-full"
              autoresize
              :rows="3"
            />
          </UFormField>




          <UFormField
            required
            :label="$t('message')"
            name="message_ar"
            class="md:col-span-3"
          >
            <UTextarea
              v-model="state.message_ar"
              class="w-full"
              autoresize
              :rows="3"
            />
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
  name: z.string().min(2, t("fieldRequired")),
  message_en: z.string().min(2, t("fieldRequired")),
  message_ar: z.string().min(2, t("fieldRequired")),
  rating: z.number(t("fieldRequired")).min(1).max(5),
});
const open = ref(false);

type Schema = z.output<typeof schema>;

const state = ref({
  name: '',
  message_en: '',
  message_ar: '',
  rating: 5,
});

const serverError = ref<any | null>(null);
const isLoading = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  serverError.value = null;
  isLoading.value = true;
  try {
    const response: any = await useApiFetchRaw("cms/testimonials", {
      method: "POST",
      body: event.data,
    });
    await props.refresh();
    open.value = false;

    toast.add({
      title: response.message,
      color: "success",
      icon: "i-lucide-check-circle",
    });

    state.value = {
      name: '',
      message_en: '',
      message_ar: '',

      rating: 5,
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
