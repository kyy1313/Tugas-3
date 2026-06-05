// js/components/app-modal.js

Vue.component('app-modal', {
    template: '#tpl-modal',
    data() {
        return {
            isVisible: false,
            title: '',
            message: '',
            resolvePromise: null,
            rejectPromise: null
        };
    },
    methods: {
        show(options) {
            this.title = options.title || 'Konfirmasi';
            this.message = options.message || 'Apakah Anda yakin?';
            this.isVisible = true;

            return new Promise((resolve, reject) => {
                this.resolvePromise = resolve;
                this.rejectPromise = reject;
            });
        },
        confirm() {
            this.isVisible = false;
            if (this.resolvePromise) {
                this.resolvePromise(true);
            }
        },
        cancel() {
            this.isVisible = false;
            if (this.resolvePromise) {
                this.resolvePromise(false);
            }
        }
    }
});
