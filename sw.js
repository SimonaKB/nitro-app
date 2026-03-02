const CACHE='nitro-v5-cache-v2';
const ASSETS=['/index.html','/manifest.json','/icons/icon-192x192.png','/icons/icon-512x512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{if(r.ok){const rc=r.clone();caches.open(CACHE).then(c=>c.put(e.request,rc))}return r}).catch(()=>caches.match(e.request)))});
self.addEventListener('push',e=>{const d=e.data?e.data.json():{title:'Nitro',body:'Připomenutí'};e.waitUntil(self.registration.showNotification(d.title||'Nitro',{body:d.body||'',icon:'/icons/icon-192x192.png',badge:'/icons/icon-72x72.png',vibrate:[200,100,200],requireInteraction:true,tag:d.tag||'nitro-'+Date.now()}))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window'}).then(cs=>{if(cs.length>0)return cs[0].focus();return clients.openWindow('/')}))});
