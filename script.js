document.addEventListener('DOMContentLoaded', () => {
    // --- Custom Cursor ---
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    window.addEventListener('mousemove', function (e) {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }));

    // --- Scroll Animation ---
    const observerOptions = { threshold: 0.1 };
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
        fadeObserver.observe(section);
    });

    // --- Particle Background ---
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray;

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = '#00f2ff'; // Cyan
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            let color = '#00f2ff';

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles();
    }

    function connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                    + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = 'rgba(0, 242, 255,' + opacityValue + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    window.addEventListener('resize', () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        initParticles();
    });

    initParticles();
    animateParticles();

    // --- Command Palette ---
    const commandPalette = document.getElementById('command-palette');
    const cpInput = document.getElementById('cp-input');
    const cpResults = document.getElementById('cp-results');

    const commands = [
        { name: 'Go to Home', icon: 'fa-home', action: () => window.location.href = '#home' },
        { name: 'Go to About', icon: 'fa-user', action: () => window.location.href = '#about' },
        { name: 'Go to Skills', icon: 'fa-code', action: () => window.location.href = '#skills' },
        { name: 'Go to Experience', icon: 'fa-briefcase', action: () => window.location.href = '#experience' },
        { name: 'Go to Education', icon: 'fa-graduation-cap', action: () => window.location.href = '#education' },
        { name: 'Contact Me', icon: 'fa-envelope', action: () => window.location.href = '#contact' },
        { name: 'View GitHub', icon: 'fa-github', action: () => window.open('https://github.com/jayeshmanani/', '_blank') },
        { name: 'View LinkedIn', icon: 'fa-linkedin', action: () => window.open('https://linkedin.com/in/mananijayesh', '_blank') },
        { name: 'Toggle Theme (Coming Soon)', icon: 'fa-adjust', action: () => alert('Theme toggle coming soon!') },
    ];

    function openCommandPalette() {
        commandPalette.classList.add('active');
        cpInput.value = '';
        cpInput.focus();
        renderCommands(commands);
    }

    function closeCommandPalette() {
        commandPalette.classList.remove('active');
    }

    function renderCommands(list) {
        cpResults.innerHTML = '';
        list.forEach((cmd, index) => {
            const div = document.createElement('div');
            div.className = 'cp-item';
            div.innerHTML = `<i class="fa-brands ${cmd.icon} fa-solid"></i> ${cmd.name}`;
            div.addEventListener('click', () => {
                cmd.action();
                closeCommandPalette();
            });
            cpResults.appendChild(div);
        });
    }

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openCommandPalette();
        }
        if (e.key === 'Escape') {
            closeCommandPalette();
        }
    });

    // Close on click outside
    commandPalette.addEventListener('click', (e) => {
        if (e.target === commandPalette) {
            closeCommandPalette();
        }
    });

    // Filter commands
    cpInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = commands.filter(cmd => cmd.name.toLowerCase().includes(term));
        renderCommands(filtered);
    });
});
