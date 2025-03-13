from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NewsViewSet, LikeViewSet

router = DefaultRouter()
router.register(r'news', NewsViewSet)
router.register(r'likes', LikeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
