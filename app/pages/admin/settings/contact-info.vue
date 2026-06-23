<template>
  <UForm
    :disabled="isLoading"
    :schema="schema"
    :state="state"
    class="space-y-5"
    @submit="onSubmit"
  >
    <UFormField
      :error="serverError?.phone?.[0]"
      required
      :label="$t('phone')"
      name="phone"
    >
      <UInput v-model="state.phone" class="w-full" />
    </UFormField>

    <USeparator color="primary" type="solid" />
    <UButton
      loading-auto
      block
      :label="$t('save')"
      color="primary"
      variant="solid"
      icon="i-lucide-save"
      type="submit"
    />
  </UForm>
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
  phone: z.string().min(2, $t("fieldRequired")),
});
const open = ref(false);

type Schema = z.output<typeof schema>;

const state = ref({
  phone: "",
});

const serverError = ref<any | null>(null);
const isLoading = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  serverError.value = null;
  isLoading.value = true;
  try {
    const formData = new FormData();
    formData.append("phone", state.value.phone);
    const response: any = await useApiFetchRaw("contact-info", {
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
      phone: "",
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
