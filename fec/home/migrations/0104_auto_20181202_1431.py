# -*- coding: utf-8 -*-
# Generated by Django 1.11.15 on 2018-12-02 19:31
from __future__ import unicode_literals

from django.db import migrations, models
import home.blocks
import wagtail.contrib.table_block.blocks
import wagtail.core.blocks
import wagtail.core.fields
import wagtail.documents.blocks
import wagtail.images.blocks
import wagtail.snippets.blocks


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0103_auto_20180726_1409'),
    ]

    operations = [
        migrations.AddField(
            model_name='author',
            name='author_group',
            field=models.CharField(blank=True, choices=[('Press Office', 'Press authors')], max_length=255),
        ),
        migrations.AlterField(
            model_name='aboutlandingpage',
            name='hero',
            field=wagtail.core.fields.StreamField([('heading', wagtail.core.blocks.CharBlock(classname='full title')), ('paragraph', wagtail.core.blocks.RichTextBlock()), ('html', wagtail.core.blocks.RawHTMLBlock()), ('image', wagtail.images.blocks.ImageChooserBlock()), ('table', wagtail.contrib.table_block.blocks.TableBlock()), ('custom_table', wagtail.core.blocks.StructBlock([('custom_table', wagtail.core.blocks.StreamBlock([('title', wagtail.core.blocks.CharBlock(required=False)), ('table_intro', wagtail.core.blocks.RichTextBlock(required=False)), ('table', wagtail.contrib.table_block.blocks.TableBlock(table_options={'colHeaders': True, 'height': 108, 'language': 'en', 'rowHeaders': True, 'startCols': 6, 'startRows': 7})), ('footnote', wagtail.core.blocks.CharBlock(required=False))]))])), ('contact', wagtail.core.blocks.StructBlock([('label', wagtail.core.blocks.CharBlock(icon='title', required=False)), ('contact_items', wagtail.core.blocks.ListBlock(wagtail.core.blocks.StructBlock([('item_label', wagtail.core.blocks.CharBlock(required=False)), ('item_icon', wagtail.core.blocks.ChoiceBlock(choices=[('email', 'Email'), ('fax', 'Fax'), ('hand', 'Hand delivery'), ('phone', 'Phone'), ('mail', 'Mail'), ('github', 'Github'), ('question-bubble', 'Question')])), ('item_info', wagtail.core.blocks.RichTextBlock(required=True))])))]))], blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='collectionpage',
            name='body',
            field=wagtail.core.fields.StreamField([('heading', wagtail.core.blocks.CharBlock(classname='full title')), ('paragraph', wagtail.core.blocks.RichTextBlock()), ('html', wagtail.core.blocks.RawHTMLBlock()), ('image', wagtail.images.blocks.ImageChooserBlock()), ('table', wagtail.contrib.table_block.blocks.TableBlock()), ('custom_table', wagtail.core.blocks.StructBlock([('custom_table', wagtail.core.blocks.StreamBlock([('title', wagtail.core.blocks.CharBlock(required=False)), ('table_intro', wagtail.core.blocks.RichTextBlock(required=False)), ('table', wagtail.contrib.table_block.blocks.TableBlock(table_options={'colHeaders': True, 'height': 108, 'language': 'en', 'rowHeaders': True, 'startCols': 6, 'startRows': 7})), ('footnote', wagtail.core.blocks.CharBlock(required=False))]))])), ('contact', wagtail.core.blocks.StructBlock([('label', wagtail.core.blocks.CharBlock(icon='title', required=False)), ('contact_items', wagtail.core.blocks.ListBlock(wagtail.core.blocks.StructBlock([('item_label', wagtail.core.blocks.CharBlock(required=False)), ('item_icon', wagtail.core.blocks.ChoiceBlock(choices=[('email', 'Email'), ('fax', 'Fax'), ('hand', 'Hand delivery'), ('phone', 'Phone'), ('mail', 'Mail'), ('github', 'Github'), ('question-bubble', 'Question')])), ('item_info', wagtail.core.blocks.RichTextBlock(required=True))])))]))], blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='custompage',
            name='body',
            field=wagtail.core.fields.StreamField([('heading', wagtail.core.blocks.CharBlock(classname='full title')), ('paragraph', wagtail.core.blocks.RichTextBlock()), ('html', wagtail.core.blocks.RawHTMLBlock()), ('example_image', wagtail.core.blocks.StructBlock([('title', wagtail.core.blocks.CharBlock(required=False)), ('caption', wagtail.core.blocks.RichTextBlock(required=True)), ('image', wagtail.images.blocks.ImageChooserBlock(required=True))])), ('image', wagtail.images.blocks.ImageChooserBlock()), ('table', wagtail.contrib.table_block.blocks.TableBlock()), ('example_paragraph', wagtail.core.blocks.StructBlock([('title', wagtail.core.blocks.CharBlock(required=True)), ('paragraph', wagtail.core.blocks.RichTextBlock(required=True))])), ('example_forms', wagtail.core.blocks.StructBlock([('title', wagtail.core.blocks.CharBlock(required=True)), ('forms', wagtail.core.blocks.ListBlock(wagtail.core.blocks.StructBlock([('image', wagtail.images.blocks.ImageChooserBlock(required=False)), ('url', wagtail.core.blocks.URLBlock()), ('media_type', wagtail.core.blocks.CharBlock()), ('text', wagtail.core.blocks.CharBlock())])))])), ('reporting_example_cards', wagtail.core.blocks.StructBlock([('card_width', wagtail.core.blocks.ChoiceBlock(choices=[(2, '1/2'), (3, '1/3')], help_text='Control the width of the cards')), ('cards', wagtail.core.blocks.ListBlock(wagtail.core.blocks.PageChooserBlock(), icon='doc-empty'))])), ('contact_info', wagtail.core.blocks.StructBlock([('label', wagtail.core.blocks.CharBlock(icon='title', required=False)), ('contact_items', wagtail.core.blocks.ListBlock(wagtail.core.blocks.StructBlock([('item_label', wagtail.core.blocks.CharBlock(required=False)), ('item_icon', wagtail.core.blocks.ChoiceBlock(choices=[('email', 'Email'), ('fax', 'Fax'), ('hand', 'Hand delivery'), ('phone', 'Phone'), ('mail', 'Mail'), ('github', 'Github'), ('question-bubble', 'Question')])), ('item_info', wagtail.core.blocks.RichTextBlock(required=True))])))])), ('internal_button', wagtail.core.blocks.StructBlock([('internal_page', wagtail.core.blocks.PageChooserBlock()), ('text', wagtail.core.blocks.CharBlock())])), ('external_button', wagtail.core.blocks.StructBlock([('url', wagtail.core.blocks.URLBlock()), ('text', wagtail.core.blocks.CharBlock())])), ('contribution_limits_table', wagtail.snippets.blocks.SnippetChooserBlock('home.EmbedTableSnippet', icon='table', template='blocks/embed-table.html'))], null=True),
        ),
        migrations.AlterField(
            model_name='custompage',
            name='sidebar',
            field=wagtail.core.fields.StreamField([('heading', wagtail.core.blocks.CharBlock(classname='full title')), ('paragraph', wagtail.core.blocks.RichTextBlock()), ('html', wagtail.core.blocks.RawHTMLBlock()), ('image', wagtail.images.blocks.ImageChooserBlock()), ('table', wagtail.contrib.table_block.blocks.TableBlock()), ('custom_table', wagtail.core.blocks.StructBlock([('custom_table', wagtail.core.blocks.StreamBlock([('title', wagtail.core.blocks.CharBlock(required=False)), ('table_intro', wagtail.core.blocks.RichTextBlock(required=False)), ('table', wagtail.contrib.table_block.blocks.TableBlock(table_options={'colHeaders': True, 'height': 108, 'language': 'en', 'rowHeaders': True, 'startCols': 6, 'startRows': 7})), ('footnote', wagtail.core.blocks.CharBlock(required=False))]))])), ('contact', wagtail.core.blocks.StructBlock([('label', wagtail.core.blocks.CharBlock(icon='title', required=False)), ('contact_items', wagtail.core.blocks.ListBlock(wagtail.core.blocks.StructBlock([('item_label', wagtail.core.blocks.CharBlock(required=False)), ('item_icon', wagtail.core.blocks.ChoiceBlock(choices=[('email', 'Email'), ('fax', 'Fax'), ('hand', 'Hand delivery'), ('phone', 'Phone'), ('mail', 'Mail'), ('github', 'Github'), ('question-bubble', 'Question')])), ('item_info', wagtail.core.blocks.RichTextBlock(required=True))])))]))], blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='digestpage',
            name='body',
            field=wagtail.core.fields.StreamField([('heading', wagtail.core.blocks.CharBlock(classname='full title')), ('paragraph', wagtail.core.blocks.RichTextBlock()), ('html', wagtail.core.blocks.RawHTMLBlock()), ('image', wagtail.images.blocks.ImageChooserBlock()), ('table', wagtail.contrib.table_block.blocks.TableBlock()), ('custom_table', wagtail.core.blocks.StructBlock([('custom_table', wagtail.core.blocks.StreamBlock([('title', wagtail.core.blocks.CharBlock(required=False)), ('table_intro', wagtail.core.blocks.RichTextBlock(required=False)), ('table', wagtail.contrib.table_block.blocks.TableBlock(table_options={'colHeaders': True, 'height': 108, 'language': 'en', 'rowHeaders': True, 'startCols': 6, 'startRows': 7})), ('footnote', wagtail.core.blocks.CharBlock(required=False))]))])), ('contact', wagtail.core.blocks.StructBlock([('label', wagtail.core.blocks.CharBlock(icon='title', required=False)), ('contact_items', wagtail.core.blocks.ListBlock(wagtail.core.blocks.StructBlock([('item_label', wagtail.core.blocks.CharBlock(required=False)), ('item_icon', wagtail.core.blocks.ChoiceBlock(choices=[('email', 'Email'), ('fax', 'Fax'), ('hand', 'Hand delivery'), ('phone', 'Phone'), ('mail', 'Mail'), ('github', 'Github'), ('question-bubble', 'Question')])), ('item_info', wagtail.core.blocks.RichTextBlock(required=True))])))]))], blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='documentfeedpage',
            name='body',
            field=wagtail.core.fields.StreamField([('heading', wagtail.core.blocks.CharBlock(classname='full title')), ('paragraph', wagtail.core.blocks.RichTextBlock()), ('html', wagtail.core.blocks.RawHTMLBlock()), ('image', wagtail.images.blocks.ImageChooserBlock()), ('table', wagtail.contrib.table_block.blocks.TableBlock()), ('custom_table', wagtail.core.blocks.StructBlock([('custom_table', wagtail.core.blocks.StreamBlock([('title', wagtail.core.blocks.CharBlock(required=False)), ('table_intro', wagtail.core.blocks.RichTextBlock(required=False)), ('table', wagtail.contrib.table_block.blocks.TableBlock(table_options={'colHeaders': True, 'height': 108, 'language': 'en', 'rowHeaders': True, 'startCols': 6, 'startRows': 7})), ('footnote', wagtail.core.blocks.CharBlock(required=False))]))])), ('contact', wagtail.core.blocks.StructBlock([('label', wagtail.core.blocks.CharBlock(icon='title', required=False)), ('contact_items', wagtail.core.blocks.ListBlock(wagtail.core.blocks.StructBlock([('item_label', wagtail.core.blocks.CharBlock(required=False)), ('item_icon', wagtail.core.blocks.ChoiceBlock(choices=[('email', 'Email'), ('fax', 'Fax'), ('hand', 'Hand delivery'), ('phone', 'Phone'), ('mail', 'Mail'), ('github', 'Github'), ('question-bubble', 'Question')])), ('item_info', wagtail.core.blocks.RichTextBlock(required=True))])))]))], blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='documentpage',
            name='body',
            field=wagtail.core.fields.StreamField([('heading', wagtail.core.blocks.CharBlock(classname='full title')), ('paragraph', wagtail.core.blocks.RichTextBlock()), ('html', wagtail.core.blocks.RawHTMLBlock()), ('image', wagtail.images.blocks.ImageChooserBlock()), ('table', wagtail.contrib.table_block.blocks.TableBlock()), ('custom_table', wagtail.core.blocks.StructBlock([('custom_table', wagtail.core.blocks.StreamBlock([('title', wagtail.core.blocks.CharBlock(required=False)), ('table_intro', wagtail.core.blocks.RichTextBlock(required=False)), ('table', wagtail.contrib.table_block.blocks.TableBlock(table_options={'colHeaders': True, 'height': 108, 'language': 'en', 'rowHeaders': True, 'startCols': 6, 'startRows': 7})), ('footnote', wagtail.core.blocks.CharBlock(required=False))]))])), ('contact', wagtail.core.blocks.StructBlock([('label', wagtail.core.blocks.CharBlock(icon='title', required=False)), ('contact_items', wagtail.core.blocks.ListBlock(wagtail.core.blocks.StructBlock([('item_label', wagtail.core.blocks.CharBlock(required=False)), ('item_icon', wagtail.core.blocks.ChoiceBlock(choices=[('email', 'Email'), ('fax', 'Fax'), ('hand', 'Hand delivery'), ('phone', 'Phone'), ('mail', 'Mail'), ('github', 'Github'), ('question-bubble', 'Question')])), ('item_info', wagtail.core.blocks.RichTextBlock(required=True))])))]))], blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='homepage',
            name='body',
            field=wagtail.core.fields.StreamField([('heading', wagtail.core.blocks.CharBlock(classname='full title')), ('paragraph', wagtail.core.blocks.RichTextBlock()), ('html', wagtail.core.blocks.RawHTMLBlock()), ('image', wagtail.images.blocks.ImageChooserBlock()), ('table', wagtail.contrib.table_block.blocks.TableBlock()), ('custom_table', wagtail.core.blocks.StructBlock([('custom_table', wagtail.core.blocks.StreamBlock([('title', wagtail.core.blocks.CharBlock(required=False)), ('table_intro', wagtail.core.blocks.RichTextBlock(required=False)), ('table', wagtail.contrib.table_block.blocks.TableBlock(table_options={'colHeaders': True, 'height': 108, 'language': 'en', 'rowHeaders': True, 'startCols': 6, 'startRows': 7})), ('footnote', wagtail.core.blocks.CharBlock(required=False))]))])), ('contact', wagtail.core.blocks.StructBlock([('label', wagtail.core.blocks.CharBlock(icon='title', required=False)), ('contact_items', wagtail.core.blocks.ListBlock(wagtail.core.blocks.StructBlock([('item_label', wagtail.core.blocks.CharBlock(required=False)), ('item_icon', wagtail.core.blocks.ChoiceBlock(choices=[('email', 'Email'), ('fax', 'Fax'), ('hand', 'Hand delivery'), ('phone', 'Phone'), ('mail', 'Mail'), ('github', 'Github'), ('question-bubble', 'Question')])), ('item_info', wagtail.core.blocks.RichTextBlock(required=True))])))]))], blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='legalresourceslandingpage',
            name='body',
            field=wagtail.core.fields.StreamField([('heading', wagtail.core.blocks.CharBlock(classname='full title')), ('paragraph', wagtail.core.blocks.RichTextBlock()), ('html', wagtail.core.blocks.RawHTMLBlock()), ('image', wagtail.images.blocks.ImageChooserBlock()), ('table', wagtail.contrib.table_block.blocks.TableBlock()), ('custom_table', wagtail.core.blocks.StructBlock([('custom_table', wagtail.core.blocks.StreamBlock([('title', wagtail.core.blocks.CharBlock(required=False)), ('table_intro', wagtail.core.blocks.RichTextBlock(required=False)), ('table', wagtail.contrib.table_block.blocks.TableBlock(table_options={'colHeaders': True, 'height': 108, 'language': 'en', 'rowHeaders': True, 'startCols': 6, 'startRows': 7})), ('footnote', wagtail.core.blocks.CharBlock(required=False))]))])), ('contact', wagtail.core.blocks.StructBlock([('label', wagtail.core.blocks.CharBlock(icon='title', required=False)), ('contact_items', wagtail.core.blocks.ListBlock(wagtail.core.blocks.StructBlock([('item_label', wagtail.core.blocks.CharBlock(required=False)), ('item_icon', wagtail.core.blocks.ChoiceBlock(choices=[('email', 'Email'), ('fax', 'Fax'), ('hand', 'Hand delivery'), ('phone', 'Phone'), ('mail', 'Mail'), ('github', 'Github'), ('question-bubble', 'Question')])), ('item_info', wagtail.core.blocks.RichTextBlock(required=True))])))]))], blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='meetingpage',
            name='agenda',
            field=wagtail.core.fields.StreamField([('agenda_item', wagtail.core.blocks.StructBlock([('item_title', wagtail.core.blocks.TextBlock(required=True)), ('item_text', wagtail.core.blocks.RichTextBlock(required=False)), ('item_audio', wagtail.documents.blocks.DocumentChooserBlock(required=False)), ('item_video', wagtail.core.blocks.URLBlock(help_text='Add a Youtube URL to a specific                time in a video for this agenda item', required=False))]))], blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='presslandingpage',
            name='contact_intro',
            field=wagtail.core.fields.StreamField([('heading', wagtail.core.blocks.CharBlock(classname='full title')), ('paragraph', wagtail.core.blocks.RichTextBlock()), ('html', wagtail.core.blocks.RawHTMLBlock()), ('image', wagtail.images.blocks.ImageChooserBlock()), ('table', wagtail.contrib.table_block.blocks.TableBlock()), ('custom_table', wagtail.core.blocks.StructBlock([('custom_table', wagtail.core.blocks.StreamBlock([('title', wagtail.core.blocks.CharBlock(required=False)), ('table_intro', wagtail.core.blocks.RichTextBlock(required=False)), ('table', wagtail.contrib.table_block.blocks.TableBlock(table_options={'colHeaders': True, 'height': 108, 'language': 'en', 'rowHeaders': True, 'startCols': 6, 'startRows': 7})), ('footnote', wagtail.core.blocks.CharBlock(required=False))]))])), ('contact', wagtail.core.blocks.StructBlock([('label', wagtail.core.blocks.CharBlock(icon='title', required=False)), ('contact_items', wagtail.core.blocks.ListBlock(wagtail.core.blocks.StructBlock([('item_label', wagtail.core.blocks.CharBlock(required=False)), ('item_icon', wagtail.core.blocks.ChoiceBlock(choices=[('email', 'Email'), ('fax', 'Fax'), ('hand', 'Hand delivery'), ('phone', 'Phone'), ('mail', 'Mail'), ('github', 'Github'), ('question-bubble', 'Question')])), ('item_info', wagtail.core.blocks.RichTextBlock(required=True))])))]))], blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='presslandingpage',
            name='digest_intro',
            field=wagtail.core.fields.StreamField([('heading', wagtail.core.blocks.CharBlock(classname='full title')), ('paragraph', wagtail.core.blocks.RichTextBlock()), ('html', wagtail.core.blocks.RawHTMLBlock()), ('image', wagtail.images.blocks.ImageChooserBlock()), ('table', wagtail.contrib.table_block.blocks.TableBlock()), ('custom_table', wagtail.core.blocks.StructBlock([('custom_table', wagtail.core.blocks.StreamBlock([('title', wagtail.core.blocks.CharBlock(required=False)), ('table_intro', wagtail.core.blocks.RichTextBlock(required=False)), ('table', wagtail.contrib.table_block.blocks.TableBlock(table_options={'colHeaders': True, 'height': 108, 'language': 'en', 'rowHeaders': True, 'startCols': 6, 'startRows': 7})), ('footnote', wagtail.core.blocks.CharBlock(required=False))]))])), ('contact', wagtail.core.blocks.StructBlock([('label', wagtail.core.blocks.CharBlock(icon='title', required=False)), ('contact_items', wagtail.core.blocks.ListBlock(wagtail.core.blocks.StructBlock([('item_label', wagtail.core.blocks.CharBlock(required=False)), ('item_icon', wagtail.core.blocks.ChoiceBlock(choices=[('email', 'Email'), ('fax', 'Fax'), ('hand', 'Hand delivery'), ('phone', 'Phone'), ('mail', 'Mail'), ('github', 'Github'), ('question-bubble', 'Question')])), ('item_info', wagtail.core.blocks.RichTextBlock(required=True))])))]))], blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='presslandingpage',
            name='hero',
            field=wagtail.core.fields.StreamField([('heading', wagtail.core.blocks.CharBlock(classname='full title')), ('paragraph', wagtail.core.blocks.RichTextBlock()), ('html', wagtail.core.blocks.RawHTMLBlock()), ('image', wagtail.images.blocks.ImageChooserBlock()), ('table', wagtail.contrib.table_block.blocks.TableBlock()), ('custom_table', wagtail.core.blocks.StructBlock([('custom_table', wagtail.core.blocks.StreamBlock([('title', wagtail.core.blocks.CharBlock(required=False)), ('table_intro', wagtail.core.blocks.RichTextBlock(required=False)), ('table', wagtail.contrib.table_block.blocks.TableBlock(table_options={'colHeaders': True, 'height': 108, 'language': 'en', 'rowHeaders': True, 'startCols': 6, 'startRows': 7})), ('footnote', wagtail.core.blocks.CharBlock(required=False))]))])), ('contact', wagtail.core.blocks.StructBlock([('label', wagtail.core.blocks.CharBlock(icon='title', required=False)), ('contact_items', wagtail.core.blocks.ListBlock(wagtail.core.blocks.StructBlock([('item_label', wagtail.core.blocks.CharBlock(required=False)), ('item_icon', wagtail.core.blocks.ChoiceBlock(choices=[('email', 'Email'), ('fax', 'Fax'), ('hand', 'Hand delivery'), ('phone', 'Phone'), ('mail', 'Mail'), ('github', 'Github'), ('question-bubble', 'Question')])), ('item_info', wagtail.core.blocks.RichTextBlock(required=True))])))]))], blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='presslandingpage',
            name='release_intro',
            field=wagtail.core.fields.StreamField([('heading', wagtail.core.blocks.CharBlock(classname='full title')), ('paragraph', wagtail.core.blocks.RichTextBlock()), ('html', wagtail.core.blocks.RawHTMLBlock()), ('image', wagtail.images.blocks.ImageChooserBlock()), ('table', wagtail.contrib.table_block.blocks.TableBlock()), ('custom_table', wagtail.core.blocks.StructBlock([('custom_table', wagtail.core.blocks.StreamBlock([('title', wagtail.core.blocks.CharBlock(required=False)), ('table_intro', wagtail.core.blocks.RichTextBlock(required=False)), ('table', wagtail.contrib.table_block.blocks.TableBlock(table_options={'colHeaders': True, 'height': 108, 'language': 'en', 'rowHeaders': True, 'startCols': 6, 'startRows': 7})), ('footnote', wagtail.core.blocks.CharBlock(required=False))]))])), ('contact', wagtail.core.blocks.StructBlock([('label', wagtail.core.blocks.CharBlock(icon='title', required=False)), ('contact_items', wagtail.core.blocks.ListBlock(wagtail.core.blocks.StructBlock([('item_label', wagtail.core.blocks.CharBlock(required=False)), ('item_icon', wagtail.core.blocks.ChoiceBlock(choices=[('email', 'Email'), ('fax', 'Fax'), ('hand', 'Hand delivery'), ('phone', 'Phone'), ('mail', 'Mail'), ('github', 'Github'), ('question-bubble', 'Question')])), ('item_info', wagtail.core.blocks.RichTextBlock(required=True))])))]))], blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='pressreleasepage',
            name='body',
            field=wagtail.core.fields.StreamField([('heading', wagtail.core.blocks.CharBlock(classname='full title')), ('paragraph', wagtail.core.blocks.RichTextBlock()), ('html', wagtail.core.blocks.RawHTMLBlock()), ('image', wagtail.images.blocks.ImageChooserBlock()), ('table', wagtail.contrib.table_block.blocks.TableBlock()), ('custom_table', wagtail.core.blocks.StructBlock([('custom_table', wagtail.core.blocks.StreamBlock([('title', wagtail.core.blocks.CharBlock(required=False)), ('table_intro', wagtail.core.blocks.RichTextBlock(required=False)), ('table', wagtail.contrib.table_block.blocks.TableBlock(table_options={'colHeaders': True, 'height': 108, 'language': 'en', 'rowHeaders': True, 'startCols': 6, 'startRows': 7})), ('footnote', wagtail.core.blocks.CharBlock(required=False))]))])), ('contact', wagtail.core.blocks.StructBlock([('label', wagtail.core.blocks.CharBlock(icon='title', required=False)), ('contact_items', wagtail.core.blocks.ListBlock(wagtail.core.blocks.StructBlock([('item_label', wagtail.core.blocks.CharBlock(required=False)), ('item_icon', wagtail.core.blocks.ChoiceBlock(choices=[('email', 'Email'), ('fax', 'Fax'), ('hand', 'Hand delivery'), ('phone', 'Phone'), ('mail', 'Mail'), ('github', 'Github'), ('question-bubble', 'Question')])), ('item_info', wagtail.core.blocks.RichTextBlock(required=True))])))]))], blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='recordpage',
            name='body',
            field=wagtail.core.fields.StreamField([('heading', wagtail.core.blocks.CharBlock(classname='full title')), ('paragraph', wagtail.core.blocks.RichTextBlock()), ('html', wagtail.core.blocks.RawHTMLBlock()), ('image', wagtail.images.blocks.ImageChooserBlock()), ('table', wagtail.contrib.table_block.blocks.TableBlock()), ('custom_table', wagtail.core.blocks.StructBlock([('custom_table', wagtail.core.blocks.StreamBlock([('title', wagtail.core.blocks.CharBlock(required=False)), ('table_intro', wagtail.core.blocks.RichTextBlock(required=False)), ('table', wagtail.contrib.table_block.blocks.TableBlock(table_options={'colHeaders': True, 'height': 108, 'language': 'en', 'rowHeaders': True, 'startCols': 6, 'startRows': 7})), ('footnote', wagtail.core.blocks.CharBlock(required=False))]))])), ('contact', wagtail.core.blocks.StructBlock([('label', wagtail.core.blocks.CharBlock(icon='title', required=False)), ('contact_items', wagtail.core.blocks.ListBlock(wagtail.core.blocks.StructBlock([('item_label', wagtail.core.blocks.CharBlock(required=False)), ('item_icon', wagtail.core.blocks.ChoiceBlock(choices=[('email', 'Email'), ('fax', 'Fax'), ('hand', 'Hand delivery'), ('phone', 'Phone'), ('mail', 'Mail'), ('github', 'Github'), ('question-bubble', 'Question')])), ('item_info', wagtail.core.blocks.RichTextBlock(required=True))])))]))], blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='reportingexamplepage',
            name='related_media',
            field=wagtail.core.fields.StreamField([('continue_learning', wagtail.core.blocks.ListBlock(wagtail.core.blocks.StructBlock([('image', wagtail.images.blocks.ImageChooserBlock(required=False)), ('url', wagtail.core.blocks.URLBlock()), ('media_type', wagtail.core.blocks.CharBlock()), ('text', wagtail.core.blocks.CharBlock())]), icon='doc-empty', template='blocks/related-media.html'))], blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='reportslandingpage',
            name='body',
            field=wagtail.core.fields.StreamField([('heading', wagtail.core.blocks.CharBlock(classname='full title')), ('paragraph', wagtail.core.blocks.RichTextBlock()), ('html', wagtail.core.blocks.RawHTMLBlock()), ('image', wagtail.images.blocks.ImageChooserBlock()), ('table', wagtail.contrib.table_block.blocks.TableBlock()), ('custom_table', wagtail.core.blocks.StructBlock([('custom_table', wagtail.core.blocks.StreamBlock([('title', wagtail.core.blocks.CharBlock(required=False)), ('table_intro', wagtail.core.blocks.RichTextBlock(required=False)), ('table', wagtail.contrib.table_block.blocks.TableBlock(table_options={'colHeaders': True, 'height': 108, 'language': 'en', 'rowHeaders': True, 'startCols': 6, 'startRows': 7})), ('footnote', wagtail.core.blocks.CharBlock(required=False))]))])), ('contact', wagtail.core.blocks.StructBlock([('label', wagtail.core.blocks.CharBlock(icon='title', required=False)), ('contact_items', wagtail.core.blocks.ListBlock(wagtail.core.blocks.StructBlock([('item_label', wagtail.core.blocks.CharBlock(required=False)), ('item_icon', wagtail.core.blocks.ChoiceBlock(choices=[('email', 'Email'), ('fax', 'Fax'), ('hand', 'Hand delivery'), ('phone', 'Phone'), ('mail', 'Mail'), ('github', 'Github'), ('question-bubble', 'Question')])), ('item_info', wagtail.core.blocks.RichTextBlock(required=True))])))]))], blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='resourcepage',
            name='sections',
            field=wagtail.core.fields.StreamField([('sections', wagtail.core.blocks.StructBlock([('title', wagtail.core.blocks.CharBlock(required=True)), ('hide_title', wagtail.core.blocks.BooleanBlock(help_text='Should the section title be displayed?', required=False)), ('content', wagtail.core.blocks.StreamBlock([('text', wagtail.core.blocks.RichTextBlock(blank=False, icon='pilcrow', null=False, required=False)), ('documents', wagtail.core.blocks.ListBlock(wagtail.core.blocks.StructBlock([('image', wagtail.images.blocks.ImageChooserBlock(required=False)), ('url', wagtail.core.blocks.URLBlock()), ('media_type', wagtail.core.blocks.CharBlock()), ('text', wagtail.core.blocks.CharBlock())]), icon='doc-empty', template='blocks/section-documents.html')), ('contact_info', wagtail.core.blocks.StructBlock([('label', wagtail.core.blocks.CharBlock(icon='title', required=False)), ('contact_items', wagtail.core.blocks.ListBlock(wagtail.core.blocks.StructBlock([('item_label', wagtail.core.blocks.CharBlock(required=False)), ('item_icon', wagtail.core.blocks.ChoiceBlock(choices=[('email', 'Email'), ('fax', 'Fax'), ('hand', 'Hand delivery'), ('phone', 'Phone'), ('mail', 'Mail'), ('github', 'Github'), ('question-bubble', 'Question')])), ('item_info', wagtail.core.blocks.RichTextBlock(required=True))])))])), ('internal_button', wagtail.core.blocks.StructBlock([('internal_page', wagtail.core.blocks.PageChooserBlock()), ('text', wagtail.core.blocks.CharBlock())])), ('external_button', wagtail.core.blocks.StructBlock([('url', wagtail.core.blocks.URLBlock()), ('text', wagtail.core.blocks.CharBlock())])), ('page', wagtail.core.blocks.PageChooserBlock(template='blocks/page-links.html')), ('disabled_page', wagtail.core.blocks.CharBlock(blank=False, help_text='Name of a disabled link', icon='placeholder', null=False, required=False, template='blocks/disabled-page-links.html')), ('document_list', wagtail.core.blocks.ListBlock(wagtail.core.blocks.StructBlock([('title', wagtail.core.blocks.CharBlock()), ('document', wagtail.documents.blocks.DocumentChooserBlock())]), icon='doc-empty', template='blocks/document-list.html')), ('current_commissioners', home.blocks.CurrentCommissionersBlock()), ('fec_jobs', home.blocks.CareersBlock()), ('mur_search', home.blocks.MURSearchBlock()), ('audit_search', home.blocks.AuditSearchBlock()), ('table', wagtail.contrib.table_block.blocks.TableBlock()), ('custom_table', wagtail.core.blocks.StructBlock([('custom_table', wagtail.core.blocks.StreamBlock([('title', wagtail.core.blocks.CharBlock(required=False)), ('table_intro', wagtail.core.blocks.RichTextBlock(required=False)), ('table', wagtail.contrib.table_block.blocks.TableBlock(table_options={'colHeaders': True, 'height': 108, 'language': 'en', 'rowHeaders': True, 'startCols': 6, 'startRows': 7})), ('footnote', wagtail.core.blocks.CharBlock(required=False))]))])), ('html', wagtail.core.blocks.RawHTMLBlock()), ('reporting_example_cards', wagtail.core.blocks.StructBlock([('card_width', wagtail.core.blocks.ChoiceBlock(choices=[(2, '1/2'), (3, '1/3')], help_text='Control the width of the cards')), ('cards', wagtail.core.blocks.ListBlock(wagtail.core.blocks.PageChooserBlock(), icon='doc-empty'))])), ('contribution_limits_table', wagtail.snippets.blocks.SnippetChooserBlock('home.EmbedTableSnippet', icon='table', template='blocks/embed-table.html')), ('image', wagtail.images.blocks.ImageChooserBlock()), ('example_image', wagtail.core.blocks.StructBlock([('title', wagtail.core.blocks.CharBlock(required=False)), ('caption', wagtail.core.blocks.RichTextBlock(required=True)), ('image', wagtail.images.blocks.ImageChooserBlock(required=True))]))])), ('aside', wagtail.core.blocks.StreamBlock([('title', wagtail.core.blocks.CharBlock(icon='title', required=False)), ('document', wagtail.core.blocks.StructBlock([('image', wagtail.images.blocks.ImageChooserBlock(required=False)), ('url', wagtail.core.blocks.URLBlock()), ('media_type', wagtail.core.blocks.CharBlock()), ('text', wagtail.core.blocks.CharBlock())])), ('link', wagtail.core.blocks.StructBlock([('link_type', wagtail.core.blocks.ChoiceBlock(choices=[('calculator', 'Calculator'), ('calendar', 'Calendar'), ('record', 'Record'), ('search', 'Search')], help_text='Set an icon', icon='link', required=False)), ('url', wagtail.core.blocks.URLBlock()), ('text', wagtail.core.blocks.CharBlock(required=True)), ('coming_soon', wagtail.core.blocks.BooleanBlock(required=False))]))], icon='placeholder', required=False, template='blocks/section-aside.html'))]))], blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='serviceslandingpage',
            name='body',
            field=wagtail.core.fields.StreamField([('heading', wagtail.core.blocks.CharBlock(classname='full title')), ('paragraph', wagtail.core.blocks.RichTextBlock()), ('html', wagtail.core.blocks.RawHTMLBlock()), ('image', wagtail.images.blocks.ImageChooserBlock()), ('table', wagtail.contrib.table_block.blocks.TableBlock()), ('custom_table', wagtail.core.blocks.StructBlock([('custom_table', wagtail.core.blocks.StreamBlock([('title', wagtail.core.blocks.CharBlock(required=False)), ('table_intro', wagtail.core.blocks.RichTextBlock(required=False)), ('table', wagtail.contrib.table_block.blocks.TableBlock(table_options={'colHeaders': True, 'height': 108, 'language': 'en', 'rowHeaders': True, 'startCols': 6, 'startRows': 7})), ('footnote', wagtail.core.blocks.CharBlock(required=False))]))])), ('contact', wagtail.core.blocks.StructBlock([('label', wagtail.core.blocks.CharBlock(icon='title', required=False)), ('contact_items', wagtail.core.blocks.ListBlock(wagtail.core.blocks.StructBlock([('item_label', wagtail.core.blocks.CharBlock(required=False)), ('item_icon', wagtail.core.blocks.ChoiceBlock(choices=[('email', 'Email'), ('fax', 'Fax'), ('hand', 'Hand delivery'), ('phone', 'Phone'), ('mail', 'Mail'), ('github', 'Github'), ('question-bubble', 'Question')])), ('item_info', wagtail.core.blocks.RichTextBlock(required=True))])))]))], blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='serviceslandingpage',
            name='hero',
            field=wagtail.core.fields.StreamField([('heading', wagtail.core.blocks.CharBlock(classname='full title')), ('paragraph', wagtail.core.blocks.RichTextBlock()), ('html', wagtail.core.blocks.RawHTMLBlock()), ('image', wagtail.images.blocks.ImageChooserBlock()), ('table', wagtail.contrib.table_block.blocks.TableBlock()), ('custom_table', wagtail.core.blocks.StructBlock([('custom_table', wagtail.core.blocks.StreamBlock([('title', wagtail.core.blocks.CharBlock(required=False)), ('table_intro', wagtail.core.blocks.RichTextBlock(required=False)), ('table', wagtail.contrib.table_block.blocks.TableBlock(table_options={'colHeaders': True, 'height': 108, 'language': 'en', 'rowHeaders': True, 'startCols': 6, 'startRows': 7})), ('footnote', wagtail.core.blocks.CharBlock(required=False))]))])), ('contact', wagtail.core.blocks.StructBlock([('label', wagtail.core.blocks.CharBlock(icon='title', required=False)), ('contact_items', wagtail.core.blocks.ListBlock(wagtail.core.blocks.StructBlock([('item_label', wagtail.core.blocks.CharBlock(required=False)), ('item_icon', wagtail.core.blocks.ChoiceBlock(choices=[('email', 'Email'), ('fax', 'Fax'), ('hand', 'Hand delivery'), ('phone', 'Phone'), ('mail', 'Mail'), ('github', 'Github'), ('question-bubble', 'Question')])), ('item_info', wagtail.core.blocks.RichTextBlock(required=True))])))]))], blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='tipsfortreasurerspage',
            name='body',
            field=wagtail.core.fields.StreamField([('heading', wagtail.core.blocks.CharBlock(classname='full title')), ('paragraph', wagtail.core.blocks.RichTextBlock()), ('html', wagtail.core.blocks.RawHTMLBlock()), ('image', wagtail.images.blocks.ImageChooserBlock()), ('table', wagtail.contrib.table_block.blocks.TableBlock()), ('custom_table', wagtail.core.blocks.StructBlock([('custom_table', wagtail.core.blocks.StreamBlock([('title', wagtail.core.blocks.CharBlock(required=False)), ('table_intro', wagtail.core.blocks.RichTextBlock(required=False)), ('table', wagtail.contrib.table_block.blocks.TableBlock(table_options={'colHeaders': True, 'height': 108, 'language': 'en', 'rowHeaders': True, 'startCols': 6, 'startRows': 7})), ('footnote', wagtail.core.blocks.CharBlock(required=False))]))])), ('contact', wagtail.core.blocks.StructBlock([('label', wagtail.core.blocks.CharBlock(icon='title', required=False)), ('contact_items', wagtail.core.blocks.ListBlock(wagtail.core.blocks.StructBlock([('item_label', wagtail.core.blocks.CharBlock(required=False)), ('item_icon', wagtail.core.blocks.ChoiceBlock(choices=[('email', 'Email'), ('fax', 'Fax'), ('hand', 'Hand delivery'), ('phone', 'Phone'), ('mail', 'Mail'), ('github', 'Github'), ('question-bubble', 'Question')])), ('item_info', wagtail.core.blocks.RichTextBlock(required=True))])))]))], blank=True, null=True),
        ),
    ]