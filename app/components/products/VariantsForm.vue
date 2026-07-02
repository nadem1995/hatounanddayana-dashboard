<template>
  <UForm :schema="variantsSchema" nested>
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-palette" size="20" />
            <h3 class="font-semibold">{{ $t("productVariants") }}</h3>
          </div>
          <UButton
            icon="i-lucide-plus"
            size="sm"
            :label="$t('addVariant')"
            @click="addVariant"
          />
        </div>
      </template>

      <div v-if="props.state.variants?.length === 0" class="text-center py-8">
        <UIcon
          name="i-lucide-palette"
          class="w-12 h-12 text-gray-400 mx-auto mb-3"
        />
        <p class="text-sm text-gray-500">
          {{ $t("noVariantsAdded") }}
        </p>
        <p class="text-xs text-gray-400 mt-1">
          {{ $t("clickAddVariantToStart") }}
        </p>
      </div>

      <div v-else class="space-y-4">
        <UCard
          v-for="(variant, index) in props.state.variants"
          :key="index"
          :ui="{ body: 'space-y-4' }"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="w-15 h-15 rounded-lg border-2 border-gray-200 dark:border-gray-700"
                  :style="{
                    backgroundColor: variant.color_code || '#cccccc',
                  }"
                />
                <span class="font-semibold">
                  {{ $t("variant") }} ({{ index as number + 1 }})
                </span>
              </div>
              <UButton
                icon="i-lucide-trash-2"
                color="error"
                variant="ghost"
                class="cursor-pointer"
                @click="removeVariant(index as number)"
              />
            </div>
          </template>

          <div class="grid md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">

              <UFormField
                :label="$t('colorEn')"
                :name="`variants.${index}.color_name_en`"
                required
              >
                <UInput
                  v-model="variant.color_name_en"
                  icon="i-lucide-brush"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                :label="$t('colorAr')"
                :name="`variants.${index}.color_name_ar`"
                required
              >
                <UInput
                  v-model="variant.color_name_ar"
                  icon="i-lucide-brush"
                  class="w-full"
                  dir="rtl"
                />
              </UFormField>

              <UFormField
                label="HEX"
                :name="`variants.${index}.color_code`"
                required
              >
                <UInput
                  disabled
                  v-model="variant.color_code"
                  icon="i-lucide-hash"
                  class="w-full"
                />
              </UFormField>

            </div>
            <div class="flex flex-col gap-2">
              <UFormField
                :label="$t('colorCode')"
                :name="`variants.${index}.color_code`"
                required
              >
                <UColorPicker size="xl" v-model="variant.color_code" />
              </UFormField>

              <UFormField
                :label="$t('status')"
                :name="`variants.${index}.status`"
              >
                <USwitch
                  v-model="variant.status"
                  :label="variant.status ? $t('available') : $t('unavailable')"
                />
              </UFormField>
            </div>
          </div>

          <UFormField
            :name="`variants.${index}.images`"
            required
            :label="$t('productImages')"
          >
            <UFileUpload
              v-model="variant.images"
              accept="image/*"
              icon="i-lucide-image"
              :label="$t('dropImagesHere')"
              description="png , Jpg , webp"
              layout="grid"
              multiple
              :interactive="true"
              class="w-full min-h-48"
            >
              <template #actions="{ open }">
                <UButton
                  :label="$t('selectImages')"
                  icon="i-lucide-upload"
                  color="neutral"
                  variant="outline"
                  @click="open()"
                />
              </template>

              <template #files-top="{ open, files }">
                <div
                  v-if="files?.length"
                  class="mb-2 flex items-center justify-between"
                >
                  <p class="font-bold">
                    {{ $t("images") }} ({{ files?.length }})
                  </p>

                  <UButton
                    icon="i-lucide-plus"
                    :label="$t('addMore')"
                    color="neutral"
                    variant="outline"
                    class="-my-2"
                    @click="open()"
                  />
                </div>
              </template>
            </UFileUpload>
          </UFormField>
        </UCard>
      </div>
    </UCard>
  </UForm>
</template>

<script setup lang="ts">
import * as z from "zod";
const { t } = useI18n();

const props = defineProps<{
  state: any;
}>();

const variantsSchema = z.object({
  variants: z.array(
    z.object({
      color_name_en: z.string().min(1, t("fieldRequired")),
      color_name_ar: z.string().min(1, t("fieldRequired")),
      color_code: z
        .string()
        .regex(/^#([0-9A-F]{3}){1,2}$/i, t("invalidColorCode")),
      status: z.boolean(),
      images: z
        .array(
          z.instanceof(File, {
            message: t("fieldRequired"),
          }),
        )
        .min(1, t("fieldRequired")),
    }),
  ),
});

function addVariant() {
  if (!props.state.variants) {
    props.state.variants = [];
  }
  props.state.variants.push({
    color_name_en: "",
    color_name_ar: "",
    color_code: "#000000",
    status: true,
    images: [],
  });
}

function removeVariant(index: number) {
  props.state.variants.splice(index, 1);
}
</script>
