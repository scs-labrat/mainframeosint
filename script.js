document.addEventListener('DOMContentLoaded', () => {
    const targetInput = document.getElementById('target');
    const searchTypeCheckboxes = document.querySelectorAll('input[name="searchType"]');
    const generateBtn = document.getElementById('generate-btn');
    const taskListDiv = document.getElementById('task-list');

    const pivotIpInput = document.getElementById('pivot-ip');
    const pivotIpBtn = document.getElementById('pivot-ip-btn');
    const pivotDomainInput = document.getElementById('pivot-domain');
    const pivotDomainWhoisBtn = document.getElementById('pivot-domain-whois-btn');
    const pivotDomainCrtshBtn = document.getElementById('pivot-domain-crtsh-btn');

    const exportJsonBtn = document.getElementById('export-json-btn');
    const exportOutputTextarea = document.getElementById('export-output');

    let generatedTasks = []; // Store generated tasks for export

    // --- URL Generation Logic ---

    const generateUrls = (target, selectedTypes) => {
        const tasks = [];
        const encodedTarget = encodeURIComponent(target);
        const encodedQuotedTarget = encodeURIComponent(`"${target}"`);
        const commonPorts = "21,23,992,3270"; // Common mainframe related ports for Shodan

        // Basic IP/CIDR detection (simple)
        const isIpOrCidr = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(\/\d{1,2})?$/.test(target);

        selectedTypes.forEach(type => {
            let url = '';
            let description = '';
            let source = '';

            switch (type) {
                case 'google_jobs':
                    source = 'Google';
                    description = `Search for ${target} mainframe job postings`;
                    url = `https://www.google.com/search?q=${encodedQuotedTarget}+intext%3Acareer+OR+intext%3Ajobs+mainframe+COBOL+JCL`;
                    break;
                case 'google_tech':
                    source = 'Google';
                    description = `Search for ${target} technical configuration files`;
                    url = `https://www.google.com/search?q=${encodedQuotedTarget}+filetype%3Acfg+OR+filetype%3Aconf+OR+filetype%3Aini+OR+ext%3Alog+ mainframe`;
                    break;
                 case 'google_open_dir':
                    source = 'Google';
                    description = `Search for open directories related to ${target}`;
                    url = `https://www.google.com/search?q=intitle%3A%22Index+of...%22+${encodedQuotedTarget}`;
                    break;
                case 'shodan_org':
                    source = 'Shodan';
                    description = `Search Shodan for organization "${target}" (Ports: ${commonPorts})`;
                    url = `https://www.shodan.io/search?query=org%3A${encodedQuotedTarget}+port%3A${commonPorts}`;
                    break;
                case 'shodan_net':
                    source = 'Shodan';
                    if (isIpOrCidr) {
                        description = `Search Shodan for network ${target} (Ports: ${commonPorts})`;
                        url = `https://www.shodan.io/search?query=net%3A${encodedTarget}+port%3A${commonPorts}`;
                    } else {
                         description = `Shodan Network Search (Requires IP/CIDR target) - SKIPPED`;
                         url = null; // Indicate skipped task
                    }
                    break;
                case 'github_code':
                    source = 'GitHub';
                    description = `Search GitHub code for "${target}" mentions with COBOL or JCL`;
                    url = `https://github.com/search?q=${encodedQuotedTarget}+COBOL+OR+JCL&type=code`;
                    break;
                 case 'sec_edgar':
                    source = 'Google (SEC EDGAR)';
                    description = `Search SEC EDGAR filings for ${target} via Google`;
                    // Note: Direct EDGAR search is complex, Google site search is simpler proxy
                    url = `https://www.google.com/search?q=site%3Asec.gov%2FArchives%2Fedgar%2Fdata%2F+${encodedQuotedTarget}`;
                    break;
                case 'vendor_case_studies':
                    source = 'Google (Vendors)';
                    description = `Search major vendors for ${target} mainframe case studies`;
                    // Example vendors, could be expanded
                    url = `https://www.google.com/search?q=${encodedQuotedTarget}+mainframe+"case+study"+(site%3Aibm.com+OR+site%3Abmc.com+OR+site%3Aca.com+OR+site%3Amicrofocus.com)`;
                    break;
                 case 'dev_forums':
                    source = 'Google (Forums)';
                    description = `Search developer forums for ${target} related mainframe topics`;
                    // Example forums
                    url = `https://www.google.com/search?q=${encodedQuotedTarget}+mainframe+(site%3Astackoverflow.com+OR+site%3Aibm.com%2Fcommunity+OR+site%3Atek-tips.com)`;
                    break;
                case 'paste_sites':
                    source = 'Google (Paste Sites)';
                    description = `Search paste sites for mentions of ${target}`;
                    // Example paste sites
                    url = `https://www.google.com/search?q=${encodedQuotedTarget}+(site%3Apastebin.com+OR+site%3Acontrolc.com+OR+site%3Ajustpaste.it)`;
                    break;

            }

            if (url) {
                tasks.push({ source, type, description, url });
            } else if (description.includes('SKIPPED')) {
                 // Optionally add skipped tasks to UI for feedback
                 tasks.push({ source, type, description, url: '#' }); // Use '#' or null URL
            }
        });

        return tasks;
    };

    // --- Display Logic ---

    const displayTasks = (tasks) => {
        taskListDiv.innerHTML = ''; // Clear previous results

        if (tasks.length === 0) {
            taskListDiv.innerHTML = '<p>No search types selected or no tasks generated.</p>';
            return;
        }

        tasks.forEach(task => {
            const item = document.createElement('div');
            item.classList.add('task-item');

            const info = document.createElement('div');
            info.classList.add('task-info');
            info.innerHTML = `
                <strong>${task.source}</strong>
                <span>${task.description}</span>
            `;

            const button = document.createElement('button');
             if (task.url && task.url !== '#') {
                button.textContent = 'Launch Search';
                button.onclick = () => window.open(task.url, '_blank');
            } else {
                button.textContent = 'Skipped';
                button.disabled = true;
                button.style.backgroundColor = '#ccc';
                button.style.cursor = 'not-allowed';
            }


            item.appendChild(info);
            item.appendChild(button);
            taskListDiv.appendChild(item);
        });
    };

    // --- Event Listeners ---

    generateBtn.addEventListener('click', () => {
        const target = targetInput.value.trim();
        if (!target) {
            alert('Please enter a target.');
            return;
        }

        const selectedTypes = Array.from(searchTypeCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        generatedTasks = generateUrls(target, selectedTypes);
        displayTasks(generatedTasks);
        exportOutputTextarea.value = ''; // Clear previous export
    });

    // Pivoting Event Listeners
    pivotIpBtn.addEventListener('click', () => {
        const ip = pivotIpInput.value.trim();
        if (ip) {
            const url = `https://www.shodan.io/host/${encodeURIComponent(ip)}`;
            window.open(url, '_blank');
        } else {
            alert('Please enter an IP address.');
        }
    });

    pivotDomainWhoisBtn.addEventListener('click', () => {
        const domain = pivotDomainInput.value.trim();
        if (domain) {
            // Using a simple public Whois lookup redirector
            const url = `https://www.whois.com/whois/${encodeURIComponent(domain)}`;
            window.open(url, '_blank');
        } else {
            alert('Please enter a domain.');
        }
    });

     pivotDomainCrtshBtn.addEventListener('click', () => {
        const domain = pivotDomainInput.value.trim();
        if (domain) {
            const url = `https://crt.sh/?q=${encodeURIComponent(domain)}`;
            window.open(url, '_blank');
        } else {
            alert('Please enter a domain.');
        }
    });

    // Export Event Listener
    exportJsonBtn.addEventListener('click', () => {
        if (generatedTasks.length === 0) {
            exportOutputTextarea.value = 'No tasks generated yet to export.';
            return;
        }
        // Filter out skipped tasks for export
        const tasksToExport = generatedTasks.filter(task => task.url && task.url !== '#');
        const jsonOutput = JSON.stringify(tasksToExport, null, 2); // Pretty print JSON
        exportOutputTextarea.value = jsonOutput;
    });

});

