import React from "react";
import { Helmet } from "react-helmet-async";
import { defaultSEO } from "../config/seo";
import { getFullUrl } from "../utils/getUrl";

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  type?: "article" | "website";
  schemaType?: string;
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
  jsonLd?: boolean | Record<string, unknown> | Record<string, unknown>[];
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  path = "",
  image,
  imageAlt,
  type = "article",
  schemaType,
  publishedTime,
  modifiedTime,
  keywords,
  jsonLd = true,
}) => {
  const url = getFullUrl(path);
  const imageUrl = image
    ? (image.startsWith('http') ? image : getFullUrl(image))
    : getFullUrl(defaultSEO.defaultImage);
  const imageDescription = imageAlt || title;

  const resolvedSchemaType = schemaType || (type === "article" ? "Article" : "WebPage");

  const generatedJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": resolvedSchemaType,
    name: title,
    description,
    url,
    image: imageUrl,
    inLanguage: "en-GB",
    author: {
      "@type": "Organization",
      name: defaultSEO.author,
    },
    publisher: {
      "@type": "Organization",
      name: defaultSEO.siteName,
      logo: {
        "@type": "ImageObject",
        url: getFullUrl(defaultSEO.defaultImage),
      },
    },
  };

  if (resolvedSchemaType === "Article") {
    generatedJsonLd.headline = title;
  }

  if (publishedTime) {
    generatedJsonLd.datePublished = publishedTime;
  }

  if (modifiedTime || publishedTime) {
    generatedJsonLd.dateModified = modifiedTime || publishedTime;
  }

  const jsonLdPayload = typeof jsonLd === "boolean"
    ? (jsonLd ? generatedJsonLd : null)
    : jsonLd;

  const jsonLdEntries = Array.isArray(jsonLdPayload)
    ? jsonLdPayload
    : jsonLdPayload
      ? [jsonLdPayload]
      : [];

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}
      <meta name="author" content={defaultSEO.author} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={url} />
      <meta name="theme-color" content="#0A192F" />

      {/* OpenGraph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={imageDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={defaultSEO.siteName} />
      <meta property="og:locale" content="en_GB" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      <meta property="article:author" content={defaultSEO.author} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={imageDescription} />
      <meta name="twitter:site" content={defaultSEO.twitterHandle} />
      <meta name="twitter:creator" content={defaultSEO.twitterHandle} />

      {/* JSON-LD */}
      {jsonLdEntries.map((entry, index) => (
        <script key={`${title}-${index}`} type="application/ld+json">
          {JSON.stringify(entry)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
