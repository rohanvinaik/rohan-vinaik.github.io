'use strict';
const pages={home:'home.html',projects:'projects.html',research_graph:'research-graph.html',papers:'papers.html',paper_feed:'paper-feed.html',research_record:'record.html',about:'about.html'};
const dialog=document.getElementById('settings-dialog');const accentSelect=document.getElementById('accent-select'),themeSelect=document.getElementById('theme-select'),dogToggle=document.getElementById('enable-dog');
let preferences={accent:'cyan',theme:'terminal',dog:false};try{const stored=JSON.parse(localStorage.getItem('rohan-console')||'null');if(stored&&typeof stored==='object')preferences={...preferences,...stored};}catch{}
let dogLoaded=false;
function applyPreferences(){const clinical=preferences.theme==='clinical';document.documentElement.dataset.theme=clinical?'clinical':'terminal';const colors=clinical?{cyan:'#006d83',green:'#246a2a',amber:'#875400'}:{cyan:'#00ffff',green:'#00ff00',amber:'#ffb000'};document.documentElement.style.setProperty('--accent',colors[preferences.accent]||colors.cyan);accentSelect.value=preferences.accent;themeSelect.value=preferences.theme;dogToggle.checked=!!preferences.dog;
 if(preferences.dog&&!dogLoaded){dogLoaded=true;const script=document.createElement('script');script.src='dog.js';script.onload=()=>{if(preferences.dog)window.ASCIIDog.enable();};document.body.append(script);}
 if(window.ASCIIDog){if(preferences.dog)window.ASCIIDog.enable();else window.ASCIIDog.disable();}
 document.getElementById('sprite-dog').style.display=preferences.dog?'flex':'none';
}
applyPreferences();
document.getElementById('settings-btn').addEventListener('click',()=>dialog.showModal());
for(const input of [accentSelect,themeSelect,dogToggle])input.addEventListener('change',()=>{preferences={accent:accentSelect.value,theme:themeSelect.value,dog:dogToggle.checked};try{localStorage.setItem('rohan-console',JSON.stringify(preferences));}catch{}applyPreferences();});
const clock=document.getElementById('clock');function showClock(){clock.textContent=new Date().toLocaleTimeString('en-GB',{timeZone:'UTC',hour12:false})+' UTC';}showClock();setInterval(()=>{if(!document.hidden)showClock();},1000);
const commandToggle=document.getElementById('command-toggle'),panel=document.getElementById('command-panel'),input=document.getElementById('terminal-input'),output=document.getElementById('command-output');
function toggleCommand(){panel.hidden=!panel.hidden;commandToggle.setAttribute('aria-expanded',String(!panel.hidden));if(!panel.hidden)input.focus();}commandToggle.addEventListener('click',toggleCommand);
const history=[];let historyIndex=0;
document.getElementById('command-form').addEventListener('submit',event=>{event.preventDefault();const command=input.value.trim();input.value='';if(!command)return;history.push(command);historyIndex=history.length;const [action,...args]=command.split(/\s+/);const name=args.join(' ');let result;
 if(action==='help')result='ls                  List pages\ncd <page>           Open a page\ncat <page>.txt      Open a page\npwd                 Current page\nwhoami              Rohan Vinaik · independent researcher · biochemist by training\ntheme               Open settings\nclear               Clear this terminal\nUp/Down: history · Tab: complete · Escape: close';
 else if(action==='ls')result=Object.keys(pages).join('  ');
 else if(action==='pwd')result='/'+location.pathname.split('/').pop().replace('.html','');
 else if(action==='whoami')result='Rohan Vinaik · Cambridge, MA · independent researcher · biochemist by training';
 else if(action==='theme'){dialog.showModal();result='Settings opened.';}
 else if(action==='clear'){output.textContent='';return;}
 else if(action==='cd'||action==='cat'){const target=name.replace(/\.txt$/,'').replace(/\.html$/,'').replaceAll('-','_');if(pages[target]){location.href=pages[target];return;}result='Unknown page. Type ls for the directory.';}
 else result='Unknown command. Type help.';
 output.textContent+=`\n$ ${command}\n${result}\n`;output.scrollTop=output.scrollHeight;
});
input.addEventListener('keydown',event=>{if(event.key==='Escape'){toggleCommand();commandToggle.focus();}else if(event.key==='ArrowUp'){event.preventDefault();historyIndex=Math.max(0,historyIndex-1);input.value=history[historyIndex]||'';}else if(event.key==='ArrowDown'){event.preventDefault();historyIndex=Math.min(history.length,historyIndex+1);input.value=history[historyIndex]||'';}else if(event.key==='Tab'){event.preventDefault();const parts=input.value.split(/\s+/);if(parts.length===2){const matches=Object.keys(pages).filter(page=>page.startsWith(parts[1]));if(matches.length===1)input.value=parts[0]+' '+matches[0];}}});
document.addEventListener('keydown',event=>{if(event.ctrlKey&&event.key==='`'){event.preventDefault();toggleCommand();}});
