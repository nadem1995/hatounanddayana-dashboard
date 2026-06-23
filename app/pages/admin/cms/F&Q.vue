<template>
  <UDashboardPanel id="FAQ" :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar :title="$t('FAQ')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <FAQAddModal :refresh="refresh" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UTable
        :data="FAQ?.data || []"
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
import {
  LazyDeleteModal,
  UDropdownMenu,
  UButton,
  LazyFAQEditModal,
} from "#components";

const { t } = useI18n();
const overlay = useOverlay();

useHead({
  title: () => t("FAQ"),
});

const RESOURCE_PATH = "cms/FAQ";

const {
  data: FAQ,
  pending,
  refresh,
} = await useApiFetch(`${RESOURCE_PATH}`, { lazy: true });

const deleteModal = overlay.create(LazyDeleteModal);
const editFAQModel = overlay.create(LazyFAQEditModal);

const columns = [
  {
    id: "question",
    accessorKey: "question",
    header: () => t("question"),
    cell: ({ row }) =>
      h("p", { class: "font-semibold text-highlighted" }, row.original.question),
  },
  {
    id: "answer",
    accessorKey: "answer",
    header: () => t("answer"),
    cell: ({ row }) =>
      h("p", { class: "font-semibold text-highlighted" }, row.original.answer),
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
                  editFAQModel.open({
                    refresh,
                    FAQ: row.original,
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
          }),
      ),
  },
];
</script>
