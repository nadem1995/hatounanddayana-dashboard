<template>
  <UForm :schema="informationSchema" nested>
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-info" size="20" />
          <h3 class="font-semibold">
            {{ $t("productInformation") }}
          </h3>
        </div>
      </template>

      <UFormField
        :error="serverError?.name?.[0]"
        name="name"
        required
        class="w-full"
        :label="$t('name')"
      >
        <UInput class="w-full" v-model="state.name" icon="i-lucide-tag" />
      </UFormField>

      <UFormField
        :label="$t('description')"
        :error="serverError?.description?.[0]"
        name="description"
        class="w-full"
        required
      >
        <UTextarea class="w-full" v-model="state.description" :rows="5" />
      </UFormField>
    </UCard>
  </UForm>
</template>

<script setup>
import * as z from "zod";

const { t } = useI18n();

const informationSchema = z.object({
  name: z.string().min(1, t("fieldRequired")),
  description: z.string().min(1, t("fieldRequired")),
});

const props = defineProps({
  state: {
    type: Object,
    required: true,
  },
  serverError: {
    type: Object,
    default: null,
  },
});
</script>
