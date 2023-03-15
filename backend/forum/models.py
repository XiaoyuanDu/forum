from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model

from django.dispatch import receiver
from .utils import unique_slug_generator_by_name, unique_slug_generator_by_title
from django.db.models.signals import post_save

User = get_user_model()


class BlogTag(models.Model):
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=350, blank=True, null=True)

    def __str__(self):
        return self.name


class Blog(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='blogs', on_delete=models.CASCADE)
    title = models.CharField(max_length=300)
    content = models.TextField()
    slug = models.SlugField(max_length=500, blank=True, null=True)
    tags = models.ManyToManyField(BlogTag, related_name='blogs')
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    views = models.BigIntegerField(default=0)
    likes = models.BigIntegerField(default=0)

    class Meta:
        ordering = ('-date_created',)  # FIlter by Votes

    def save(self, *args, **kwargs):
        super().save()

    def __str__(self):
        return self.title


class Comment(models.Model):
    blog = models.ForeignKey(Blog, related_name="comments", on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="comments", on_delete=models.CASCADE)
    content = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-date_created',)  # FIlter by Votes

    def __str__(self):
        return self.blog.title


@receiver(post_save, sender=Blog)
def blog_slug_generator(sender, instance, created, **kwargs):
    if created:
        instance.slug = unique_slug_generator_by_title(instance)
        instance.save()


@receiver(post_save, sender=BlogTag)
def tag_slug_generator(sender, instance, created, **kwargs):
    if created:
        instance.slug = unique_slug_generator_by_name(instance)
        instance.save()
