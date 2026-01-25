const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const themeToggle = document.getElementById("theme-toggle");
const downloadCVBtn = document.getElementById("btn-download-cv");

// Theme Management
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem("theme") || "light";
    this.init();
  }

  init() {
    this.setTheme(this.theme);
    themeToggle.addEventListener("click", () => this.toggleTheme());
  }

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  toggleTheme() {
    const newTheme = this.theme === "light" ? "dark" : "light";
    this.setTheme(newTheme);
  }
}

// Navigation Management
class NavigationManager {
  constructor() {
    this.scrollProgress = null;
    this.init();
  }

  init() {
    this.scrollProgress = document.createElement("div");
    this.scrollProgress.className = "scroll-progress";
    this.setupProgressBar();
    this.setupMobileMenu();
    this.setupScrollEffects();
    this.setupSmoothScrolling();
    this.setupActiveLinks();
    this.setupNavLinksAnimation();
  }

  setupMobileMenu() {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      navToggle.classList.toggle("active");
    });

    // Close mobile menu when clicking on links
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navbar.contains(e.target)) {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
      }
    });
  }

  setupProgressBar() {
    this.scrollProgress.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: var(--gradient-primary);
    z-index: 1500;
    transition: width 0.1s ease;
   `;
    document.body.appendChild(this.scrollProgress);
  }

  setupScrollEffects() {
    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }

      // progress bar
      const scrollTop = window.pageYOffset;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      this.scrollProgress.style.width = scrollPercent + "%";
    });
  }

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          const offsetTop = target.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
        }
      });
    });
  }

  setupNavLinksAnimation() {
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item, index) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(-30px)";
      item.style.transition = "all 0.5s ease";

      setTimeout(() => {
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      }, 100 + index * 100);
    });
  }

  setupActiveLinks() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY + 100;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${sectionId}`) {
              link.classList.add("active");
            }
          });
        }
      });
    });
  }
}

class ExperienceManager {
  constructor() {
    this.navItems = document.querySelectorAll(".exp-nav-item");
    this.details = document.querySelectorAll(".exp-detail");
    if (this.navItems.length === 0) return;
    this.init();
  }

  init() {
    // 1. Click Handling: Smooth Scroll
    this.navItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = item.getAttribute("data-id");
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          this.isManualScroll = true;
          
          const offsetTop = targetSection.getBoundingClientRect().top + window.scrollY - 150;
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth"
          });

          this.updateActiveState(targetId);

          setTimeout(() => {
            this.isManualScroll = false;
          }, 1000);
        }
      });
    });

    this.visibleSections = new Map();
    this.isManualScroll = false;

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", 
      threshold: [0, 0.25, 0.5, 0.75, 1]
    };

    const observer = new IntersectionObserver((entries) => {
      if (this.isManualScroll) return;

      entries.forEach((entry) => {
        this.visibleSections.set(entry.target.id, entry.intersectionRatio);
      });

      this.determineActiveSection();
    }, observerOptions);

    this.details.forEach((detail) => observer.observe(detail));
  }

  determineActiveSection() {
    let maxRatio = 0;
    let activeId = null;

    for (const [id, ratio] of this.visibleSections) {
      if (ratio > maxRatio) {
        maxRatio = ratio;
        activeId = id;
      }
    }

    if (activeId && maxRatio > 0.1) {
       this.updateActiveState(activeId);
    }
  }

  updateActiveState(activeId) {
    this.navItems.forEach((item) => {
      item.classList.remove("active");
      if (item.getAttribute("data-id") === activeId) {
        item.classList.add("active");
        
        if (window.innerWidth < 768) {
             item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }
    });

    this.details.forEach((detail) => {
        detail.classList.remove("active");
        if (detail.getAttribute("id") === activeId) {
            detail.classList.add("active");
        }
    });
  }
}

