export default {
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
  async handleWebSocket(request) {


 // 如果需要，可以将serverUrl替换为您的服务器地址
  let serverUrl = "https://sydney.bing.com";
   const currentUrl = new URL(request.url);
   const fetchUrl = new URL(serverUrl + currentUrl.pathname + currentUrl.search);

  let serverRequest = new Request(fetchUrl, request);
//  serverRequest.headers.set('Host', 'sydney.bing.com');
  serverRequest.headers.set('origin', 'https://www.bing.com');
  serverRequest.headers.set('referer', 'https://www.bing.com/search?q=Bing+AI');

const cookie = serverRequest.headers.get('Cookie') || '';
let cookies = cookie; 
if (!cookie.includes('_U=')) {
    cookies += '; _U=' + '';
  }

  serverRequest.headers.set('Cookie', cookies);
  serverRequest.headers.set('user-agent',  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.7 Mobile/15E148 Safari/605.1.15 BingSapphire/1.0.410427012');
     

const res =  await fetch(serverRequest);
const newRes = new Response(res.body, res);

//newRes.headers.set('Access-Control-Allow-Origin', request.headers.get('Origin'));
newRes.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
newRes.headers.set('Access-Control-Allow-Credentials', 'true');
newRes.headers.set('Access-Control-Allow-Headers', '*');

 // 创建一个新的URL对象，指向http://ipecho.net/plain
 let Ipurl = new URL("http://ipecho.net/plain")
 // 使用fetch函数获取该URL的响应
 let Ipresponse = await fetch(Ipurl)
 // 如果响应状态码为200，表示成功
//   if (Ipresponse.status == 200) {
   // 获取响应的文本内容
   let textip = await Ipresponse.text()
newRes.headers.set('TestLog',"This is Sydney@" + textip);
const Guestip =  request.headers.get('cf-connecting-ip');
newRes.headers.set('Guestip',Guestip); 
  return newRes;
  },
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return this.handleOptions(request)
    }
    const uri = new URL(request.url)
    const upgradeHeader = request.headers.get('Upgrade')
    if (upgradeHeader === 'websocket') {
      return this.handleWebSocket(request)
    }
    uri.hostname = 'sydney.bing.com'
  //uri.hostname = 'www.bing.com' 
    return fetch(new Request(uri.toString(), request))
  },
}
