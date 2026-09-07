import Link from "next/link";

type Props = {
  children: React.ReactNode;
  href?: string;
  external?: boolean;
  className?: string;
};

const base =
  "surface rounded-xl p-5 transition duration-200";
const interactive =
  "hover:-translate-y-0.5 hover:border-brand hover:shadow-lg hover:shadow-brand/5";

export default function Card({ children, href, external, className = "" }: Props) {
  if (href) {
    const cls = `${base} ${interactive} block ${className}`;
    if (external) {
      return (
        <a href={href} target="_blank" rel="noreferrer" className={cls}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return <div className={`${base} ${className}`}>{children}</div>;
}