// Animation Manager
class AnimationManager {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -150px 0px",
    };
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupIntersectionObserver();
    this.setupCounterAnimation();
    this.setupRippleEffectContact();
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          if (entry.target.classList.contains("stagger-parent")) {
            this.animateChildren(entry.target);
          }

          if (entry.target.classList.contains("contact-card")) {
            let delay = 0;

            document
              .querySelectorAll(".contact-card")
              .forEach((card, index) => {
                card.classList.remove("scale-in");
                card.classList.remove("visible");
                delay += index * 0.15;
              });

            setTimeout(() => {
              document.querySelectorAll(".contact-card").forEach((card) => {
                card.removeAttribute("style");
              });
            }, delay * 1000);
          }

          if (entry.target.classList.contains("project-card")) {
            let delay = 0;

            document
              .querySelectorAll(".project-card")
              .forEach((card, index) => {
                card.classList.remove("fade-in");
                card.classList.remove("visible");
                delay += index * 0.1;
              });

            setTimeout(() => {
              document.querySelectorAll(".project-card").forEach((card) => {
                card.removeAttribute("style");
              });
            }, delay * 1000);
          }
        }
      });
    }, this.observerOptions);

    document
      .querySelectorAll(".fade-in, .slide-in-left, .slide-in-right, .scale-in")
      .forEach((el) => {
        observer.observe(el);
      });
  }

  setupCounterAnimation() {
    const counters = document.querySelectorAll(".hero-stats .stat");

    counters.forEach((counter) => {
      const target = Number.parseInt(counter.getAttribute("data-count"))
      const numberElement = counter.querySelector(".stat-number")

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateCounter(counter, target, numberElement)
            observer.unobserve(counter)
          }
        })
      })

      observer.observe(counter)
    })
  }

  animateCounter(element, target, numberElement) {
    let current = 0
    const increment = target / 100
    const duration = 2000
    const stepTime = duration / 100

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(timer)
      }

      const suffix = element.querySelector(".stat-number").textContent.includes("%")
        ? "%"
        : element.querySelector(".stat-number").textContent.includes("+")
          ? "+"
          : ""

      numberElement.textContent = Math.floor(current) + suffix
    }, stepTime)
  }

  setupScrollAnimations() {
    document.querySelectorAll(".experience-card").forEach((card, index) => {
      card.classList.add(index % 2 === 0 ? "slide-in-left" : "slide-in-right");
    });

    document.querySelectorAll(".project-card").forEach((card, index) => {
      card.classList.add("fade-in");
      card.style.transitionDelay = `${index * 0.1}s`;
    });

    document.querySelectorAll(".contact-card").forEach((card, index) => {
      card.classList.add("scale-in");
      card.style.transitionDelay = `${index * 0.15}s`;
    });
  }

  animateChildren(parent) {
    const children = parent.querySelectorAll(".animate-child");
    children.forEach((child, index) => {
      setTimeout(() => {
        child.classList.add("visible");
      }, index * 100);
    });
  }

  setupRippleEffectContact() {
    const contactCards = document.querySelectorAll(".contact-card");

    contactCards.forEach((card, index) => {
      card.addEventListener("mouseenter", (e) => {
        const ripple = document.createElement("div")
        ripple.style.cssText = `
          position: absolute;
          border-radius: 50%;
          background: rgba(66, 211, 146, 0.3);
          transform: scale(0);
          animation: contactRipple 0.6s linear;
          pointer-events: none;
          z-index: 0;
        `

        const rect = card.getBoundingClientRect()
        const size = Math.max(rect.width, rect.height)
        ripple.style.width = ripple.style.height = size + "px"
        ripple.style.left = "50%"
        ripple.style.top = "50%"
        ripple.style.transform = "translate(-50%, -50%) scale(0)"

        card.appendChild(ripple)

        setTimeout(() => {
          ripple.remove()
        }, 600)
      })
    })
  }
}

// Greeting Animation Manager
class GreetingManager {
  constructor() {
    this.greetings = [
      "Hello",
      "Halo",
      "Bonjour",
      "Hola",
      "Ciao",
      "Konnichiwa",
      "Annyeong",
      "Namaste",
    ];
    this.current = 0;
    this.element = document.getElementById("greeting-text");
    if (!this.element) return;
    this.init();
  }

  init() {
    setInterval(() => this.next(), 2500);
  }

  next() {
    this.element.classList.add("fade-out");
    setTimeout(() => {
      this.current = (this.current + 1) % this.greetings.length;
      this.element.textContent = this.greetings[this.current];
      this.element.classList.remove("fade-out");
      this.element.classList.add("fade-in");
    }, 300);
    setTimeout(() => {
      this.element.classList.remove("fade-in");
    }, 600);
  }
}

// Initialize all managers when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ThemeManager();
  new NavigationManager();
  new AnimationManager();
  new GreetingManager();
  new ExperienceManager();

  const blurBackdrop = document.querySelector(".backdrop");

  downloadCVBtn.addEventListener("click", (e) => {
    e.preventDefault();

    fetch("CV_Hafidz_Ridwan_Cahya.pdf", { method: "HEAD" })
      .then((res) => {
        if (res.ok) {
          const link = document.createElement("a");
          link.href = "CV_Hafidz_Ridwan_Cahya.pdf";
          link.download = "CV_Hafidz_Ridwan_Cahya.pdf";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          alert("CV not available yet. Please contact me directly.");
        }
      })
      .catch(() => {
        alert(
          "CV download failed or not available. Please contact me directly."
        );
      });
  });

  setTimeout(() => {
    blurBackdrop.style.opacity = "0";
  }, 250);
});
