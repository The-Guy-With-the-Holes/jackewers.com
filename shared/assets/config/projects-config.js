function getProjectBaseUrl() {
    const currentScript = document.currentScript ||
        Array.from(document.scripts).find(script =>
            script.src && script.src.includes('/shared/assets/config/projects-config.js')
        );

    if (currentScript && currentScript.src) {
        return new URL('../../../', currentScript.src);
    }

    const baseHref = document.querySelector('base')?.getAttribute('href');
    if (baseHref) {
        return new URL(baseHref, window.location.href);
    }

    return new URL('./', window.location.href);
}

function resolveProjectUrl(url) {
    if (!url || typeof url !== 'string') return url;
    if (/^(https?:)?\/\//i.test(url) || url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('#')) {
        return url;
    }

    return new URL(url.replace(/^\//, ''), getProjectBaseUrl()).toString();
}

const placeHolderProjects =
[
    [
        'Linktree',
        '/linktree',
        'Redesigned Personal Portfolio',
        'A rework of a popular social link aggregation page into a modern, accessible personal portfolio featuring image carousel with camera integration, dark mode support, and responsive design. Built with vanilla JavaScript and modern CSS.',
        ['HTML/CSS', 'JavaScript', 'Responsive Design', 'Accessibility'],
        '/linktree/linktree-square.png',
        '/linktree/linktree-banner.png',
    ],
    [
        'Convertimatic',
        'https://bloodweb.net/converter/',
        'The ultimate unit converter',
        'An `almost` universal unit conversion tool supporting length, weight, temperature, color and more. Features a clean interface and real-time conversion. Built for Bloodweb.',
        ['JavaScript', 'Web Tools', 'Calculator'],
        'https://media.bloodweb.net/images/bloodweb/convertimatic/convertimatic-banner.png'
    ],
    [
        'Bloodweb Forms',
        'https://bloodweb.net/forms/',
        'Free drag-and-drop online form builder',
        'A free online form builder for Bloodweb: drag-and-drop field editing, shareable public links, and collected responses in one dashboard. Built with PHP and vanilla JavaScript.',
        ['PHP', 'JavaScript', 'Web Tools', 'SaaS', 'web'],
        'https://bloodweb.net/shared/og-image.php?title=Free+Online+Form+Builder&kind=default'
    ],
    [
        'Bloodweb Free Tools',
        'https://bloodweb.net/tools/',
        'Free converters, calculators & generators',
        'A growing suite of free browser-based utilities — converters, calculators and generators — built and hosted by Bloodweb. No sign-up, no tracking.',
        ['JavaScript', 'Web Tools', 'PHP', 'web'],
        'https://bloodweb.net/shared/og-image.php?title=Free+Online+Tools&kind=default'
    ],
    [
        'Be My Valentine',
        '/app/be-my-valentine/index.html',
        'A cute and quirky valentines day card',
        'A delightful interactive Valentine\'s Day card featuring cute animations and personalized messages. Perfect for sharing with someone special.',
        ['Creative', 'Web', 'Animation'],
        '/app/be-my-valentine/Peach_Goma_Heart.webp'
    ],
    [
        'WordPress Plugin: Tariff Manager',
        'https://bloodweb.net/plugins/tariff-manager/',
        'WordPress plugin for shipping tariffs',
        'A comprehensive WordPress plugin designed to help e-commerce businesses manage complex shipping tariffs and rates across different regions.',
        ['WordPress', 'PHP', 'E-commerce', 'Plugins','web'],
        'https://bloodweb.net/plugins/tariff-manager/tariff-manager.png'
    ],
    [
        'Am I Old Yet?',
        '/app/am-i-old-yet/index.html',
        'A reflective age-checking tool',
        'An interactive web application that humorously determines if you are "old" based on your slang usage. Built with modern web technologies.',
        ['Web', 'JavaScript', 'Humor'],
        '/app/am-i-old-yet/amioldyet.png'
    ],
    // [
    //     'S.P.I.N',
    //     '/app/S.P.I.N/index.html',
    //     'Stepper motor imaging project',
    //     'A specialized hardware project utilizing stepper motors for precise imaging applications. Features custom control software and hardware integration.',
    //     ['Hardware', 'Python', 'Motors', 'Imaging'],
    //     '/app/S.P.I.N/stepper-motor.jpg'
    // ],
    // [
    //     'P.W.M',
    //     '/app/P.W.M/index.html',
    //     'A secure password manager',
    //     'A robust password management solution with strong encryption and user-friendly interface. Helps users maintain secure, unique passwords across all platforms.',
    //     ['Security', 'Python', 'Encryption', 'Tools','hardware'],
    //     '/app/P.W.M/pi-pico.jpg'
    // ],
    [
        'WASAP',
        '/app/projects/doorbell/index.html',
        'Python Powered Smart Doorbell',
        'An intelligent doorbell system powered by Python, featuring remote notifications, video recording, and smart home integration capabilities.',
        ['Python', 'IoT', 'Hardware', 'Automation','web'],
        '/app/doorbell/arcade_button.jpg'
    ],
    // [
    //     'Router Management',
    //     'http://www.bloodweb.net:3000/Guest_network_3_control.html',
    //     'Web-based router control interface',
    //     'A comprehensive web interface for router management, providing easy access to network settings, guest network controls, and system monitoring.',
    //     ['Networking', 'System Admin', 'web'],
    //     '/app/router/router-management.jpg'
    // ],
    [
        'Regional Coupons',
        'https://bloodweb.net/plugins/regional-coupon/',
        'WordPress regional coupon system',
        'A sophisticated WordPress plugin enabling businesses to create location-based promotional campaigns with region-specific discount codes.',
        ['WordPress', 'PHP', 'E-commerce', 'Marketing','web'],
        'https://bloodweb.net/plugins/regional-coupon/regional-coupon.jpeg'
    ]   
]

window.placeHolderProjects = placeHolderProjects.map(item => {
    const normalized = [...item];

    // [Title, href, Short desc, Long desc, tags, square image Src, banner image src (optional)]
    normalized[1] = resolveProjectUrl(normalized[1]);
    normalized[5] = resolveProjectUrl(normalized[5]);
    if (normalized[6]) normalized[6] = resolveProjectUrl(normalized[6]);

    return normalized;
});