from django.urls import path
from .views import (edit_skills, edit_bio, edit_profile_picture, user_profile, user_data, delete_user,
                    is_user_active, is_admin,is_staff, set_user_is_staff, GetUsersBySkills, GetUserBlogs)
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('skills/', edit_skills, name="edit_skills"),
    path('bio/', edit_bio, name="edit_bio"),
    path('profile-picture/', edit_profile_picture, name="edit_profile_picture"),
    path('user-profile/<str:username>/', user_profile, name="user_profile"),
    path('is-user-active/<str:username>/', is_user_active, name="is_user_active"),
    path('user_data/', user_data, name="user_data"),
    path("is_admin/", is_admin, name="is_admin"),
    path("is_staff/", is_staff, name="is_staff"),
    path("set_user_is_staff/", set_user_is_staff, name="set_user_is_staff"),
    path('users-by-skills/<str:skill>/', csrf_exempt(GetUsersBySkills.as_view()), name="get_users_by_skills"),
    path('blogs/<str:username>/', csrf_exempt(GetUserBlogs.as_view()), name="get_user_blogs"),
    path('<str:id>/delete', delete_user, name="delete_user"),
]
