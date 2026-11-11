import type { Field, GlobalConfig } from 'payload'

type DefaultNode = {
  nodeId: string
  name: string
  aspectRatio: '16 / 9' | '4 / 3' | '1 / 1' | '3 / 4' | '9 / 16'
  placeholderArt: 'shards' | 'towers' | 'form' | 'facade'
  gridColumn: number
  gridSpan: number
  gridRow: number
  summary?: string
  storyText?: string
  metadataText?: string
}

function createCategoryNodeArray(
  name: string,
  label: string,
  description: string,
  defaults: DefaultNode[],
): Field {
  return {
    name,
    type: 'array',
    label,
    defaultValue: defaults,
    admin: {
      description,
      initCollapsed: false,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'name',
            type: 'text',
            label: 'Node Title',
            required: true,
            admin: { width: '42%' },
          },
          {
            name: 'nodeId',
            type: 'text',
            label: 'Node ID',
            required: true,
            admin: { width: '22%' },
          },
          {
            name: 'aspectRatio',
            type: 'select',
            label: 'Aspect Ratio',
            defaultValue: '16 / 9',
            enumName: 'enum_atlas_node_ar',
            options: [
              { label: '16:9 Wide',     value: '16 / 9' },
              { label: '4:3 Standard',  value: '4 / 3' },
              { label: '1:1 Square',    value: '1 / 1' },
              { label: '3:4 Portrait',  value: '3 / 4' },
              { label: '9:16 Vertical', value: '9 / 16' },
            ],
            admin: { width: '18%' },
          },
          {
            name: 'placeholderArt',
            type: 'select',
            label: 'Fallback Shape',
            defaultValue: 'shards',
            enumName: 'enum_atlas_node_art',
            options: [
              { label: 'Shards', value: 'shards' },
              { label: 'Towers', value: 'towers' },
              { label: 'Form',   value: 'form' },
              { label: 'Facade', value: 'facade' },
            ],
            admin: { width: '18%' },
          },
        ],
      },
      {
        type: 'row',
        fields: [
          {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            label: 'Node Image / Media (replaces placeholder SVG in node circle, hover preview & detail panel)',
            admin: { width: '60%' },
          },
          {
            name: 'mediaCaption',
            type: 'text',
            label: 'Media Caption (Detail Panel)',
            admin: {
              width: '40%',
              description: 'Optional caption below media in the slide-over Detail Panel.',
            },
          },
        ],
      },
      {
        name: 'summary',
        type: 'textarea',
        label: 'Hover Preview & Top Summary',
        admin: {
          rows: 2,
          description: 'Concise summary displayed on canvas hover and at the top of the slide-over Detail Panel.',
        },
      },
      {
        name: 'storyText',
        type: 'textarea',
        label: 'Detail Panel Story Paragraphs (separate paragraphs with a blank line)',
        admin: {
          rows: 5,
          description: 'Full narrative paragraphs shown when a visitor clicks this node to open the Detail Panel.',
        },
      },
      {
        name: 'metadataText',
        type: 'textarea',
        label: 'Metadata Table Rows (one "Label: Value" per line; use " | " for multiple lines)',
        admin: {
          rows: 5,
          description: 'Format: "Label: Value 1 | Value 2". Supports links via [Link Text](https://...).',
        },
      },
      {
        type: 'collapsible',
        label: '12x12 Grid Coordinates (Advanced)',
        admin: { initCollapsed: true },
        fields: [
          {
            type: 'row',
            fields: [
              { name: 'gridColumn', type: 'number', label: 'Column (1-12)', defaultValue: 2, admin: { width: '33%' } },
              { name: 'gridSpan',   type: 'number', label: 'Span (1-4)',    defaultValue: 1, admin: { width: '33%' } },
              { name: 'gridRow',    type: 'number', label: 'Row (1-12)',    defaultValue: 7, admin: { width: '34%' } },
            ],
          },
        ],
      },
    ],
  }
}

