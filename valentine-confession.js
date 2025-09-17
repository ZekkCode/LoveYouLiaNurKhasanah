// Improved Valentine Confession JavaScript with better mobile support

// Romantic Popup System
let currentPopup = 1;
let popupsShown = false;

// Show popup when page loads
$(document).ready(function() {
	// Prevent body scroll when popup is active
	$('body').addClass('popup-open');
	
	// Fix viewport for mobile
	$('html, body').css({
		'overflow': 'hidden',
		'height': '100%',
		'position': 'fixed',
		'width': '100%'
	});
	
	// Show first popup after a short delay
	setTimeout(function() {
		showPopup(1);
	}, 500);

	// Music player setup
	initMusicPlayer();
});

function showPopup(popupNumber) {
	$('#popup-overlay').removeClass('hidden');
	$('.popup-box').removeClass('popup-active');
	$('#popup-' + popupNumber).addClass('popup-active');
	currentPopup = popupNumber;
	
	// Prevent body scroll
	$('body').addClass('popup-open');
	
	// Add floating hearts effect
	createPopupHearts();
}

function showNextPopup(nextPopup) {
	// Fade out current popup
	$('#popup-' + currentPopup).removeClass('popup-active');
	
	// Show next popup after delay
	setTimeout(function() {
		showPopup(nextPopup);
	}, 300);
}

function closePopups() {
	$('#popup-overlay').addClass('hidden');
	popupsShown = true;
	
	// Allow body scroll again
	$('body').removeClass('popup-open');
	
	// Restore normal scrolling
	$('html, body').css({
		'overflow': 'visible',
		'height': 'auto',
		'position': 'static',
		'width': 'auto'
	});
	
	// Show instruction after popup closes
	setTimeout(function() {
		$('.instruction').fadeIn(1000);
	}, 500);
}

function createPopupHearts() {
	for (let i = 0; i < 3; i++) {
		setTimeout(() => {
			const heart = $('<div class="floating-popup-heart">💖</div>');
			const startX = Math.random() * window.innerWidth;
			const duration = 3000 + Math.random() * 2000;
			
			heart.css({
				position: 'fixed',
				left: startX + 'px',
				bottom: '-50px',
				fontSize: Math.random() * 10 + 15 + 'px',
				color: ['#ff6b9d', '#ff8fab', '#ffb3d1'][Math.floor(Math.random() * 3)],
				pointerEvents: 'none',
				zIndex: 999,
				animation: `floatUpPopup ${duration}ms ease-out forwards`
			});
			
			$('body').append(heart);
			
			setTimeout(() => {
				heart.remove();
			}, duration);
		}, i * 800);
	}
}

// Add floating hearts animation CSS for popup
if (!$('#popup-hearts-style').length) {
	$('head').append(`
		<style id="popup-hearts-style">
			@keyframes floatUpPopup {
				0% {
					transform: translateY(0) rotate(0deg) scale(0);
					opacity: 1;
				}
				50% {
					transform: translateY(-50vh) rotate(180deg) scale(1);
					opacity: 1;
				}
				100% {
					transform: translateY(-100vh) rotate(360deg) scale(0);
					opacity: 0;
				}
			}
		</style>
	`);
}

// Hide instruction initially
$('.instruction').hide();

// Add touch feedback for heart
$(".heart").on("touchstart", function() {
	if (popupsShown) {
		$(this).css("transform", "translate(-50%, -50%) scale(1.1)");
	}
});

$(".heart").on("touchend", function() {
	if (popupsShown && !$("#messageState").is(":checked")) {
		$(this).css("transform", "translate(-50%, -50%) scale(1)");
	}
});

// Prevent heart click during popup
$(".heart").on("click", function(e) {
	if (!popupsShown) {
		e.preventDefault();
		e.stopPropagation();
		return false;
	}
});

// Main animation handler
$("#messageState").on("change", function(e) {
	// Only work if popups have been shown
	if (!popupsShown) {
		e.preventDefault();
		$("#messageState").prop("checked", false);
		return false;
	}
	
	$(".message").removeClass("openNor").removeClass("closeNor");
	
	if ($("#messageState").is(":checked")) {
		// Opening animation
		$(".instruction").fadeOut(800);
		$(".message").removeClass("closed").removeClass("no-anim").addClass("openNor");
		$(".heart").removeClass("closeHer").removeClass("openedHer").addClass("openHer");
		$(".container").stop().animate({
			"background": "linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #ff9ff3 100%)"
		}, 2000);
		console.log("Membuka pesan...");
	} else {
		// Closing animation
		$(".instruction").fadeIn(800);
		$(".message").removeClass("no-anim").addClass("closeNor");
		$(".heart").removeClass("openHer").removeClass("openedHer").addClass("closeHer");
		$(".container").stop().animate({
			"background": "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)"
		}, 2000);
		console.log("Menutup pesan...");
	}
});

