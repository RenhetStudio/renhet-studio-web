export const toastState = $state<{ current: { message: string; ok: boolean } | null }>({ current: null });

export function showToast(message: string, ok = true) {
  toastState.current = { message, ok };
}
