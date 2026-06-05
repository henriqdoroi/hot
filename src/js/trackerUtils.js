// src/js/trackerUtils.js

/**
 * Utilitário para centralizar a configuração e disparo de eventos do Tracker.
 */
const TRACKER_CONFIG = {
    // Altere para a URL base do seu servidor de tracking (ex: https://tracker.meudominio.com)
    BASE_URL: 'https://verificar.sbs', 
    CAMPAIGN_SLUG: 'sabrina-vitoria-presell'
};

const TrackerUtils = {
    /**
     * Inicializa o script de tracking injetando-o na página
     */
    init: function() {
        const script = document.createElement('script');
        script.src = `${TRACKER_CONFIG.BASE_URL}/js/tracker.js`;
        script.setAttribute('data-campaign', TRACKER_CONFIG.CAMPAIGN_SLUG);
        script.defer = true;
        document.body.appendChild(script);
    },
    
    /**
     * Dispara um evento customizado
     * @param {string} eventName - Nome do evento (ex: 'purchase', 'lead_generated')
     * @param {string} label - Rótulo descritivo do evento
     * @param {object} metadata - Dados adicionais em formato JSON raso
     */
    track: function(eventName, label, metadata = {}) {
        if (window.Tracker) {
            window.Tracker.track(eventName, label, metadata);
        } else {
            console.warn('Tracker não inicializado ou bloqueado. Evento não enviado:', eventName);
        }
    },

    /**
     * Recupera o Visitor ID gerado pelo Tracker
     * @returns {string|null}
     */
    getVisitorId: function() {
        if (window.Tracker && typeof window.Tracker.getVisitorId === 'function') {
            return window.Tracker.getVisitorId();
        }
        return null;
    }
};

// Torna o utilitário global para ser usado em outros scripts
window.TrackerUtils = TrackerUtils;

// Inicializa o tracker na carga do arquivo
TrackerUtils.init();