// Message animation end handler
$(".message").on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
	console.log("Animasi Pesan Selesai");
	if ($(".message").hasClass("closeNor")) {
		$(".message").addClass("closed");
	}
	$(".message").removeClass("openNor").removeClass("closeNor").addClass("no-anim");
});

// Heart animation end handler
$(".heart").on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
	console.log("Animasi Hati Selesai");
	if (!$(".heart").hasClass("closeHer")) {
		$(".heart").addClass("openedHer").addClass("beating");
	} else {
		$(".heart").addClass("no-anim").removeClass("beating");
	}
	$(".heart").removeClass("openHer").removeClass("closeHer");
});

// Add subtle parallax effect on device orientation (mobile)
if (window.DeviceOrientationEvent) {
	window.addEventListener('deviceorientation', function(e) {
		const tilt = e.gamma; // Left-right tilt (-90 to 90)
		if (tilt !== null && Math.abs(tilt) < 30) {
			$(".heart").css("transform", 
				$("#messageState").is(":checked") 
					? `translate(-50%, -100%) rotate(${tilt * 0.3}deg)`
					: `translate(-50%, -50%) rotate(${tilt * 0.3}deg)`
			);
		}
	});
}

// Prevent zoom on double tap for better mobile experience
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
	const now = (new Date()).getTime();
	if (now - lastTouchEnd <= 300) {
		event.preventDefault();
	}
	lastTouchEnd = now;
}, false);

// Prevent scrolling on mobile during popup
document.addEventListener('touchmove', function(e) {
	if (!$('#popup-overlay').hasClass('hidden')) {
		e.preventDefault();
	}
}, { passive: false });

// Prevent pinch zoom
document.addEventListener('gesturestart', function (e) {
	e.preventDefault();
});

document.addEventListener('gesturechange', function (e) {
	e.preventDefault();
});

document.addEventListener('gestureend', function (e) {
	e.preventDefault();
});

// Add floating hearts effect when message is opened
function createFloatingHeart() {
	const heart = $('<div class="floating-heart">❤️</div>');
	const startX = Math.random() * window.innerWidth;
	
	heart.css({
		position: 'fixed',
		left: startX + 'px',
		bottom: '-50px',
		fontSize: '20px',
		color: '#ff6b9d',
		pointerEvents: 'none',
		zIndex: 5,
		animation: 'floatUp 4s ease-out forwards'
	});
	
	$('body').append(heart);
	
	setTimeout(() => {
		heart.remove();
	}, 4000);
}

// Add floating hearts animation CSS
if (!$('#floating-hearts-style').length) {
	$('head').append(`
		<style id="floating-hearts-style">
			@keyframes floatUp {
				0% {
					transform: translateY(0) rotate(0deg);
					opacity: 1;
				}
				100% {
					transform: translateY(-100vh) rotate(360deg);
					opacity: 0;
				}
			}
		</style>
	`);
}

// Trigger floating hearts when message opens
$("#messageState").on("change", function() {
	if ($(this).is(":checked")) {
		// Create multiple floating hearts with delays
		for (let i = 0; i < 5; i++) {
			setTimeout(() => createFloatingHeart(), i * 500);
		}
	}
});

// Mobile popup touch improvements
$(document).on('touchstart', '.popup-btn', function(e) {
	$(this).addClass('active');
});

$(document).on('touchend', '.popup-btn', function(e) {
	$(this).removeClass('active');
});

// Prevent popup close on overlay click for better mobile experience
$(document).on('touchstart click', '.popup-overlay', function(e) {
	if (e.target === this) {
		e.preventDefault();
		e.stopPropagation();
		return false;
	}
});

// Window resize handler - let CSS handle centering
$(window).on('resize orientationchange', function() {
	// Just trigger a reflow, CSS will handle positioning
	if (!$('#popup-overlay').hasClass('hidden')) {
		$('.popup-box.popup-active').css('opacity', '0.99').css('opacity', '1');
	}
});

// Improve popup button active states for mobile
$('<style>').text(`
	.popup-btn.active,
	.popup-btn:active {
		transform: translateY(-1px) scale(0.98) !important;
		background: linear-gradient(135deg, #ff5a8a 0%, #ff7ba3 100%) !important;
	}
`).appendTo('head');

