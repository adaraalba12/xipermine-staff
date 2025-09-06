(function(){
  // Búsqueda con resaltado y filtrado básico
  const input = document.getElementById('buscador');
  const btnLimpiar = document.getElementById('btnLimpiar');
  const btnImprimir = document.getElementById('btnImprimir');
  const cards = Array.from(document.querySelectorAll('.card'));

  // Persistencia simple
  const saved = localStorage.getItem('xipermine_search') || '';
  if (saved && input){ input.value = saved; }

  function clearMarks(node){
    // Elimina marcas previas de <mark>
    const marks = node.querySelectorAll('mark');
    marks.forEach(m => {
      const parent = m.parentNode;
      parent.replaceChild(document.createTextNode(m.textContent), m);
      parent.normalize();
    });
  }

  function highlight(node, term){
    if (!term) return;
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
    const texts = [];
    while (walker.nextNode()){ texts.push(walker.currentNode); }
    const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    texts.forEach(t => {
      if(!t.nodeValue.trim()) return;
      if(re.test(t.nodeValue)){
        const span = document.createElement('span');
        span.innerHTML = t.nodeValue.replace(re, m => `<mark>${m}</mark>`);
        t.parentNode.replaceChild(span, t);
      }
    });
  }

  function doSearch(){
    const q = input.value.trim();
    localStorage.setItem('xipermine_search', q);
    cards.forEach(card => {
      clearMarks(card);
      if(!q){ card.style.display=''; return; }
      const txt = card.innerText.toLowerCase();
      const show = txt.includes(q.toLowerCase());
      card.style.display = show ? '' : 'none';
      if (show){ highlight(card, q); }
    });
  }

  if (input){
    input.addEventListener('input', doSearch);
    if(saved) doSearch();
  }
  if (btnLimpiar){
    btnLimpiar.addEventListener('click', ()=>{
      input.value=''; localStorage.removeItem('xipermine_search'); doSearch();
    });
  }
  if (btnImprimir){
    btnImprimir.addEventListener('click', ()=>window.print());
  }

  // Botones "Copiar"
  document.querySelectorAll('.codeblock .copy').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const pre = btn.parentElement.nextElementSibling;
      const text = pre.innerText;
      navigator.clipboard.writeText(text).then(()=>{
        const original = btn.textContent;
        btn.textContent = 'Copiado';
        setTimeout(()=> btn.textContent = original, 1000);
      });
    });
  });
})();
