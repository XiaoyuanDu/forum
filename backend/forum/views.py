from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404, get_list_or_404
from django.contrib.auth import get_user_model
from rest_framework import generics, exceptions

from .models import Blog, Comment, BlogTag
from .serializers import BlogSerializer, TagBlogsSerializer, CommentSerializer
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Count, Sum
from rest_framework.decorators import api_view
from datetime import datetime, timedelta

User = get_user_model()


class Blogs(generics.ListCreateAPIView):
    queryset = Blog.objects.all().select_related('user').prefetch_related('tags')
    serializer_class = BlogSerializer
    permission_classes = []
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title', 'tags__name']
    ordering_fields = ['title', 'date_modified']


class BlogDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Blog.objects.all().select_related('user').prefetch_related('tags')
    serializer_class = BlogSerializer
    permission_classes = []
    lookup_field = 'slug'

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = User.objects.get(username=request.user)
        if instance.user == user:
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            raise exceptions.PermissionDenied()


class TagList(generics.ListAPIView):
    serializer_class = TagBlogsSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    permission_classes = []
    search_fields = ['name']

    def get_queryset(self):
        tags = BlogTag.objects.filter(blogs__isnull=False).annotate(count=Count('blogs')).order_by(
            '-count').prefetch_related('blogs')  # ? orders by no. of blogs
        return tags


class BlogsByTag(generics.ListAPIView):
    serializer_class = BlogSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title']
    ordering_fields = ['title', 'date_modified']
    permission_classes = []
    lookup_url_kwarg = 'slug'

    def get_queryset(self):
        slug = self.kwargs.get(self.lookup_url_kwarg)
        return get_list_or_404(Blog, tags__slug=slug)


class CommentOfBlog(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, slug):
        blog = get_object_or_404(Blog, slug=slug)
        user = User.objects.get(username=request.user.username)
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            Comment.objects.create(
                blog=blog,
                user=user,
                content=serializer.validated_data.get('content'),
            )
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentDetail(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        comment = get_object_or_404(Comment, id=pk)
        user = User.objects.get(username=request.user.username)
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            if comment.user == user:
                comment.content = serializer.validated_data.get('content')
                comment.save()
                return Response(status=status.HTTP_200_OK)
            else:
                raise exceptions.PermissionDenied()
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        comment = get_object_or_404(Comment, id=pk)
        user = User.objects.get(username=request.user.username)
        if comment.user == user:
            comment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            raise exceptions.PermissionDenied()


@api_view(['GET'])
def get_last_seven_days_data(request):
    last_7_days_new_blogs = Blog.objects.filter(date_created__gte=datetime.now()-timedelta(days=7)).count()
    last_7_days_new_comments = Comment.objects.filter(date_created__gte=datetime.now()-timedelta(days=7)).count()
    last_7_days_new_users = User.objects.filter(date_joined__gte=datetime.now()-timedelta(days=7)).count()

    return Response({
        'new_blogs_in_7_days': last_7_days_new_blogs,
        'new_comments_in_7_days': last_7_days_new_comments,
        'new_users_in_7_days': last_7_days_new_users
    })


@api_view(['GET'])
def get_top_10_thumbs_blogs(request):
    blogs = Blog.objects.order_by('-likes')[:10]

    return Response(BlogSerializer(blogs, many=True).data)


@api_view(['GET'])
def get_top_10_thumbs_users(request):
    users = User.objects.annotate(num_thumbs=Sum('blogs__likes')).annotate(
        num_blogs=Count('blogs')).order_by('-num_thumbs')[:10]

    return Response({
        "users": [
            {
                "name": user.username,
                "num_thumbs": user.num_thumbs if user.num_thumbs else 0,
                "num_blogs": user.num_blogs
            } for user in users
        ]
    })


@api_view(['DELETE'])
def delete_blog(request, id):
    Blog.objects.filter(id=id).delete()

    return Response()

