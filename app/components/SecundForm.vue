<script setup lang="ts">
import * as z from "zod";

// Define schema for this part
const passwordSchema = z.object({
  password: z.string().min(8, "Must be at least 8 characters"),
});

// Accept state from parent
const props = defineProps<{
  state: any;
}>();
</script>

<template>
  <!-- Use nested prop to link to parent form -->
  <UForm :schema="passwordSchema" nested>
    <UFormField label="Password" name="password">
      <UInput v-model="props.state.password" type="password" />
    </UFormField>
  </UForm>
</template>
