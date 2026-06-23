<template>
  <SocialMediaAddModal :refresh="refresh" />
  <UTable
    :data="socialMedia?.data || []"
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

<script setup>
import {
  LazyDeleteModal,
  UDropdownMenu,
  UButton,
  LazySocialMediaEditModal,
} from "#components";

const { t } = useI18n();
const overlay = useOverlay();
const { toggle } = useToggleStatus();

const RESOURCE_PATH = "settings/social-media";

const {
  data: socialMedia,
  pending,
  refresh,
} = await useApiFetch(`${RESOURCE_PATH}`, { lazy: true });

const deleteModal = overlay.create(LazyDeleteModal);
const editSocialmediaModel = overlay.create(LazySocialMediaEditModal);

const columns = [
  {
    id: "socialMedai_name",
    header: () => t("name"),
    cell: ({ row }) =>
      h("p", { class: "font-semibold text-highlighted" }, row.original.name),
  },
  {
    id: "socialMedai_url",
    header: () => t("url"),
    cell: ({ row }) =>
      h("p", { class: "font-semibold text-highlighted" }, row.original.url),
  },
  {
    id: "status",
    accessorKey: "status",
    header: () => t("status"),
    cell: ({ row }) => {
      return h("div", { class: "flex items-center gap-2" }, [
        h(USwitch, {
          modelValue: row.original.status,
          onClick: () => toggle(`${RESOURCE_PATH}/${row.original.id}/status`),
        }),
      ]);
    },
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
                  editSocialmediaModel.open({
                    refresh,
                    socialMedia: row.original,
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
