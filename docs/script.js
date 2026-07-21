(function () {
  'use strict';

  // ——— Mobile nav ———
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ——— Active section in nav ———
  var sections = document.querySelectorAll('main section[id]');
  var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function setActiveNav() {
    var scrollY = window.scrollY + 80;
    var current = null;

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollY) {
        current = section.id;
      }
    });

    navAnchors.forEach(function (a) {
      var href = a.getAttribute('href');
      var match = href === '#' + current;
      if (match) {
        a.setAttribute('aria-current', 'true');
      } else {
        a.removeAttribute('aria-current');
      }
    });
  }

  if (sections.length && navAnchors.length) {
    window.addEventListener('scroll', setActiveNav, { passive: true });
    setActiveNav();
  }

  // ——— Copy buttons ———
  document.querySelectorAll('.code-block').forEach(function (block) {
    var pre = block.querySelector('pre');
    if (!pre) return;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-btn';
    btn.textContent = 'Copiar';
    btn.setAttribute('aria-label', 'Copiar código');
    block.appendChild(btn);

    btn.addEventListener('click', function () {
      var text = pre.textContent || '';
      function done() {
        btn.textContent = 'Copiado';
        btn.classList.add('copied');
        setTimeout(function () {
          btn.textContent = 'Copiar';
          btn.classList.remove('copied');
        }, 1600);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }

      function fallbackCopy() {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
          done();
        } catch (e) {
          btn.textContent = 'Error';
        }
        document.body.removeChild(ta);
      }
    });
  });

  // ——— Hero demo: cotizaciones en vivo (client-side) ———
  var FETCH_TIMEOUT_MS = 10000;
  var URL_DOLAR = 'https://dolarapi.com/v1/dolares';
  var URL_STOCKS = 'https://data912.com/live/arg_stocks';
  var URL_RIESGO = 'https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais/ultimo';

  function formatAR(value, maxFractionDigits) {
    if (typeof value !== 'number' || !isFinite(value)) return null;
    return new Intl.NumberFormat('es-AR', {
      maximumFractionDigits: maxFractionDigits,
      minimumFractionDigits: 0
    }).format(value);
  }

  function cellByDemo(key) {
    return document.querySelector('.cell-value[data-demo="' + key + '"]');
  }

  function setCellValue(el, text, isError) {
    if (!el) return;
    var skeleton = el.querySelector('.cell-skeleton');
    var textEl = el.querySelector('.cell-value-text');
    if (skeleton) skeleton.remove();
    if (textEl) {
      textEl.textContent = text;
      textEl.classList.remove('sr-only');
    } else {
      el.textContent = text;
    }
    el.setAttribute('aria-busy', 'false');
    if (isError) {
      el.classList.add('is-error');
      el.setAttribute('title', 'No se pudo cargar');
      el.setAttribute('aria-label', 'No se pudo cargar');
    } else {
      el.classList.remove('is-error');
      el.removeAttribute('title');
      el.removeAttribute('aria-label');
    }
  }

  function setCellError(key) {
    setCellValue(cellByDemo(key), '—', true);
  }

  function fetchJson(url) {
    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = null;
    if (controller) {
      timer = setTimeout(function () {
        controller.abort();
      }, FETCH_TIMEOUT_MS);
    }

    return fetch(url, {
      credentials: 'omit',
      signal: controller ? controller.signal : undefined
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }).finally(function () {
      if (timer) clearTimeout(timer);
    });
  }

  function findCasa(datos, casa) {
    if (!datos || !datos.length) return null;
    for (var i = 0; i < datos.length; i++) {
      if (datos[i].casa && datos[i].casa.toLowerCase() === casa) {
        return datos[i];
      }
    }
    return null;
  }

  function findSymbol(datos, symbol) {
    if (!datos || !datos.length) return null;
    var target = symbol.toUpperCase();
    for (var i = 0; i < datos.length; i++) {
      if (datos[i].symbol === target) return datos[i];
    }
    return null;
  }

  function loadHeroDemo() {
    var cells = document.querySelectorAll('.cell-value[data-demo]');
    if (!cells.length) return;

    var successCount = 0;
    var settledCount = 0;
    var totalKeys = 4;

    function markSettled(ok) {
      settledCount += 1;
      if (ok) successCount += 1;
      if (settledCount < totalKeys) return;

      var live = document.getElementById('hero-demo-live');
      var err = document.getElementById('hero-demo-error');
      if (successCount > 0 && live) {
        live.hidden = false;
      }
      if (successCount === 0 && err) {
        err.hidden = false;
      }
    }

    // DolarAPI: blue + mep (bolsa) en un solo request
    fetchJson(URL_DOLAR)
      .then(function (datos) {
        var blue = findCasa(datos, 'blue');
        var bolsa = findCasa(datos, 'bolsa');
        var blueTxt = blue && blue.venta != null ? formatAR(Number(blue.venta), 2) : null;
        var mepTxt = bolsa && bolsa.venta != null ? formatAR(Number(bolsa.venta), 2) : null;

        if (blueTxt) {
          setCellValue(cellByDemo('blue'), blueTxt, false);
          markSettled(true);
        } else {
          setCellError('blue');
          markSettled(false);
        }

        if (mepTxt) {
          setCellValue(cellByDemo('mep'), mepTxt, false);
          markSettled(true);
        } else {
          setCellError('mep');
          markSettled(false);
        }
      })
      .catch(function () {
        setCellError('blue');
        setCellError('mep');
        markSettled(false);
        markSettled(false);
      });

    // data912: GGAL precio (c)
    fetchJson(URL_STOCKS)
      .then(function (datos) {
        var row = findSymbol(datos, 'GGAL');
        var txt = row && row.c != null ? formatAR(Number(row.c), 2) : null;
        if (txt) {
          setCellValue(cellByDemo('ggal'), txt, false);
          markSettled(true);
        } else {
          setCellError('ggal');
          markSettled(false);
        }
      })
      .catch(function () {
        setCellError('ggal');
        markSettled(false);
      });

    // Argentina Datos: riesgo país último
    fetchJson(URL_RIESGO)
      .then(function (datos) {
        var valor = datos && datos.valor != null ? Number(datos.valor) : NaN;
        var txt = formatAR(valor, 0);
        if (txt) {
          setCellValue(cellByDemo('riesgo'), txt, false);
          markSettled(true);
        } else {
          setCellError('riesgo');
          markSettled(false);
        }
      })
      .catch(function () {
        setCellError('riesgo');
        markSettled(false);
      });
  }

  loadHeroDemo();

  // ——— CEDEARs table ———
  var TAG_TITLE_OVERRIDES = { Tech: 'Tecnología' };
  var URL_CEDEARS = 'api/cedears.json';

  var cedearsItems = [];
  var cedearsTbody = document.getElementById('cedears-tbody');
  var cedearsTagFilter = document.getElementById('cedears-tag-filter');
  var cedearsCount = document.getElementById('cedears-count');
  var cedearsError = document.getElementById('cedears-error');

  function slugifyTag(tag) {
    if (tag === 'Tech') return 'tecnologia';
    return tag
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/&/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function escapeHtml(text) {
    if (text == null) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function collectUniqueTags(items) {
    var seen = {};
    var tags = [];
    items.forEach(function (item) {
      var itemTags = item.tags;
      if (!itemTags || !itemTags.length) return;
      itemTags.forEach(function (tag) {
        if (!tag || seen[tag]) return;
        seen[tag] = true;
        tags.push(tag);
      });
    });
    tags.sort(function (a, b) {
      return a.localeCompare(b, 'es');
    });
    return tags;
  }

  function populateTagFilter(tags) {
    if (!cedearsTagFilter) return;
    tags.forEach(function (tag) {
      var opt = document.createElement('option');
      opt.value = tag;
      opt.textContent = tag;
      cedearsTagFilter.appendChild(opt);
    });
  }

  function renderTagsCell(tags) {
    if (!tags || !tags.length) return '—';
    return tags.map(function (tag) {
      var slug = slugifyTag(tag);
      var title = TAG_TITLE_OVERRIDES[tag] || tag;
      return (
        '<a class="cedear-tag" href="categoria/' +
        escapeHtml(slug) +
        '/" title="' +
        escapeHtml(title) +
        '">' +
        escapeHtml(tag) +
        '</a>'
      );
    }).join(' ');
  }

  function getFilteredItems() {
    if (!cedearsTagFilter) return cedearsItems;
    var selected = cedearsTagFilter.value;
    if (!selected) return cedearsItems;
    return cedearsItems.filter(function (item) {
      var tags = item.tags;
      if (!tags || !tags.length) return false;
      return tags.indexOf(selected) !== -1;
    });
  }

  function updateCedearsCount(visibleCount) {
    if (!cedearsCount) return;
    var total = cedearsItems.length;
    var selected = cedearsTagFilter ? cedearsTagFilter.value : '';
    if (selected) {
      cedearsCount.textContent = 'Mostrando ' + visibleCount + ' de ' + total;
    } else {
      cedearsCount.textContent = visibleCount + ' de ' + total;
    }
  }

  function renderCedearsTable() {
    if (!cedearsTbody) return;
    var filtered = getFilteredItems();

    if (!filtered.length) {
      cedearsTbody.innerHTML =
        '<tr><td colspan="5">No hay CEDEARs para esta categoría.</td></tr>';
      updateCedearsCount(0);
      return;
    }

    var rows = filtered.map(function (item) {
      return (
        '<tr>' +
        '<td><code>' + escapeHtml(item.Cedears) + '</code></td>' +
        '<td>' + escapeHtml(item.Name) + '</td>' +
        '<td>' + escapeHtml(item.Market) + '</td>' +
        '<td>' + escapeHtml(item.Ratio) + '</td>' +
        '<td class="cedears-tags-cell">' + renderTagsCell(item.tags) + '</td>' +
        '</tr>'
      );
    });

    cedearsTbody.innerHTML = rows.join('');
    updateCedearsCount(filtered.length);
  }

  function showCedearsError() {
    if (cedearsTbody) {
      cedearsTbody.innerHTML = '';
    }
    if (cedearsError) {
      cedearsError.hidden = false;
    }
    if (cedearsCount) {
      cedearsCount.textContent = '';
    }
  }

  function loadCedearsTable() {
    if (!cedearsTbody) return;

    fetchJson(URL_CEDEARS)
      .then(function (data) {
        cedearsItems = data && data.items ? data.items : [];
        if (!cedearsItems.length) {
          showCedearsError();
          return;
        }
        populateTagFilter(collectUniqueTags(cedearsItems));
        renderCedearsTable();
      })
      .catch(function () {
        showCedearsError();
      });
  }

  if (cedearsTagFilter) {
    cedearsTagFilter.addEventListener('change', renderCedearsTable);
  }

  loadCedearsTable();
})();
