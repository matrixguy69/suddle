// progress bar
window.addEventListener('scroll', ()=>{
  const h = document.documentElement;
  const pct = (h.scrollTop)/(h.scrollHeight - h.clientHeight)*100;
  const bar = document.getElementById('progress');
  if(bar) bar.style.width = pct + '%';
});

// cursor glow
const glow = document.getElementById('glow');
if(glow){
  window.addEventListener('mousemove', (e)=>{
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

// 3D tilt hero (if present)
const stage = document.getElementById('stage');
const heroRight = document.querySelector('.hero-right');
if(stage && heroRight){
  heroRight.addEventListener('mousemove', (e)=>{
    const rect = heroRight.getBoundingClientRect();
    const x = (e.clientX - rect.left)/rect.width - 0.5;
    const y = (e.clientY - rect.top)/rect.height - 0.5;
    stage.style.transform = `rotateY(${-18 + x*24}deg) rotateX(${10 - y*24}deg)`;
  });
  heroRight.addEventListener('mouseleave', ()=>{
    stage.style.transform = 'rotateY(-18deg) rotateX(10deg)';
  });
}

// scroll reveal
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); } });
}, {threshold:0.15});
document.querySelectorAll('.reveal, .reveal-l, .reveal-r, .proc-step').forEach(el=>io.observe(el));

// counters
const counters = document.querySelectorAll('[data-count]');
const counted = new WeakSet();
const cio = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting && !counted.has(e.target)){
      counted.add(e.target);
      const target = parseInt(e.target.dataset.count, 10);
      let cur = 0;
      const step = Math.max(1, Math.floor(target/60));
      const t = setInterval(()=>{
        cur += step;
        if(cur >= target){ cur = target; clearInterval(t); }
        e.target.textContent = cur.toLocaleString() + '+';
      }, 20);
    }
  });
}, {threshold:0.5});
counters.forEach(c=>cio.observe(c));

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item=>{
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', ()=>{
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i=>{ i.classList.remove('open'); i.querySelector('.faq-a').style.maxHeight = null; });
    if(!isOpen){ item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
  });
});

// contact form (Formspree integration)
const demoForm = document.getElementById('demoForm');
if(demoForm){
  demoForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const btn = demoForm.querySelector('.submit-btn');
    const original = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    
    try {
      const response = await fetch(demoForm.action, {
        method: 'POST',
        body: new FormData(demoForm),
        headers: { 'Accept': 'application/json' }
      });
      
      if(response.ok){
        btn.textContent = 'Sent Successfully!';
        btn.style.background = '#10b981';
        demoForm.reset();
        setTimeout(()=>{ 
          btn.textContent = original; 
          btn.style.background = ''; 
          btn.style.opacity = '1';
          btn.disabled = false;
        }, 3000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch(err) {
      btn.textContent = 'Error - Try Again';
      btn.style.background = '#ef4444';
      setTimeout(()=>{ 
        btn.textContent = original; 
        btn.style.background = ''; 
        btn.style.opacity = '1';
        btn.disabled = false;
      }, 3000);
    }
  });
}
