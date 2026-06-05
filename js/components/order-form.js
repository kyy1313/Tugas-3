// js/components/order-form.js

Vue.component('order-form', {
    template: '#tpl-order',
    props: {
        paket: {
            type: Array,
            required: true
        },
        ekspedisi: {
            type: Array,
            required: true
        },
        upbjjList: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            generatedDoNumber: '',
            formData: {
                nim: '',
                nama: '',
                ekspedisi: '',
                tanggalKirim: '',
                paket: ''
            },
            selectedPaketObj: null
        };
    },
    filters: {
        currency(value) {
            return 'Rp ' + Number(value).toLocaleString('id-ID');
        }
    },
    computed: {
        formattedDatePreview() {
            if (!this.formData.tanggalKirim) return '-';
            const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
            try {
                const date = new Date(this.formData.tanggalKirim);
                return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
            } catch (e) {
                return '-';
            }
        }
    },
    mounted() {
        this.generateDONumber();
    },
    methods: {
        generateDONumber() {
            // Format: DO2025-001 (auto increment, fake increment based on random for simple logic or just hardcoded logic)
            // Ideally should check parent data length, but component shouldn't know parent data deeply unless passed via props.
            // Let's make a simple random sequence for demo, or a fixed one that increments locally
            if (!window._doSeq) window._doSeq = 3; // Start from 3 since json might have 1 and 2
            const seq = String(window._doSeq++).padStart(3, '0');
            const year = new Date().getFullYear();
            this.generatedDoNumber = `DO${year}-${seq}`;
        },
        updatePaketSelection() {
            if (this.selectedPaketObj) {
                this.formData.paket = this.selectedPaketObj.kode;
            }
        },
        submitForm() {
            // Validation
            if (!this.formData.nim || !this.formData.nama || !this.formData.ekspedisi || !this.formData.tanggalKirim || !this.formData.paket) {
                alert('Silakan lengkapi semua data form!');
                return;
            }

            const newDoData = {
                nim: this.formData.nim,
                nama: this.formData.nama,
                status: 'Diproses',
                ekspedisi: this.formData.ekspedisi,
                tanggalKirim: this.formData.tanggalKirim,
                paket: this.formData.paket,
                total: this.selectedPaketObj ? this.selectedPaketObj.harga : 0,
                perjalanan: [
                    {
                        waktu: new Date().toISOString().replace('T', ' ').substring(0, 19),
                        keterangan: 'Pesanan dibuat'
                    }
                ]
            };

            const payload = {};
            payload[this.generatedDoNumber] = newDoData;

            // Emit to parent
            this.$emit('created', payload);

            // Reset form
            this.resetForm();
            // Generate next DO
            this.generateDONumber();
        },
        resetForm() {
            this.formData = {
                nim: '',
                nama: '',
                ekspedisi: '',
                tanggalKirim: '',
                paket: ''
            };
            this.selectedPaketObj = null;
        }
    }
});
