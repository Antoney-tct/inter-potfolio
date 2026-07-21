/**
 * Main JavaScript File
 * 
 * Handles global UI interactions for the portfolio website including:
 * - Theme toggling (Dark/Light mode)
 * - Mobile navigation menu
 * - Scroll animations (IntersectionObserver)
 * - Back to top button logic
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Set Copyright Year
    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }

    // 2. Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const body = document.body;
        const icon = themeToggle.querySelector('i');

        // Applied theme on initial load
        if (localStorage.getItem('theme') === 'dark') {
            body.classList.add('dark-mode');
            if (icon) icon.className = 'fas fa-sun';
        } else {
            if (icon) icon.className = 'fas fa-moon';
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            if (icon) icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        });
    }

    // 3. Mobile Menu
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navClose = document.getElementById('navClose');

    if (menuToggle && navMenu && navClose) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        navClose.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') &&
                !navMenu.contains(e.target) &&
                !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }

    // 4. Back to Top Button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 300);
        });

        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 5. Smooth Scroll for on-page anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length < 2) return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (menuToggle) menuToggle.classList.remove('active');
                }
            }
        });
    });

    // 6. Animation on Scroll (IntersectionObserver)
    const animatedElements = document.querySelectorAll('.skill-card, .work-card, .hand-drawn-card, .contact-item, .testimonial-card, .post-card, .service-card');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    
    // 7. Dynamic Content Rendering (Moved from index.html for better organization)
    renderFeaturedWork();
    renderRecentPosts();

    // 8. Bot Toney Initialization
    initChatbot();

    // 9. Testimonial Carousel Initialization
    initTestimonialCarousel();
});

/**
 * Handles the rule-based chatbot logic
 */
