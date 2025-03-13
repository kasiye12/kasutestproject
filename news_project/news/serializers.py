from rest_framework import serializers
from .models import News, Tag, Like


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']


class NewsSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True)
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = News
        fields = ['id', 'title', 'text', 'image', 'tags', 'likes_count', 'views']

    def get_likes_count(self, obj):
        return obj.likes.count()


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['news', 'user']
