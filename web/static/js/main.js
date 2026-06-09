// Basic client triggers (hamburger menus, popup overlays)
// e-Thrift main.js — client-side interactions
// Navbar scroll hide/show, mobile sidebar, account dropdown, search focus

(function () {
    document.addEventListener('DOMContentLoaded', function () {

        /* ---- NAVBAR SCROLL BEHAVIOUR ---- */
        const navbar = document.getElementById('navbar');
        let lastScroll = 0;

        if (navbar) {
            window.addEventListener('scroll', function () {
                const current = window.pageYOffset;
                if (current > 100) {
                    navbar.classList.add('navbar-sticky');
                    if (current > lastScroll && current > 300) {
                        navbar.classList.add('navbar-hidden');
                    } else {
                        navbar.classList.remove('navbar-hidden');
                    }
                } else {
                    navbar.classList.remove('navbar-sticky', 'navbar-hidden');
                }
                lastScroll = current;
            });
        }

        /* ---- MOBILE SIDEBAR ---- */
        const mobileMenuBtn  = document.getElementById('mobileMenuBtn');
        const mobileSidebar  = document.getElementById('mobileSidebar');
        const mobileOverlay  = document.getElementById('mobileOverlay');
        const closeSidebarBtn = document.getElementById('closeSidebarBtn');

        function openSidebar() {
            if (!mobileSidebar) return;
            mobileSidebar.classList.add('open');
            if (mobileOverlay) mobileOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        }

        function closeSidebar() {
            if (!mobileSidebar) return;
            mobileSidebar.classList.remove('open');
            if (mobileOverlay) mobileOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }

        if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openSidebar);
        if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);
        if (mobileOverlay) mobileOverlay.addEventListener('click', closeSidebar);

        /* ---- ACCOUNT DROPDOWN ---- */
        const dropdownBtn  = document.getElementById('accountDropdown');
        const dropdownMenu = document.getElementById('accountMenu');

        if (dropdownBtn && dropdownMenu) {
            dropdownBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                dropdownMenu.classList.toggle('show');
            });

            document.addEventListener('click', function () {
                dropdownMenu.classList.remove('show');
            });

            dropdownMenu.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        }

        /* ---- SEARCH FOCUS RING ---- */
        const searchInput   = document.querySelector('.search-input');
        const searchWrapper = document.querySelector('.search-wrapper');

        if (searchInput && searchWrapper) {
            searchInput.addEventListener('focus', function () {
                searchWrapper.classList.add('focused');
            });
            searchInput.addEventListener('blur', function () {
                setTimeout(() => searchWrapper.classList.remove('focused'), 200);
            });

            // Live search results open/close
            const searchResults = document.querySelector('.search-results');
            searchInput.addEventListener('input', function () {
                if (searchResults) {
                    searchResults.classList.toggle('open', this.value.length > 1);
                }
            });
        }

        /* ---- CART COUNT SYNC ---- */
        // Called by any page that adds to cart to refresh the badge
        window.updateCartBadge = function (count) {
            document.querySelectorAll('.cart-badge').forEach(function (el) {
                el.textContent = count;
                el.style.display = count > 0 ? '' : 'none';
            });
        };

        /* ---- M-PESA STK PUSH ---- */
        window.initiateMpesaPayment = function (phoneNumber, amount, orderId) {
            const overlay = document.getElementById('loading-overlay');
            if (overlay) overlay.style.display = 'flex';

            fetch('/api/mpesa/stkpush', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone_number: phoneNumber, amount: amount, order_id: orderId })
            })
            .then(function (r) { return r.json(); })
            .then(function (data) {
                if (overlay) overlay.style.display = 'none';
                if (data.success) {
                    alert('STK Push sent! Check your phone for the M-Pesa prompt.');
                } else {
                    alert('Payment failed: ' + data.message);
                }
            })
            .catch(function (err) {
                if (overlay) overlay.style.display = 'none';
                alert('Error: ' + err);
            });
        };

    });
})();
