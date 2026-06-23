<template>
  <UModal v-model:open="open" :title="$t('addNewFAQ')">
    <UButton
      class="cursor-pointer"
      :label="$t('addNewFAQ')"
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
        <div class="space-y-4">
          <!-- Name -->
          <UFormField required :label="$t('question')" name="question">
            <UInput
              v-model="state.question"
              class="w-full"
            />
          </UFormField>

          <!-- Source -->
          <UFormField required :label="$t('answer')" name="answer">
            <UTextarea
              v-model="state.answer"
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
  question: z.string().min(2, t("fieldRequired")),
  answer: z.string().min(2, t("fieldRequired")),
});
const open = ref(false);

type Schema = z.output<typeof schema>;

const state = ref({
  question: '',
  answer: '',
});

const serverError = ref<any | null>(null);
const isLoading = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  serverError.value = null;
  isLoading.value = true;
  try {
    const response: any = await useApiFetchRaw("cms/FAQ", {
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
      question: '',
      answer: '',
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
