interface JsonLdProps {
  data: Record<string, unknown>;
}

/** Renders a <script type="application/ld+json"> tag for structured data */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
