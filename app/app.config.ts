export default defineAppConfig({
  ui: {
    table: {
      slots: {
        base: 'table-fixed border-separate border-spacing-0',
        thead: '[&>tr]:bg-elevated/50 after:top-[calc(100%+10px)]',
        tbody: '[&>tr]:last:[&>td]:border-b-0',
        th: 'p-3 first:rounded-s-lg last:rounded-e-lg border-y border-default first:border-s last:border-e',
        td: 'border-b p-3 border-default',
        separator: 'h-0',
      }
    },
    colors: {
      primary: 'green',
      neutral: 'zinc'
    }
  }
})
