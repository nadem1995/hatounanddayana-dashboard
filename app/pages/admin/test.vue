<template>
  <div class="max-w-3xl mx-auto p-6 space-y-4">
    <!-- Editor -->
    <UEditor v-slot="{ editor }" v-model="content" placeholder="Start writing..." class="w-full min-h-48 border border-gray-200 dark:border-gray-800 rounded-xl">
      <UEditorToolbar :editor="editor" :items="items" />
    </UEditor>

    <!-- Live output -->
    <UCard>
      <template #header>
        <span class="text-sm font-mono font-bold">HTML output</span>
      </template>
      <pre class="text-xs whitespace-pre-wrap break-all">{{ content }}</pre>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { EditorToolbarItem } from '@nuxt/ui'

const content = ref('<p>Hello <strong>World</strong></p>')

const items: EditorToolbarItem[] = [
  { kind: 'mark',         mark: 'bold',      icon: 'i-lucide-bold'          },
  { kind: 'mark',         mark: 'italic',    icon: 'i-lucide-italic'        },
  { kind: 'mark',         mark: 'strike',    icon: 'i-lucide-strikethrough' },
  { kind: 'mark',         mark: 'code',      icon: 'i-lucide-code'          },
  { kind: 'heading',      level: 1,          icon: 'i-lucide-heading-1'     },
  { kind: 'heading',      level: 2,          icon: 'i-lucide-heading-2'     },
  { kind: 'bulletList',                      icon: 'i-lucide-list'          },
  { kind: 'orderedList',                     icon: 'i-lucide-list-ordered'  },
  { kind: 'blockquote',                      icon: 'i-lucide-quote'         },
  { kind: 'link',                            icon: 'i-lucide-link'          },
  { kind: 'undo',                            icon: 'i-lucide-undo'          },
  { kind: 'redo',                            icon: 'i-lucide-redo'          },
  { kind: 'clearFormatting',                 icon: 'i-lucide-remove-formatting' },
]
</script>
