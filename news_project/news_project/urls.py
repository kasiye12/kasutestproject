from django.contrib import admin
from django.urls import include, path  # ✅ Make sure 'include' is imported

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('news.urls')),  # ✅ Correct usage of include
]