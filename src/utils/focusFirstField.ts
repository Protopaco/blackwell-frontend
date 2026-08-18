// Focuses the first enabled input/textarea found within a container — used to focus a dialog's first
// field when it opens. Dialogs in this app stay mounted between opens (only their `open` prop toggles),
// so React's `autoFocus` only ever fires once on initial mount and never again on reopen; calling this
// from the Dialog's `onEntered` transition callback instead runs every time the dialog actually opens.
const focusFirstField = (container: HTMLElement | null): void => {
  const firstField = container?.querySelector<HTMLElement>(
    'input:not([disabled]):not([type="hidden"]), textarea:not([disabled])',
  );
  firstField?.focus();
};

export default focusFirstField;