export const PRACTICE_DEFAULTS: DefaultNode[] = [
  {
    nodeId: 'foundations',
    name: 'Foundations',
    aspectRatio: '4 / 3',
    placeholderArt: 'shards',
    gridColumn: 2,
    gridSpan: 1,
    gridRow: 7,
    summary: 'Built my foundation through tangible product design, healthcare R&D, industrial design, visualization, and early UX work before moving deeper into connected products and digital systems.',
    storyText: '',
    metadataText: [
      'Category: Practice',
      'Descriptor: Industrial Design - Product Design - R&D',
      'Capability: Industrial Design - Product Design - UX - Visualization - R&D',
      'Includes: This chapter groups the earlier professional experiences: | Skanray | ADES / Advandes | Desmania | Earlier engineering / R&D work',
    ].join('\n'),
  },
  {
    nodeId: 'zf-group',
    name: 'ZF Group',
    aspectRatio: '16 / 9',
    placeholderArt: 'towers',
    gridColumn: 5,
    gridSpan: 1,
    gridRow: 7,
    summary: 'Evolved across industrial design, automotive HMI and enterprise UX, working on physical products, autonomous-vehicle interfaces, SAP applications, data visualization, and design-system guidelines.',
    storyText: '',
    metadataText: [
      'Category: Practice',
      'Descriptor: UX Specialist - Global UX Team | Previously Senior Industrial Designer',
      'Capability: Industrial Design - HMI - UX - Data Visualization - Design Systems',
      'Known work: Industrial design | Automotive HMI | SAE Level 3/4 autonomous-vehicle demonstrators | EV interface concepts | Product styling, CMF and prototyping | SAP / Fiori applications | Enterprise UX | Data visualization guidelines | Icon and interface guidelines | Internal products and platforms | Branding | Design-system work',
      'Career phases: Senior Industrial Designer, approximately 2019-2021 | UX Specialist, IT Innovation / Global UX Team, approximately 2021-2022',
    ].join('\n'),
  },
  {
    nodeId: 'tvs-motor',
    name: 'TVS Motor',
    aspectRatio: '1 / 1',
    placeholderArt: 'form',
    gridColumn: 8,
    gridSpan: 1,
    gridRow: 7,
    summary: 'Led EV and connected-mobility experience design across TVS X, TVS Connect and TALES, while managing a 16-person extended design team, planning priorities, shaping briefs, and pitching features to senior stakeholders.',
    storyText: [
      'At TVS, I led UX for electric and connected mobility across the vehicle, app, and supporting digital ecosystem. My role went beyond interface design into team management, prioritization, briefs, feature definition, stakeholder pitching, and delivery planning.',
      'I managed an extended team of around 16 consultancy designers, along with interns, while also shaping major initiatives including the TVS X HMI, TVS Connect, and TALES, the design system created to bring consistency across connected experiences.',
      'The work also led into broader innovation areas including sonic branding, research and validation, and multiple patented interaction concepts.',
    ].join('\n\n'),
    metadataText: [
      'Category: Practice',
      'Descriptor: UX Manager - Electric Vehicle',
      'Capability: Product Design - Industrial Design - HMI - UX - Design Systems - Connected Mobility',
      'Supporting work: TVS X HMI | TALES Design System | TVS Connect | 560+ HMI screens | Connected mobility ecosystem | Sonic branding | Research and usability validation | SUS / CSAT / NPS | Four published international patents',
      'Cross-references: iF Design Award | Four published international patents',
    ].join('\n'),
  },
  {
    nodeId: 'bounteous',
    name: 'Bounteous',
    aspectRatio: '3 / 4',
    placeholderArt: 'facade',
    gridColumn: 11,
    gridSpan: 1,
    gridRow: 7,
    summary: 'Leading enterprise UX strategy for Verizon Business across upgrades, shopping, AI-assisted tools and digital transformation, while driving prioritization, implementation planning, tech-debt decisions, documentation, and stakeholder alignment.',
    storyText: '',
    metadataText: [
      'Category: Practice',
      'Client context: Verizon Business',
      'Employment: User Experience Lead, Accolite | July 2024 - February 2025 | Lead Specialist, Bounteous India | February 2025 - Present',
      'Responsibilities: UX strategy | Implementation planning | Prioritization | Tech-debt decisions | Documentation | Briefs and first cuts | Feature pitching to senior stakeholders | Delivery coordination | Stakeholder alignment',
      'AI-assisted work: AI-assisted tools and digital transformation | Content creation | Document review | Contextual productivity support',
      'Impact Champion: Bounteous IGNITE Spotlight Award | 04 November 2025 | Recognition for significant impact through innovation.',
      'Emerging Icon Award: Bounteous IGNITE ACE Award | 09 March 2026 | Recognition for outstanding service, tireless effort and support to the company.',
    ].join('\n'),
  },
]

