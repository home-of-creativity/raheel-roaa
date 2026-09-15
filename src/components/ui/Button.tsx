import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "dark" | "quiet";
type Size = "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2.5 rounded-full font-semibold transition-all duration-300 ease-brand disabled:pointer-events-none disabled:opacity-50";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gold text-ink shadow-gold hover:bg-gold-bright hover:shadow-[0_18px_44px_-14px_rgb(245_197_24/0.7)] hover:-translate-y-0.5",
  outline:
    "border border-paper/25 bg-paper/5 text-paper backdrop-blur-sm hover:border-gold/70 hover:bg-gold/10 hover:text-gold",
  dark:
    "bg-ink text-paper hover:bg-ink-raised hover:text-gold hover:-translate-y-0.5",
  quiet:
    "border border-charcoal/20 bg-transparent text-charcoal hover:border-gold-deep hover:text-gold-deep",
};

const sizeClasses: Record<Size, string> = {
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Renders a trailing arrow that nudges on hover and mirrors under RTL. */
  withArrow?: boolean;
  className?: string;
};

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

function Arrow() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4 shrink-0 transition-transform duration-300 ease-brand group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.5 10h13M11 4.5 16.5 10 11 15.5" />
    </svg>
  );
}

/** Hash links, phone links, and external URLs bypass the router. */
function isPlainAnchor(href: string) {
  return /^(#|https?:|tel:|mailto:)/.test(href);
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  withArrow = false,
  className = "",
  ...props
}: ButtonProps) {
  const classes = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  const content = (
    <>
      {children}
      {withArrow && <Arrow />}
    </>
  );

  if ("href" in props && props.href) {
    const { href, ...linkProps } = props;

    if (isPlainAnchor(href)) {
      return (
        <a href={href} className={classes} {...linkProps}>
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...linkProps}>
        {content}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = props as ButtonAsButton;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
