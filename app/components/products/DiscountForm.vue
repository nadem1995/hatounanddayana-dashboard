<template>
  <div class="space-y-6">
    <!-- Discount Selection Card -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/20">
              <UIcon
                name="i-lucide-badge-percent"
                class="w-5 h-5 text-primary-600 dark:text-primary-400"
              />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">
                {{ $t("discount") }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{
                  selectedDiscount
                    ? $t("discountApplied")
                    : $t("selectDiscountDescription")
                }}
              </p>
            </div>
          </div>

          <!-- Remove Discount Button -->
          <UButton
            v-if="selectedDiscount"
            color="red"
            size="sm"
            icon="i-lucide-trash-2"
            @click="handleRemoveDiscount"
          />
        </div>
      </template>

      <UForm :schema="discountSchema" :state="formState" nested>
        <UFormField :error="serverError?.discount_id?.[0]" name="discount_id">
          <div class="space-y-3">
            <USelectMenu
              v-model="selectedDiscountId"
              :items="formattedDiscounts"
              :search-input="false"
              :loading="loading"
              label-key="label"
              value-key="id"
              class="w-full"
              icon="i-lucide-percent"
            >
              <template #item-label="{ item }">
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex items-center justify-center w-10 h-10 rounded-lg"
                      :class="
                        item.type === 'percentage'
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                      "
                    >
                      <UIcon
                        :name="
                          item.type === 'percentage'
                            ? 'i-lucide-percent'
                            : 'i-lucide-dollar-sign'
                        "
                        class="w-5 h-5"
                      />
                    </div>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">
                        {{ item.label }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ item.description }}
                      </p>
                    </div>
                  </div>
                </div>
              </template>

              <template #leading>
                <UIcon
                  v-if="selectedDiscount"
                  :name="
                    selectedDiscount.type === 'percentage'
                      ? 'i-lucide-percent'
                      : 'i-lucide-dollar-sign'
                  "
                  class="w-4 h-4"
                />
              </template>
            </USelectMenu>

            
          </div>
        </UFormField>
      </UForm>

      <!-- No Discount Message -->
      <div
        v-if="!selectedDiscount"
        class="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      >
        <div
          class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
        >
          <UIcon name="i-lucide-info" class="w-4 h-4" />
          <span>{{ $t("noDiscountApplied") }}</span>
        </div>
      </div>
    </UCard>

    <!-- Price Summary Card -->
    <UCard v-if="state.price && parseFloat(state.price) > 0">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon
            name="i-lucide-calculator"
            class="w-5 h-5 text-gray-500 dark:text-gray-400"
          />
          <h3 class="font-semibold text-gray-900 dark:text-white">
            {{ $t("priceSummary") }}
          </h3>
        </div>
      </template>

      <div class="space-y-4">
        <!-- Original Price -->
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ $t("originalPrice") }}
          </span>
          <span class="text-lg font-semibold text-gray-900 dark:text-white">
            ${{ formatPrice(state.price) }}
          </span>
        </div>

        <!-- Discount Amount -->
        <div
          v-if="selectedDiscount"
          class="flex items-center justify-between pb-4 border-b dark:border-gray-700"
        >
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-minus-circle" class="w-4 h-4 text-red-500" />
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t("discount") }}
            </span>
          </div>
          <span class="text-lg font-semibold text-red-600 dark:text-red-400">
            -${{ discountAmount }}
          </span>
        </div>

        <!-- Sale Price -->
        <div class="flex items-center justify-between pt-2">
          <span class="text-base font-medium text-gray-900 dark:text-white">
            {{ selectedDiscount ? $t("finalPrice") : $t("price") }}
          </span>
          <div class="text-right">
            <div
              class="text-2xl font-bold"
              :class="
                selectedDiscount
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-900 dark:text-white'
              "
            >
              ${{ formatPrice(salePrice) }}
            </div>
          
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup>
import * as z from "zod";

const discountSchema = z.object({
  discount_id: z.string().optional().nullable(),
});

const props = defineProps({
  state: {
    type: Object,
    required: true,
  },
  discounts: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  serverError: {
    type: Object,
    default: null,
  },
  modelValue: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);

// Form state for validation
const formState = computed(() => ({
  discount_id: selectedDiscountId.value,
}));

// Selected discount ID (for v-model)
const selectedDiscountId = computed({
  get: () => {
    if (!props.modelValue) return null;
    return props.modelValue.id;
  },
  set: (value) => {
    if (!value) {
      emit("update:modelValue", null);
      return;
    }
    const discount = props.discounts.find((d) => d.id === value);
    emit("update:modelValue", discount || null);
  },
});

// Handle remove discount
function handleRemoveDiscount() {
  emit("update:modelValue", null);
}

// Selected discount object
const selectedDiscount = computed(() => props.modelValue);

// Format discounts for select menu
const formattedDiscounts = computed(() => {
  return props.discounts.map((discount) => {
    const isPercentage = discount.type === "percentage";
    return {
      ...discount,
      label: isPercentage
        ? `${discount.value}% Off`
        : `$${discount.value.usd} Off`,
      description: isPercentage
        ? `Save ${discount.value}% on this product`
        : `Save $${discount.value.usd} (${discount.value.syp} SYP)`,
    };
  });
});

// Calculate discount amount
const discountAmount = computed(() => {
  if (!props.state.price || !selectedDiscount.value) return "0.00";

  const price = parseFloat(props.state.price);
  if (isNaN(price)) return "0.00";

  if (selectedDiscount.value.type === "percentage") {
    const amount = (price * selectedDiscount.value.value) / 100;
    return formatPrice(amount);
  } else {
    const usd = parseFloat(selectedDiscount.value.value?.usd || 0);
    return formatPrice(usd);
  }
});

// Calculate final sale price
const salePrice = computed(() => {
  if (!props.state.price) return 0;

  const price = parseFloat(props.state.price);
  if (isNaN(price)) return 0;

  if (!selectedDiscount.value) return price;

  if (selectedDiscount.value.type === "percentage") {
    const discountValue = (price * selectedDiscount.value.value) / 100;
    return Math.max(0, price - discountValue);
  } else {
    const discountValue = parseFloat(selectedDiscount.value.value?.usd || 0);
    return Math.max(0, price - discountValue);
  }
});


// Format price helper
function formatPrice(value) {
  const num = parseFloat(value);
  if (isNaN(num)) return "0.00";
  return num.toFixed(2);
}
</script>