export const TEACH_DEFAULTS: DefaultNode[] = [
  {
    nodeId: 'node-01',
    name: 'CARE College',
    aspectRatio: '16 / 9',
    placeholderArt: 'shards',
    gridColumn: 2,
    gridSpan: 1,
    gridRow: 7,
    summary: 'Teaching and mentoring aspiring designers through classroom programs, independent sessions, and design academies, with a focus on helping students build practical skills, confidence, and career direction.',
    storyText: [
      'Teaching has become an important part of how I practice design. I currently teach UX at CARE College, and have also mentored independently through Topmate and taught through Launchpad Academy.',
      'What matters to me is not just explaining methods or tools, but helping students understand how to think through problems, present their work, and build enough confidence to move into the industry. Some of the students I have worked with have gone on to secure strong roles, including opportunities abroad.',
    ].join('\n\n'),
    metadataText: [
      'Category: Teach',
      'Descriptor: UX Educator - Mentor',
      'Status: Active',
      'Capability: Teaching - Mentorship - UX Foundations - Portfolio Guidance - Career Development',
      'Supporting contexts: CARE College, Tiruchirappalli | Topmate | Launchpad Academy, Bengaluru',
    ].join('\n'),
  },
  {
    nodeId: 'node-02',
    name: 'Topmate: Independent Mentorship',
    aspectRatio: '4 / 3',
    placeholderArt: 'towers',
    gridColumn: 5,
    gridSpan: 1,
    gridRow: 7,
    summary: '1:1 portfolio reviews, career guidance, and UX mentorship sessions.',
    storyText: '',
    metadataText: 'Category: Teach\nDescriptor: Independent Mentor\nPlatform: Topmate',
  },
  {
    nodeId: 'node-03',
    name: 'Launchpad Academy',
    aspectRatio: '1 / 1',
    placeholderArt: 'form',
    gridColumn: 8,
    gridSpan: 1,
    gridRow: 7,
    summary: 'Classroom and cohort-based UX design instruction in Bengaluru.',
    storyText: '',
    metadataText: 'Category: Teach\nLocation: Bengaluru',
  },
  {
    nodeId: 'node-04',
    name: 'Design Thinking Workshops',
    aspectRatio: '3 / 4',
    placeholderArt: 'facade',
    gridColumn: 11,
    gridSpan: 1,
    gridRow: 7,
    summary: 'Hands-on workshops introducing product thinking, systems design, and prototyping.',
    storyText: '',
    metadataText: 'Category: Teach\nFocus: Design Thinking & Prototyping',
  },
]

export const PLAY_DEFAULTS: DefaultNode[] = [
  {
    nodeId: 'node-01',
    name: 'Gaming + F1',
    aspectRatio: '16 / 9',
    placeholderArt: 'shards',
    gridColumn: 2,
    gridSpan: 1,
    gridRow: 7,
    summary: 'Gaming became my bridge between curiosity, design, storytelling, and UX, long before I had words for any of them.',
    storyText: [
      'I started gaming when I was around 10 years old. I remember standing outside internet cafes, waiting for them to open at 8 in the morning. Once they opened, I would rush inside and spend almost the entire day playing, stepping out only for lunch and returning until around 8 at night.',
      "Those were the days of the original GTA, Claw, Virtua Cop (V-Cop), the early Prince of Persia games, Age of Empires, and several others whose names I can barely remember now. Over time, I moved towards racing games like Need for Speed, Forza and The Crew. But Assassin's Creed has always been my favourite franchise. I've played every instalment in the series.",
      'Formula 1 was a separate interest that began with the sport itself. The racing, engineering and strategy fascinated me long before I started playing F1 on my PS5.',
      "Looking back, gaming introduced me to interactive experiences before I even knew what UX was. I wasn't analysing interfaces or studying game mechanics. I was simply fascinated by these worlds, their stories and the freedom to explore them. That curiosity has stayed with me, even as the games and platforms have changed.",
    ].join('\n\n'),
    metadataText: [
      'Category: Play',
      'Descriptor: Interactive Worlds - Racing - Storytelling',
      'Status: Active / Long-term Passion',
    ].join('\n'),
  },
  {
    nodeId: 'node-02',
    name: 'Lyrics / Music Experiments',
    aspectRatio: '4 / 3',
    placeholderArt: 'towers',
    gridColumn: 5,
    gridSpan: 1,
    gridRow: 7,
    summary: 'I enjoy writing lyrics and experimenting with how words, rhythm, and AI-assisted music tools can turn an idea into a song.',
    storyText: [
      'It started with poetry. I enjoyed putting thoughts into words, sometimes playing with rhymes, sometimes just writing whatever came to mind. Over time, some of those poems began taking the shape of lyrics, and eventually, I wanted to hear what they would sound like as actual songs.',
      "Rap became one of the ways I experimented with storytelling, rhythm, and wordplay. I write the lyrics myself and use AI tools like Suno to explore different tunes and musical arrangements. I'm neither a trained singer nor a music producer, but that hasn't stopped me from experimenting.",
      "What began as poetry has gradually evolved into lyrics, songs, and a few creative experiments, including a rap video and recordings on SoundCloud. It's still something I do out of curiosity and the simple pleasure of turning words into something I can listen to.",
    ].join('\n\n'),
    metadataText: [
      'Category: Play',
      'Descriptor: Songwriting - Rap - Creative Experimentation',
      'Status: Active / Personal Exploration',
      'Progression: Poetry -> Lyrics -> Songs / Tunes',
    ].join('\n'),
  },
]

