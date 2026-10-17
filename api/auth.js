// Decap CMS GitHub OAuth handler for Vercel
// Handles both the redirect to GitHub and the callback with the code

export default async function handler(req, res) {
  const { code, provider } = req.query;

  const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
  const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;

  // Step 1 — No code yet: redirect to GitHub OAuth
  if (!code) {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      scope: 'repo,user',
      redirect_uri: `https://${req.headers.host}/api/auth`,
    });
    return res.redirect(`https://github.com/login/oauth/authorize?${params}`);
  }

  // Step 2 — GitHub sent back a code: exchange it for a token
  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      return res.status(400).send(`OAuth error: ${tokenData.error_description}`);
    }

    const token = tokenData.access_token;

    // Post the token back to the CMS via postMessage
    const html = `
<!doctype html>
<html>
<head><title>Authenticating…</title></head>
<body>
<script>
  (function() {
    function receiveMessage(e) {
      console.log('receiveMessage %o', e);
      window.opener.postMessage(
        'authorization:github:success:${JSON.stringify({ token, provider: 'github' }).replace(/'/g, "\\'")}',
        e.origin
      );
    }
    window.addEventListener('message', receiveMessage, false);
    window.opener.postMessage('authorizing:github', '*');
  })();
</script>
<p>Authenticating, please wait…</p>
</body>
</html>`;

    // Safer: inline the token directly
    const safeHtml = `
<!doctype html>
<html>
<head><title>Authenticating…</title></head>
<body>
<script>
  (function() {
    var token = ${JSON.stringify(token)};
    var message = 'authorization:github:success:' + JSON.stringify({ token: token, provider: 'github' });
    function receiveMessage(e) {
      window.opener.postMessage(message, e.origin);
    }
    window.addEventListener('message', receiveMessage, false);
    window.opener.postMessage('authorizing:github', '*');
  })();
</script>
<p>Authenticating…</p>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(safeHtml);
  } catch (err) {
    console.error('OAuth handler error:', err);
    return res.status(500).send('Authentication failed. Check server logs.');
  }
}
