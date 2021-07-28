self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('PWAGRAM')
            .then((cache) => {
                cache.addAll(['/', 'index.html', 'style.css', 'app.js', 'images/camera.png'])
            })
    )
})


  // estrategia de cache
  /* self.addEventListener("fetch", function(e){
    e.respondWith(caches.match(e.request)
        .then(function(res){
            if(res){
                return res
            } else {
                return fetch(e.request)
            }
        })
    )
  }) */


  // Network only
  /*  *  self.addEventListener('fetch', function(e){
        e.respondWith(
            fetch(e.request)
            .catch((err)=>{
                return caches.open('PWAGRAM')
                    .then((cache)=>{
                        return cache.match(request)
                    })
            })
        )
    })*/

    // Stale while Revalidate
    