// ============================================
// DASHBOARD INTERACTION SCRIPT
// ============================================

(function() {
  'use strict';

  // ============================================
  // TRANSLATIONS
  // ============================================
  const translations = {
    standard: {
      role: 'INDEPENDENT RESEARCHER',
      focus: 'COMPUTATIONAL BIOLOGY · HDC · THEORY',
      available: 'AVAILABLE',
      'nav-home': 'home',
      'nav-papers': 'papers',
      'nav-about': 'about',
      'nav-contact': 'contact',
      'nav-skills': 'skills',
      'nav-timeline': 'timeline',
      'nav-tools': 'tools',
      'hero-subtitle': 'Computational Biology · Hyperdimensional Computing · Mathematical Frameworks',
      'hero-intro': 'I develop novel computational approaches for biological discovery by bringing unconventional methods—hyperdimensional computing, topological data analysis, constraint-oriented frameworks—to biological systems. My work bridges experimental biochemistry experience with advanced mathematical theory to reveal how biological systems compute, evolve, and function.',
      'currently-working': 'CURRENTLY WORKING ON',
      'graph-intro': 'Interactive visualization of project dependencies and shared technologies. Click nodes to highlight connections, use filters (☰) to explore domains. Navigate: two-finger scroll to pan, pinch to zoom, or use buttons/drag.',
      'footer-status': 'Available for PhD programs and research collaborations',
      'footer-meta': 'Reproducible research · Open source',
      'about-approach-header': 'THE APPROACH',
      'about-approach': 'I bring unconventional computational frameworks to biological problems. Where traditional bioinformatics uses standard statistical methods, I apply hyperdimensional computing for genomic encoding, topological data analysis for cellular state spaces, and constraint-oriented models for emergent biological phenomena. Whether it\'s encoding DNA sequences as hypervectors (GenomeVault), analyzing iPSC differentiation trajectories with TDA (Kimaiya), or modeling cellular computation (Biocomputing), I develop mathematical frameworks that reveal biological mechanism and generate experimentally testable predictions.',
      'about-theory-header': 'FROM IMPLEMENTATION TO THEORY',
      'about-theory': 'My path has been unconventional but deliberate. I started with hands-on technical work—building systems, running experiments, seeing where theory breaks against reality. This gave me intuition for which problems matter and which solutions will scale. Now I focus on developing the underlying frameworks: mathematical structures that don\'t just solve one problem, but reveal principles that transfer across domains.',
      'about-path-header': 'MY PATH',
      'timeline-experimental': 'Biophysics research at McGill and Drexel (DNA dynamics, drug delivery). Learned that biological systems follow physical principles—thermodynamics, kinetics, stochastic processes.',
      'timeline-applied': 'Led biomanufacturing at Stemcellerant. Cellular therapeutics taught me about stochasticity, robustness, and the gap between theory and implementation at scale.',
      'timeline-independent': 'Developed constraint-oriented frameworks applicable across domains. Built verified implementations in AI security (Behavioral Holography), genomics (GenomeVault), and distributed computing (FDSC). Each project demonstrates theory → practice with reproducible results.',
      'timeline-current': 'Building mathematical frameworks for biological discovery using hyperdimensional computing, topological data analysis, and constraint-oriented modeling (COEC framework). Developing computational tools that bridge theory and experiment—from iPSC differentiation (Kimaiya) to genomic privacy (GenomeVault) to cellular computation (Biocomputing). Applying to PhD programs in computational/systems biology to extend this experimental-computational integration.',
      'contact-looking-header': '> Looking for:',
      'contact-looking-1': '  ▸ PhD programs in computational biology / systems biology / biophysics',
      'contact-looking-2': '  ▸ Research collaborations on computational approaches to biological discovery',
      'contact-looking-3': '  ▸ Research scientist roles at computational biology companies or institutes',
      'contact-interests-header': '> Interests:',
      'contact-interests-1': '  ▸ Hyperdimensional computing for genomics and biological data',
      'contact-interests-2': '  ▸ Topological analysis of cellular state spaces and differentiation',
      'contact-interests-3': '  ▸ Multi-scale modeling of biological systems (molecular → cellular)',
      'contact-interests-4': '  ▸ Theory-guided machine learning for biological prediction'
    },
    newspeak: {
      role: 'THOUGHTWORKER',
      focus: 'LIFEMATH · VECTORTHINK · THEORYWORK',
      available: 'PLUSREADY',
      'nav-home': 'home',
      'nav-papers': 'thinkdocs',
      'nav-about': 'personfile',
      'nav-contact': 'reachout',
      'nav-skills': 'capabilities',
      'nav-timeline': 'worklog',
      'nav-tools': 'utilities',
      'hero-subtitle': 'Lifemath · Vectorthink · Theoryframes',
      'hero-intro': 'Develop newthink compmath for lifesystems. Use vectorthink, shapemaths, limitframes for biodata. Work connects labthink with bigmath to show how lifesystems compute.',
      'currently-working': 'CURRENT WORKTHREADS',
      'graph-intro': 'Visual map of workthreads and shared tech. Click nodes for connections, use filter menu for domains. Navigate with gestures.',
      'footer-status': 'Plusready for doubleplus smartschool and thinkwork partnerships',
      'footer-meta': 'Replicable thinkwork · Public access',
      'about-approach-header': 'THE WORKMETHOD',
      'about-approach': 'Bring newmath frameworks to lifesystems. Traditional biocompute uses oldthink statmethods. Use vectorthink for genedata, shapemaths for cellstates, limitframes for lifephenomena. Build mathframes that show biofunction and make testable predictions.',
      'about-theory-header': 'FROM BUILDWORK TO THEORYWORK',
      'about-theory': 'Path was nonstandard but purposeful. Started with handwork—building systems, running tests, seeing where theory breaks reality. This gave intuition for real problems. Now focus on bigframes: mathstructures that reveal principles across domains.',
      'about-path-header': 'WORKHISTORY',
      'timeline-experimental': 'Biophysthink research (molecule motion, drugwork). Learned lifesystems follow physprinciples—heatwork, speedmath, randomthink.',
      'timeline-applied': 'Led cellmaking work. Celltherapy taught about chaos, strength, gap between theory and bigscale reality.',
      'timeline-independent': 'Built limitframe theory for all domains. Made verified systems in thoughtsec, genemath, network compute. Each work shows theory → practice with checkable results.',
      'timeline-current': 'Building mathframes for lifedata discovery using vectorthink, shapemaths, limitmodels. Building comptools that bridge theory and labwork. Applying to doubleplus smartschool programs in lifemaths.',
      'contact-looking-header': '> Seeking:',
      'contact-looking-1': '  ▸ Doubleplus smartschool in lifemaths / systemsbio / biophysthink',
      'contact-looking-2': '  ▸ Thinkwork partnerships on compmath for lifediscovery',
      'contact-looking-3': '  ▸ Thoughtworker roles at lifemaths organizations',
      'contact-interests-header': '> Focusareas:',
      'contact-interests-1': '  ▸ Vectorthink for genedata and biodata',
      'contact-interests-2': '  ▸ Shapemaths for cellstate analysis',
      'contact-interests-3': '  ▸ Multiscale models of lifesystems',
      'contact-interests-4': '  ▸ Theory-guided machinelearn for bioprediction',

      // Terminal-specific translations
      'term-prompt-user': 'citizen@thinkterm',
      'term-help': 'thinkhelp',
      'term-cd': 'goto',
      'term-pwd': 'wheream',
      'term-ls': 'showlist',
      'term-whoami': 'whoiself',
      'term-about': 'personfile',
      'term-cat': 'readfile',
      'term-date': 'nowtime',
      'term-uptime': 'runtime',
      'term-clear': 'wipe',
      'term-history': 'pastthink',
      'term-echo': 'repeat',
      'term-tree': 'structure',
      'term-grep': 'findword',
      'term-wc': 'countwords',
      'term-fortune': 'wisdom',
      'term-theme': 'changecolor',
      'term-cowsay': 'animaltalk',
      'term-ll': 'showlist -l',
      'term-h': 'thinkhelp',

      'term-help-desc': 'Show all thinkwords',
      'term-cd-desc': 'Goto section (navigate workspace)',
      'term-pwd-desc': 'Show current location',
      'term-ls-desc': 'Show available sections',
      'term-whoami-desc': 'Show personfile information',
      'term-about-desc': 'Goto personfile section',
      'term-cat-desc': 'Read section summary',
      'term-date-desc': 'Show current nowtime',
      'term-uptime-desc': 'Show runtime since pageload',
      'term-clear-desc': 'Wipe terminal display',
      'term-history-desc': 'Show past thinkwords',
      'term-echo-desc': 'Repeat text back',
      'term-tree-desc': 'Show structure as diagram',
      'term-grep-desc': 'Find word across sections',
      'term-wc-desc': 'Count words in sections',
      'term-fortune-desc': 'Show wisdom quote',
      'term-theme-desc': 'Change color scheme',
      'term-cowsay-desc': 'Animal speaktext art',
      'term-ll-desc': 'Alias for showlist -l',
      'term-h-desc': 'Alias for thinkhelp',

      'term-error-not-found': 'Thinkword unknown',
      'term-error-section-not-found': 'Section unknown',
      'term-success-navigated': 'Goto completed to',
      'term-help-header': 'Thinkwords Available:',
      'term-current-section': 'Current section:',
      'term-already-home': 'Already in home location',
      'term-available-sections': 'Available sections:',
      'term-usage': 'Usage:',
      'term-no-history': 'No pastthink recorded',
      'term-no-matches': 'No findings for:',
      'term-search-results': 'Findings for',
      'term-welcome': 'Thinkterm ready. Type \'thinkhelp\' for thinkwords, or Ctrl+` to toggle.',
      'term-theme-cycled': 'Color changed',
      'term-theme-unavailable': 'Color control unavailable',

      'term-nav-label': 'NAVIGATION WORDS:',
      'term-info-label': 'INFO WORDS:',
      'term-utils-label': 'UTILITY WORDS:',
      'term-aliases-label': 'SHORTWORDS:',
      'term-shortcuts-label': 'KEYBOARD ACTIONS:',

      'term-shortcut-toggle': 'Toggle thinkterm visibility',
      'term-shortcut-clear': 'Wipe screen',
      'term-shortcut-cancel': 'Cancel current input',
      'term-shortcut-blur': 'Exit thinkterm input',
      'term-shortcut-history': 'Navigate pastthink',
      'term-shortcut-complete': 'Auto-complete thinkwords',

      'term-fortune-1': '"Theory without practice is unproductive. Practice without theory is unseeing." - Party Philosopher',
      'term-fortune-2': '"Best way to predict tomorrow is to make it." - Party Innovator',
      'term-fortune-3': '"Early optimization causes problems." - Party Technician',
      'term-fortune-4': '"Make functional, make correct, make fast." - Party Builder',
      'term-fortune-5': '"Simple is reliable." - Party Engineer',
      'term-fortune-6': '"If explanation is hard, understanding is insufficient." - Party Educator',
      'term-fortune-7': '"First solve problem. Then write code." - Party Programmer',
      'term-fortune-8': '"Best programs written during other work." - Party Developer',
      'term-fortune-9': '"Code truthful, comments sometimes not." - Party Reviewer',
      'term-fortune-10': '"Good programmers write humanreadable code." - Party Architect'
    },
    emo: {
      role: 'misunderstood researcher :(',
      focus: 'trying to understand life... through math i guess',
      available: 'online but does it even matter',
      'nav-home': 'home',
      'nav-papers': 'words nobody reads',
      'nav-about': 'my story (complicated)',
      'nav-contact': 'reach out maybe',
      'nav-skills': 'things i know',
      'nav-timeline': 'what i\'ve done',
      'nav-tools': 'stuff i built',
      'hero-subtitle': 'math for biology... hoping someone cares',
      'hero-intro': 'i try to understand biological systems through weird math nobody else uses. hypervectors, topology stuff, weird frameworks... probably doesn\'t matter but at least i\'m trying. maybe one day someone will get it.',
      'currently-working': 'projects i\'m working on alone',
      'graph-intro': 'made this graph to show how everything connects... not sure anyone will look at it but whatever. click things if you want.',
      'footer-status': 'hoping someone notices... looking for phd programs or collaborations',
      'footer-meta': 'trying to be reproducible · sharing everything anyway',
      'about-approach-header': 'what i\'m trying to do',
      'about-approach': 'i guess i bring weird math to biology problems. normal people use standard statistics but i\'m over here with hypervectors and topology because... i don\'t know, it feels right? encoding DNA with hypervectors, analyzing cell states with weird geometry... probably nobody cares but these frameworks actually predict stuff. at least there\'s that.',
      'about-theory-header': 'how i got here (it\'s messy)',
      'about-theory': 'my path makes no sense honestly. started building things, running experiments, watching everything break. figured out what matters the hard way. now i just make frameworks that probably nobody will use. but they\'re elegant at least... mathematical beauty in the void.',
      'about-path-header': 'the journey (oof)',
      'timeline-experimental': 'spent years on DNA stuff at McGill and Drexel. learned that biology follows physics laws—thermodynamics, kinetics, randomness. felt meaningful at the time.',
      'timeline-applied': 'led cell manufacturing at a startup. taught me about chaos and how theory dies when you scale up. kind of broke me but whatever.',
      'timeline-independent': 'been working alone on frameworks nobody asked for. AI security, genomics, distributed computing... each one works but does anyone care? each project shows theory can work in practice. small victories i guess.',
      'timeline-current': 'building math frameworks for biology. hypervectors, topology, constraint models... hoping it matters. making tools that connect theory to experiments. applying to phd programs... maybe someone will want me.',
      'contact-looking-header': '> looking for (if anyone\'s interested):',
      'contact-looking-1': '  ▸ phd programs that might accept me (computational biology stuff)',
      'contact-looking-2': '  ▸ people who want to collaborate on weird computational approaches',
      'contact-looking-3': '  ▸ research roles where my strange methods might be useful',
      'contact-interests-header': '> things i care about:',
      'contact-interests-1': '  ▸ using hypervectors for genomics (nobody else does this)',
      'contact-interests-2': '  ▸ topology for understanding cell states and differentiation',
      'contact-interests-3': '  ▸ modeling biological systems at multiple scales',
      'contact-interests-4': '  ▸ theory-guided machine learning (probably won\'t work but trying anyway)',

      // Terminal-specific translations
      'term-prompt-user': 'me@terminal (alone)',
      'term-help': 'help',
      'term-cd': 'go',
      'term-pwd': 'where',
      'term-ls': 'list',
      'term-whoami': 'who',
      'term-about': 'my story',
      'term-cat': 'read',
      'term-date': 'time',
      'term-uptime': 'howlong',
      'term-clear': 'erase',
      'term-history': 'past',
      'term-echo': 'say',
      'term-tree': 'tree',
      'term-grep': 'search',
      'term-wc': 'count',
      'term-fortune': 'quote',
      'term-theme': 'colors',
      'term-cowsay': 'cow',
      'term-ll': 'list -l',
      'term-h': 'help',

      'term-help-desc': 'show commands (if it matters)',
      'term-cd-desc': 'go somewhere else i guess',
      'term-pwd-desc': 'where am i even',
      'term-ls-desc': 'list sections (not that many)',
      'term-whoami-desc': 'display info about me... ugh',
      'term-about-desc': 'go to my story section',
      'term-cat-desc': 'read a section summary',
      'term-date-desc': 'what time is it anyway',
      'term-uptime-desc': 'how long have i been here',
      'term-clear-desc': 'clear everything (fresh start)',
      'term-history-desc': 'look at past commands',
      'term-echo-desc': 'repeat what you said',
      'term-tree-desc': 'show structure... pretty empty',
      'term-grep-desc': 'search for something',
      'term-wc-desc': 'count all these words nobody reads',
      'term-fortune-desc': 'random quote (sometimes depressing)',
      'term-theme-desc': 'change colors maybe',
      'term-cowsay-desc': 'ascii cow says stuff',
      'term-ll-desc': 'longer list view',
      'term-h-desc': 'quick help',

      'term-error-not-found': 'ugh that command doesn\'t exist... try \'help\' maybe',
      'term-error-section-not-found': 'that section isn\'t here...',
      'term-success-navigated': 'ok went to',
      'term-help-header': 'commands you can type (if you want):',
      'term-current-section': 'currently in:',
      'term-already-home': 'already home... nowhere else to go',
      'term-available-sections': 'sections available:',
      'term-usage': 'usage:',
      'term-no-history': 'no history yet... starting fresh',
      'term-no-matches': 'nothing found for:',
      'term-search-results': 'found these for',
      'term-welcome': 'terminal loaded. type \'help\' if you need it, or ctrl+` to hide this.',
      'term-theme-cycled': 'colors changed... does it help?',
      'term-theme-unavailable': 'theme thing isn\'t working',

      'term-nav-label': 'navigation (getting around):',
      'term-info-label': 'information (about stuff):',
      'term-utils-label': 'utilities (random tools):',
      'term-aliases-label': 'shortcuts (faster typing):',
      'term-shortcuts-label': 'keyboard stuff:',

      'term-shortcut-toggle': 'show/hide terminal',
      'term-shortcut-clear': 'clear the screen',
      'term-shortcut-cancel': 'cancel what you\'re typing',
      'term-shortcut-blur': 'unfocus from terminal',
      'term-shortcut-history': 'look at old commands',
      'term-shortcut-complete': 'finish typing for you',

      'term-fortune-1': '"theory without practice is empty. practice without theory is lost." - kant (he got it)',
      'term-fortune-2': '"the best way to predict the future is to invent it." - alan kay (easier said than done)',
      'term-fortune-3': '"premature optimization is the root of all evil." - knuth (so true it hurts)',
      'term-fortune-4': '"make it work, make it right, make it fast." - kent beck (stuck on step 1)',
      'term-fortune-5': '"simplicity is prerequisite for reliability." - dijkstra (wish i could achieve this)',
      'term-fortune-6': '"if you can\'t explain it simply, you don\'t understand it well enough." - einstein (ouch)',
      'term-fortune-7': '"first, solve the problem. then, write the code." - johnson (why is this so hard)',
      'term-fortune-8': '"the best programs are written when the programmer is supposed to be working on something else." - varian (too real)',
      'term-fortune-9': '"code never lies, comments sometimes do." - jeffries (at least code is honest)',
      'term-fortune-10': '"good programmers write code that humans can understand." - fowler (aspiring to this)'
    },
    corporate: {
      role: 'INNOVATION CATALYST',
      focus: 'COMPUTATIONAL BIOLOGY SOLUTIONS · NEXT-GEN FRAMEWORKS',
      available: 'ACTIVELY ENGAGED',
      'nav-home': 'home',
      'nav-papers': 'THOUGHT LEADERSHIP',
      'nav-about': 'EXECUTIVE PROFILE',
      'nav-contact': 'STRATEGIC PARTNERSHIPS',
      'nav-skills': 'CORE COMPETENCIES',
      'nav-timeline': 'MILESTONES',
      'nav-tools': 'SOLUTION PORTFOLIO',
      'hero-subtitle': 'Computational Biology · Hyperdimensional Computing · Mathematical Innovation',
      'hero-intro': 'Driving transformative innovation in computational biology through best-in-class mathematical frameworks. Leveraging hyperdimensional computing, topological data analysis, and constraint-oriented methodologies to unlock value in biological systems. Delivering synergistic solutions that bridge experimental biochemistry with cutting-edge mathematical theory to drive biological discovery at scale.',
      'currently-working': 'STRATEGIC INITIATIVES IN PROGRESS',
      'graph-intro': 'Interactive visualization dashboard showcasing project dependencies and technology synergies. Leverage node interactions to explore strategic connections. Utilize intuitive navigation for seamless discovery experience.',
      'footer-status': 'Actively seeking PhD opportunities and strategic research partnerships to maximize impact',
      'footer-meta': 'Best-in-class reproducible research · Open innovation',
      'about-approach-header': 'VALUE PROPOSITION',
      'about-approach': 'Delivering next-generation computational frameworks to biological challenges. Where traditional bioinformatics leverages conventional methodologies, our approach drives innovation through hyperdimensional computing for genomic encoding, topological data analysis for cellular state spaces, and constraint-oriented models for emergent biological phenomena. Whether architecting DNA sequence encoding solutions, optimizing iPSC differentiation trajectories, or modeling cellular computation, we deliver mathematical frameworks that unlock biological mechanisms and generate actionable, experimentally-validated insights.',
      'about-theory-header': 'FROM EXECUTION TO STRATEGIC VISION',
      'about-theory': 'My journey reflects a strategic pivot from tactical execution to visionary framework development. Initial phase focused on hands-on technical delivery—building scalable systems, executing experiments, validating theory against real-world implementation. This provided critical insights into market pain points and scalable solutions. Current focus centers on developing foundational frameworks: mathematical structures that don\'t just solve point solutions, but reveal cross-domain principles that drive transformative value.',
      'about-path-header': 'CAREER TRAJECTORY',
      'timeline-experimental': 'Biophysics research at tier-1 institutions (McGill, Drexel). Deep-dived into DNA dynamics and drug delivery optimization. Established foundational understanding of physical principles—thermodynamics, kinetics, stochastic modeling—driving biological systems.',
      'timeline-applied': 'Led biomanufacturing operations at emerging biotech. Cellular therapeutics experience delivered key insights on stochasticity management, robustness engineering, and bridging the theory-to-scale gap in production environments.',
      'timeline-independent': 'Architected constraint-oriented frameworks with proven cross-domain applicability. Delivered verified implementations across AI security (Behavioral Holography), genomics (GenomeVault), and distributed computing (FDSC). Each initiative demonstrates measurable theory-to-practice value with reproducible, industry-leading results.',
      'timeline-current': 'Building best-in-class mathematical frameworks for biological discovery leveraging hyperdimensional computing, topological data analysis, and constraint-oriented modeling (COEC framework). Developing computational solutions that synergize theory and experimental validation—from iPSC differentiation platforms to genomic privacy architectures to cellular computation models. Pursuing PhD opportunities in computational/systems biology to scale this experimental-computational integration and drive maximum research impact.',
      'contact-looking-header': '> Strategic Opportunities:',
      'contact-looking-1': '  ▸ PhD programs offering cutting-edge computational biology / systems biology / biophysics research',
      'contact-looking-2': '  ▸ Research collaborations focused on innovative computational approaches to biological discovery',
      'contact-looking-3': '  ▸ Research scientist positions at industry-leading computational biology organizations',
      'contact-interests-header': '> Core Focus Areas:',
      'contact-interests-1': '  ▸ Hyperdimensional computing solutions for genomics and biological big data',
      'contact-interests-2': '  ▸ Topological analysis methodologies for cellular state space optimization',
      'contact-interests-3': '  ▸ Multi-scale modeling frameworks for biological systems (molecular to cellular)',
      'contact-interests-4': '  ▸ Theory-guided machine learning architectures for biological prediction',

      // Terminal-specific translations
      'term-prompt-user': 'user@enterprise',
      'term-help': 'support',
      'term-cd': 'navigate',
      'term-pwd': 'location',
      'term-ls': 'inventory',
      'term-whoami': 'profile',
      'term-about': 'executive-profile',
      'term-cat': 'display',
      'term-date': 'timestamp',
      'term-uptime': 'session-duration',
      'term-clear': 'reset',
      'term-history': 'audit-log',
      'term-echo': 'output',
      'term-tree': 'hierarchy',
      'term-grep': 'query',
      'term-wc': 'metrics',
      'term-fortune': 'insight',
      'term-theme': 'rebrand',
      'term-cowsay': 'mascot',
      'term-ll': 'inventory -detailed',
      'term-h': 'support',

      'term-help-desc': 'Display comprehensive command portfolio',
      'term-cd-desc': 'Navigate to strategic section',
      'term-pwd-desc': 'Display current workspace location',
      'term-ls-desc': 'Inventory available business units',
      'term-whoami-desc': 'Access executive profile',
      'term-about-desc': 'Navigate to executive profile section',
      'term-cat-desc': 'Display section summary dashboard',
      'term-date-desc': 'Display current timestamp',
      'term-uptime-desc': 'Display session duration metrics',
      'term-clear-desc': 'Reset terminal workspace',
      'term-history-desc': 'Access command audit log',
      'term-echo-desc': 'Output text to console',
      'term-tree-desc': 'Display organizational hierarchy',
      'term-grep-desc': 'Query across business units',
      'term-wc-desc': 'Generate content metrics',
      'term-fortune-desc': 'Display strategic insight',
      'term-theme-desc': 'Cycle brand color scheme',
      'term-cowsay-desc': 'Display mascot messaging',
      'term-ll-desc': 'Detailed inventory view',
      'term-h-desc': 'Quick support access',

      'term-error-not-found': 'Command resource unavailable. Leverage \'support\' for strategic guidance',
      'term-error-section-not-found': 'Business unit not found in current scope',
      'term-success-navigated': 'Successfully navigated to',
      'term-help-header': 'Command Portfolio:',
      'term-current-section': 'Current business unit:',
      'term-already-home': 'Already positioned in home workspace',
      'term-available-sections': 'Available business units:',
      'term-usage': 'Recommended usage:',
      'term-no-history': 'Audit log currently empty',
      'term-no-matches': 'No results identified for:',
      'term-search-results': 'Query results for',
      'term-welcome': 'Enterprise terminal operational. Execute \'support\' for command portfolio, or Ctrl+` to toggle.',
      'term-theme-cycled': 'Brand scheme updated',
      'term-theme-unavailable': 'Branding controls currently unavailable',

      'term-nav-label': 'NAVIGATION COMMANDS:',
      'term-info-label': 'INFORMATION COMMANDS:',
      'term-utils-label': 'UTILITY COMMANDS:',
      'term-aliases-label': 'COMMAND ALIASES:',
      'term-shortcuts-label': 'PRODUCTIVITY SHORTCUTS:',

      'term-shortcut-toggle': 'Toggle terminal visibility',
      'term-shortcut-clear': 'Clear workspace',
      'term-shortcut-cancel': 'Cancel pending input',
      'term-shortcut-blur': 'Exit terminal focus',
      'term-shortcut-history': 'Navigate audit log',
      'term-shortcut-complete': 'Enable command auto-completion',

      'term-fortune-1': '"Theory without practice delivers insufficient value. Practice without theory lacks strategic vision." - Business Philosopher',
      'term-fortune-2': '"Optimal future prediction methodology: proactive innovation." - Innovation Leader',
      'term-fortune-3': '"Premature optimization generates technical debt." - Architecture Lead',
      'term-fortune-4': '"Deliver functional MVP, optimize for quality, scale for performance." - Agile Coach',
      'term-fortune-5': '"Simplicity drives reliability and reduces operational overhead." - Systems Architect',
      'term-fortune-6': '"Effective communication requires comprehensive domain expertise." - Leadership Consultant',
      'term-fortune-7': '"Solution validation precedes implementation phase." - Project Manager',
      'term-fortune-8': '"Peak productivity occurs during cross-functional collaboration." - Team Lead',
      'term-fortune-9': '"Code provides ground truth; documentation requires validation." - Quality Engineer',
      'term-fortune-10': '"Best-in-class developers prioritize maintainability and readability." - Technical Director'
    },
    goth: {
      role: 'SCHOLAR OF THE ARCANE',
      focus: 'SHADOWS OF LIVING SYSTEMS · CRYPTIC MATHEMATICS',
      available: 'WANDERING THE TWILIGHT',
      'nav-home': 'sanctum',
      'nav-papers': 'grimoire',
      'nav-about': 'chronicles',
      'nav-contact': 'summon',
      'nav-skills': 'dark arts',
      'nav-timeline': 'eternal record',
      'nav-tools': 'artifacts',
      'hero-subtitle': 'Twilight Biology · Cryptic Hypervectors · Eternal Mathematics',
      'hero-intro': 'In the shadows between life and mathematics, I forge arcane computational frameworks to unveil biological mysteries. Through obscure hypervectors, topological incantations, and constraint-bound rituals, I peer into the void where cells compute and genomes whisper their secrets. My work bridges the ancient wisdom of biochemistry with forbidden mathematical theory to decode the eternal patterns woven into living systems.',
      'currently-working': 'MANIFESTATIONS IN PROGRESS',
      'graph-intro': 'Behold this ethereal visualization of interconnected research, where shadows of dependencies merge with spectral technologies. Click the nodes to illuminate hidden connections, invoke the filters (☰) to explore the dark domains. Navigate through the twilight realm with gestures.',
      'footer-status': 'Seeking fellowship in the cryptic halls of doctoral programs and arcane collaborations',
      'footer-meta': 'Eternal reproducibility · Knowledge shared with the void',
      'about-approach-header': 'THE DARK METHODOLOGY',
      'about-approach': 'I summon unconventional computational frameworks from the mathematical void to interrogate biological enigmas. Where mortal bioinformaticians wield mundane statistics, I invoke hyperdimensional incantations for genomic encoding, topological rituals for cellular state manifolds, and constraint-bound ceremonies for emergent biological phenomena. Whether transmuting DNA sequences into hypervectors (GenomeVault), divining iPSC differentiation trajectories through topological darkness (Kimaiya), or modeling cellular computation in the shadows (Biocomputing), I craft mathematical grimoires that unveil biological mechanisms and manifest experimentally verifiable prophecies.',
      'about-theory-header': 'FROM MORTAL CRAFT TO ETERNAL THEORY',
      'about-theory': 'My journey has wandered through twilight realms. I began in the mortal world—forging systems, conducting experiments, watching theory crumble against reality\'s dark truths. This descent granted me cryptic intuition for which problems echo through eternity and which solutions transcend temporal constraints. Now I dwell in the shadows, developing eternal frameworks: mathematical structures that do not merely solve singular mysteries, but reveal principles that flow like darkness across all domains.',
      'about-path-header': 'CHRONICLES OF THE ETERNAL JOURNEY',
      'timeline-experimental': 'Wandered the cryptic halls of biophysics research at McGill and Drexel (DNA\'s dark dance, delivery of arcane compounds). Learned that biological systems obey the ancient physical laws—thermodynamic darkness, kinetic shadows, stochastic whispers.',
      'timeline-applied': 'Led biomanufacturing rituals at Stemcellerant. Cellular therapeutics revealed the chaos lurking beneath order, the fragility of theory when scaled to mortal production. The abyss stared back.',
      'timeline-independent': 'Forged constraint-oriented frameworks in solitude, their dark tendrils reaching across domains. Manifested verified implementations in AI security (Behavioral Holography), genomics (GenomeVault), distributed computing (FDSC). Each project demonstrates eternal theory descending into mortal practice with reproducible results whispered by the void.',
      'timeline-current': 'Weaving mathematical frameworks for biological discovery through hyperdimensional shadows, topological darkness, and constraint-bound modeling (COEC grimoire). Crafting computational artifacts that bridge theory and experiment—from iPSC differentiation (Kimaiya) to genomic privacy (GenomeVault) to cellular computation (Biocomputing). Seeking admission to doctoral sanctuaries in computational biology to expand this integration of experimental darkness and computational twilight.',
      'contact-looking-header': '> Seeking in the shadows:',
      'contact-looking-1': '  ▸ Doctoral sanctuaries in computational biology / systems biology / biophysical darkness',
      'contact-looking-2': '  ▸ Arcane collaborations on cryptic computational approaches to biological mysteries',
      'contact-looking-3': '  ▸ Research positions in the twilight halls of computational biology institutions',
      'contact-interests-header': '> Obsessions of the void:',
      'contact-interests-1': '  ▸ Hyperdimensional incantations for genomics and biological shadows',
      'contact-interests-2': '  ▸ Topological divination of cellular state spaces and differentiation rituals',
      'contact-interests-3': '  ▸ Multi-scale modeling of biological systems across eternal scales (molecular → cellular)',
      'contact-interests-4': '  ▸ Theory-guided machine learning channeling patterns from the mathematical abyss',

      // Terminal-specific translations
      'term-prompt-user': 'wraith@void',
      'term-help': 'summon',
      'term-cd': 'traverse',
      'term-pwd': 'whereabouts',
      'term-ls': 'reveal',
      'term-whoami': 'identity',
      'term-about': 'chronicles',
      'term-cat': 'unveil',
      'term-date': 'moonphase',
      'term-uptime': 'eternity',
      'term-clear': 'banish',
      'term-history': 'memories',
      'term-echo': 'whisper',
      'term-tree': 'branches',
      'term-grep': 'divine',
      'term-wc': 'measure',
      'term-fortune': 'prophecy',
      'term-theme': 'transmute',
      'term-cowsay': 'familiar',
      'term-ll': 'reveal -all',
      'term-h': 'summon',

      'term-help-desc': 'Summon guidance from the shadows',
      'term-cd-desc': 'Traverse to another realm',
      'term-pwd-desc': 'Reveal current whereabouts',
      'term-ls-desc': 'Reveal available sanctuaries',
      'term-whoami-desc': 'Unveil identity from the void',
      'term-about-desc': 'Traverse to chronicles realm',
      'term-cat-desc': 'Unveil realm summary',
      'term-date-desc': 'Divine current moonphase',
      'term-uptime-desc': 'Measure eternal duration',
      'term-clear-desc': 'Banish terminal manifestations',
      'term-history-desc': 'Summon ancient memories',
      'term-echo-desc': 'Whisper text into the void',
      'term-tree-desc': 'Reveal structure of shadow branches',
      'term-grep-desc': 'Divine patterns across realms',
      'term-wc-desc': 'Measure the weight of words',
      'term-fortune-desc': 'Receive prophecy from darkness',
      'term-theme-desc': 'Transmute color essence',
      'term-cowsay-desc': 'Summon familiar spirit',
      'term-ll-desc': 'Detailed revelation',
      'term-h-desc': 'Quick summons',

      'term-error-not-found': 'That incantation is unknown to this realm. Invoke \'summon\' for guidance from the shadows',
      'term-error-section-not-found': 'That sanctuary exists not in this plane',
      'term-success-navigated': 'Traversed into',
      'term-help-header': 'Incantations of Power:',
      'term-current-section': 'Current realm:',
      'term-already-home': 'Already dwelling in the sanctum',
      'term-available-sections': 'Available sanctuaries:',
      'term-usage': 'Ritual form:',
      'term-no-history': 'No memories yet recorded in the void',
      'term-no-matches': 'The darkness reveals nothing for:',
      'term-search-results': 'Divinations for',
      'term-welcome': 'Shadow terminal awakens. Invoke \'summon\' for incantations, or Ctrl+` to vanish into darkness.',
      'term-theme-cycled': 'Essence transmuted',
      'term-theme-unavailable': 'Transmutation rituals unavailable',

      'term-nav-label': 'NAVIGATION RITUALS:',
      'term-info-label': 'DIVINATION RITUALS:',
      'term-utils-label': 'UTILITY INCANTATIONS:',
      'term-aliases-label': 'ABBREVIATED RITUALS:',
      'term-shortcuts-label': 'MYSTICAL GESTURES:',

      'term-shortcut-toggle': 'Manifest/banish terminal',
      'term-shortcut-clear': 'Cleanse the void',
      'term-shortcut-cancel': 'Abort the ritual',
      'term-shortcut-blur': 'Release terminal focus',
      'term-shortcut-history': 'Navigate ancient memories',
      'term-shortcut-complete': 'Complete incantations automatically',

      'term-fortune-1': '"Theory without practice withers in shadow. Practice without theory wanders blind through eternal night." - Philosopher of Darkness',
      'term-fortune-2': '"To divine the future, one must weave it from the void." - Oracle of Shadows',
      'term-fortune-3': '"Premature perfection summons corruption from within." - Architect of the Abyss',
      'term-fortune-4': '"Forge function, refine truth, embrace velocity." - Craftsman of Twilight',
      'term-fortune-5': '"Simplicity breeds resilience against the chaos." - Engineer of Eternity',
      'term-fortune-6': '"If your whispers confound, your understanding dwells in shadow." - Scholar of Mysteries',
      'term-fortune-7': '"First divine the enigma. Then inscribe the incantation." - Scribe of Night',
      'term-fortune-8': '"The darkest creations emerge when attention wanders elsewhere." - Artist of Shadows',
      'term-fortune-9': '"Code speaks eternal truth; commentary fades like mortal breath." - Keeper of Records',
      'term-fortune-10': '"True masters inscribe for those who dwell beyond the veil." - Guardian of Knowledge'
    },
    spanish: {
      role: 'INVESTIGADOR INDEPENDIENTE',
      focus: 'BIOLOGÍA COMPUTACIONAL · HDC · TEORÍA',
      available: 'DISPONIBLE',
      'nav-home': 'inicio',
      'nav-papers': 'artículos',
      'nav-about': 'acerca de',
      'nav-contact': 'contacto',
      'nav-skills': 'habilidades',
      'nav-timeline': 'cronología',
      'nav-tools': 'herramientas',
      'hero-subtitle': 'Biología Computacional · Computación Hiperdimensional · Marcos Matemáticos',
      'hero-intro': 'Desarrollo enfoques computacionales novedosos para el descubrimiento biológico mediante métodos no convencionales—computación hiperdimensional, análisis topológico de datos, marcos orientados a restricciones—aplicados a sistemas biológicos. Mi trabajo conecta la experiencia en bioquímica experimental con teoría matemática avanzada para revelar cómo los sistemas biológicos calculan, evolucionan y funcionan.',
      'currently-working': 'TRABAJANDO ACTUALMENTE EN',
      'graph-intro': 'Visualización interactiva de dependencias de proyectos y tecnologías compartidas. Haz clic en los nodos para resaltar conexiones, usa filtros (☰) para explorar dominios. Navegación: desplaza con dos dedos para panoramizar, pellizca para zoom, o usa botones/arrastrar.',
      'footer-status': 'Disponible para programas de doctorado y colaboraciones de investigación',
      'footer-meta': 'Investigación reproducible · Código abierto',
      'about-approach-header': 'EL ENFOQUE',
      'about-approach': 'Traigo marcos computacionales no convencionales a problemas biológicos. Donde la bioinformática tradicional usa métodos estadísticos estándar, aplico computación hiperdimensional para codificación genómica, análisis topológico de datos para espacios de estados celulares, y modelos orientados a restricciones para fenómenos biológicos emergentes. Ya sea codificando secuencias de ADN como hipervectores (GenomeVault), analizando trayectorias de diferenciación de iPSC con TDA (Kimaiya), o modelando computación celular (Biocomputing), desarrollo marcos matemáticos que revelan mecanismos biológicos y generan predicciones experimentalmente comprobables.',
      'about-theory-header': 'DE LA IMPLEMENTACIÓN A LA TEORÍA',
      'about-theory': 'Mi camino ha sido no convencional pero deliberado. Comencé con trabajo técnico práctico—construyendo sistemas, realizando experimentos, viendo dónde la teoría choca contra la realidad. Esto me dio intuición sobre qué problemas importan y qué soluciones escalarán. Ahora me enfoco en desarrollar los marcos subyacentes: estructuras matemáticas que no solo resuelven un problema, sino que revelan principios que se transfieren entre dominios.',
      'about-path-header': 'MI CAMINO',
      'timeline-experimental': 'Investigación en biofísica en McGill y Drexel (dinámica del ADN, administración de fármacos). Aprendí que los sistemas biológicos siguen principios físicos—termodinámica, cinética, procesos estocásticos.',
      'timeline-applied': 'Lideré biomanufactura en Stemcellerant. La terapéutica celular me enseñó sobre estocasticidad, robustez, y la brecha entre teoría e implementación a escala.',
      'timeline-independent': 'Desarrollé marcos orientados a restricciones aplicables en todos los dominios. Construí implementaciones verificadas en seguridad de IA (Behavioral Holography), genómica (GenomeVault), y computación distribuida (FDSC). Cada proyecto demuestra teoría → práctica con resultados reproducibles.',
      'timeline-current': 'Construyendo marcos matemáticos para descubrimiento biológico usando computación hiperdimensional, análisis topológico de datos, y modelado orientado a restricciones (marco COEC). Desarrollando herramientas computacionales que conectan teoría y experimento—desde diferenciación de iPSC (Kimaiya) hasta privacidad genómica (GenomeVault) hasta computación celular (Biocomputing). Aplicando a programas de doctorado en biología computacional/de sistemas para extender esta integración experimental-computacional.',
      'contact-looking-header': '> Buscando:',
      'contact-looking-1': '  ▸ Programas de doctorado en biología computacional / biología de sistemas / biofísica',
      'contact-looking-2': '  ▸ Colaboraciones de investigación sobre enfoques computacionales para el descubrimiento biológico',
      'contact-looking-3': '  ▸ Puestos de científico investigador en empresas o institutos de biología computacional',
      'contact-interests-header': '> Intereses:',
      'contact-interests-1': '  ▸ Computación hiperdimensional para genómica y datos biológicos',
      'contact-interests-2': '  ▸ Análisis topológico de espacios de estados celulares y diferenciación',
      'contact-interests-3': '  ▸ Modelado multiescala de sistemas biológicos (molecular → celular)',
      'contact-interests-4': '  ▸ Aprendizaje automático guiado por teoría para predicción biológica',

      // Terminal-specific translations
      'term-prompt-user': 'usuario@terminal',
      'term-help': 'ayuda',
      'term-cd': 'ir',
      'term-pwd': 'ubicación',
      'term-ls': 'listar',
      'term-whoami': 'quien-soy',
      'term-about': 'acerca-de',
      'term-cat': 'leer',
      'term-date': 'fecha',
      'term-uptime': 'tiempo-activo',
      'term-clear': 'limpiar',
      'term-history': 'historial',
      'term-echo': 'eco',
      'term-tree': 'árbol',
      'term-grep': 'buscar',
      'term-wc': 'contar',
      'term-fortune': 'fortuna',
      'term-theme': 'tema',
      'term-cowsay': 'vaca',
      'term-ll': 'listar -l',
      'term-h': 'ayuda',

      'term-help-desc': 'Mostrar todos los comandos',
      'term-cd-desc': 'Ir a sección (navegar espacio de trabajo)',
      'term-pwd-desc': 'Mostrar ubicación actual',
      'term-ls-desc': 'Mostrar secciones disponibles',
      'term-whoami-desc': 'Mostrar información personal',
      'term-about-desc': 'Ir a sección acerca de',
      'term-cat-desc': 'Leer resumen de sección',
      'term-date-desc': 'Mostrar fecha y hora actual',
      'term-uptime-desc': 'Mostrar tiempo activo desde carga de página',
      'term-clear-desc': 'Limpiar pantalla del terminal',
      'term-history-desc': 'Mostrar historial de comandos',
      'term-echo-desc': 'Repetir texto de vuelta',
      'term-tree-desc': 'Mostrar estructura como diagrama',
      'term-grep-desc': 'Buscar palabra en secciones',
      'term-wc-desc': 'Contar palabras en secciones',
      'term-fortune-desc': 'Mostrar cita de sabiduría',
      'term-theme-desc': 'Cambiar esquema de color',
      'term-cowsay-desc': 'Arte ASCII de vaca que habla',
      'term-ll-desc': 'Alias para listar -l',
      'term-h-desc': 'Alias para ayuda',

      'term-error-not-found': 'Comando no encontrado',
      'term-error-section-not-found': 'Sección no encontrada',
      'term-success-navigated': 'Navegado exitosamente a',
      'term-help-header': 'Comandos Disponibles:',
      'term-current-section': 'Sección actual:',
      'term-already-home': 'Ya estás en inicio',
      'term-available-sections': 'Secciones disponibles:',
      'term-usage': 'Uso:',
      'term-no-history': 'Sin historial registrado',
      'term-no-matches': 'Sin resultados para:',
      'term-search-results': 'Resultados para',
      'term-welcome': 'Terminal listo. Escribe \'ayuda\' para comandos, o Ctrl+` para alternar.',
      'term-theme-cycled': 'Tema cambiado',
      'term-theme-unavailable': 'Control de tema no disponible',

      'term-nav-label': 'COMANDOS DE NAVEGACIÓN:',
      'term-info-label': 'COMANDOS DE INFORMACIÓN:',
      'term-utils-label': 'COMANDOS DE UTILIDAD:',
      'term-aliases-label': 'ATAJOS:',
      'term-shortcuts-label': 'ATAJOS DE TECLADO:',

      'term-shortcut-toggle': 'Alternar visibilidad del terminal',
      'term-shortcut-clear': 'Limpiar pantalla',
      'term-shortcut-cancel': 'Cancelar entrada actual',
      'term-shortcut-blur': 'Salir de entrada del terminal',
      'term-shortcut-history': 'Navegar historial',
      'term-shortcut-complete': 'Autocompletar comandos',

      'term-fortune-1': '"La teoría sin práctica es improductiva. La práctica sin teoría es ciega." - Immanuel Kant',
      'term-fortune-2': '"La mejor manera de predecir el futuro es inventarlo." - Alan Kay',
      'term-fortune-3': '"La optimización prematura es la raíz de todos los males." - Donald Knuth',
      'term-fortune-4': '"Haz que funcione, haz que sea correcto, haz que sea rápido." - Kent Beck',
      'term-fortune-5': '"La simplicidad es un requisito previo para la fiabilidad." - Edsger Dijkstra',
      'term-fortune-6': '"Si no puedes explicarlo de manera simple, no lo entiendes lo suficientemente bien." - Albert Einstein',
      'term-fortune-7': '"Primero, resuelve el problema. Luego, escribe el código." - John Johnson',
      'term-fortune-8': '"Los mejores programas se escriben cuando el programador se supone que está trabajando en otra cosa." - Melinda Varian',
      'term-fortune-9': '"El código nunca miente, los comentarios a veces sí." - Ron Jeffries',
      'term-fortune-10': '"Los buenos programadores escriben código que los humanos pueden entender." - Martin Fowler'
    },
    french: {
      role: 'CHERCHEUR INDÉPENDANT',
      focus: 'BIOLOGIE COMPUTATIONNELLE · HDC · THÉORIE',
      available: 'DISPONIBLE',
      'nav-home': 'accueil',
      'nav-papers': 'articles',
      'nav-about': 'à propos',
      'nav-contact': 'contact',
      'nav-skills': 'compétences',
      'nav-timeline': 'chronologie',
      'nav-tools': 'outils',
      'hero-subtitle': 'Biologie Computationnelle · Calcul Hyperdimensionnel · Cadres Mathématiques',
      'hero-intro': 'Je développe des approches computationnelles novatrices pour la découverte biologique en apportant des méthodes non conventionnelles—calcul hyperdimensionnel, analyse topologique des données, cadres orientés contraintes—aux systèmes biologiques. Mon travail relie l\'expérience en biochimie expérimentale à la théorie mathématique avancée pour révéler comment les systèmes biologiques calculent, évoluent et fonctionnent.',
      'currently-working': 'TRAVAUX EN COURS',
      'graph-intro': 'Visualisation interactive des dépendances de projets et des technologies partagées. Cliquez sur les nœuds pour mettre en évidence les connexions, utilisez les filtres (☰) pour explorer les domaines. Navigation : faites défiler avec deux doigts pour panoramiquer, pincez pour zoomer, ou utilisez les boutons/glisser.',
      'footer-status': 'Disponible pour les programmes doctoraux et les collaborations de recherche',
      'footer-meta': 'Recherche reproductible · Source ouverte',
      'about-approach-header': 'L\'APPROCHE',
      'about-approach': 'J\'apporte des cadres computationnels non conventionnels aux problèmes biologiques. Là où la bioinformatique traditionnelle utilise des méthodes statistiques standard, j\'applique le calcul hyperdimensionnel pour l\'encodage génomique, l\'analyse topologique des données pour les espaces d\'états cellulaires, et des modèles orientés contraintes pour les phénomènes biologiques émergents. Qu\'il s\'agisse d\'encoder des séquences d\'ADN en hypervecteurs (GenomeVault), d\'analyser des trajectoires de différenciation d\'iPSC avec TDA (Kimaiya), ou de modéliser le calcul cellulaire (Biocomputing), je développe des cadres mathématiques qui révèlent les mécanismes biologiques et génèrent des prédictions expérimentalement testables.',
      'about-theory-header': 'DE L\'IMPLÉMENTATION À LA THÉORIE',
      'about-theory': 'Mon parcours a été non conventionnel mais délibéré. J\'ai commencé par un travail technique pratique—construire des systèmes, mener des expériences, voir où la théorie se heurte à la réalité. Cela m\'a donné une intuition pour les problèmes qui comptent et les solutions qui évolueront. Maintenant, je me concentre sur le développement des cadres sous-jacents : des structures mathématiques qui ne résolvent pas seulement un problème, mais révèlent des principes qui se transfèrent entre domaines.',
      'about-path-header': 'MON PARCOURS',
      'timeline-experimental': 'Recherche en biophysique à McGill et Drexel (dynamique de l\'ADN, administration de médicaments). J\'ai appris que les systèmes biologiques suivent des principes physiques—thermodynamique, cinétique, processus stochastiques.',
      'timeline-applied': 'J\'ai dirigé la biofabrication chez Stemcellerant. La thérapeutique cellulaire m\'a enseigné la stochasticité, la robustesse, et l\'écart entre théorie et implémentation à grande échelle.',
      'timeline-independent': 'J\'ai développé des cadres orientés contraintes applicables dans tous les domaines. J\'ai construit des implémentations vérifiées en sécurité IA (Behavioral Holography), génomique (GenomeVault), et calcul distribué (FDSC). Chaque projet démontre théorie → pratique avec des résultats reproductibles.',
      'timeline-current': 'Je construis des cadres mathématiques pour la découverte biologique en utilisant le calcul hyperdimensionnel, l\'analyse topologique des données, et la modélisation orientée contraintes (cadre COEC). Je développe des outils computationnels qui relient théorie et expérience—de la différenciation d\'iPSC (Kimaiya) à la confidentialité génomique (GenomeVault) au calcul cellulaire (Biocomputing). Je postule aux programmes doctoraux en biologie computationnelle/systémique pour étendre cette intégration expérimentale-computationnelle.',
      'contact-looking-header': '> Recherche :',
      'contact-looking-1': '  ▸ Programmes doctoraux en biologie computationnelle / biologie des systèmes / biophysique',
      'contact-looking-2': '  ▸ Collaborations de recherche sur les approches computationnelles de la découverte biologique',
      'contact-looking-3': '  ▸ Postes de chercheur scientifique dans des entreprises ou instituts de biologie computationnelle',
      'contact-interests-header': '> Intérêts :',
      'contact-interests-1': '  ▸ Calcul hyperdimensionnel pour la génomique et les données biologiques',
      'contact-interests-2': '  ▸ Analyse topologique des espaces d\'états cellulaires et de la différenciation',
      'contact-interests-3': '  ▸ Modélisation multi-échelle des systèmes biologiques (moléculaire → cellulaire)',
      'contact-interests-4': '  ▸ Apprentissage automatique guidé par la théorie pour la prédiction biologique',

      // Terminal-specific translations
      'term-prompt-user': 'utilisateur@terminal',
      'term-help': 'aide',
      'term-cd': 'aller',
      'term-pwd': 'emplacement',
      'term-ls': 'lister',
      'term-whoami': 'qui-suis-je',
      'term-about': 'à-propos',
      'term-cat': 'lire',
      'term-date': 'date',
      'term-uptime': 'temps-actif',
      'term-clear': 'effacer',
      'term-history': 'historique',
      'term-echo': 'écho',
      'term-tree': 'arbre',
      'term-grep': 'chercher',
      'term-wc': 'compter',
      'term-fortune': 'fortune',
      'term-theme': 'thème',
      'term-cowsay': 'vache',
      'term-ll': 'lister -l',
      'term-h': 'aide',

      'term-help-desc': 'Afficher toutes les commandes',
      'term-cd-desc': 'Aller à la section (naviguer l\'espace de travail)',
      'term-pwd-desc': 'Afficher l\'emplacement actuel',
      'term-ls-desc': 'Afficher les sections disponibles',
      'term-whoami-desc': 'Afficher les informations personnelles',
      'term-about-desc': 'Aller à la section à propos',
      'term-cat-desc': 'Lire le résumé de la section',
      'term-date-desc': 'Afficher la date et l\'heure actuelles',
      'term-uptime-desc': 'Afficher le temps actif depuis le chargement de la page',
      'term-clear-desc': 'Effacer l\'affichage du terminal',
      'term-history-desc': 'Afficher l\'historique des commandes',
      'term-echo-desc': 'Répéter le texte',
      'term-tree-desc': 'Afficher la structure sous forme de diagramme',
      'term-grep-desc': 'Chercher un mot dans les sections',
      'term-wc-desc': 'Compter les mots dans les sections',
      'term-fortune-desc': 'Afficher une citation de sagesse',
      'term-theme-desc': 'Changer le schéma de couleurs',
      'term-cowsay-desc': 'Art ASCII de vache qui parle',
      'term-ll-desc': 'Alias pour lister -l',
      'term-h-desc': 'Alias pour aide',

      'term-error-not-found': 'Commande non trouvée',
      'term-error-section-not-found': 'Section non trouvée',
      'term-success-navigated': 'Navigation réussie vers',
      'term-help-header': 'Commandes Disponibles :',
      'term-current-section': 'Section actuelle :',
      'term-already-home': 'Déjà à l\'accueil',
      'term-available-sections': 'Sections disponibles :',
      'term-usage': 'Utilisation :',
      'term-no-history': 'Aucun historique enregistré',
      'term-no-matches': 'Aucun résultat pour :',
      'term-search-results': 'Résultats pour',
      'term-welcome': 'Terminal prêt. Tapez \'aide\' pour les commandes, ou Ctrl+` pour basculer.',
      'term-theme-cycled': 'Thème changé',
      'term-theme-unavailable': 'Contrôle du thème non disponible',

      'term-nav-label': 'COMMANDES DE NAVIGATION :',
      'term-info-label': 'COMMANDES D\'INFORMATION :',
      'term-utils-label': 'COMMANDES UTILITAIRES :',
      'term-aliases-label': 'RACCOURCIS :',
      'term-shortcuts-label': 'RACCOURCIS CLAVIER :',

      'term-shortcut-toggle': 'Basculer la visibilité du terminal',
      'term-shortcut-clear': 'Effacer l\'écran',
      'term-shortcut-cancel': 'Annuler l\'entrée actuelle',
      'term-shortcut-blur': 'Quitter l\'entrée du terminal',
      'term-shortcut-history': 'Naviguer dans l\'historique',
      'term-shortcut-complete': 'Autocompléter les commandes',

      'term-fortune-1': '"La théorie sans pratique est improductive. La pratique sans théorie est aveugle." - Immanuel Kant',
      'term-fortune-2': '"La meilleure façon de prédire l\'avenir est de l\'inventer." - Alan Kay',
      'term-fortune-3': '"L\'optimisation prématurée est la racine de tous les maux." - Donald Knuth',
      'term-fortune-4': '"Faites-le fonctionner, faites-le bien, faites-le vite." - Kent Beck',
      'term-fortune-5': '"La simplicité est un prérequis pour la fiabilité." - Edsger Dijkstra',
      'term-fortune-6': '"Si vous ne pouvez pas l\'expliquer simplement, vous ne le comprenez pas assez bien." - Albert Einstein',
      'term-fortune-7': '"D\'abord, résolvez le problème. Ensuite, écrivez le code." - John Johnson',
      'term-fortune-8': '"Les meilleurs programmes sont écrits lorsque le programmeur est censé travailler sur autre chose." - Melinda Varian',
      'term-fortune-9': '"Le code ne ment jamais, les commentaires parfois." - Ron Jeffries',
      'term-fortune-10': '"Les bons programmeurs écrivent du code que les humains peuvent comprendre." - Martin Fowler'
    },
    german: {
      role: 'UNABHÄNGIGER FORSCHER',
      focus: 'COMPUTERBIOLOGIE · HDC · THEORIE',
      available: 'VERFÜGBAR',
      'nav-home': 'start',
      'nav-papers': 'artikel',
      'nav-about': 'über mich',
      'nav-contact': 'kontakt',
      'nav-skills': 'fähigkeiten',
      'nav-timeline': 'zeitleiste',
      'nav-tools': 'werkzeuge',
      'hero-subtitle': 'Computerbiologie · Hyperdimensionales Computing · Mathematische Rahmenwerke',
      'hero-intro': 'Ich entwickle neuartige computergestützte Ansätze für biologische Entdeckungen, indem ich unkonventionelle Methoden—hyperdimensionales Computing, topologische Datenanalyse, beschränkungsorientierte Rahmenwerke—auf biologische Systeme anwende. Meine Arbeit verbindet Erfahrung in experimenteller Biochemie mit fortgeschrittener mathematischer Theorie, um aufzudecken, wie biologische Systeme rechnen, sich entwickeln und funktionieren.',
      'currently-working': 'AKTUELLE PROJEKTE',
      'graph-intro': 'Interaktive Visualisierung von Projektabhängigkeiten und gemeinsamen Technologien. Klicken Sie auf Knoten, um Verbindungen hervorzuheben, verwenden Sie Filter (☰), um Domänen zu erkunden. Navigation: Scrollen Sie mit zwei Fingern zum Schwenken, Kneifen zum Zoomen, oder verwenden Sie Schaltflächen/Ziehen.',
      'footer-status': 'Verfügbar für Promotionsprogramme und Forschungskooperationen',
      'footer-meta': 'Reproduzierbare Forschung · Open Source',
      'about-approach-header': 'DER ANSATZ',
      'about-approach': 'Ich bringe unkonventionelle computergestützte Rahmenwerke zu biologischen Problemen. Während die traditionelle Bioinformatik Standardstatistikmethoden verwendet, wende ich hyperdimensionales Computing für genomische Kodierung, topologische Datenanalyse für zelluläre Zustandsräume und beschränkungsorientierte Modelle für emergente biologische Phänomene an. Ob beim Kodieren von DNA-Sequenzen als Hypervektoren (GenomeVault), Analysieren von iPSC-Differenzierungstrajektorien mit TDA (Kimaiya) oder Modellieren zellulärer Berechnung (Biocomputing), ich entwickle mathematische Rahmenwerke, die biologische Mechanismen offenbaren und experimentell testbare Vorhersagen generieren.',
      'about-theory-header': 'VON DER IMPLEMENTIERUNG ZUR THEORIE',
      'about-theory': 'Mein Weg war unkonventionell, aber bewusst. Ich begann mit praktischer technischer Arbeit—Systeme bauen, Experimente durchführen, sehen, wo Theorie auf Realität trifft. Dies gab mir Intuition dafür, welche Probleme wichtig sind und welche Lösungen skalieren werden. Jetzt konzentriere ich mich auf die Entwicklung der zugrunde liegenden Rahmenwerke: mathematische Strukturen, die nicht nur ein Problem lösen, sondern Prinzipien offenbaren, die sich über Domänen hinweg übertragen.',
      'about-path-header': 'MEIN WEG',
      'timeline-experimental': 'Biophysikforschung an McGill und Drexel (DNA-Dynamik, Medikamentenverabreichung). Ich lernte, dass biologische Systeme physikalischen Prinzipien folgen—Thermodynamik, Kinetik, stochastische Prozesse.',
      'timeline-applied': 'Leitete Biofertigung bei Stemcellerant. Zelluläre Therapeutika lehrten mich über Stochastizität, Robustheit und die Lücke zwischen Theorie und Implementierung im großen Maßstab.',
      'timeline-independent': 'Entwickelte beschränkungsorientierte Rahmenwerke, die über Domänen hinweg anwendbar sind. Baute verifizierte Implementierungen in KI-Sicherheit (Behavioral Holography), Genomik (GenomeVault) und verteiltem Computing (FDSC). Jedes Projekt demonstriert Theorie → Praxis mit reproduzierbaren Ergebnissen.',
      'timeline-current': 'Baue mathematische Rahmenwerke für biologische Entdeckungen mittels hyperdimensionalem Computing, topologischer Datenanalyse und beschränkungsorientierter Modellierung (COEC-Rahmenwerk). Entwickle computergestützte Werkzeuge, die Theorie und Experiment verbinden—von iPSC-Differenzierung (Kimaiya) über genomische Privatsphäre (GenomeVault) bis hin zu zellulärer Berechnung (Biocomputing). Bewerbe mich auf Promotionsprogramme in Computer-/Systembiologie, um diese experimentell-computergestützte Integration zu erweitern.',
      'contact-looking-header': '> Suche nach:',
      'contact-looking-1': '  ▸ Promotionsprogrammen in Computerbiologie / Systembiologie / Biophysik',
      'contact-looking-2': '  ▸ Forschungskooperationen zu computergestützten Ansätzen für biologische Entdeckungen',
      'contact-looking-3': '  ▸ Forschungswissenschaftlerstellen bei Computerbiologie-Unternehmen oder Instituten',
      'contact-interests-header': '> Interessen:',
      'contact-interests-1': '  ▸ Hyperdimensionales Computing für Genomik und biologische Daten',
      'contact-interests-2': '  ▸ Topologische Analyse zellulärer Zustandsräume und Differenzierung',
      'contact-interests-3': '  ▸ Multiskalenmodellierung biologischer Systeme (molekular → zellulär)',
      'contact-interests-4': '  ▸ Theoriegeleitetes maschinelles Lernen für biologische Vorhersage',

      // Terminal-specific translations
      'term-prompt-user': 'benutzer@terminal',
      'term-help': 'hilfe',
      'term-cd': 'gehe',
      'term-pwd': 'standort',
      'term-ls': 'liste',
      'term-whoami': 'wer-bin-ich',
      'term-about': 'über-mich',
      'term-cat': 'lesen',
      'term-date': 'datum',
      'term-uptime': 'laufzeit',
      'term-clear': 'löschen',
      'term-history': 'verlauf',
      'term-echo': 'echo',
      'term-tree': 'baum',
      'term-grep': 'suchen',
      'term-wc': 'zählen',
      'term-fortune': 'weisheit',
      'term-theme': 'thema',
      'term-cowsay': 'kuh',
      'term-ll': 'liste -l',
      'term-h': 'hilfe',

      'term-help-desc': 'Alle Befehle anzeigen',
      'term-cd-desc': 'Zu Abschnitt gehen (Arbeitsbereich navigieren)',
      'term-pwd-desc': 'Aktuellen Standort anzeigen',
      'term-ls-desc': 'Verfügbare Abschnitte anzeigen',
      'term-whoami-desc': 'Persönliche Informationen anzeigen',
      'term-about-desc': 'Zum Über-mich-Abschnitt gehen',
      'term-cat-desc': 'Abschnittszusammenfassung lesen',
      'term-date-desc': 'Aktuelles Datum und Uhrzeit anzeigen',
      'term-uptime-desc': 'Laufzeit seit Seitenladevorgang anzeigen',
      'term-clear-desc': 'Terminalanzeige löschen',
      'term-history-desc': 'Befehlsverlauf anzeigen',
      'term-echo-desc': 'Text zurückgeben',
      'term-tree-desc': 'Struktur als Diagramm anzeigen',
      'term-grep-desc': 'Wort in Abschnitten suchen',
      'term-wc-desc': 'Wörter in Abschnitten zählen',
      'term-fortune-desc': 'Weisheitszitat anzeigen',
      'term-theme-desc': 'Farbschema ändern',
      'term-cowsay-desc': 'ASCII-Kuh-Sprechkunst',
      'term-ll-desc': 'Alias für liste -l',
      'term-h-desc': 'Alias für hilfe',

      'term-error-not-found': 'Befehl nicht gefunden',
      'term-error-section-not-found': 'Abschnitt nicht gefunden',
      'term-success-navigated': 'Erfolgreich navigiert zu',
      'term-help-header': 'Verfügbare Befehle:',
      'term-current-section': 'Aktueller Abschnitt:',
      'term-already-home': 'Bereits auf der Startseite',
      'term-available-sections': 'Verfügbare Abschnitte:',
      'term-usage': 'Verwendung:',
      'term-no-history': 'Kein Verlauf aufgezeichnet',
      'term-no-matches': 'Keine Ergebnisse für:',
      'term-search-results': 'Ergebnisse für',
      'term-welcome': 'Terminal bereit. Geben Sie \'hilfe\' für Befehle ein, oder Strg+` zum Umschalten.',
      'term-theme-cycled': 'Thema geändert',
      'term-theme-unavailable': 'Themenkontrolle nicht verfügbar',

      'term-nav-label': 'NAVIGATIONSBEFEHLE:',
      'term-info-label': 'INFORMATIONSBEFEHLE:',
      'term-utils-label': 'DIENSTPROGRAMMBEFEHLE:',
      'term-aliases-label': 'ABKÜRZUNGEN:',
      'term-shortcuts-label': 'TASTATURKÜRZEL:',

      'term-shortcut-toggle': 'Terminal-Sichtbarkeit umschalten',
      'term-shortcut-clear': 'Bildschirm löschen',
      'term-shortcut-cancel': 'Aktuelle Eingabe abbrechen',
      'term-shortcut-blur': 'Terminaleingabe verlassen',
      'term-shortcut-history': 'Verlauf navigieren',
      'term-shortcut-complete': 'Befehle automatisch vervollständigen',

      'term-fortune-1': '"Theorie ohne Praxis ist unproduktiv. Praxis ohne Theorie ist blind." - Immanuel Kant',
      'term-fortune-2': '"Der beste Weg, die Zukunft vorherzusagen, ist, sie zu erfinden." - Alan Kay',
      'term-fortune-3': '"Vorzeitige Optimierung ist die Wurzel allen Übels." - Donald Knuth',
      'term-fortune-4': '"Bring es zum Laufen, mach es richtig, mach es schnell." - Kent Beck',
      'term-fortune-5': '"Einfachheit ist Voraussetzung für Zuverlässigkeit." - Edsger Dijkstra',
      'term-fortune-6': '"Wenn du es nicht einfach erklären kannst, verstehst du es nicht gut genug." - Albert Einstein',
      'term-fortune-7': '"Zuerst löse das Problem. Dann schreibe den Code." - John Johnson',
      'term-fortune-8': '"Die besten Programme werden geschrieben, wenn der Programmierer eigentlich an etwas anderem arbeiten sollte." - Melinda Varian',
      'term-fortune-9': '"Code lügt nie, Kommentare manchmal schon." - Ron Jeffries',
      'term-fortune-10': '"Gute Programmierer schreiben Code, den Menschen verstehen können." - Martin Fowler'
    },
    portuguese: {
      role: 'PESQUISADOR INDEPENDENTE',
      focus: 'BIOLOGIA COMPUTACIONAL · HDC · TEORIA',
      available: 'DISPONÍVEL',
      'nav-home': 'início',
      'nav-papers': 'artigos',
      'nav-about': 'sobre',
      'nav-contact': 'contato',
      'nav-skills': 'habilidades',
      'nav-timeline': 'cronologia',
      'nav-tools': 'ferramentas',
      'hero-subtitle': 'Biologia Computacional · Computação Hiperdimensional · Estruturas Matemáticas',
      'hero-intro': 'Desenvolvo abordagens computacionais inovadoras para descoberta biológica trazendo métodos não convencionais—computação hiperdimensional, análise topológica de dados, estruturas orientadas a restrições—para sistemas biológicos. Meu trabalho conecta experiência em bioquímica experimental com teoria matemática avançada para revelar como sistemas biológicos computam, evoluem e funcionam.',
      'currently-working': 'TRABALHANDO ATUALMENTE EM',
      'graph-intro': 'Visualização interativa de dependências de projetos e tecnologias compartilhadas. Clique nos nós para destacar conexões, use filtros (☰) para explorar domínios. Navegação: role com dois dedos para panorâmica, belisque para zoom, ou use botões/arrastar.',
      'footer-status': 'Disponível para programas de doutorado e colaborações de pesquisa',
      'footer-meta': 'Pesquisa reproduzível · Código aberto',
      'about-approach-header': 'A ABORDAGEM',
      'about-approach': 'Trago estruturas computacionais não convencionais para problemas biológicos. Onde a bioinformática tradicional usa métodos estatísticos padrão, aplico computação hiperdimensional para codificação genômica, análise topológica de dados para espaços de estados celulares, e modelos orientados a restrições para fenômenos biológicos emergentes. Seja codificando sequências de DNA como hipervetores (GenomeVault), analisando trajetórias de diferenciação de iPSC com TDA (Kimaiya), ou modelando computação celular (Biocomputing), desenvolvo estruturas matemáticas que revelam mecanismos biológicos e geram predições experimentalmente testáveis.',
      'about-theory-header': 'DA IMPLEMENTAÇÃO À TEORIA',
      'about-theory': 'Meu caminho foi não convencional, mas deliberado. Comecei com trabalho técnico prático—construindo sistemas, realizando experimentos, vendo onde a teoria se choca com a realidade. Isso me deu intuição sobre quais problemas importam e quais soluções escalarão. Agora me concentro em desenvolver as estruturas subjacentes: estruturas matemáticas que não apenas resolvem um problema, mas revelam princípios que se transferem entre domínios.',
      'about-path-header': 'MEU CAMINHO',
      'timeline-experimental': 'Pesquisa em biofísica na McGill e Drexel (dinâmica do DNA, administração de medicamentos). Aprendi que sistemas biológicos seguem princípios físicos—termodinâmica, cinética, processos estocásticos.',
      'timeline-applied': 'Liderei biomanufatura na Stemcellerant. Terapêutica celular me ensinou sobre estocasticidade, robustez e a lacuna entre teoria e implementação em escala.',
      'timeline-independent': 'Desenvolvi estruturas orientadas a restrições aplicáveis em todos os domínios. Construí implementações verificadas em segurança de IA (Behavioral Holography), genômica (GenomeVault) e computação distribuída (FDSC). Cada projeto demonstra teoria → prática com resultados reproduzíveis.',
      'timeline-current': 'Construindo estruturas matemáticas para descoberta biológica usando computação hiperdimensional, análise topológica de dados e modelagem orientada a restrições (estrutura COEC). Desenvolvendo ferramentas computacionais que conectam teoria e experimento—desde diferenciação de iPSC (Kimaiya) até privacidade genômica (GenomeVault) até computação celular (Biocomputing). Aplicando para programas de doutorado em biologia computacional/de sistemas para estender esta integração experimental-computacional.',
      'contact-looking-header': '> Procurando por:',
      'contact-looking-1': '  ▸ Programas de doutorado em biologia computacional / biologia de sistemas / biofísica',
      'contact-looking-2': '  ▸ Colaborações de pesquisa sobre abordagens computacionais para descoberta biológica',
      'contact-looking-3': '  ▸ Cargos de cientista pesquisador em empresas ou institutos de biologia computacional',
      'contact-interests-header': '> Interesses:',
      'contact-interests-1': '  ▸ Computação hiperdimensional para genômica e dados biológicos',
      'contact-interests-2': '  ▸ Análise topológica de espaços de estados celulares e diferenciação',
      'contact-interests-3': '  ▸ Modelagem multiescala de sistemas biológicos (molecular → celular)',
      'contact-interests-4': '  ▸ Aprendizado de máquina guiado por teoria para predição biológica',

      // Terminal-specific translations
      'term-prompt-user': 'usuario@terminal',
      'term-help': 'ajuda',
      'term-cd': 'ir',
      'term-pwd': 'localização',
      'term-ls': 'listar',
      'term-whoami': 'quem-sou',
      'term-about': 'sobre',
      'term-cat': 'ler',
      'term-date': 'data',
      'term-uptime': 'tempo-ativo',
      'term-clear': 'limpar',
      'term-history': 'histórico',
      'term-echo': 'eco',
      'term-tree': 'árvore',
      'term-grep': 'buscar',
      'term-wc': 'contar',
      'term-fortune': 'fortuna',
      'term-theme': 'tema',
      'term-cowsay': 'vaca',
      'term-ll': 'listar -l',
      'term-h': 'ajuda',

      'term-help-desc': 'Mostrar todos os comandos',
      'term-cd-desc': 'Ir para seção (navegar espaço de trabalho)',
      'term-pwd-desc': 'Mostrar localização atual',
      'term-ls-desc': 'Mostrar seções disponíveis',
      'term-whoami-desc': 'Mostrar informações pessoais',
      'term-about-desc': 'Ir para seção sobre',
      'term-cat-desc': 'Ler resumo da seção',
      'term-date-desc': 'Mostrar data e hora atuais',
      'term-uptime-desc': 'Mostrar tempo ativo desde carregamento da página',
      'term-clear-desc': 'Limpar exibição do terminal',
      'term-history-desc': 'Mostrar histórico de comandos',
      'term-echo-desc': 'Repetir texto de volta',
      'term-tree-desc': 'Mostrar estrutura como diagrama',
      'term-grep-desc': 'Buscar palavra nas seções',
      'term-wc-desc': 'Contar palavras nas seções',
      'term-fortune-desc': 'Mostrar citação de sabedoria',
      'term-theme-desc': 'Mudar esquema de cores',
      'term-cowsay-desc': 'Arte ASCII de vaca falante',
      'term-ll-desc': 'Atalho para listar -l',
      'term-h-desc': 'Atalho para ajuda',

      'term-error-not-found': 'Comando não encontrado',
      'term-error-section-not-found': 'Seção não encontrada',
      'term-success-navigated': 'Navegado com sucesso para',
      'term-help-header': 'Comandos Disponíveis:',
      'term-current-section': 'Seção atual:',
      'term-already-home': 'Já está no início',
      'term-available-sections': 'Seções disponíveis:',
      'term-usage': 'Uso:',
      'term-no-history': 'Nenhum histórico registrado',
      'term-no-matches': 'Nenhum resultado para:',
      'term-search-results': 'Resultados para',
      'term-welcome': 'Terminal pronto. Digite \'ajuda\' para comandos, ou Ctrl+` para alternar.',
      'term-theme-cycled': 'Tema alterado',
      'term-theme-unavailable': 'Controle de tema não disponível',

      'term-nav-label': 'COMANDOS DE NAVEGAÇÃO:',
      'term-info-label': 'COMANDOS DE INFORMAÇÃO:',
      'term-utils-label': 'COMANDOS UTILITÁRIOS:',
      'term-aliases-label': 'ATALHOS:',
      'term-shortcuts-label': 'ATALHOS DE TECLADO:',

      'term-shortcut-toggle': 'Alternar visibilidade do terminal',
      'term-shortcut-clear': 'Limpar tela',
      'term-shortcut-cancel': 'Cancelar entrada atual',
      'term-shortcut-blur': 'Sair da entrada do terminal',
      'term-shortcut-history': 'Navegar histórico',
      'term-shortcut-complete': 'Autocompletar comandos',

      'term-fortune-1': '"A teoria sem prática é improdutiva. A prática sem teoria é cega." - Immanuel Kant',
      'term-fortune-2': '"A melhor maneira de prever o futuro é inventá-lo." - Alan Kay',
      'term-fortune-3': '"A otimização prematura é a raiz de todos os males." - Donald Knuth',
      'term-fortune-4': '"Faça funcionar, faça certo, faça rápido." - Kent Beck',
      'term-fortune-5': '"A simplicidade é um pré-requisito para a confiabilidade." - Edsger Dijkstra',
      'term-fortune-6': '"Se você não pode explicar de forma simples, não entende bem o suficiente." - Albert Einstein',
      'term-fortune-7': '"Primeiro, resolva o problema. Depois, escreva o código." - John Johnson',
      'term-fortune-8': '"Os melhores programas são escritos quando o programador deveria estar trabalhando em outra coisa." - Melinda Varian',
      'term-fortune-9': '"O código nunca mente, os comentários às vezes sim." - Ron Jeffries',
      'term-fortune-10': '"Bons programadores escrevem código que humanos podem entender." - Martin Fowler'
    },
    italian: {
      role: 'RICERCATORE INDIPENDENTE',
      focus: 'BIOLOGIA COMPUTAZIONALE · HDC · TEORIA',
      available: 'DISPONIBILE',
      'nav-home': 'home',
      'nav-papers': 'articoli',
      'nav-about': 'su di me',
      'nav-contact': 'contatto',
      'nav-skills': 'competenze',
      'nav-timeline': 'cronologia',
      'nav-tools': 'strumenti',
      'hero-subtitle': 'Biologia Computazionale · Calcolo Iperdimensionale · Strutture Matematiche',
      'hero-intro': 'Sviluppo approcci computazionali innovativi per la scoperta biologica portando metodi non convenzionali—calcolo iperdimensionale, analisi topologica dei dati, strutture orientate ai vincoli—ai sistemi biologici. Il mio lavoro collega l\'esperienza in biochimica sperimentale con la teoria matematica avanzata per rivelare come i sistemi biologici calcolano, evolvono e funzionano.',
      'currently-working': 'PROGETTI IN CORSO',
      'graph-intro': 'Visualizzazione interattiva delle dipendenze dei progetti e delle tecnologie condivise. Clicca sui nodi per evidenziare le connessioni, usa i filtri (☰) per esplorare i domini. Navigazione: scorri con due dita per panoramica, pizzica per zoom, o usa pulsanti/trascinamento.',
      'footer-status': 'Disponibile per programmi di dottorato e collaborazioni di ricerca',
      'footer-meta': 'Ricerca riproducibile · Open source',
      'about-approach-header': 'L\'APPROCCIO',
      'about-approach': 'Porto strutture computazionali non convenzionali ai problemi biologici. Dove la bioinformatica tradizionale usa metodi statistici standard, applico il calcolo iperdimensionale per la codifica genomica, l\'analisi topologica dei dati per gli spazi di stato cellulari, e modelli orientati ai vincoli per i fenomeni biologici emergenti. Che si tratti di codificare sequenze di DNA come ipervettori (GenomeVault), analizzare traiettorie di differenziazione di iPSC con TDA (Kimaiya), o modellare il calcolo cellulare (Biocomputing), sviluppo strutture matematiche che rivelano meccanismi biologici e generano previsioni sperimentalmente verificabili.',
      'about-theory-header': 'DALL\'IMPLEMENTAZIONE ALLA TEORIA',
      'about-theory': 'Il mio percorso è stato non convenzionale ma deliberato. Ho iniziato con lavoro tecnico pratico—costruire sistemi, condurre esperimenti, vedere dove la teoria si scontra con la realtà. Questo mi ha dato intuizione su quali problemi contano e quali soluzioni scaleranno. Ora mi concentro sullo sviluppo delle strutture sottostanti: strutture matematiche che non risolvono solo un problema, ma rivelano principi che si trasferiscono tra domini.',
      'about-path-header': 'IL MIO PERCORSO',
      'timeline-experimental': 'Ricerca in biofisica a McGill e Drexel (dinamica del DNA, somministrazione di farmaci). Ho imparato che i sistemi biologici seguono principi fisici—termodinamica, cinetica, processi stocastici.',
      'timeline-applied': 'Ho guidato la bioproduzione a Stemcellerant. La terapeutica cellulare mi ha insegnato sulla stocasticità, robustezza, e il divario tra teoria e implementazione su larga scala.',
      'timeline-independent': 'Ho sviluppato strutture orientate ai vincoli applicabili in tutti i domini. Ho costruito implementazioni verificate nella sicurezza dell\'IA (Behavioral Holography), genomica (GenomeVault), e calcolo distribuito (FDSC). Ogni progetto dimostra teoria → pratica con risultati riproducibili.',
      'timeline-current': 'Costruisco strutture matematiche per la scoperta biologica usando calcolo iperdimensionale, analisi topologica dei dati, e modellazione orientata ai vincoli (struttura COEC). Sviluppo strumenti computazionali che collegano teoria ed esperimento—dalla differenziazione di iPSC (Kimaiya) alla privacy genomica (GenomeVault) al calcolo cellulare (Biocomputing). Candidandomi a programmi di dottorato in biologia computazionale/sistemica per estendere questa integrazione sperimentale-computazionale.',
      'contact-looking-header': '> Cerco:',
      'contact-looking-1': '  ▸ Programmi di dottorato in biologia computazionale / biologia dei sistemi / biofisica',
      'contact-looking-2': '  ▸ Collaborazioni di ricerca su approcci computazionali alla scoperta biologica',
      'contact-looking-3': '  ▸ Posizioni di ricercatore scientifico presso aziende o istituti di biologia computazionale',
      'contact-interests-header': '> Interessi:',
      'contact-interests-1': '  ▸ Calcolo iperdimensionale per genomica e dati biologici',
      'contact-interests-2': '  ▸ Analisi topologica degli spazi di stato cellulari e differenziazione',
      'contact-interests-3': '  ▸ Modellazione multiscala di sistemi biologici (molecolare → cellulare)',
      'contact-interests-4': '  ▸ Apprendimento automatico guidato dalla teoria per previsione biologica',

      // Terminal-specific translations
      'term-prompt-user': 'utente@terminal',
      'term-help': 'aiuto',
      'term-cd': 'vai',
      'term-pwd': 'posizione',
      'term-ls': 'elenca',
      'term-whoami': 'chi-sono',
      'term-about': 'su-di-me',
      'term-cat': 'leggi',
      'term-date': 'data',
      'term-uptime': 'tempo-attivo',
      'term-clear': 'pulisci',
      'term-history': 'cronologia',
      'term-echo': 'eco',
      'term-tree': 'albero',
      'term-grep': 'cerca',
      'term-wc': 'conta',
      'term-fortune': 'fortuna',
      'term-theme': 'tema',
      'term-cowsay': 'mucca',
      'term-ll': 'elenca -l',
      'term-h': 'aiuto',

      'term-help-desc': 'Mostra tutti i comandi',
      'term-cd-desc': 'Vai alla sezione (naviga lo spazio di lavoro)',
      'term-pwd-desc': 'Mostra posizione corrente',
      'term-ls-desc': 'Mostra sezioni disponibili',
      'term-whoami-desc': 'Mostra informazioni personali',
      'term-about-desc': 'Vai alla sezione su di me',
      'term-cat-desc': 'Leggi riepilogo della sezione',
      'term-date-desc': 'Mostra data e ora correnti',
      'term-uptime-desc': 'Mostra tempo attivo dal caricamento della pagina',
      'term-clear-desc': 'Pulisci visualizzazione del terminal',
      'term-history-desc': 'Mostra cronologia dei comandi',
      'term-echo-desc': 'Ripeti il testo',
      'term-tree-desc': 'Mostra struttura come diagramma',
      'term-grep-desc': 'Cerca parola nelle sezioni',
      'term-wc-desc': 'Conta parole nelle sezioni',
      'term-fortune-desc': 'Mostra citazione di saggezza',
      'term-theme-desc': 'Cambia schema di colori',
      'term-cowsay-desc': 'Arte ASCII di mucca parlante',
      'term-ll-desc': 'Alias per elenca -l',
      'term-h-desc': 'Alias per aiuto',

      'term-error-not-found': 'Comando non trovato',
      'term-error-section-not-found': 'Sezione non trovata',
      'term-success-navigated': 'Navigato con successo a',
      'term-help-header': 'Comandi Disponibili:',
      'term-current-section': 'Sezione corrente:',
      'term-already-home': 'Già nella home',
      'term-available-sections': 'Sezioni disponibili:',
      'term-usage': 'Uso:',
      'term-no-history': 'Nessuna cronologia registrata',
      'term-no-matches': 'Nessun risultato per:',
      'term-search-results': 'Risultati per',
      'term-welcome': 'Terminal pronto. Digita \'aiuto\' per i comandi, o Ctrl+` per alternare.',
      'term-theme-cycled': 'Tema cambiato',
      'term-theme-unavailable': 'Controllo tema non disponibile',

      'term-nav-label': 'COMANDI DI NAVIGAZIONE:',
      'term-info-label': 'COMANDI DI INFORMAZIONE:',
      'term-utils-label': 'COMANDI UTILITÀ:',
      'term-aliases-label': 'SCORCIATOIE:',
      'term-shortcuts-label': 'SCORCIATOIE DA TASTIERA:',

      'term-shortcut-toggle': 'Alterna visibilità terminal',
      'term-shortcut-clear': 'Pulisci schermo',
      'term-shortcut-cancel': 'Annulla input corrente',
      'term-shortcut-blur': 'Esci dall\'input del terminal',
      'term-shortcut-history': 'Naviga cronologia',
      'term-shortcut-complete': 'Autocompletamento comandi',

      'term-fortune-1': '"La teoria senza pratica è improduttiva. La pratica senza teoria è cieca." - Immanuel Kant',
      'term-fortune-2': '"Il modo migliore per prevedere il futuro è inventarlo." - Alan Kay',
      'term-fortune-3': '"L\'ottimizzazione prematura è la radice di tutti i mali." - Donald Knuth',
      'term-fortune-4': '"Fallo funzionare, fallo bene, fallo veloce." - Kent Beck',
      'term-fortune-5': '"La semplicità è un prerequisito per l\'affidabilità." - Edsger Dijkstra',
      'term-fortune-6': '"Se non puoi spiegarlo in modo semplice, non lo capisci abbastanza bene." - Albert Einstein',
      'term-fortune-7': '"Prima risolvi il problema. Poi scrivi il codice." - John Johnson',
      'term-fortune-8': '"I migliori programmi sono scritti quando il programmatore dovrebbe lavorare su qualcos\'altro." - Melinda Varian',
      'term-fortune-9': '"Il codice non mente mai, i commenti a volte sì." - Ron Jeffries',
      'term-fortune-10': '"I bravi programmatori scrivono codice che gli esseri umani possono capire." - Martin Fowler'
    }
  };

  // ============================================
  // SETTINGS STATE
  // ============================================
  let settings = {
    volume: 80,
    accent: 'cyan', // Default to cyan (blue/teal) to match HTML
    background: 'black',
    language: 'standard',
    funMode: false,  // Easter eggs off by default for professional presentation
    themeMode: 'terminal'  // 'terminal' (dark) or 'clinical' (light)
  };

  // ============================================
  // LOAD SETTINGS FROM LOCALSTORAGE
  // ============================================
  function loadSettings() {
    const saved = localStorage.getItem('dashboard-settings');
    if (saved) {
      try {
        settings = { ...settings, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
    applySettings();
  }

  // ============================================
  // SAVE SETTINGS TO LOCALSTORAGE
  // ============================================
  function saveSettings() {
    localStorage.setItem('dashboard-settings', JSON.stringify(settings));
  }

  // ============================================
  // APPLY SETTINGS
  // ============================================
  function applySettings() {
    const root = document.documentElement;

    // Apply theme mode (terminal/clinical)
    if (settings.themeMode === 'clinical') {
      root.setAttribute('data-theme', 'clinical');
    } else {
      root.removeAttribute('data-theme');
    }

    // Apply accent color (only in terminal mode)
    if (settings.themeMode !== 'clinical') {
      const accentColors = {
        green: '#00ff00',
        amber: '#ffb000',
        cyan: '#00ffff'
      };
      root.style.setProperty('--accent', accentColors[settings.accent] || accentColors.green);

      // Apply background color
      const bgColors = {
        black: '#0a0a0a',
        gray: '#1a1a1a',
        navy: '#0a0a1a'
      };
      root.style.setProperty('--bg-primary', bgColors[settings.background] || bgColors.black);
    } else {
      // Clinical mode uses its own colors from CSS
      root.style.removeProperty('--accent');
      root.style.removeProperty('--bg-primary');
    }

    // Apply translations
    applyTranslations();

    // Update UI controls
    updateSettingsUI();
  }

  // ============================================
  // APPLY TRANSLATIONS
  // ============================================
  function applyTranslations() {
    const lang = settings.language;
    const t = translations[lang] || translations.standard;

    // Update all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(el => {
      const key = el.getAttribute('data-translate');
      if (t[key]) {
        el.textContent = t[key];
      }
    });
  }

  // ============================================
  // UPDATE SETTINGS UI
  // ============================================
  function updateSettingsUI() {
    // Theme mode radio buttons
    const themeModeRadios = document.querySelectorAll('input[name="theme-mode"]');
    themeModeRadios.forEach(radio => {
      radio.checked = radio.value === settings.themeMode;
    });

    // Volume slider
    const volumeSlider = document.getElementById('volume-slider');
    const volumeValue = document.getElementById('volume-value');
    if (volumeSlider && volumeValue) {
      volumeSlider.value = settings.volume;
      volumeValue.textContent = settings.volume + '%';
    }

    // Accent color radio buttons
    const accentRadios = document.querySelectorAll('input[name="accent"]');
    accentRadios.forEach(radio => {
      radio.checked = radio.value === settings.accent;
    });

    // Background color radio buttons
    const bgRadios = document.querySelectorAll('input[name="background"]');
    bgRadios.forEach(radio => {
      radio.checked = radio.value === settings.background;
    });

    // Language select
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
      languageSelect.value = settings.language;
    }

    // Update theme button in control bar
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
      themeBtn.classList.toggle('active', settings.accent !== 'green');
    }
  }

  // ============================================
  // CLOCK UPDATER
  // ============================================
  function updateClock() {
    const now = new Date();
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds} UTC`;

    const clockEl = document.getElementById('clock');
    if (clockEl) {
      clockEl.textContent = timeString;
    }
  }

  // ============================================
  // YEAR UPDATER
  // ============================================
  function updateYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  // ============================================
  // DEPLOY TIME UPDATER
  // ============================================
  async function updateDeployTime() {
    const deployEl = document.getElementById('deploy-time');
    if (!deployEl) return;

    try {
      // Fetch latest commit from GitHub API
      const response = await fetch('https://api.github.com/repos/rohanvinaik/rohan-vinaik.github.io/commits/main');
      const data = await response.json();

      if (data.commit && data.commit.committer && data.commit.committer.date) {
        const commitDate = new Date(data.commit.committer.date);

        // Convert to Boston time (America/New_York timezone)
        const bostonTimeString = commitDate.toLocaleString('en-US', {
          timeZone: 'America/New_York',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });

        // Format as YYYY-MM-DD HH:MM EST/EDT
        const [datePart, timePart] = bostonTimeString.split(', ');
        const [month, day, year] = datePart.split('/');
        const formattedDate = `${year}-${month}-${day}`;

        // Determine if EST or EDT
        const isDST = isDaylightSavingTime(commitDate);
        const timezone = isDST ? 'EDT' : 'EST';

        deployEl.textContent = `${formattedDate} ${timePart} ${timezone}`;
      } else {
        // Fallback to current date if API fails
        const now = new Date();
        const dateString = now.toISOString().split('T')[0];
        deployEl.textContent = dateString;
      }
    } catch (error) {
      console.error('Failed to fetch deploy time:', error);
      // Fallback to current date
      const now = new Date();
      const dateString = now.toISOString().split('T')[0];
      deployEl.textContent = dateString;
    }
  }

  // ============================================
  // CHECK IF DAYLIGHT SAVING TIME
  // ============================================
  function isDaylightSavingTime(date) {
    const year = date.getFullYear();
    // DST starts on second Sunday in March
    const marchSecondSunday = new Date(year, 2, 1); // March 1
    marchSecondSunday.setDate(1 + (7 - marchSecondSunday.getDay()) % 7 + 7); // Second Sunday

    // DST ends on first Sunday in November
    const novemberFirstSunday = new Date(year, 10, 1); // November 1
    novemberFirstSunday.setDate(1 + (7 - novemberFirstSunday.getDay()) % 7); // First Sunday

    return date >= marchSecondSunday && date < novemberFirstSunday;
  }

  // ============================================
  // SETTINGS MODAL
  // ============================================
  function initSettingsModal() {
    const overlay = document.getElementById('settings-overlay');
    const openBtn = document.getElementById('settings-btn');
    const closeHeaderBtn = document.querySelector('.settings-close');
    const closeFooterBtn = document.getElementById('close-btn');
    const applyBtn = document.getElementById('apply-btn');
    const resetBtn = document.getElementById('reset-btn');

    if (!overlay || !openBtn) return;

    // Open modal
    openBtn.addEventListener('click', () => {
      overlay.classList.add('active');
      updateSettingsUI();
    });

    // Close modal (header X button)
    if (closeHeaderBtn) {
      closeHeaderBtn.addEventListener('click', () => {
        saveSettings();
        overlay.classList.remove('active');
      });
    }

    // Close modal (footer CLOSE button)
    if (closeFooterBtn) {
      closeFooterBtn.addEventListener('click', () => {
        saveSettings();
        overlay.classList.remove('active');
      });
    }

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        overlay.classList.remove('active');
      }
    });

    // Theme mode radio buttons
    const themeModeRadios = document.querySelectorAll('input[name="theme-mode"]');
    themeModeRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {
          settings.themeMode = e.target.value;
          applySettings();
          saveSettings();
        }
      });
    });

    // Volume slider
    const volumeSlider = document.getElementById('volume-slider');
    const volumeValue = document.getElementById('volume-value');
    if (volumeSlider && volumeValue) {
      volumeSlider.addEventListener('input', (e) => {
        settings.volume = parseInt(e.target.value);
        volumeValue.textContent = settings.volume + '%';
      });
    }

    // Accent color radio buttons
    const accentRadios = document.querySelectorAll('input[name="accent"]');
    accentRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {
          settings.accent = e.target.value;
          applySettings();
        }
      });
    });

    // Background color radio buttons
    const bgRadios = document.querySelectorAll('input[name="background"]');
    bgRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {
          settings.background = e.target.value;
          applySettings();
        }
      });
    });

    // Language select
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
      languageSelect.addEventListener('change', (e) => {
        settings.language = e.target.value;
        applySettings();
      });
    }

    // Fun Mode toggle
    const funModeToggle = document.getElementById('enable-fun-mode');
    const funStuffOptions = document.getElementById('fun-stuff-options');
    if (funModeToggle) {
      // Initialize state from settings
      funModeToggle.checked = settings.funMode || false;
      if (funStuffOptions) {
        funStuffOptions.style.display = settings.funMode ? 'block' : 'none';
        funStuffOptions.style.opacity = settings.funMode ? '1' : '0.5';
      }

      funModeToggle.addEventListener('change', (e) => {
        settings.funMode = e.target.checked;
        if (funStuffOptions) {
          funStuffOptions.style.display = e.target.checked ? 'block' : 'none';
          funStuffOptions.style.opacity = e.target.checked ? '1' : '0.5';
        }

        // If turning off fun mode, disable all easter eggs
        if (!e.target.checked) {
          // Dispatch events to disable easter eggs
          if (window.disableDog) window.disableDog();
          if (window.disableMatrix) window.disableMatrix();
          if (window.disableTrophy) window.disableTrophy();

          // Uncheck the individual toggles
          const dogToggle = document.getElementById('enable-dog');
          const matrixToggle = document.getElementById('enable-matrix');
          const trophyToggle = document.getElementById('enable-trophy');
          if (dogToggle) dogToggle.checked = false;
          if (matrixToggle) matrixToggle.checked = false;
          if (trophyToggle) trophyToggle.checked = false;
        }

        saveSettings();
      });
    }

    // Apply button
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        saveSettings();
        overlay.classList.remove('active');
      });
    }

    // Reset button
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        settings = {
          volume: 80,
          accent: 'cyan',
          background: 'black',
          language: 'standard',
          funMode: false,
          themeMode: 'terminal'
        };

        // Disable all easter eggs on reset
        if (window.disableDog) window.disableDog();
        if (window.disableMatrix) window.disableMatrix();
        if (window.disableTrophy) window.disableTrophy();

        // Update UI
        if (funModeToggle) funModeToggle.checked = false;
        if (funStuffOptions) {
          funStuffOptions.style.display = 'none';
          funStuffOptions.style.opacity = '0.5';
        }
        const dogToggle = document.getElementById('enable-dog');
        const matrixToggle = document.getElementById('enable-matrix');
        const trophyToggle = document.getElementById('enable-trophy');
        if (dogToggle) dogToggle.checked = false;
        if (matrixToggle) matrixToggle.checked = false;
        if (trophyToggle) trophyToggle.checked = false;

        applySettings();
        saveSettings();
      });
    }
  }

  // ============================================
  // THEME TOGGLE (CONTROL BAR)
  // ============================================
  function initThemeToggle() {
    const themeBtn = document.getElementById('theme-btn');
    if (!themeBtn) return;

    themeBtn.addEventListener('click', () => {
      // Cycle through accent colors: green -> amber -> cyan -> green
      const accentCycle = ['green', 'amber', 'cyan'];
      const currentIndex = accentCycle.indexOf(settings.accent);
      const nextIndex = (currentIndex + 1) % accentCycle.length;
      settings.accent = accentCycle[nextIndex];

      applySettings();
      saveSettings();
    });
  }

  // ============================================
  // SECTION NAVIGATION
  // ============================================
  function switchSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));

    // Show target section
    const targetSection = document.getElementById(`section-${sectionName}`);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Update nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      if (item.dataset.section === sectionName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update output header
    const outputTitle = document.getElementById('output-title');
    if (outputTitle) {
      const titleMap = {
        home: 'HOME.TXT',
        projects: 'PROJECTS.TXT',
        'research-graph': 'RESEARCH_GRAPH.TXT',
        papers: 'PAPERS.TXT',
        about: 'ABOUT.TXT',
        contact: 'CONTACT.TXT',
        skills: 'SKILLS.TXT',
        timeline: 'TIMELINE.TXT',
        tools: 'TOOLS.TXT'
      };
      outputTitle.textContent = titleMap[sectionName] || 'HOME.TXT';
    }

    // Scroll to top smoothly
    const outputContent = document.querySelector('.output-content');
    if (outputContent) {
      outputContent.scrollTop = 0;
    }
  }

  // ============================================
  // EVENT LISTENERS
  // ============================================
  function init() {
    // Load saved settings
    loadSettings();

    // Update clock immediately and then every second
    updateClock();
    setInterval(updateClock, 1000);

    // Update year
    updateYear();

    // Update deploy time
    updateDeployTime();

    // Initialize settings modal
    initSettingsModal();

    // Initialize theme toggle
    initThemeToggle();

    // Navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.dataset.section;
        if (section) {
          switchSection(section);
          // Update URL hash
          history.pushState(null, '', `#${section}`);
        }
      });
    });

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      const hash = window.location.hash.slice(1) || 'home';
      switchSection(hash);
    });

    // Handle initial hash
    const initialHash = window.location.hash.slice(1);
    if (initialHash && ['home', 'projects', 'research-graph', 'papers', 'about', 'contact', 'skills', 'timeline', 'tools'].includes(initialHash)) {
      switchSection(initialHash);
    } else {
      switchSection('home');
    }

    // ============================================
    // EASTER EGG: KONAMI CODE
    // ============================================
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    document.addEventListener('keydown', (e) => {
      konamiCode.push(e.key);
      konamiCode = konamiCode.slice(-10);

      if (konamiCode.join(',') === konamiSequence.join(',')) {
        showEasterEgg();
      }
    });

    // ============================================
    // EASTER EGG: HELP COMMAND
    // ============================================
    let commandBuffer = '';
    document.addEventListener('keypress', (e) => {
      // Don't trigger if typing in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
      }

      commandBuffer += e.key;

      if (commandBuffer.endsWith('help')) {
        showHelpCommand();
        commandBuffer = '';
      }

      if (commandBuffer.endsWith('whoami')) {
        showWhoAmI();
        commandBuffer = '';
      }

      // Clear buffer if it gets too long
      if (commandBuffer.length > 20) {
        commandBuffer = '';
      }
    });
  }

  // ============================================
  // EASTER EGG FUNCTIONS
  // ============================================
  function showEasterEgg() {
    const root = document.documentElement;
    const originalAccent = getComputedStyle(root).getPropertyValue('--accent');
    root.style.setProperty('--accent', '#ff00ff');

    setTimeout(() => {
      root.style.setProperty('--accent', originalAccent);
    }, 3000);

    console.log('%c> KONAMI CODE ACTIVATED', 'color: #ff00ff; font-size: 20px; font-weight: bold;');
    console.log('%c> System colors temporarily modified...', 'color: #ff00ff;');
  }

  function showHelpCommand() {
    console.clear();
    console.log('%c┌────────────────────────────────────────┐', 'color: #00ff00; font-family: monospace;');
    console.log('%c│         AVAILABLE COMMANDS             │', 'color: #00ff00; font-family: monospace;');
    console.log('%c├────────────────────────────────────────┤', 'color: #00ff00; font-family: monospace;');
    console.log('%c│ help         Show this help message   │', 'color: #00ff00; font-family: monospace;');
    console.log('%c│ whoami       Display bio information  │', 'color: #00ff00; font-family: monospace;');
    console.log('%c│ ls           List available sections  │', 'color: #00ff00; font-family: monospace;');
    console.log('%c│ konami       Try the konami code      │', 'color: #00ff00; font-family: monospace;');
    console.log('%c└────────────────────────────────────────┘', 'color: #00ff00; font-family: monospace;');
    console.log('');
    console.log('%c> Type commands anywhere on the page', 'color: #808080;');
  }

  function showWhoAmI() {
    console.clear();
    console.log('%c> whoami', 'color: #00ff00; font-family: monospace;');
    console.log('');
    console.log('%cROHAN VINAIK', 'color: #e0e0e0; font-family: monospace; font-weight: bold;');
    console.log('%c────────────', 'color: #808080; font-family: monospace;');
    console.log('%cIndependent researcher developing Constraint-Oriented', 'color: #808080; font-family: monospace;');
    console.log('%cEmergent Computation (COEC) — a cross-domain framework', 'color: #808080; font-family: monospace;');
    console.log('%cconnecting AI security, cryptography, scientific', 'color: #808080; font-family: monospace;');
    console.log('%ccomputing, and systems biology.', 'color: #808080; font-family: monospace;');
    console.log('');
    console.log('%cFocus: behavioral holography, privacy-preserving', 'color: #808080; font-family: monospace;');
    console.log('%cgenomics, hyperdimensional computing, biocomputation.', 'color: #808080; font-family: monospace;');
    console.log('');
    console.log('%c> Clean theory. Practical builds.', 'color: #00ff00; font-family: monospace;');
  }

  // ============================================
  // EXPORT TO GLOBAL SCOPE (for terminal-bar.js)
  // ============================================
  window.terminal = window.terminal || {};
  window.terminal.translations = translations;
  window.terminal.getSettings = () => settings;
  window.terminal.getCurrentLanguage = () => settings.language;
  window.terminal.switchSection = switchSection;

  // ============================================
  // INITIALIZE ON DOM READY
  // ============================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Log welcome message
  console.log('%c┌─────────────────────────────────────────────┐', 'color: #00ff00; font-family: monospace;');
  console.log('%c│  rohan@personal:~$ cat welcome.txt         │', 'color: #00ff00; font-family: monospace;');
  console.log('%c├─────────────────────────────────────────────┤', 'color: #00ff00; font-family: monospace;');
  console.log('%c│  Welcome to the terminal interface!        │', 'color: #e0e0e0; font-family: monospace;');
  console.log('%c│  Type "help" for available commands        │', 'color: #808080; font-family: monospace;');
  console.log('%c└─────────────────────────────────────────────┘', 'color: #00ff00; font-family: monospace;');

})();
