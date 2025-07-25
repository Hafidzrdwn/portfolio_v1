// DOM Elements
const navbar = document.getElementById("navbar")
const navToggle = document.getElementById("nav-toggle")
const navMenu = document.getElementById("nav-menu")
const themeToggle = document.getElementById("theme-toggle")

// Theme Management
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem("theme") || "light"
    this.init()
  }

  init() {
    this.setTheme(this.theme)
    themeToggle.addEventListener("click", () => this.toggleTheme())
  }

  setTheme(theme) {
    this.theme = theme
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }

  toggleTheme() {
    const newTheme = this.theme === "light" ? "dark" : "light"
    this.setTheme(newTheme)
  }
}

// Navigation Management
class NavigationManager {
  constructor() {
    this.init()
  }

  init() {
    this.setupMobileMenu()
    this.setupScrollEffects()
    this.setupSmoothScrolling()
    this.setupActiveLinks()
  }

  setupMobileMenu() {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active")
      navToggle.classList.toggle("active")
    })

    // Close mobile menu when clicking on links
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active")
        navToggle.classList.remove("active")
      })
    })

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navbar.contains(e.target)) {
        navMenu.classList.remove("active")
        navToggle.classList.remove("active")
      }
    })
  }

  setupScrollEffects() {
    let lastScrollY = window.scrollY

    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY

      // Add scrolled class for styling
      if (currentScrollY > 50) {
        navbar.classList.add("scrolled")
      } else {
        navbar.classList.remove("scrolled")
      }

      lastScrollY = currentScrollY
    })
  }

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault()
        const target = document.querySelector(anchor.getAttribute("href"))
        if (target) {
          const offsetTop = target.offsetTop - 80
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          })
        }
      })
    })
  }

  setupActiveLinks() {
    const sections = document.querySelectorAll("section[id]")
    const navLinks = document.querySelectorAll(".nav-link")

    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY + 100

      sections.forEach((section) => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight
        const sectionId = section.getAttribute("id")

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLinks.forEach((link) => {
            link.classList.remove("active")
            if (link.getAttribute("href") === `#${sectionId}`) {
              link.classList.add("active")
            }
          })
        }
      })
    })
  }
}

// Animation Manager
class AnimationManager {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
    this.init()
  }

  init() {
    this.setupScrollAnimations()
    this.setupIntersectionObserver()
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")

          // Special handling for staggered animations
          if (entry.target.classList.contains("stagger-parent")) {
            this.animateChildren(entry.target)
          }
        }
      })
    }, this.observerOptions)

    // Observe elements with animation classes
    document.querySelectorAll(".fade-in, .slide-in-left, .slide-in-right").forEach((el) => {
      observer.observe(el)
    })
  }

  setupScrollAnimations() {
    // Add animation classes to elements
    document.querySelectorAll(".experience-card").forEach((card, index) => {
      card.classList.add("fade-in")
      card.style.animationDelay = `${index * 0.2}s`
    })

    document.querySelectorAll(".project-card").forEach((card, index) => {
      card.classList.add("fade-in")
      card.style.animationDelay = `${index * 0.15}s`
    })

    document.querySelectorAll(".contact-item").forEach((item, index) => {
      item.classList.add("slide-in-left")
      item.style.animationDelay = `${index * 0.1}s`
    })
  }

  animateChildren(parent) {
    const children = parent.querySelectorAll(".animate-child")
    children.forEach((child, index) => {
      setTimeout(() => {
        child.classList.add("visible")
      }, index * 100)
    })
  }
}

// Performance Manager
class PerformanceManager {
  constructor() {
    this.init()
  }

  init() {
    this.setupLazyLoading()
    this.setupPreloading()
  }

  setupLazyLoading() {
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.classList.remove("lazy")
              imageObserver.unobserve(img)
            }
          }
        })
      })

      document.querySelectorAll("img[data-src]").forEach((img) => {
        imageObserver.observe(img)
      })
    }
  }

  setupPreloading() {
    // Preload critical resources
    const criticalImages = ["https://placehold.co/300x300", "https://placehold.co/400x600"]

    criticalImages.forEach((src) => {
      const link = document.createElement("link")
      link.rel = "preload"
      link.as = "image"
      link.href = src
      document.head.appendChild(link)
    })
  }
}

// Initialize all managers when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ThemeManager()
  new NavigationManager()
  new AnimationManager()
  new PerformanceManager()

  // Add loading animation
  document.body.style.opacity = "0"
  document.body.style.transition = "opacity 0.5s ease"

  setTimeout(() => {
    document.body.style.opacity = "1"
  }, 100)
})

// Add additional CSS animations
const additionalStyles = document.createElement("style")
additionalStyles.textContent = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
`
document.head.appendChild(additionalStyles)
