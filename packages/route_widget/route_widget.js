import L from 'leaflet';
import style__leaflet from 'leaflet/dist/leaflet.css';
import { html, LitElement } from 'lit-element';
import { request_get_poi } from './api/efa_sta';
import { render_backgroundMap } from './components/backgroundMap';
import { render__details } from './components/details';
import { render__search } from './components/search';
import { observed_properties } from './observed-properties';
import style from './scss/main.scss';
import { getStyle } from './utilities';

class RoutePlanner extends LitElement {
  constructor() {
    super();
    this.render_backgroundMap = render_backgroundMap.bind(this);
    this.render_search = render__search.bind(this);
    this.render_details = render__details.bind(this);

    /**
     * Api
     */
    this.request_get_poi = request_get_poi.bind(this);

    /** Observed values */
    this.mobile_open = false;
    this.departure_time = 1;
    this.from = '';
    this.to = '';
    this.departure_time_select_visible = false;
    this.departure_time_select_timings_visible = false;
    this.departure_time_hour = '0000';
    this.details_data = undefined;
  }

  static get properties() {
    return observed_properties;
  }

  async initializeMap() {
    this.map = L.map(this.shadowRoot.getElementById('map'), { zoomControl: false }).setView([51.505, -0.09], 13);
    // .setView(
    //   [this.current_location.lat, this.current_location.lng],
    //   13
    // );
    L.tileLayer('//{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: ''
    }).addTo(this.map);
  }

  async firstUpdated() {
    this.initializeMap();
  }

  render() {
    return html`
      <style>
        ${getStyle(style__leaflet)}
        ${getStyle(style)}
        ${this.font_family ? `.routeplanner { font-family: ${this.font_family} }` : ''}
      </style>
      <div class="routeplanner-widget ${this.mobile_open ? `MODE__mobile__open` : `MODE__mobile__closed`}">
        ${this.render_backgroundMap()}
        ${!this.details_data
          ? html`
              ${this.render_search()}
            `
          : html`
              ${this.render_details()}
            `}
      </div>
    `;
  }
}

if (!window.customElements.get('routeplanner-widget')) {
  window.customElements.define('routeplanner-widget', RoutePlanner);
}
