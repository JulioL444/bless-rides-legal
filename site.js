(() => {
  const header = document.querySelector('.site-header');
  if (header) {
    const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  const tocLinks = [...document.querySelectorAll('.toc a[href^="#"]')];
  const sections = tocLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (tocLinks.length && sections.length && 'IntersectionObserver' in window) {
    const linkById = new Map(tocLinks.map(link => [link.getAttribute('href').slice(1), link]));
    let activeId = sections[0].id;

    const setActive = (id) => {
      if (!id || id === activeId) return;
      activeId = id;
      tocLinks.forEach(link => link.classList.toggle('is-active', link === linkById.get(id)));
    };

    tocLinks[0].classList.add('is-active');
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) setActive(visible[0].target.id);
    }, { rootMargin: '-105px 0px -62% 0px', threshold: [0, 0.01] });

    sections.forEach(section => observer.observe(section));
  }
})();
