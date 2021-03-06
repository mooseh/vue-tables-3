export default {
    name: 'RLNoResultsRow',
    inject: ['colspan', 'display', 'theme','componentsOverride', 'loading','loadingError','initialRequestSent', 'tabIndex', 'opts'],
    render() {
        return this.$slots.default({
            opts: this.opts(),
            colspan: this.colspan(),
            loading: this.loading(),
            loadingError: this.loadingError(),
            display: this.display,
            tabIndex: this.tabIndex(),
            class: this.getClass(),
            tdClass: this.theme.td,
            initialRequestSent: this.initialRequestSent(),
            message: this.display(this.message),
            override: this.componentsOverride.noResultsRow
        })
    },
    methods:{
        getClass() {
            if (this.loadingError()) {
                return 'VueTables__error'
            }

            if (this.loading()) {
                return 'VueTables__loading'
            }

            return 'VueTables__no-results'
        }
    },
    computed:{
        message() {
            if (this.loadingError()) {
                return 'loadingError'
            }

            if (this.loading()) {
                return 'loading'
            }

              if (!this.opts().sendInitialRequest && !this.initialRequestSent()) {
                return 'noRequest'
            }

            return 'noResults'
        }
    }
}
