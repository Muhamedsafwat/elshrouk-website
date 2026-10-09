/* eslint-disable @next/next/no-img-element */
/**
 * Official logo artwork for the CMS login/nav (extracted vectors — never redrawn).
 * The admin theme is forced to light, so the full-colour master is always on a light ground.
 */
export function AdminLogo() {
  return (
    <img
      src="/brand/alshorouk-logo-full-color.svg"
      alt="الشروق — لتوزيع الأدوية واللقاحات البيطرية"
      width={150}
      height={139}
      style={{ display: 'block', width: 150, height: 'auto' }}
    />
  )
}

export function AdminIcon() {
  return (
    <img
      src="/favicon.svg"
      alt="الشروق"
      width={28}
      height={28}
      style={{ display: 'block', width: 28, height: 28 }}
    />
  )
}
