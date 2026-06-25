<template>
  <UModal v-model:open="open" :title="$t('editFAQ')">

    <template #body>
      <UForm
        :disabled="isLoading"
        :schema="schema"
        :state="state"
        class="space-y-5"
        @submit="onSubmit"
      >
        <div class="space-y-4">
          <UFormField required :label="$t('question') + ' EN'" name="question_en">
            <UInput v-model="state.question_en" class="w-full" />
          </UFormField>


          <UFormField
            required
            :label="$t('answer') + ' EN'"
            name="answer_en"
            class="md:col-span-3"
          >
            <UTextarea
              v-model="state.answer_en"
              class="w-full"
              autoresize
              :rows="3"
            />
          </UFormField>




          <UFormField required :label="$t('question')" name="question_ar">
            <UInput v-model="state.question_ar" class="w-full" />
          </UFormField>
          <UFormField
            required
            :label="$t('answer')"
            name="message"
            class="md:col-span-3"
          >
            <UTextarea
              v-model="state.answer_ar"
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
  FAQ: any;
}>();

const schema = z.object({
  question_en: z.string().min(2, t("fieldRequired")),
  answer_en: z.string().min(2, t("fieldRequired")),
  question_ar: z.string().min(2, t("fieldRequired")),
  answer_ar: z.string().min(2, t("fieldRequired")),
});
const open = ref(false);

type Schema = z.output<typeof schema>;

const state = ref({
  question_en: props.FAQ.question.en,
  answer_en: props.FAQ.answer.en,
  question_ar: props.FAQ.question.ar,
  answer_ar: props.FAQ.answer.ar,
});

const serverError = ref<any | null>(null);
const isLoading = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  serverError.value = null;
  isLoading.value = true;
  try {
    const response: any = await useApiFetchRaw(
      `cms/FAQ/${props.FAQ.id}`,
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
