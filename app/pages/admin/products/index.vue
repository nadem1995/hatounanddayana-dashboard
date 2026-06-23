<template>
  <UDashboardPanel id="products-index">
    <template #header>
      <UDashboardNavbar :title="$t('products')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            class="cursor-pointer"
            :label="$t('addNewProduct')"
            icon="i-lucide-plus"
            :to="{ name: 'admin-products-create' }"
          />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar class="grid md:grid-cols-4 items-baseline py-3 md:space-y-2 space-y-1">
        <UInput
          v-model="search"
          class="w-full"
          icon="i-lucide-search"
          :placeholder="$t('filterBy', { by: $t('name') }) + '...'"
        />

        <USelectMenu
          v-model="categories"
          :items="products?.meta?.categories || []"
          value-key="id"
          label-key="name"
          icon="i-lucide-picture-in-picture-2"
          multiple
          clear
          :placeholder="$t('filterByCategories')"
          class="col-span-1"
        >
          <template #item-label="{ item }">
            <div class="flex flex-col gap-1">
              <span>{{ item.name }}</span>
            </div>
          </template>
        </USelectMenu>

        <!-- <USelect
          v-model="discount"
          class="col-span-1"
          icon="i-lucide-badge-percent"
          :items="discountItems"
          value-key="value"
          label-key="label"
        /> -->

        <UCheckbox
          v-model="is_best_seller"
          :label="$t('showBestSellerOnly')"
          color="primary"
          class="col-span-1"
          :model-value="is_best_seller === 'true'"
          @update:model-value="(value) => (is_best_seller = value)"
        />
      </UDashboardToolbar>
    </template>

    <template #body>
      <UTable
        :data="products?.data || []"
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
        v-if="products?.meta?.total"
        class="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-default pt-4 mt-4"
      >
        <UPagination
          v-model:page="products.meta.current_page"
          :items-per-page="products.meta.per_page"
          :sibling-count="1"
          :total="products.meta.total"
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
              from: products.meta.from,
              to: products.meta.to,
              total: products.meta.total,
            })
          }}
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup>
import { LazyDeleteModal } from "#components";

const { t } = useI18n();
const { toggle } = useToggleStatus();
const overlay = useOverlay();

useHead({
  title: () => t("products"),
});

const route = useRoute();
const router = useRouter();

const RESOURCE_PATH = "products";

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
    delete route.query["page"];
    updateQuery({ search: search || undefined });
  },
});

const page = computed({
  get: () => Number(route.query.page) || 1,
  set: (page) => {
    updateQuery({ page: page > 1 ? page : undefined });
  },
});

/* const discountItems = ref([
  {
    label: computed(() => t("all")),
    value: null,
  },
  {
    label: computed(() => t("hasDiscount")),
    value: "true",
  },
  {
    label: computed(() => t("withOutDiscount")),
    value: "false",
  },
]);

const discount = computed({
  get: () => route.query.discount ?? null,
  set: (value) => {
    delete route.query["page"];
    updateQuery({ discount: value });
  },
}); */

const is_best_seller = computed({
  get: () => route.query.is_best_seller ?? null,
  set: (value) => {
    delete route.query["page"];
    updateQuery({ is_best_seller: value ? "true" : null });
  },
});

const categories = computed({
  get: () => {
    const cats = route.query.categories;
    if (!cats) return [];
    if (Array.isArray(cats)) return cats.map((c) => Number(c));
    return cats.split(",").map((c) => Number(c));
  },
  set: (categories) => {
    delete route.query["page"];
    const categoriesParam =
      categories.length > 0 ? categories.join(",") : undefined;
    updateQuery({ categories: categoriesParam });
  },
});

const {
  data: products,
  pending,
  refresh} = await useApiFetch(`${RESOURCE_PATH}`, {
  lazy: true,
  query: { search, page, categories, is_best_seller },
  default: () => ({
    data: [],
    meta: {
      current_page: 1,
      per_page: 10,
      total: 0,
      from: 0,
      to: 0,
      categories: [],
    },
  }),
});

