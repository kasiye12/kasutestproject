from django.db import models

class Tag(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class News(models.Model):
    title = models.CharField(max_length=255)
    text = models.TextField()
    images = models.ImageField(upload_to='news_images/', blank=True, null=True)
    tags = models.ManyToManyField(Tag)
    views = models.PositiveIntegerField(default=0)
    likes = models.PositiveIntegerField(default=0)
    dislikes = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
