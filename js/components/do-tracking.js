// js/components/do-tracking.js

Vue.component('do-tracking', {
    template: '#tpl-tracking',
    props: {
        data: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            searchQuery: '',
            hasSearched: false,
            searchResult: null,
            newProgress: {}
        };
    },
    filters: {
        currency(value) {
            return 'Rp ' + Number(value).toLocaleString('id-ID');
        }
    },
    methods: {
        formatDate(dateStr) {
            if (!dateStr) return '';
            const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
            try {
                const date = new Date(dateStr);
                return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
            } catch (e) {
                return dateStr;
            }
        },
        doSearch() {
            if (!this.searchQuery.trim()) return;
            
            const query = this.searchQuery.trim().toLowerCase();
            this.searchResult = [];
            this.hasSearched = true;

            // the tracking data structure is an array of objects where key is doNumber
            // Example: [ { "DO2025-0001": { nim: ... } }, { "DO2025-0002": { ... } } ]
            
            this.data.forEach(item => {
                const keys = Object.keys(item);
                if (keys.length > 0) {
                    const doNumber = keys[0];
                    const record = item[doNumber];
                    
                    if (doNumber.toLowerCase() === query || record.nim.toLowerCase() === query) {
                        this.searchResult.push({
                            doNumber: doNumber,
                            ...record
                        });
                        // Initialize v-model for new progress
                        this.$set(this.newProgress, doNumber, '');
                    }
                }
            });
        },
        resetSearch() {
            this.searchQuery = '';
            this.searchResult = null;
            this.hasSearched = false;
        },
        addProgress(doNumber, resultIndex) {
            const keterangan = this.newProgress[doNumber];
            if (!keterangan) return;

            const now = new Date();
            // Format waktu local: YYYY-MM-DD HH:MM:SS (sederhana)
            const waktu = now.getFullYear() + '-' + 
                          String(now.getMonth()+1).padStart(2, '0') + '-' + 
                          String(now.getDate()).padStart(2, '0') + ' ' + 
                          String(now.getHours()).padStart(2, '0') + ':' + 
                          String(now.getMinutes()).padStart(2, '0') + ':' + 
                          String(now.getSeconds()).padStart(2, '0');

            const logBaru = {
                waktu: waktu,
                keterangan: keterangan
            };

            // Tambahkan ke Data Asli (karena props adalah referensi obyek, mutating ini akan berefek global ke searchResult)
            // Cari data di prop
            const targetItem = this.data.find(item => item[doNumber]);
            if (targetItem) {
                targetItem[doNumber].perjalanan.push(logBaru);
            }

            // Kosongkan input
            this.newProgress[doNumber] = '';
        }
    }
});
