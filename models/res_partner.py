from odoo import api, fields, models

class ResPartner(models.Model):
    _inherit = 'res.partner'

    latitude = fields.Char('Latitude')
    longitude = fields.Char('Longitude')
