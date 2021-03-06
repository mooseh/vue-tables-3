import bus from '../bus';

module.exports = function () {

    var event = 'vue-tables';
    if (this.name) event += '.' + this.name;

    this.opts.customFilters.forEach(filter => {
        bus.on(`${event}.filter::${filter.name}`, value => {
            this.setPage(1)
            this.customQueries[filter.name] = value;
            this.updateState('customQueries', this.customQueries);
        });
    });
}