export const EXPLORE_DEFAULTS: DefaultNode[] = [
  {
    nodeId: 'node-01',
    name: 'Black Holes / Space',
    aspectRatio: '16 / 9',
    placeholderArt: 'shards',
    gridColumn: 1,
    gridSpan: 2,
    gridRow: 7,
    summary: 'My fascination with black holes led me to study astrophysics beyond my design profession, exploring questions about spacetime, gravity, and the limits of our understanding of the universe.',
    storyText: [
      "I've always been fascinated by space, particularly black holes. There is something intriguing about objects that push our understanding of physics to its limits. The more I read about them, the more questions I seem to have.",
      'That curiosity eventually led me to take Astro 101: Black Holes from the University of Alberta. What started as an interest turned into hours of studying concepts like general relativity, spacetime, event horizons, and the unanswered questions surrounding quantum gravity. I filled pages with handwritten notes, diagrams, and questions as I tried to make sense of ideas that are difficult to imagine, let alone fully understand.',
      "I'm not a physicist, and I don't pretend to be one. But I enjoy learning about things that have little to do with my profession. Sometimes, exploring an unfamiliar subject makes me question assumptions I wouldn't otherwise think to challenge.",
      'I still have those notebooks, and my curiosity about the universe is far from over.',
    ].join('\n\n'),
    metadataText: [
      'Category: Explore',
      'Descriptor: Astrophysics - Curiosity - Independent Learning',
      'Status: Active / Ongoing Exploration',
    ].join('\n'),
  },
  {
    nodeId: 'node-02',
    name: 'Generative AI Foundations',
    aspectRatio: '4 / 3',
    placeholderArt: 'towers',
    gridColumn: 3,
    gridSpan: 2,
    gridRow: 7,
    summary: 'Generative AI Foundations, UpGrad x Microsoft',
    storyText: '',
    metadataText: 'Category: Explore\nCredential: Generative AI Foundations, UpGrad x Microsoft',
  },
  {
    nodeId: 'node-03',
    name: 'Google Project Management',
    aspectRatio: '1 / 1',
    placeholderArt: 'form',
    gridColumn: 5,
    gridSpan: 2,
    gridRow: 7,
    summary: 'Google Project Management certifications',
    storyText: '',
    metadataText: 'Category: Explore\nCredential: Google Project Management certifications',
  },
  {
    nodeId: 'node-04',
    name: 'UX DesignOps',
    aspectRatio: '3 / 4',
    placeholderArt: 'facade',
    gridColumn: 7,
    gridSpan: 2,
    gridRow: 7,
    summary: 'UX DesignOps scaling and workflow systems',
    storyText: '',
    metadataText: 'Category: Explore\nCredential: UX DesignOps',
  },
  {
    nodeId: 'node-05',
    name: 'Leadership Competencies',
    aspectRatio: '9 / 16',
    placeholderArt: 'shards',
    gridColumn: 9,
    gridSpan: 2,
    gridRow: 7,
    summary: 'Team leadership and strategic decision-making',
    storyText: '',
    metadataText: 'Category: Explore\nCredential: Leadership Competencies',
  },
  {
    nodeId: 'node-06',
    name: 'Python for Data Science',
    aspectRatio: '16 / 9',
    placeholderArt: 'towers',
    gridColumn: 11,
    gridSpan: 2,
    gridRow: 7,
    summary: 'Data analysis and computational foundations',
    storyText: '',
    metadataText: 'Category: Explore\nCredential: Python for Data Science',
  },
]

