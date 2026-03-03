/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY?: string;
  readonly VITE_API_KEY?: string;
  readonly VITE_TURNSTILE_SITE_KEY?: string;
  readonly VITE_CAPTCHA_ENFORCED?: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
