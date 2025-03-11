from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import News
from .serializers import NewsSerializer

class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all()
    serializer_class = NewsSerializer

    def get_queryset(self):
        queryset = News.objects.all().order_by('-created_at')
        page_size = 3
        page = self.request.query_params.get('page', 1)
        return queryset[(int(page)-1)*page_size:int(page)*page_size]

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        news = self.get_object()
        news.likes += 1
        news.save()
        return Response({'likes': news.likes})

    @action(detail=True, methods=['post'])
    def dislike(self, request, pk=None):
        news = self.get_object()
        news.dislikes += 1
        news.save()
        return Response({'dislikes': news.dislikes})
