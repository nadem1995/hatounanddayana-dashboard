export const useDiscountsColumns = () => {
  const { t } = useI18n();
  const { formatDate } = useDateFormat();
  const { toggle } = useToggleStatus();

  const RESOURCE_PATH = "discounts";

  return (refresh, deleteModal, editModal) => [
    {
      id: "value",
      accessorKey: "value",
      header: () => t("discountValue"),
      cell: ({ row }) => {
        return h("p", { class: "text-highlighted" }, row.original.value);
      },
    },
    {
      id: "start_at",
      accessorKey: "start_at",
      header: () => t("startAt"),
      cell: ({ row }) => {
        return h(
          "p",
          { class: "text-highlighted" },
          formatDate(row.original.start_at),
        );
      },
    },
    {
      id: "end_at",
      accessorKey: "end_at",
      header: () => t("endAt"),
      cell: ({ row }) => {
        return h(
          "p",
          { class: "text-highlighted" },
          formatDate(row.original.end_at),
        );
      },
    },
    {
      id: "type",
      accessorKey: "type",
      header: () => t("type"),
    },
    {
      id: "status",
      accessorKey: "status",
      header: () => t("status"),
      filterFn: "equals",
      cell: ({ row }) => {
        const USwitch = resolveComponent("USwitch");
        return h(USwitch, {
          class: "capitalize",
          variant: "subtle",
          modelValue: row.original.status,
          onClick: () =>
            toggle(
              `${RESOURCE_PATH}/${row.original.id}/status`,
              t("categoryActive"),
              t("categoryInactive"),
            ),
        });
      },
    },
    {
      id: "actions",
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => {
        const UButton = resolveComponent("UButton");
        const UDropdown = resolveComponent("UDropdown");

        return h(
          UDropdown,
          {
            items: [
              [
                {
                  label: t("view"),
                  icon: "i-lucide-eye",
                  to: {
                    name: "admin-discounts-id",
                    params: { id: row.original.id },
                  },
                },
              ],
              [
                {
                  label: t("edit"),
                  icon: "i-lucide-edit-2",
                  click: () => {
                    editModal.open({
                      refresh,
                      discount: row.original,
                    });
                  },
                },
              ],
              [
                {
                  label: t("delete"),
                  icon: "i-lucide-trash",
                  color: "error",
                  click: () => {
                    deleteModal.open({
                      itemPath: `${RESOURCE_PATH}/${row.original.id}`,
                      refresh,
                    });
                  },
                },
              ],
            ],
          },
          {
            default: () =>
              h(UButton, {
                icon: "i-lucide-ellipsis-vertical",
                color: "neutral",
                variant: "ghost",
              }),
          },
        );
      },
    },
  ];
};
