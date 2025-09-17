// ============================
// Emaye Andrew Portfolio — script.js
// Smooth scroll, active nav, animations, filtering, carousel, form validation, parallax
// ============================

const $ = (q,ctx=document)=>ctx.querySelector(q);
const $$ = (q,ctx=document)=>Array.from(ctx.querySelectorAll(q));

// Current year
$("#year").textContent = new Date().getFullYear();
$("#year2").textContent = new Date().getFullYear();

// Mobile menu toggle
const toggle = $(".nav__toggle");
const menu = $("#navMenu");
if (toggle){
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    // Animate burger
    const [a,b,c] = toggle.querySelectorAll("span");
    if (open){ a.style.transform="translateY(7px) rotate(45deg)"; b.style.opacity="0"; c.style.transform="translateY(-7px) rotate(-45deg)"; }
    else { a.style.transform=""; b.style.opacity="1"; c.style.transform=""; }
  });
}

// Smooth scroll for nav links
$$('[data-nav]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const id = link.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({behavior:"smooth", block:"start"});
    menu.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded","false");
  });
});

// Active menu state on scroll
const sections = $$('main .section');
const navLinks = $$('[data-nav]');
const observerActive = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      const id = entry.target.id;
      navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
    }
  });
}, { threshold: 0.6 });
sections.forEach(sec => observerActive.observe(sec));

// Intersection Observer for fade-up animations
const io = new IntersectionObserver((entries)=>{
  entries.forEach((entry)=>{
    if (entry.isIntersecting){
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
},{ threshold: 0.2, rootMargin: "0px 0px -40px 0px" });
$$('.fade-up').forEach(el => io.observe(el));

// Parallax effect for elements with .parallax
window.addEventListener('scroll', () => {
  const y = window.scrollY || window.pageYOffset;
  $$('.parallax').forEach(el => {
    el.style.transform = `translateY(${y * -0.05}px)`;
  });
}, { passive:true });

// Video modal
const videoBtn = $('.btn.btn--ghost[data-video]');
const modal = $('.video-modal');
if (videoBtn && modal){
  const video = $('video', modal);
  const open = () => {
    video.src = videoBtn.dataset.video;
    modal.hidden = false;
    setTimeout(()=> modal.classList.add('open'), 10);
  };
  const close = () => {
    modal.classList.remove('open');
    setTimeout(()=> { modal.hidden = true; video.pause(); video.src = ""; }, 200);
  };
  videoBtn.addEventListener('click', open);
  modal.addEventListener('click', e => { if (e.target.matches('[data-close], .video-modal')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });
}

// Portfolio filter
const chips = $$('.chip');
const items = $$('.portfolio-grid .card');
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('is-active'));
    chip.classList.add('is-active');
    const f = chip.dataset.filter;
    items.forEach(it => {
      const show = (f === 'all') || it.dataset.cat === f;
      it.style.display = show ? '' : 'none';
      if (show) { it.classList.add('in-view'); }
    });
  });
});

// Simple carousel
(function(){
  const track = $('.carousel__track');
  if (!track) return;
  const cards = $$('.tcard', track);
  const prev = $('.carousel__btn.prev');
  const next = $('.carousel__btn.next');
  let index = 0;
  const size = () => cards[0].getBoundingClientRect().width + 16;
  const go = (i) => {
    index = (i + cards.length) % cards.length;
    track.style.transform = `translateX(${-index * size()}px)`;
  };
  prev.addEventListener('click', ()=>go(index-1));
  next.addEventListener('click', ()=>go(index+1));
  let timer = setInterval(()=>go(index+1), 4000);
  track.addEventListener('pointerenter', ()=>clearInterval(timer));
  track.addEventListener('pointerleave', ()=>timer = setInterval(()=>go(index+1), 4000));
  window.addEventListener('resize', ()=>go(index));
})();

// Contact form validation (client-side demo)
$('#contactForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const name = $('#name').value.trim();
  const email = $('#email').value.trim();
  const message = $('#message').value.trim();
  let valid = true;

  const setError = (id, msg) => {
    const row = $(id).closest('.form__row');
    row.querySelector('.error').textContent = msg || '';
    if (msg) valid = false;
  };

  setError('#name', name ? '' : 'Your name is required.');
  setError('#email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Enter a valid email.');
  setError('#message', message.length >= 10 ? '' : 'Tell me a bit more (10+ chars).');

  if (valid){
    $('#formStatus').textContent = 'Thanks! Your message was validated locally. (Hook up your backend to send.)';
    e.target.reset();
    setTimeout(()=>$('#formStatus').textContent = '', 4000);
  }
});

// Lazy load (example enhancement if swapping to data-src images)
// const ioImg = new IntersectionObserver((entries, obs)=>{
//   entries.forEach(entry=>{
//     if (entry.isIntersecting){
//       const img = entry.target;
//       img.src = img.dataset.src;
//       obs.unobserve(img);
//     }
//   });
// });
// $$('img[data-src]').forEach(img=>ioImg.observe(img));
