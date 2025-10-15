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
    }
  };

  // ============================================
  // SETTINGS STATE
  // ============================================
  let settings = {
    volume: 80,
    accent: 'green',
    background: 'gray',
    language: 'standard'
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
    // Apply accent color
    const root = document.documentElement;
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
          accent: 'green',
          background: 'gray',
          language: 'standard'
        };
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
