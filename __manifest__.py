{
    'name': 'Geo Location',
    'version': '1.0',
    'category': 'Extra Tools',
    'summary': 'Adds a Geo Location tab with a map modal to partners',
    'sequence': 10,
    'license': 'LGPL-3',
    'author': 'Your Name/Company',
    'website': 'https://yourwebsite.com',
    'depends': ['base'],
    'data': [
        'security/ir.model.access.csv',
        'views/res_partner_views.xml',
    ],
    'demo': [],
    'installable': True,
    'application': False,
    'auto_install': False,
    'assets': {
        'web.assets_backend':[
            'geo_location/static/src/js/components/*/*.js',
            'geo_location/static/src/js/components/*/*.xml',
            'geo_location/static/src/js/components/*/*.scss',
        ]
    }
}
