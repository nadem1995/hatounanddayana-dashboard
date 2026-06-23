<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Form -->

    <div class="flex-1 flex flex-col items-center relative justify-center p-8">
      <LangSwitcher class="absolute z-10 top-4 start-4" />
      <div class="w-full max-w-md space-y-8">
        <!-- Logo/Title -->
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ t("loginTitle") }}
          </h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {{ t("loginSubtitle") }}
          </p>
        </div>

        <!-- Login Form -->
        <UForm
          @submit="onSubmit"
          :schema="schema"
          :state="state"
          class="space-y-6"
        >
          <!-- Email Field -->
          <UFormField :label="t('email')" name="email" required>
            <UInput
              v-model="state.email"
              type="email"
              :placeholder="t('emailPlaceholder')"
              icon="i-lucide-at-sign"
              size="xl"
              class="w-full"
              :disabled="isLoading"
            />
          </UFormField>

          <!-- Password Field -->
          <UFormField :label="t('password')" name="password" required>
            <UInput
              v-model="state.password"
              :type="showPassword ? 'text' : 'password'"
              :placeholder="t('passwordPlaceholder')"
              icon="i-lucide-lock"
              class="w-full"
              size="xl"
              :disabled="isLoading"
            >
              <template #trailing>
                <UButton
                  :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  @click="showPassword = !showPassword"
                />
              </template>
            </UInput>
          </UFormField>

        
          <!-- Submit Button -->
          <UButton
            type="submit"
            color="primary"
            size="xl"
            icon="i-lucide-log-in"
            block
            :loading="isLoading"
            :disabled="isLoading"
          >
            {{ isLoading ? t("loggingIn") : t("login") }}
          </UButton>
        </UForm>

        <!-- Color Mode Toggle -->
        <div class="flex justify-center pt-4">
          <UColorModeButton />
        </div>
      </div>
    </div>

    <div
      class="hidden lg:flex flex-1 bg-primary-50 dark:bg-primary-950 items-center justify-center p-8"
    >
      <div class="text-center space-y-6">
        <div class="text-6xl">🏠</div>
        <h1 class="text-4xl font-bold text-primary-600 dark:text-primary-400">
          Maison de Dina
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 max-w-md">
          {{ t("manageBusiness") }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

definePageMeta({
  layout: false,
});

const { t } = useI18n();
// Limit to your supported languages
const toast = useToast();

// State
const isLoading = ref(false);
const showPassword = ref(false);

const state = ref({
  email: "admin1@test.com",
  password: "Password@123",
});

// Validation schema with i18n
const schema = computed(() =>
  z.object({
    email: z.string().min(1, t("emailRequired")).email(t("emailInvalid")),
    password: z.string().min(1, t("passwordRequired")).min(8, t("passwordMin")),
  }),
);

// Submit handler
const onSubmit = async (event: FormSubmitEvent<any>) => {
  isLoading.value = true;
  try {
    const data: any = await useApiFetchRaw("login", {
      method: "POST",
      body: {
        email: state.value.email,
        password: state.value.password,
      },
    });

    toast.add({
      title: t("loginSuccess"),
      color: "success",
      description: t("welcomeBack", { name: data.user.name }),
      icon: "i-lucide-check-circle",
    });

    const dashboardAdmin = useCookie("dashboard_admin");
    const dashboardAdminToken = useCookie("dashboard_admin_token");
    dashboardAdmin.value = data.user;
    dashboardAdminToken.value = data.token;
    await navigateTo({ name: "admin" });
  } catch (error: any) {
    toast.add({
      title: t("loginError"),
      description: error.data.message || t("invalidCredentials"),
      color: "error",
      icon: "i-lucide-alert-circle",
    });
  } finally {
    isLoading.value = false;
  }
};

// SEO
useHead({
  title: computed(() => t("login")),
  meta: [
    {
      name: "description",
      content: computed(() => t("loginSubtitle")),
    },
  ],
});
</script>