export const RECOGNITION_DEFAULTS: DefaultNode[] = [
  {
    nodeId: 'node-01',
    name: 'International Bicycle Design Competition',
    aspectRatio: '16 / 9',
    placeholderArt: 'shards',
    gridColumn: 1,
    gridSpan: 2,
    gridRow: 7,
    summary: '2nd Prize - Taiwan - 2026',
    storyText: '',
    metadataText: [
      'Category: Recognition',
      'Competition: International Bicycle Design Competition',
      'Location: Taiwan',
      'Year: 2026',
      'Result: 2nd Prize',
      'Travel: Travelled to Taiwan to receive the prize in March 2026.',
      'Project context: Bicycle design, industrial design, digital experience and motivation for children to cycle.',
      'Concept: A bicycle with a speedometer | A companion experience for parents | Parent-created tasks | Points and motivational leaderboards for children in schools or residential communities',
    ].join('\n'),
  },
  {
    nodeId: 'node-02',
    name: 'iF Design Award',
    aspectRatio: '4 / 3',
    placeholderArt: 'towers',
    gridColumn: 3,
    gridSpan: 2,
    gridRow: 7,
    summary: 'Award-winning TVS Motor work',
    storyText: '',
    metadataText: [
      'Category: Recognition',
      'Award: iF Design Award',
      'Cross-reference: TVS Motor',
    ].join('\n'),
  },
  {
    nodeId: 'node-03',
    name: 'Michelin Design Challenge',
    aspectRatio: '1 / 1',
    placeholderArt: 'form',
    gridColumn: 5,
    gridSpan: 2,
    gridRow: 7,
    summary: '2018 - 3rd Prize - International',
    storyText: '',
    metadataText: [
      'Category: Recognition',
      'Competition: Michelin Design Challenge',
      'Year: 2018',
      'Result: 3rd Prize',
      'Level: International',
      'Evidence: [michelinmedia.com gallery](https://michelinmedia.com/pages/galleries/detail/6/126/)',
    ].join('\n'),
  },
  {
    nodeId: 'node-04',
    name: 'Dell Designathon',
    aspectRatio: '3 / 4',
    placeholderArt: 'facade',
    gridColumn: 7,
    gridSpan: 2,
    gridRow: 7,
    summary: '2017 - 2nd Prize, National - 2019 - 2nd Prize, National',
    storyText: '',
    metadataText: [
      'Category: Recognition',
      'Competition: Dell Designathon',
      'Results: 2017 - 2nd Prize, National | 2019 - 2nd Prize, National',
    ].join('\n'),
  },
  {
    nodeId: 'node-05',
    name: 'Four Published International Patents',
    aspectRatio: '9 / 16',
    placeholderArt: 'shards',
    gridColumn: 9,
    gridSpan: 2,
    gridRow: 7,
    summary: 'Four published international patents - TVS Motor',
    storyText: '',
    metadataText: [
      'Category: Recognition',
      'Patents: Four published international patents',
      'Cross-reference: TVS Motor',
    ].join('\n'),
  },
  {
    nodeId: 'node-06',
    name: 'IIT Kharagpur B-Plan / Hope Box',
    aspectRatio: '16 / 9',
    placeholderArt: 'towers',
    gridColumn: 11,
    gridSpan: 2,
    gridRow: 7,
    summary: 'IIT Kharagpur B-Plan - 2017 - 3rd Prize',
    storyText: '',
    metadataText: [
      'Category: Recognition',
      'Competition: IIT Kharagpur B-Plan',
      'Year: 2017',
      'Result: 3rd Prize',
      'Contribution: Brand identity and co-development of industrial design',
      'Project reference: [Hopebox on Behance](https://www.behance.net/gallery/30786191/Hopebox-_-Logo-design)',
    ].join('\n'),
  },
]

