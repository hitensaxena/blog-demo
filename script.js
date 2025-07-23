/*
  script.js

  Provides interactivity for the Inner Reflections blog:
  - Mobile navigation toggle
  - Dark mode toggle with persistence
  - Newsletter subscription form handler
  - Dynamic table of contents generation for blog posts
*/

document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  navToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Dark mode toggle
  const darkModeToggle = document.getElementById('darkModeToggle');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Apply saved theme preference or system preference
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
    document.body.classList.add('dark-mode');
  }

  darkModeToggle?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    // Save preference
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Newsletter subscription handler
  const subscribeForm = document.getElementById('subscribeForm');
  subscribeForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = subscribeForm.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    if (email) {
      // Display a simple thank-you message
      alert(`Thank you for subscribing, ${email}! We'll send you our next reflection soon.`);
      emailInput.value = '';
    }
  });

  // Build table of contents if on a blog post page
  if (document.querySelector('.blog-post')) {
    buildTOC();
  }

  // Fade-in sections using IntersectionObserver
  const fadeSections = document.querySelectorAll('.fade-section');
  if (fadeSections.length) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    fadeSections.forEach((section) => io.observe(section));
  }

  // Quote slider on the landing page
  const quoteSlides = document.querySelectorAll('.quotes-section .quote-slide');
  if (quoteSlides.length > 1) {
    let currentQuote = 0;
    setInterval(() => {
      // Hide current
      quoteSlides[currentQuote].classList.remove('active');
      // Advance index
      currentQuote = (currentQuote + 1) % quoteSlides.length;
      // Show next
      quoteSlides[currentQuote].classList.add('active');
    }, 8000);
  }

  // Reading progress bar for blog posts
  if (document.querySelector('.blog-post')) {
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    document.body.appendChild(progressBar);
    const updateProgress = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const percent = (scrollTop / height) * 100;
      progressBar.style.width = `${percent}%`;
    };
    window.addEventListener('scroll', updateProgress);
    updateProgress();
  }
});

// Function to build a dynamic table of contents for blog posts
function buildTOC() {
  const tocContainer = document.getElementById('toc');
  const content = document.querySelector('.post-body');
  if (!tocContainer || !content) return;

  // Collect headings (h2 and h3) within the post body
  const headings = content.querySelectorAll('h2, h3');
  if (!headings.length) return;

  // Create list
  const tocList = document.createElement('ul');
  tocContainer.innerHTML = '<h3>Contents</h3>';
  tocContainer.appendChild(tocList);

  headings.forEach((heading) => {
    // Create an id if none exists
    if (!heading.id) {
      heading.id = heading.textContent.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
    }
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.textContent = heading.textContent;
    link.href = `#${heading.id}`;
    listItem.appendChild(link);
    tocList.appendChild(listItem);
  });
}