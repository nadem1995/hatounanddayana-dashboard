<template>
  <UForm :schema="priceSchema" nested>
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-wallet" size="20" />
          <h3 class="font-semibold">{{ $t("price") }}</h3>
        </div>
      </template>

      <UFormField
        :label="$t('price')"
        :error="serverError?.price?.[0]"
        name="price"
        required
      >
        <UInput
          v-model.number="state.price"
          type="number"
          step="0.01"
          icon="i-lucide-dollar-sign"
          class="w-full"
        />
      </UFormField>
    </UCard>
  </UForm>
</template>

<script setup>
import * as z from "zod";
const { t } = useI18n();

const priceSchema = z.object({
  price: z.number().positive(t("fieldRequired")),
});

const props = defineProps({
  state: {
    type: Object,
    required: true,
  },
  sypRate: {
    type: Number,
    default: 0,
  },
  serverError: {
    type: Object,
    default: null,
  },
});
</script>
