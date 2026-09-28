import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'

import { SITE_NAME, SITE_URL, OG_IMAGE, GITHUB_ORG, absoluteUrl } from '@/config/site'
import { CONTACT_EMAIL, SOCIAL_LINKS, WHATSAPP_NUMBER } from '@/config/contact'
import { services } from '@/data'

/**
 * Gestiona el <head> de forma reactiva por ruta e idioma:
 * title, description, canonical, Open Graph, Twitter Card y JSON-LD
 * (Organization + WebSite + WebPage + BreadcrumbList). La Organization lleva
 * contacto y el catálogo de servicios.
 * Se invoca una sola vez desde App.vue; el build lo prerenderiza en cada HTML.
 */
export function useSeo(): void {
  const route = useRoute()
  const { t, locale } = useI18n()

  useHead(
    computed(() => {
      const title = t(route.meta.titleKey ?? 'meta.titulo')
      const description = t(route.meta.descKey ?? 'meta.descripcion')
      const url = absoluteUrl(route.path)
      const isHome = route.name === 'home'
      const noindex = Boolean(route.meta.noindex)

      const homeCrumb = { name: t('nav.inicio'), item: absoluteUrl('/') }
      const crumbs = isHome
        ? [homeCrumb]
        : [homeCrumb, { name: t(route.meta.crumbKey ?? 'nav.inicio'), item: url }]

      const organizationId = `${SITE_URL}/#organization`
      const websiteId = `${SITE_URL}/#website`

      const graph = [
        {
          '@type': 'Organization',
          '@id': organizationId,
          name: SITE_NAME,
          alternateName: ['Wind Kode', 'windkode-ofi'],
          url: `${SITE_URL}/`,
          logo: { '@type': 'ImageObject', url: OG_IMAGE, width: 1200, height: 630 },
          email: CONTACT_EMAIL,
          slogan: t('footer.tagline'),
          description: t('meta.descripcion'),
          areaServed: { '@type': 'Country', name: 'Bolivia' },
          knowsLanguage: ['es', 'en'],
          sameAs: [GITHUB_ORG, ...SOCIAL_LINKS.map((s) => s.href)],
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            email: CONTACT_EMAIL,
            telephone: `+${WHATSAPP_NUMBER}`,
            areaServed: 'BO',
            availableLanguage: ['Spanish', 'English'],
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: t('servicios.titulo'),
            itemListElement: services.map((service) => ({
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: t(`servicios.items.${service.key}.titulo`),
                description: t(`servicios.items.${service.key}.descripcion`),
                provider: { '@id': organizationId },
                areaServed: { '@type': 'Country', name: 'Bolivia' },
              },
            })),
          },
        },
        {
          '@type': 'WebSite',
          '@id': websiteId,
          name: SITE_NAME,
          url: `${SITE_URL}/`,
          description: t('meta.descripcion'),
          inLanguage: ['es', 'en'],
          publisher: { '@id': organizationId },
        },
        {
          '@type': 'WebPage',
          '@id': `${url}#webpage`,
          url,
          name: title,
          description,
          inLanguage: locale.value,
          isPartOf: { '@id': websiteId },
          breadcrumb: { '@id': `${url}#breadcrumb` },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${url}#breadcrumb`,
          itemListElement: crumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: crumb.item,
          })),
        },
      ]

      return {
        title,
        htmlAttrs: { lang: locale.value },
        meta: [
          { name: 'description', content: description },
          {
            name: 'robots',
            content: noindex
              ? 'noindex, follow'
              : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
          },
          { property: 'og:type', content: 'website' },
          { property: 'og:site_name', content: SITE_NAME },
          { property: 'og:locale', content: locale.value === 'en' ? 'en_US' : 'es_BO' },
          { property: 'og:locale:alternate', content: locale.value === 'en' ? 'es_BO' : 'en_US' },
          { property: 'og:title', content: title },
          { property: 'og:description', content: description },
          { property: 'og:url', content: url },
          { property: 'og:image', content: OG_IMAGE },
          { property: 'og:image:width', content: '1200' },
          { property: 'og:image:height', content: '630' },
          { property: 'og:image:alt', content: `${SITE_NAME} — Desarrollo de software en Bolivia` },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: title },
          { name: 'twitter:description', content: description },
          { name: 'twitter:image', content: OG_IMAGE },
        ],
        link: noindex ? [] : [{ rel: 'canonical', href: url }],
        script: [
          {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
          },
        ],
      }
    }),
  )
}
