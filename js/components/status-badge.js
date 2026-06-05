// js/components/status-badge.js

Vue.component('status-badge', {
    template: '#tpl-badge',
    props: {
        qty: {
            type: Number,
            required: true
        },
        safety: {
            type: Number,
            required: true
        }
    },
    computed: {
        statusClass() {
            if (this.qty === 0) return 'badge-danger';
            if (this.qty < this.safety) return 'badge-warning';
            return 'badge-success';
        },
        statusText() {
            if (this.qty === 0) return 'Kosong ❌';
            if (this.qty < this.safety) return 'Menipis ⚠️';
            return 'Aman ✅';
        }
    }
});
