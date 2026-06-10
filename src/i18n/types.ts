// ============================================================
// Dictionary contract — every visible string lives here.
// `en.ts` and `zh.ts` both satisfy this type. Components read
// ONLY from the dictionary so the English tree never renders a
// Chinese word and vice-versa. Icons / slugs / colors are owned
// by the components (they do not translate), so they are NOT here.
// ============================================================

export type Lang = "en" | "zh";

export interface CTA {
  label: string;
  /** path key WITHOUT the language prefix, e.g. "contact", "services/crew-manning", "" = home */
  to: string;
}

export interface TitleText {
  title: string;
  text: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface NavChild {
  label: string;
  to: string;
  /** when true, `to` is treated as a full external URL opened in a new tab */
  external?: boolean;
}

export interface NavItem {
  label: string;
  to?: string;
  /** dropdown children */
  children?: NavChild[];
  /** render the dropdown as a wide two-column grid */
  wide?: boolean;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface TimelineItem {
  marker: string;
  title: string;
  text: string;
}

export interface Step {
  title: string;
  text: string;
}

export interface CertCard {
  abbr: string;
  name: string;
  desc: string;
}

export interface ServiceContent {
  metaTitle: string;
  metaDescription: string;
  breadcrumb: string;
  title: string;
  sub: string;
  introTag: string;
  introTitle: string;
  introParagraphs: string[];
  introCta: string;
  /** the dark side-card */
  listTitle: string;
  listItems: string[];
  /** optional 3-card "what we provide" block */
  provideTag?: string;
  provideTitle?: string;
  provideCards?: TitleText[];
  /** optional highlight box (emergency page) */
  highlightTitle?: string;
  highlightText?: string;
  ctaTitle: string;
  ctaText: string;
  ctaPrimary: string;
}

export interface CategoryContent {
  metaTitle: string;
  metaDescription: string;
  breadcrumb: string;
  title: string;
  sub: string;
  introTag: string;
  introTitle: string;
  introText: string;
  roles: TitleText[];
  ctaTitle: string;
  ctaText: string;
  ctaPrimary: string;
}

export interface Dictionary {
  // -------- meta / global --------
  lang: Lang;
  htmlLang: string;
  dir: "ltr";

  common: {
    brand: string;
    tagline: string;
    requestCrew: string;
    speakSpecialist: string;
    learnMore: string;
    readMore: string;
    readGuide: string;
    readArticle: string;
    viewAll: string;
    getInTouch: string;
    exploreService: string;
    backToBlog: string;
    allRightsReserved: string;
    minRead: string;
  };

  topbar: {
    email: string;
    emergency: string;
  };

  nav: NavItem[];

  footer: {
    blurb: string;
    certs: string[];
    servicesTitle: string;
    categoriesTitle: string;
    companyTitle: string;
    contactTitle: string;
    services: NavChild[];
    categories: NavChild[];
    company: NavChild[];
    contactEmailLabel: string;
    contactEmail: string;
    contactEmergencyLabel: string;
    contactEmergency: string;
    contactWebsite: string;
    licenseLabel: string;
    bottomLinks: string[];
    copyright: string;
  };

  preFooter: {
    leftTitle: string;
    leftText: string;
    leftCta: string;
    rightTitle: string;
    rightText: string;
    rightCta: string;
  };

  // -------- home --------
  home: {
    metaTitle: string;
    metaDescription: string;
    hero: {
      eyebrow: string;
      // headline rendered as: lead <em>emphasis</em> tail
      headlineLead: string;
      headlineEmphasis: string;
      headlineTail: string;
      // rotating words for the typewriter under the headline
      rotating: string[];
      sub: string;
      ctaPrimary: string;
      ctaSecondary: string;
      stats: Stat[];
    };
    trustbar: Stat[];
    who: {
      badge: string;
      cardTitle: string;
      cardText: string;
      cardList: string[];
      floatNum: string;
      floatLabel: string;
      tag: string;
      title: string;
      paragraphs: string[];
      pillars: TitleText[];
      cta: string;
    };
    services: {
      tag: string;
      title: string;
      text: string;
      cards: TitleText[];
    };
    why: {
      tag: string;
      title: string;
      text: string;
      cards: { pain: string; title: string; text: string }[];
    };
    process: {
      tag: string;
      title: string;
      text: string;
      steps: Step[];
    };
    crewCats: {
      tag: string;
      title: string;
      text: string;
      cards: { title: string; roles: string[]; link: string }[];
    };
    compliance: {
      tag: string;
      title: string;
      paragraphs: string[];
      checks: string[];
      cta: string;
      certCards: CertCard[];
    };
    global: {
      tag: string;
      title: string;
      text: string;
      feats: TitleText[];
      mapTitle: string;
      mapText: string;
      regions: string[];
    };
    faq: {
      tag: string;
      title: string;
      text: string;
      items: FaqItem[];
      cta: string;
    };
    knowledge: {
      tag: string;
      title: string;
      text: string;
      featured: { tag: string; title: string; text: string };
      cards: { tag: string; title: string; text: string }[];
      cta: string;
    };
    finalCta: {
      eyebrow: string;
      title: string;
      sub: string;
      ctaPrimary: string;
      ctaSecondary: string;
      contact: { label: string; value: string }[];
    };
  };

