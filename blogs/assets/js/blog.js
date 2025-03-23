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
    }
    
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
        const buttons = document.querySelectorAll('.btn, .tag-btn, .read-more');
        
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

document.addEventListener('DOMContentLoaded', function() {
    const blogContentDB = {
        "react": {
            "title": "React Architecture Patterns",
            "content": "Welcome to this audio guide on React architecture patterns and best practices. React has revolutionized how developers build user interfaces, and today I'll share essential architecture patterns that will help you create scalable applications. Let's start with component structure. The foundation of React is its component-based architecture. You should organize components hierarchically, with smart container components handling state and logic, while presentational components focus purely on rendering UI. This separation of concerns makes your code more maintainable and testable. For larger applications, consider implementing a feature-based folder structure rather than organizing by component type. This approach groups related components, hooks, utilities, and tests together, making it easier to navigate and maintain your codebase as it grows. State management is another critical aspect of React architecture. For simple applications, React's built-in useState and useContext may be sufficient. However, as complexity grows, you might need dedicated state management libraries. Redux follows a unidirectional data flow with actions, reducers, and a single store, making state changes predictable and traceable. MobX offers a more flexible, reactive approach with observable state. Recoil, developed by Facebook, provides atom-based state management that works well with React's concurrent mode. Choose the solution that best fits your application's complexity and your team's preferences. Code splitting is essential for performance optimization. React.lazy and Suspense allow you to load components only when needed, reducing initial bundle size and improving load times. Consider splitting your application by routes, features, or even individual components for optimal performance. Custom hooks enable you to extract and reuse stateful logic across components. This pattern keeps your components clean and focused on rendering while moving complex logic into reusable, testable hooks. For styling, you have several options. CSS Modules provide component-scoped styles without runtime overhead. Styled-components and Emotion offer CSS-in-JS solutions with powerful dynamic styling capabilities. Tailwind CSS provides utility classes for rapid development. Choose the approach that balances maintainability, performance, and developer experience for your team. Error boundaries are critical for production applications. These special components catch JavaScript errors anywhere in their child component tree and display fallback UIs instead of crashing the entire application. Testing is a fundamental part of maintainable architecture. Jest works well for unit and integration tests, while React Testing Library encourages testing components as users would interact with them. Finally, consider implementing strict TypeScript or PropTypes for type safety, which catches errors during development rather than runtime. These architecture patterns will help you build React applications that are scalable, maintainable, and performant even as they grow in complexity. Remember that architecture should serve your specific application needs - there's no one-size-fits-all solution. Thank you for listening to this guide on React architecture patterns and best practices."
        },
        "nodejs": {
            "title": "Node.js Microservices Architecture",
            "content": "Welcome to this comprehensive audio guide on Node.js microservices design patterns and implementation strategies. In this guide, I'll walk you through the essential concepts and best practices for building robust microservice architectures with Node.js. Let's begin with service decomposition. The first challenge in microservices is determining how to divide your application. The most effective approach is to decompose along business domain boundaries using Domain-Driven Design principles. Each microservice should own its data and encapsulate its implementation details. The size of microservices varies, but they should be small enough to be maintained by a single team while large enough to provide meaningful business value. For inter-service communication, you have several patterns to consider. Synchronous REST APIs are straightforward to implement but create tight coupling. gRPC offers a more efficient binary protocol with strict contract definitions. For asynchronous communication, message brokers like RabbitMQ, Kafka, or AWS SQS decouple services and improve system resilience. The event-driven architecture pattern is particularly powerful, where services publish events when state changes and other services subscribe to relevant events. API gateways like Express Gateway, Kong, or AWS API Gateway provide a unified entry point to your microservices ecosystem. They handle cross-cutting concerns such as authentication, rate limiting, and request routing. The Backend for Frontend (BFF) pattern extends this concept by creating specialized gateways for different client types. Database strategy is crucial in microservices. The database per service pattern ensures loose coupling and independent scaling, but introduces challenges with data consistency. For transactions spanning multiple services, you'll need to implement patterns like the Saga pattern, which manages distributed transactions through compensating actions. Event sourcing stores all changes as a sequence of events, providing a complete audit trail and enabling temporal queries. The CQRS pattern separates read and write operations, allowing them to be optimized independently. Service discovery mechanisms help microservices locate each other in dynamic environments. Tools like Consul, etcd, or Kubernetes service discovery enable services to find each other without hardcoded locations. Client-side service discovery places the responsibility on the calling service, while server-side discovery uses load balancers or service meshes. To prevent cascading failures, implement circuit breakers using libraries like Hystrix or Resilience4j. These monitor for failures and prevent overloading struggling services. For deployment and operational concerns, containerization with Docker provides consistency between environments. Kubernetes offers powerful orchestration capabilities for container deployment, scaling, and management. For monitoring and observability, implement comprehensive logging with the ELK stack or similar solutions. Distributed tracing with tools like Jaeger or Zipkin helps track requests across multiple services. Health checks and metrics collection with Prometheus enable proactive monitoring. Finally, automated testing is even more critical in microservices architectures. Unit tests verify individual components, while integration tests check service interactions. Contract tests ensure that service interfaces remain compatible. End-to-end tests validate complete workflows across multiple services. By applying these patterns and practices, you can build resilient, scalable, and maintainable Node.js microservices architectures that support your business needs efficiently. Thank you for listening to this guide on Node.js microservices architecture."
        },
        "web3": {
            "title": "Web3 Development Guide",
            "content": "Welcome to this in-depth audio guide on getting started with Web3 development and building your first decentralized application or dApp. Web3 represents the next evolution of the internet, focused on decentralization, blockchain technology, and user ownership. I'll explain the fundamental concepts and practical steps for building in this new paradigm. Let's start with understanding the Web3 stack. Unlike traditional web applications that run on centralized servers, dApps operate on decentralized blockchain networks like Ethereum, Solana, Polygon, or Binance Smart Chain. The backend logic lives in smart contracts - self-executing code that runs on the blockchain, while the frontend interfaces can be built with familiar web technologies but connect to these blockchain networks. Smart contracts are the foundation of Web3 development. These are programs stored on a blockchain that automatically execute when predetermined conditions are met. For Ethereum and EVM-compatible chains, these are typically written in Solidity, a statically-typed language designed for implementing smart contracts. For Solana, you might use Rust. Learning smart contract programming requires understanding not just the language syntax, but also the economic and security implications of on-chain execution. For frontend development, you'll need to connect your application to the blockchain. Libraries like ethers.js or web3.js for Ethereum ecosystems provide APIs to interact with smart contracts, sign transactions, and connect to user wallets. For Solana, you might use the Solana Web3.js library. Authentication in Web3 works differently from traditional apps. Instead of username/password systems, users authenticate with crypto wallets like MetaMask, Coinbase Wallet, or WalletConnect. These wallets manage the user's private keys and handle transaction signing. Your application requests permission to connect to the user's wallet, which then serves as their identity. Data storage in Web3 also requires new approaches. On-chain storage is expensive and limited, so most dApps use a hybrid approach. Critical data that requires consensus is stored on-chain, while larger files and media are stored on decentralized storage networks like IPFS or Arweave. Traditional databases might still be used for indexing and querying data for optimal performance. For testing smart contracts, you'll need specialized frameworks like Hardhat or Truffle. These provide development environments for compiling, deploying, testing, and debugging Ethereum software. Testing is particularly critical in Web3 development because deployed smart contracts are often immutable and mistakes can be costly. Security considerations are paramount in Web3. Smart contracts handle real value and are publicly visible, making them targets for attackers. Common vulnerabilities include reentrancy attacks, integer overflows, and access control issues. Consider using audited libraries like OpenZeppelin, following established patterns, and getting professional audits for important contracts. Gas fees and transaction speed affect user experience significantly. Implement gas optimization techniques like batching operations and efficient storage patterns. Consider implementing layer 2 solutions or sidechains for better scalability. User experience design requires special attention in Web3. Account for blockchain latency in your UI, provide clear transaction information, and implement proper error handling for failed transactions. Remember that transactions are asynchronous - your UI should reflect pending states appropriately. For development tooling, consider frameworks like Scaffold-ETH, Moralis, or Alchemy that provide infrastructure and tools to accelerate development. Chainlink oracles can provide external data to your smart contracts. OpenZeppelin offers security-audited contract templates and libraries. The Web3 development journey has a learning curve, but it's a rapidly evolving space with tremendous potential. By understanding these fundamental concepts and leveraging the growing ecosystem of tools, you can build decentralized applications that offer new models of ownership, transparency, and user empowerment. Thank you for listening to this guide on getting started with Web3 development."
        },
        "blockchain": {
            "title": "Blockchain Fundamentals",
            "content": "Welcome to this comprehensive audio guide on blockchain fundamentals. In this guide, I'll walk you through the core concepts that make blockchain technology revolutionary. Let's begin with the basics. A blockchain is fundamentally a distributed ledger - a continuously growing list of records, called blocks, which are linked and secured using cryptography. Each block typically contains a timestamp, transaction data, and a cryptographic hash of the previous block. This creates an immutable chain where altering any block would require changing all subsequent blocks. Decentralization is a key attribute of blockchain systems. Instead of relying on a central authority like a bank or government, blockchains distribute control across a peer-to-peer network. This network consists of nodes - computers that store copies of the blockchain and participate in validating transactions and blocks. This redundancy makes the system resilient to failures and resistant to censorship or control by any single entity. Cryptographic hashing is essential to blockchain security. Hash functions transform input data of any size into a fixed-size output, called a hash. These functions are one-way, meaning you cannot derive the original input from the hash. A small change in the input produces a completely different hash. Blockchains use hashing to create the links between blocks and to verify data integrity. Consensus mechanisms are how blockchain networks agree on the valid state of the ledger without central coordination. Bitcoin introduced Proof of Work, where miners compete to solve complex mathematical puzzles to validate blocks. This process requires substantial computational resources and energy. Proof of Stake, used by Ethereum 2.0 and other networks, selects validators based on the amount of cryptocurrency they're willing to 'stake' or lock up as collateral. Other consensus mechanisms include Delegated Proof of Stake, Proof of Authority, and Practical Byzantine Fault Tolerance, each with different tradeoffs between security, decentralization, and scalability. Public and private keys enable secure transactions on blockchains. Each user generates a pair of cryptographically related keys. The private key is kept secret and used to sign transactions, while the public key is used to create an address that others can send assets to. This digital signature system proves ownership without revealing private keys. Smart contracts extend blockchain beyond simple transfers. These are self-executing programs stored on the blockchain that automatically enforce agreements when predefined conditions are met. Smart contracts enable complex decentralized applications without intermediaries. While first implemented on Ethereum, many blockchain platforms now support smart contracts. Tokenization is the process of representing assets as tokens on a blockchain. Cryptocurrencies are one form of tokens, but blockchain can also represent traditional assets like real estate, art, or securities. This creates new opportunities for fractional ownership, programmable assets, and automated compliance. Blockchain faces several challenges. Scalability limitations affect transaction throughput and costs. The energy consumption of Proof of Work raises environmental concerns. Privacy considerations arise because blockchain transactions are typically public. Regulatory uncertainty exists as governments develop frameworks for blockchain applications. To address these challenges, various solutions are emerging. Layer 2 protocols like Lightning Network and rollups process transactions off the main chain to improve scalability. Sidechains and interoperability protocols enable communication between different blockchains. Zero-knowledge proofs and other privacy technologies enhance confidentiality while maintaining verification capabilities. Understanding these blockchain fundamentals provides the foundation for exploring applications across finance, supply chain, healthcare, digital identity, and many other fields. The technology continues to evolve rapidly, with ongoing innovations addressing current limitations and expanding potential use cases. Thank you for listening to this guide on blockchain fundamentals."
        },
        "javascript": {
            "title": "Modern JavaScript Features",
            "content": "Welcome to this comprehensive audio guide on modern JavaScript features that every developer should know. JavaScript has evolved dramatically in recent years, with ECMAScript 6 (ES6) and subsequent releases introducing powerful features that make code more concise, readable, and maintainable. Let's explore these features and understand how they can enhance your development experience. Let's start with arrow functions, one of the most widely used ES6 features. Arrow functions provide a more concise syntax for writing functions. Instead of writing 'function(params) { return result; }', you can write '(params) => result'. Beyond brevity, arrow functions have lexical 'this' binding, meaning they don't create their own 'this' context. This solves the common issue of 'this' reference changing in callbacks and makes arrow functions perfect for methods like map, filter, and reduce. Destructuring assignment allows you to extract data from arrays and objects with elegant syntax. For arrays, you can write 'const [first, second] = myArray' to get individual elements. For objects, 'const { name, age } = person' extracts properties into variables. Destructuring can be nested for complex data structures and includes features like default values, rest patterns, and renaming variables. The spread and rest operators, both written as three dots (...), serve complementary purposes. The spread operator expands arrays or objects into elements or properties. You can use it to copy arrays, concatenate them, or create shallow copies of objects while overriding specific properties. The rest operator collects multiple elements into a single array, making functions with variable numbers of arguments more elegant. Template literals transform how you work with strings. Enclosed by backticks, they allow embedded expressions using ${expression} syntax, multi-line strings without concatenation or escape characters, and tagged templates for custom string processing. This makes string manipulation more readable and maintainable. Default parameters eliminate boilerplate code for handling undefined arguments. Instead of checking if parameters exist within the function body, you can write  to provide fallback values when arguments are omitted. Async/await, built on promises, revolutionizes asynchronous programming. The 'async' keyword marks a function as returning a promise, while 'await' pauses execution until the promise resolves. This transforms asynchronous code into a synchronous-looking structure that's easier to understand and debug compared to promise chains or callbacks. It properly propagates errors and works seamlessly with try/catch blocks. ES modules provide a standardized way to organize code with 'import' and 'export' statements. They support static analysis, enabling tree-shaking to eliminate unused code. Modules have their own scope, preventing global namespace pollution, and support named exports, default exports, and re-exporting. Optional chaining prevents errors when accessing properties of potentially undefined objects. Instead of writing nested conditional checks, you can use the ?. operator: 'user?.address?.street'. If any part of the chain is undefined or null, the expression returns undefined instead of throwing an error. Nullish coalescing provides better defaults than the logical OR operator. While || returns the right-hand side when the left is any falsy value, the ?? operator only uses the fallback when the value is specifically null or undefined. This distinguishes between intentional falsy values like 0 or empty strings and missing values. Modern data structures like Map and Set offer advantages over plain objects for certain use cases. Maps allow any value as keys, maintain insertion order, and provide better performance for frequent additions and removals. Sets store unique values and offer efficient membership testing. Array methods like find, findIndex, flatMap, and the newer at() method provide powerful ways to work with collections without verbose loops. Private class fields and methods, marked with #, enable true encapsulation in JavaScript classes. This hides implementation details and prevents external code from accessing or modifying internal state. Dynamic imports allow loading modules conditionally or on demand, improving initial load performance for large applications. BigInt handles integers beyond the safe integer limit, while the Intl API provides robust internationalization capabilities. By incorporating these modern JavaScript features into your development practices, you'll write more concise, robust, and maintainable code. They represent JavaScript's evolution into a more powerful and expressive language for both browser and server-side development. Thank you for listening to this guide on modern JavaScript features."
        },
        "devops": {
            "title": "CI/CD Pipeline Implementation",
            "content": "Welcome to this comprehensive audio guide on building CI/CD pipelines for modern web applications. Continuous Integration and Continuous Deployment pipelines are essential for modern software delivery, automating the process of testing, building, and deploying applications. I'll walk you through best practices and implementation strategies for robust CI/CD pipelines. Let's start with the fundamentals. A CI/CD pipeline automates the software delivery process, from code changes to production deployment. Continuous Integration involves automatically building and testing code changes when developers push to a repository. Continuous Delivery extends this by automatically preparing releases for deployment, while Continuous Deployment goes further by automatically deploying changes to production after passing all tests. The foundation of any CI/CD pipeline is version control. Git is the industry standard, with GitHub, GitLab, or Bitbucket providing hosting and integration capabilities. Implement a branching strategy like Git Flow or GitHub Flow that suits your team size and release cadence. Feature branches with pull requests ensure code quality through peer review before merging to the main branch. Automated testing is the cornerstone of a reliable pipeline. Unit tests verify individual components in isolation and should run quickly to provide immediate feedback. Integration tests check how components work together. End-to-end tests validate complete user flows across the application. Test coverage reports help identify untested code paths. Implement all of these test types while balancing comprehensiveness with execution time. Static code analysis tools like ESLint, StyleLint, or SonarQube catch potential issues before runtime. They enforce coding standards, detect anti-patterns, and identify security vulnerabilities. Configure these tools to run automatically in your pipeline to ensure code quality consistency. Security scanning is increasingly critical in modern pipelines. Integrate tools that scan your code and dependencies for known vulnerabilities. OWASP Dependency-Check, Snyk, or GitHub's Dependabot can automatically alert you to security issues in your dependencies. For containerized applications, tools like Trivy can scan container images. Infrastructure as Code (IaC) ensures consistency between environments. Tools like Terraform, AWS CloudFormation, or Pulumi allow you to define your infrastructure in code, making it versionable, testable, and repeatable. Your pipeline should apply these infrastructure changes automatically, ensuring staging and production environments remain in sync. Environment-specific configurations should be externalized, not hardcoded. Use environment variables, configuration files, or secret management services like HashiCorp Vault or AWS Secrets Manager. Your pipeline should inject the appropriate configuration for each environment during deployment. Containerization with Docker provides consistency between environments and simplifies deployment. Your pipeline should build container images, tag them appropriately, and publish them to a registry like Docker Hub, Amazon ECR, or Google Container Registry. Implement multi-stage builds to create minimal production images. Deployment strategies reduce risk when releasing changes. Blue-green deployments maintain two identical environments, switching traffic from the old to the new version after verification. Canary deployments gradually route traffic to the new version, monitoring for issues before full rollout. Feature flags decouple deployment from release, allowing you to enable features selectively. Orchestration tools like Kubernetes, AWS ECS, or Google Cloud Run manage containerized applications at scale. Your pipeline should integrate with these platforms to deploy and update your applications automatically. Monitoring and alerting should be integrated into your pipeline. Deploy changes to monitoring configurations alongside application updates. Implement health checks to verify successful deployments. Set up monitors for key metrics and configure alerts for abnormal conditions. Application performance monitoring tools like New Relic or Datadog provide insights into production behavior. Pipeline metrics help identify bottlenecks in your delivery process. Track metrics like deployment frequency, lead time for changes, change failure rate, and time to recover from incidents. These metrics, known as DORA metrics, correlate with high-performing organizations. Artifact management ensures you can trace exactly what version is deployed where. Use repositories like JFrog Artifactory or Nexus Repository to store build outputs with consistent versioning. This enables easy rollbacks if issues arise in production. Caching dependencies speeds up builds. Configure your pipeline to cache package downloads, reducing build times and dependency on external services. For implementation, modern CI/CD platforms like GitHub Actions, GitLab CI, CircleCI, or Jenkins provide powerful capabilities. They integrate with your version control system and support defining pipelines as code. GitHub Actions, for example, allows you to define workflows in YAML files within your repository. Finally, document your pipeline thoroughly so the entire team understands how changes flow from commit to production. Include information on how to troubleshoot common issues and how to roll back deployments if necessary. By implementing these practices, you'll build CI/CD pipelines that deliver quality software rapidly and reliably, enabling your team to focus on creating value rather than manual deployment processes. Thank you for listening to this guide on building CI/CD pipelines for modern web applications."
        }
    };

    function addAudioFeaturesToPosts() {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        
        window.audioState = {
            activeBlogId: null,
            startTime: null,
            duration: 0,
            isPlaying: false,
            timerInterval: null,
            currentUtterance: null,
            utteranceQueue: [],
            currentChunkIndex: 0,
            pausePosition: 0,
            heartbeatInterval: null,
            speechEndTimeout: null,
            lastHeartbeatTime: null,
            recoveryAttempts: 0
        };
        
        const postCards = document.querySelectorAll('.post-card');
        
        postCards.forEach((card, index) => {
            const blogId = `blog-${index}`;
            card.dataset.blogId = blogId;
            
            const postTitle = card.querySelector('.post-title').textContent;
            const tagElements = card.querySelectorAll('.post-tags .tag');
            const tags = Array.from(tagElements).map(tag => tag.textContent);
            
            const contentKey = getContentKeyFromTitleAndTags(postTitle, tags);
            const audioContent = blogContentDB[contentKey]?.content || 
                                "I'm sorry, I don't have detailed information about this specific topic. " +
                                "The article covers " + postTitle + ". Please read the full article for more information.";
            
            const wordCount = audioContent.split(/\s+/).length;
            const estimatedDuration = Math.ceil(wordCount / 2.5); 
            const minutes = Math.floor(estimatedDuration / 60);
            const seconds = estimatedDuration % 60;
            const timeString = minutes > 0 ? 
                `${minutes}:${seconds.toString().padStart(2, '0')}` : 
                `0:${seconds.toString().padStart(2, '0')}`;
            
            card.dataset.audioContent = audioContent;
            card.dataset.audioDuration = estimatedDuration;
            
            const audioPlayerContainer = document.createElement('div');
            audioPlayerContainer.className = 'audio-player-container';
            
            const audioPlayer = document.createElement('div');
            audioPlayer.className = 'audio-player';
            audioPlayer.innerHTML = `
                <div class="audio-player-top">
                    <button class="audio-play-btn" aria-label="Listen to post" data-blog-id="${blogId}">
                        <i class="fas fa-play"></i>
                    </button>
                    <div class="audio-info">
                        <div class="audio-title">Listen to article</div>
                        <div class="audio-timer">
                            <span class="current-time">0:00</span>
                            <span class="time-separator">/</span>
                            <span class="total-time">${timeString}</span>
                        </div>
                    </div>
                </div>
                <div class="audio-progress">
                    <div class="audio-progress-bar"></div>
                    <div class="audio-progress-handle"></div>
                </div>
            `;
            
            audioPlayerContainer.appendChild(audioPlayer);
            card.appendChild(audioPlayerContainer);
            
            const progressBar = audioPlayer.querySelector('.audio-progress');
            progressBar.addEventListener('click', function(e) {
                if (window.audioState.activeBlogId !== blogId) {
                    toggleAudioPlayback(card, audioPlayer.querySelector('.audio-play-btn'));
                    return;
                }
                
                const rect = progressBar.getBoundingClientRect();
                const clickPosition = (e.clientX - rect.left) / rect.width;
                const seekTime = Math.floor(window.audioState.duration * clickPosition);
                
                seekToPosition(card, seekTime);
            });
        });
        
        document.addEventListener('click', function(e) {
            const playBtn = e.target.closest('.audio-play-btn');
            if (!playBtn) return;
            
            const blogId = playBtn.dataset.blogId;
            const card = document.querySelector(`[data-blog-id="${blogId}"]`);
            
            if (!card) return;
            
            toggleAudioPlayback(card, playBtn);
        });
    }
    
    function getContentKeyFromTitleAndTags(title, tags) {
        const lowerTitle = title.toLowerCase();
        
        if (lowerTitle.includes("react") || tags.includes("React")) {
            return "react";
        }
        if (lowerTitle.includes("node.js") || tags.includes("Node.js")) {
            return "nodejs";
        }
        if (lowerTitle.includes("web3") || tags.includes("Web3")) {
            return "web3";
        }
        if (lowerTitle.includes("blockchain") || tags.includes("Blockchain")) {
            return "blockchain";
        }
        if (lowerTitle.includes("javascript") || tags.includes("JavaScript")) {
            return "javascript";
        }
        if (lowerTitle.includes("ci/cd") || lowerTitle.includes("pipeline") || tags.includes("DevOps")) {
            return "devops";
        }
        
        for (const tag of tags) {
            const lowerTag = tag.toLowerCase();
            if (lowerTag === "frontend" && blogContentDB["react"]) {
                return "react";
            }
            if (lowerTag === "backend" && blogContentDB["nodejs"]) {
                return "nodejs";
            }
        }
        
        return Object.keys(blogContentDB)[0];
    }
    
    function chunkText(text) {
        const sentenceRegex = /(?<=[.!?])\s+(?=[A-Z])/g;
        const sentences = text.split(sentenceRegex);
        const chunks = [];
        let currentChunk = "";
        
        for (const sentence of sentences) {
            if (currentChunk.length + sentence.length > 150) {
                if (currentChunk) {
                    chunks.push(currentChunk.trim());
                }
                currentChunk = sentence;
            } else {
                currentChunk += " " + sentence;
            }
        }
        
        if (currentChunk) {
            chunks.push(currentChunk.trim());
        }
        
        return chunks;
    }
    
    function toggleAudioPlayback(card, playBtn) {
        const blogId = card.dataset.blogId;
        const audioPlayer = card.querySelector('.audio-player');
        const progressBar = card.querySelector('.audio-progress-bar');
        const progressHandle = card.querySelector('.audio-progress-handle');
        const currentTimeElement = card.querySelector('.current-time');
        const audioContent = card.dataset.audioContent;
        const duration = parseInt(card.dataset.audioDuration, 10);
        
        if (window.audioState.activeBlogId === blogId) {
            if (window.audioState.isPlaying) {
                window.speechSynthesis.pause();
                window.audioState.isPlaying = false;
                window.audioState.pausePosition = calculatePlaybackPosition();
                
                clearInterval(window.audioState.timerInterval);
                clearInterval(window.audioState.heartbeatInterval);
                clearTimeout(window.audioState.speechEndTimeout);
                
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                playBtn.setAttribute('aria-label', 'Resume playback');
                audioPlayer.classList.remove('playing');
                
                const allCards = document.querySelectorAll('.post-card');
                allCards.forEach(otherCard => {
                    if (otherCard.dataset.blogId !== blogId) {
                        otherCard.classList.remove('dimmed');
                    }
                });
            } else {
                window.speechSynthesis.resume();
                window.audioState.isPlaying = true;
                window.audioState.startTime = new Date() - (window.audioState.pausePosition * 1000);
                
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                playBtn.setAttribute('aria-label', 'Pause playback');
                audioPlayer.classList.add('playing');
                
                startTimer(card);
                startHeartbeat(card);
                
                const allCards = document.querySelectorAll('.post-card');
                allCards.forEach(otherCard => {
                    if (otherCard.dataset.blogId !== blogId) {
                        otherCard.classList.add('dimmed');
                    }
                });
            }
            return;
        }
        
        stopAllPlayback();
        
        window.audioState.activeBlogId = blogId;
        window.audioState.isPlaying = true;
        window.audioState.duration = duration;
        window.audioState.startTime = new Date();
        window.audioState.currentChunkIndex = 0;
        window.audioState.pausePosition = 0;
        window.audioState.recoveryAttempts = 0;
        
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        playBtn.setAttribute('aria-label', 'Pause playback');
        audioPlayer.classList.add('playing');
        progressBar.style.width = '0%';
        progressHandle.style.left = '0%';
        currentTimeElement.textContent = '0:00';
        
        const allCards = document.querySelectorAll('.post-card');
        allCards.forEach(otherCard => {
            if (otherCard.dataset.blogId !== blogId) {
                otherCard.classList.add('dimmed');
            }
        });
        
        const chunks = chunkText(audioContent);
        window.audioState.utteranceQueue = chunks;
        
        playNextChunk(card, playBtn);
        
        startTimer(card);
        startHeartbeat(card);
    }
    
    function playNextChunk(card, playBtn) {
        if (!window.audioState.isPlaying) return;
        
        const chunks = window.audioState.utteranceQueue;
        const currentIndex = window.audioState.currentChunkIndex;
        
        if (currentIndex >= chunks.length) {
            resetPlayback(card);
            return;
        }
        
        const utterance = new SpeechSynthesisUtterance(chunks[currentIndex]);
        window.audioState.currentUtterance = utterance;
        
        utterance.rate = 0.9;
        utterance.pitch = 0.95;
        utterance.volume = 1.0;
        
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            const englishVoices = voices.filter(voice => voice.lang.includes('en-'));
            if (englishVoices.length > 0) {
                const maleVoice = englishVoices.find(voice => 
                    voice.name.includes('Male') || 
                    voice.name.includes('Daniel') || 
                    voice.name.includes('Google UK English Male'));
                utterance.voice = maleVoice || englishVoices[0];
            }
        }
        
        utterance.onend = () => {
            window.audioState.currentChunkIndex++;
            clearTimeout(window.audioState.speechEndTimeout);
            
            setTimeout(() => {
                if (window.audioState.isPlaying) {
                    playNextChunk(card, playBtn);
                    window.audioState.lastHeartbeatTime = new Date();
                }
            }, 100);
        };
        
        utterance.onerror = (event) => {
            console.error('SpeechSynthesis error:', event);
            
            if (window.audioState.recoveryAttempts < 3) {
                window.audioState.recoveryAttempts++;
                setTimeout(() => {
                    if (window.audioState.isPlaying) {
                        playNextChunk(card, playBtn);
                    }
                }, 250);
            } else {
                window.audioState.currentChunkIndex++;
                window.audioState.recoveryAttempts = 0;
                setTimeout(() => {
                    if (window.audioState.isPlaying) {
                        playNextChunk(card, playBtn);
                    }
                }, 250);
            }
        };
        
        try {
            window.speechSynthesis.speak(utterance);
            window.audioState.lastHeartbeatTime = new Date();
            
            window.audioState.speechEndTimeout = setTimeout(() => {
                if (window.audioState.isPlaying && window.audioState.currentChunkIndex === currentIndex) {
                    window.audioState.currentChunkIndex++;
                    
                    if (window.audioState.currentChunkIndex < chunks.length) {
                        playNextChunk(card, playBtn);
                    } else {
                        resetPlayback(card);
                    }
                }
            }, chunks[currentIndex].length * 120);
        } catch (error) {
            console.error('Error with speech synthesis:', error);
            window.audioState.currentChunkIndex++;
            setTimeout(() => {
                if (window.audioState.isPlaying) {
                    playNextChunk(card, playBtn);
                }
            }, 250);
        }
    }
    
    function calculatePlaybackPosition() {
        if (!window.audioState.startTime) return 0;
        return Math.min(
            (new Date() - window.audioState.startTime) / 1000, 
            window.audioState.duration
        );
    }
    
    function seekToPosition(card, seekSeconds) {
        if (!window.audioState.isPlaying && !window.audioState.activeBlogId) return;
        
        stopAllPlayback(false);
        
        const playBtn = card.querySelector('.audio-play-btn');
        const audioPlayer = card.querySelector('.audio-player');
        const progressBar = card.querySelector('.audio-progress-bar');
        const progressHandle = card.querySelector('.audio-progress-handle');
        const currentTimeElement = card.querySelector('.current-time');
        
        const minutes = Math.floor(seekSeconds / 60);
        const seconds = Math.floor(seekSeconds % 60);
        currentTimeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        const progress = (seekSeconds / window.audioState.duration) * 100;
        progressBar.style.width = `${progress}%`;
        progressHandle.style.left = `${progress}%`;
        
        window.audioState.isPlaying = true;
        window.audioState.startTime = new Date() - (seekSeconds * 1000);
        
        const contentFragments = window.audioState.utteranceQueue;
        let totalTextLength = 0;
        let seekTextPosition = 0;
        
        contentFragments.forEach(fragment => {
            totalTextLength += fragment.length;
        });
        
        seekTextPosition = Math.floor((seekSeconds / window.audioState.duration) * totalTextLength);
        
        let accumulatedLength = 0;
        for (let i = 0; i < contentFragments.length; i++) {
            accumulatedLength += contentFragments[i].length;
            if (accumulatedLength >= seekTextPosition) {
                window.audioState.currentChunkIndex = i;
                break;
            }
        }
        
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        playBtn.setAttribute('aria-label', 'Pause playback');
        audioPlayer.classList.add('playing');
        
        playNextChunk(card, playBtn);
        startTimer(card);
        startHeartbeat(card);
    }
    
    function startTimer(card) {
        const progressBar = card.querySelector('.audio-progress-bar');
        const progressHandle = card.querySelector('.audio-progress-handle');
        const currentTimeElement = card.querySelector('.current-time');
        
        if (window.audioState.timerInterval) {
            clearInterval(window.audioState.timerInterval);
        }
        
        window.audioState.timerInterval = setInterval(() => {
            if (!window.audioState.isPlaying) return;
            
            const elapsedSeconds = calculatePlaybackPosition();
            const progressPercentage = Math.min((elapsedSeconds / window.audioState.duration) * 100, 100);
            
            progressBar.style.width = `${progressPercentage}%`;
            progressHandle.style.left = `${progressPercentage}%`;
            
            const minutes = Math.floor(elapsedSeconds / 60);
            const seconds = Math.floor(elapsedSeconds % 60);
            currentTimeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            if (elapsedSeconds >= window.audioState.duration) {
                resetPlayback(card);
            }
        }, 100);
    }
    
    function startHeartbeat(card) {
        if (window.audioState.heartbeatInterval) {
            clearInterval(window.audioState.heartbeatInterval);
        }
        
        window.audioState.lastHeartbeatTime = new Date();
        
        window.audioState.heartbeatInterval = setInterval(() => {
            if (!window.audioState.isPlaying) return;
            
            const now = new Date();
            const timeSinceLastHeartbeat = now - window.audioState.lastHeartbeatTime;
            
            if (timeSinceLastHeartbeat > 3000 && 
                !window.speechSynthesis.speaking && 
                !window.speechSynthesis.pending &&
                window.audioState.currentChunkIndex < window.audioState.utteranceQueue.length) {
                
                window.audioState.lastHeartbeatTime = now;
                
                if (window.audioState.recoveryAttempts < 3) {
                    window.audioState.recoveryAttempts++;
                    window.speechSynthesis.cancel();
                    const playBtn = card.querySelector('.audio-play-btn');
                    playNextChunk(card, playBtn);
                } else {
                    window.audioState.recoveryAttempts = 0;
                    window.audioState.currentChunkIndex++;
                    
                    if (window.audioState.currentChunkIndex < window.audioState.utteranceQueue.length) {
                        const playBtn = card.querySelector('.audio-play-btn');
                        window.speechSynthesis.cancel();
                        playNextChunk(card, playBtn);
                    } else {
                        resetPlayback(card);
                    }
                }
            }
        }, 1000);
    }
    
    function stopAllPlayback(resetUI = true) {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        
        if (window.audioState.timerInterval) {
            clearInterval(window.audioState.timerInterval);
        }
        
        if (window.audioState.heartbeatInterval) {
            clearInterval(window.audioState.heartbeatInterval);
        }
        
        if (window.audioState.speechEndTimeout) {
            clearTimeout(window.audioState.speechEndTimeout);
        }
        
        if (resetUI) {
            document.querySelectorAll('.audio-play-btn').forEach(btn => {
                btn.innerHTML = '<i class="fas fa-play"></i>';
                btn.setAttribute('aria-label', 'Listen to post');
            });
            
            document.querySelectorAll('.audio-player').forEach(player => {
                player.classList.remove('playing');
            });
            
            document.querySelectorAll('.audio-progress-bar').forEach(bar => {
                bar.style.width = '0%';
            });
            
            document.querySelectorAll('.audio-progress-handle').forEach(handle => {
                handle.style.left = '0%';
            });
            
            document.querySelectorAll('.current-time').forEach(timer => {
                timer.textContent = '0:00';
            });
            
            document.querySelectorAll('.post-card').forEach(card => {
                card.classList.remove('dimmed');
            });
        }
        
        window.audioState = {
            activeBlogId: window.audioState.activeBlogId,
            startTime: null,
            duration: window.audioState.duration,
            isPlaying: false,
            timerInterval: null,
            currentUtterance: null,
            utteranceQueue: window.audioState.utteranceQueue,
            currentChunkIndex: window.audioState.currentChunkIndex,
            pausePosition: window.audioState.pausePosition,
            heartbeatInterval: null,
            speechEndTimeout: null,
            lastHeartbeatTime: null,
            recoveryAttempts: 0
        };
    }
    
    function resetPlayback(card) {
        const playBtn = card.querySelector('.audio-play-btn');
        const audioPlayer = card.querySelector('.audio-player');
        const progressBar = card.querySelector('.audio-progress-bar');
        const progressHandle = card.querySelector('.audio-progress-handle');
        const currentTimeElement = card.querySelector('.current-time');
        
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        playBtn.setAttribute('aria-label', 'Listen to post');
        audioPlayer.classList.remove('playing');
        
        progressBar.style.width = '0%';
        progressHandle.style.left = '0%';
        currentTimeElement.textContent = '0:00';
        
        if (window.audioState.timerInterval) {
            clearInterval(window.audioState.timerInterval);
        }
        
        if (window.audioState.heartbeatInterval) {
            clearInterval(window.audioState.heartbeatInterval);
        }
        
        if (window.audioState.speechEndTimeout) {
            clearTimeout(window.audioState.speechEndTimeout);
        }
        
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        
        document.querySelectorAll('.post-card').forEach(otherCard => {
            otherCard.classList.remove('dimmed');
        });
        
        window.audioState.isPlaying = false;
        window.audioState.activeBlogId = null;
        window.audioState.currentChunkIndex = 0;
        window.audioState.pausePosition = 0;
    }
    
    function addAudioStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .audio-player-container {
                padding: 0;
                width: 100%;
                margin-top: auto;
                position: relative;
            }
            
            .audio-player {
                display: flex;
                flex-direction: column;
                position: relative;
                width: 100%;
                border-radius: 0 0 12px 12px;
                background-color: rgba(var(--primary-color-rgb, 0, 255, 159), 0.08);
                backdrop-filter: blur(8px);
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                overflow: hidden;
                border-top: 1px solid rgba(var(--primary-color-rgb, 0, 255, 159), 0.15);
            }
            
            .post-card {
                display: flex;
                flex-direction: column;
                height: 100%;
                overflow: hidden;
            }
            
            .post-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                height: 100%;
            }
            
            .audio-player:hover {
                background-color: rgba(var(--primary-color-rgb, 0, 255, 159), 0.12);
            }
            
            .audio-player.playing {
                background-color: rgba(var(--primary-color-rgb, 0, 255, 159), 0.18);
                border-color: rgba(var(--primary-color-rgb, 0, 255, 159), 0.3);
            }
            
            .audio-player-top {
                display: flex;
                align-items: center;
                padding: 12px 16px;
                gap: 12px;
            }
            
            .audio-play-btn {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background-color: var(--primary-color);
                color: var(--bg-color);
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                padding: 0;
                font-size: 14px;
                flex-shrink: 0;
                z-index: 1;
                box-shadow: 0 4px 12px rgba(var(--primary-color-rgb, 0, 255, 159), 0.4);
            }
            
            .audio-play-btn:hover {
                background-color: var(--secondary-color);
                transform: scale(1.05);
                box-shadow: 0 6px 16px rgba(var(--primary-color-rgb, 0, 255, 159), 0.5);
            }
            
            .audio-player.playing .audio-play-btn {
                animation: pulse-audio 2s infinite;
            }
            
            @keyframes pulse-audio {
                0% {
                    box-shadow: 0 0 0 0 rgba(var(--primary-color-rgb, 0, 255, 159), 0.7);
                }
                70% {
                    box-shadow: 0 0 0 10px rgba(var(--primary-color-rgb, 0, 255, 159), 0);
                }
                100% {
                    box-shadow: 0 0 0 0 rgba(var(--primary-color-rgb, 0, 255, 159), 0);
                }
            }
            
            .audio-info {
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            
            .audio-title {
                font-size: 14px;
                font-weight: 600;
                color: var(--text-color);
                margin-bottom: 4px;
            }
            
            .audio-timer {
                display: flex;
                align-items: center;
                font-size: 12px;
                opacity: 0.8;
                font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            }
            
            .time-separator {
                margin: 0 4px;
                opacity: 0.6;
            }
            
            .audio-progress {
                position: relative;
                width: 100%;
                height: 4px;
                background-color: rgba(var(--text-color-rgb, 55, 65, 81), 0.1);
                cursor: pointer;
            }
            
            .audio-progress:hover {
                height: 6px;
            }
            
            .audio-progress:hover .audio-progress-handle {
                transform: scale(1);
                opacity: 1;
            }
            
            .audio-progress-bar {
                height: 100%;
                background-color: var(--primary-color);
                width: 0%;
                transition: width 0.1s linear;
                position: relative;
            }
            
            .audio-progress-handle {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background-color: var(--primary-color);
                position: absolute;
                top: 50%;
                transform: scale(0) translateY(-50%);
                left: 0%;
                margin-left: -6px;
                margin-top: 0px;
                transition: transform 0.2s ease, opacity 0.2s ease;
                opacity: 0;
                box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
                z-index: 2;
            }
            
            .audio-player.playing .audio-progress-handle,
            .audio-progress:hover .audio-progress-handle {
                transform: scale(1) translateY(-50%);
                opacity: 1;
            }
            
            .post-card.dimmed {
                opacity: 0.7;
                filter: grayscale(20%);
                transition: opacity 0.3s ease, filter 0.3s ease;
            }
            
            @media (max-width: 768px) {
                .audio-player-top {
                    padding: 10px 12px;
                }
                
                .audio-play-btn {
                    width: 32px;
                    height: 32px;
                    font-size: 12px;
                }
                
                .audio-title {
                    font-size: 13px;
                }
            }
            
            :root {
                --primary-color-rgb: 0, 255, 159;
                --text-color-rgb: 55, 65, 81;
            }
            
            [data-theme="light"] {
                --primary-color-rgb: 0, 180, 120;
                --text-color-rgb: 55, 65, 81;
            }
            
            [data-theme="dark"] {
                --primary-color-rgb: 0, 255, 159;
                --text-color-rgb: 229, 231, 235;
            }
        `;
        document.head.appendChild(styleElement);
    }
    
    function loadVoices() {
        return new Promise((resolve) => {
            let voices = window.speechSynthesis.getVoices();
            if (voices.length) {
                resolve(voices);
                return;
            } 
            
            window.speechSynthesis.onvoiceschanged = () => {
                voices = window.speechSynthesis.getVoices();
                resolve(voices);
            };
            
            setTimeout(() => {
                voices = window.speechSynthesis.getVoices();
                if (voices.length) {
                    resolve(voices);
                }
            }, 200);
        });
    }
    
    async function initAudioFeatures() {
        addAudioStyles();
        
        await loadVoices();
        
        addAudioFeaturesToPosts();
        
        window.addEventListener('beforeunload', function() {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        });
        
        window.addEventListener('blur', function() {
            if (window.audioState && window.audioState.isPlaying) {
                window.speechSynthesis.pause();
                window.audioState.pausedByWindowBlur = true;
            }
        });
        
        window.addEventListener('focus', function() {
            if (window.audioState && window.audioState.pausedByWindowBlur) {
                window.speechSynthesis.resume();
                window.audioState.pausedByWindowBlur = false;
                
                setTimeout(() => {
                    if (window.audioState.isPlaying && 
                        !window.speechSynthesis.speaking && 
                        !window.speechSynthesis.pending &&
                        window.audioState.currentChunkIndex < window.audioState.utteranceQueue.length) {
                        
                        const card = document.querySelector(`[data-blog-id="${window.audioState.activeBlogId}"]`);
                        if (card) {
                            const playBtn = card.querySelector('.audio-play-btn');
                            window.speechSynthesis.cancel();
                            playNextChunk(card, playBtn);
                        }
                    }
                }, 300);
            }
        });
        
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                if (window.audioState && window.audioState.isPlaying) {
                    window.speechSynthesis.pause();
                    window.audioState.pausedByVisibility = true;
                }
            } else {
                if (window.audioState && window.audioState.pausedByVisibility) {
                    window.audioState.pausedByVisibility = false;
                    window.speechSynthesis.resume();
                    
                    setTimeout(() => {
                        if (window.audioState.isPlaying && 
                            !window.speechSynthesis.speaking && 
                            !window.speechSynthesis.pending &&
                            window.audioState.currentChunkIndex < window.audioState.utteranceQueue.length) {
                            
                            const card = document.querySelector(`[data-blog-id="${window.audioState.activeBlogId}"]`);
                            if (card) {
                                const playBtn = card.querySelector('.audio-play-btn');
                                window.speechSynthesis.cancel();
                                playNextChunk(card, playBtn);
                            }
                        }
                    }, 300);
                }
            }
        });
    }
    
    setTimeout(initAudioFeatures, 100);
});