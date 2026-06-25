<template>
  <UDashboardPanel id="marketing" :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar :title="$t('marketing')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        :validate-on="['submit']"
        class="flex items-end gap-2"
        @submit="onSubmit"
      >
        <UFormField required :label="$t('newStatmen') + ' EN'" name="statement_en" class="flex-1">
          <UInput v-model="state.statement_en" class="w-full" />
        </UFormField>
        <UFormField required :label="$t('newStatmen') " name="statement_ar" class="flex-1">
          <UInput v-model="state.statement_ar" class="w-full" />
        </UFormField>
        <UButton :label="$t('reset')" @click="reset"/>
        <UButton type="submit" :disabled="state.statement_en=='' || state.statement_ar==''" :loading="isLoading">
          {{ $t("add") }}
        </UButton>
      </UForm>

      <UTable
        :data="banners?.data || []"
        :columns="columns"
        :loading="pending"
        class="w-full"
        :ui="{
          td: 'md:py-3 py-2',
          th: 'md:py-3.5 py-2',
        }"
      >
        <template #loading>
          <DataTableLoading />
        </template>
      </UTable>
    </template>
  </UDashboardPanel>
</template>

<script setup>
import * as z from "zod";
import { LazyDeleteModal, UDropdownMenu, UButton ,LazyBannersEditModal} from "#components";

const { t } = useI18n();
const toast = useToast();
const overlay = useOverlay();

useHead({
  title: () => t("marketing"),
});

const schema = z.object({
  statement_en: z.string().min(1, t("fieldRequired")),
  statement_ar: z.string().min(1, t("fieldRequired")),
});

const state = reactive({
  statement_en: '',
  statement_ar: '',
});

const RESOURCE_PATH = "marketing/banners";

const {
  data: banners,
  pending,
  refresh,
} = await useApiFetch(`${RESOURCE_PATH}`, { lazy: true });

const serverError = ref(null);
const isLoading = ref(false);

async function onSubmit(event) {
  isLoading.value = true;
  serverError.value = null;

  try {
    const response = await useApiFetchRaw(RESOURCE_PATH, {
      method: "POST",
      body: event.data,
    });

    toast.add({
      title: response.message,
      color: "success",
      icon: "i-lucide-check-circle",
    });

    state.statement_en = undefined;
    state.statement_ar = undefined;
    refresh();
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

const deleteModal = overlay.create(LazyDeleteModal);
const editBannersModel = overlay.create(LazyBannersEditModal);

const columns = [
  {
    id: "banner_statement_en",
    accessorKey: "statement_en",
    header: () => t("statement") + ' EN',
    cell: ({ row }) =>
      h("div", [
        h(
          "p",
          { class: "font-semibold text-highlighted" },
          row.original.statement.en
        ),
      ]),
  },
  {
    id: "banner_statement_ar",
    accessorKey: "statement_ar",
    header: () => t("statement"),
    cell: ({ row }) =>
      h("div", [
        h(
          "p",
          { class: "font-semibold text-highlighted" },
          row.original.statement.ar
        ),
      ]),
  },
  {
    id: "actions",
    accessorKey: "actions",
    header: "",
    cell: ({ row }) =>
      h(
        UDropdownMenu,
        {
          items: [
            [
              {
                label: t("delete"),
                icon: "i-lucide-trash",
                color: "error",
                onClick: () => {
                  deleteModal.open({
                    itemPath: `${RESOURCE_PATH}/${row.original.id}`,
                    refresh,
                  });
                },
              },
            ],
            [
              {
                label: t("edit"),
                icon: "i-lucide-edit-2",
                onClick: () => {
                  editBannersModel.open({
                    refresh,
                    banner: row.original,
                  });
                },
              },
            ],
          ],

        },
        () =>
          h(UButton, {
            icon: "i-lucide-ellipsis-vertical",
            color: "neutral",
            variant: "ghost",
          })
      ),
  },
];


 function reset (){
   state.statement_en = '';
   state.statement_ar = '';
}
</script>
