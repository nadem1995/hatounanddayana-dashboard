<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-lock" size="20" />
        <h3 class="text-lg font-semibold">{{ $t("changePassword") }}</h3>
      </div>
    </template>

    <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
      <!-- Current Password -->
      <UFormField
        :error="serverError"
        required
        :label="$t('currentPassword')"
        name="current_password"
      >
        <UInput
          v-model="state.current_password"
          :placeholder="$t('enterYourCurrentPassword')"
          :type="showCurrentPassword ? 'text' : 'password'"
          icon="i-lucide-lock"
          :ui="{ trailing: 'pe-1' }"
          size="xl"
          class="w-full"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="xl"
              :icon="showCurrentPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="
                showCurrentPassword
                  ? $t('hideCurrentPassword')
                  : $t('showCurrentPassword')
              "
              :title="
                showCurrentPassword
                  ? $t('hideCurrentPassword')
                  : $t('showCurrentPassword')
              "
              :aria-pressed="showCurrentPassword"
              @click="showCurrentPassword = !showCurrentPassword"
            />
          </template>
        </UInput>
      </UFormField>

      <!-- New Password -->
      <div class="space-y-2">
        <UFormField required :label="$t('newPassword')" name="password">
          <UInput
            class="w-full"
            v-model="state.password"
            :placeholder="$t('enterYourNewPassword')"
            :color="color"
            :type="showNewPassword ? 'text' : 'password'"
            :aria-invalid="score < 4"
            aria-describedby="password-strength"
            icon="i-lucide-lock"
            :ui="{ trailing: 'pe-1' }"
            size="xl"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="xl"
                :icon="showNewPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="
                  showNewPassword
                    ? $t('hideNewPassword')
                    : $t('showNewPassword')
                "
                :title="
                  showNewPassword
                    ? $t('hideNewPassword')
                    : $t('showNewPassword')
                "
                :aria-pressed="showNewPassword"
                @click="showNewPassword = !showNewPassword"
              />
            </template>
          </UInput>
        </UFormField>

        <UProgress
          :color="color"
          :indicator="text"
          :model-value="score"
          :max="4"
          size="sm"
        />

        <p id="password-strength" class="text-sm font-medium">
          {{ $t("passwordMustMeetTheFollowingRequirements") }}:
        </p>

        <ul class="space-y-1" aria-label="Password requirements">
          <li
            v-for="(req, index) in strength"
            :key="index"
            class="flex items-center gap-0.5"
            :class="req.met ? 'text-success' : 'text-muted'"
          >
            <UIcon
              :name="req.met ? 'i-lucide-circle-check' : 'i-lucide-circle-x'"
              class="size-4 shrink-0"
            />

            <span class="text-xs font-light">
              {{ req.text }}
              <span class="sr-only">
                {{ req.met ? " - Requirement met" : " - Requirement not met" }}
              </span>
            </span>
          </li>
        </ul>
      </div>

      <!-- Confirm Password -->
      <UFormField
        required
        :label="$t('confirmPassword')"
        name="confirm_password"
      >
        <UInput
          class="w-full"
          v-model="state.confirm_password"
          :placeholder="$t('confirmYourNewPassword')"
          :type="showConfirmPassword ? 'text' : 'password'"
          icon="i-lucide-lock"
          :ui="{ trailing: 'pe-1' }"
          size="xl"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="xl"
              :icon="showConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="
                showConfirmPassword
                  ? $t('hideConfirmPassword')
                  : $t('showConfirmPassword')
              "
              :title="
                showConfirmPassword
                  ? $t('hideConfirmPassword')
                  : $t('showConfirmPassword')
              "
              :aria-pressed="showConfirmPassword"
              @click="showConfirmPassword = !showConfirmPassword"
            />
          </template>
        </UInput>
      </UFormField>

      <!-- Submit Button -->
      <div
        class="pt-4 border-t mt-5 space-y-2 border-gray-200 dark:border-gray-800"
      >
        <UButton type="submit" block :loading="isLoading" icon="i-lucide-save">
          {{ $t("save") }}
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const { t } = useI18n();

// Form state
const state = reactive({
  current_password: "",
  password: "",
  confirm_password: "",
});

// Separate visibility toggles
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const isLoading = ref(false);

// Validation schema
const schema = z
  .object({
    current_password: z.string().min(1, t("fieldRequired")),
    password: z
      .string()
      .min(8, t("atLeastEightCharacters"))
      .regex(/\d/, t("atLeastOneNumber"))
      .regex(/[a-z]/, t("atLeastOneLowercaseLetter"))
      .regex(/[A-Z]/, t("atLeastOneUppercaseLetter")),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: t("passwordsDoNotMatch"),
    path: ["confirm_password"],
  });

type Schema = z.output<typeof schema>;

function checkStrength(str: string) {
  const requirements = [
    { regex: /.{8,}/, text: t("atLeastEightCharacters") },
    { regex: /\d/, text: t("atLeastOneNumber") },
    { regex: /[a-z]/, text: t("atLeastOneLowercaseLetter") },
    { regex: /[A-Z]/, text: t("atLeastOneUppercaseLetter") },
  ];

  return requirements.map((req) => ({
    met: req.regex.test(str),
    text: req.text,
  }));
}

// Only check strength of NEW password
const strength = computed(() => checkStrength(state.password));
const score = computed(() => strength.value.filter((req) => req.met).length);

const color = computed(() => {
  if (score.value === 0) return "neutral";
  if (score.value <= 1) return "error";
  if (score.value <= 2) return "warning";
  if (score.value === 3) return "warning";
  return "success";
});

const text = computed(() => {
  if (score.value === 0) return t("enterAPassword");
  if (score.value <= 2) return t("weakPassword");
  if (score.value === 3) return t("mediumPassword");
  return t("strongPassword");
});

const toast = useToast();
const serverError = ref(<any | null>null);
async function onSubmit(event: FormSubmitEvent<Schema>) {
  serverError.value = null;
  isLoading.value = true;
  try {
    const responce: any = await useApiFetchRaw("/change-password", {
      method: "POST",
      body: {
        current_password: event.data.current_password,
        new_password: event.data.password,
      },
    });

    toast.add({
      title: "Success",
      description: responce.message,
      color: "success",
    });

    const logoutResponce = await useLogout();

    await navigateTo({ name: "admin-login" });

    // Reset form
    state.current_password = "";
    state.password = "";
    state.confirm_password = "";
  } catch (error: any) {
    serverError.value = error.data.message;
  } finally {
    isLoading.value = false;
  }
}
</script>
