from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('contact/submit/', views.contact_submit, name='contact_submit'),
    path('api/projects/', views.projects_featured_api, name='api_projects'),
    path('api/log-visit/', views.log_page_visit_api, name='api_log_visit'),
]