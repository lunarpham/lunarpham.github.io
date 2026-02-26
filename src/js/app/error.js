import { t } from '../modules/locales.js';
export function renderError(element, { title, message, showDate = false, datetime = null }) {
    if (!element) return;
    element.innerHTML = `
        <div class="error-container">
            <div class="error-icon">😵</div>
            <h1 class="error-title">${title || t('errorOccurred')}</h1>
            ${showDate && datetime ? `<p class="error-message">Date: ${datetime}</p>` : ''}
            <p class="error-message">${message}</p>
            <a href="/" class="error-link"><i class="fa-solid fa-arrow-left"></i> ${t('backToHome')}</a>
        </div>
    `;
}