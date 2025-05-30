from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import * 

router = DefaultRouter()
router.register('register', RegisterViewset, basename='register')
router.register('login', LoginViewset, basename='login')
router.register('users', UserViewset, basename='users')
urlpatterns = router.urls

urlpatterns = [
    path('members/latest-id/', get_latest_member_id, name='get-latest-member-id'),
    path('members/create/', create_member, name='create-member'),
    path('members/search/<int:member_id>/', search_member_by_id),
    path('transactions/create/', create_transaction),
    path('members/info/', search_members_by_name_or_email),


]

# Include router-generated routes
urlpatterns += router.urls