  // -------- about --------
  about: {
    metaTitle: string;
    metaDescription: string;
    breadcrumb: string;
    title: string;
    sub: string;
    storyTag: string;
    storyTitle: string;
    storyParagraphs: string[];
    missionTitle: string;
    missionText: string;
    missionList: string[];
    journeyTag: string;
    journeyTitle: string;
    timeline: TimelineItem[];
    valuesTag: string;
    valuesTitle: string;
    values: TitleText[];
    ctaTitle: string;
    ctaText: string;
  };

  // -------- why us --------
  whyUs: {
    metaTitle: string;
    metaDescription: string;
    breadcrumb: string;
    title: string;
    sub: string;
    tag: string;
    sectionTitle: string;
    stats: Stat[];
    cards: TitleText[];
    ctaTitle: string;
    ctaText: string;
  };

  // -------- compliance --------
  compliance: {
    metaTitle: string;
    metaDescription: string;
    breadcrumb: string;
    title: string;
    sub: string;
    tag: string;
    sectionTitle: string;
    paragraphs: string[];
    steps: Step[];
    certCards: CertCard[];
    ctaTitle: string;
    ctaText: string;
    credentialsTag: string;
    credentialsTitle: string;
    credentialsText: string;
    credentialsItems: string[];
  };

  // -------- process --------
  process: {
    metaTitle: string;
    metaDescription: string;
    breadcrumb: string;
    title: string;
    sub: string;
    tag: string;
    sectionTitle: string;
    sectionText: string;
    steps: Step[];
    ctaTitle: string;
    ctaText: string;
  };

  // -------- services & categories (keyed by slug) --------
  services: Record<string, ServiceContent>;
  categories: Record<string, CategoryContent>;
  servicesIndex: {
    metaTitle: string;
    metaDescription: string;
    breadcrumb: string;
    title: string;
    sub: string;
  };
  categoriesIndex: {
    metaTitle: string;
    metaDescription: string;
    breadcrumb: string;
    title: string;
    sub: string;
  };

  // -------- blog --------
  blog: {
    metaTitle: string;
    metaDescription: string;
    breadcrumb: string;
    title: string;
    sub: string;
    empty: string;
    featured: string;
    latest: string;
    relatedTitle: string;
    backLabel: string;
    tableOfContents: string;
    sharePost: string;
    writtenBy: string;
  };

  // -------- faq --------
  faq: {
    metaTitle: string;
    metaDescription: string;
    breadcrumb: string;
    title: string;
    sub: string;
    items: FaqItem[];
    ctaTitle: string;
    ctaText: string;
  };

  // -------- contact --------
  contact: {
    metaTitle: string;
    metaDescription: string;
    breadcrumb: string;
    title: string;
    sub: string;
    formTag: string;
    formTitle: string;
    formText: string;
    fields: {
      name: string;
      namePlaceholder: string;
      company: string;
      companyPlaceholder: string;
      email: string;
      emailPlaceholder: string;
      phone: string;
      phonePlaceholder: string;
      vesselType: string;
      vesselTypeDefault: string;
      vesselTypes: string[];
      serviceType: string;
      serviceTypeDefault: string;
      serviceTypes: string[];
      ranks: string;
      ranksPlaceholder: string;
      message: string;
      messagePlaceholder: string;
      submit: string;
      submitting: string;
      disclaimer: string;
      successTitle: string;
      successText: string;
      errorText: string;
    };
    infoTitle: string;
    infoText: string;
    infoItems: { label: string; value: string }[];
    emergencyTitle: string;
    emergencyText: string;
    emergencyCta: string;
    mapTitle: string;
    qr: {
      tag: string;
      title: string;
      text: string;
      items: string[];
    };
  };

  // -------- legal / not found --------
  team: {
    metaTitle: string;
    metaDescription: string;
    breadcrumb: string;
    title: string;
    sub: string;
    tag: string;
    sectionTitle: string;
    sectionText: string;
    roles: string[];
    ctaTitle: string;
    ctaText: string;
  };

  newsletter: {
    badge: string;
    titleLead: string;
    titleEmphasis: string;
    sub: string;
    placeholder: string;
    cta: string;
    submitting: string;
    success: string;
    error: string;
    pills: string[];
    fine: string;
  };

  notFound: {
    title: string;
    text: string;
    cta: string;
  };
}
