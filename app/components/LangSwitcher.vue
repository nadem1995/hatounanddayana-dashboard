<template>
  <UButton
    :icon="locale === 'ar' ? 'i-flag-um-4x3' : 'i-flag-sy-4x3'"
    variant="ghost"
    size="xl"
    color="neutral"
    class="cursor-pointer"
    @click="setLocale(locale === 'ar' ? 'en' : 'ar')"
  />
</template>

<script setup>
const { t, locale, setLocale } = useI18n();
</script>

<style lang="scss" scoped></style>
