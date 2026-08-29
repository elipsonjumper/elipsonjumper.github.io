const _a = document.getElementById('anio');
if (_a) _a.textContent = new Date().getFullYear();

/* ---- descenso por elevador espacial ---- */
(function(){
  const root  = document.documentElement;
  const val   = document.getElementById('altVal');
  const zone  = document.getElementById('altZone');
  if (!val || !zone) return;
  const quiet = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GEO   = 35786; // km, órbita geoestacionaria
  let pending = false;

  function capa(km){
    if (km > 20000) return 'Órbita geoestacionaria';
    if (km > 2000)  return 'Órbita media';
    if (km > 160)   return 'Órbita baja';
    if (km > 80)    return 'Termósfera';
    if (km > 50)    return 'Mesósfera';
    if (km > 12)    return 'Estratósfera';
    if (km > 0.05)  return 'Tropósfera';
    return 'Superficie';
  }

  function formato(km){
    if (km >= 100) return Math.round(km).toLocaleString('es-MX').replace(/,/g,' ');
    if (km >= 1)   return km.toFixed(1);
    return km.toFixed(2);
  }

  function actualizar(){
    pending = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const y = window.scrollY || window.pageYOffset;
    const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;

    root.style.setProperty('--p', p);
    root.style.setProperty('--stars', Math.max(0, 1 - p * 1.7));
    if (!quiet){
      root.style.setProperty('--tick', (-(y * 0.35) % 44) + 'px');
      root.style.setProperty('--drift', (-y * 0.06) + 'px');
    }

    // caída acelerada: la mayor parte del descenso ocurre al final
    const km = GEO * Math.pow(1 - p, 3);
    val.textContent = formato(km);
    zone.textContent = capa(km);
  }

  function pedir(){
    if (!pending){ pending = true; requestAnimationFrame(actualizar); }
  }

  window.addEventListener('scroll', pedir, {passive:true});
  window.addEventListener('resize', pedir);
  actualizar();
})();

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
}
