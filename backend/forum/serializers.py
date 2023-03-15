from django.contrib.auth import get_user_model
from rest_framework import serializers, exceptions
from .models import Blog, Comment, BlogTag
from users.serializers import UserSerializer

User = get_user_model()


class BlogTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogTag
        read_only_fields = ['slug']
        fields = ['id', 'name', 'slug']


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'content', 'date_created', 'date_modified']


class BlogSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)
    tags = BlogTagSerializer(many=True, required=False)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Blog
        read_only_fields = ['slug']
        fields = [
            'id', 'title', 'content', 'slug',  'date_created',
            'date_modified',
            'tags',
            'user',
            'comments',
            'views',
            'likes'
        ]

    def create(self, validated_data):
        user = User.objects.get(username=self.context['request'].user)
        validated_tags = validated_data.pop('tags')
        blog = Blog.objects.create(
            **validated_data,
            slug="...",
            user=user
        )
        for tag_data in validated_tags:
            tags = BlogTag.objects.filter(name=tag_data.get('name'))
            if not tags.exists():
                tag = BlogTag.objects.create(name=tag_data.get('name').strip().lower())
                blog.tags.add(tag)
            else:
                for tag in tags:
                    blog.tags.add(tag)
        blog.save()
        return blog

    def update(self, instance, validated_data):
        user = User.objects.get(username=self.context['request'].user)
        validated_tags = validated_data.pop('tags')

        if instance.user == user:
            for item in validated_data:
                if Blog._meta.get_field(item):
                    setattr(instance, item, validated_data.get(item))

            instance.tags.clear()

            for tag_data in validated_tags:
                tags = BlogTag.objects.filter(name=tag_data.get('name'))
                if not tags.exists():
                    tag = BlogTag.objects.create(name=tag_data.get('name').strip().lower())
                    instance.tags.add(tag)
                else:
                    for tag in tags:
                        instance.tags.add(tag)
            instance.save()
        else:
            raise exceptions.PermissionDenied()

        return instance


class TagBlogsSerializer(serializers.ModelSerializer):
    blogs = BlogSerializer(many=True, read_only=True)

    class Meta:
        model = BlogTag
        read_only_fields = ['slug']
        fields = ['id', 'name', 'blogs', 'slug']
