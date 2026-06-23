<template>
  <UForm :schema="statusSchema" nested>
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon
            name="i-lucide-toggle-right"
            size="20"
            class="text-gray-600 dark:text-gray-400"
          />
          <h3 class="font-semibold">{{ $t("status") }}</h3>
        </div>
      </template>

      <UFormField name="status">
        <USwitch
          v-model="state.status"
          :label="state.status ? $t('active') : $t('inactive')"
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

const statusSchema = z.object({
  status: z.boolean(),
});
</script>
