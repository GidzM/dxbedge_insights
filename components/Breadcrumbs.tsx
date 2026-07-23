import React from 'react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol
        itemScope
        itemType="https://schema.org/BreadcrumbList"
        className="flex flex-wrap items-center gap-y-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-grey"
      >
        {items.map((item, index) => (
          <li
            key={`${item.href}-${item.label}`}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="inline-flex items-center"
          >
            <Link to={item.href} itemProp="item" className="transition-colors hover:text-brand-gold">
              <span itemProp="name">{item.label}</span>
            </Link>
            <meta itemProp="position" content={String(index + 1)} />
            {index < items.length - 1 && (
              <span aria-hidden="true" className="mx-2 text-slate-400">
                /
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;