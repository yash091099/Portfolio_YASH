document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        themeIcon.classList.toggle('fa-moon');
        themeIcon.classList.toggle('fa-sun');
        
        localStorage.setItem('theme', newTheme);
    });
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'light') {
            themeIcon.classList.add('fa-moon');
            themeIcon.classList.remove('fa-sun');
        } else {
            themeIcon.classList.add('fa-sun');
            themeIcon.classList.remove('fa-moon');
        }
    }
    
    const menuBtn = document.getElementById('menu-btn');
    const navbar = document.querySelector('.navbar');
    
    menuBtn.addEventListener('click', function() {
        menuBtn.classList.toggle('active');
        navbar.classList.toggle('active');
    });
    
    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', function() {
            menuBtn.classList.remove('active');
            navbar.classList.remove('active');
        });
    });
    
    const scrollTopBtn = document.getElementById('scroll-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    const tagButtons = document.querySelectorAll('.tag-btn');
    const postCards = document.querySelectorAll('.post-card');
    const hiddenPosts = document.querySelector('.hidden-posts');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const blogSearch = document.getElementById('blog-search');
    const searchBtn = document.getElementById('search-btn');
    
    function updateUnsplashImages() {
        /* 
        // Commenting out this function to prevent replacing local images
        const postCards = document.querySelectorAll('.post-card');
        
        postCards.forEach(card => {
            const tags = card.getAttribute('data-tags').split(' ');
            const mainTag = tags[0];
            const img = card.querySelector('.post-image img');
            
            if (img) {
                const randomSeed = Math.floor(Math.random() * 1000);
                img.src = `https://source.unsplash.com/random/600x400/?${mainTag}&sig=${randomSeed}`;
                img.alt = card.querySelector('.post-title').textContent;
            }
        });
        */
    }
    
    // updateUnsplashImages(); // Commented out to keep local images
    
    tagButtons.forEach(button => {
        button.addEventListener('click', function() {
            tagButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const selectedTag = this.getAttribute('data-tag');
            
            if (selectedTag === 'all' && hiddenPosts.style.display === 'block') {
                const hiddenPostCards = hiddenPosts.querySelectorAll('.post-card');
                hiddenPostCards.forEach(card => {
                    card.classList.add('hidden');
                    postCards.forEach(card => {
                        card.classList.remove('hidden');
                        setTimeout(() => {
                            card.classList.add('visible');
                        }, 10);
                    });
                });
                hiddenPosts.style.display = 'none';
                loadMoreBtn.style.display = 'block';
            }
            
            postCards.forEach(card => {
                const cardTags = card.getAttribute('data-tags');
                
                card.classList.remove('visible');
                
                if (selectedTag === 'all' || cardTags.includes(selectedTag)) {
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, 10);
                } else {
                    card.classList.add('hidden');
                }
            });
            
            const visiblePosts = document.querySelectorAll('.post-card:not(.hidden)');
            if (visiblePosts.length === 0) {
                const noResultsMsg = document.createElement('div');
                noResultsMsg.classList.add('no-results');
                noResultsMsg.innerHTML = `
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="no-results-svg">
                        <circle cx="100" cy="100" r="80" fill="#1f2937" />
                        <path fill="none" stroke="#00ff9f" stroke-width="8" stroke-linecap="round" d="M60,70 L140,130 M140,70 L60,130" />
                    </svg>
                    <h3>No posts found with the tag "${selectedTag}"</h3>
                    <p>Try another tag or reset to view all posts.</p>
                `;
                
                const postsContainer = document.querySelector('.posts-container');
                
                const existingMsg = document.querySelector('.no-results');
                if (existingMsg) {
                    existingMsg.remove();
                }
                
                postsContainer.appendChild(noResultsMsg);
                loadMoreBtn.style.display = 'none';
            } else {
                const existingMsg = document.querySelector('.no-results');
                if (existingMsg) {
                    existingMsg.remove();
                }
                
                if (hiddenPosts.querySelectorAll('.post-card').length > 0 && selectedTag === 'all') {
                    loadMoreBtn.style.display = 'block';
                } else {
                    loadMoreBtn.style.display = 'none';
                }
            }
        });
    });
    
    if (loadMoreBtn) {
        const loadMoreContainer = loadMoreBtn.parentElement;
        
        if (loadMoreContainer) {
            loadMoreContainer.style.gridColumn = '1 / -1';
            loadMoreContainer.style.display = 'flex';
            loadMoreContainer.style.justifyContent = 'center';
            loadMoreContainer.style.alignItems = 'center';
            loadMoreContainer.style.width = '100%';
        }
        
        loadMoreBtn.addEventListener('click', function() {
            this.classList.add('loading');
            
            setTimeout(() => {
                hiddenPosts.style.display = 'block';
                
                const hiddenPostCards = hiddenPosts.querySelectorAll('.post-card');
                hiddenPostCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, 100 * index);
                });
                
                const postsContainer = document.querySelector('.posts-container');
                hiddenPostCards.forEach(card => {
                    postsContainer.insertBefore(card, loadMoreContainer);
                });
                
                this.parentElement.style.display = 'none';
                this.classList.remove('loading');
                
                // updateUnsplashImages(); // Commented out to keep local images
            }, 1000);
        });
    }
    
    function performSearch() {
        const searchQuery = blogSearch.value.toLowerCase().trim();
        
        if (searchQuery === '') {
            tagButtons[0].click();
            return;
        }
        
        tagButtons.forEach(btn => btn.classList.remove('active'));
        
        const allPosts = [...postCards, ...hiddenPosts.querySelectorAll('.post-card')];
        
        let hasResults = false;
        
        allPosts.forEach(card => {
            const title = card.querySelector('.post-title').textContent.toLowerCase();
            const excerpt = card.querySelector('.post-excerpt').textContent.toLowerCase();
            const tags = card.getAttribute('data-tags').toLowerCase();
            
            card.classList.remove('visible');
            
            if (title.includes(searchQuery) || excerpt.includes(searchQuery) || tags.includes(searchQuery)) {
                card.classList.remove('hidden');
                if (card.parentElement === hiddenPosts) {
                    const postsContainer = document.querySelector('.posts-container');
                    postsContainer.insertBefore(card, loadMoreBtn.parentElement);
                }
                setTimeout(() => {
                    card.classList.add('visible');
                }, 10);
                hasResults = true;
            } else {
                card.classList.add('hidden');
            }
        });
        
        if (!hasResults) {
            const noResultsMsg = document.createElement('div');
            noResultsMsg.classList.add('no-results');
            noResultsMsg.innerHTML = `
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="no-results-svg">
                    <circle cx="100" cy="100" r="80" fill="#1f2937" />
                    <path fill="none" stroke="#00ff9f" stroke-width="8" stroke-linecap="round" d="M60,70 L140,130 M140,70 L60,130" />
                </svg>
                <h3>No posts found for "${searchQuery}"</h3>
                <p>Try different keywords or reset to view all posts.</p>
                <button class="btn secondary-btn reset-search-btn">Reset Search</button>
            `;
            
            const postsContainer = document.querySelector('.posts-container');
            
            const existingMsg = document.querySelector('.no-results');
            if (existingMsg) {
                existingMsg.remove();
            }
            
            postsContainer.appendChild(noResultsMsg);
            loadMoreBtn.style.display = 'none';
            
            document.querySelector('.reset-search-btn').addEventListener('click', function() {
                blogSearch.value = '';
                tagButtons[0].click();
            });
        }else {
            const existingMsg = document.querySelector('.no-results');
            if (existingMsg) {
                existingMsg.remove();
            }
            
            loadMoreBtn.style.display = 'none';
        }
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (blogSearch) {
        blogSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const shareOptions = this.nextElementSibling;
            shareOptions.classList.toggle('active');
            
            const postCard = this.closest('.post-card');
            const postTitle = postCard.querySelector('.post-title').textContent;
            const postLink = postCard.querySelector('.read-more').getAttribute('href');
            const fullPostLink = window.location.origin + window.location.pathname.replace('index.html', '') + postLink;
            
            const twitterLink = shareOptions.querySelector('a[aria-label="Share on Twitter"]');
            const linkedinLink = shareOptions.querySelector('a[aria-label="Share on LinkedIn"]');
            const facebookLink = shareOptions.querySelector('a[aria-label="Share on Facebook"]');
            
            twitterLink.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(fullPostLink)}`;
            linkedinLink.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullPostLink)}`;
            facebookLink.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullPostLink)}`;
        });
    });
    
    document.addEventListener('click', function(e) {
        shareButtons.forEach(button => {
            const shareOptions = button.nextElementSibling;
            if (shareOptions && !shareOptions.contains(e.target) && !button.contains(e.target)) {
                shareOptions.classList.remove('active');
            }
        });
    });
    
    function showToast(message) {
        let toast = document.querySelector('.toast');
        
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        
        toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                if (validateEmail(email)) {
                    console.log('Subscribed email:', email);
                    
                    const submitBtn = this.querySelector('button[type="submit"]');
                    const originalText = submitBtn.innerHTML;
                    
                    submitBtn.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> Subscribing...`;
                    submitBtn.disabled = true;
                    
                    setTimeout(() => {
                        this.innerHTML = `
                            <div class="subscription-success">
                                <i class="fas fa-check-circle"></i>
                                <h3>Thank you for subscribing!</h3>
                                <p>You'll receive updates when new content is published.</p>
                            </div>
                        `;
                        
                        showToast('Successfully subscribed to the newsletter!');
                    }, 1500);
                } else {
                    showToast('Please enter a valid email address');
                }
            } else {
                showToast('Please enter your email address');
            }
        });
    }
    
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    function addButtonAnimation() {
        const buttons = document.querySelectorAll('.btn, .tag-btn, .read-more, .share-btn');
        
        buttons.forEach(button => {
            button.addEventListener('mousedown', function() {
                this.style.transform = 'scale(0.95)';
            });
            
            button.addEventListener('mouseup', function() {
                this.style.transform = '';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }
    
    addButtonAnimation();
    
    function enhanceSearchExperience() {
        if (blogSearch) {
            blogSearch.addEventListener('focus', function() {
                this.style.boxShadow = '0 0 0 3px rgba(0, 255, 159, 0.3)';
            });
            
            blogSearch.addEventListener('blur', function() {
                this.style.boxShadow = '';
            });
            
            const searchContainer = document.querySelector('.search-container');
            if (searchContainer) {
                searchContainer.style.transition = 'transform 0.3s ease';
                
                blogSearch.addEventListener('focus', function() {
                    searchContainer.style.transform = 'scale(1.02)';
                });
                
                blogSearch.addEventListener('blur', function() {
                    searchContainer.style.transform = '';
                });
            }
        }
    }
    
    enhanceSearchExperience();
    
    function fixGridAlignment() {
        const postsContainer = document.querySelector('.posts-container');
        if (postsContainer) {
            postsContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
            
            const mediaQuery = window.matchMedia('(max-width: 992px)');
            function handleScreenChange(e) {
                if (e.matches) {
                    postsContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
                } else {
                    postsContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
                }
            }
            
            mediaQuery.addListener(handleScreenChange);
            handleScreenChange(mediaQuery);
            
            const smallMediaQuery = window.matchMedia('(max-width: 768px)');
            function handleSmallScreenChange(e) {
                if (e.matches) {
                    postsContainer.style.gridTemplateColumns = '1fr';
                }
            }
            
            smallMediaQuery.addListener(handleSmallScreenChange);
            handleSmallScreenChange(smallMediaQuery);
        }
    }
    
    fixGridAlignment();
    
    function centerLoadMoreButton() {
        const loadMoreContainer = document.querySelector('.load-more-container');
        if (loadMoreContainer) {
            loadMoreContainer.style.gridColumn = '1 / -1';
            loadMoreContainer.style.display = 'flex';
            loadMoreContainer.style.justifyContent = 'center';
            loadMoreContainer.style.width = '100%';
        }
    }
    
    centerLoadMoreButton();
    
    function fixNewsletterButton() {
        const newsletterButton = document.querySelector('.newsletter-form button');
        if (newsletterButton) {
            const buttonText = newsletterButton.textContent.trim();
        }
    }
    
    fixNewsletterButton();
    
    function addScrollAnimations() {
        const sections = document.querySelectorAll('section');
        
        window.addEventListener('scroll', function() {
            sections.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top;
                const sectionBottom = section.getBoundingClientRect().bottom;
                const windowHeight = window.innerHeight;
                
                if (sectionTop < windowHeight * 0.75 && sectionBottom > 0) {
                    section.classList.add('active');
                }
            });
        });
    }
    
    addScrollAnimations();
});