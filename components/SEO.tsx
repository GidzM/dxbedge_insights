import React from "react";
import { Helmet } from "react-helmet-async";
import { defaultSEO } from "../config/seo";
import { getFullUrl } from "../utils/getUrl";

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "article" | "website";
  publishedTime?: string;
  modifiedTime?: string;
  jsonLd?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  path = "",
  image,
  type = "article",
  publishedTime,
  modifiedTime,
  jsonLd = false,
}) => {
  const url = getFullUrl(path);
  const imageUrl = image || defaultSEO.defaultImage;

  const jsonLdData = jsonLd
    ? {
        "@context": "https://schema.org",
        "@type": type === "article" ? "Article" : "WebPage",
        headline: title,
        description,
        author: {
          "@type": "Organization",
          name: defaultSEO.author,
        },
        image: imageUrl,
        url,
        datePublished: publishedTime,
        dateModified: modifiedTime || publishedTime,
      }
    : null;

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* OpenGraph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={defaultSEO.siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:creator" content={defaultSEO.twitterHandle} />

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLdData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
