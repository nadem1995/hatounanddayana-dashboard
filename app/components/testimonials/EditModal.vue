<template>
  <UModal v-model:open="open" :title="$t('editTestimonial')">
    <template #body>
      <UForm
        :disabled="isLoading"
        :schema="schema"
        :state="state"
        class="space-y-5"
        @submit="onSubmit"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Name -->
          <UFormField required :label="$t('name')" name="name" class="w-full">
            <UInput
              v-model="state.name"
              class="w-full"
            />
          </UFormField>

          <!-- Source -->
          <UFormField required :label="$t('source')" name="source">
            <UInput
              v-model="state.source"
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
            :label="$t('message')"
            name="message"
            class="md:col-span-3"
          >
            <UTextarea
              v-model="state.message"
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
  refresh: Function;
  testimonial: any;
}>();

const schema = z.object({
  name: z.string().min(2, t("fieldRequired")),
  message: z.string().min(2, t("fieldRequired")),
  source: z.string().min(2, t("fieldRequired")),
  rating: z.number(t("fieldRequired")).min(1).max(5),
});
const open = ref(false);

type Schema = z.output<typeof schema>;

const state = ref({
  name: props.testimonial.name,
  message: props.testimonial.message,
  source: props.testimonial.source,
  rating: props.testimonial.rating,
});

const serverError = ref<any | null>(null);
const isLoading = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  serverError.value = null;
  isLoading.value = true;
  try {
    const response: any = await useApiFetchRaw(
      `cms/testimonials/${props.testimonial.id}`,
      {
        method: "PUT",
        body: event.data,
      },
    );
    await props.refresh();
    useOverlay().closeAll();

    toast.add({
      title: response.message,
      color: "success",
      icon: "i-lucide-check-circle",
    });
  } catch (error: any) {
    if (error.status === 422) {
      serverError.value = error.data.errors;
    }
  } finally {
    isLoading.value = false;
  }
}
</script>
