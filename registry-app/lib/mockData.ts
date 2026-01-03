import { Extension } from './types';

export const mockExtensions: Extension[] = [
  {
    id: 'espresso-shot-debugger',
    name: 'Espresso Shot Debugger',
    description: 'A tool for debugging espresso machine output.',
    type: 'tool',
    tags: ['debug', 'devtools'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHtb18W5vJLQ9GtezZzsoyu5BHnM0CWfLg28Z1C0hRJncyTjdURQvtu9QED3wDjO--So06e2LCnOx2L1CimKs9EO87a607hTOMwQw6DlzP2SumSKQeUrKnLe-cD-J7qbZg9-clVV0iFsOwDlsRayt0oPdREvYTDfcJG848pEfXJwDs89M50Bv5OV1jQlyEC8j37JjugIEYQC91PbXc1VU9XEJ38VxHJaDjdElYA8loq8O3oMVVXJUHo0zNQcU2oU0kqKkJD2TwrWc',
    author: 'Cymbal Dev',
    version: '1.0.0',
    installCommand: 'gemini install espresso-debugger',
    readme: '# Espresso Shot Debugger\n' +
            '\n' +
            'This tool connects to Cymbal Coffee\'s IoT-enabled espresso machines to provide real-time telemetry and debugging capabilities.\n' +
            '\n' +
            '## Features\n' +
            '- **Pressure Profiling:** Visualize pressure curves in real-time.\n' +
            '- **Temperature Logs:** Extract historical boiler temperature data.\n' +
            '- **Error Codes:** Translate machine error codes into human-readable messages.\n' +
            '\n' +
            '## Usage\n' +
            'Run the following command to start a debugging session:\n' +
            '```bash\n' +
            'gemini run espresso-debugger --machine-id=12345\n' +
            '```'
  },
  {
    id: 'barista-buddy',
    name: 'Barista Buddy',
    description: 'Quick access to common barista tasks and information.',
    type: 'persona',
    tags: ['persona-barista', 'tools'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVJDrQhmkI43mV5gdgrnfF2_Usg-BBrlOxmh-5dGDu6UYKS9sR01zM4vWVbw7bKRQBRoHUFMkQ0atvbD-uunRfYhSSZddZWZqimKTZxa3HQgNUA9kZ7m4QYMBNYfyY9q5i-gFgUlnzyUGk_l5cKbtmq6ip0b40mGq8MmkvK7SbvjAIA-gDUtrk9-_j8OAUDczrI5JUW5_a51945KixzWYH615yQyrlsjNdnm59AUavk3tnasFKV9OnlVXMjUkBrSLMyWcwNwwPHM0',
    author: 'Store Ops',
    version: '2.1.0',
    installCommand: 'gemini install barista-buddy',
    readme: '# Barista Buddy Persona\n' +
            '\n' +
            'This persona configures Gemini to act as an expert barista mentor. It has deep knowledge of:\n' +
            '- Standard Operating Procedures (SOPs)\n' +
            '- Drink Recipes\n' +
            '- Customer Service Scripts\n' +
            '\n' +
            '## How to use\n' +
            'After installing, simply ask questions like:\n' +
            '> "What is the correct milk temperature for a Flat White?"\n' +
            '> "How do I clean the steam wand?"'
  },
  {
    id: 'roast-profile-analyzer',
    name: 'Roast Profile Analyzer',
    description: 'Analyze and compare coffee roast profiles.',
    type: 'tool',
    tags: ['analytics', 'roasting'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIYnl3XOB0CqED8scw4eUA2MiCDdP4s-Bb9Dsr_fpEQfp4gkmnFFR7ieB9QWU_5KvKFc_kQBFFN7pV7nUkfBF2dtI09zTKGr8-0Uy6l2ohE5GETF9IM3m2Ld84kHQT6pC7NHuk2C976YV47nVvzUGp0tS5rTXI9DW-RtH9tcjFAz-qe35rm8_BdgbILNMwRgyOfRC4pjPXli7rK2VDNLwVfcgY92bJKZAHHy2AXZ2zJVvb6SyiaJsOVfii0W7U4OYOSFXDQqoNiWE',
    author: 'Roastery Team',
    version: '0.9.5',
    installCommand: 'gemini install roast-analyzer',
    readme: '# Roast Profile Analyzer\n' +
            '\n' +
            'Import and analyze roast curves from standard roasting software (Cropster, Artisan).\n' +
            '\n' +
            '## Capabilities\n' +
            '- **Curve Comparison:** Overlay multiple roasts to check for consistency.\n' +
            '- **First Crack Detection:** Auto-detects audible events from audio logs.\n' +
            '- **Development Time Calculation:** Automatically calculates DTR%.'
  },
  {
    id: 'coffee-bean-sourcing',
    name: 'Coffee Bean Sourcing Tool',
    description: 'Track and manage coffee bean origins and suppliers.',
    type: 'tool',
    tags: ['sourcing', 'inventory'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBghR2Pjuac739vzNtwhTaXd2rjZnIZPJJ8s_yokajMpD-V2Ly46cyVZnieVjv8fWRD79Y6uIM3Y5f3jKZbnEp9U1S_HT3OhhCNT_fFA8xVHBEYhOLH3qkh_r30PTp6Rxm9BMmK2DOZyOo9sJ1VNberGS3-eHccs7Pg5F0PRy65LAX99WiFcGph1ddHrrNmCOr1EuybMcUogTYmptDl-D7XRXp-GyEQ2Zd0sgrpaZkz0xRdliXCgxOScbfhX96AQx4ZD7wMIdMS9d4',
    author: 'Supply Chain',
    version: '1.2.0',
    installCommand: 'gemini install bean-sourcing',
    readme: '# Coffee Bean Sourcing Tool\n' +
            '\n' +
            'Access the global Cymbal Coffee supply chain database directly from the CLI.\n' +
            '\n' +
            '## Commands\n' +
            '- `list-suppliers --region=africa`\n' +
            '- `check-fair-trade-status --id=SUP-992`\n' +
            '- `get-harvest-forecast --origin=colombia`'
  },
  {
    id: 'customer-feedback-hub',
    name: 'Customer Feedback Hub',
    description: 'Aggregate and view customer feedback in one place.',
    type: 'tool',
    tags: ['feedback', 'crm'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDZeTRbMh0DnJ6ccHJiDU1jUWAZQ--fa5uckZC5kUxF9StShqv0qQp_XHZJsTtmCJFu3vEOT3kI1kvLJ9jIwsaJk_NNpWlyg9Zc6PzTgj-VRvRemlje_UPvvin4_WYsBKvG4KMeKuT2V8dNzM3ExzwJquGNOsfxxpjHoLhq_vwp2odnlDfcTXj3nlYv5PnjjC_Y4iLY2k8w6ReKs0_eFsrillf3av3hcLi677Eef179wYDqlGrhoK-yexXXXSVVoQZqj6epszrEeI',
    author: 'Marketing',
    version: '1.0.1',
    installCommand: 'gemini install feedback-hub',
    readme: '# Customer Feedback Hub\n' +
            '\n' +
            'Analyze sentiment and keywords from recent customer reviews across all platforms (App, Google Maps, Yelp).\n' +
            '\n' +
            '## Quick Start\n' +
            '```\n' +
            'gemini run feedback-hub summarize --last-days=7\n' +
            '```'
  },
  {
    id: 'inventory-tracker',
    name: 'Inventory Tracker',
    description: 'Real-time tracking of coffee bean and supply inventory.',
    type: 'tool',
    tags: ['inventory', 'tools'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJWlUPhOlzEaUPxVd2GObOO69xA28kMgOVLgqxkPy8f3Sdl-Fh8IIrkypRFUxAzlxuAZSH0fMSqZJaAZPH51MROWj6GH03nsM5Y2y8HbG3JBspkj9Zh-mZ6uTDo0wRIsv1bpIvCPiI5Qu3WURiIBOMMK_VEAq3YEKncHlj-bX5LRfZR7QE9DSeowAphmRRMXZTyR6SyvC8J7--5YkfUSdYgseZvME_83L1sKZHNYEslrCbSAgTCotE4cjp5wEWtYYQ1DucjryCEuI',
    author: 'Store Ops',
    version: '3.0.0',
    installCommand: 'gemini install inventory-tracker',
    readme: '# Inventory Tracker\n' +
            '\n' +
            'Manage stock levels for beans, cups, lids, and syrups.\n' +
            '\n' +
            '## Alerts\n' +
            'This tool integrates with PagerDuty to alert store managers when stock falls below safety levels.'
  },
  {
    id: 'loyal-customer-persona',
    name: 'Loyal Customer Persona',
    description: 'Simulates behavior of a loyal, returning customer.',
    type: 'persona',
    tags: ['persona-customer', 'testing'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLlr-tj2AV_ctqn3np8CYiubUVnP3KTzjYBEiZIN1O-VuSztWA0noH2zwHgx6XYH2Axvi7qjh1xEk5_ifWRYe8OAy_0e66E-wwKwQsNevUUzICZPHDIvdfsbny72gcBW2_QioH467wqTL-hV0JL9VuEoZIUhudbetvMV5hmlUm48i8iOUtyWZAbZnD91aLyo814KV3Doq9jXao2p6fuyuSKBGdOunOlQYrv0anVTmdM8HcjMUPp_HL6qYyhP3-Qwwwa0OM-xPDoc8',
    author: 'QA Team',
    version: '0.5.0',
    installCommand: 'gemini install loyal-customer',
    readme: '# Loyal Customer Persona\n' +
            '\n' +
            '**For Testing Only.**\n' +
            '\n' +
            'This persona simulates "Gary", a customer who visits 5 times a week, knows the secret menu, and is very particular about foam texture. Use this to test new barista training bots.'
  },
  {
    id: 'shift-scheduler',
    name: 'Shift Scheduler',
    description: 'Tool for managing barista shifts and schedules.',
    type: 'tool',
    tags: ['management', 'tools'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2P1P1RY7anVKEnEuozwCwzXfWJ-p50W_Rj9UPVRl7u0pTZiuoYynaEYPF56MAsZy8moj9W4WSudnT1hGNeHnQF356YMgrGELsi9S8keMkoqytmWDaCcGPUP9gijFBbEJwXMXGeuigmf6My4NVtRBkWilngovRvfcla-rg-fkZAvAqYRv8YKBABeWl27HijHsHspCxNFjLNGsXcEytxDQpNsYPrReo5aruIrfyyVj-YJ9EbOsuUB0xSY_K1OX_r9svVMdPyqbKLe8',
    author: 'HR',
    version: '1.1.0',
    installCommand: 'gemini install shift-scheduler',
    readme: '# Shift Scheduler\n' +
            '\n' +
            'CLI interface for the Cymbal Coffee Workforce Management System.\n' +
            '\n' +
            '## Features\n' +
            '- Check upcoming shifts: `scheduler my-shifts`\n' +
            '- Request time off: `scheduler request-off --date=2023-12-25`\n' +
            '- Swap shifts: `scheduler swap --with=sarah --date=2023-12-24`'
  }
];
