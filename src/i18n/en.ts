import type { Dictionary } from "./types";

export const en: Dictionary = {
  lang: "en",
  htmlLang: "en",
  dir: "ltr",

  common: {
    brand: "Ship Crew Agency",
    tagline: "Global Maritime Manning",
    requestCrew: "Request Crew",
    speakSpecialist: "Speak With Specialist",
    learnMore: "Learn More",
    readMore: "Read More",
    readGuide: "Read Guide",
    readArticle: "Read Article",
    viewAll: "View All",
    getInTouch: "Get In Touch",
    exploreService: "Explore Service",
    backToBlog: "Back to Knowledge Hub",
    allRightsReserved: "All rights reserved.",
    minRead: "min read",
  },

  topbar: {
    email: "info@shipcrewagency.com",
    emergency: "+880 1626 366030",
  },

  nav: [
    { label: "Home", to: "" },
    {
      label: "About",
      to: "about",
      children: [
        { label: "About Us", to: "about" },
        { label: "Team", to: "team" },
        { label: "Why Choose Us", to: "why-us" },
        { label: "Compliance & Safety", to: "compliance" },
        { label: "Our Process", to: "process" },
      ],
    },
    {
      label: "Services",
      to: "services",
      wide: true,
      children: [
        { label: "Crew Manning Agency", to: "services/crew-manning" },
        { label: "Seafarer Recruitment", to: "services/seafarer-recruitment" },
        { label: "Crew Replacement Services", to: "services/crew-replacement" },
        { label: "Crew Change Services", to: "services/crew-change" },
        { label: "Offshore Crew Manning", to: "services/offshore-manning" },
        { label: "Emergency Crew Deployment", to: "services/emergency-crew" },
      ],
    },
    {
      label: "Crew Categories",
      to: "crew",
      children: [
        { label: "Deck Crew", to: "crew/deck-crew" },
        { label: "Engine Crew", to: "crew/engine-crew" },
        { label: "Hospitality Crew", to: "crew/hospitality-crew" },
        { label: "Offshore Crew", to: "crew/offshore-crew" },
      ],
    },
    {
      label: "Resources",
      to: "blog",
      children: [
        { label: "Maritime Blog", to: "blog" },
        { label: "FAQ", to: "faq" },
        {
          label: "Manning Agency Guideline",
          to: "https://drive.google.com/file/d/1IH1FUTY34pIHueNBi68uITMh_2a9BN5_/view?usp=drive_link",
          external: true,
        },
        {
          label: "Company Profile",
          to: "https://drive.google.com/file/d/1G-HwuDVVfVWisr7V11WklDrUysHOaIPs/view?usp=drive_link",
          external: true,
        },
      ],
    },
    { label: "Contact", to: "contact" },
  ],

  footer: {
    blurb:
      "A trusted global ship crew manning agency serving shipowners and vessel operators worldwide since 2007. STCW-certified seafarers for every vessel type and maritime operation.",
    certs: ["STCW", "MLC 2006", "IMO", "ISM"],
    servicesTitle: "Services",
    categoriesTitle: "Crew Categories",
    companyTitle: "Company",
    contactTitle: "Contact Us",
    services: [
      { label: "Crew Manning Agency", to: "services/crew-manning" },
      { label: "Seafarer Recruitment", to: "services/seafarer-recruitment" },
      { label: "Crew Replacement", to: "services/crew-replacement" },
      { label: "Crew Change Services", to: "services/crew-change" },
      { label: "Offshore Crew Manning", to: "services/offshore-manning" },
      { label: "Emergency Deployment", to: "services/emergency-crew" },
    ],
    categories: [
      { label: "Deck Crew", to: "crew/deck-crew" },
      { label: "Engine Crew", to: "crew/engine-crew" },
      { label: "Hospitality Crew", to: "crew/hospitality-crew" },
      { label: "Offshore Crew", to: "crew/offshore-crew" },
    ],
    company: [
      { label: "About Us", to: "about" },
      { label: "Team", to: "team" },
      { label: "Why Choose Us", to: "why-us" },
      { label: "Compliance & Safety", to: "compliance" },
      { label: "Our Process", to: "process" },
      { label: "Knowledge Hub", to: "blog" },
      { label: "FAQ", to: "faq" },
      { label: "Contact Us", to: "contact" },
    ],
    contactEmailLabel: "Email",
    contactEmail: "info@shipcrewagency.com",
    contactEmergencyLabel: "24/7 Emergency",
    contactEmergency: "+880 1626 366030",
    contactWebsite: "www.shipcrewagency.com",
    licenseLabel: "Govt. Manning Licence No.",
    bottomLinks: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Sitemap"],
    copyright:
      "© 2026 Ship Crew Agency. A Global Ship Crew Manning Agency.",
  },

  preFooter: {
    leftTitle: "Have a Crew Requirement or a Question?",
    leftText:
      "Our maritime staffing specialists are ready to answer your questions and build a reliable, long-term manning partnership with you.",
    leftCta: "Get in Touch",
    rightTitle: "Download Our Company Brochure",
    rightText:
      "Get a complete overview of our manning services, crew categories and compliance standards in one concise PDF.",
    rightCta: "Download Brochure",
  },

  home: {
    metaTitle: "Ship Crew Agency — Global Ship Crew Manning Agency",
    metaDescription:
      "Ship Crew Agency is a trusted global ship crew manning agency with 17 years experience. STCW-certified seafarers for shipowners, fleet managers and vessel operators worldwide.",
    hero: {
      eyebrow: "Trusted Maritime Workforce Partner — Since 2007",
      headlineLead: "Your Global",
      headlineEmphasis: "Ship Crew Manning",
      headlineTail: "Agency Partner",
      rotating: [
        "Qualified Seafarers",
        "STCW-Certified Officers",
        "72-Hour Deployment",
        "Fully Compliant Crew",
      ],
      sub: "We supply qualified, certified, and fully compliant seafarers to shipowners, vessel operators, and ship management companies across every major shipping route worldwide.",
      ctaPrimary: "Request Qualified Crew",
      ctaSecondary: "Speak With Specialist",
      stats: [
        { value: "17+", label: "Years Experience" },
        { value: "Global", label: "Worldwide Operations" },
        { value: "STCW", label: "Verified Seafarers" },
        { value: "72hr", label: "Fast Deployment" },
        { value: "MLC", label: "Compliance Assured" },
      ],
    },
    trustbar: [
      { value: "17 Yrs", label: "Industry Experience" },
      { value: "Global", label: "Worldwide Deployment" },
      { value: "STCW", label: "Certified Only" },
      { value: "72hr", label: "Fast Mobilization" },
      { value: "MLC", label: "Compliance Focused" },
    ],
    who: {
      badge: "Trusted Since 2007",
      cardTitle: "Supplying Qualified Seafarers to the World's Best Fleets",
      cardText:
        "From bulk carriers to cruise vessels — we deliver the right crew, at the right time, with the right credentials.",
      cardList: [
        "Deck Officers, Engineers & Ratings",
        "Hospitality & Catering Crew",
        "Offshore & Specialist Personnel",
        "Emergency & Urgent Replacements",
      ],
      floatNum: "17+",
      floatLabel: "Years Maritime Crewing",
      tag: "Who We Are",
      title:
        "A Global Ship Crew Manning Agency Built for Maritime Operations",
      paragraphs: [
        "Ship Crew Agency is a specialist maritime workforce partner serving shipowners, fleet managers, and ship management companies across global shipping routes. Since 2007, we have been the trusted link between vessel operators and the qualified seafarers they need.",
        "Our services go beyond staffing. We verify credentials, confirm STCW certifications, conduct medical checks, handle documentation, and ensure every seafarer meets the compliance standards your vessels demand.",
      ],
      pillars: [
        {
          title: "Deep Maritime Knowledge",
          text: "17 years of specialist maritime recruitment across vessel types.",
        },
        {
          title: "Compliance First",
          text: "Every seafarer screened for STCW, MLC 2006, and flag-state requirements.",
        },
        {
          title: "Global Network",
          text: "Certified seafarers across all major maritime labour markets.",
        },
        {
          title: "Rapid Mobilization",
          text: "Emergency deployment capability for urgent crew replacement.",
        },
      ],
      cta: "Learn About Our Agency",
    },
    services: {
      tag: "Our Services",
      title: "Maritime Workforce Solutions Built for Every Vessel Type",
      text: "From single crew placements to complete vessel manning — end-to-end maritime staffing solutions for the global shipping industry.",
      cards: [
        {
          title: "Crew Manning Agency",
          text: "Complete vessel manning services for shipowners and ship management companies. Deck officers, engineers, ratings for all vessel types worldwide.",
        },
        {
          title: "Seafarer Recruitment",
          text: "Precision maritime recruitment for qualified seafarers worldwide. STCW-certified candidates across all departments — verified and ready for deployment.",
        },
        {
          title: "Crew Replacement",
          text: "Rapid response crew replacement at short notice. Qualified replacements mobilized to any port worldwide — minimizing operational disruption.",
        },
        {
          title: "Crew Change Services",
          text: "Seamless crew rotation and change management. We coordinate logistics, documentation, visas, and travel for on-time crew changes.",
        },
        {
          title: "Offshore Crew Manning",
          text: "Specialist offshore crew recruitment for oil rigs, FPSOs, and offshore support vessels. Qualified personnel with offshore safety certifications.",
        },
        {
          title: "Emergency Deployment",
          text: "24/7 emergency crew mobilization for critical situations. Fast response so your vessel keeps operating without costly delays.",
        },
      ],
    },
    why: {
      tag: "Why Choose Us",
      title:
        "We Solve the Maritime Staffing Problems That Cost You Time and Money",
      text: "Every challenge shipowners face has a solution. Here is how Ship Crew Agency delivers operational certainty.",
      cards: [
        {
          pain: "Pain: Delayed Deployment",
          title: "Crew Ready Within 72 Hours",
          text: "Pre-verified seafarer roster means we can mobilize qualified crew to your vessel within 72 hours — eliminating costly port delays.",
        },
        {
          pain: "Pain: Compliance Risk",
          title: "Fully Compliant Crew — Every Time",
          text: "Every seafarer is screened for STCW certification validity, MLC 2006 compliance, medical fitness, and flag-state documentation requirements.",
        },
        {
          pain: "Pain: Unreliable Seafarers",
          title: "Verified, Referenced, Trusted Crew",
          text: "Thorough background checks, service record verification, and reference confirmation before any seafarer joins your vessel.",
        },
        {
          pain: "Pain: Documentation Issues",
          title: "Complete Document Management",
          text: "We manage STCW certificates, endorsements, medical certificates, seaman's books, and all travel documentation — reducing your admin burden.",
        },
        {
          pain: "Pain: Crew Shortages",
          title: "Global Seafarer Pool Access",
          text: "International network connects you to certified seafarers across major maritime labour markets — never short-staffed regardless of vessel type.",
        },
        {
          pain: "Pain: Emergency Crewing",
          title: "24/7 Emergency Response",
          text: "Maritime emergencies don't follow business hours. Our dedicated team operates around the clock for urgent crew requirements.",
        },
      ],
    },
    process: {
      tag: "Our Process",
      title: "How We Source and Deploy Your Qualified Seafarers",
      text: "A proven six-step crew recruitment process — ensuring every seafarer is compliant, verified, and operationally ready.",
      steps: [
        {
          title: "Requirement Assessment",
          text: "Review vessel type, trade route, flag state, crew matrix, and certification requirements.",
        },
        {
          title: "Crew Sourcing",
          text: "Search pre-screened database and international network to match candidates to your needs.",
        },
        {
          title: "Verification",
          text: "STCW validation, service record review, reference confirmation, and background checks.",
        },
        {
          title: "Documentation",
          text: "Certificates, endorsements, seaman's books, and flag-state approvals prepared and verified.",
        },
        {
          title: "Medical Clearance",
          text: "Medical fitness confirmed through approved maritime medical examination centers.",
        },
        {
          title: "Fast Deployment",
          text: "Crew travel, visas, port joining logistics coordinated end-to-end for smooth mobilization.",
        },
      ],
    },
    crewCats: {
      tag: "Crew Categories",
      title: "Every Department. Every Vessel Type.",
      text: "Qualified, certified seafarers across all major vessel departments — bridge to engine room to hospitality and offshore operations.",
      cards: [
        {
          title: "Deck Crew",
          roles: [
            "Master / Captain",
            "Chief Officer / First Mate",
            "Second & Third Officer",
            "Bosun & Able Seamen",
          ],
          link: "View Deck Crew",
        },
        {
          title: "Engine Crew",
          roles: [
            "Chief Engineer",
            "Second & Third Engineer",
            "Electrical Officer (ETO)",
            "Engine Rating (Fitter, Oiler)",
          ],
          link: "View Engine Crew",
        },
        {
          title: "Hospitality Crew",
          roles: [
            "Chief Steward / Purser",
            "Cook / Chief Cook",
            "Messman / Steward",
            "Hotel & Cruise Staff",
          ],
          link: "View Hospitality Crew",
        },
        {
          title: "Offshore Crew",
          roles: [
            "Offshore Installation Manager",
            "Dynamic Positioning Officer",
            "ROV Pilot / Subsea Engineer",
            "Offshore Medic / Safety",
          ],
          link: "View Offshore Crew",
        },
      ],
    },
    compliance: {
      tag: "Compliance & Safety",
      title: "Regulatory Compliance Is Our Foundation.",
      paragraphs: [
        "Every seafarer supplied by Ship Crew Agency meets or exceeds international maritime regulatory requirements — STCW, MLC 2006, and applicable flag-state regulations.",
        "Our compliance team verifies each certification for authenticity, currency, and flag-state endorsement before any crew member joins your vessel.",
      ],
      checks: [
        "STCW Certificate Verification — all mandatory certifications confirmed",
        "MLC 2006 — Maritime Labour Convention compliance assured",
        "Medical Fitness Certificates — ENG1 and flag-state equivalents",
        "Flag State Endorsements — COCs endorsed for vessel flag requirements",
        "Seafarer Background Checks — employment history and references verified",
      ],
      cta: "View Compliance Details",
      certCards: [
        {
          abbr: "STCW",
          name: "International Convention",
          desc: "Standards of Training, Certification and Watchkeeping — the global baseline for maritime competence.",
        },
        {
          abbr: "MLC",
          name: "Maritime Labour Convention",
          desc: "MLC 2006 sets minimum standards for seafarer working conditions, welfare, and employment agreements.",
        },
        {
          abbr: "IMO",
          name: "International Maritime Org.",
          desc: "Full operational awareness of IMO regulations, SOLAS requirements, and vessel-type conventions.",
        },
        {
          abbr: "ISM",
          name: "Safety Management",
          desc: "Recruitment process aligned with ISM Code principles, supporting safe management of ships.",
        },
      ],
    },
    global: {
      tag: "Global Maritime Partner",
      title: "One Manning Agency. Global Maritime Coverage.",
      text: "Ship Crew Agency is your single point of contact for maritime workforce solutions across worldwide shipping routes — from bulk carriers to specialist offshore operations.",
      feats: [
        {
          title: "Worldwide Deployment",
          text: "Crew deployed across all major international routes and ocean regions.",
        },
        {
          title: "All Vessel Types",
          text: "Bulk carriers, tankers, container ships, cruise vessels, offshore, and specialist craft.",
        },
        {
          title: "Rapid Response",
          text: "72-hour crew mobilization capability for urgent requirements and emergencies.",
        },
        {
          title: "Compliance Assured",
          text: "Every crew member verified against STCW, MLC, and flag-state requirements.",
        },
      ],
      mapTitle: "Serving Shipping Operations Across All Major Trade Routes",
      mapText:
        "Our seafarer network and deployment capabilities cover the world's primary maritime regions.",
      regions: [
        "Asia Pacific",
        "South Asia",
        "Middle East",
        "Europe",
        "Africa",
        "Americas",
        "Southeast Asia",
        "East Asia",
        "Oceania",
        "Indian Ocean",
      ],
    },
    faq: {
      tag: "FAQ",
      title: "Common Questions About Maritime Crew Manning",
      text: "Answers to the most important questions shipowners and fleet managers ask about our services.",
      items: [
        {
          q: "What is a ship crew manning agency?",
          a: "A ship crew manning agency is a specialist maritime recruitment company that sources, verifies, and deploys qualified seafarers to vessels on behalf of shipowners and ship management companies. Manning agencies like Ship Crew Agency handle the entire crewing process — from STCW certification verification to documentation, medical clearance, and deployment logistics.",
        },
        {
          q: "How quickly can Ship Crew Agency deploy qualified seafarers?",
          a: "Ship Crew Agency can mobilize pre-verified, compliance-ready seafarers within 72 hours for urgent requirements. Our pre-screened seafarer roster means candidates are already verified, documented, and medically cleared — significantly reducing deployment time for emergency crew situations.",
        },
        {
          q: "What does STCW mean and why does it matter?",
          a: "STCW stands for the International Convention on Standards of Training, Certification and Watchkeeping for Seafarers. It is the globally recognized framework setting minimum competency standards for all maritime officers and ratings. Ship Crew Agency verifies all STCW certificates for authenticity and validity before any seafarer is deployed — protecting your vessel from non-compliance risks.",
        },
        {
          q: "Which vessel types does Ship Crew Agency provide crew for?",
          a: "Ship Crew Agency supplies qualified seafarers for all major vessel types including bulk carriers, oil and chemical tankers, container ships, general cargo vessels, cruise and passenger ships, offshore support vessels, FPSOs, jack-up rigs, LNG and LPG carriers, RoRo vessels, and specialist maritime craft.",
        },
        {
          q: "Does Ship Crew Agency handle crew change logistics?",
          a: "Yes. Ship Crew Agency provides end-to-end crew change management including flight bookings, hotel accommodation, visa applications, port joining letters, pre-joining medicals, and all travel documentation. We coordinate directly with port agents and ship managers to ensure seamless, on-time crew transfers.",
        },
      ],
      cta: "View All FAQs",
    },
    knowledge: {
      tag: "Maritime Knowledge Hub",
      title: "Maritime Workforce Insights From Industry Specialists",
      text: "Practical guides, compliance resources, and expert knowledge for shipowners, fleet managers, and maritime HR teams.",
      featured: {
        tag: "Featured Guide",
        title: "How Ship Crew Manning Works: The Complete Guide",
        text: "Everything shipowners need to know about working with a professional crew manning agency — from inquiry to deployment and compliance management.",
      },
      cards: [
        {
          tag: "Compliance",
          title: "STCW Certification: What Every Shipowner Must Know",
          text: "A clear explanation of STCW requirements and why proper verification protects your vessel from port state control risk.",
        },
        {
          tag: "Operations",
          title:
            "Emergency Crew Replacement: Act Fast Without Compromising Compliance",
          text: "A practical guide for fleet managers facing sudden crew shortages — covering urgent mobilization under time pressure.",
        },
      ],
      cta: "View All Resources",
    },
    finalCta: {
      eyebrow: "Start Your Crew Inquiry Today",
      title:
        "Ready to Crew Your Vessel With Qualified, Compliant Seafarers?",
      sub: "Tell us your vessel type, rank requirements, and timeline. Our maritime staffing specialists will respond fast with qualified candidates and a clear plan of action.",
      ctaPrimary: "Request Qualified Crew Now",
      ctaSecondary: "Learn About Our Agency",
      contact: [
        { label: "Email Us", value: "info@shipcrewagency.com" },
        { label: "Response Time", value: "Within 24 Hours" },
        { label: "Emergency Line", value: "24/7 Available" },
        { label: "Website", value: "shipcrewagency.com" },
      ],
    },
  },

  about: {
    metaTitle: "About Ship Crew Agency — 17 Years of Maritime Manning",
    metaDescription:
      "Founded in 2007, Ship Crew Agency is a trusted global ship crew manning agency delivering STCW-certified seafarers to shipowners and vessel operators worldwide.",
    breadcrumb: "About Us",
    title: "About Ship Crew Agency",
    sub: "17 years of trusted global ship crew manning — building reliable maritime workforces for shipowners and vessel operators worldwide.",
    storyTag: "Our Story",
    storyTitle: "Founded on Maritime Expertise. Built on Trust.",
    storyParagraphs: [
      "Ship Crew Agency was established in 2007 by maritime industry professionals who understood the real challenges shipowners face when sourcing qualified, compliant crew. For 17 years, we have grown our global network, deepened our compliance expertise, and earned the trust of shipping companies worldwide.",
      "Today, we serve as the maritime workforce partner for shipowners, fleet managers, ship management companies, and offshore operators across every major shipping trade route — delivering qualified, STCW-certified seafarers with speed, accuracy, and full regulatory confidence.",
      "Our mission is simple: to eliminate crew staffing uncertainty so your vessels operate without interruption, your compliance is protected, and your operational costs stay predictable.",
    ],
    missionTitle: "Our Core Mission",
    missionText:
      "To be the world's most trusted ship crew manning agency — connecting qualified seafarers with shipowners who demand compliance, speed, and reliability.",
    missionList: [
      "17+ years of maritime recruitment experience",
      "Global seafarer network across all maritime labour markets",
      "STCW, MLC 2006, and ISM code compliance focus",
      "All vessel types and offshore operations covered",
      "72-hour emergency deployment capability",
      "24/7 maritime staffing support",
    ],
    journeyTag: "Our Journey",
    journeyTitle: "17 Years of Maritime Excellence",
    timeline: [
      {
        marker: "07",
        title: "2007 — Founded",
        text: "Ship Crew Agency established by maritime industry professionals with a vision to transform seafarer recruitment through compliance, speed, and expertise.",
      },
      {
        marker: "10",
        title: "2010 — Global Network Expansion",
        text: "International seafarer database expanded across Asia Pacific, South Asia, and European maritime labour markets.",
      },
      {
        marker: "13",
        title: "2013 — MLC 2006 Compliance Integration",
        text: "Full Maritime Labour Convention compliance processes integrated across all recruitment operations.",
      },
      {
        marker: "17",
        title: "2017 — Offshore Manning Launch",
        text: "Expanded services to offshore oil and gas sector, providing specialist crew for FPSOs, rigs, and offshore support vessels.",
      },
      {
        marker: "24",
        title: "2024 — Digital Platform & Global Reach",
        text: "Launched digital seafarer management systems and expanded reach to serve major shipping operations worldwide.",
      },
    ],
    valuesTag: "Our Values",
    valuesTitle: "The Principles That Drive Every Decision",
    values: [
      {
        title: "Compliance First",
        text: "Every seafarer placed must be fully compliant — no exceptions. We protect your vessels and your operations.",
      },
      {
        title: "Speed & Reliability",
        text: "We understand that time at port is expensive. Fast, dependable crew deployment is fundamental to our service.",
      },
      {
        title: "Transparency",
        text: "Open communication on crew status, documentation, and deployment — you always know exactly where things stand.",
      },
      {
        title: "Global Expertise",
        text: "Deep maritime knowledge across every vessel type, trade route, flag state, and crew nationality worldwide.",
      },
      {
        title: "Quality Assurance",
        text: "Rigorous verification processes ensure every crew member we supply meets your exact specifications and standards.",
      },
      {
        title: "Seafarer Welfare",
        text: "We care for the welfare of every seafarer we place — fair treatment, proper documentation, and full MLC compliance.",
      },
    ],
    ctaTitle: "Ready to Partner With Us?",
    ctaText:
      "Speak with our maritime staffing specialists today about your crew requirements.",
  },

  whyUs: {
    metaTitle: "Why Choose Ship Crew Agency — Maritime Manning Advantages",
    metaDescription:
      "Discover why shipowners choose Ship Crew Agency: 72-hour deployment, 100% STCW compliance, global seafarer network, and 24/7 maritime staffing support.",
    breadcrumb: "Why Choose Us",
    title: "Why Shipowners Choose Ship Crew Agency",
    sub: "We solve the maritime staffing problems that cost you time, money, and operational certainty — with speed, compliance, and expertise.",
    tag: "Our Advantages",
    sectionTitle: "The Reasons Global Clients Trust Us",
    stats: [
      { value: "17+", label: "Years Experience" },
      { value: "72hr", label: "Emergency Deployment" },
      { value: "100%", label: "STCW Compliance" },
    ],
    cards: [
      {
        title: "Rapid Crew Mobilization",
        text: "Pre-verified seafarers ready within 72 hours. Our maintained roster of compliance-cleared candidates means we never start from scratch when you need crew fast.",
      },
      {
        title: "Zero Compromise on Compliance",
        text: "STCW, MLC 2006, flag-state endorsements, medical fitness — every requirement verified before any seafarer is proposed to you. Your compliance is non-negotiable to us.",
      },
      {
        title: "Truly Global Network",
        text: "Access to qualified seafarers across all major maritime labour markets worldwide. Whatever flag state, vessel type, or trade route — we have the seafarers you need.",
      },
      {
        title: "Thorough Verification",
        text: "Background checks, reference confirmation, service record validation — we verify the full picture of every seafarer, not just their certificates.",
      },
      {
        title: "End-to-End Document Management",
        text: "We handle every document — STCW certificates, medical clearances, seaman's books, visas, joining letters — reducing your administrative burden to near zero.",
      },
      {
        title: "24/7 Maritime Support",
        text: "Maritime operations don't stop at 5pm. Our dedicated team is available around the clock for urgent crew requirements, emergency replacements, and ongoing support.",
      },
    ],
    ctaTitle: "Experience the Ship Crew Agency Difference",
    ctaText:
      "Submit your crew requirements and see how quickly we respond with qualified candidates.",
  },

  compliance: {
    metaTitle: "Compliance & Safety — STCW, MLC 2006, IMO, ISM | Ship Crew Agency",
    metaDescription:
      "Every seafarer is verified against STCW, MLC 2006, IMO, ISM and flag-state regulations. Multi-layer compliance verification protects your vessels at every stage.",
    breadcrumb: "Compliance & Safety",
    title: "Compliance & Safety Standards",
    sub: "Every seafarer we supply is fully verified against STCW, MLC 2006, IMO, ISM, and applicable flag-state regulations. Compliance is not optional — it is our foundation.",
    tag: "Our Standards",
    sectionTitle: "Maritime Regulatory Compliance — Without Exceptions",
    paragraphs: [
      "Ship Crew Agency operates with a compliance-first philosophy because we understand the consequences of non-compliant crew. Port state control detentions, flag state deficiencies, charter party disputes, and reputational damage are all risks that start with unverified crew.",
      "Our compliance team performs multi-layer verification on every seafarer before they are proposed to a client — ensuring your vessels are protected at every stage.",
    ],
    steps: [
      {
        title: "STCW Certificate Verification",
        text: "We confirm authenticity and currency of all mandatory STCW certificates directly with issuing maritime administrations.",
      },
      {
        title: "MLC 2006 Compliance Check",
        text: "Employment agreements, working hours, wages, and welfare standards verified against Maritime Labour Convention requirements.",
      },
      {
        title: "Medical Fitness Clearance",
        text: "ENG1 certificates and flag-state equivalent medical clearances confirmed through approved maritime medical examination centers.",
      },
      {
        title: "Flag State Endorsement Check",
        text: "Certificates of Competency endorsed for the specific vessel flag state requirements confirmed before crew joining.",
      },
      {
        title: "Background & Reference Verification",
        text: "Employment history, discharge book review, and direct reference checks with previous employers conducted for every candidate.",
      },
    ],
    certCards: [
      {
        abbr: "STCW 2010",
        name: "Manila Amendments",
        desc: "All seafarers verified against the 2010 Manila Amendments to STCW — the most current international standards for training and certification.",
      },
      {
        abbr: "MLC 2006",
        name: "Maritime Labour Convention",
        desc: "Full compliance with all MLC 2006 requirements covering employment agreements, wages, hours of work, accommodation, and seafarer welfare.",
      },
      {
        abbr: "SOLAS",
        name: "Safety of Life at Sea",
        desc: "Seafarers supplied with vessel-type specific safety training — SOLAS, MARPOL, ISM Code, and applicable vessel safety requirements confirmed.",
      },
    ],
    ctaTitle: "Crew You Can Trust. Compliance You Can Verify.",
    ctaText:
      "Every seafarer we supply comes with full documentation and compliance confirmation.",
    credentialsTag: "Verified Credentials",
    credentialsTitle: "Our Licence & Certification",
    credentialsText:
      "Ship Crew Agency operates under a valid government manning licence and is certified to the Maritime Labour Convention, 2006 — verifiable documentation you can trust.",
    credentialsItems: [
      "Govt. Manning Licence — MLA-0108",
      "Maritime Labour Convention (MLC 2006)",
    ],
  },

  process: {
    metaTitle: "Our Crew Recruitment Process | Ship Crew Agency",
    metaDescription:
      "A proven six-step maritime recruitment process — from requirement assessment to deployment — ensuring every seafarer is compliant, verified, and operationally ready.",
    breadcrumb: "Our Process",
    title: "Our Crew Recruitment Process",
    sub: "A proven six-step maritime recruitment process developed over 17 years — ensuring every seafarer we deploy is compliant, verified, and operationally ready.",
    tag: "Step by Step",
    sectionTitle: "How We Source, Verify & Deploy Your Crew",
    sectionText:
      "From your initial inquiry to the moment your crew joins the vessel — every step is managed by our maritime recruitment specialists.",
    steps: [
      {
        title: "Requirement Assessment",
        text: "We review your vessel type, flag state, trade route, crew matrix, rank requirements, and any specific certification or nationality preferences. This ensures we source candidates that exactly match your operational profile.",
      },
      {
        title: "Crew Sourcing",
        text: "Our recruitment team searches our pre-screened seafarer database and global network to identify qualified candidates matching your requirements. We access seafarers across all major maritime labour markets worldwide.",
      },
      {
        title: "Verification & Screening",
        text: "STCW certification validation, service record review, reference checks with previous employers, and comprehensive background verification are completed for every shortlisted candidate before presentation.",
      },
      {
        title: "Documentation Management",
        text: "All seafarer documentation — STCW certificates, COCs, flag-state endorsements, seaman's books, visas, and joining documentation — is prepared, verified for authenticity, and organized for port joining.",
      },
      {
        title: "Medical Clearance",
        text: "Medical fitness certification is confirmed through approved maritime medical examination centers before crew deployment. ENG1 certificates and flag-state equivalent medical clearances are verified for currency and validity.",
      },
      {
        title: "Deployment & Logistics",
        text: "Flight bookings, hotel arrangements, port joining letters, visa coordination, and direct liaison with port agents and ship managers are all handled by our team to ensure on-time, seamless crew joining at your nominated port.",
      },
    ],
    ctaTitle: "Start the Process Today",
    ctaText:
      "Submit your crew requirements and we'll begin sourcing compliant, qualified seafarers immediately.",
  },

  servicesIndex: {
    metaTitle: "Maritime Manning Services | Ship Crew Agency",
    metaDescription:
      "Complete maritime workforce solutions — crew manning, seafarer recruitment, crew replacement, crew change, offshore manning, and 24/7 emergency deployment.",
    breadcrumb: "Services",
    title: "Maritime Workforce Solutions",
    sub: "End-to-end maritime staffing for the global shipping industry — from single crew placements to complete vessel manning.",
  },

  categoriesIndex: {
    metaTitle: "Crew Categories — Deck, Engine, Hospitality, Offshore | Ship Crew Agency",
    metaDescription:
      "Qualified, certified seafarers across every department — deck crew, engine crew, hospitality crew, and specialist offshore personnel for all vessel types.",
    breadcrumb: "Crew Categories",
    title: "Every Department. Every Vessel Type.",
    sub: "Qualified, certified seafarers across all major vessel departments — bridge to engine room to hospitality and offshore operations.",
  },

  services: {
    "crew-manning": {
      metaTitle: "Global Crew Manning Agency Services | Ship Crew Agency",
      metaDescription:
        "Complete vessel manning solutions for shipowners and ship management companies. STCW-certified seafarers for all vessel types, worldwide.",
      breadcrumb: "Crew Manning Agency",
      title: "Global Crew Manning Agency Services",
      sub: "Complete vessel manning solutions for shipowners, fleet managers, and ship management companies. STCW-certified seafarers for all vessel types, worldwide.",
      introTag: "Crew Manning",
      introTitle: "Full-Service Vessel Manning for Global Shipping Operations",
      introParagraphs: [
        "Ship Crew Agency provides end-to-end crew manning services for shipowners operating vessels on international routes. Whether you require crew for a single vessel or a managed fleet, we deliver the right personnel with the right credentials, on time, every time.",
        "Our crew manning service covers the complete staffing lifecycle — from initial requirement assessment through crew sourcing, verification, documentation, medical clearance, and deployment logistics — managed by our specialist maritime recruitment team with 17 years of operational experience.",
      ],
      introCta: "Request Manning Quote",
      listTitle: "Vessel Types We Staff",
      listItems: [
        "Bulk Carriers (Handysize to Capesize)",
        "Oil Tankers (VLCC, Suezmax, Aframax)",
        "Chemical & Product Tankers",
        "Container Ships & Feeder Vessels",
        "LNG & LPG Carriers",
        "RoRo Vessels & Car Carriers",
        "Cruise & Passenger Vessels",
        "General Cargo & Multi-Purpose",
      ],
      provideTag: "What We Provide",
      provideTitle: "Comprehensive Manning Services",
      provideCards: [
        {
          title: "Full Fleet Manning",
          text: "Complete crew matrix management for entire fleets — deck, engine, and support crew for all vessels in your fleet, managed under one agreement.",
        },
        {
          title: "Crew Rotation Planning",
          text: "Scheduled crew rotation management to ensure continuous, uninterrupted vessel operations with planned handovers and advance crew preparation.",
        },
        {
          title: "Compliance Management",
          text: "Ongoing STCW certificate tracking, renewal reminders, and flag-state endorsement management to keep your crew compliant at all times.",
        },
      ],
      ctaTitle: "Ready to Discuss Your Manning Requirements?",
      ctaText:
        "Our maritime staffing specialists are ready to assess your vessel needs and propose qualified crew.",
      ctaPrimary: "Request Crew Manning Quote",
    },
    "seafarer-recruitment": {
      metaTitle: "Seafarer Recruitment Agency | Ship Crew Agency",
      metaDescription:
        "Precision maritime recruitment for qualified, STCW-certified seafarers worldwide. Every candidate verified, medically cleared, and deployment-ready.",
      breadcrumb: "Seafarer Recruitment",
      title: "Seafarer Recruitment Agency",
      sub: "Precision maritime recruitment for qualified, STCW-certified seafarers worldwide. Every candidate verified, medically cleared, and deployment-ready.",
      introTag: "Recruitment",
      introTitle: "Finding the Right Seafarer for Every Role",
      introParagraphs: [
        "Ship Crew Agency's seafarer recruitment service is built on one principle — quality over quantity. We don't just fill positions. We find the right person for each specific role on your vessel, with the correct certifications, relevant experience, and verified background.",
        "Our international seafarer database spans all major maritime labour markets. Every candidate in our roster has been pre-screened, with STCW certificates verified, medical clearances confirmed, and service records reviewed before we ever present them to you.",
      ],
      introCta: "Submit Recruitment Requirement",
      listTitle: "Ranks We Recruit",
      listItems: [
        "Master, Chief Officer, 2nd/3rd Officer",
        "Chief Engineer, 2nd/3rd/4th Engineer",
        "Electrical Officer (ETO)",
        "Bosun, Able Seamen, Ordinary Seamen",
        "Fitter, Oiler, Motorman, Wiper",
        "Cook, Chief Cook, Messman, Steward",
        "DP Officers, Offshore Specialists",
      ],
      ctaTitle: "Submit Your Seafarer Recruitment Requirements",
      ctaText:
        "Tell us the rank, vessel type, certification requirements, and joining date — we'll find your candidate.",
      ctaPrimary: "Submit Requirement",
    },
    "crew-replacement": {
      metaTitle: "Crew Replacement Services — Within 72 Hours | Ship Crew Agency",
      metaDescription:
        "Fast, compliant crew replacement for planned and emergency crew changes. Minimizing vessel downtime and protecting your operations at every port.",
      breadcrumb: "Crew Replacement",
      title: "Crew Replacement Services",
      sub: "Fast, compliant crew replacement for planned and emergency crew changes. Minimizing vessel downtime and protecting your operations at every port.",
      introTag: "Crew Replacement",
      introTitle: "Rapid Crew Replacement — Worldwide, Within 72 Hours",
      introParagraphs: [
        "When a crew member needs to be replaced — whether planned or at short notice — Ship Crew Agency mobilizes qualified, compliance-ready replacements to your vessel at any port worldwide.",
        "Our pre-verified seafarer roster means we can identify and propose replacement candidates within hours of receiving your requirement. Documentation, travel, visas, and port joining logistics are handled by our operations team — keeping your replacement timeline as short as possible.",
      ],
      introCta: "Request Emergency Replacement",
      listTitle: "Replacement Scenarios We Cover",
      listItems: [
        "Medical emergency repatriation",
        "Contract completion and planned rotation",
        "Crew misconduct or performance issues",
        "Certification expiry replacements",
        "Last-minute no-shows before joining",
        "Port state control–required replacements",
      ],
      ctaTitle: "Need a Crew Replacement Now?",
      ctaText:
        "Contact us immediately — our emergency response team is available 24/7.",
      ctaPrimary: "Emergency Replacement Request",
    },
    "crew-change": {
      metaTitle: "Crew Change Services — Logistics & Coordination | Ship Crew Agency",
      metaDescription:
        "Seamless crew rotation and crew change management. We coordinate all logistics, documentation, and travel for on-time crew changes at your nominated ports.",
      breadcrumb: "Crew Change Services",
      title: "Crew Change Services",
      sub: "Seamless crew rotation and crew change management. We coordinate all logistics, documentation, and travel for on-time crew changes at your nominated ports.",
      introTag: "Crew Change",
      introTitle: "End-to-End Crew Change Management",
      introParagraphs: [
        "Crew change operations involve complex coordination across multiple parties — port agents, airlines, visa authorities, and medical examination centers. Ship Crew Agency manages all of this so you don't have to.",
        "From the moment a crew change is scheduled, our operations team takes ownership of every logistical element — ensuring incoming crew are compliant, documented, medically cleared, and at the right port at the right time.",
      ],
      introCta: "Plan Crew Change",
      listTitle: "Our Crew Change Logistics Cover",
      listItems: [
        "Flight booking and travel coordination",
        "Hotel accommodation arrangements",
        "Visa applications and processing",
        "Pre-joining medical examinations",
        "Port joining letters and approvals",
        "Port agent liaison and coordination",
        "On-signer / off-signer handover management",
      ],
      ctaTitle: "Plan Your Next Crew Change With Us",
      ctaText:
        "Submit your crew change schedule and let us manage the logistics from start to finish.",
      ctaPrimary: "Plan Crew Change",
    },
    "offshore-manning": {
      metaTitle: "Offshore Crew Manning Services | Ship Crew Agency",
      metaDescription:
        "Specialist offshore crew recruitment for oil rigs, FPSOs, offshore support vessels, and offshore wind installations. Certified, safety-compliant personnel.",
      breadcrumb: "Offshore Crew Manning",
      title: "Offshore Crew Manning Services",
      sub: "Specialist offshore crew recruitment for oil rigs, FPSOs, offshore support vessels, and offshore wind installations. Certified personnel, safety-compliant, deployment-ready.",
      introTag: "Offshore Manning",
      introTitle: "Offshore Personnel With the Right Safety Credentials",
      introParagraphs: [
        "Offshore environments demand a higher standard of safety awareness, technical competency, and emergency preparedness than conventional vessels. Ship Crew Agency's offshore manning team specialises in sourcing personnel who meet these elevated requirements.",
        "Every offshore candidate is verified for HUET, BOSIET, offshore medical, and applicable specialist certifications before being proposed for any offshore assignment.",
      ],
      introCta: "Request Offshore Crew",
      listTitle: "Offshore Installations We Staff",
      listItems: [
        "Floating Production Storage & Offloading (FPSO)",
        "Jack-Up Drilling Rigs",
        "Semi-Submersible Rigs",
        "Anchor Handling Tug Supply (AHTS)",
        "Platform Supply Vessels (PSV)",
        "Offshore Wind Installation Vessels",
        "Dive Support Vessels (DSV)",
      ],
      ctaTitle: "Offshore Crew Requirements?",
      ctaText:
        "Our offshore manning specialists are ready to source the right personnel for your installation.",
      ctaPrimary: "Request Offshore Crew",
    },
    "emergency-crew": {
      metaTitle: "Emergency Crew Deployment — 24/7 | Ship Crew Agency",
      metaDescription:
        "24/7 emergency crew mobilization for critical maritime situations. When every hour counts, Ship Crew Agency mobilizes qualified, compliant crew fast.",
      breadcrumb: "Emergency Deployment",
      title: "Emergency Crew Deployment",
      sub: "24/7 emergency crew mobilization for critical maritime situations. When every hour counts, Ship Crew Agency responds fast.",
      introTag: "Emergency Response",
      introTitle: "When You Need Crew Fast — We Deliver",
      introParagraphs: [
        "Maritime emergencies don't follow business hours. Our emergency response team is operational around the clock — ready to mobilize qualified, compliant crew to your vessel at any port worldwide within the shortest possible timeframe.",
      ],
      introCta: "Emergency Contact — 24/7",
      highlightTitle: "24/7 Emergency Maritime Staffing",
      highlightText:
        "Maritime emergencies don't follow business hours. Our emergency response team is operational around the clock — ready to mobilize qualified, compliant crew to your vessel at any port worldwide within the shortest possible timeframe.",
      listTitle: "Emergency Response Capabilities",
      listItems: [
        "Immediate response, day or night",
        "Pre-verified, compliance-ready roster",
        "Fast, fully verified documentation",
        "Worldwide port joining coordination",
      ],
      provideTag: "Emergency Response",
      provideTitle: "When You Need Crew Fast — We Deliver",
      provideCards: [
        {
          title: "Immediate Response",
          text: "Contact us any time of day or night. Our emergency line is staffed 24/7 by maritime staffing professionals ready to act on your requirement immediately.",
        },
        {
          title: "Pre-Verified Roster",
          text: "Our maintained roster of pre-screened, compliance-ready seafarers means we don't start from scratch. Candidates already cleared and ready to mobilize.",
        },
        {
          title: "Fast Documentation",
          text: "Even under time pressure, every crew member we deploy carries full, verified documentation. Emergency speed never compromises compliance.",
        },
      ],
      ctaTitle: "Emergency? Contact Us Now.",
      ctaText:
        "Our 24/7 emergency line connects you directly to our maritime staffing team.",
      ctaPrimary: "Emergency Contact — 24/7",
    },
  },

  categories: {
    "deck-crew": {
      metaTitle: "Deck Crew Recruitment & Manning | Ship Crew Agency",
      metaDescription:
        "Qualified Master Mariners, Deck Officers, and Ratings — STCW-certified and flag-state endorsed for all vessel types and international routes.",
      breadcrumb: "Deck Crew",
      title: "Deck Crew Recruitment & Manning",
      sub: "Qualified Master Mariners, Deck Officers, and Ratings — STCW-certified and flag-state endorsed for all vessel types and international routes.",
      introTag: "Deck Department",
      introTitle: "Experienced Deck Officers for Every Vessel Type",
      introText:
        "Ship Crew Agency maintains an active roster of qualified deck officers and ratings across all ranks. Every candidate is verified for STCW certification, COC validity, flag-state endorsements, and relevant vessel-type experience before being proposed to clients.",
      roles: [
        {
          title: "Master / Captain",
          text: "STCW II/2 certified Masters with broad vessel-type experience and strong PSC awareness.",
        },
        {
          title: "Chief Officer",
          text: "Cargo planning, stability management, STCW II/2. Experienced in cargo, tanker, and passenger operations.",
        },
        {
          title: "2nd & 3rd Officer",
          text: "Watchkeeping officers with GMDSS, medical first aid, and vessel-type specific training.",
        },
        {
          title: "Bosun & Ratings",
          text: "Experienced Bosuns, AB seamen, OS, and Deck Cadets across all vessel categories.",
        },
      ],
      ctaTitle: "Require Deck Crew?",
      ctaText:
        "Submit your rank requirements and joining schedule — we'll propose qualified candidates quickly.",
      ctaPrimary: "Request Deck Crew",
    },
    "engine-crew": {
      metaTitle: "Engine Crew Recruitment & Manning | Ship Crew Agency",
      metaDescription:
        "Qualified marine engineers, ETOs, and engine ratings — STCW III certified for all propulsion systems, vessel types, and international operations.",
      breadcrumb: "Engine Crew",
      title: "Engine Crew Recruitment & Manning",
      sub: "Qualified marine engineers, ETOs, and engine ratings — STCW III certified for all propulsion systems, vessel types, and international operations.",
      introTag: "Engine Department",
      introTitle: "Certified Marine Engineers for All Propulsion Systems",
      introText:
        "Our engine crew roster covers all engineering ranks from Chief Engineer to engine ratings across diesel, steam, gas turbine, and dual-fuel propulsion systems.",
      roles: [
        {
          title: "Chief Engineer",
          text: "STCW III/2 certified CEs with experience across tankers, bulk, container, and LNG systems.",
        },
        {
          title: "2nd/3rd Engineer",
          text: "Watchkeeping engineers with relevant vessel-type endorsements and propulsion system experience.",
        },
        {
          title: "ETO / Electrician",
          text: "Electrical and technical officers for modern vessels with ECDIS, automation, and advanced electrical systems.",
        },
        {
          title: "Engine Ratings",
          text: "Fitters, Oilers, Motormen, Wipers, and Engine Cadets across all vessel types and trading areas.",
        },
      ],
      ctaTitle: "Require Engine Crew?",
      ctaText:
        "Tell us your propulsion system and engineering rank requirements — we'll find the right engineers.",
      ctaPrimary: "Request Engine Crew",
    },
    "hospitality-crew": {
      metaTitle: "Hospitality & Catering Crew | Ship Crew Agency",
      metaDescription:
        "Professional hospitality, catering, and hotel department crew for cargo vessels, cruise ships, and passenger ferries — certified, experienced, and MLC compliant.",
      breadcrumb: "Hospitality Crew",
      title: "Hospitality & Catering Crew",
      sub: "Professional hospitality, catering, and hotel department crew for cargo vessels, cruise ships, and passenger ferries — certified, experienced, and MLC compliant.",
      introTag: "Hospitality Department",
      introTitle: "Professional Catering & Hotel Crew for Maritime Operations",
      introText:
        "From Chief Cooks on bulk carriers to full hotel department crews on cruise ships — Ship Crew Agency provides experienced hospitality and catering personnel with relevant maritime food safety certifications.",
      roles: [
        {
          title: "Chief Cook",
          text: "Certified Chief Cooks with maritime food safety, HACCP awareness, and experience catering for international crew.",
        },
        {
          title: "Chief Steward / Purser",
          text: "Hotel management professionals with cruise and passenger vessel experience and strong administrative skills.",
        },
        {
          title: "Messman / Steward",
          text: "Experienced messmen and stewards for cargo vessels, tankers, and passenger operations worldwide.",
        },
        {
          title: "Cruise Hotel Crew",
          text: "Full hotel department crew for cruise operations — housekeeping, F&B, entertainment, and guest services.",
        },
      ],
      ctaTitle: "Require Hospitality Crew?",
      ctaText:
        "Submit your catering and hospitality crew requirements and we'll propose certified candidates.",
      ctaPrimary: "Request Hospitality Crew",
    },
    "offshore-crew": {
      metaTitle: "Offshore Crew Recruitment | Ship Crew Agency",
      metaDescription:
        "Specialist offshore personnel — OIMs, DP Officers, ROV Pilots, Subsea Engineers — certified for oil & gas and offshore wind operations.",
      breadcrumb: "Offshore Crew",
      title: "Offshore Crew Recruitment",
      sub: "Specialist offshore personnel — OIMs, DP Officers, ROV Pilots, Subsea Engineers, and offshore support roles — certified for oil & gas and offshore wind operations.",
      introTag: "Offshore Personnel",
      introTitle: "Offshore Specialists for Oil, Gas & Renewable Energy",
      introText:
        "Offshore operations require personnel with elevated safety standards, specialist technical skills, and specific offshore certifications. Our offshore crew roster covers all key operational roles across oil & gas platforms, FPSOs, and offshore wind installations.",
      roles: [
        {
          title: "OIM / Installation Manager",
          text: "Certified Offshore Installation Managers for FPSO and platform operations with full safety management experience.",
        },
        {
          title: "DP Officer",
          text: "NI DP certified Dynamic Positioning Officers for AHTS, PSV, cable lay, and offshore construction vessels.",
        },
        {
          title: "ROV Pilot / Subsea Engineer",
          text: "Experienced ROV pilots and subsea engineers for inspection, maintenance, and construction operations.",
        },
        {
          title: "Offshore Medic & Safety",
          text: "BOSIET/HUET certified offshore medics, safety officers, and emergency response personnel.",
        },
      ],
      ctaTitle: "Require Offshore Personnel?",
      ctaText:
        "Submit your offshore crew requirements and our specialists will respond promptly.",
      ctaPrimary: "Request Offshore Crew",
    },
  },

  blog: {
    metaTitle: "Maritime Knowledge Hub — Crew Manning Insights | Ship Crew Agency",
    metaDescription:
      "Expert guides, compliance resources, and maritime workforce insights for shipowners, fleet managers, and marine HR professionals.",
    breadcrumb: "Maritime Knowledge Hub",
    title: "Maritime Knowledge Hub",
    sub: "Expert guides, compliance resources, and maritime workforce insights for shipowners, fleet managers, and marine HR professionals.",
    empty: "New maritime insights are being published soon. Check back shortly.",
    featured: "Featured",
    latest: "Latest Articles",
    relatedTitle: "Related Articles",
    backLabel: "Back to Knowledge Hub",
    tableOfContents: "In This Article",
    sharePost: "Share",
    writtenBy: "Written by",
  },

  faq: {
    metaTitle: "Frequently Asked Questions | Ship Crew Agency",
    metaDescription:
      "Comprehensive answers to maritime crew manning questions from shipowners, fleet managers, and ship management companies worldwide.",
    breadcrumb: "FAQ",
    title: "Frequently Asked Questions",
    sub: "Comprehensive answers to maritime crew manning questions from shipowners, fleet managers, and ship management companies worldwide.",
    items: [
      {
        q: "What is a ship crew manning agency?",
        a: "A ship crew manning agency is a specialist maritime recruitment company that sources, verifies, and deploys qualified seafarers to vessels on behalf of shipowners, ship management companies, and vessel operators. Manning agencies handle the entire crewing process — from crew sourcing and STCW certification verification to documentation, medical clearance, and deployment logistics.",
      },
      {
        q: "How quickly can Ship Crew Agency deploy qualified seafarers?",
        a: "Ship Crew Agency can mobilize pre-verified, compliance-ready seafarers within 72 hours for urgent requirements. Our pre-screened seafarer roster means candidates are already verified, documented, and medically cleared. For planned crew rotations, we typically deliver crew well within required schedules.",
      },
      {
        q: "What does STCW mean and why does it matter for crew recruitment?",
        a: "STCW stands for the International Convention on Standards of Training, Certification and Watchkeeping for Seafarers. It is the globally recognized framework setting minimum competency standards for all maritime officers and ratings. Every qualified seafarer working on internationally trading vessels must hold valid STCW certifications. Ship Crew Agency verifies all STCW certificates for authenticity and validity before any seafarer is deployed.",
      },
      {
        q: "What is MLC 2006 and does it affect crew manning?",
        a: "The Maritime Labour Convention 2006 (MLC 2006) is an international treaty setting minimum standards for seafarer working conditions — including employment agreements, wage standards, working hours, accommodation, and welfare. Ship Crew Agency ensures all seafarers placed under our services have compliant employment agreements and that vessel operators understand their MLC obligations.",
      },
      {
        q: "Which vessel types does Ship Crew Agency provide crew for?",
        a: "Ship Crew Agency supplies qualified seafarers for all major vessel types including bulk carriers, oil and chemical tankers, container ships, general cargo vessels, cruise and passenger ships, offshore support vessels, FPSOs, jack-up rigs, LNG and LPG carriers, RoRo vessels, and specialist maritime craft.",
      },
      {
        q: "How does Ship Crew Agency verify seafarer credentials?",
        a: "Our verification process covers every critical aspect of seafarer compliance. We confirm STCW certificate validity with issuing maritime administrations, review and authenticate service records, conduct reference checks with previous employers, verify medical fitness certificates with approved maritime medical examiners, and confirm flag-state endorsements are current and appropriate for the vessel's registry.",
      },
      {
        q: "Does Ship Crew Agency handle crew change logistics?",
        a: "Yes. Ship Crew Agency provides end-to-end crew change management including flight bookings, hotel accommodation, visa applications, port joining letters, pre-joining medicals, and all travel documentation. We coordinate directly with port agents and ship managers to ensure seamless crew transfers with minimal vessel time in port.",
      },
      {
        q: "Do you provide offshore crew in addition to commercial shipping crew?",
        a: "Yes. Ship Crew Agency provides specialist offshore crew for oil and gas platforms, FPSOs, jack-up rigs, semi-submersibles, PSVs, AHTS vessels, offshore wind installations, and dive support vessels. All offshore candidates are verified for BOSIET, HUET, offshore medical, and applicable specialist certifications.",
      },
      {
        q: "What nationalities of seafarers does Ship Crew Agency supply?",
        a: "Ship Crew Agency maintains an international network spanning all major maritime labour markets worldwide. We do not restrict to specific nationalities — our focus is on matching the right qualified seafarer to each vessel requirement based on certifications, experience, vessel type suitability, and flag-state requirements.",
      },
    ],
    ctaTitle: "Still Have Questions?",
    ctaText:
      "Our maritime staffing specialists are ready to answer your specific crew requirement questions.",
  },

  contact: {
    metaTitle: "Contact Ship Crew Agency — Request Qualified Crew",
    metaDescription:
      "Submit your crew requirements or speak with our maritime staffing specialists. We respond within 24 hours — emergency requirements within hours.",
    breadcrumb: "Contact Us",
    title: "Contact Ship Crew Agency",
    sub: "Submit your crew requirements or speak directly with our maritime staffing specialists. We respond to all inquiries within 24 hours — emergency requirements within hours.",
    formTag: "Crew Inquiry Form",
    formTitle: "Submit Your Crew Requirement",
    formText:
      "Fill in your vessel and crew details. Our maritime staffing team will review and respond promptly with qualified candidates.",
    fields: {
      name: "Your Name *",
      namePlaceholder: "Full name",
      company: "Company Name *",
      companyPlaceholder: "Ship management / Operator name",
      email: "Email Address *",
      emailPlaceholder: "your@email.com",
      phone: "Phone / WhatsApp",
      phonePlaceholder: "+1 234 567 8900",
      vesselType: "Vessel Type",
      vesselTypeDefault: "Select vessel type",
      vesselTypes: [
        "Bulk Carrier",
        "Oil Tanker",
        "Chemical Tanker",
        "Container Ship",
        "LNG / LPG Carrier",
        "General Cargo",
        "RoRo Vessel",
        "Cruise / Passenger",
        "Offshore Support Vessel",
        "FPSO",
        "Drilling Rig",
        "Other",
      ],
      serviceType: "Crew Requirement Type",
      serviceTypeDefault: "Select service type",
      serviceTypes: [
        "Full Crew Manning",
        "Seafarer Recruitment",
        "Crew Replacement",
        "Crew Change Services",
        "Offshore Manning",
        "Emergency Deployment",
      ],
      ranks: "Rank(s) Required",
      ranksPlaceholder: "e.g. Master, Chief Engineer, 2nd Officer...",
      message: "Message / Additional Requirements",
      messagePlaceholder:
        "Tell us about your vessel, flag state, joining port, timeline, and any specific requirements...",
      submit: "Submit Crew Requirement",
      submitting: "Submitting...",
      disclaimer:
        "We respond to all inquiries within 24 hours. Emergency requirements please call our 24/7 line.",
      successTitle: "Requirement Received",
      successText:
        "Thank you. Our maritime staffing team has received your crew requirement and will respond within 24 hours.",
      errorText:
        "Something went wrong submitting your requirement. Please try again or email us directly.",
    },
    infoTitle: "Get In Touch",
    infoText:
      "Our maritime staffing specialists are ready to assist with your crew requirements.",
    infoItems: [
      { label: "Email", value: "crewing.cssl@gmail.com / info@shipcrewagency.com" },
      { label: "Phone", value: "+880 1626 366030 / +880 1673 441245" },
      { label: "Office", value: "Kazi Plaza (2nd Floor), 517/A, S.K Mujib Road, Chattogram 4100, Bangladesh" },
      { label: "Govt. Manning Licence No.", value: "MLA-0108, MLC 2006" },
    ],
    emergencyTitle: "Emergency Crew Requirement?",
    emergencyText:
      "For urgent crew replacements and 24/7 emergency requirements, contact our specialists directly. Our response team is operational around the clock.",
    emergencyCta: "Call Our Specialists Now",
    mapTitle: "Find Us on the Map",
    qr: {
      tag: "Quick Connect",
      title: "Scan to Connect Instantly",
      text: "Scan a code with your phone to message our crewing specialists directly.",
      items: ["WhatsApp", "WeChat", "DingTalk"],
    },
  },

  team: {
    metaTitle: "Our Leadership Team — Ship Crew Agency",
    metaDescription:
      "Meet the leadership team behind Ship Crew Agency — experienced maritime professionals guiding our global ship crew manning and seafarer recruitment services.",
    breadcrumb: "Our Team",
    title: "Meet Our Leadership Team",
    sub: "The experienced maritime professionals who lead Ship Crew Agency and stand behind every seafarer we deploy worldwide.",
    tag: "Our People",
    sectionTitle: "Leadership & Management",
    sectionText:
      "Decades of combined maritime, manning and management expertise — committed to compliant, reliable crewing for every vessel and every voyage.",
    roles: [
      "Chairman",
      "Managing Director",
      "Director & Management Representative",
      "Manager, Operations",
      "Accountant",
    ],
    ctaTitle: "Work With a Team That Knows the Sea",
    ctaText:
      "Share your crew requirement and our specialists will respond quickly with qualified, fully compliant seafarers.",
  },

  newsletter: {
    badge: "Newsletter",
    titleLead: "Stay Connected for",
    titleEmphasis: "Maritime Updates",
    sub: "Get news on new services, crew availability and compliance updates delivered to your inbox first — no spam, ever.",
    placeholder: "you@example.com",
    cta: "Subscribe",
    submitting: "Subscribing…",
    success: "You're subscribed — welcome aboard!",
    error: "Something went wrong. Please try again.",
    pills: ["Industry Insights", "Crew Updates", "Compliance News"],
    fine: "By subscribing you agree to our Privacy Policy.",
  },

  notFound: {
    title: "Page Not Found",
    text: "The page you are looking for has set sail. Let us guide you back to port.",
    cta: "Return Home",
  },
};
