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

      <div class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormField
            :error="serverError?.name_en?.[0]"
            name="name_en"
            required
            class="w-full"
            :label="$t('name') +' EN'"
          >
            <UInput class="w-full" v-model="state.name_en"  />
          </UFormField>

          <UFormField
            :error="serverError?.name_ar?.[0]"
            name="name_ar"
            required
            class="w-full"
            :label="$t('name')"
          >
            <UInput class="w-full" v-model="state.name_ar"  dir="rtl" />
          </UFormField>
        </div>

        <div class="flex flex-col gap-4">
          <UFormField :error="serverError?.description_en?.[0]" :label="$t('description') + ' EN'" name="description_ar" required>
            <UEditor v-model="state.description_en" :placeholder="$t('descriptionPlaceholder')" class="w-full min-h-64 border border-[#e7e3e4] rounded-xl " v-slot="{ editor }">
              <UEditorToolbar :editor="editor" :items="editorItems" class="overflow-x-auto items-center justify-center xl:p-4 p-3 rounded-lg mb-5" />
            </UEditor>
          </UFormField>


          <UFormField :error="serverError?.description_ar?.[0]" :label="$t('description')" name="description_ar" required>
            <UEditor v-model="state.description_ar" :placeholder="$t('descriptionPlaceholder')" class="w-full min-h-64 border border-[#e7e3e4] rounded-xl " v-slot="{ editor }">
              <UEditorToolbar :editor="editor" :items="editorItems" class="overflow-x-auto items-center justify-center xl:p-4 p-3 rounded-lg mb-5" />
            </UEditor>
          </UFormField>
        </div>
      </div>
    </UCard>
  </UForm>
</template>

<script setup>
import * as z from "zod";

const { t } = useI18n();

const informationSchema = z.object({
  name_en: z.string().min(1, t("fieldRequired")),
  name_ar: z.string().min(1, t("fieldRequired")),
  description_en: z.string().min(1, t("fieldRequired")),
  description_ar: z.string().min(1, t("fieldRequired")),
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
