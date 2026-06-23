<template>
  <UModal v-model:open="open" :title="$t('editSocialMedia')">
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
          <UFormField :error="serverError?.name?.[0]" required :label="$t('name')" name="name">
            <UInput v-model="state.name" class="w-full" />
          </UFormField>

          <UFormField :error="serverError?.url?.[0]" required :label="$t('url')" name="url">
            <UInput type="url" placeholder="https://example.com" v-model="state.url" class="w-full" />
          </UFormField>


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
  socialMedia: any;
}>();

const schema = z.object({
  name: z.string().min(2, t("fieldRequired")),
  url: z.string().url(t('invalidURL')),
  status:z.boolean()
});
const open = ref(false);

type Schema = z.output<typeof schema>;

const state = ref({
  name: props.socialMedia.name,
  url: props.socialMedia.url,
  status:props.socialMedia.status
});

const serverError = ref<any | null>(null);
const isLoading = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  serverError.value = null;
  isLoading.value = true;
  try {
    const response: any = await useApiFetchRaw(
      `settings/social-media/${props.socialMedia.id}`,
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
