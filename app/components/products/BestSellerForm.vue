<template>
  <UForm :schema="bestSellerSchema" nested>
    <UCard>
                <template #header>
                  <div class="flex items-center gap-2">
                    <UIcon
                      name="i-lucide-trophy"
                      size="20"
                      class="text-gray-600 dark:text-gray-400"
                    />
                    <h3 class="font-semibold">{{ $t("bestSeller") }}</h3>
                  </div>
                </template>

                <UFormField
                  name="is_best_seller"
                >
                  <USwitch
                    v-model="state.is_best_seller"
                    :label="
                      state.is_best_seller ? $t('active') : $t('inactive')
                    "
                  />
                </UFormField>
              </UCard>
  </UForm>
</template>

<script setup lang="ts">
import * as z from "zod";

const props = defineProps<{
  state: any;
}>();

const bestSellerSchema = z.object({
  status: z.boolean(),
});
</script>
