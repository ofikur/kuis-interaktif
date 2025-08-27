document.addEventListener('DOMContentLoaded', () => {
    // Mengambil elemen-elemen modal yang diperlukan dari HTML.
    const materiModal = document.getElementById('materi-modal');
    const showMateriBtn = document.getElementById('show-materi-button');
    const closeBtn = document.querySelector('.modal .close-button');
    const materiBody = document.querySelector('#materi-modal .materi-body');

    async function loadMateri() {
        // Memuat konten materi dari file materi.html secara dinamis.
        materiBody.innerHTML = '<p style="text-align: center;">Memuat materi...</p>';
        try {
            const response = await fetch('materi.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            materiBody.innerHTML = html;
        } catch (error) {
            console.error("Gagal memuat materi:", error);
            materiBody.innerHTML = '<p style="text-align: center; color: red;">Maaf, gagal memuat materi. Silakan coba lagi nanti.</p>';
        }
    }

    function openModal() {
        // Menampilkan modal materi dan memuat konten jika diperlukan.
        if (materiBody.innerHTML.trim() === '') {
            loadMateri();
        }
        materiModal.style.display = 'block';
    }

    function closeModal() {
        // Menyembunyikan modal materi.
        materiModal.style.display = 'none';
    }

    // --- Event Listeners ---
    // Menambahkan fungsi ke setiap tombol interaksi modal.
    showMateriBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target == materiModal) {
            closeModal();
        }
    });
});