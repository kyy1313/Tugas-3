// js/app.js

new Vue({
    el: '#app',
    data: {
        tab: 'stok', // Default tab: 'stok' | 'tracking' | 'order'
        isLoading: true,
        state: {
            upbjjList: [],
            kategoriList: [],
            pengirimanList: [],
            paket: [],
            stok: [],
            tracking: []
        }
    },
    async mounted() {
        await this.loadData();
    },
    methods: {
        async loadData() {
            this.isLoading = true;
            if (window.ApiService) {
                const data = await window.ApiService.fetchData();
                if (data) {
                    this.state.upbjjList = data.upbjjList || [];
                    this.state.kategoriList = data.kategoriList || [];
                    this.state.pengirimanList = data.pengirimanList || [];
                    this.state.paket = data.paket || [];
                    this.state.stok = data.stok || [];
                    this.state.tracking = data.tracking || [];
                }
            } else {
                console.error("ApiService not loaded");
            }
            this.isLoading = false;
        },
        
        // --- Stock Actions ---
        handleSaveStock(payload) {
            if (payload.mode === 'add') {
                // Tambah data baru
                this.state.stok.push(payload.data);
                alert("Data Bahan Ajar berhasil ditambahkan!");
            } else {
                // Edit data (cari index berdasarkan kode yang sama)
                const idx = this.state.stok.findIndex(item => item.kode === payload.data.kode);
                if (idx !== -1) {
                    // Pakai Vue.set agar reaktif
                    this.$set(this.state.stok, idx, payload.data);
                    alert("Data Bahan Ajar berhasil diperbaharui!");
                }
            }
        },
        async handleDeleteStock(item) {
            // Gunakan komponen modal konfirmasi
            const confirm = await this.$refs.modal.show({
                title: 'Hapus Data',
                message: `Apakah Anda yakin ingin menghapus <strong>${item.judul}</strong>?`
            });

            if (confirm) {
                const idx = this.state.stok.findIndex(s => s.kode === item.kode);
                if (idx !== -1) {
                    this.state.stok.splice(idx, 1);
                }
            }
        },

        // --- Tracking Actions ---
        handleNewDO(newDOData) {
            // newDOData format is { "DO2025-XXX": { ... } }
            this.state.tracking.push(newDOData);
            alert("Delivery Order baru berhasil dibuat!");
            // Auto switch tab ke tracking untuk mempermudah melihat hasil
            this.tab = 'tracking';
        }
    }
});
