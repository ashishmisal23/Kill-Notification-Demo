// Frontend logic for NotificationDemo dashboard
(function () {

  const tokenEl = document.getElementById('token');
  const titleEl = document.getElementById('title');
  const bodyEl = document.getElementById('body');
  const imageEl = document.getElementById('image');
  const dataEl = document.getElementById('data');

  const sendBtn = document.getElementById('send');
  const sendAllBtn = document.getElementById('sendAll');

  const statusEl = document.getElementById('status');
  const historyList = document.getElementById('historyList');

  const copyBtn = document.getElementById('copyToken');

  const loadTokensBtn = document.getElementById('loadTokens');
  const refreshTokensBtn = document.getElementById('refreshTokens');
  const clearAllTokensBtn = document.getElementById('clearAllTokens');

  const tokensList = document.getElementById('tokensList');

  const API_PREFIX = '/api';

  // Load last token
  tokenEl.value = localStorage.getItem('lastToken') || '';

  function setStatus(text, ok = true) {
    statusEl.textContent = text;
    statusEl.style.color = ok
      ? 'var(--success)'
      : 'var(--danger)';
  }

  function addHistory(entry) {
    const li = document.createElement('li');

    li.textContent =
      `${new Date().toLocaleString()} — ${entry}`;

    historyList.insertBefore(
      li,
      historyList.firstChild
    );
  }

  function parseJSONSafe(str) {
    if (!str || !str.trim()) return {};

    try {
      return JSON.parse(str);
    } catch (err) {
      throw new Error(
        'Invalid JSON: ' + err.message
      );
    }
  }

  async function post(endpoint, body) {
    const res = await fetch(
      API_PREFIX + endpoint,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    );

    if (!res.ok) {
      const err = await res
        .json()
        .catch(() => ({}));

      throw new Error(
        err.error ||
        res.statusText ||
        'Request failed'
      );
    }

    return res.json();
  }

  async function get(endpoint) {
    const res = await fetch(
      API_PREFIX + endpoint
    );

    if (!res.ok) {
      const err = await res
        .json()
        .catch(() => ({}));

      throw new Error(
        err.error ||
        res.statusText ||
        'Request failed'
      );
    }

    return res.json();
  }

  async function del(endpoint) {
    const res = await fetch(
      API_PREFIX + endpoint,
      {
        method: 'DELETE'
      }
    );

    if (!res.ok) {
      const err = await res
        .json()
        .catch(() => ({}));

      throw new Error(
        err.error ||
        res.statusText ||
        'Request failed'
      );
    }

    return res.json();
  }

  // Copy main token
  copyBtn.addEventListener('click', () => {
    const val = tokenEl.value || '';

    navigator.clipboard
      .writeText(val)
      .then(() => setStatus('Token copied'));
  });

  // Send single notification
  sendBtn.addEventListener('click', async () => {

    const token = tokenEl.value.trim();
    const title = titleEl.value.trim();
    const body = bodyEl.value.trim();
    const image = imageEl.value.trim();
    const rawData = dataEl.value.trim();

    if (!token) {
      return setStatus(
        'Device token is required',
        false
      );
    }

    if (!title) {
      return setStatus(
        'Title is required',
        false
      );
    }

    let dataPayload = {};

    try {
      dataPayload = parseJSONSafe(rawData);
    } catch (err) {
      return setStatus(err.message, false);
    }

    localStorage.setItem(
      'lastToken',
      token
    );

    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';

    setStatus('');

    try {

      const payload = {
        token,
        title,
        body,
        image: image || undefined,
        data: dataPayload
      };

      const res = await post(
        '/send-notification',
        payload
      );

      console.log(res);

      setStatus('Notification sent');

      addHistory(
        `Sent to token — ${title}`
      );

    } catch (err) {

      setStatus(err.message, false);

    } finally {

      sendBtn.disabled = false;
      sendBtn.textContent =
        'Send Notification';
    }
  });

  // Send broadcast
  sendAllBtn.addEventListener('click', async () => {

    const title = titleEl.value.trim();
    const body = bodyEl.value.trim();
    const image = imageEl.value.trim();
    const rawData = dataEl.value.trim();

    if (!title) {
      return setStatus(
        'Title is required',
        false
      );
    }

    let dataPayload = {};

    try {
      dataPayload = parseJSONSafe(rawData);
    } catch (err) {
      return setStatus(err.message, false);
    }

    sendAllBtn.disabled = true;
    sendAllBtn.textContent = 'Sending...';

    setStatus('');

    try {

      const payload = {
        title,
        body,
        image: image || undefined,
        data: dataPayload
      };

      const res = await post(
        '/send-to-all',
        payload
      );

      console.log(res);

      setStatus('Broadcast sent');

      addHistory(
        `Broadcast — ${title}`
      );

    } catch (err) {

      setStatus(err.message, false);

    } finally {

      sendAllBtn.disabled = false;
      sendAllBtn.textContent =
        'Send To All';
    }
  });

  // Format JSON automatically
  dataEl.addEventListener('blur', () => {

    const v = dataEl.value.trim();

    if (!v) return;

    try {

      const parsed = JSON.parse(v);

      dataEl.value = JSON.stringify(
        parsed,
        null,
        2
      );

    } catch (err) {
      // ignore invalid json
    }
  });

  // Load tokens
  async function loadTokens() {

    try {

      setStatus('Loading tokens...');

      const res = await get('/tokens');

      const items =
        (res && res.tokens) || [];

      tokensList.innerHTML = '';

      if (items.length === 0) {

        tokensList.innerHTML =
          '<li>No tokens registered</li>';

      } else {

        items.forEach(t => {

          const li = document.createElement('li');

          li.innerHTML = `
            <div
              style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                gap:10px;
                flex-wrap:wrap;
              "
            >

              <div
                style="
                  flex:1;
                  word-break:break-all;
                "
              >
                <strong>${t.platform}</strong>
                — ${t.token}

                <div
                  style="
                    font-size:11px;
                    color:var(--muted);
                  "
                >
                  Added:
                  ${new Date(
                    t.createdAt
                  ).toLocaleString()}
                </div>
              </div>

              <div
                style="
                  display:flex;
                  gap:6px;
                  flex-wrap:wrap;
                "
              >

                <button
                  class="btn small"
                  data-token="${t.token}"
                >
                  Use
                </button>

                <button
                  class="btn small"
                  data-copy="${t.token}"
                >
                  Copy
                </button>

                <button
                  class="btn small"
                  data-delete="${t.token}"
                >
                  Delete
                </button>

              </div>

            </div>
          `;

          tokensList.appendChild(li);
        });

        // Use token
        tokensList
          .querySelectorAll(
            'button[data-token]'
          )
          .forEach(btn => {

            btn.addEventListener(
              'click',
              (e) => {

                const value =
                  e.currentTarget.getAttribute(
                    'data-token'
                  );

                tokenEl.value = value;

                localStorage.setItem(
                  'lastToken',
                  value
                );

                setStatus(
                  'Token set in input'
                );
              }
            );
          });

        // Copy token
        tokensList
          .querySelectorAll(
            'button[data-copy]'
          )
          .forEach(btn => {

            btn.addEventListener(
              'click',
              (e) => {

                const value =
                  e.currentTarget.getAttribute(
                    'data-copy'
                  );

                navigator.clipboard
                  .writeText(value)
                  .then(() =>
                    setStatus(
                      'Token copied'
                    )
                  );
              }
            );
          });

        // Delete token
        tokensList
          .querySelectorAll(
            'button[data-delete]'
          )
          .forEach(btn => {

            btn.addEventListener(
              'click',
              async (e) => {

                const token =
                  e.currentTarget.getAttribute(
                    'data-delete'
                  );

                const confirmDelete =
                  confirm(
                    'Delete this token?'
                  );

                if (!confirmDelete) {
                  return;
                }

                try {

                  await del(
                    `/token/${encodeURIComponent(token)}`
                  );

                  setStatus(
                    'Token deleted'
                  );

                  loadTokens();

                } catch (err) {

                  setStatus(
                    err.message,
                    false
                  );
                }
              }
            );
          });
      }

      setStatus('Tokens loaded');

    } catch (err) {

      setStatus(
        err.message ||
        'Failed to load tokens',
        false
      );
    }
  }

  // Load buttons
  if (loadTokensBtn) {
    loadTokensBtn.addEventListener(
      'click',
      loadTokens
    );
  }

  if (refreshTokensBtn) {
    refreshTokensBtn.addEventListener(
      'click',
      loadTokens
    );
  }

  // Clear all tokens
  if (clearAllTokensBtn) {

    clearAllTokensBtn.addEventListener(
      'click',
      async () => {

        const confirmDelete = confirm(
          'Are you sure you want to clear all tokens?'
        );

        if (!confirmDelete) return;

        try {

          await del('/tokens');

          tokensList.innerHTML = '';

          setStatus(
            'All tokens cleared'
          );

          loadTokens();

        } catch (err) {

          setStatus(
            err.message,
            false
          );
        }
      }
    );
  }

})();
// // Frontend logic for NotificationDemo dashboard
// (function () {
//   const tokenEl = document.getElementById('token');
//   const titleEl = document.getElementById('title');
//   const bodyEl = document.getElementById('body');
//   const imageEl = document.getElementById('image');
//   const dataEl = document.getElementById('data');
//   const sendBtn = document.getElementById('send');
//   const sendAllBtn = document.getElementById('sendAll');
//   const statusEl = document.getElementById('status');
//   const historyList = document.getElementById('historyList');
//   const copyBtn = document.getElementById('copyToken');
//   const loadTokensBtn = document.getElementById('loadTokens');
//   const refreshTokensBtn = document.getElementById('refreshTokens');
//   const tokensList = document.getElementById('tokensList');

