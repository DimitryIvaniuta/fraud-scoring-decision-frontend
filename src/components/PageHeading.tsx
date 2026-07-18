interface PageHeadingProps {
  readonly description: string;
  readonly eyebrow: string;
  readonly title: string;
}

/** Large page heading used in the central workspace. */
export function PageHeading({ description, eyebrow, title }: PageHeadingProps) {
  return (
    <header className="page-heading">
      <span>{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}
