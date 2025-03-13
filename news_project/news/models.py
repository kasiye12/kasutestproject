from django.db import models

class Tag(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class News(models.Model):
    title = models.CharField(max_length=255)
    text = models.TextField()
    image = models.ImageField(upload_to='news_images/', null=True, blank=True)
    tags = models.ManyToManyField(Tag)
    views = models.IntegerField(default=0)

    def __str__(self):
        return self.title


class Like(models.Model):
    news = models.ForeignKey(News, related_name='likes', on_delete=models.CASCADE)
    user = models.CharField(max_length=100)  # You can integrate a user system for this

    def __str__(self):
        return f"{self.user} likes {self.news.title}"
