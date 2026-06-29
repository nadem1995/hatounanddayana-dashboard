<template>
  <UDashboardPanel id="pages-index">
    <template #header>
      <UDashboardNavbar :title="$t('pages')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            class="cursor-pointer"
            :label="$t('addNewPage')"
            icon="i-lucide-plus"
            :to="{ name: 'admin-pages-create' }"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UTable
        :data="pages"
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
import { LazyDeleteModal } from "#components";

const { t } = useI18n();
const { toggle } = useToggleStatus();
const overlay = useOverlay();

useHead({
  title: () => t("pages"),
});

const RESOURCE_PATH = "pages";

// Helper function to clean query params
const {
  data: pages,
  pending,
  refresh} = await useApiFetch(`${RESOURCE_PATH}`, {
  lazy: true,
  default: () => ({
    data: [],
  }),
});

const USwitch = resolveComponent("USwitch");
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const deleteModal = overlay.create(LazyDeleteModal);

const columns = [
  {
    id: "page_title_ar",
    accessorKey: "title_ar",
    header: () => t("title"),
    cell: ({ row }) => {
      return h(
          "p",
          { class: "font-semibold text-highlighted" },
          row.original.title_ar,
        );
    },
  },
  {
    id: "page_title_en",
    accessorKey: "title_en",
    header: () => t("title") + ' EN',
    cell: ({ row }) => {
      return h(
        "p",
        { class: "font-semibold text-highlighted" },
        row.original.title_en,
      );
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: () => t("status"),
    cell: ({ row }) => {
      return h("div", { class: "flex items-center gap-2" }, [
        h(USwitch, {
          modelValue: row.original.status,
          onClick: async () => {
            await toggle(`${RESOURCE_PATH}/${row.original.id}/status`);
            refresh();
          },
        }),
      ]);
    },
  },
  {
    id: "actions",
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      return h(
        UDropdownMenu,
        {
          items: [
            [
              {
                label: t("view"),
                icon: "i-lucide-eye",
                to: {
                  name: "admin-pages-slug",
                  params: { slug: row.original.slug },
                },
              },
            ],
            [
              {
                label: t("edit"),
                icon: "i-lucide-edit-2",
                to: {
                  name: "admin-pages-slug-edit",
                  params: { slug: row.original.slug },
                },
              },
            ],
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
          ],
          content: { align: "end" },
        },
        () =>
          h(UButton, {
            icon: "i-lucide-ellipsis-vertical",
            color: "neutral",
            variant: "ghost",
          }),
      );
    },
  },
];
</script>
