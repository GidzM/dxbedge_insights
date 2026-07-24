import React from 'react';
import { Link } from 'react-router-dom';

interface HeroBannerProps {
  title: string;
  subtitle?: string;
  background?: string;
  image?: string | null;
  cta?: { href: string; label: string } | null;
}

export default function HeroBanner({
  title,
  subtitle,
  background = '#f8f9fa',
  image = null,
  cta = null
}: HeroBannerProps) {
  const isInternalLink = Boolean(cta?.href?.startsWith('/'));

  return (
    <section
      className="relative overflow-hidden rounded-xl border border-sand-neutral bg-skyline-grey px-8 py-16 md:px-10"
      style={{
        background,
        position: "relative",
        overflow: 'hidden',
      }}
    >
      {image && (
        <>
          <img
            src={image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-20 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/75 to-white/30" />
        </>
      )}

      <div className="relative z-10 max-w-[800px]">
        <h1 className="max-w-3xl text-[2.8rem] font-bold leading-tight text-brand-navy">{title}</h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-grey">{subtitle}</p>
        )}

        {cta && isInternalLink && (
          <Link
            to={cta.href}
            className="cta-primary mt-6 inline-flex items-center justify-center"
          >
            {cta.label}
          </Link>
        )}

        {cta && !isInternalLink && (
          <a
            href={cta.href}
            className="cta-primary mt-6 inline-flex items-center justify-center"
          >
            {cta.label}
          </a>
        )}
      </div>
    </section>
  );
}
