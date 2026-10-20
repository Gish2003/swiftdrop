import { Alert } from './Alert';

/** Placeholder used by scaffold pages. Delete it from your page when you build the real UI. */
export function NotImplemented({ owner, doc }: { owner: string; doc: string }) {
  return (
    <Alert tone="warning">
      This page is a scaffold stub — owner <strong>{owner}</strong>. See <code>{doc}</code>.
    </Alert>
  );
}