//   const API_PREFIX = '/api';

//   // Load last token
//   tokenEl.value = localStorage.getItem('lastToken') || '';

//   function setStatus(text, ok = true) {
//     statusEl.textContent = text;
//     statusEl.style.color = ok ? 'var(--success)' : 'var(--danger)';
//   }

//   function addHistory(entry) {
//     const li = document.createElement('li');
//     li.textContent = `${new Date().toLocaleString()} — ${entry}`;
//     historyList.insertBefore(li, historyList.firstChild);
//   }

//   function parseJSONSafe(str) {
//     if (!str || !str.trim()) return {};
//     try {
//       return JSON.parse(str);
//     } catch (err) {
//       throw new Error('Invalid JSON: ' + err.message);
//     }
//   }

//   async function post(endpoint, body) {
//     const res = await fetch(API_PREFIX + endpoint, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(body)
//     });

//     if (!res.ok) {
//       const err = await res.json().catch(() => ({}));
//       throw new Error(err.error || res.statusText || 'Request failed');
//     }
//     return res.json();
//   }

//   // GET helper
//   async function get(endpoint) {
//     const res = await fetch(API_PREFIX + endpoint);
//     if (!res.ok) {
//       const err = await res.json().catch(() => ({}));
//       throw new Error(err.error || res.statusText || 'Request failed');
//     }
//     return res.json();
//   }

