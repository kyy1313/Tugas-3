// js/components/stock-table.js

Vue.component('ba-stock-table', {
    template: '#tpl-stock',
    props: {
        items: {
            type: Array,
            required: true
        },
        upbjjList: {
            type: Array,
            required: true
        },
        kategoriList: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            filterUpbjj: '',
            filterKategori: '',
            filterReorder: false,
            sortBy: '',
            
            showForm: false,
            formMode: 'add',
            formData: {
                kode: '',
                judul: '',
                kategori: '',
                upbjj: '',
                lokasiRak: '',
                harga: 0,
                qty: 0,
                safety: 0,
                catatanHTML: ''
            }
        };
    },
    filters: {
        currency(value) {
            return 'Rp ' + Number(value).toLocaleString('id-ID');
        },
        qtyFormat(value) {
            return value + ' buah';
        }
    },
    computed: {
        filteredAndSortedData() {
            let result = this.items;

            // Dependent Options: Kategori filter is only active if upbjj is selected.
            // (Based on instructions: "baru akan memunculkan filter untuk 'Kategori Mata Kuliah'")
            // This is handled in UI by v-if="filterUpbjj". We enforce it here too.
            if (!this.filterUpbjj) {
                // If upbjj is reset, reset kategori too in watcher, but to be safe:
                this.filterKategori = ''; 
            }

            if (this.filterUpbjj) {
                result = result.filter(item => item.upbjj === this.filterUpbjj);
            }

            if (this.filterKategori && this.filterUpbjj) {
                result = result.filter(item => item.kategori === this.filterKategori);
            }

            if (this.filterReorder) {
                result = result.filter(item => item.qty < item.safety || item.qty === 0);
            }

            if (this.sortBy === 'judul') {
                result = result.slice().sort((a, b) => a.judul.localeCompare(b.judul));
            } else if (this.sortBy === 'qty') {
                result = result.slice().sort((a, b) => a.qty - b.qty);
            } else if (this.sortBy === 'harga') {
                result = result.slice().sort((a, b) => a.harga - b.harga);
            }

            return result;
        }
    },
    watch: {
        // Watcher 1: Watch filterUpbjj changes to reset kategori if upbjj is deselected
        filterUpbjj(newVal) {
            if (!newVal) {
                this.filterKategori = '';
            }
        },
        // Watcher 2: Watch items to recount or do something (Optional, just to satisfy requirement)
        items: {
            handler(newVal) {
                console.log('Stock items data changed, current total: ' + newVal.length);
            },
            deep: true
        }
    },
    methods: {
        resetFilter() {
            this.filterUpbjj = '';
            this.filterKategori = '';
            this.filterReorder = false;
            this.sortBy = '';
        },
        openForm(item = null) {
            this.showForm = true;
            if (item) {
                this.formMode = 'edit';
                // Clone data so it doesn't instantly edit table before save
                this.formData = { ...item };
            } else {
                this.formMode = 'add';
                this.formData = {
                    kode: '', judul: '', kategori: '', upbjj: '',
                    lokasiRak: '', harga: 0, qty: 0, safety: 0, catatanHTML: ''
                };
            }
        },
        closeForm() {
            this.showForm = false;
        },
        saveForm() {
            // Validasi sederhana sudah tercover oleh atribut `required` di HTML form
            if (!this.formData.kode || !this.formData.judul) return;

            // Emit to parent
            this.$emit('save-item', { 
                mode: this.formMode, 
                data: { ...this.formData } 
            });
            this.closeForm();
        },
        deleteItem(item) {
            this.$emit('delete-item', item);
        }
    }
});
