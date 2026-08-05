export interface BrandMarkProps {
  className?: string;
  inverted?: boolean;
}

export function BrandMark({
  className = "",
  inverted = false,
}: BrandMarkProps) {
  return (
    <span
      className={`iuv-brand-mark ${inverted ? "is-inverted" : ""} ${className}`}
      aria-hidden="true"
    >
      <span />
      <span />
      <span />
    </span>
  );
}

export interface BrandLockupProps extends BrandMarkProps {
  compact?: boolean;
}

export function BrandLockup({ compact = false, ...props }: BrandLockupProps) {
  return (
    <span className="iuv-brand-lockup">
      <BrandMark {...props} />
      {compact ? null : <span className="iuv-wordmark">iuvui</span>}
    </span>
  );
}
