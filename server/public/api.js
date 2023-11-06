const API_URL = `http://localhost:3333`;

const updateResultText = (id, items) => {
  const rst = document.getElementById(id);
  if (rst) rst.innerText = JSON.stringify(items);
};

const updateRandomItemsHandler = (id, cache) => async () => {
  const res = await fetch(`${API_URL}/random-items`, {
    cache,
    ...(cache === 'only-if-cached' ? { mode: 'same-origin' } : {}),
  });

  const { items } = await res.json();
  updateResultText(id, items);
};

const updateCacheControlHandler = (onOrOff) => () => {
  fetch(`${API_URL}/cache-control/${onOrOff}`, {
    method: 'post',
  });
};

window.addEventListener('load', () => {
  const cacheList = [
    'default',
    'no-store',
    'reload',
    'force-cache',
    'only-if-cached',
  ];

  for (const cache of cacheList) {
    const btn = document.getElementById(`${cache}-btn`);
    if (!btn) continue;
    btn.addEventListener(
      'click',
      updateRandomItemsHandler(`${cache}-rst`, cache)
    );
  }

  document
    .getElementById('cache-control-on')
    ?.addEventListener('click', updateCacheControlHandler('on'));
  document
    .getElementById('cache-control-off')
    ?.addEventListener('click', updateCacheControlHandler('off'));
});
