/** Deterministic placeholder image per property (no backend image field required). */
export function getPropertyImageUrl(propertyId: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(propertyId)}/640/400`;
}
