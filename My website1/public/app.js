// frontend logic
async function fetchItems() {
  const res = await fetch('/api/items');
  if (!res.ok) throw new Error('Failed to load');
  return res.json();
}

function el(tag, attrs={}, children=[]) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if (k === 'class') e.className = v;
    else if (k.startsWith('on')) e.addEventListener(k.substring(2), v);
    else e.setAttribute(k, v);
  });
  (Array.isArray(children)?children:[children]).forEach(c=>{
    if (typeof c === 'string') e.appendChild(document.createTextNode(c));
    else if (c) e.appendChild(c);
  });
  return e;
}

async function init() {
  const itemsList = document.getElementById('items');
  const playerSection = document.getElementById('player');
  const listSection = document.getElementById('list');
  const content = document.getElementById('content');
  const backBtn = document.getElementById('backBtn');

  backBtn.addEventListener('click', () => {
    playerSection.hidden = true;
    listSection.hidden = false;
    content.innerHTML = '';
  });

  try {
    const items = await fetchItems();
    items.forEach(it => {
      const li = el('li');
      const a = el('a', { href: '#', class: 'item-link', onclick: (e)=>{
        e.preventDefault();
        openItem(it);
      }});
      a.appendChild(el('span', {}, it.title));
      a.appendChild(el('span', {}, it.type === 'youtube' ? '▶' : '›'));
      li.appendChild(a);
      itemsList.appendChild(li);
    });
  } catch (err) {
    itemsList.appendChild(el('li', {}, 'خطأ في جلب العناصر'));
    console.error(err);
  }

  function openItem(it) {
    listSection.hidden = true;
    playerSection.hidden = false;
    if (it.type === 'youtube') {
      // embed YouTube safely
      const id = extractYouTubeID(it.url);
      if (id) {
        content.innerHTML = `<iframe width="100%" height="480" src="https://www.youtube.com/embed/${id}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      } else {
        content.textContent = 'رابط يوتيوب غير صالح';
      }
    } else if (it.type === 'page') {
      content.innerHTML = `<iframe src="${it.url}" style="width:100%;height:600px;border:0"></iframe>`;
    } else {
      content.innerHTML = `<a href="${it.url}" target="_blank" rel="noopener noreferrer">افتح الرابط</a>`;
    }
  }

  function extractYouTubeID(url) {
    // very small util to extract ID
    const m = url.match(/(?:v=|\/embed\/|\.be\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  }
}

window.addEventListener('DOMContentLoaded', init);