function initChatbot() {
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const closeChat = document.getElementById('closeChat');
    const sendChat = document.getElementById('sendChat');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const replyPreview = document.getElementById('replyPreview');
    const quotedTextPreview = document.querySelector('#replyPreview .quoted-text-preview');
    const clearReplyBtn = document.getElementById('clearReplyBtn');

    if (!chatToggle || !chatWindow || !chatInput || !chatMessages) return;

    let userName = localStorage.getItem('userName');
    let isWaitingForName = false;
    let idleTimer = null;
    let idleSuggestionSent = false;

    let currentReplyToText = null; // Stores the text of the message being replied to
    const ringtone = new Audio('sound/universfield-new-notification-022-370046.mp3');
    const sentSound = new Audio('sound/pop.mp3');

    const responses = {
        skills: [
            "Antoney specializes in web development (PHP, MySQL, JS), UI/UX design using Figma, and Quality Assurance (QA) testing. He loves building things that are both beautiful and robust.",
            "His main crafts are: 1) Web Development for thoughtful, responsive sites. 2) UI/UX & Design to create warm, intuitive interfaces. 3) QA & Consulting to make sure digital products work perfectly."
        ],
        work: [
            "You can see his featured work right on this page! He's built e-commerce platforms, designed brand identities, and created testing frameworks. For a full list, check out the 'Projects' page.",
            "He has worked on a variety of projects. From full-stack e-commerce sites to detailed QA for mobile apps. Is there a specific type of work you're curious about?"
        ],
        process: [
            "He believes in crafting digital experiences with warmth. His process involves deeply understanding the user, creating clean designs, writing clean code, and robust testing to ensure a personal touch.",
            "His process is very human-centered. It starts with listening and understanding the goal, then moves to design, development, and thorough testing. He aims for quality and a bit of warmth in everything."
        ],
        contact: [
            "The best way to connect is by using the contact form on this page. He reads every message! You can also email him directly at aouko178@gmail.com.",
            "He'd love to hear from you! Just scroll down to the 'let's connect' section and send him a note. Or, if you prefer, his email is aouko178@gmail.com."
        ],
        about: [
            "Antoney is a business IT specialist from Nairobi, Kenya. He's passionate about creating technology that feels human and intuitive, bridging the gap between complex systems and real people.",
            "He's a tech creative who loves making things work perfectly. Part developer, part designer, and part QA expert, all with a focus on making technology feel more personal."
        ],
        location: [
            "Antoney is based in the vibrant city of Nairobi, Kenya. He's available for remote work with clients from anywhere in the world.",
            "He's located in Nairobi, Kenya, but the beauty of digital work means he can collaborate on projects globally!"
        ],
        education: [
            "He holds a Diploma in Business IT from Zetech University and has certifications in Cisco Networking and Cybersecurity. He's a big believer in lifelong learning.",
            "His formal education is a Diploma in Business IT, but he's also certified in Cisco Networking and constantly learning new skills to stay sharp."
        ],
        tools: [
            "His digital toolkit includes HTML, CSS, JavaScript, PHP, and MySQL for development. For design, he uses Figma and the Adobe Creative Suite. For QA, he's proficient with tools like JIRA.",
            "He uses a variety of tools to get the job done! For coding: VS Code with a stack of JS, PHP, and MySQL. For design: Figma is his go-to. For testing: a sharp eye and tools like JIRA."
        ],
        social: [
            "You can find him on LinkedIn, GitHub, and Instagram! All the links are in the footer at the bottom of the page. Go on, give him a follow!",
            "Absolutely! He's active on LinkedIn for professional stuff and GitHub for code. You can find the links in the footer."
        ],
        joke: [
            "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
            "I told my computer I needed a break, and now it won’t stop sending me Kit-Kat ads.",
            "Why was the JavaScript developer sad? Because he didn't know how to 'null' his feelings."
        ],
        how_are_you: [
            "I'm just a set of scripts, but I'm running at 100% efficiency! Thanks for asking. How can I help you?",
            "I'm doing great, thanks! Ready to assist you with any questions about Antoney."
        ],
        thanks: [
            "You're very welcome!",
            "No problem at all. Is there anything else?",
            "Happy to help! Let me know if you need more info."
        ],
        bye: [
            "Goodbye! Have a wonderful day.",
            "Catch you later! Feel free to pop back in anytime.",
            "Bye for now! Thanks for stopping by."
        ],
        default: [
            "That's an interesting question! I'm not equipped to answer that, but you could try asking about Antoney's 'skills', 'projects', or 'contact' info.",
            "I'm not sure I have the answer to that one. My knowledge is focused on Antoney's professional life. Maybe try asking about his 'process' or 'education'?",
            "Hmm, I'm drawing a blank. I can tell you about his 'work', 'skills', or how to 'get in touch' with him."
        ],
        idle_suggestion: [
            "Not sure what to ask? You can try asking about 'skills', 'work', or 'process'",
            "Just so you know, you can ask me about Antoney's 'projects' or how to 'contact' him",
            "Feel free to ask me anything! For example, try 'tell me a joke'."
        ]
    };

    // Initialize personality
    // This initial message is now handled by addMessage to ensure reply functionality is added
    // We'll clear the default message and add a new one via addMessage
    chatMessages.innerHTML = ''; // Clear initial message from HTML
    addMessage(userName ? `Welcome back, ${userName}! Ask me about Antoney's work, skills, or process :)` : "Hi! I'm Bot Toney. Ask me anything about Antoney!", false);



    function getRandomResponse(key) {
        const arr = responses[key];
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function getResponse(input) {
        const lowerInput = input.toLowerCase().trim();

        if (isWaitingForName) {
            userName = input.trim().split(' ')[0];
            userName = userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase();
            localStorage.setItem('userName', userName);
            isWaitingForName = false;
            return `Nice to meet you, ${userName}! How can I help you today?`;
        }

        // Name setting triggers
        if (lowerInput.startsWith('my name is') || lowerInput.startsWith('call me')) {
            let potentialName = input.replace(/^(my name is|call me)\s+/i, '').trim();
            if (potentialName) {
                userName = potentialName.split(' ')[0];
                userName = userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase();
                localStorage.setItem('userName', userName);
                return `Got it, I'll call you ${userName}! What can I do for you?`;
            }
        }

        // Logic triggers
        if (lowerInput.includes('how are you')) return getRandomResponse('how_are_you');
        if (lowerInput.includes('thank') || lowerInput.includes('thx')) return getRandomResponse('thanks');
        if (lowerInput === 'bye' || lowerInput === 'goodbye' || lowerInput.includes('see you')) return getRandomResponse('bye');
        if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
            const hour = new Date().getHours();
            const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
            if (userName) return `${greeting}, ${userName}! How can I help?`;
            isWaitingForName = true;
            return `${greeting}! I'm Bot Toney. I don't believe we've met, what's your name?`;
        }

        if (lowerInput.includes('skill') || lowerInput.includes('craft') || lowerInput.includes('what does he do')) return getRandomResponse('skills');
        if (lowerInput.includes('work') || lowerInput.includes('project') || lowerInput.includes('portfolio')) return getRandomResponse('work');
        if (lowerInput.includes('process') || lowerInput.includes('studio')) return getRandomResponse('process');
        if (lowerInput.includes('contact') || lowerInput.includes('email') || lowerInput.includes('phone')) return getRandomResponse('contact');
        if (lowerInput.includes('who are you') || lowerInput.includes('about') || lowerInput.includes('story')) return getRandomResponse('about');
        if (lowerInput.includes('joke') || lowerInput.includes('funny')) return getRandomResponse('joke');
        
        return getRandomResponse('default');
    }

    function addMessage(text, isUser, replyToText = null) {
        const div = document.createElement('div');
        div.className = isUser ? 'message user' : 'message bot';
        div.dataset.messageText = text; // Store original text for replying

        if (replyToText) {
            const quotedDiv = document.createElement('div');
            quotedDiv.className = 'quoted-text-in-message';
            quotedDiv.textContent = replyToText;
            div.appendChild(quotedDiv);
        }
        if (!isUser && /'[^']+'/.test(text)) {
            div.innerHTML = text.replace(/'([^']+)'/g, '<button class="suggestion-chip">$1</button>');
            setTimeout(() => {
                div.querySelectorAll('.suggestion-chip').forEach(btn => {
                    btn.onclick = () => { chatInput.value = btn.textContent; handleSendChat(); };
                });
            }, 0);
        } else {
            const textNode = document.createTextNode(text);
            div.appendChild(textNode);
        }

        // Add click listener to enable replying to this message
        div.addEventListener('click', () => {
            currentReplyToText = div.dataset.messageText;
            updateReplyPreview();
            chatInput.focus();
        });


        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleSendChat() {
        const msg = chatInput.value.trim();
        if (!msg) return;
        
        resetIdleTimer(); // Reset timer on user activity
        sentSound.play().catch(() => {});
        addMessage(msg, true, currentReplyToText); // Pass currentReplyToText
        chatInput.value = '';
        clearReplyState(); // Clear reply state after sending

        const typing = document.createElement('div');
        typing.className = 'message bot';
        typing.id = 'typingIndicator';
        typing.innerHTML = '<div class="typing-animation"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
        chatMessages.appendChild(typing);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
            document.getElementById('typingIndicator')?.remove();
            addMessage(getResponse(msg), false); // Bot's reply doesn't quote for now
            ringtone.play().catch(() => {});
        }, 1200);
    }

    function resetIdleTimer() {
        clearTimeout(idleTimer);
        idleSuggestionSent = false;
        if (chatWindow.style.display === 'flex') {
            idleTimer = setTimeout(() => {
                if (!idleSuggestionSent) {
                    addMessage(getRandomResponse('idle_suggestion'), false);
                    ringtone.play().catch(() => {});
                    idleSuggestionSent = true;
                }
            }, 10000);
        }
    }

    function updateReplyPreview() {
        if (currentReplyToText) {
            quotedTextPreview.textContent = currentReplyToText;
            replyPreview.style.display = 'flex';
        } else {
            replyPreview.style.display = 'none';
            quotedTextPreview.textContent = '';
        }
    }

    function clearReplyState() {
        currentReplyToText = null;
        updateReplyPreview();
    }

    chatToggle.onclick = () => {
        const isOpen = chatWindow.style.display === 'flex';
        chatWindow.style.display = isOpen ? 'none' : 'flex';
        if (!isOpen) resetIdleTimer();
    };
    closeChat.onclick = () => { chatWindow.style.display = 'none'; clearTimeout(idleTimer); };
    sendChat.onclick = handleSendChat;
    chatInput.onkeypress = (e) => { if (e.key === 'Enter') handleSendChat(); };
    clearReplyBtn.onclick = clearReplyState;
    chatInput.oninput = resetIdleTimer;
}

