/** Loader
 * <div :class="{'vue-table-loading': this.loading , 'vue-table-loading-hidden': !this.loading}">
 * <div class="spinner"></div>
 * </div>-->
 */

/**
 * //import axios from 'axios'
 * //import qs from 'qs'
 *
 * Props:
 *
 * /**
 * If loading of table is to be done through ajax, then this object must be set
 *
 * ajax: {
  type: Object,
  required: false,
  default: function () {
    return {
      enabled: false,
      url: "",
      method: "GET",
      delegate: false,
      axiosConfig: {}
    }
  }
 },
 * State:
 *
 * // Used in relation to AJAX
 //echo: 0,
 //loading: true,
 *
 * Mounted:
 *     //this.loading = true;
 *
 *     // Work the data
 if (this.ajax.enabled) {
          if (!this.ajax.delegate) {
            // If ajax but NOT delegate
            // Perform the fetch of data now and set the raw values
            this.loading = true;
            this.fetchData(function (data) {
              self.rawValues = data.data;
            });
          } else {
            // If ajax and also delegate
            // Simply call processFilter, which will take care of the fetching
            //this.processFilter();
          }
        } else {
// Not ajax, therefore working with given elements
// Pass the Prop values to rawValues data object.
self.rawValues = self.values;
//}
 *
 *  /**
 * On created register on CellDataModified event
 *
created: function () {
  var self = this;
  this.$on('cellDataModifiedEvent', self.fireCellDataModifiedEvent);
},

/**
 * On destroy unregister the event
 *
beforeDestroy: function () {
  var self = this;
  this.$off('cellDataModifiedEvent', self.fireCellDataModifiedEvent);
},
 *
 *
 *       loading: function () {
        document.getElementById("loadingdiv").style.width = document.getElementById("maindiv").getBoundingClientRect().width + "px";
        document.getElementById("loadingdiv").style.height = document.getElementById("maindiv").getBoundingClientRect().height+"px";
      },
 *
 * Methods:
 *
 * /**
 * Used to fire off events when something happens to a cell
 *
fireCellDataModifiedEvent: function (originalValue, newValue, columnTitle, entry) {
  this.$parent.$emit('cellDataModifiedEvent', originalValue, newValue, columnTitle, entry);
},
 *
 *
 *
 * //this.loading = true;

 if (this.ajax.enabled && this.ajax.delegate) {
          this.fetchData(function (data) {
            self.filteredSize = data.filtered;
            self.filteredValues = data.data;
            self.loading = false;
          });
        } else {
        //}


 fetchData: function (dataCallBackFunction) {
        var self = this

        var ajaxParameters = {
          params: {}
        }

        this.echo++

        if (this.ajax.enabled && this.ajax.delegate) {
          var tColsDir = [];

          for (var i = 0, len = this.sortKey.length; i < len; i++) {
            tColsDir.push(this.sortOrders[this.sortKey[i]].toLowerCase())
          }

          if (this.ajax.method === "GET") {
            //COPY
            if (this.ajax !== null && this.ajax.axiosConfig !== null && this.ajax.axiosConfig !== undefined) {
              ajaxParameters = JSON.parse(
                JSON.stringify(this.ajax.axiosConfig)
              )
            }

            ajaxParameters.params = {}
            ajaxParameters.params.sortcol = this.sortKey
            ajaxParameters.params.sortdir = tColsDir
            ajaxParameters.params.filter = this.filterKey

            if (self.paginated) {
              ajaxParameters.params.page = this.page
              ajaxParameters.params.pagesize = this.definedPageSize
            } else {
              ajaxParameters.params.page = 1
              ajaxParameters.params.pagesize = null
            }

            ajaxParameters.params.echo = this.echo
          }

          if (this.ajax.method === "POST") {
            ajaxParameters.sortcol = this.sortKey
            ajaxParameters.sortdir = tColsDir
            ajaxParameters.filter = this.filterKey

            if (self.paginated) {
              ajaxParameters.page = this.page
              ajaxParameters.pagesize = this.definedPageSize
            } else {
              ajaxParameters.page = 1
              ajaxParameters.pagesize = null
            }
            ajaxParameters.echo = this.echo
          }
        }

        if (this.ajax.enabled && !this.ajax.delegate) {
          if (this.ajax.method === "GET") {
            //COPY
            if (this.ajax !== null && this.ajax.axiosConfig !== null && this.ajax.axiosConfig !== undefined) {
              ajaxParameters = JSON.parse(JSON.stringify(this.ajax.axiosConfig))
            }

            ajaxParameters.params = {}
          }

          if (this.ajax.method === "POST") {
            // Do nothing at this point !
          }
        }

        if (this.ajax.enabled && this.ajax.method === "GET") {
          axios.get(self.ajax.url, ajaxParameters)
            .then(response => {
              if (this.ajax.delegate) {
                if (response.data.echo !== self.echo) {
                  return
                }
              }
              dataCallBackFunction(response.data)
              this.$parent.$emit('ajaxLoadedEvent', response.data)
            })
            .catch(e => {
              this.$parent.$emit('ajaxLoadingError', e)
            });
        }

        if (this.ajax.enabled && this.ajax.method === "POST") {
          var tempAxiosConf = {}

          if (this.ajax !== null && this.ajax.axiosConfig !== null && this.ajax.axiosConfig !== undefined) {
            tempAxiosConf = this.ajax.axiosConfig
          }

          axios.post(self.ajax.url, qs.stringify(ajaxParameters), tempAxiosConf)
            .then(response => {
              if (this.ajax.delegate) {
                if (response.data.echo !== self.echo) {
                  return
                }
              }

              dataCallBackFunction(response.data)
              this.$parent.$emit('ajaxLoadedEvent', response.data)

            })
            .catch(e => {
              this.$parent.$emit('ajaxLoadingError', e)
            })
        }
      },
 */