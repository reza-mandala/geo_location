/** @odoo-module **/

import { registry } from '@web/core/registry';
import { formView } from '@web/views/form/form_view';
import { FormController } from '@web/views/form/form_controller';
import { useService } from '@web/core/utils/hooks'
const { Component, onWillStart, onMounted, useRef, useState } = owl
import { loadJS, loadCSS} from '@web/core/assets'

const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';

const ARK_LAT = -6.288658887463534;
const ARK_LONG = 106.81853608465848;

class ResPartnerFormController extends FormController 
{
    setup()
    {
        super.setup()
        console.log('inherited form view...')

        this.orm = useService('orm')
        this.state = useState({
            latitude: ARK_LAT,
            longitude: ARK_LONG,
        });

        onWillStart(async () =>
        {
            console.log('onWillStart')
            
            await loadJS(LEAFLET_JS)
            await loadCSS(LEAFLET_CSS)

            console.log('leaflet JS loaded')
            // current partner id: ambil dari this.props.resId
            const data = await this.orm.read("res.partner", [this.props.resId], ["id", "name", "email", "latitude", "longitude"])
            this.state.latitude = data[0].latitude
            this.state.longitude = data[0].longitude
            console.log(this.state)
        })

        onMounted(()=>
        {
            console.log('onMounted')
            
            this._initMap()
        })
    }

    _initMap() 
    {
        console.log('_initMap')

        if (!this.map) 
        {
            this.map = L.map('id_partnermapmodal', {
                center: [this.state.latitude, this.state.longitude],
                zoom: 20,
                layers: [
                    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
                        attribution: '&copy; <a href="http://osm.org/copyright">Open Street Map</a> Contributors'
                    })
                ]
            })

            this.map.on('click', async (e) => 
            {
                try
                { 
                    console.log(`this.map.onClick() latlong:${e.latlng} latitude: ${e.latlng.lat} longitude: ${e.latlng.lng}`)
                    await this.orm.write('res.partner', [this.props.resId], 
                    {
                        latitude: e.latlng.lat,
                        longitude: e.latlng.lng
                    })

                    this.state.latitude = e.latlng.lat
                    this.state.longitude = e.latlng.lng
            
                    console.log(this.state.latitude)
                    console.log(this.state.longitude)

                    if (this.marker) 
                    {
                        this.map.removeLayer(this.marker)
                    }
                    this.marker = L.marker(e.latlng).addTo(this.map)
                    var popup = L.popup()
                    popup
                        .setLatLng(e.latlng)
                        .setContent("You clicked the map at " + e.latlng.toString())
                        .openOn(this.map)
                }
                catch (error) 
                {
                    console.error("Error:", error)
                }
            });
        }
    }
}

ResPartnerFormController.template='geo_location.ResPartnerForm'

export const resPartnerFormView = {
    ...formView,
    Controller: ResPartnerFormController,
}

registry.category('views').add('res_partner_form_view', resPartnerFormView)
