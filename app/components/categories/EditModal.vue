<template>
  <UModal :title="$t('edit')">
    <template #body>
      <UForm
        :disabled="isLoading"
        :schema="schema"
        :state="state"
        class="space-y-5"
        @submit="onSubmit"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="col-span-2 space-y-4">
            <UFormField
              :error="serverError?.name?.[0]"
              required
              :label="$t('name')"
              name="name"
            >
              <UInput v-model="state.name" class="w-full" />
            </UFormField>



             <UFormField
              :error="serverError?.description?.[0]"
              required
              :label="$t('description ')"
              name="description "
            >
              <UInput v-model="state.description" class="w-full" />
            </UFormField>
          </div>

          <div class="col-span-1">
            <UFormField
              :error="serverError?.image?.[0]"
              required
              :label="$t('image')"
              name="image"
            >
              <UFileUpload
                v-slot="{ open, removeFile }"
                v-model="state.image"
                accept="image/*"
              >
                <div class="space-y-3">
                  <!-- Image Preview -->
                  <div
                    class="relative w-full aspect-square rounded-lg overflow-hidden border border-default"
                  >
                    <img
                      v-if="state.image"
                      :src="createObjectUrl(state.image)"
                      :alt="$t('preview')"
                      class="w-full h-full object-cover"
                    />
                    <img
                      v-else
                      :src="category.image"
                      :alt="category.name"
                      class="w-full h-full object-cover"
                    />
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex gap-2">
                    <UButton
                      :label="
                        state.image ? $t('changeImage') : $t('uploadImage')
                      "
                      color="neutral"
                      variant="outline"
                      icon="i-lucide-upload"
                      size="sm"
                      block
                      @click="open()"
                    />
                    <UButton
                      v-if="state.image"
                      icon="i-lucide-x"
                      color="error"
                      variant="outline"
                      size="sm"
                      @click="removeFile()"
                    />
                  </div>

                  <!-- File Info -->
                  <p v-if="state.image" class="text-xs text-muted truncate">
                    {{ state.image.name }}
                  </p>
                </div>
              </UFileUpload>
            </UFormField>
          </div>

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
            :label="$t('edit')"
            color="primary"
            variant="solid"
            icon="i-lucide-edit-2"
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
  category: any;
}>();

const schema = z.object({
  name: z.string().min(2, t("fieldRequired")),
  description: z.string().optional(),
  image: z.any().optional(), // Make optional since we have existing image
  status: z.boolean().default(true),
});

type Schema = z.output<typeof schema>;
const isLoading = ref(false);

const state = ref<Schema>({
  name: props.category.name,
  description: props.category.description || "",
  image: undefined,
  status: props.category.status,
});

const serverError = ref<any | null>(null);

function createObjectUrl(file: File): string {
  return URL.createObjectURL(file);
}

// Clean up object URLs to prevent memory leaks
onUnmounted(() => {
  if (state.value.image instanceof File) {
    URL.revokeObjectURL(createObjectUrl(state.value.image));
  }
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  serverError.value = null;
  isLoading.value = true;
  try {
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name", state.value.name);
    formData.append("description ", state.value.description?? '' );


    // Only append image if user uploaded a new one
    if (state.value.image instanceof File) {
      formData.append("image", state.value.image);
    }

    formData.append("status", state.value.status ? "1" : "0");

    const response: any = await useApiFetchRaw(
      `categories/${props.category.id}`,
      {
        method: "POST",
        body: formData,
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
    } else {
      toast.add({
        title: t("errorOccurred"),
        color: "error",
        icon: "i-lucide-alert-circle",
      });
    }
  } finally {
    isLoading.value = false;
  }
}
</script>
