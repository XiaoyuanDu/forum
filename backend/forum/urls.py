from django.urls import path
from .views import (
    Blogs,
    BlogDetail,
    TagList,
    BlogsByTag,
    CommentOfBlog,
    CommentDetail,
    get_top_10_thumbs_blogs,
    get_top_10_thumbs_users,
    get_last_seven_days_data,
    delete_blog
)
from django.views.decorators.csrf import csrf_exempt
urlpatterns = [
    path('blogs/', csrf_exempt(Blogs.as_view()), name="blogs"),
    path('blogs/<str:slug>/', csrf_exempt(BlogDetail.as_view()), name="blogs_detail"),
    path('blogs/<int:id>/delete', csrf_exempt(delete_blog), name="delete_blog"),
    path('blogs/<str:slug>/comment/', csrf_exempt(CommentOfBlog.as_view()), name="comment_of_blog"),
    path('comments/<str:pk>/', csrf_exempt(CommentDetail.as_view()), name="comments_detail"),
    path('tags/', csrf_exempt(TagList.as_view()), name="tags"),
    path('tags/<str:slug>/', csrf_exempt(BlogsByTag.as_view()), name="blogs_by_tag"),
    path('statistics/get_last_seven_days_data', csrf_exempt(get_last_seven_days_data), name="get_last_seven_days_data"),
    path('statistics/get_top_10_thumbs_blogs', csrf_exempt(get_top_10_thumbs_blogs), name="get_top_10_thumbs_blogs"),
    path('statistics/get_top_10_thumbs_users', csrf_exempt(get_top_10_thumbs_users), name="get_top_10_thumbs_users")
]
