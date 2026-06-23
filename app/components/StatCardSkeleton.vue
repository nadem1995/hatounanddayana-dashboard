<template>
  <UCard variant="outline" :ui="{ body: 'p-6' }">
    <div class="flex items-center gap-5">
      <USkeleton class="h-16 w-16 rounded-2xl" />
      <div class="flex flex-col gap-2.5 flex-1">
        <USkeleton class="h-3 w-24" />
        <USkeleton class="h-9 w-20" />
      </div>
    </div>
  </UCard>
</template>
