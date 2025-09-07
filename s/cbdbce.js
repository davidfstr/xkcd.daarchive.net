(function() {
  var SERVERS = [
    '//c0.xkcd.com',
    '//c1.xkcd.com',
    '//c2.xkcd.com',
    '//c3.xkcd.com',
    '//c4.xkcd.com',
    '//c5.xkcd.com',
    '//c6.xkcd.com',
    '//c7.xkcd.com'
  ]

  var IMGHOST = '//imgs.xkcd.com'

  function record(name) {
    new Image().src = location.protocol + '//xkcd.com/events/' + name
  }

  function log() {
      if (location.hash == '#verbose') {
        console.log.apply(console, arguments)
      }
  }

  try {
    var server = location.protocol + SERVERS[Math.floor(Math.random() * SERVERS.length)],
        esURL = server + '/stream/comic/landing?method=EventSource',
        source = new EventSource(esURL)

    log('connecting to event source:', esURL)
    source.addEventListener('open', function(ev) {
      record('connect_start')
    }, false)

    source.addEventListener('error', function(ev) {
      log('connection error', ev)
      record('connect_error')
    }, false)

    source.addEventListener('comic/landing', log, false)

    var firstLoad = true
    source.addEventListener('comic/landing', function(ev) {
      var data = JSON.parse(ev.data),
          img = document.getElementById('comic').getElementsByTagName('img')[0],
          delay = firstLoad ? 0 : Math.round(Math.random() * data.spread)
      log('waiting', delay, 'seconds before displaying comic', data.image)
      setTimeout(function() {
	  var newimg = IMGHOST + '/comics/landing/' + data.image;
	  if (img.src != newimg) { log(img.src, newimg); }
	  img.src = newimg;
	  firstLoad = false;
      }, delay * 1000)
    }, false)

    source.addEventListener('comic/landing/reload', function(ev) {
      var delay = Math.round(Math.random() * 55)
      log('reloading in', delay + 5, 'seconds')
      setTimeout(function() {
        record('reloading')

        // give the record a little time to be sent
        setTimeout(function() {
          location.reload()
        }, 5 * 1000)
      }, delay * 1000)
    }, false)
  } catch (e) {
    record('js_error')
  }
})()