const USwitch = resolveComponent("USwitch");
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const deleteModal = overlay.create(LazyDeleteModal);

const columns = [
  {
    id: "product",
    accessorKey: "name",
    header: () => t("name"),
    cell: ({ row }) => {
      return h(
          "p",
          { class: "font-semibold text-highlighted" },
          row.original.name,
        );
    },
  },
  /* {
    id: "pricing",
    accessorKey: "price",
    header: () => t("pricing"),
    cell: ({ row }) => {
      const hasDiscount = row.original.discount;
      return h("div", { class: "flex flex-col gap-1" }, [
        h("div", { class: "flex items-center gap-2" }, [
          h(
            "span",
            {
              class: hasDiscount
                ? "line-through text-muted text-sm"
                : "font-medium text-highlighted",
            },
            `$ ${row.original.price.usd}`,
          ),
          hasDiscount &&
            h(
              "span",
              {
                class: "font-semibold text-success",
              },
              `$${row.original.price.sale.usd}`,
            ),
        ]),
        h("div", { class: "flex items-center gap-2" }, [
          h(
            "span",
            {
              class: hasDiscount
                ? "line-through text-muted text-xs"
                : "text-sm text-muted",
            },
            `${row.original.price.syp} SYP`,
          ),
          hasDiscount &&
            h(
              "span",
              {
                class: "text-sm text-success",
              },
              `${row.original.price.sale.syp} SYP`,
            ),
        ]),
      ]);
    },
  }, */

  /* {
    id: "discount",
    accessorKey: "discount",
    header: () => t("discount"),
    cell: ({ row }) => {
      if (!row.original.discount) {
        return h("span", { class: "text-muted" }, "-");
      }

      const discountValue =
        row.original.discount.type === "percentage"
          ? `${row.original.discount.value}%`
          : `$ ${row.original.discount.value}`;

      return h(UBadge, {
        color: "success",
        variant: "subtle",
        label: discountValue,
      });
    },

    cell: ({ row }) => {
      if (!row.original.discount) {
        return h("span", { class: "text-muted" }, "-");
      } else {
        if (row.original.discount.type === "fixed") {
          return h("div", { class: "flex flex-col gap-1 py-1" }, [
            h(
              "p",
              { class: "font-semibold text-highlighted" },
              `${row.original.discount.value.usd} $`,
            ),
            h(
              "p",
              { class: "text-sm text-muted" },
              `${row.original.discount.value.syp} SYP`,
            ),
          ]);
        } else {
          return h(
            "p",
            { class: "font-semibold text-highlighted" },
            `${row.original.discount.value} %`,
          );
        }
      }
    },
  }, */
  {
    id: "pricing",
    accessorKey: "price",
    header: () => t("pricing"),
    cell: ({ row }) => {
      return h(
          "p",
          { class: "font-semibold text-highlighted" },
          row.original.price,
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
          onClick: () =>
            toggle(
              `${RESOURCE_PATH}/${row.original.id}/status`),
        }),
      ]);
    },
  },
  {
    id: "bestSeller",
    accessorKey: "bestSeller",
    header: () => t("bestSeller"),
    cell: ({ row }) => {
      return h("div", { class: "flex items-center gap-2" }, [
        h(USwitch, {
          modelValue: row.original.is_best_seller,
          onClick: () =>
            toggle(
              `${RESOURCE_PATH}/${row.original.id}/best-seller`,
              t("bestSellerEnabled"),
              t("bestSellerDisabled"),
            ),
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
                  name: "admin-products-slug",
                  params: { slug: row.original.slug },
                },
              },
            ],
            [
              {
                label: t("edit"),
                icon: "i-lucide-edit-2",
                to: {
                  name: "admin-products-slug-edit",
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
