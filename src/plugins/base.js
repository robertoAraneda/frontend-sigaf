import Vue from 'vue'
import Textfield from '../components/base/Textfield'
import Button from '../components/base/Btn'
import Card from '../components/base/Card'
import Autocomplete from '../components/base/Autocomplete'
import Snackbar from '../components/base/Snackbar'
import DashboardCard from '../components/base/DashboardCard'
import BaseMaterialCard from '../components/base/BaseCardDash'
import BaseCardStat from '../components/base/BaseCardStat'
import BaseSelectComponent from '../components/base/BaseSelect'
import BaseTextarea from '../components/base/Textarea'
import BaseAlert from '../components/base/BaseAlert'

Vue.component('base-textfield', Textfield)
Vue.component('base-button', Button)
Vue.component('base-card', Card)
Vue.component('base-autocomplete', Autocomplete)
Vue.component('base-snackbar', Snackbar)
Vue.component('base-dashboard-card', DashboardCard)
Vue.component('base-material-card', BaseMaterialCard)
Vue.component('base-material-stats-card', BaseCardStat)
Vue.component('base-select-component', BaseSelectComponent)
Vue.component('base-textarea', BaseTextarea)
Vue.component('base-alert', BaseAlert)
