document.addEventListener('DOMContentLoaded', () => {
  // CONFIGURAÇÃO: Digite aqui o link para onde o usuário será redirecionado
  const BASE_REDIRECT_URL = 'https://phantoms.group/l/02b73473?shk=nzbgsjux';

  let userIp = '';

  // Busca o IP do usuário em background usando ipify com fallback para ipapi
  fetch('https://api.ipify.org?format=json')
    .then(res => res.json())
    .then(data => {
      userIp = data.ip;
    })
    .catch(() => {
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
          userIp = data.ip;
        })
        .catch(() => {});
    });

  // Função para capturar parâmetros da URL atual e repassar para a URL de destino
  function getFinalRedirectUrl() {
    try {
      const currentUrl = new URL(window.location.href);
      const destinationUrl = new URL(BASE_REDIRECT_URL, window.location.href);
      
      currentUrl.searchParams.forEach((value, key) => {
        // Apenas adiciona o parâmetro se a URL de destino já não tiver um com mesmo nome
        if (!destinationUrl.searchParams.has(key)) {
          destinationUrl.searchParams.set(key, value);
        }
      });
      return destinationUrl.toString();
    } catch (e) {
      return BASE_REDIRECT_URL;
    }
  }

  const REDIRECT_URL = getFinalRedirectUrl();

  const unlockBtn = document.getElementById('unlockButton');
  const unlockText = document.getElementById('unlockText');
  const unlockIcon = document.getElementById('unlockIcon');
  const timerClock = document.getElementById('timerClock');

  if (!unlockBtn || !unlockText || !unlockIcon) return;

  // Lógica do Temporizador de 5 minutos
  if (timerClock) {
    let duration = 5 * 60; // 5 minutos em segundos
    const timerInterval = setInterval(() => {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;

      timerClock.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      if (duration <= 0) {
        clearInterval(timerInterval);
        timerClock.classList.add('expired');
      } else {
        duration--;
      }
    }, 1000);
  }

  let isClicked = false;

  unlockBtn.addEventListener('click', () => {
    if (isClicked) return;
    isClicked = true;

    // Adiciona classe de loading e muda o ícone para spinner
    unlockBtn.classList.add('loading');
    unlockText.innerText = 'PROCESSANDO...';
    unlockIcon.innerHTML = `
      <svg class="spinner-svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
        <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="8" stroke="currentColor"></circle>
      </svg>
    `;

    // Simula uma pequena verificação de segurança/processamento de 800ms
    setTimeout(() => {
      // Muda para sucesso
      unlockBtn.classList.remove('loading');
      unlockBtn.classList.add('success');
      unlockText.innerText = 'ACESSO LIBERADO';
      unlockIcon.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;

      // Redireciona após 600ms
      setTimeout(() => {
        let finalRedirectUrl = REDIRECT_URL;
        if (userIp) {
          try {
            const urlObj = new URL(finalRedirectUrl);
            urlObj.searchParams.set('ip', userIp);
            finalRedirectUrl = urlObj.toString();
          } catch (e) {
            // Mantém a URL original em caso de falha
          }
        }

        if (window.TrackerUtils) {
            window.TrackerUtils.track('redirect', 'Redirecionamento Liberado', {
                destination_url: finalRedirectUrl,
                ip: userIp
            });
        }
        window.location.href = finalRedirectUrl;
      }, 600);
    }, 800);
  });
});
