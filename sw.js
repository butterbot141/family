// Offline-Skript der Stammbaum-App (Ordner /family/).
// Alle Apps unter butterbot141.github.io teilen sich die Caches: nur eigene Caches mit Präfix "stammbaum-" anfassen.
const PREFIX='stammbaum-';
const CACHE=PREFIX+'v7';
const BASE=new URL('./',self.location).pathname; // z. B. /family/
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);
 if(e.request.method!=='GET'||u.origin!==location.origin||!u.pathname.startsWith(BASE))return; // nur der eigene Ordner
 if(u.pathname.endsWith('familie.json')||u.pathname.endsWith('.bin'))return; // Familiendaten und Medienpakete nie doppelt speichern
 e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'))))});
