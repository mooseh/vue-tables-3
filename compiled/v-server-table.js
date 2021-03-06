"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = install;

var _merge = _interopRequireDefault(require("merge"));

var _data2 = _interopRequireDefault(require("./state/data"));

var _vuex = _interopRequireDefault(require("./state/vuex"));

var _normal = _interopRequireDefault(require("./state/normal"));

var _table = _interopRequireDefault(require("./table"));

var _resizeableColumns = _interopRequireDefault(require("./helpers/resizeable-columns"));

var _VtServerTable = _interopRequireDefault(require("./components/VtServerTable"));

var _themes = _interopRequireDefault(require("./themes/themes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _data = require("./mixins/data");

var _created = require("./mixins/created");

var provide = require("./mixins/provide");

function install(app, globalOptions) {
  var theme = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "bootstrap3";
  var componentsOverride = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var themeOverride = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var useVuex = false;
  var state = useVuex ? (0, _vuex["default"])("server") : (0, _normal["default"])();

  var server = _merge["default"].recursive(true, (0, _table["default"])(), {
    name: "r-l-server-table",
    render: require('./components/renderless/RLDataTable'),
    props: {
      columns: {
        type: Array,
        required: true
      },
      url: {
        type: String
      },
      name: {
        type: String,
        required: false
      },
      options: {
        type: Object,
        required: false,
        "default": function _default() {
          return {};
        }
      }
    },
    provide: provide,
    created: function created() {
      if (!this.opts.requestFunction && !this.url) {
        throw 'vue-tables-3: you must provide either a "url" prop or a custom request function. Aborting';
      }

      _created(this);

      if (!this.vuex) {
        this.query = this.initQuery();
        this.initOrderBy();
        this.customQueries = this.initCustomFilters();
      }

      if (this.opts.sendInitialRequest) {
        this.loadState();
        this.getData(true).then(function (response) {
          if (typeof response === 'undefined') return;
          this.setData(response);
          this.loading = false;

          if (this.hasDateFilters()) {
            setTimeout(function () {
              this.initDateFilters();
            }.bind(this), 0);
          }
        }.bind(this));
      } else {
        this.loading = false;
      }
    },
    mounted: function mounted() {
      this._setFiltersDOM(this.query);

      if (this.opts.resizableColumns) {
        (0, _resizeableColumns["default"])(this.refs.table, this.hasChildRow, this.opts.childRowTogglerFirst, this.resizableColumns, this.opts.stickyHeader);
      } // this._setColumnsDropdownCloseListener();


      if (this.vuex) return;
      this.registerServerFilters();
      if (this.options.initialPage) this.setPage(this.options.initialPage, true);
    },
    data: function data() {
      var Theme = typeof theme === 'string' ? _themes["default"][theme] : theme();
      return _merge["default"].recursive(_data(), {
        source: "server",
        loading: true,
        lastKeyStrokeAt: false,
        globalOptions: globalOptions,
        componentsOverride: componentsOverride,
        theme: _merge["default"].recursive(Theme, themeOverride)
      }, (0, _data2["default"])(useVuex, "server", this.options.initialPage));
    },
    methods: {
      refresh: require("./methods/refresh"),
      getData: require("./methods/get-data"),
      setData: require("./methods/set-data"),
      serverSearch: require("./methods/server-search"),
      registerServerFilters: require("./methods/register-server-filters"),
      getRequestParams: require("./methods/get-request-params"),
      setRequestParams: require("./methods/set-request-params"),
      loadState: function loadState() {
        var _this = this;

        if (!this.opts.saveState) return;

        if (!this.storage.getItem(this.stateKey)) {
          this.initState();
          this.activeState = true;
          return;
        }

        var state = JSON.parse(this.storage.getItem(this.stateKey));

        if (this.vuex) {
          this.commit("SET_STATE", {
            query: state.query,
            customQueries: state.customQueries,
            page: state.page,
            limit: state.perPage,
            orderBy: state.orderBy
          });
        } else {
          this.page = state.page;
          this.query = state.query;
          this.customQueries = state.customQueries;
          this.limit = state.perPage;
          this.orderBy = state.orderBy;
        }

        if (!this.opts.pagination.dropdown && this.$refs.pagination) {
          setTimeout(function () {
            _this.$refs.pagination.Page = state.page;
          }, 0);
        }

        if (this.opts.filterable) {
          setTimeout(function () {
            _this._setFiltersDOM(state.query);
          }, 0);
        }

        this.activeState = true;
      }
    },
    watch: {
      url: function url() {
        this.refresh();
      }
    },
    computed: {
      totalPages: require("./computed/total-pages"),
      filteredQuery: require("./computed/filtered-query"),
      hasMultiSort: function hasMultiSort() {
        return this.opts.serverMultiSorting;
      }
    }
  }, state);

  var comp = (0, _VtServerTable["default"])(server);
  app.component("v-server-table", comp);
  return _VtServerTable["default"];
}

;