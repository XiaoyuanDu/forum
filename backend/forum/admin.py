from django.contrib import admin
from .models import Blog, Comment, BlogTag
# Register your models here.


@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):

    list_display = [
        'title', 'date_created', 'date_modified'
    ]
    list_filter = [
        'tags'
    ]
    search_fields = [
        'title'
    ]


admin.site.register(Comment)
admin.site.register(BlogTag)
