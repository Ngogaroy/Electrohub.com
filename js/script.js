// This whole script waits for the HTML document to be fully loaded and parsed
// before trying to do anything. This is a good practice to make sure all elements
// we want to interact with are actually available.
document.addEventListener("DOMContentLoaded", () => {

    // --- Welcome Screen Hiding Logic ---
    // This part waits for *everything* on the page (like images and stylesheets) to load.
    // It's nested inside DOMContentLoaded, which means the basic HTML structure is ready first,
    // and then this waits for all the other bits and pieces.
    // This is often used if, for example, the welcome screen's fade-out shouldn't happen
    // until all visual assets are fully loaded.
    window.onload = () => {
        const welcomeScreen = document.getElementById('welcomeScreen');
        // If we found the welcome screen element...
        if (welcomeScreen) {
            // ...add a 'hidden' class, which presumably triggers a fade-out animation or makes it disappear.
            welcomeScreen.classList.add('hidden');
        }
        // Any other logic that needs to run ONLY after EVERYTHING is loaded (e.g., complex third-party scripts)
        // could go here.
    };

    // --- Testimonial Slider Logic ---
    // Let's grab all the elements we need for the testimonial slider.
    const cards = document.querySelectorAll(".testimonial-cards .card"); // These are the individual testimonial items.
    const prevBtn = document.getElementById("prev-btn"); // The button to go to the previous testimonial.
    const nextBtn = document.getElementById("next-btn"); // The button to go to the next testimonial.

    // This will keep track of which testimonial card is currently the first one visible.
    let currentIndex = 0;

    // This function figures out how many testimonial cards should be visible at once,
    // depending on how wide the screen is. It helps make the slider responsive.
    function getVisibleCount() {
        if (window.innerWidth <= 768) { // Smaller screens (like phones)
            return 1; // Show one card.
        } else if (window.innerWidth <= 1024) { // Medium screens (like tablets)
            return 2; // Show two cards.
        } else { // Larger screens (desktops)
            return 2; // Show two cards by default on bigger displays.
        }
    }

    // This function updates which cards are actually shown on the screen.
    function showCards() {
        const visibleCount = getVisibleCount(); // First, how many should we be showing?

        // Go through each card...
        cards.forEach((card, i) => {
            card.classList.remove("visible"); // Hide it by default.
            // Then, if this card falls within the current 'window' of visible cards...
            if (i >= currentIndex && i < currentIndex + visibleCount) {
                card.classList.add("visible"); // ...make it visible.
            }
        });

        // Now, let's manage the previous/next buttons.
        // We don't want the 'previous' button to be clickable if we're at the very beginning.
        if (prevBtn) {
            prevBtn.disabled = currentIndex === 0;
        }
        // And the 'next' button shouldn't be clickable if we're showing the last possible set of cards.
        if (nextBtn) {
            nextBtn.disabled = currentIndex + visibleCount >= cards.length;
        }
    }

    // When the 'previous' button is clicked...
    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            const visibleCount = getVisibleCount();
            // Move the currentIndex back, but don't go below zero.
            currentIndex = Math.max(currentIndex - visibleCount, 0);
            showCards(); // And update the display.
        });
    }

    // When the 'next' button is clicked...
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            const visibleCount = getVisibleCount();
            // Move the currentIndex forward, but don't go too far past the end.
            currentIndex = Math.min(currentIndex + visibleCount, cards.length - visibleCount);
            showCards(); // And update the display.
        });
    }

    // If the browser window gets resized, we need to recalculate and update the slider.
    window.addEventListener("resize", showCards);

    // Let's show the initial set of cards when the page loads.
    showCards();

    // --- Mobile Navigation Toggle Logic ---
    // This is for the hamburger menu or similar toggle for mobile navigation.
    const navToggle = document.querySelector('.nav-toggle'); // The button itself.
    const dropdownMenu = document.getElementById('dropdownMenu'); // The menu that appears/disappears.

    // Only set up listeners if we actually found both the toggle button and the menu.
    if (navToggle && dropdownMenu) {
        navToggle.addEventListener('click', function() {
            // When the toggle is clicked, add or remove the 'active' class on the menu.
            // This class is usually what CSS uses to show/hide the menu.
            dropdownMenu.classList.toggle('active');

            // For accessibility, we update the aria-expanded attribute.
            // This tells screen readers whether the menu section is currently open or closed.
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
        });

        // Nice touch: if the user clicks anywhere outside the dropdown menu or the toggle button,
        // let's close the menu if it's open.
        document.addEventListener('click', function(event) {
            // Check if the click was *not* inside the menu and *not* on the toggle button.
            if (!dropdownMenu.contains(event.target) && !navToggle.contains(event.target)) {
                if (dropdownMenu.classList.contains('active')) {
                    dropdownMenu.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false'); // Reset ARIA state too.
                }
            }
        });

        // Another good UX feature: if a user clicks a link *inside* the dropdown,
        // it probably means they've made their choice, so let's close the menu.
        dropdownMenu.querySelectorAll('.dropdown-item').forEach(link => {
            link.addEventListener('click', () => {
                if (dropdownMenu.classList.contains('active')) { // Only if it's open
                    dropdownMenu.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // --- FAQ Accordion Logic ---
    // Get all the clickable question elements in the FAQ section.
    const faqQuestions = document.querySelectorAll(".faq-question");

    faqQuestions.forEach(question => {
        question.addEventListener("click", () => {
            // Find the parent '.faq-item' for the clicked question. This usually contains both the question and answer.
            const faqItem = question.closest(".faq-item");

            // This part makes it so only one FAQ answer is open at a time.
            // If you want to allow multiple answers to be open, you can remove this loop.
            document.querySelectorAll(".faq-item.active").forEach(item => {
                // If this 'item' is currently active but isn't the one we just clicked...
                if (item !== faqItem) {
                    item.classList.remove("active"); // ...close it.
                    // Resetting max-height is important for the smooth CSS transition if the user reopens it.
                    item.querySelector('.faq-answer').style.maxHeight = null;
                    item.querySelector('.faq-answer').style.paddingBottom = '0';
                }
            });

            // Now, toggle the 'active' state for the FAQ item that was actually clicked.
            faqItem.classList.toggle("active");

            // This handles the smooth slide-down/slide-up animation for the answer.
            const faqAnswer = faqItem.querySelector(".faq-answer");
            if (faqItem.classList.contains("active")) {
                // If we just opened it, set max-height to its full scrollable height.
                // This allows the CSS transition to animate the height smoothly.
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + "px";
                faqAnswer.style.paddingBottom = "20px"; // Maybe add some padding when it's open.
            } else {
                // If we just closed it, reset max-height so it collapses.
                faqAnswer.style.maxHeight = null;
                faqAnswer.style.paddingBottom = "0"; // Remove padding when closed.
            }
        });
    });

    // --- Resources Pagination Script ---
    // Let's find the container that holds all our resource cards.
    const resourceCardsContainer = document.querySelector('.resource-cards');

    // Only run this pagination stuff if the container actually exists on the page.
    if (resourceCardsContainer) {
        // Get all the direct children of the container (these should be the cards)
        // and turn them into a real array so we can easily work with them.
        const resourceCards = Array.from(resourceCardsContainer.children);
        const prevResourceBtn = document.getElementById('prevResource'); // 'Previous page' button for resources.
        const nextResourceBtn = document.getElementById('nextResource'); // 'Next page' button.

        const cardsPerPage = 3; // We'll show 3 resource cards on each "page".
        let currentResourcePage = 1; // Start on the first page.
        // Figure out how many total pages we'll have based on the number of cards and cards per page.
        const totalResourcePages = Math.ceil(resourceCards.length / cardsPerPage);

        // This function handles showing the correct set of cards for a given page number.
        function showResourcePage(page) {
            currentResourcePage = page; // Update which page we're on.

            // Calculate the start and end index for the cards to show.
            // For example, page 1 (index 0-2), page 2 (index 3-5), etc.
            const startIndex = (currentResourcePage - 1) * cardsPerPage;
            const endIndex = startIndex + cardsPerPage;

            // Go through each resource card...
            resourceCards.forEach((card, index) => {
                // If this card's index falls within our current page's range...
                if (index >= startIndex && index < endIndex) {
                    card.style.display = 'flex'; // ...show it (using 'flex' assuming cards are flex items).
                } else {
                    card.style.display = 'none'; // ...otherwise, hide it.
                }
            });

            // Update the state of the pagination buttons.
            if (prevResourceBtn) {
                // Disable 'prev' if we're on the first page.
                prevResourceBtn.disabled = currentResourcePage === 1;
            }
            if (nextResourceBtn) {
                // Disable 'next' if we're on the last page.
                nextResourceBtn.disabled = currentResourcePage === totalResourcePages;
            }
        }

        // Set up the 'previous' button for resource pagination.
        if (prevResourceBtn) {
            prevResourceBtn.addEventListener('click', () => {
                if (currentResourcePage > 1) { // As long as we're not on the first page...
                    showResourcePage(currentResourcePage - 1); // ...go to the previous one.
                    // For a better user experience, scroll the view so the top of the
                    // resource cards section is visible after changing pages.
                    window.scrollTo({
                        top: resourceCardsContainer.offsetTop - 100, // Scroll to just above the container (100px offset).
                        behavior: 'smooth' // Make it a smooth scroll.
                    });
                }
            });
        }

        // Set up the 'next' button for resource pagination.
        if (nextResourceBtn) {
            nextResourceBtn.addEventListener('click', () => {
                if (currentResourcePage < totalResourcePages) { // As long as we're not on the last page...
                    showResourcePage(currentResourcePage + 1); // ...go to the next one.
                    // Scroll to the top of the resource cards again.
                    window.scrollTo({
                        top: resourceCardsContainer.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        }

        // When the page first loads, show the initial (first) page of resources.
        if (resourceCards.length > 0) { // Only if there are cards to show
           showResourcePage(1);
        }
    }

    // --- Scroll-to-Top Button ---
    // Get the actual button element from the HTML.
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");

    // Make sure the button exists before we try to do things with it.
    if (scrollToTopBtn) {
        // This function will run every time the user scrolls the page.
        window.onscroll = function() {
            // If the user has scrolled down more than 200 pixels from the top...
            // (document.documentElement.scrollTop is for modern browsers, document.body.scrollTop for older ones)
            if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
                scrollToTopBtn.style.display = "block"; // ...show the button.
            } else {
                scrollToTopBtn.style.display = "none"; // ...otherwise, hide it.
            }
        };

        // When the scroll-to-top button is clicked...
        scrollToTopBtn.addEventListener("click", function() {
            // ...smoothly scroll the window back to the very top of the page.
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});