// ---- Music Player Logic ----
function initMusicPlayer() {
	const audio = document.getElementById('bg-music');
	const btn = document.getElementById('music-toggle');
	if (!audio || !btn) return;

	// Ensure looping and preloading
	audio.loop = true;
	audio.preload = 'auto';
	audio.muted = false;
	audio.volume = 1;

	// Update UI helper
	function updateUI(isOn) {
		const label = btn.querySelector('.music-label');
		btn.classList.toggle('is-on', isOn);
		btn.setAttribute('aria-pressed', String(isOn));
		if (label) label.textContent = isOn ? 'ON' : 'OFF';
	}

	// Keep UI in sync with actual audio state
	audio.addEventListener('play', () => updateUI(true));
	audio.addEventListener('pause', () => updateUI(false));

	// Toggle handler (works for mobile tap and desktop click)
	let toggling = false;
	async function togglePlay() {
		if (toggling) return;
		toggling = true;
		try {
			if (audio.paused) {
				try { if (!isFinite(audio.duration)) audio.currentTime = 0; } catch(_) {}
				audio.muted = false;
				await audio.play();
			} else {
				audio.pause();
			}
		} catch (err) {
			console.warn('Autoplay blocked or play error:', err);
			updateUI(!audio.paused);
		} finally {
			toggling = false;
		}
	}
	btn.addEventListener('click', togglePlay);
	btn.addEventListener('touchstart', function(e){ e.preventDefault(); togglePlay(); }, { passive: false });

	// Try to start after user interaction (after popups flow closes)
	const tryStart = async () => {
		try {
			if (audio.paused) {
				audio.muted = false;
				await audio.play();
			}
		} catch (e) { /* ignore */ }
	};

	// When popups close, attempt to play
	const __closePopups = closePopups;
	closePopups = function() {
		__closePopups.apply(this, arguments);
		// Small delay to ensure overlay is gone
		setTimeout(tryStart, 300);
	};

	// Also attempt on first heart tap/click after popups
	$(document).one('click touchstart', 'body, .container, .heart, .message, .popup-btn', function() {
		tryStart();
	});

	// Initialize UI as OFF
	updateUI(false);

	// Attempt autoplay on load (may be blocked; we fall back to first user gesture)
	tryStart();
}

// ---- Cursor Heart Trail ----
(() => {
	let last = 0;
	const minDelay = 60; // ms between hearts
	const colors = ['#ff6b9d', '#ff8fab', '#ffb3d1', '#ffd1dc'];
	function spawnHeart(x, y) {
		const el = document.createElement('div');
		el.className = 'cursor-heart';
		el.textContent = Math.random() < 0.2 ? '💖' : (Math.random() < 0.5 ? '💕' : '❤️');
		const size = 12 + Math.round(Math.random() * 10);
		el.style.fontSize = size + 'px';
		el.style.color = colors[Math.floor(Math.random() * colors.length)];
		el.style.left = x + 'px';
		el.style.top = y + 'px';
		document.body.appendChild(el);
		setTimeout(() => el.remove(), 1300);
	}
	window.addEventListener('mousemove', (e) => {
		const now = Date.now();
		if (now - last < minDelay) return;
		last = now;
		spawnHeart(e.clientX, e.clientY);
	});
})();

// Cursor hearts effect (desktop only)
(function initCursorHearts(){
  const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  if (isTouch) return; // hanya untuk mouse/desktop

  const layer = document.getElementById('cursor-hearts-layer') 
              || (()=>{ const d=document.createElement('div'); d.id='cursor-hearts-layer'; d.className='cursor-hearts-layer'; document.body.appendChild(d); return d; })();

  const emojis = ['💗','💖','💕','💘','❤️','💞'];
  let last = 0;
  const limit = 48;

  function spawn(x, y){
    // batasi jumlah node
    while (layer.children.length > limit) layer.removeChild(layer.firstChild);

    const e = document.createElement('span');
    e.className = 'cursor-heart';
    e.textContent = emojis[(Math.random()*emojis.length)|0];

    // variasi ukuran/rotasi/durasi
    const scale = 0.9 + Math.random()*0.6;
    const size = 16 + Math.random()*14; // px
    const rot = (Math.random()*40 - 20) + 'deg';
    const dur = 900 + Math.random()*600 + 'ms';

    e.style.setProperty('--scale', scale.toFixed(2));
    e.style.setProperty('--size', size.toFixed(0) + 'px');
    e.style.setProperty('--rot', rot);
    e.style.setProperty('--dur', dur);

    e.style.left = x + 'px';
    e.style.top  = y + 'px';

    layer.appendChild(e);
    // bersihkan setelah animasi
    setTimeout(()=> e.remove(), parseInt(dur) + 100);
  }

  // throttle dengan rAF
  let rafId = null, lastEvt = null;
  function onMove(ev){
    lastEvt = ev;
    if (rafId) return;
    rafId = requestAnimationFrame(()=>{
      rafId = null;
      const now = performance.now();
      if (now - last < 55) return; // ~18 fps max spawn
      last = now;
      const x = lastEvt.clientX, y = lastEvt.clientY;
      spawn(x, y);
    });
  }

  window.addEventListener('mousemove', onMove, {passive:true});
})();