export const FREELANCE_DEFAULTS: DefaultNode[] = [
  {
    nodeId: 'node-01',
    name: 'Amar Chitra Katha / Supandi',
    aspectRatio: '16 / 9',
    placeholderArt: 'shards',
    gridColumn: 1,
    gridSpan: 2,
    gridRow: 7,
    summary: 'Character-related NFT / digital commerce experience.',
    storyText: '',
    metadataText: 'Category: Freelance',
  },
  {
    nodeId: 'node-02',
    name: 'Xpertiz',
    aspectRatio: '4 / 3',
    placeholderArt: 'towers',
    gridColumn: 3,
    gridSpan: 3,
    gridRow: 7,
    summary: 'Independent client.',
    storyText: '',
    metadataText: 'Category: Freelance',
  },
  {
    nodeId: 'node-03',
    name: 'Celestial',
    aspectRatio: '1 / 1',
    placeholderArt: 'form',
    gridColumn: 6,
    gridSpan: 2,
    gridRow: 7,
    summary: 'Design-related project associated with later Murugappa Group acquisition context.',
    storyText: '',
    metadataText: 'Category: Freelance',
  },
  {
    nodeId: 'node-04',
    name: 'Techno Sport',
    aspectRatio: '3 / 4',
    placeholderArt: 'facade',
    gridColumn: 8,
    gridSpan: 3,
    gridRow: 7,
    summary: 'UI and UX design for mobile and web experiences.',
    storyText: '',
    metadataText: 'Category: Freelance',
  },
  {
    nodeId: 'node-05',
    name: 'Independent Client Work',
    aspectRatio: '9 / 16',
    placeholderArt: 'shards',
    gridColumn: 11,
    gridSpan: 2,
    gridRow: 7,
    summary: 'Various independent client engagements.',
    storyText: '',
    metadataText: 'Category: Freelance',
  },
]

export const AtlasContent: GlobalConfig = {
  slug: 'atlasContent',
  label: 'About Me / SK Atlas',
  admin: {
    description: 'Visual editor for the interactive SK Skill Atlas on the About page. Edit nodes, upload node images, and update stories across all 6 categories with real-time Live Preview.',
    livePreview: {
      url: () => '/preview/about',
      breakpoints: [
        { label: 'Mobile',  name: 'mobile',  width: 375,  height: 812 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: '01 Practice (Career)',
          description: 'Career progression nodes displayed on the primary Practice axis (Foundations -> ZF Group -> TVS Motor -> Bounteous).',
          fields: [
            createCategoryNodeArray(
              'practiceNodes',
              '01 Practice Career Nodes',
              'Click any node card below to edit its title, upload a real image, or update its hover summary, detail story, and metadata table.',
              PRACTICE_DEFAULTS,
            ),
          ],
        },
        {
          label: '02 Teach',
          description: 'Teaching, academic instruction, and independent mentorship nodes.',
          fields: [
            createCategoryNodeArray(
              'teachNodes',
              '02 Teach Nodes',
              'Manage nodes for CARE College, Topmate Mentorship, Launchpad Academy, and Workshops.',
              TEACH_DEFAULTS,
            ),
          ],
        },
        {
          label: '03 Play',
          description: 'Personal passions, Gaming + F1, and Music / Lyrics experiments.',
          fields: [
            createCategoryNodeArray(
              'playNodes',
              '03 Play Nodes',
              'Manage nodes for Gaming + F1 and Lyrics / Music Experiments.',
              PLAY_DEFAULTS,
            ),
          ],
        },
        {
          label: '04 Explore',
          description: 'Astrophysics / Black Holes and continuing education credentials.',
          fields: [
            createCategoryNodeArray(
              'exploreNodes',
              '04 Explore Nodes',
              'Manage nodes for Black Holes / Space, Generative AI, Project Management, DesignOps, Leadership, and Data Science.',
              EXPLORE_DEFAULTS,
            ),
          ],
        },
        {
          label: '05 Recognition',
          description: 'International awards, national designathons, and published patents.',
          fields: [
            createCategoryNodeArray(
              'recognitionNodes',
              '05 Recognition Nodes',
              'Manage nodes for International Bicycle Design Competition, iF Design Award, Michelin, Dell Designathon, Patents, and IIT Kharagpur.',
              RECOGNITION_DEFAULTS,
            ),
          ],
        },
        {
          label: '06 Freelance',
          description: 'Independent client engagements and brand/product consulting.',
          fields: [
            createCategoryNodeArray(
              'freelanceNodes',
              '06 Freelance Nodes',
              'Manage nodes for Amar Chitra Katha / Supandi, Xpertiz, Celestial, Techno Sport, and independent work.',
              FREELANCE_DEFAULTS,
            ),
          ],
        },
        {
          label: 'Advanced Grid JSON',
          description: 'Underlying 12x12 grid configuration (gateways, preview regions, and raw fallback JSON).',
          fields: [
            {
              name: 'sourceData',
              label: 'Base Atlas Layout JSON (Auto-merged with the 6 Category Tabs above)',
              type: 'json',
              admin: {
                description: 'Base JSON configuration for gateway ring positions and preview regions. Node edits made in Tabs 01-06 automatically override this data.',
              },
            },
          ],
        },
      ],
    },
  ],
}
