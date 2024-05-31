const SITE_HOST = '' // 为空则自动推断
//const BING_COOKIE = ''//await env.CookieStore.get('Cookie-Values') // 换成你自己的 BING_COOKIE，操作参见 README.md
const TARGET_HOST = 'niansuhai-bingo.hf.space' //TvTtian-bingo.hf.space https://niansuhai-bingo.hf.space/后台服务，默认不需要修改

function parseCookie(cookie, cookieName) {
  if (!cookie || !cookieName) return ''
  const targetCookie = new RegExp(`(?:[; ]|^)${cookieName}=([^;]*)`).test(cookie) ? RegExp.$1 : cookie
  return targetCookie ? decodeURIComponent(targetCookie).trim() : cookie.indexOf('=') === -1 ? cookie.trim() : ''
}

function parseCookies(cookie, cookieNames) {
  const cookies = {}
  cookieNames.forEach(cookieName => {
    cookies[cookieName] = parseCookie(cookie, cookieName)
  })
  return cookies
}
function formatCookies(cookieObj) {
  return Object.keys(cookieObj).map(key => `${key}=${cookieObj[key]}`).join('; ')
}

const handlers = {
  async handleOptions(request) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
      'Access-Control-Max-Age': '86400',
    }

    if (
      request.headers.get('Origin') !== null &&
      request.headers.get('Access-Control-Request-Method') !== null &&
      request.headers.get('Access-Control-Request-Headers') !== null
    ) {
      return new Response(null, {
        headers: {
          ...corsHeaders,
          'Access-Control-Allow-Headers': request.headers.get(
            'Access-Control-Request-Headers'
          ),
        },
      })
    } else {
      return new Response(null, {
        headers: {
          Allow: 'GET, HEAD, POST, OPTIONS',
        },
      })
    }
  },

  async handleWebSocket(headers) {
    headers.set('Host', 'sydney.bing.com')
    return fetch('https://sydney.bing.com/sydney/ChatHub', {
      headers
    })
  },

  async fetch(request, env = {}) {

 //   const BING_COOKIE = await env.CookieStore.get('Cookie-Values') 
 //   const BING_Ucookie = 'KievRPSSecAuth=' + await env.CookieStore.get('KievRPSSecAuth')
 //   const BING_rcookie =  '_RwBf=' + await env.CookieStore.get('_RwBf')
    const cctresp = await fetch('https://jokyone-cookiesvr.hf.space/GET?pwd=234567')
    let bBING_COOKIE = await cctresp.text();
    // 将json数据转换为JavaScript对象
    let data = JSON.parse(bBING_COOKIE);

// 从对象中获取cookies的值
    let Uallcookies = data.result.cookies;
 //   const    BING_COOKIE = BING_Ucookie + '; ' + BING_rcookie +  '; ' + bBING_COOKIE;
    const    BING_COOKIE = Uallcookies;

 


    console.log(BING_COOKIE)
    const uri = new URL(request.url)
    console.log('uri', uri.toString())
    if (request.method === 'OPTIONS') {
      return this.handleOptions(request)
    }
    const headersObj = {}
    for (const [key, value] of request.headers.entries()) {
      if (key.startsWith('cf-') || key.startsWith('x-') || ['connection', 'origin', 'referer', 'host', 'authority'].includes(key)) continue
      headersObj[key] = value
    }
    headersObj['x-forwarded-for'] = request.headers.get('x-forwarded-for')?.split(',')?.[0]
    if (!headersObj['x-forwarded-for']) {
      delete headersObj['x-forwarded-for']
    }
    headersObj['x-ms-useragent'] = request.headers.get('x-ms-useragent') || 'azsdk-js-api-client-factory/1.0.0-beta.1 core-rest-pipeline/1.10.3 OS/Win32'
    headersObj['referer'] = 'https://www.bing.com/search?q=Bing+AI'
    const headers = new Headers(headersObj)
    console.log('headers', headersObj)

    headers.set('user-agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.7 Mobile/15E148 Safari/605.1.15 BingSapphire/1.0.410427012');


    const upgradeHeader = headers.get('Upgrade')
    if (upgradeHeader === 'websocket') {
      return this.handleWebSocket(headers)
    }
    if (uri.pathname.startsWith('/cctcookie/')){
      return new Response(BING_COOKIE, {
        headers: { 'content-type': 'text/plain' },
      })
    }


    if (uri.pathname.startsWith('/turing/')) {

     // if (BING_COOKIE || env.BING_COOKIE) {
      headers.set('cookie', BING_COOKIE)
   //     headers.set('cookie', formatCookies({
   //       ...parseCookies(env.BING_COOKIE || BING_COOKIE, ['MUID']),
    //      ...parseCookies(env.BING_COOKIE || BING_COOKIE, ['_U']),
    //      ...parseCookies(env.BING_COOKIE || BING_COOKIE, ['KievRPSSecAuth']),
    //      ...parseCookies(env.BING_COOKIE || BING_COOKIE, ['_RwBf']),
    //      ...parseCookies(env.BING_COOKIE || BING_COOKIE, ['SRCHHPGUSR']),
    //      ...parseCookies(env.BING_COOKIE || BING_COOKIE, ['cct']),
          
     //     _U: 'xxxbbbbcccc'
     //   }))
    //  }
      uri.host = 'www.bing.com'
    } else {
      if (uri.protocol === 'http:' && !/^[0-9.:]+$/.test(TARGET_HOST)) {
        uri.protocol = 'https:';
      }
      headers.set('x-endpoint', SITE_HOST || uri.host)
      // headers.set('x-ws-endpoint', SITE_HOST || uri.host)
      uri.host = TARGET_HOST
      uri.port = TARGET_HOST.split(':')[1] || ''
      headers.set('cookie', `IMAGE_ONLY=1; ${headers.get('cookie') || ''}`)
    }

    headers.set('Host', uri.host)
    return fetch(uri.toString(), {
      headers,
      method: request.method,
      redirect: request.redirect,
      body: request.body,
    })
  },
}

export default handlers

addEventListener("fetch", (event) => {
  event.respondWith(handlers.fetch(event.request))
})
