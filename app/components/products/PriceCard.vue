<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <UIcon name="i-lucide-wallet" size="20" />
          <h3 class="font-semibold text-lg">{{ $t("price") }}</h3>
        </div>
      </div>
    </template>

    <!-- Main Pricing Display -->
    <div class="space-y-4">
      <!-- SYP Card -->
      <div class="border border-gray-200 rounded-xl p-3">
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-extrabold text-gray-900">
              {{ product.data.price }}
            </span>
            <span class="text-xl font-bold text-success">ل.س</span>
          </div>
      </div>
    </div>
  </UCard>
</template>

<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});
</script>
