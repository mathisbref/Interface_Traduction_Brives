const { createApp } = Vue;

createApp({
    data() {
        return {
            translations: [], // Les données du JSON seront chargées ici
            selectedLanguage: 'nl', // Langue par défaut
            selectedUrl: null,
            urls: [], // Liste des URLs uniques
            error: null,
            loading: true,
            dmp: new diff_match_patch() // Initialisation de la bibliothèque de comparaison
        }
    },
    computed: {
        filteredUrls() {
            // Filtrer les URLs en fonction de la langue sélectionnée
            const urlsForLanguage = new Set();
            this.translations.forEach(translation => {
                if (translation.language === this.selectedLanguage) {
                    translation.links.forEach(url => {
                        if (url && !url.startsWith('http://localhost') && !url.startsWith('#')) {
                            urlsForLanguage.add(this.cleanUrl(url));
                        }
                    });
                }
            });
            return Array.from(urlsForLanguage);
        }
    },
    methods: {
        cleanUrl(url) {
            // Supprimer les paramètres de requête
            return url.split('?')[0];
        },
        extractUrls(htmlString) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, 'text/html');
            const links = doc.querySelectorAll('a[href]');
            return Array.from(links)
                .map(link => link.href)
                .filter(url => {
                    // Garder uniquement les URLs qui ne sont pas des ancres, locales ou vides
                    return url && !url.startsWith('#') && !url.startsWith('http://localhost');
                });
        },
        selectUrl(url) {
            this.selectedUrl = url;
        },
        openUrl(url) {
            window.open(url, '_blank');
        },
        highlightDifferences(text1, text2) {
            // Calculer les différences
            const diffs = this.dmp.diff_main(text1, text2);
            this.dmp.diff_cleanupSemantic(diffs);
            
            // Convertir les différences en HTML
            let html = '';
            diffs.forEach(([type, text]) => {
                switch (type) {
                    case -1: // Suppression
                        html += `<span class="diff-delete">${text}</span>`;
                        break;
                    case 1: // Ajout
                        html += `<span class="diff-insert">${text}</span>`;
                        break;
                    case 0: // Égal
                        html += `<span class="diff-equal">${text}</span>`;
                        break;
                }
            });
            return html;
        },
        getCorrectionsForUrl(url) {
            return this.translations
                .filter(translation => 
                    translation.links.some(link => this.cleanUrl(link) === url) && 
                    translation.language === this.selectedLanguage
                )
                .map(translation => ({
                    original: translation.original,
                    translation: translation.translation,
                    correction: translation.correction
                }));
        },
        async loadTranslations() {
            try {
                this.loading = true;
                this.error = null;
                
                const response = await fetch('http://localhost:8080/translations.json');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                this.translations = data.aaData.map(item => ({
                    date: item[0],
                    translator: item[1],
                    language: item[2],
                    original: item[3],
                    translation: item[4],
                    correction: item[5],
                    links: this.extractUrls(item[6])
                }));

                // Plus besoin de stocker les URLs ici car elles sont gérées dans le computed filteredUrls
                this.urls = [];
            } catch (error) {
                this.error = `Erreur lors du chargement des traductions: ${error.message}`;
                console.error(this.error);
            } finally {
                this.loading = false;
            }
        }
    },
    mounted() {
        this.loadTranslations();
    }
}).mount('#app'); 