from rest_framework import viewsets
from rest_framework.response import Response
from .models import News, Like
from .serializers import NewsSerializer, LikeSerializer
from rest_framework.decorators import action

class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all()
    serializer_class = NewsSerializer

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        news_item = self.get_object()
        user = request.data.get('user')
        Like.objects.create(news=news_item, user=user)
        return Response({'likes_count': news_item.likes.count()})

    @action(detail=True, methods=['delete'])
    def dislike(self, request, pk=None):
        news_item = self.get_object()
        user = request.data.get('user')
        Like.objects.filter(news=news_item, user=user).delete()
        return Response({'likes_count': news_item.likes.count()})

class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