//   copyBtn.addEventListener('click', () => {
//     const val = tokenEl.value || '';
//     navigator.clipboard.writeText(val).then(() => setStatus('Token copied'));
//   });

//   sendBtn.addEventListener('click', async () => {
//     const token = tokenEl.value.trim();
//     const title = titleEl.value.trim();
//     const body = bodyEl.value.trim();
//     const image = imageEl.value.trim();
//     const rawData = dataEl.value.trim();

//     if (!token) return setStatus('Device token is required', false);
//     if (!title) return setStatus('Title is required', false);

//     let dataPayload = {};
//     try {
//       dataPayload = parseJSONSafe(rawData);
//     } catch (err) {
//       return setStatus(err.message, false);
//     }

//     // Save token locally for convenience
//     localStorage.setItem('lastToken', token);

//     sendBtn.disabled = true;
//     sendBtn.textContent = 'Sending...';
//     setStatus('');

//     try {
//       const payload = { token, title, body, image: image || undefined, data: dataPayload };
//       const res = await post('/send-notification', payload);
//       setStatus('Notification sent');
//       addHistory(`Sent to token — ${title}`);
//       console.log('send response', res);
//     } catch (err) {
//       setStatus(err.message, false);
//     } finally {
//       sendBtn.disabled = false;
//       sendBtn.textContent = 'Send Notification';
//     }
//   });

