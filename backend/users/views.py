from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404, get_list_or_404
from .serializers import (UserSkillsSerializer, UserProfilePictureSerializer,
                          UserBioSerializer, UserSerializer, IsUserActiveSerializer)
from django.contrib.auth import get_user_model
from rest_framework import generics
from forum.serializers import BlogSerializer
from forum.models import Blog
from django.db.models import Count, Sum

User = get_user_model()


@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_skills(request):
    user = User.objects.get(username=request.user.username)
    serializer = UserSkillsSerializer(data=request.data)

    if serializer.is_valid():
        user.profile.skills = serializer.validated_data.get('skills')
        user.profile.save()
        return Response(user.profile.skills, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_bio(request):
    user = User.objects.get(username=request.user.username)
    serializer = UserBioSerializer(data=request.data)
    if serializer.is_valid():
        user.profile.bio = serializer.validated_data.get('bio')
        user.profile.save()
        return Response({"bio": user.profile.bio}, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_profile_picture(request):
    user = User.objects.get(username=request.user.username)
    serializer = UserProfilePictureSerializer(data=request.data)

    if serializer.is_valid():
        user.profile.image = serializer.validated_data.get('image')
        user.profile.save()
        return Response({"image": user.profile.image.url}, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['GET'])
def user_profile(request, username):
    user = get_object_or_404(User, username=username)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data, status=status.HTTP_200_OK)


@csrf_exempt
@api_view(['GET'])
def is_user_active(request, username):
    user = get_object_or_404(User, username=username)
    serializer = IsUserActiveSerializer(user, many=False)
    return Response(serializer.data, status=status.HTTP_200_OK)


class GetUsersBySkills(generics.ListAPIView):
    serializer_class = UserSerializer
    lookup_url_kwarg = "skill"

    def get_queryset(self):
        skill = self.kwargs.get(self.lookup_url_kwarg)
        return User.objects.filter(profile__skills__icontains=skill).order_by('id')


class GetUserBlogs(generics.ListAPIView):
    serializer_class = BlogSerializer
    lookup_url_kwarg = "username"

    def get_queryset(self):
        username = self.kwargs.get(self.lookup_url_kwarg)
        return get_list_or_404(Blog, user__username=username)


@csrf_exempt
@api_view(['GET'])
def user_data(request):
    users = User.objects.annotate(num_thumbs=Sum('blogs__likes')).annotate(
        num_blogs=Count('blogs'))
    return Response({
        "users": [
            {
                "id": user.id,
                "name": user.username,
                "joined_date": user.date_joined,
                "num_thumbs": user.num_thumbs if user.num_thumbs else 0,
                "num_blogs": user.num_blogs,
                "is_staff": user.is_staff or user.is_superuser
            } for user in users
        ]
    })

@csrf_exempt
@api_view(['DELETE'])
def delete_user(request, id):
    User.objects.filter(id=id).delete()
    return Response()


@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def is_admin(request):
    user = User.objects.get(username=request.user.username)
    return Response({
        "is_admin": user.is_superuser
    }, status=status.HTTP_200_OK)

@csrf_exempt
@api_view(['GET'])
def is_staff(request):
    user = User.objects.get(username=request.user.username)
    return Response({
        "is_staff": user.is_superuser or user.is_staff
    }, status=status.HTTP_200_OK)

@csrf_exempt
@api_view(['PUT'])
def set_user_is_staff(request):
    username = request.data['username']
    is_staff = request.data['is_staff']
    user = User.objects.get(username=username)
    user.is_staff = is_staff
    user.save()
    return Response()


