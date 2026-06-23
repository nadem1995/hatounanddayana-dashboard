<template>
  <UModal
    :title="$t('confirmDeletion')"
    :description="$t('confirmDeletionDescription')"
  >
    <template #body>
      <Icon name="i-lucide-trash" size="150" class="m-auto flex text-[#fb2c36]"/>
      <slot />
    </template>
    <template #footer>
      <div class="gap-2 w-full flex">
        <UButton
          block
          :label="$t('cancel')"
          color="neutral"
          icon="i-lucide-x"
          variant="subtle"
          @click="handleCancel"
        />
        <UButton
          :label="$t('delete')"
          icon="i-lucide-trash"
          color="error"
          variant="solid"
          block
          loading-auto
          @click="handleDelete"
        />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const toast = useToast();
const { t } = useI18n();

const props = defineProps<{
  itemPath: string;
  refresh: Function;
}>();
const emit = defineEmits<{ close: [boolean] }>();
const handleCancel = () => {
  emit("close", false); // User cancelled
};

const handleDelete = async () => {
  try {
    const responce: any = await useApiFetchRaw(props.itemPath, {
      method: "DELETE",
    });
    await props.refresh();
    toast.add({
      title: responce.message,
      icon: "i-lucide-check-circle",
    });
  } catch (error: any) {
    toast.add({
      title: error.status === 404 ? t("pageNotFound") : t("serverError"),
      description: t("errorOccurred"),
      color: "error",
      icon: "i-lucide-alert-circle",
    });
  } finally {
    handleCancel();
  }
};


</script>
