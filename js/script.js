/* ==========================================
   ADOPTABLE PETS - FILTER FUNCTIONALITY
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // Get all filter elements
    const filterType = document.getElementById('filter-type');
    const filterBreed = document.getElementById('filter-breed');
    const filterAge = document.getElementById('filter-age');
    const filterGender = document.getElementById('filter-gender');
    const filterLocation = document.getElementById('filter-location');
    const filterTemperament = document.getElementById('filter-temperament');
    const mainSearch = document.getElementById('main-search');
    
    // Get all pet cards
    const petCards = document.querySelectorAll('.pet-card');
    const noResults = document.getElementById('no-results');

    // Function to filter pets
    function filterPets() {
        // Get current filter values
        const typeValue = filterType.value.toLowerCase();
        const breedValue = filterBreed.value.toLowerCase();
        const ageValue = filterAge.value.toLowerCase();
        const genderValue = filterGender.value.toLowerCase();
        const locationValue = filterLocation.value.toLowerCase();
        const temperamentValue = filterTemperament.value.toLowerCase();
        const searchValue = mainSearch.value.toLowerCase();

        let visibleCount = 0;

        // Loop through all pet cards
        petCards.forEach(card => {
            // Get card data attributes
            const cardType = card.getAttribute('data-type').toLowerCase();
            const cardBreed = card.getAttribute('data-breed').toLowerCase();
            const cardAge = card.getAttribute('data-age').toLowerCase();
            const cardGender = card.getAttribute('data-gender').toLowerCase();
            const cardLocation = card.getAttribute('data-location').toLowerCase();
            const cardTemperament = card.getAttribute('data-temperament').toLowerCase();
            
            // Get card text content for search
            const cardName = card.querySelector('.pet-name').textContent.toLowerCase();
            const cardBreedText = card.querySelector('.pet-breed').textContent.toLowerCase();

            // Check if card matches all filters
            const matchesType = !typeValue || cardType === typeValue;
            const matchesBreed = !breedValue || cardBreed === breedValue;
            const matchesAge = !ageValue || cardAge === ageValue;
            const matchesGender = !genderValue || cardGender === genderValue;
            const matchesLocation = !locationValue || cardLocation === locationValue;
            const matchesTemperament = !temperamentValue || cardTemperament === temperamentValue;
            const matchesSearch = !searchValue || 
                                  cardName.includes(searchValue) || 
                                  cardBreedText.includes(searchValue);

            // Show or hide card based on filters
            if (matchesType && matchesBreed && matchesAge && matchesGender && 
                matchesLocation && matchesTemperament && matchesSearch) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease-in';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Show or hide "no results" message
        if (visibleCount === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
    }

    // Add event listeners to all filters
    if (filterType) filterType.addEventListener('change', filterPets);
    if (filterBreed) filterBreed.addEventListener('change', filterPets);
    if (filterAge) filterAge.addEventListener('change', filterPets);
    if (filterGender) filterGender.addEventListener('change', filterPets);
    if (filterLocation) filterLocation.addEventListener('change', filterPets);
    if (filterTemperament) filterTemperament.addEventListener('change', filterPets);
    
    // Add event listener for search input
    if (mainSearch) {
        mainSearch.addEventListener('input', filterPets);
    }

    // Add search button functionality for main search
    const mainSearchBtn = document.querySelector('.main-search-btn');
    if (mainSearchBtn) {
        mainSearchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            filterPets();
        });
    }

    // Add Enter key support for search
    if (mainSearch) {
        mainSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                filterPets();
            }
        });
    }

    // Reset filters function
    function resetFilters() {
        if (filterType) filterType.value = '';
        if (filterBreed) filterBreed.value = '';
        if (filterAge) filterAge.value = '';
        if (filterGender) filterGender.value = '';
        if (filterLocation) filterLocation.value = '';
        if (filterTemperament) filterTemperament.value = '';
        if (mainSearch) mainSearch.value = '';
        
        filterPets();
    }

    // Add reset button if exists
    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }

    // Add smooth scroll to pet cards when clicking view button
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Allow default link behavior but add smooth animation
            const petCard = this.closest('.pet-card');
            if (petCard) {
                petCard.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    petCard.style.transform = '';
                }, 200);
            }
        });
    });

    // Add hover effect for pet cards
    petCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 10px 30px rgba(191, 92, 58, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe pet cards for animation
    petCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Add loading state for filters
    function showLoadingState() {
        document.querySelector('.pets-grid').style.opacity = '0.5';
    }

    function hideLoadingState() {
        document.querySelector('.pets-grid').style.opacity = '1';
    }

    // Enhanced filter function with loading state
    function filterPetsWithLoading() {
        showLoadingState();
        setTimeout(() => {
            filterPets();
            hideLoadingState();
        }, 150);
    }

    // Update event listeners to use loading state
    [filterType, filterBreed, filterAge, filterGender, filterLocation, filterTemperament].forEach(filter => {
        if (filter) {
            filter.removeEventListener('change', filterPets);
            filter.addEventListener('change', filterPetsWithLoading);
        }
    });

    // Add filter count display
    function updateFilterCount() {
        const activeFilters = [];
        
        if (filterType && filterType.value) activeFilters.push('type');
        if (filterBreed && filterBreed.value) activeFilters.push('breed');
        if (filterAge && filterAge.value) activeFilters.push('age');
        if (filterGender && filterGender.value) activeFilters.push('gender');
        if (filterLocation && filterLocation.value) activeFilters.push('location');
        if (filterTemperament && filterTemperament.value) activeFilters.push('temperament');
        return activeFilters.length;
    }

    // Log filter usage (for analytics)
    function logFilterUsage(filterName, filterValue) {
        console.log(`Filter used: ${filterName} = ${filterValue}`);
        // You can send this to analytics service
    }

    [filterType, filterBreed, filterAge, filterGender, filterLocation, filterTemperament].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', function() {
                logFilterUsage(this.id, this.value);
            });
        }
    });

    setTimeout(() => {
        petCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }, 100);

    document.addEventListener('keydown', function(e) {
        // Press 'R' to reset filters
        if (e.key === 'r' || e.key === 'R') {
            if (!document.activeElement.matches('input, select, textarea')) {
                resetFilters();
                showNotification('Filters reset!', 'info');
            }
        }
        
        if (e.key === '/') {
            if (!document.activeElement.matches('input, select, textarea')) {
                e.preventDefault();
                mainSearch.focus();
            }
        }
    });

    function showNotification(message, type = 'info') {
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${type === 'success' ? '#6ea545' : type === 'error' ? '#bf5c3a' : '#373b44'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            max-width: 400px;
        `;

        document.body.appendChild(notification);

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        });

        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }

    // Add CSS for fade-in animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { 
                opacity: 0; 
                transform: translateY(20px); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0); 
            }
        }
    `;
    document.head.appendChild(style);

    console.log('PawPal Adoptable Pets Filter System Initialized ✓');
});

    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    const body = document.body;
    
    const overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    body.appendChild(overlay);
    
    // Toggle menu function
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navList.classList.toggle('active');
        overlay.classList.toggle('active');
        body.classList.toggle('menu-open');
    }
    
    // Hamburger click event
    if (hamburger) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });
    }
    
    // Overlay click event (close menu when clicking outside)
    overlay.addEventListener('click', function() {
        if (navList.classList.contains('active')) {
            toggleMenu();
        }
    });
    
    // Close menu when clicking a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navList.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navList.classList.contains('active')) {
            toggleMenu();
        }
    });
    
    window.addEventListener('orientationchange', function() {
        if (window.innerWidth > 768 && navList.classList.contains('active')) {
            toggleMenu();
        }
    });

window.PawPalFilters = {
    filterPets: function() {
        // Trigger filter update externally
        document.getElementById('filter-type').dispatchEvent(new Event('change'));
    }
};
