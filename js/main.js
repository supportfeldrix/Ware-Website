/* ============================================================
   WARE — site interactions (vanilla JS, no dependencies)
   - Sticky nav shade on scroll
   - Mobile hamburger menu + dropdown expand
   - Smooth-scroll active link highlighting
   - Hero image rotator (01 / 02 / 03 + dots)
   - Testimonial carousel (mobile one-at-a-time)
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Sticky nav shade on scroll ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 20) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu toggle ---------- */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");

  toggle.addEventListener("click", function () {
    var open = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  /* On mobile, tapping a dropdown parent expands it instead of navigating */
  var dropParents = document.querySelectorAll(".nav__item--has-drop > .nav__link");
  dropParents.forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (window.matchMedia("(max-width: 820px)").matches) {
        e.preventDefault();
        var li = link.parentElement;
        var isOpen = li.classList.toggle("is-open");
        link.setAttribute("aria-expanded", isOpen ? "true" : "false");
      }
    });
  });

  /* Close the mobile menu after choosing a link */
  menu.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function () {
      if (!a.closest(".nav__item--has-drop") ||
          !window.matchMedia("(max-width: 820px)").matches) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      }
    });
  });

  /* ---------- Active link highlighting via scroll spy ---------- */
  var sections = Array.prototype.slice.call(
    document.querySelectorAll("main section[id]")
  );
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav__link[href^="#"]')
  );

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");
            navLinks.forEach(function (l) {
              l.classList.toggle(
                "is-active",
                l.getAttribute("href") === "#" + id
              );
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Hero rotator ---------- */
  var heroImgs = Array.prototype.slice.call(document.querySelectorAll(".hero__img"));
  var idxBtns = Array.prototype.slice.call(document.querySelectorAll(".hero__index-btn"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".hero__dot"));
  var heroCurrent = 0;
  var heroTimer = null;

  function showHero(i) {
    if (!heroImgs.length) return;
    heroCurrent = (i + heroImgs.length) % heroImgs.length;
    heroImgs.forEach(function (img, n) { img.classList.toggle("is-active", n === heroCurrent); });
    idxBtns.forEach(function (b, n) { b.classList.toggle("is-active", n === heroCurrent); });
    dots.forEach(function (d, n) { d.classList.toggle("is-active", n === heroCurrent); });
  }
  function nextHero() { showHero(heroCurrent + 1); }
  function startHero() {
    if (heroImgs.length < 2) return;
    stopHero();
    heroTimer = window.setInterval(nextHero, 5000);
  }
  function stopHero() { if (heroTimer) { window.clearInterval(heroTimer); heroTimer = null; } }

  idxBtns.concat(dots).forEach(function (btn) {
    btn.addEventListener("click", function () {
      showHero(parseInt(btn.getAttribute("data-slide"), 10) || 0);
      startHero();
    });
  });
  startHero();

  /* ---------- Testimonial carousel ---------- */
  var track = document.getElementById("tTrack");
  var prev = document.getElementById("tPrev");
  var next = document.getElementById("tNext");

  if (track && prev && next) {
    var quotes = Array.prototype.slice.call(track.querySelectorAll(".quote"));
    var tCurrent = 0;

    function isMobile() { return window.matchMedia("(max-width: 820px)").matches; }

    function renderQuotes() {
      if (isMobile()) {
        quotes.forEach(function (q, n) {
          q.style.display = n === tCurrent ? "block" : "none";
        });
      } else {
        // Desktop shows all three; arrows gently cycle emphasis
        quotes.forEach(function (q) { q.style.display = "block"; });
      }
    }

    next.addEventListener("click", function () {
      tCurrent = (tCurrent + 1) % quotes.length;
      renderQuotes();
    });
    prev.addEventListener("click", function () {
      tCurrent = (tCurrent - 1 + quotes.length) % quotes.length;
      renderQuotes();
    });

    window.addEventListener("resize", renderQuotes);
    renderQuotes();
  }

  /* ---------- Modals (Request a Quote + Our Story) ---------- */
  // Formspree endpoint for the WARE quote form.
  // Submissions are delivered to info@wareapparel.co.za (configured in the
  // Formspree dashboard for this form, not here).
  var FORMSPREE_URL = "https://formspree.io/f/xgaokbwd";

  var lastFocused = null;

  function openModalEl(el) {
    if (!el) return;
    lastFocused = document.activeElement;
    el.classList.add("is-open");
    el.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var first = el.querySelector('input, select, textarea, button');
    if (first) first.focus();
  }
  function closeModalEl(el) {
    if (!el) return;
    el.classList.remove("is-open");
    el.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }
  function closeAnyModal() {
    var open = document.querySelector(".modal.is-open");
    if (open) closeModalEl(open);
  }

  var modal = document.getElementById("kitModal");       // quote modal
  var storyModal = document.getElementById("storyModal"); // our story modal

  // Openers (buttons may close one modal via data-close AND open another)
  document.querySelectorAll("[data-open-kit]").forEach(function (o) {
    o.addEventListener("click", function (e) {
      e.preventDefault();
      closeAnyModal();
      openModalEl(modal);
    });
  });
  document.querySelectorAll("[data-open-story]").forEach(function (o) {
    o.addEventListener("click", function (e) {
      e.preventDefault();
      openModalEl(storyModal);
    });
  });

  // Any [data-close] inside any modal closes its own modal
  document.querySelectorAll(".modal [data-close]").forEach(function (c) {
    c.addEventListener("click", function () {
      var owner = c.closest(".modal");
      // data-open-kit buttons handle their own open after close, so only
      // close here when this isn't also an opener (avoids double toggle).
      if (!c.hasAttribute("data-open-kit")) closeModalEl(owner);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    // If the lightbox is open, let its own handler deal with Escape first.
    var lb = document.getElementById("lightbox");
    if (lb && lb.classList.contains("is-open")) return;
    closeAnyModal();
  });

  /* ---------- Info modal (FAQ, policies, guides) ----------
     Edit the text below to update any of these pages. FAQ renders as an
     accordion; the rest render as simple paragraphs. */
  var infoModal = document.getElementById("infoModal");
  var INFO = {
    faq: {
      eyebrow: "Support",
      title: "Frequently Asked Questions",
      faq: [
        ["Can I exchange items?", "We do not offer exchanges, but you're welcome to return your item(s) by mail in accordance with our Return Policy."],
        ["How long does it take?", "Approximately 3–4 weeks after design approval and payment."],
        ["Do you do custom designs?", "We do! Please contact us directly to discuss custom designs and orders."],
        ["Do your garments offer UV protection?", "Yes — our performance fabrics offer UV protection."]
      ]
    },
    sizeGuides: {
      eyebrow: "Support",
      title: "Size Guides",
      body: [
        "We offer a full range of sizes from junior to adult 5XL across all apparel lines.",
        "Detailed size charts (chest, waist and length measurements) are provided with every quote so your whole team gets the perfect fit.",
        "Not sure of sizes? Order a sizing set and we'll send sample garments to measure against before you commit to a full order."
      ]
    },
    artwork: {
      eyebrow: "Support",
      title: "Artwork Process",
      body: [
        "Send us your logo, crest or design idea — vector files (AI, EPS, PDF or SVG) give the sharpest results, but we can work from high-resolution images too.",
        "Our design team prepares a digital mock-up of your kit for approval before anything goes into production.",
        "You review, request any changes, and give final sign-off. Production only begins once you're 100% happy and payment is confirmed."
      ]
    },
    care: {
      eyebrow: "Support",
      title: "Care Instructions",
      body: [
        "Machine wash cold (max 30°C) with similar colours. Turn garments inside out to protect printed and embroidered areas.",
        "Do not bleach. Do not iron directly over prints, badges or embroidery.",
        "Hang to dry where possible; avoid tumble drying on high heat to preserve fit and finish."
      ]
    },
    returns: {
      eyebrow: "Policies",
      title: "Returns Policy",
      body: [
        "Custom and personalised items are made to order and generally cannot be exchanged.",
        "If there's a fault or an error on our part, contact us within 7 days of delivery and we'll put it right.",
        "Returns by mail are handled in accordance with this policy — please contact us before sending anything back."
      ]
    },
    terms: {
      eyebrow: "Legal",
      title: "Terms & Conditions",
      body: [
        "These terms govern orders placed with WARE. Placing an order constitutes acceptance of these terms.",
        "Quotes are valid for 30 days. Production timelines begin from design approval and confirmed payment.",
        "All custom artwork remains subject to approval; WARE is not liable for errors approved by the customer at sign-off."
      ]
    },
    privacy: {
      eyebrow: "Legal",
      title: "Privacy Policy",
      body: [
        "We collect only the information needed to process your enquiry and order — name, contact details and the artwork you share with us.",
        "Your information is never sold. It's used solely to communicate with you and fulfil your order.",
        "You may request access to, or deletion of, your personal information at any time by contacting us."
      ]
    }
  };

  if (infoModal) {
    var infoEyebrow = document.getElementById("infoModalEyebrow");
    var infoTitle = document.getElementById("infoModalTitle");
    var infoBody = document.getElementById("infoModalBody");

    function renderInfo(key) {
      var data = INFO[key];
      if (!data) return;
      infoEyebrow.textContent = data.eyebrow || "WARE";
      infoTitle.textContent = data.title || "";
      infoBody.innerHTML = "";

      if (data.faq) {
        var list = document.createElement("div");
        list.className = "faq";
        data.faq.forEach(function (pair) {
          var item = document.createElement("div");
          item.className = "faq__item";
          var btn = document.createElement("button");
          btn.className = "faq__q";
          btn.type = "button";
          btn.setAttribute("aria-expanded", "false");
          btn.innerHTML = pair[0] + '<span class="faq__icon" aria-hidden="true">+</span>';
          var ans = document.createElement("div");
          ans.className = "faq__a";
          ans.innerHTML = "<p>" + pair[1] + "</p>";
          btn.addEventListener("click", function () {
            var open = item.classList.toggle("is-open");
            btn.setAttribute("aria-expanded", open ? "true" : "false");
          });
          item.appendChild(btn);
          item.appendChild(ans);
          list.appendChild(item);
        });
        infoBody.appendChild(list);
      } else if (data.body) {
        data.body.forEach(function (p) {
          var para = document.createElement("p");
          para.textContent = p;
          infoBody.appendChild(para);
        });
      }
    }

    document.querySelectorAll("[data-open-info]").forEach(function (o) {
      o.addEventListener("click", function (e) {
        e.preventDefault();
        renderInfo(o.getAttribute("data-open-info"));
        openModalEl(infoModal);
      });
    });
  }

  /* ---------- Gallery modal + lightbox ---------- */
  var galleryModal = document.getElementById("galleryModal");
  if (galleryModal) {
    var galleryGrid = document.getElementById("galleryGrid");
    var lightbox = document.getElementById("lightbox");
    var lbImg = document.getElementById("lbImg");
    var lbPrev = document.getElementById("lbPrev");
    var lbNext = document.getElementById("lbNext");
    var lbClose = document.getElementById("lbClose");

    // Collect the image sources straight from the on-page gallery so the
    // modal always matches whatever photos are in that section.
    var pageImgs = Array.prototype.slice.call(document.querySelectorAll(".gallery .gallery__item img"));
    var sources = pageImgs.map(function (im) { return { src: im.getAttribute("src"), alt: im.getAttribute("alt") || "WARE gallery image" }; });
    var lbIndex = 0;

    // Build the modal grid once.
    sources.forEach(function (s, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", "View " + s.alt);
      var im = document.createElement("img");
      im.src = s.src; im.alt = s.alt;
      // keep the same stock fallback behaviour as the page images
      im.onerror = (function (idx) {
        return function () {
          this.onerror = null;
          var original = pageImgs[idx];
          if (original && original.src) this.src = original.src;
        };
      })(i);
      btn.appendChild(im);
      btn.addEventListener("click", function () { openLightbox(i); });
      galleryGrid.appendChild(btn);
    });

    function openLightbox(i) {
      lbIndex = (i + sources.length) % sources.length;
      // Use whatever the grid actually resolved to (handles fallbacks).
      var gridImgs = galleryGrid.querySelectorAll("img");
      lbImg.src = gridImgs[lbIndex] ? gridImgs[lbIndex].src : sources[lbIndex].src;
      lbImg.alt = sources[lbIndex].alt;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
    }
    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
    }
    function step(dir) { openLightbox(lbIndex + dir); }

    lbPrev.addEventListener("click", function () { step(-1); });
    lbNext.addEventListener("click", function () { step(1); });
    lbClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox(); // click backdrop to close
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    });

    document.querySelectorAll("[data-open-gallery]").forEach(function (o) {
      o.addEventListener("click", function (e) {
        e.preventDefault();
        closeAnyModal();
        openModalEl(galleryModal);
      });
    });
  }

  if (modal) {
    /* ----- Submit the quote request to Formspree -----
       FormData is used so an uploaded design file is included. */
    var form = document.getElementById("kitForm");
    var statusEl = document.getElementById("kitStatus");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        statusEl.className = "kit__status is-loading";
        statusEl.textContent = "Sending your request…";

        var data = new FormData(form);
        fetch(FORMSPREE_URL, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" }
        })
          .then(function (res) {
            if (res.ok) {
              statusEl.className = "kit__status is-success";
              statusEl.textContent = "Thanks! Your quote request is on its way. We'll be in touch shortly.";
              form.reset();
            } else {
              return res.json().then(function (d) {
                throw new Error(d && d.errors ? d.errors.map(function (x) { return x.message; }).join(", ") : "Submit failed");
              });
            }
          })
          .catch(function (err) {
            statusEl.className = "kit__status is-error";
            statusEl.textContent = "Something went wrong — please email info@wareapparel.co.za or try again. (" + err.message + ")";
          });
      });
    }
  }
})();