//   sendAllBtn.addEventListener('click', async () => {
//     const title = titleEl.value.trim();
//     const body = bodyEl.value.trim();
//     const image = imageEl.value.trim();
//     const rawData = dataEl.value.trim();

//     if (!title) return setStatus('Title is required', false);

//     let dataPayload = {};
//     try {
//       dataPayload = parseJSONSafe(rawData);
//     } catch (err) {
//       return setStatus(err.message, false);
//     }

//     sendAllBtn.disabled = true;
//     sendAllBtn.textContent = 'Sending...';
//     setStatus('');

//     try {
//       const payload = { title, body, image: image || undefined, data: dataPayload };
//       const res = await post('/send-to-all', payload);
//       setStatus('Broadcast sent');
//       addHistory(`Broadcast — ${title}`);
//       console.log('broadcast response', res);
//     } catch (err) {
//       setStatus(err.message, false);
//     } finally {
//       sendAllBtn.disabled = false;
//       sendAllBtn.textContent = 'Send To All';
//     }
//   });

//   // Auto-format JSON payload on blur
//   dataEl.addEventListener('blur', () => {
//     const v = dataEl.value.trim();
//     if (!v) return;
//     try {
//       const parsed = JSON.parse(v);
//       dataEl.value = JSON.stringify(parsed, null, 2);
//     } catch (err) {
//       // leave invalid content alone
//     }
//   });

//   // Load tokens from backend and render
//   async function loadTokens() {
//     try {
//       setStatus('Loading tokens...');
//       const res = await get('/tokens');
//       const items = (res && res.tokens) || [];
//       tokensList.innerHTML = '';
//       if (items.length === 0) {
//         tokensList.innerHTML = '<li>No tokens registered</li>';
//       } else {
//         items.forEach(t => {
//           const li = document.createElement('li');
//           li.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><div style="flex:1;word-break:break-all"><strong>${t.platform}</strong> — ${t.token}<div style="font-size:11px;color:var(--muted)">Added: ${new Date(t.createdAt).toLocaleString()}</div></div><div style="margin-left:8px"><button class=\"btn small\" data-token=\"${t.token}\">Use</button> <button class=\"btn small\" data-copy=\"${t.token}\">Copy</button></div></div>`;
//           tokensList.appendChild(li);
//         });

//         // attach handlers
//         tokensList.querySelectorAll('button[data-token]').forEach(b => {
//           b.addEventListener('click', (e) => {
//             const v = e.currentTarget.getAttribute('data-token');
//             tokenEl.value = v;
//             localStorage.setItem('lastToken', v);
//             setStatus('Token set in input');
//           });
//         });
//         tokensList.querySelectorAll('button[data-copy]').forEach(b => {
//           b.addEventListener('click', (e) => {
//             const v = e.currentTarget.getAttribute('data-copy');
//             navigator.clipboard.writeText(v).then(() => setStatus('Token copied'));
//           });
//         });
//       }
//       setStatus('Tokens loaded');
//     } catch (err) {
//       setStatus(err.message || 'Failed to load tokens', false);
//     }
//   }

//   if (loadTokensBtn) loadTokensBtn.addEventListener('click', loadTokens);
//   if (refreshTokensBtn) refreshTokensBtn.addEventListener('click', loadTokens);
// })();
