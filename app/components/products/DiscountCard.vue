<template>
  <UCard>
    <!-- Header with animated badge -->
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-badge-percent" size="20" />
            <h3 class="font-semibold text-lg">{{ $t("discount") }}</h3>
          </div>
        </div>

        <UBadge
          :color="discount.status ? 'success' : 'error'"
          variant="solid"
          size="lg"
          :icon="
            discount.status ? 'i-lucide-check-circle' : 'i-lucide-x-circle'
          "
          :label="discount.status ? $t('active') : $t('inactive')"
        />
        
      </div>
    </template>

    <!-- Discount Values -->
    <div class="space-y-4">
      <!-- Discount Type Badge -->
      <div class="flex items-center justify-center">
        <UBadge
          color="primary"
          variant="subtle"
          size="xl"
          icon="i-lucide-percent"
          class="px-6 py-2 w-full"
        >
          {{
            discount.type === "fixed"
              ? $t("Fixedamountdiscount")
              : $t("Percentagediscount")
          }}
        </UBadge>
      </div>
      

      <!-- USD Savings -->
      <div v-if="discount.type==='fixed'" class="border border-gray-200 rounded-xl p-3">
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-extrabold text-gray-900 dark:text-white">
            {{ discount.value.usd }}
          </span>
          <span class="text-2xl font-bold text-primary">$</span>
        </div>
      </div>

      <!-- SYP Savings -->
      <div v-if="discount.type==='fixed'" class="border border-gray-200 rounded-xl p-3">
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-extrabold text-gray-900 dark:text-white">
            {{ discount.value.syp }}
          </span>
          <span class="text-2xl font-bold text-primary">ل.س</span>
        </div>
      </div>


      <div v-if="discount.type==='percentage'" class="border border-gray-200 rounded-xl p-3">
        <div class="flex items-baseline gap-2 justify-center ">
          <span class="text-3xl font-extrabold text-gray-900 dark:text-white">
            {{ discount.value }}
          </span>
          <span class="text-2xl font-bold text-primary">%</span>
        </div>
      </div>



      <!-- Time Period -->
      <div
        class="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border border-primary/20 p-5"
      >
        <div
          class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"
        ></div>
        <div class="relative space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-iconoir-timer" class="w-5 h-5 text-primary" />
            <h4 class="font-semibold text-gray-900 dark:text-white">
              {{ $t("validityPeriod") }}
            </h4>
          </div>

          <div class="space-y-4">
            <!-- Start Date -->
            <div
              class="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700"
            >
              <div class="p-2 rounded-lg bg-success/10">
                <UIcon
                  name="i-lucide-calendar-plus"
                  class="w-4 h-4 text-success"
                />
              </div>
              <div class="flex-1">
                <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {{ $t("startAt") }}
                </p>
                <p class="text-sm font-bold text-gray-900 dark:text-white">
                  {{ formatDate(discount.start_at) }}
                </p>
              </div>
            </div>

            <!-- End Date -->
            <div
              class="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700"
            >
              <UIcon
                name="i-iconoir-calendar-xmark"
                class="w-4 h-4 text-error"
              />
              <div class="flex-1">
                <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {{ $t("endAt") }}
                </p>
                <p class="text-sm font-bold text-gray-900 dark:text-white">
                  {{ formatDate(discount.end_at) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup>
const props = defineProps({
  discount: {
    type: Object,
    required: true,
  },
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>
