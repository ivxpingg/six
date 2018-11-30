import vModalLogView from './modalLogView';

export default {
    components: {vModalLogView},
    data() {
        return {
            six_logType: ''
        }
    },
    methods: {
        modalLogView(logType) {
            this.six_logType = logType;
            this.$refs.modalLogView.modalValue = true;
        }
    }
}