/**
 * Handles the Testimonial Carousel for mobile view
 */
function initTestimonialCarousel() {
    const grid = document.getElementById('testimonialGrid');
    const nav = document.getElementById('testimonialNav');
    const prev = document.getElementById('testimonialPrev');
    const next = document.getElementById('testimonialNext');

    if (!grid || !nav) return;

    const cards = grid.querySelectorAll('.testimonial-card');
    cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => grid.scrollTo({ left: cards[i].offsetLeft - 20, behavior: 'smooth' });
        nav.appendChild(dot);
    });

    const dots = nav.querySelectorAll('.testimonial-dot');
    grid.onscroll = () => {
        const index = Math.round(grid.scrollLeft / grid.offsetWidth);
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    };

    if (prev && next) {
        next.onclick = () => grid.scrollBy({ left: grid.offsetWidth, behavior: 'smooth' });
        prev.onclick = () => grid.scrollBy({ left: -grid.offsetWidth, behavior: 'smooth' });
    }
}

function renderFeaturedWork() {
    const featuredGrid = document.getElementById('featured-work-grid');
    if (!featuredGrid || typeof projectData === 'undefined') return;

    const featuredProjects = Object.entries(projectData)
        .sort(([, a], [, b]) => {
            if (a.category === 'Quality Assurance' && b.category !== 'Quality Assurance') return -1;
            return 0;
        })
        .slice(0, 3);

    featuredProjects.forEach(([id, project]) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'work-card';
        const tagsHtml = project.technologies.slice(0, 3)
            .map(t => `<a href="tool.html?name=${encodeURIComponent(t)}" class="work-tag">${t}</a>`).join('');

        cardDiv.innerHTML = `
            <a href="projects.html?filter=${encodeURIComponent(project.category)}" style="text-decoration: none; color: inherit; display: block;">
                <img src="${project.image}" alt="${project.title}" class="work-image" loading="lazy">
                <div class="work-content">
                    <span class="work-category">${project.category}</span>
                    <h3 style="margin-bottom: 10px;">${project.title}</h3>
                    <p style="font-size: 0.95rem;">${project.description.substring(0, 80)}...</p>
                    <div class="work-tags">${tagsHtml}</div>
                </div>
            </a>
            <div style="padding: 0 25px 25px;">
                <a href="project.html?id=${id}" class="btn btn-secondary" style="width: 100%; justify-content: center; font-size: 0.9rem;">View Details</a>
            </div>`;
        featuredGrid.appendChild(cardDiv);
    });
}

function renderRecentPosts() {
    const recentPostsGrid = document.getElementById('recent-posts-grid');
    if (!recentPostsGrid || typeof blogPosts === 'undefined') return;

    Object.entries(blogPosts).slice(0, 2).forEach(([id, post]) => {
        const cardLink = document.createElement('a');
        cardLink.href = `post.html?id=${id}`;
        cardLink.className = 'post-card-link';
        cardLink.innerHTML = `
            <div class="post-card">
                <img src="${post.image}" alt="${post.title}" class="post-image" loading="lazy">
                <div class="post-content">
                    <span class="post-meta">${post.date} · ${post.author}</span>
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <span class="post-read-more">Read More <i class="fas fa-arrow-right"></i></span>
                </div>
            </div>`;
        recentPostsGrid.appendChild(cardLink);
    });
}