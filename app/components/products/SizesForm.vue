<template>
  <!-- Sizes Card -->
  <UForm :schema="sizesSchema" :state="state" nested>
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-ruler" size="20" />
          <h3 class="font-semibold">{{ $t("sizes") }}</h3>
        </div>
      </template>

      <UFormField
        :error="serverError?.sizes?.[0]"
        name="sizes"
      >
        <UCheckboxGroup
          v-model="state.sizes"
          :items="SIZES"
          indicator="hidden"
          variant="card"
          size="xs"
          orientation="horizontal"
          :ui="{ fieldset: 'flex-wrap gap-2' }"
        />
      </UFormField>
    </UCard>
  </UForm>
</template>

<script setup>
import * as z from "zod";

const SIZES = ["4XL", "3XL", "2XL", "XL", "LG", "M", "S", "XS", "2XS"];

const sizesSchema = z.object({
  sizes: z.array(z.string()).optional(),
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
