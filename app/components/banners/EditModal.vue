<template>
  <UModal :title="$t('edit')">
    <template #body>
      <UForm
        :disabled="isLoading"
        :schema="schema"
        :state="state"
        class="space-y-5"
        @submit="onSubmit"
      >
          <UFormField name="statement" :label="$t('editStatement')">
            <UInput v-model="state.statement" class="w-full" />
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
            :label="$t('edit')"
            color="primary"
            variant="solid"
            icon="i-lucide-edit-2"
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
  banner: any;
  refresh: Function;

}>();

const schema = z.object({
  statement: z.string().min(1, t("fieldRequired")),
});

type Schema = z.output<typeof schema>;
const isLoading = ref(false);

const state = ref<Schema>({
  statement: props.banner.statement,
});

const serverError = ref<any | null>(null);


async function onSubmit(event: FormSubmitEvent<Schema>) {
  serverError.value = null;
  isLoading.value = true;
  try {
    const response: any = await useApiFetchRaw(
      `marketing/banners/${props.banner.id}`,
      {
        method: "put",
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
  } finally {
    isLoading.value = false;
  }
}
</script>
