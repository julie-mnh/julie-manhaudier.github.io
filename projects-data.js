/* ════════════════════════════════════
   PROJECTS — shared data + card renderer
   Used by index.html (featured only) and projects.html (full list)
   ════════════════════════════════════ */

const PROJECTS_DATA = [
  { title: 'Carousels',                          image: 'Media/cover-carrou.png',      slug: 'carousels',                          featured: false },
  { title: 'Rendez-vous', subtitle: 'The interview series', image: 'Media/cover_rendezvousvignette.jpeg',  slug: 'rendez-vous',                        featured: true  },
  { title: 'Summer Courses Campaign',            image: 'Media/cover-pub.png',         slug: 'summer-courses-campaign',            featured: true  },
  { title: 'Educational and Cultural Content',   image: 'Media/cover-trott.png',       slug: 'educational-and-cultural-content',   featured: true  },
];

function renderProjectCards(containerId, { featuredOnly = false } = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const list = featuredOnly ? PROJECTS_DATA.filter(p => p.featured) : PROJECTS_DATA;

  container.innerHTML = list.map(p => `
    <a class="project-card reveal-up" href="projects/${p.slug}.html">
      <div class="project-card-media">
        <img src="${p.image}" alt="${p.title}" />
      </div>
      <h4 class="project-card-title">${p.title}</h4>
      ${p.subtitle ? `<span class="project-card-subtitle">${p.subtitle}</span>` : ''}
      <span class="project-card-link">View Project →</span>
    </a>
  `).join('');
}
