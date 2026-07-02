<template>
  <UDashboardPanel id="pages-edit">
    <template #header>
      <UDashboardNavbar :title="$t('editPage')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UButton
            :label="$t('pages')"
            icon="i-lucide-files"
            :to="{ name: 'admin-pages' }"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-4 sm:p-6">
        <UForm
          :schema="schema"
          :state="state"
          :disabled="isLoading"
          @submit="onSubmit"
        >
          <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
              <ProductsStatusForm :state="state" />


            <!-- Main Content -->
            <div class="xl:col-span-2 space-y-6">

              <!-- Titles -->
              <UCard>
                <template #header>
                  <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-languages" class="size-4 text-(--ui-text-muted)" />
                    <p class="font-semibold text-(--ui-text-highlighted)">
                      {{ $t('title') }}
                    </p>
                  </div>
                </template>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <UFormField :label="$t('title') + ' EN'" name="title_en" required>
                    <UInput v-model="state.title_en"  class="w-full" />
                  </UFormField>

                  <UFormField :label="$t('title') + ' AR'" name="title_ar" required>
                    <UInput v-model="state.title_ar"  dir="rtl" class="w-full" />
                  </UFormField>
                </div>
              </UCard>

              <!-- Content EN -->
              <UCard>
                <template #header>
                  <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-file-text" class="size-4 text-(--ui-text-muted)" />
                    <p class="font-semibold text-(--ui-text-highlighted)">
                      {{ $t('content') + ' EN' }}
                    </p>
                  </div>
                </template>

                <UFormField name="content_en" required>
                  <UEditor v-model="state.content_en" :placeholder="$t('contentPlaceholder')" class="w-full min-h-64" v-slot="{ editor }">
                    <UEditorToolbar :editor="editor" :items="editorItems" class="overflow-x-auto items-center justify-center xl:p-4 p-3 rounded-lg mb-5" />
                  </UEditor>
                </UFormField>
              </UCard>

              <!-- Content AR -->
              <UCard>
                <template #header>
                  <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-file-text" class="size-4 text-(--ui-text-muted)" />
                    <p class="font-semibold text-(--ui-text-highlighted)">
                      {{ $t('content') + ' AR' }}
                    </p>
                  </div>
                </template>

                <UFormField name="content_ar" required>
                  <UEditor v-model="state.content_ar" :placeholder="$t('contentPlaceholder')" class="w-full min-h-64" v-slot="{ editor }">
                    <UEditorToolbar :editor="editor" :items="editorItems" class="items-center justify-center overflow-x-auto xl:p-4 p-3 rounded-lg mb-5" />
                  </UEditor>
                </UFormField>
              </UCard>

            </div>
          </div>

          <USeparator class="my-5"/>
          <UButton
            type="submit"
            block
            :loading-auto="true"
            icon="i-lucide-edit"
            :label="$t('edit')"
          />
        </UForm>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup>
import * as z from "zod";

const { t } = useI18n();
const toast = useToast();
const route = useRoute();

useHead({
  title: () => t("editPage"),
});

const schema = z.object({
  title_en: z.string().min(1),
  title_ar: z.string().min(1),
  content_en: z.string().min(1),
  content_ar: z.string().min(1),
});

const state = ref({
  title_en: "",
  title_ar: "",
  content_en: "",
  content_ar: "",
  status: false,
});

const { data: page } = await useApiFetch(`pages/${route.params.slug}`);

state.value = {
  title_en: page.value.title_en,
  title_ar: page.value.title_ar,
  content_en: page.value.content_en,
  content_ar: page.value.content_ar,
  status: page.value.status === "1" || page.value.status === 1,
};

const serverError = ref(null);
const isLoading = ref(false);

async function onSubmit() {
  isLoading.value = true;
  serverError.value = null;

  try {
    const response = await useApiFetchRaw(`pages/${page.value.id}`, {
      method: "PUT",
      body: {
        title_en: state.value.title_en,
        title_ar: state.value.title_ar,
        content_en: state.value.content_en,
        content_ar: state.value.content_ar,
        status: state.value.status ? "1" : "0",
      },
    });

    toast.add({
      title: response.message,
      color: "success",
      icon: "i-lucide-check-circle",
    });

    navigateTo({ name: "admin-pages" });
  } catch (error) {
    if (error.status === 422) {
      serverError.value = error.data.errors;
    } else {
      toast.add({
        title: t("error"),
        description: error.message || t("somethingWentWrong"),
        color: "error",
      });
    }
  } finally {
    isLoading.value = false;
  }
}
</script>
