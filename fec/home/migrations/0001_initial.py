# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('wagtailcore', '0032_add_bulk_delete_page_permission'),
        ('wagtailadmin', '0001_create_admin_access_permissions'),
        ('wagtaildocs','0007_merge'),
        ('wagtailembeds','0003_capitalizeverbose'),
        ('wagtailforms','0003_capitalizeverbose'),
        ('wagtailimages','0017_reduce_focal_point_key_max_length'),
        ('wagtailredirects','0005_capitalizeverbose'),
        ('wagtailsearch','0003_remove_editors_pick'),
        ('wagtailsearchpromotions','0002_capitalizeverbose'),
        ('wagtailusers','0005_make_related_name_wagtail_specific'),
    ]

    operations = [
        migrations.CreateModel(
            name='HomePage',
            fields=[
                ('page_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to='wagtailcore.Page')),
            ],
            options={
                'abstract': False,
            },
            bases=('wagtailcore.page',),
        ),
    ]
