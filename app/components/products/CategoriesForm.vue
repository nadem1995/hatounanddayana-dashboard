<template>
  <UForm :schema="categoriesSchema" nested>
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon
            name="i-lucide-picture-in-picture-2"
            size="20"
            class="text-gray-600 dark:text-gray-400"
          />
          <h3 class="font-semibold">{{ $t("categories") }}</h3>
        </div>
      </template>

      <UFormField :error="serverError?.categories?.[0]" name="categories">
        <USelectMenu
          v-model="state.categories"
          :items="categories || []"
          :loading="loading"
          value-key="id"
          label-key="name"
          :placeholder="$t('selectCategories')"
          class="w-full"
          multiple
        >
          <template #item-label="{ item }">
            <div class="flex flex-col gap-1">
              <span>{{ item.name }}</span>
            </div>
          </template>
        </USelectMenu>
      </UFormField>
    </UCard>
  </UForm>
</template>

<script setup>
import * as z from "zod";
const { t } = useI18n();

const categoriesSchema = z.object({
  categories: z.array(z.number()).min(1, t("fieldRequired")),
});
const props = defineProps({
  state: {
    type: Object,
    required: true,
  },
  categories: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  serverError: {
    type: Object,
    default: null,
  },
});
</script>
