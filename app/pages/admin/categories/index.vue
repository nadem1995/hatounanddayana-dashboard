<template>
  <UDashboardPanel id="categories-index">
    <template #header>
      <UDashboardNavbar :title="$t('categories')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <CategoriesAddModal :refresh="refresh" />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar class="grid md:grid-cols-4">
        <UInput
          v-model="search"
          class="w-full sm:max-w-xs"
          icon="i-lucide-search"
          :placeholder="$t('filterBy', { by: $t('name') }) + '...'"
        />
      </UDashboardToolbar>
    </template>

    <template #body>
      <UTable
        :data="categories?.data || []"
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

      <!-- Pagination Footer -->
      <div
        v-if="categories?.meta?.total"
        class="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-default pt-4 mt-4"
      >
        <UPagination
          v-model:page="categories.meta.current_page"
          :items-per-page="categories.meta.per_page"
          :sibling-count="1"
          :total="categories.meta.total"
          :to="
            (p) => ({
              name: `admin-${RESOURCE_PATH}`,
              query: { ...route.query, page: p },
            })
          "
        />
        <div class="text-sm text-muted">
          {{
            $t("paginationShow", {
              from: categories.meta.from,
              to: categories.meta.to,
              total: categories.meta.total,
            })
          }}
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup>
import { LazyDeleteModal, LazyCategoriesEditModal } from "#components";

const { toggle } = useToggleStatus();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const overlay = useOverlay();
const deleteModal = overlay.create(LazyDeleteModal);
const editCategoryModal = overlay.create(LazyCategoriesEditModal);

useHead({
  title: () => t("categories"),
});

const RESOURCE_PATH = "categories";

// Helper function to clean query params
function updateQuery(newParams) {
  const query = { ...route.query, ...newParams };
  Object.keys(query).forEach((key) => {
    if (query[key] === "" || query[key] === null || query[key] === undefined) {
      delete query[key];
    }
  });
  router.push({ query });
}

const search = computed({
  get: () => route.query.search ?? "",
  set: (search) => {
    updateQuery({ search: search || undefined });
  },
});

const page = computed({
  get: () => Number(route.query.page) || 1,
  set: (page) => {
    updateQuery({ page: page > 1 ? page : undefined });
  },
});

const {
  data: categories,
  pending,
  refresh,
} = await useApiFetch(`${RESOURCE_PATH}`, {
  lazy: true,
  query: { search, page },
  default: () => ({
    data: [],
    meta: {
      current_page: 1,
      per_page: 10,
      total: 0,
      from: 0,
      to: 0,
    },
  }),
});

const USwitch = resolveComponent("USwitch");
const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const loadingId = ref(null);
const columns = [
  {
    id: "category_name_ar",
    accessorKey: "name_ar",
    header: () => t("name"),
    cell: ({ row }) => {
      return h("div", { class: "flex flex-col gap-1 py-1" }, [
        h("p", { class: "font-semibold text-highlighted" }, row.original.name.ar),
      ]);
    },
  },
  {
    id: "category_name_en",
    accessorKey: "name_en",
    header: () => t("name") + " EN",
    cell: ({ row }) => {
      return h("div", { class: "flex flex-col gap-1 py-1" }, [
        h("p", { class: "font-semibold text-highlighted" }, row.original.name.en),
      ]);
    },
  },
  {
    id: "products_count",
    accessorKey: "products_count",
    header: () => t("productsCount"),
    cell: ({ row }) => {
      const count = row.original.products_count || 0;
      return h(UBadge, {
        color: count > 0 ? "primary" : "neutral",
        variant: "subtle",
        label: String(count),
      });
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
          loading: loadingId.value === row.original.id,
          disabled: loadingId.value === row.original.id,
          onClick: async () => {
            loadingId.value = row.original.id;
            await toggle(`${RESOURCE_PATH}/${row.original.id}/status`);
            await refresh();
            loadingId.value = null;
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
                  name: "admin-categories-slug",
                  params: { slug: row.original.slug },
                },
              },
            ],
            [
              {
                label: t("edit"),
                icon: "i-lucide-edit-2",
                onClick: () => {
                  editCategoryModal.open({
                    refresh,
                    category: row.original,
                  });
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
